---
name: git-commit
description: 'Execute git commit with conventional commit message analysis, intelligent staging, and message generation. Use when user asks to commit changes, create a git commit, or mentions "/commit". Supports: (1) Auto-detecting type and scope from changes, (2) Generating conventional commit messages from diff, (3) Interactive commit with optional type/scope/description overrides, (4) Intelligent file staging for logical grouping'
---

# Git Commit with Conventional Commits

## Overview

Create standardized, semantic git commits using the Conventional Commits specification. Analyze the actual diff to determine appropriate type, scope, and message.

## Conventional Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

| Type       | Purpose                        |
|------------|--------------------------------|
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `docs`     | Documentation only             |
| `style`    | Formatting/style (no logic)    |
| `refactor` | Code refactor (no feature/fix) |
| `perf`     | Performance improvement        |
| `test`     | Add/update tests               |
| `build`    | Build system/dependencies      |
| `ci`       | CI/pipeline changes            |
| `chore`    | Maintenance/misc               |
| `revert`   | Revert commit                  |

## Meridian Scopes

Use these scopes to indicate the area of the codebase affected:

| Scope       | Maps To                              |
|-------------|--------------------------------------|
| `api`       | `src/meridian/api/` — routes, deps   |
| `agents`    | `src/meridian/agents/` — MAF agents  |
| `voice`     | Voice Live, WebSocket, audio         |
| `fhir`      | FHIR client, patient data            |
| `repo`      | Repository layer (cosmos)            |
| `schemas`   | Pydantic request/response models     |
| `db`        | Cosmos DB containers, schema         |
| `config`    | Settings, environment, config        |
| `infra`     | Bicep modules, IaC                   |
| `frontend`  | React UI, Vite                       |
| `test`      | Test fixtures, conftest, helpers     |
| `auth`      | Authentication, authorization        |
| `docs`      | Documentation, README                |
| `sms`       | ACS SMS notifications                |
| `guardrails`| Content safety, input/output guards  |
| `e2e`       | Playwright E2E tests                 |
| `prompts`   | MAF agent system prompts             |

## Breaking Changes

```
# Exclamation mark after type/scope
feat(api)!: remove deprecated endpoint

# BREAKING CHANGE footer
feat(repo): switch to cosmos partitioning

BREAKING CHANGE: `get_patient` now requires partition_key parameter
```

## Workflow

### 1. Analyze Diff

```bash
# If files are staged, use staged diff
git diff --staged

# If nothing staged, use working tree diff
git diff

# Also check status
git status --porcelain
```

### 2. Stage Files (if needed)

If nothing is staged or changes should be grouped:

```bash
# Stage specific files
git add path/to/file1 path/to/file2

# Stage by pattern
git add src/meridian/agents/*
git add tests/api/test_*.py
```

**Never commit secrets** (.env, credentials, private keys, connection strings).

### 3. Generate Commit Message

Analyze the diff to determine:

- **Type**: What kind of change is this?
- **Scope**: Which Meridian module is affected? (use table above)
- **Description**: One-line summary (present tense, imperative mood, <72 chars)
- **Body**: (optional) Why the change was made, not what changed
- **Footer**: (optional) Work item references, breaking changes

### 4. Execute Commit

```bash
# Single line
git commit -m "<type>[scope]: <description>"

# Multi-line with body/footer
git commit -m "<type>[scope]: <description>" -m "<body>" -m "<footer>"
```

### Multi-Commit Grouping

When changes span multiple concerns, split into logical commits:

```bash
# Example: new agent + tests + migration
git add src/meridian/agents/guardrail.py src/meridian/agents/tools.py
git commit -m "feat(agents): add GuardrailAgent with regex + LLM checks"

git add tests/unit/test_guardrail.py tests/api/test_guardrail.py
git commit -m "test(agents): add unit and integration tests for GuardrailAgent"

git add alembic/versions/xxxx_add_guardrail_flags.py src/meridian/db/models.py
git commit -m "feat(db): add guardrail_flags table for content safety tracking"
```

## Best Practices

- One logical change per commit
- Present tense: "add" not "added"
- Imperative mood: "fix bug" not "fixes bug"
- Keep description under 72 characters
- Reference work items in footer when applicable

## Git Safety Protocol

- NEVER update git config
- NEVER run destructive commands (--force, hard reset) without explicit request
- NEVER skip hooks (--no-verify) unless user asks
- NEVER force push to main/master
- If commit fails due to hooks, fix the issue and create a NEW commit (don't amend)
