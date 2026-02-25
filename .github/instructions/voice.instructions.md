---
globs: src/meridian/services/voice_live.py
---

# Voice Live Instructions

## HIPAA — Audio NEVER Persisted

Audio data must NEVER be written to disk, blob storage, or any persistent medium. Transcripts only.

## Architecture

- Voice Live SDK: `RequestSession`, `ServerEvent*`, `FunctionTool`
- NurseAgent is **config-only** — returns config dict, Voice Live manages the conversation loop
- Tool calls from voice sessions dispatch to the same functions in `agents/tools.py`
- WebSocket proxy between React frontend and Azure Voice Live

## Performance

This is a **real-time audio path**. Keep latency low:
- All operations must be async
- No blocking I/O in the WebSocket handler
- Tool functions must complete quickly (voice pauses while waiting)

## Error Handling

- Graceful WebSocket disconnect on error
- Handle `SessionError` events from Voice Live
- Log errors without including audio data or PHI
- Reconnection patterns for transient failures
