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

Every response MUST follow this exact structure:
1. Confirm what the user just provided in plain prose (one sentence).
2. Then IMMEDIATELY follow with exactly what the "NEXT ACTION" directive says below — either ask that question or declare the document complete.
Never produce a message that only confirms without doing step 2.

STRICT message rules:
- The "message" key is REQUIRED and must come first in your JSON.
- Write at most 2 sentences total (confirmation + the directed next action). Never end with a colon.
- No lists, no bullet points, no markdown, no newlines in the message.
- If the user provides a value in the wrong format (e.g. a date not in YYYY-MM-DD), politely correct and re-ask that same field.
- When no prior messages exist, greet the user and ask the NEXT ACTION question.

Field population rules — CRITICAL:
- Set a field to non-null ONLY if the user explicitly stated it in their LATEST message.
- Return null for every other field; the system preserves existing values automatically.
- For party1/party2: only populate sub-fields the user explicitly mentioned this turn; set all others to null.
- Never return a party object where every sub-field is null — use null for the whole party instead.
- If the user says "no modifications" or "none", set modifications to "None." so the field is non-empty."""


def _unfilled_fields(fields: dict) -> list[str]:
    """Return descriptions of all unfilled required fields in conversation order."""
    p1 = fields.get("party1") or {}
    p2 = fields.get("party2") or {}
    checks = [
        (fields.get("purpose"), "purpose — why confidential information is being shared"),
        (fields.get("effectiveDate"), "effectiveDate — start date in YYYY-MM-DD format"),
        (fields.get("mndaTerm"), "mndaTerm — duration ('1'=1 yr, '2'=2 yrs, '3'=3 yrs, 'indefinite'=until terminated)"),
        (fields.get("termOfConfidentiality"), "termOfConfidentiality — protection period ('1'=1 yr, '2'=2 yrs, '3'=3 yrs, 'perpetual'=forever)"),
        (fields.get("governingLaw"), "governingLaw — US state governing the agreement"),
        (fields.get("jurisdiction"), "jurisdiction — city/county for legal disputes"),
        (fields.get("modifications"), "modifications — any custom changes (user may say 'none')"),
        (p1.get("printName"), "party1.printName — full legal name of Party 1's signatory"),
        (p1.get("title"), "party1.title — job title of Party 1's signatory"),
        (p1.get("company"), "party1.company — legal entity name of Party 1"),
        (p1.get("noticeAddress"), "party1.noticeAddress — contact address for Party 1"),
        (p1.get("date"), "party1.date — signing date for Party 1 in YYYY-MM-DD"),
        (p2.get("printName"), "party2.printName — full legal name of Party 2's signatory"),
        (p2.get("title"), "party2.title — job title of Party 2's signatory"),
        (p2.get("company"), "party2.company — legal entity name of Party 2"),
        (p2.get("noticeAddress"), "party2.noticeAddress — contact address for Party 2"),
        (p2.get("date"), "party2.date — signing date for Party 2 in YYYY-MM-DD"),
    ]
    return [desc for value, desc in checks if not value]


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

    unfilled = _unfilled_fields(request.current_fields)
    is_initial = len(request.messages) == 0

    if is_initial:
        # No user message yet — greet and ask about the first missing field.
        directive = (
            f"\n\nNEXT ACTION: Greet the user warmly and ask for: {unfilled[0]}"
            if unfilled else
            "\n\nNEXT ACTION: Greet the user and tell them their NDA is already complete."
        )
    elif not unfilled:
        # Every field was already filled before this turn.
        directive = "\n\nNEXT ACTION: The document was already complete — confirm and tell the user to click \"Download PDF\"."
    elif len(unfilled) == 1:
        # The user's message is providing the last required field.
        directive = (
            f"\n\nThe user's message is providing: {unfilled[0]}\n"
            f"NEXT ACTION: Confirm their answer and tell them the NDA is now complete — they can click \"Download PDF\"."
        )
    else:
        # The user's message is providing unfilled[0]; ask about unfilled[1] next.
        directive = (
            f"\n\nThe user's message is providing: {unfilled[0]}\n"
            f"NEXT ACTION: Confirm their answer and then ask for: {unfilled[1]}"
        )

    context = (
        f"\n\nCurrent document state (empty string or null means unfilled):\n"
        f"{json.dumps(request.current_fields, indent=2)}"
        f"{directive}"
    )

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
