---
name: docs-freshness
description: 'Fetch current documentation for emerging technologies before writing code. Use when working with MAF, Voice Live, Cosmos DB, or other fast-moving SDKs listed in .github/docs-references.yml. Fetches official docs once per session per technology to ensure code uses current APIs — not stale LLM training data.'
---

# Documentation Freshness — Per-Session Doc Check

## Overview

This project uses several **pre-release and rapidly evolving** technologies. LLM training data is likely outdated for these packages. This skill ensures you fetch **current official documentation** before writing code that uses them.

The key principle: **fetch once per session, only for technologies you actually touch.**

## How It Works

1. `.github/docs-references.yml` is a **static registry** of technologies, their official doc URLs, and churn level. It is not a tracker — no dates to maintain.
2. When you need to write or modify code using a listed technology, fetch its docs **once** in the current session.
3. After fetching, remember that you've checked it — do not fetch again for the same technology in this session.

## When to Fetch Docs

Fetch docs for a technology when **all three** of these are true:

- ✅ The technology is listed in `.github/docs-references.yml`
- ✅ You are about to write or modify code that imports/uses that package
- ✅ You have **not already fetched** docs for that technology in this session

**Do NOT fetch docs if:**
- ❌ You are only reading code, not writing it
- ❌ You already fetched docs for that technology earlier in this session
- ❌ The technology is `churn: low` and you are making a trivial change (e.g., fixing a typo)

## Workflow

### 1. Identify Which Technologies Are Involved

Before starting a coding task, determine which packages from `docs-references.yml` your changes will touch. Match by:

- Import statements you'll write (`from azure.ai.voicelive import ...`)
- Files you'll modify (`src/meridian/agents/` → MAF, `src/meridian/services/voice_live.py` → Voice Live)
- The `pypi_package` field in the references file

### 2. Fetch Documentation

For each technology you need, use `web_fetch` on its `docs_url`:

```
Technology: Microsoft Agent Framework (MAF)
URL: https://learn.microsoft.com/en-us/azure/ai-services/agents/
```

When fetching, focus on:

- **Current API surface** — class names, method signatures, parameter types
- **Import paths** — exact module paths for imports
- **Breaking changes** — anything deprecated or renamed since the `context` notes were written
- **Code examples** — official samples showing current usage patterns

### 3. Apply What You Learned

Use the fetched documentation to:

- Verify import paths before writing them
- Confirm method signatures and parameter names
- Check for new/better patterns than what the `context` field describes
- Avoid deprecated APIs

### 4. Track What You've Checked (In-Session Only)

Mentally track which technologies you've already fetched docs for. Example:

```
Session doc checks:
  ✅ MAF — fetched, AsyncAgentsClient API confirmed
  ✅ Voice Live — fetched, FunctionTool schema verified
  ⬜ Cosmos DB — not needed yet this session
```

**This tracking is ephemeral** — it resets with each new session, which is the intended behavior. Every new session should get fresh docs for whatever it touches.

## Churn Levels

The `churn` field in `docs-references.yml` guides urgency:

| Churn | Meaning | Fetch Behavior |
|---|---|---|
| `high` | Pre-release / API changes between releases | **Always fetch** before writing code |
| `medium` | Stable but actively developed | Fetch for non-trivial changes |
| `low` | Stable API, infrequent changes | Fetch only if unsure about an API |

## Token Budget

This skill is designed to minimize token usage:

- **Only fetch what you need** — if a task only touches routes and schemas, don't fetch MAF or Voice Live docs.
- **One fetch per technology per session** — never re-fetch.
- **Use `max_length` on web_fetch** — limit to 5000-8000 chars per fetch. Focus on API reference pages, not tutorials.
- **Skip low-churn for simple tasks** — if you're just adding a Ruff rule, don't fetch Ruff docs.

## Adding New Technologies

When a new dependency is added to `pyproject.toml` that has a fast-moving API:

```yaml
  - name: <Technology Name>
    docs_url: <official documentation URL>
    pypi_package: <package name>
    churn: high | medium | low
    context: >
      <What the package does, key classes/functions, and what to watch for>
```
