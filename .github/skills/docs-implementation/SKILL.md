---
name: docs-implementation
description: 'Sync implementation documentation with code changes. Use when user asks to update docs, sync docs, or after significant code changes. Updates .github/copilot-instructions.md, architecture-technologies-reference.md, README.md, and implementation-docs/ to reflect the current codebase.'
---

# Implementation Documentation Sync

## Overview

Keep internal implementation documentation accurate and in sync with the codebase. This project has three tiers of implementation docs that must stay consistent:

| Document | Purpose | Audience |
|---|---|---|
| `.github/copilot-instructions.md` | AI agent context — architecture, patterns, conventions | Copilot / AI agents |
| `architecture-technologies-reference.md` | Full technology stack and architectural decisions | Engineers, architects |
| `README.md` | Project overview, quick start, current status | All developers |
| `implementation-docs/` | Detailed specs, plans, ADRs, reviews | Engineering team |

## When to Use

- After adding/removing a route, model, agent, or service
- After changing database schema or adding migrations
- After modifying the repository protocol or adding new methods
- After adding/upgrading dependencies in `pyproject.toml`
- After creating new Bicep modules in `infra/modules/`
- After changing test patterns or adding new test fixtures

## Workflow

### 1. Detect What Changed

Analyze recent code changes to determine what documentation needs updating:

```bash
# Check what files changed
git diff --name-only HEAD~1
# or for unstaged changes
git diff --name-only
git diff --staged --name-only
```

Categorize changes:
- **Routes** → update copilot-instructions (Key Layers), README (API section)
- **Models/Schema** → update copilot-instructions (ORM Models), architecture ref
- **Agents** → update copilot-instructions (MAF section), architecture ref
- **Dependencies** → update architecture-technologies-reference.md, pyproject.toml section
- **Infra** → update copilot-instructions (Infrastructure), architecture ref
- **Test patterns** → update copilot-instructions (Testing Conventions)

### 2. Update Documents

For each affected document, read the current content, identify the specific section that needs updating, and make surgical edits.

#### `.github/copilot-instructions.md`

This is the **most critical** document — it's what AI agents read to understand the codebase. Sections to keep current:

- **Key Layers** — list of routes, services, agents with file paths
- **ORM Models** — table count, table names, key relationships
- **MAF section** — agent table (name, class, pattern, purpose)
- **Testing Conventions** — fixtures, patterns, seed data
- **Code Conventions** — rules, user story range
- **Infrastructure** — module list

**Rules:**
- Keep the same structure and formatting
- Be precise about file paths and class names
- Update counts (e.g., "8 tables" → "9 tables" if a table was added)
- Update user story ranges if new stories are added

#### `architecture-technologies-reference.md`

- Technology tables — add/remove/version-bump entries
- ADR table — add new decisions
- Directory structure — update if layout changed
- Cosmos DB containers — add new containers

#### `README.md`

- Status line (test count, agent count, feature list)
- Quick start commands if they changed
- Tech stack badges/summary

#### `implementation-docs/`

- If a feature spec was implemented, update its status
- If a plan item was completed, mark it in `progress.md`
- Add new ADRs for significant architectural decisions

### 3. Cross-Reference Check

After updating, verify consistency across documents:

```
copilot-instructions.md says "8 tables" 
  → count tables in src/meridian/db/models.py → verify match

copilot-instructions.md lists agents: Nurse, PatientFacts, Summarization
  → list files in src/meridian/agents/ → verify match

architecture ref lists dependencies
  → compare with pyproject.toml → verify match
```

### 4. Validate

- Ensure no broken markdown formatting
- Verify all file paths mentioned in docs actually exist
- Check that code examples in docs still compile/work

## What NOT to Update

- **`private-docs/`** — code reviews and internal notes; leave as-is
- **`.github/docs-references.yml`** — managed by the `docs-freshness` skill
- **`implementation-docs/prd.md`** — product requirements; only update when requirements change, not when code changes
- **Test files** — this skill updates docs, not tests

## Document Style

- Use the same markdown style as the existing documents
- Tables for structured data, code blocks for commands/examples
- Keep copilot-instructions.md concise — it's consumed as AI context
- Use present tense ("Routes depend on..." not "Routes will depend on...")
