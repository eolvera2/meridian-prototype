---
name: maf-develop
description: 'MAF agent development workflow for Meridian. Use when writing or modifying Microsoft Agent Framework agents (NurseAgent, PatientFactsAgent, SummarizationAgent), tool functions, or agent credentials.'
---

# MAF Agent Development

## Overview

Workflow for developing and maintaining Microsoft Agent Framework (MAF) agents in the Meridian healthcare platform. Three agents exist in `src/meridian/agents/`, each with distinct patterns.

## ⚠️ Always Fetch Docs First

MAF is a **high-churn pre-release SDK**. Before writing any agent code:

1. Check `.github/docs-references.yml` for the current docs URL
2. Fetch `https://learn.microsoft.com/en-us/azure/ai-services/agents/`
3. Verify `AsyncAgentsClient` API surface, `create_thread_and_process_run` signature, `AsyncFunctionTool` registration

## Agent Patterns

| Agent | Class | Pattern | Key Detail |
|-------|-------|---------|------------|
| **NurseAgent** | `nurse.py` | Config-only | Returns config dict for Voice Live. Does NOT use `create_thread_and_process_run`. |
| **PatientFactsAgent** | `patient_facts.py` | Thread+Run | Sends transcript via `create_thread_and_process_run`, parses JSON. Registers `AsyncFunctionTool`s. |
| **SummarizationAgent** | `summarization.py` | Thread+Run | Same thread/run pattern, no tools. Plain-text output. |

## Workflow

### 1. Identify the Pattern

- **Config-only** (NurseAgent): Returns `{instructions, tools, tool_choice, temperature}`. Voice Live manages the conversation.
- **Thread+Run** (PatientFacts, Summarization): Creates thread, sends message, processes run, parses response, deletes thread.

### 2. Follow the Tool Function Contract

Tool functions in `agents/tools.py` must:

```python
# ✅ Correct: simple types in/out, return JSON, never raise
async def verify_medication(patient_id: str, medication_name: str) -> str:
    try:
        result = await _do_verification(patient_id, medication_name)
        return json.dumps({"verified": True, "details": result})
    except Exception as e:
        return json.dumps({"error": str(e), "verified": False})

# ❌ Wrong: complex types, raises, returns non-JSON
async def verify_medication(patient: Patient) -> dict:
    result = await _do_verification(patient)  # Will raise on failure
    return result  # Not a JSON string
```

### 3. Client Lifecycle

```python
# ✅ Create per-call with async with — not persistent
async with AsyncAgentsClient(...) as client:
    run = await client.create_thread_and_process_run(...)
    # ... process response ...
    await client.threads.delete(run.thread_id)  # Always clean up
```

### 4. Credential Management

```python
from meridian.agents.credentials import get_credential
# Returns cached ManagedIdentityCredential (Azure) or AzureCliCredential (local dev)
credential = get_credential()
```

### 5. Agent ID Configuration

- Agent IDs come from settings: `NURSE_AGENT_ID`, `PATIENT_FACTS_AGENT_ID`, `SUMMARIZATION_AGENT_ID`
- Agents raise `RuntimeError` if their ID isn't configured
- IDs reference pre-provisioned agents in Azure AI Foundry

### 6. Prompt Fallback

NurseAgent falls back to local prompt files in `src/meridian/prompts/{agent-name}/system-prompt.md` when Foundry is unreachable.

## Checklist

- [ ] Identified correct pattern (config-only vs thread+run)
- [ ] Tool functions accept/return simple types
- [ ] Tool functions return JSON strings
- [ ] Tool functions never raise (return error JSON instead)
- [ ] `AsyncAgentsClient` created per-call with `async with`
- [ ] Threads deleted after thread+run
- [ ] Agent ID configured in settings
- [ ] Credentials via `get_credential()`
- [ ] Fetched current MAF docs before writing code
