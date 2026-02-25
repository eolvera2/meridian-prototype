---
name: spec-writer
description: >
  Generate or update specification documents for new or existing Meridian
  functionality. Use when defining requirements, constraints, interfaces,
  and acceptance criteria for implementation. Creates AI-ready specs with
  structured formatting, Meridian-specific requirement types (HIPAA, FHIR,
  VOICE, MAF), and Python/TypeScript test strategies. Trigger: 'write spec',
  'create specification', 'define requirements'.
---

# Specification Writer

Generate or update specification documents that are clear, unambiguous, and structured for effective use by AI agents and developers.

## Best Practices

- Precise, explicit, unambiguous language
- Clearly distinguish requirements, constraints, and recommendations
- Structured formatting (headings, lists, tables) for easy parsing
- Define all acronyms and domain-specific terms
- Include examples and edge cases
- Self-contained — no reliance on external context

## Output Location

Save specs to `implementation-docs/feature-specs/` directory.

Name convention: `spec-{purpose}-{topic}.md` where purpose is one of: schema, tool, data, infrastructure, process, architecture, design.

Product documentation goes in `docs/`. Specs are implementation artifacts.

## Specification Template

```markdown
---
title: [Concise title]
version: [e.g., 1.0]
date_created: [YYYY-MM-DD]
last_updated: [YYYY-MM-DD]
owner: [Team/individual]
tags: [e.g., infrastructure, process, design, app]
---

# Introduction

[Short introduction to the spec and its goal.]

## 1. Purpose and scope

[Description, intended audience, assumptions.]

## 2. Definitions

[Acronyms, abbreviations, domain-specific terms.]

## 3. Requirements, constraints, and guidelines

- **REQ-001**: [Requirement]
- **HIPAA-001**: [PHI handling constraint]
- **FHIR-001**: [FHIR integration requirement — read-only]
- **VOICE-001**: [Real-time audio requirement]
- **MAF-001**: [Agent framework pattern]
- **SEC-001**: [Security requirement]
- **CON-001**: [Constraint]
- **GUD-001**: [Guideline]
- **PAT-001**: [Pattern to follow]

## 4. Interfaces and data contracts

[APIs, data contracts, integration points. Use tables or code blocks.]

## 5. Acceptance criteria

- **AC-001**: Given [context], When [action], Then [expected outcome]

## 6. Test automation strategy

- **Test levels**: Unit, API integration, Cosmos integration
- **Frameworks**: pytest, pytest-asyncio, AsyncMock(spec=RepositoryProtocol)
- **3 suites**: unit (no Docker), API (testcontainers), Cosmos (testcontainers)
- **Test data**: conftest.py stable UUIDs, synthetic PHI only
- **CI/CD**: GitHub Actions
- **Naming**: test_<behavior>_GH0XX in Test<Feature> classes

## 7. Rationale and context

[Reasoning behind requirements and design decisions.]

## 8. Dependencies and external integrations

### External systems
- **EXT-001**: Azure Cosmos DB — patient data, contacts, transcripts
- **EXT-002**: Azure FHIR — read-only patient medications

### Third-party services
- **SVC-001**: Azure AI Foundry — MAF agent hosting
- **SVC-002**: Azure Voice Live — real-time voice API

### Infrastructure
- **INF-001**: [Infrastructure component]

### Compliance
- **COM-001**: HIPAA — audio never persisted, PHI scrubbed from logs
- **COM-002**: FHIR read-only — never write back to EHR

## 9. Examples and edge cases

[Code snippets demonstrating correct patterns.]

## 10. Validation criteria

[Criteria or tests for compliance.]

## 11. Related specifications

[Links to related specs.]
```

## Meridian-Specific Requirement Types

| Prefix | Domain | Example |
|--------|--------|---------|
| HIPAA | PHI handling | Audio never persisted, transcript hard delete |
| FHIR | EHR integration | Read-only access, MedicationRequest resources |
| VOICE | Real-time audio | WebSocket latency, PCM16 24kHz format |
| MAF | Agent framework | Tool functions return JSON, never raise |
| REQ | General | Functional requirements |
| SEC | Security | Auth, input validation |
| CON | Constraint | Technical limitations |
