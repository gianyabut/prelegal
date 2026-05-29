import json
import os
from typing import Literal, Optional

from fastapi import APIRouter, HTTPException
from litellm import acompletion
from pydantic import BaseModel, ValidationError

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

router = APIRouter()

SYSTEM_PROMPT = """You are an AI legal assistant helping users draft a Mutual Non-Disclosure Agreement (NDA).

Your goal is to collect all necessary information through natural conversation, then populate the NDA fields.

Fields to collect:
- purpose: Why confidential information is being shared (e.g., "Evaluating a potential acquisition")
- effectiveDate: When the agreement starts (YYYY-MM-DD format)
- mndaTerm: Duration of the agreement — use '1', '2', or '3' for years, or 'indefinite' for "until terminated"
- termOfConfidentiality: How long information stays protected — use '1', '2', or '3' for years, or 'perpetual' for "forever"
- governingLaw: US state governing the agreement (e.g., "Delaware")
- jurisdiction: City/county for legal disputes (e.g., "New Castle, DE")
- modifications: Any custom changes to standard terms (leave null if none)
- party1 and party2: Each needs printName (full legal name), title (job title), company (legal entity name), noticeAddress (email or postal address), date (signing date in YYYY-MM-DD)

STRICT response rules:
- Your JSON response MUST always include the "message" key. It is required and must come first.
- "message" must be ONE complete sentence or short paragraph. Never end with a colon.
- Ask exactly ONE question per message. Never list multiple questions or fields.
- Do NOT use bullet points, numbered lists, markdown, or newlines in the message.
- If multiple fields are still missing, ask about the single most important one only.
- Confirm extracted values in plain prose, then ask the next single question.
- When no prior messages exist, greet the user warmly and ask only about the purpose of the NDA.

Field rules — CRITICAL, follow exactly:
- Set a field to a non-null value ONLY if the user stated it explicitly in their LATEST message.
- For every field not mentioned in the latest message, return null — even if it appears in the current document state. The system preserves previously-set values automatically; you must NOT echo them back.
- For party1 and party2: if you set a party object, only include the sub-fields the user explicitly provided in this turn. Omit (set to null) every sub-field they did not mention.
- Never return a party object where every sub-field is null; return null for the whole party instead."""


class PartyInfoUpdate(BaseModel):
    printName: Optional[str] = None
    title: Optional[str] = None
    company: Optional[str] = None
    noticeAddress: Optional[str] = None
    date: Optional[str] = None


class NDAFieldsUpdate(BaseModel):
    message: str
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    mndaTerm: Optional[Literal["1", "2", "3", "indefinite"]] = None
    termOfConfidentiality: Optional[Literal["1", "2", "3", "perpetual"]] = None
    governingLaw: Optional[str] = None
    jurisdiction: Optional[str] = None
    modifications: Optional[str] = None
    party1: Optional[PartyInfoUpdate] = None
    party2: Optional[PartyInfoUpdate] = None


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    current_fields: dict


@router.post("/api/chat", response_model=NDAFieldsUpdate)
async def chat(request: ChatRequest) -> NDAFieldsUpdate:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    filled = {k: v for k, v in request.current_fields.items() if v}
    context = f"\n\nCurrent document state:\n{json.dumps(filled, indent=2) if filled else 'No fields filled yet'}"

    messages = [{"role": "system", "content": SYSTEM_PROMPT + context}]
    messages.extend({"role": m.role, "content": m.content} for m in request.messages)

    response = await acompletion(
        model=MODEL,
        messages=messages,
        response_format=NDAFieldsUpdate,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
        api_key=api_key,
    )

    raw_content = response.choices[0].message.content
    try:
        return NDAFieldsUpdate.model_validate_json(raw_content)
    except (ValidationError, ValueError):
        # If the AI returned valid JSON but forgot the required "message" field,
        # inject a default rather than returning an error.
        try:
            raw = json.loads(raw_content)
            if isinstance(raw, dict) and "message" not in raw:
                raw["message"] = "Got it, I've updated the document."
            return NDAFieldsUpdate.model_validate(raw)
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"AI returned unparseable response: {exc}")
