---
name: acs-outbound
description: 'ACS outbound call setup workflow for Meridian. Use when configuring PSTN outbound calls via Azure Communication Services Call Automation, wiring to NurseAgent, and testing call flows.'
---

# ACS Outbound Call Setup

## Overview

Configure and test outbound PSTN calls via Azure Communication Services (ACS) Call Automation for the Meridian patient outreach system.

## Prerequisites

- ACS resource provisioned (see `infra/modules/acs.bicep`)
- Phone number purchased and assigned to ACS resource
- Callback endpoint accessible from Azure (public URL or Azure-hosted)

## Workflow

### 1. Verify ACS Resource + Phone Number

```python
from azure.communication.callautomation import CallAutomationClient

# Check ACS connectivity
client = CallAutomationClient(endpoint, credential)
# Verify phone number is available for outbound
```

### 2. Configure CallAutomationClient

```python
from azure.communication.callautomation import CallAutomationClient
from meridian.agents.credentials import get_credential

credential = get_credential()
client = CallAutomationClient(
    endpoint=settings.acs_endpoint,
    credential=credential,
)
```

### 3. Set Up Callback Events

ACS Call Automation uses webhook callbacks for call events:

| Event | When | Handler Action |
|-------|------|---------------|
| `CallConnected` | Call answered | Initialize Voice Live session with NurseAgent |
| `PlayCompleted` | Audio playback finished | Continue conversation or end call |
| `PlayFailed` | Audio playback error | Log error, retry or end call |
| `RecognizeCompleted` | Speech recognition done | Process recognized text |
| `RecognizeFailed` | Recognition error | Retry with different settings |
| `CallDisconnected` | Call ended | Clean up resources, save transcript |
| `CallTransferAccepted` | Transfer accepted | Log transfer success |
| `CallTransferFailed` | Transfer failed | Handle fallback |

```python
# Callback URL pattern
callback_url = f"{settings.base_url}/api/calls/events"

# Create outbound call
result = await client.create_call(
    target_participant=PhoneNumberIdentifier(patient_phone),
    source_caller_id_number=PhoneNumberIdentifier(settings.acs_phone_number),
    callback_url=callback_url,
)
```

### 4. Wire to NurseAgent

When `CallConnected` fires:
1. Get NurseAgent config: `config = await nurse_agent.get_config(patient_context)`
2. Initialize Voice Live session with the config
3. Bridge ACS audio stream ↔ Voice Live WebSocket

### 5. Test with Mock PSTN Endpoint

For development/testing without real phone calls:
- Use ACS Direct Routing with a test SIP trunk
- Or use the ACS Call Automation test framework
- Or mock the CallAutomationClient in integration tests

```python
# Mock test pattern
mock_client = AsyncMock(spec=CallAutomationClient)
mock_client.create_call.return_value = MockCallResult(call_connection_id="test-123")
```

## ⚠️ Always Fetch Docs First

ACS Call Automation is a **medium-churn** SDK. Fetch docs before implementing:
- `https://learn.microsoft.com/en-us/azure/communication-services/concepts/call-automation/call-automation`

## Checklist

- [ ] ACS resource provisioned and accessible
- [ ] Phone number purchased and configured
- [ ] CallAutomationClient initialized with correct credentials
- [ ] Callback URL configured and accessible from Azure
- [ ] All call events handled (Connected, Disconnected, Play*, Recognize*)
- [ ] NurseAgent config wired to CallConnected handler
- [ ] Voice Live session bridged to ACS audio stream
- [ ] Error handling for call failures (busy, no answer, network error)
- [ ] No audio persisted (HIPAA)
- [ ] Transcript saved after call ends (hard delete capability)
