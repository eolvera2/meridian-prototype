---
name: fhir-integrate
description: 'FHIR integration workflow for Meridian. Use when working with Azure FHIR, patient medication data, or the FHIR client. Enforces read-only access and correct credential management.'
---

# FHIR Integration

## Overview

Meridian integrates with **Azure FHIR** (Health Data Services) for patient and medication data. FHIR is a **read-only data source** — the application never writes back to the EHR.

## Critical Rules

1. **NEVER write to the EHR** — all FHIR access is read-only (`GET` requests only)
2. **Medications are runtime-fetched** — they come from FHIR via `fhir_id`, never stored in Cosmos DB
3. **The `medications` field in patient list responses is always `[]`** — use `/api/patients/{id}/medications` for live FHIR data

## Workflow

### 1. Understand the Data Model

```
Patient demographics → Cosmos DB (cached)
Patient medications  → Azure FHIR (live, via fhir_id)
                       ↳ MedicationRequest resources
                       ↳ Fetched at runtime, never stored
```

### 2. Credential Fallback Chain

```python
# In src/meridian/services/fhir.py
# Detection based on IDENTITY_ENDPOINT env var

if IDENTITY_ENDPOINT is set:
    credential = ManagedIdentityCredential(client_id=AZURE_USER_ASSIGNED_IDENTITY_CLIENT_ID)
else:
    credential = AzureCliCredential()

# IMPORTANT: AZURE_USER_ASSIGNED_IDENTITY_CLIENT_ID is always set in .env
# So detection must use IDENTITY_ENDPOINT, not the client ID
```

### 3. FHIR R4 Resources

| Resource | Usage | Endpoint |
|----------|-------|----------|
| `Patient` | Demographics lookup | `GET /Patient?identifier={fhir_id}` |
| `MedicationRequest` | Active medications | `GET /MedicationRequest?patient={fhir_id}` |

### 4. Error Handling

- FHIR service may be unavailable — handle gracefully (return empty list, not 500)
- Credential failures should log clearly and fail fast
- Rate limiting — respect FHIR server throttling headers

## Key Files

- `src/meridian/services/fhir.py` — FHIR client implementation
- `src/meridian/api/routes/patients.py` — `/api/patients/{id}/medications` endpoint
- `src/meridian/core/config.py` — FHIR endpoint URL in settings

## Checklist

- [ ] All FHIR access is read-only (GET only)
- [ ] No medication data stored in Cosmos DB
- [ ] Credential chain: ManagedIdentityCredential → AzureCliCredential
- [ ] Detection uses IDENTITY_ENDPOINT (not client ID)
- [ ] Graceful error handling for FHIR unavailability
- [ ] PHI from FHIR responses not logged
