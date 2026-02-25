---
name: hipaa-check
description: 'HIPAA compliance scan for Meridian code changes. Use after modifying code that handles patient data, transcripts, audio, or FHIR resources. Scans for PHI leaks, audio persistence, and compliance violations.'
---

# HIPAA Compliance Check

## Overview

Scan code changes for HIPAA/PHI compliance violations specific to the Meridian healthcare platform. Run this skill after any changes that touch patient data, transcripts, audio handling, or FHIR integration.

## Workflow

### 1. Scan for PHI in Logs/Print Statements

Search for patterns that might log protected health information:

```bash
# PHI logging patterns to flag
grep -rn "logging.*patient.*name" src/
grep -rn "print.*ssn\|print.*mrn" src/
grep -rn 'f".*{patient' src/
grep -rn "logger.*first_name\|logger.*last_name\|logger.*date_of_birth" src/
```

**Violation**: Any log statement that includes patient names, SSNs, MRNs, dates of birth, or medical record numbers.

**Fix**: Log only anonymized identifiers (UUIDs), never PII fields.

### 2. Check for Audio File Persistence

```bash
# Audio persistence patterns to flag
grep -rn "open.*\.\(wav\|mp3\|ogg\|flac\|aac\|m4a\)" src/ frontend/
grep -rn "blob.*upload.*audio\|storage.*audio" src/
grep -rn "write.*audio\|save.*audio\|persist.*audio" src/
```

**Rule**: Audio is NEVER persisted. Transcripts only. This is a HIPAA hard requirement.

### 3. Verify Hard Deletes (Not Soft Deletes)

```bash
# Check transcript deletion is hard delete
grep -rn "soft.delete\|is_deleted\|deleted_at" src/meridian/
```

**Rule**: Transcript deletion must be a hard delete with audit logging. No soft deletes.

### 4. Check Audit Trail Immutability

```bash
# Audit logs must be append-only
grep -rn "update.*audit\|delete.*audit\|modify.*audit" src/meridian/
```

**Rule**: Audit logs are immutable (append-only). No updates or deletes to audit records.

### 5. Scan Test Data for Real PHI Patterns

```bash
# Check for realistic-looking SSNs, MRNs, phone numbers in test data
grep -rn "[0-9]\{3\}-[0-9]\{2\}-[0-9]\{4\}" tests/    # SSN pattern
grep -rn "MRN[0-9]\{6,\}" tests/                        # MRN pattern
```

**Rule**: Test data must use obviously synthetic values (Jane Doe, John Smith, 000-00-0000).

### 6. Verify FHIR Read-Only

```bash
# FHIR must be read-only
grep -rn "POST.*fhir\|PUT.*fhir\|PATCH.*fhir\|DELETE.*fhir" src/
grep -rn "write.*fhir\|create.*fhir\|update.*fhir" src/meridian/services/fhir.py
```

**Rule**: FHIR data is read-only. Never write back to the EHR.

### 7. Check Client-Side PHI Handling

```bash
# Frontend PHI leaks
grep -rn "localStorage\|sessionStorage" frontend/src/
grep -rn "console.log.*patient\|console.log.*name" frontend/src/
```

**Rule**: No PHI in client-side storage or console output.

## Common Violations & Fixes

| Violation | Example | Fix |
|-----------|---------|-----|
| PHI in logs | `logger.info(f"Processing {patient.name}")` | `logger.info(f"Processing patient {patient.id}")` |
| Audio persist | `with open("call.wav", "wb") as f:` | Remove — audio never persisted |
| Soft delete | `transcript.is_deleted = True` | `await container.delete_item(item=id, ...)` |
| FHIR write | `await fhir_client.post(...)` | Read-only: `await fhir_client.get(...)` |
| Test PHI | `ssn="123-45-6789"` | `ssn="000-00-0000"` |

## Checklist

- [ ] No PHI in log statements (patient names, SSN, MRN, DOB)
- [ ] No audio file persistence (wav, mp3, ogg, etc.)
- [ ] Transcript deletion is hard delete with audit log
- [ ] Audit logs are append-only (no updates/deletes)
- [ ] Test data uses synthetic PHI only
- [ ] FHIR access is read-only
- [ ] No PHI in client-side storage or console
