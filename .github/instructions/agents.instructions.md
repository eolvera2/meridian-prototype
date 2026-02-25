---
globs: src/meridian/agents/**
---

# Agent Development Instructions

## Tool Function Contract

All tool functions in `agents/tools.py` MUST:
- Accept only simple types (`str`, `int`, `float`, `bool`) as parameters
- Return JSON strings (not dicts, not Pydantic models)
- **Never raise exceptions** — catch all errors and return error JSON instead
- Complete quickly — voice sessions are real-time

```python
# ✅ Correct
async def verify_medication(patient_id: str, medication_name: str) -> str:
    try:
        result = await _do_work(patient_id, medication_name)
        return json.dumps({"verified": True, "details": result})
    except Exception as e:
        return json.dumps({"error": str(e), "verified": False})
```

## Client Lifecycle

- Create `AsyncAgentsClient` per-call with `async with` (not persistent)
- Always delete threads after thread+run: `await client.threads.delete(run.thread_id)`
- Agent IDs come from settings; raise `RuntimeError` if not configured

## Credentials

Use `get_credential()` from `agents/credentials.py`:
- Azure: `ManagedIdentityCredential` (detected via `IDENTITY_ENDPOINT` env var)
- Local dev: `AzureCliCredential` (fallback)

## Agent Patterns

- **Config-only** (NurseAgent): Returns dict `{instructions, tools, tool_choice, temperature}`. Voice Live manages conversation.
- **Thread+Run** (PatientFacts, Summarization): `create_thread_and_process_run` → parse response → delete thread.
