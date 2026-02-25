---
name: voice-debug
description: 'Debug Voice Live WebSocket sessions and ACS call flows for Meridian. Use when diagnosing voice call issues: WebSocket errors, NurseAgent config problems, tool dispatch failures, or ACS call automation events.'
---

# Voice Call Debugging

## Overview

Systematic debugging workflow for Meridian's voice call pipeline: React → FastAPI WebSocket → Voice Live → NurseAgent → Tool Dispatch → ACS Call Automation.

## Diagnostic Workflow

### 1. Check NurseAgent Config Output

```python
# The NurseAgent returns a config dict — verify it has all required fields
config = await nurse_agent.get_config(patient_context)
assert "instructions" in config
assert "tools" in config
assert "tool_choice" in config
assert "temperature" in config
```

Common issues:
- Missing `NURSE_AGENT_ID` in settings → `RuntimeError`
- Foundry unreachable → should fall back to local prompt in `src/meridian/prompts/nurse-agent/`
- Invalid tool schemas → Voice Live rejects the session

### 2. Verify Voice Live Session Setup

Check the session initialization in `services/voice_live.py`:

```python
# Expected session flow:
# 1. WebSocket connection from client
# 2. Create RequestSession with NurseAgent config
# 3. Voice Live manages conversation loop
# 4. Tool calls dispatched to agents/tools.py
```

Common issues:
- WebSocket connection drops immediately → check CORS, upgrade headers
- Session creation fails → check Azure OpenAI Realtime endpoint + credentials
- Audio format mismatch → verify sample rate, encoding, channels

### 3. Trace WebSocket Event Sequence

Expected event flow:

```
Client → Server: WebSocket upgrade
Server → Voice Live: RequestSession (with NurseAgent config)
Voice Live → Server: SessionCreated
Client → Server: Audio chunks (binary frames)
Server → Voice Live: Forward audio
Voice Live → Server: TranscriptionUpdate / ResponseDelta / ToolCall
Server → Client: Forward events
```

If events stop flowing, check:
- Is the WebSocket still open? (check connection state)
- Is Voice Live responding? (check for SessionError events)
- Are tool calls completing? (check tool function execution time)

### 4. Check Tool Dispatch

Tool calls from voice sessions route to `agents/tools.py`:

```python
# Tool functions must:
# - Accept simple types (str, int) only
# - Return JSON strings
# - Never raise exceptions
# - Complete quickly (voice is real-time)

# If a tool call hangs, the voice session stalls
```

Common issues:
- Tool function raises exception → voice session breaks
- Tool function takes too long → audio playback pauses
- Tool returns non-JSON → Voice Live can't parse response

### 5. Inspect ACS Call Automation Events

For PSTN outbound calls via ACS:

| Event | Meaning | Common Issue |
|-------|---------|-------------|
| `CallConnected` | Call established | Not received → phone number config, SIP trunk |
| `PlayCompleted` | Audio playback done | Not received → audio format, TTS config |
| `RecognizeCompleted` | Speech recognized | Not received → recognition settings, silence timeout |
| `CallDisconnected` | Call ended | Unexpected → check disconnect reason code |
| `PlayFailed` | Audio playback error | Check audio source, format, accessibility |

### 6. Check Credential Chain

```python
# Voice Live needs Azure OpenAI Realtime credentials
# ACS needs ACS connection string or managed identity
# Both use get_credential() → ManagedIdentityCredential or AzureCliCredential

# Common issue: AZURE_USER_ASSIGNED_IDENTITY_CLIENT_ID is set in .env
# but IDENTITY_ENDPOINT is not (local dev) → should use AzureCliCredential
```

## Quick Diagnostic Checklist

- [ ] `NURSE_AGENT_ID` configured in settings?
- [ ] Azure OpenAI Realtime endpoint reachable?
- [ ] Credentials valid? (`get_credential()` returns usable credential?)
- [ ] WebSocket connection established?
- [ ] Voice Live session created (SessionCreated event)?
- [ ] Audio flowing in both directions?
- [ ] Tool calls completing without exceptions?
- [ ] Tool functions returning JSON strings?
- [ ] ACS phone number configured (for PSTN)?
- [ ] No audio being persisted to disk or blob?
