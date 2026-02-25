---
globs: src/meridian/services/fhir.py
---

# FHIR Integration Instructions

## CRITICAL: Read-Only Access

**NEVER write to the EHR.** All FHIR access is `GET` only. No `POST`, `PUT`, `PATCH`, or `DELETE`.

## Data Model

- Patient demographics: cached in Cosmos DB
- Patient medications: **runtime-fetched from FHIR** via `fhir_id` — never stored in DB
- The `medications` field in patient list responses is always `[]`
- Use `/api/patients/{id}/medications` for live FHIR data

## Credential Chain

Detection is based on `IDENTITY_ENDPOINT` env var (NOT the client ID):
1. Azure: `ManagedIdentityCredential(client_id=AZURE_USER_ASSIGNED_IDENTITY_CLIENT_ID)`
2. Local dev: `AzureCliCredential()` (fallback)

Note: `AZURE_USER_ASSIGNED_IDENTITY_CLIENT_ID` is always set in `.env`, so detection must use `IDENTITY_ENDPOINT`.

## FHIR R4 Resources

- `Patient` — demographics lookup
- `MedicationRequest` — active medications
