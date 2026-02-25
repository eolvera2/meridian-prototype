---
name: docs-product
description: 'Create and maintain user-facing product documentation in the docs/ directory. Use when user asks to write docs, create documentation, add a guide, or update product documentation. Generates structured markdown documentation for end users, operators, and integrators.'
---

# Product Documentation

## Overview

Maintain user-facing product documentation in the `docs/` directory. This covers guides, references, and operational documentation for Meridian — distinct from implementation docs (which are for the engineering team).

## Documentation Structure

```
docs/
├── README.md                    # Docs index / table of contents
├── getting-started/
│   ├── quickstart.md            # 5-minute setup guide
│   ├── prerequisites.md         # System requirements
│   └── configuration.md         # Environment and settings
├── guides/
│   ├── voice-calls.md           # Voice call workflow guide
│   ├── patient-management.md    # Patient CRUD operations
│   ├── fhir-integration.md      # FHIR data source setup
│   └── agent-configuration.md   # MAF agent setup and tuning
├── api/
│   ├── overview.md              # API design principles
│   ├── authentication.md        # Auth flow and tokens
│   ├── endpoints/               # Per-resource endpoint docs
│   │   ├── patients.md
│   │   ├── contacts.md
│   │   ├── transcripts.md
│   │   └── users.md
│   └── errors.md                # Error codes and handling
├── operations/
│   ├── deployment.md            # Azure deployment guide
│   ├── monitoring.md            # Observability and alerts
│   ├── troubleshooting.md       # Common issues and fixes
│   └── hipaa-compliance.md      # PHI handling procedures
└── architecture/
    ├── overview.md              # High-level architecture
    ├── data-model.md            # Database schema and FHIR
    └── security.md              # Security model
```

## When to Use

- When creating new documentation pages
- When a feature is ready for users and needs a guide
- When updating existing docs after feature changes
- When user asks to "write docs" or "document this feature"

## Workflow

### 1. Determine Documentation Type

| Type | Purpose | Audience |
|---|---|---|
| **Getting Started** | First-time setup and configuration | New developers / operators |
| **Guide** | Task-oriented walkthroughs | Active users |
| **API Reference** | Endpoint specifications | Integrators / frontend devs |
| **Operations** | Deployment, monitoring, compliance | DevOps / SRE |
| **Architecture** | System design and decisions | Technical leads |

### 2. Research the Feature

Before writing:

1. Read the relevant source code (routes, services, schemas)
2. Read existing tests to understand expected behavior
3. Check `implementation-docs/` for specs or design context
4. Run the feature locally if possible to verify behavior

### 3. Write the Documentation

Follow these conventions:

#### Page Structure

```markdown
# Page Title

> Brief one-sentence summary of what this page covers.

## Prerequisites

- What the reader needs before starting

## <Main Content Sections>

Step-by-step instructions, explanations, examples.

## Examples

Concrete, copy-pasteable examples.

## Troubleshooting

Common issues and how to resolve them.

## Related

- Links to related docs pages
```

#### Style Rules

- **Write for the reader**, not the codebase. Explain *what* and *why*, not implementation details.
- **Use concrete examples** — show actual curl commands, JSON payloads, Python snippets.
- **Present tense**, active voice: "The API returns..." not "The API will return..."
- **Code blocks** with language tags for syntax highlighting.
- **Admonitions** for warnings, especially around PHI:

```markdown
> ⚠️ **PHI Warning**: This endpoint returns patient data. Ensure your
> connection uses TLS and that access is logged per HIPAA requirements.
```

- **No internal implementation details** — don't reference ORM models, repository internals, or specific Python classes unless they're part of the public API.

#### API Endpoint Documentation Format

```markdown
## GET /api/v1/patients

Retrieve a paginated list of patients.

### Authentication

Requires a valid bearer token. Any authenticated role.

### Query Parameters

| Parameter | Type   | Required | Default | Description          |
|-----------|--------|----------|---------|----------------------|
| `page`    | int    | No       | 1       | Page number          |
| `limit`   | int    | No       | 20      | Results per page     |
| `search`  | string | No       | —       | Filter by name       |

### Response

```json
{
  "items": [
    {
      "id": "uuid",
      "first_name": "Jane",
      "last_name": "Doe",
      "date_of_birth": "1990-01-15",
      "medications": []
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

### Errors

| Status | Code | Description |
|--------|------|-------------|
| 401    | —    | Missing or invalid token |
| 403    | —    | Insufficient permissions |
```

### 4. Create docs/README.md Index

If `docs/README.md` doesn't exist, create it as a table of contents. When adding new pages, update the index.

### 5. Validate

- All links between docs pages resolve
- Code examples are syntactically valid
- No PHI or real patient data in examples (use "Jane Doe", "John Smith")
- Consistent formatting with existing pages

## What NOT to Include

- Internal implementation details (repository layer, ORM models, agent internals)
- Real patient data or PHI — always use synthetic examples
- Speculative features — only document what's implemented
- Deployment secrets, connection strings, or credentials
