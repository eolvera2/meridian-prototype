# Copilot Instructions — Meridian

## Project Overview

- **Stack**: Python 3.11+, FastAPI, Pydantic v2, React 19, TypeScript, Vite, Tailwind CSS, Bicep (AVM)
- **Data store**: Azure Cosmos DB (schemaless, partition keys + composite indexes)
- **FHIR**: Read-only — medications fetched at runtime via fhir_id, never stored locally
- **Voice**: Voice Live SDK + ACS Call Automation — audio is ephemeral, never persisted

## HIPAA Rules (always apply)

- **Audio**: Never persist audio data to disk or blob storage
- **FHIR**: Read-only — never POST/PUT/PATCH to FHIR endpoints
- **Logging**: Never log patient names, MRNs, SSNs, or other PHI
- **Test data**: Use only synthetic patients (Jane Doe, John Smith, etc.)
- **Deletes**: Hard deletes only — no soft delete / is_active flags
- **Audit**: Audit trail records are immutable — append-only

## Coding Conventions

- Python: Ruff for linting and formatting, type hints required
- Tests: pytest, AAA pattern, `_GH0XX` suffix naming, synthetic PHI only
- Bicep: AVM modules from `br/public:avm/...`, `@description()` on params/outputs
- Frontend: React 19 functional components with hooks, TypeScript strict mode
- MAF agents: `async with` client lifecycle, tool functions return JSON strings, never raise

## Output Formatting

When generating plans, specifications, or documentation that includes code:

- Use fenced code blocks with language identifiers: ```python, ```typescript, ```bash, ```bicep
- Never use unfenced or indented-only code blocks
- Label before/after snippets clearly: **Current** + **Goal** (or **Before** + **After**)
- Keep snippets minimal — show only relevant lines with enough context to locate the change

## Available Copilot Tooling

This project has meridian-tools installed. Key artifacts:

- **Agents**: `@developer`, `@voice-acs`, `@test-quality`, `@infra` (plus 17 general-purpose)
- **Skills**: `tdd`, `tdd-red`, `tdd-green`, `tdd-refactor`, `prd`, `spec-writer`, `hipaa-check`, `maf-develop`, `fhir-integrate`, `e2e-test`, `voice-debug`, `acs-outbound`, `sms-flow`, `guardrails-design`, `prompt-iterate`, `cosmos-migrate`, `agent-eval`, `git-commit`, `docs-freshness`, `docs-implementation`, `docs-product`, `frontend-a11y` (22 total)
- **Hooks**: Session start HIPAA banner, pre-tool PHI guard, post-tool protocol sync, subagent validation
- **Instructions**: 9 scoped instruction files auto-load by file path
