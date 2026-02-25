---
globs: infra/**
---

# Infrastructure Instructions

## Azure Verified Modules (AVM)

Use AVM from the public registry when available:
```bicep
module identity 'br/public:avm/res/managed-identity/user-assigned-identity:0.4.1' = {
  name: 'identity-${uniqueString(resourceGroup().id, name)}'
  params: { name: name, location: location, tags: tags }
}
```

## Standard Conventions

- `targetScope = 'resourceGroup'` (always)
- `@description()` on ALL parameters and outputs
- Common params: `name` (required), `location` (defaults to `resourceGroup().location`), `tags` (defaults to `{}`)
- Deployment names: `'<type>-${uniqueString(resourceGroup().id, name)}'`
- Outputs: expose `resourceId` + service-specific values

## HIPAA Requirements

- Encryption at rest on all data stores
- TLS 1.2+ minimum for all endpoints
- Private endpoints where supported (Cosmos DB, Key Vault, FHIR)
- Diagnostic logging to Log Analytics workspace

## Validation

```powershell
az bicep restore --file infra/modules/<module>.bicep
az bicep build --file infra/modules/<module>.bicep --stdout --no-restore
az bicep lint --file infra/modules/<module>.bicep
```
