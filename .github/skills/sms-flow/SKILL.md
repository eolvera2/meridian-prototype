---
name: sms-flow
description: 'ACS SMS notification workflow for Meridian. Use when implementing SMS notifications for appointment reminders, medication follow-ups, or post-call summaries via Azure Communication Services.'
---

# ACS SMS Notification Flow

## Overview

Implement SMS notification flows for the Meridian patient outreach system using Azure Communication Services SMS. Covers appointment reminders, medication follow-ups, and post-call summaries.

## Prerequisites

- ACS resource with SMS capability (see `infra/modules/acs.bicep`)
- Phone number enabled for SMS (toll-free or short code)
- Patient consent for SMS notifications

## Workflow

### 1. Configure SmsClient

```python
from azure.communication.sms import SmsClient
from meridian.agents.credentials import get_credential

credential = get_credential()
sms_client = SmsClient(
    endpoint=settings.acs_endpoint,
    credential=credential,
)
```

### 2. Design Message Templates

| Template | Trigger | Example |
|----------|---------|---------|
| **Appointment Reminder** | Scheduled job | "Hi {name}, this is a reminder about your appointment on {date} at {time}. Reply STOP to opt out." |
| **Medication Follow-up** | Post-call | "Hi {name}, your nurse asked us to remind you about your {medication}. Please contact your provider if you have questions." |
| **Post-call Summary** | After voice call | "Hi {name}, thank you for speaking with us today. A summary has been sent to your provider." |
| **Missed Call** | Unanswered outbound | "Hi {name}, we tried reaching you today. Please call us back at {number} at your convenience." |

**Template rules:**
- Include opt-out instruction: "Reply STOP to opt out"
- No PHI beyond first name — no diagnosis, medications, or conditions
- Keep under 160 characters when possible (single SMS segment)
- Professional, warm, healthcare-appropriate tone

### 3. Send SMS

```python
responses = sms_client.send(
    from_=settings.acs_sms_phone_number,
    to=patient_phone,
    message=rendered_template,
    enable_delivery_report=True,
    tag="appointment-reminder",  # For tracking
)

# Check delivery status
for response in responses:
    if response.successful:
        logger.info(f"SMS sent to {response.to}, message_id={response.message_id}")
    else:
        logger.error(f"SMS failed to {response.to}: {response.error_message}")
```

### 4. Delivery Status Tracking

| Status | Meaning | Action |
|--------|---------|--------|
| `Delivered` | SMS received by handset | Log success |
| `Failed` | Delivery failed | Log error, retry logic |
| `Expired` | TTL exceeded | Log, consider alternative contact |

### 5. Consent Management

**TCPA/HIPAA requirements:**
- Patient must opt-in to SMS notifications
- Every message must include opt-out instructions
- Honor STOP requests immediately
- Track consent status in patient record
- Log all consent changes for audit trail

```python
# Check consent before sending
patient = await repo.get_patient(patient_id)
if not patient.get("sms_consent"):
    logger.info(f"Patient {patient_id} has not consented to SMS")
    return
```

### 6. Wire to Reminder Service

Connect SMS to the existing job/reminder infrastructure:

```python
# In a scheduled job or post-call handler
async def send_appointment_reminder(patient_id: str, appointment_date: str):
    patient = await repo.get_patient(patient_id)
    if not patient.get("sms_consent"):
        return
    
    contacts = await repo.list_contacts(patient_id)
    phone = next((c["phone"] for c in contacts if c["type"] == "mobile"), None)
    if not phone:
        return
    
    message = render_template("appointment_reminder", name=patient["first_name"], date=appointment_date)
    await send_sms(phone, message)
```

## Checklist

- [ ] ACS resource has SMS capability
- [ ] Phone number enabled for SMS sending
- [ ] SmsClient configured with correct credentials
- [ ] Message templates designed (under 160 chars, opt-out included)
- [ ] No PHI beyond first name in SMS messages
- [ ] Delivery reporting enabled
- [ ] Consent checked before every send
- [ ] STOP/opt-out handling implemented
- [ ] Audit trail for consent changes
- [ ] Error handling for delivery failures
- [ ] Integrated with reminder/job service
