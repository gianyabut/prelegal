import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

import database
from main import app


@pytest.fixture
async def client(tmp_path, monkeypatch):
    monkeypatch.setattr(database, "DATABASE_PATH", str(tmp_path / "test.db"))
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.fixture(autouse=True)
def set_api_key(monkeypatch):
    monkeypatch.setenv("OPENROUTER_API_KEY", "test-key")


def _mock_completion(response_dict: dict) -> MagicMock:
    mock = AsyncMock()
    mock.choices = [MagicMock()]
    mock.choices[0].message.content = json.dumps(response_dict)
    return mock


def _ai_resp(**overrides) -> dict:
    base: dict = {k: None for k in (
        "purpose", "effectiveDate", "mndaTerm", "termOfConfidentiality",
        "governingLaw", "jurisdiction", "modifications", "party1", "party2",
    )}
    base["message"] = "Assistant reply."
    return {**base, **overrides}


async def test_chat_initial_greeting(client):
    greeting = "Hello! I can help you draft a Mutual NDA. What is the purpose of this agreement?"
    with patch("chat.acompletion", return_value=_mock_completion(_ai_resp(message=greeting))):
        response = await client.post("/api/chat", json={"messages": [], "current_fields": {}})
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == greeting
    assert data["purpose"] is None


async def test_chat_populates_purpose(client):
    with patch("chat.acompletion", return_value=_mock_completion(
        _ai_resp(message="Got it! What effective date should the NDA use?", purpose="Evaluating a partnership")
    )):
        response = await client.post("/api/chat", json={
            "messages": [{"role": "user", "content": "We're evaluating a partnership"}],
            "current_fields": {"purpose": "", "effectiveDate": "", "mndaTerm": "1", "termOfConfidentiality": "1", "governingLaw": "", "jurisdiction": "", "modifications": "", "party1": {}, "party2": {}},
        })
    assert response.status_code == 200
    data = response.json()
    assert data["purpose"] == "Evaluating a partnership"
    assert data["effectiveDate"] is None


async def test_chat_populates_party_info(client):
    with patch("chat.acompletion", return_value=_mock_completion(_ai_resp(
        message="Great! I've noted Party 1. What about Party 2?",
        party1={"printName": "Jane Doe", "title": "CEO", "company": "Acme Corp", "noticeAddress": "jane@acme.com", "date": "2026-05-29"},
    ))):
        response = await client.post("/api/chat", json={
            "messages": [{"role": "user", "content": "Party 1 is Jane Doe, CEO of Acme Corp"}],
            "current_fields": {},
        })
    assert response.status_code == 200
    data = response.json()
    assert data["party1"]["printName"] == "Jane Doe"
    assert data["party1"]["company"] == "Acme Corp"


async def test_chat_missing_api_key(client, monkeypatch):
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    response = await client.post("/api/chat", json={"messages": [], "current_fields": {}})
    assert response.status_code == 500
    assert "OPENROUTER_API_KEY" in response.json()["detail"]


async def test_chat_validates_mnda_term_literal(client):
    with patch("chat.acompletion", return_value=_mock_completion(_ai_resp(message="Set to 2 years.", mndaTerm="2"))):
        response = await client.post("/api/chat", json={"messages": [], "current_fields": {}})
    assert response.status_code == 200
    assert response.json()["mndaTerm"] == "2"


async def test_chat_conversation_history_forwarded(client):
    captured: list[dict] = []

    async def capturing_completion(*args, **kwargs):
        captured.extend(kwargs.get("messages", []))
        return _mock_completion(_ai_resp())

    with patch("chat.acompletion", side_effect=capturing_completion):
        await client.post("/api/chat", json={
            "messages": [
                {"role": "user", "content": "Evaluating a deal"},
                {"role": "assistant", "content": "Got it, what date?"},
            ],
            "current_fields": {},
        })

    roles = [m["role"] for m in captured]
    assert "system" in roles
    assert roles.count("user") == 1
    assert roles.count("assistant") == 1
