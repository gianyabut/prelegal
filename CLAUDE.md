# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The current implementation has the Mutual NDA creator with AI chat + live preview + PDF print. A fake login page and dashboard scaffold are in place; real auth and document persistence are not yet implemented.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project should be packaged into a Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/  
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in.  
The frontend and backend run as separate Docker services via docker-compose (frontend on port 3000, backend on port 8000).  
There should be scripts in scripts/ for:  
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Implementation Status

### Done
- **PREL-3** — Mutual NDA creator: live preview, PDF print (`frontend/app/create/`)
- **PREL-4** — V1 technical foundation:
  - `backend/` — FastAPI/uv, SQLite DB with users table schema, `/api/health`, CORS
  - `docker-compose.yml` — frontend :3000 + backend :8000, `NEXT_PUBLIC_API_URL` as build arg
  - `frontend/Dockerfile` — multi-stage standalone build
  - `frontend/app/page.tsx` — fake login page (no auth, redirects to `/dashboard`)
  - `frontend/app/dashboard/` — dashboard showing all 12 catalog document types; only Mutual NDA active
  - `scripts/` — start/stop for Mac, Linux, Windows
- **PREL-5** — AI chat for Mutual NDA:
  - `backend/chat.py` — `POST /api/chat`; LiteLLM/OpenRouter/Cerebras (`gpt-oss-120b`), Pydantic structured output (`NDAFieldsUpdate`), async `acompletion`, per-request directive injection via `_unfilled_fields()` so the AI always asks the next required field
  - `frontend/components/nda-chat.tsx` — chat UI replacing the form panel: message list, typing indicator, enter-to-send, null-safe party field merge
  - `frontend/app/create/page.tsx` — left panel is now `<NDAChat>`; `handleFieldsUpdate` deep-merges partial party objects
  - `backend/tests/test_chat.py` — 6 integration tests (mocked LiteLLM)

### Not yet implemented
- Real authentication (sign up / sign in against the users table)
- Document persistence
- AI chat and document support for the 11 remaining document types beyond Mutual NDA