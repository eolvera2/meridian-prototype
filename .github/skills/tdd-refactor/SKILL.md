---
name: tdd-refactor
description: >
  TDD Refactor phase: improve code quality while keeping tests green. Use
  after making tests pass in the Green phase. Applies Ruff linting, mypy
  type checking, HIPAA compliance, and Meridian design patterns. Replaces
  C#/OWASP patterns with Python/TypeScript and healthcare-specific security.
---

# TDD Refactor Phase — Improve Quality and Security

Clean up code, apply best practices, and enhance design while keeping all tests green.

## Core Principles

### Code Quality

- **Remove duplication** — extract common code into reusable functions
- **Improve readability** — intention-revealing names, clear structure
- **Apply SOLID principles** — single responsibility, dependency inversion
- **Simplify complexity** — break down large methods, reduce nesting

### Design Patterns (Meridian)

- **Repository Protocol** — routes depend on `RepositoryProtocol` via `Depends(get_repo)`
- **App Factory** — `create_app()` with lifespan handler
- **Config** — `pydantic-settings` via `get_settings()` (lru_cached)
- **Async everywhere** — `async def`, `await`, `async with`

## Python Quality Tools

```bash
# Lint (required before completing refactor)
uv run ruff check src/ tests/
uv run ruff check src/ tests/ --fix

# Type check
uv run mypy src/

# Run all tests
uv run pytest tests/ -v
```

### Ruff Rules: E, F, I, N, W, UP, B, C4, SIM

### Python Best Practices

- Type hints: `str | None` (not `Optional[str]`)
- Pydantic v2: `model_validator`, `field_validator`, `ConfigDict`
- `match/case` for complex branching
- `BaseModel` for schemas, `dataclass` for internal data
- Standard `logging` module (not structlog)

## TypeScript Quality Tools

```bash
cd frontend && npm run build    # Type check via TypeScript compiler
```

- Strict null checks enabled
- React hooks best practices (no class components)
- Proper error boundaries

## HIPAA Security Checklist (replaces OWASP)

- [ ] PHI never in logs or telemetry
- [ ] Audio never persisted (transcripts only)
- [ ] FHIR access is read-only (never write to EHR)
- [ ] Transcript deletion is hard delete + audit log
- [ ] Audit logs are append-only (immutable)
- [ ] Agent tool functions catch ALL exceptions (return error JSON, never raise)
- [ ] No secrets in code (use `.env` / `get_settings()`)
- [ ] Input validation on all public endpoints

## Execution

1. Ensure all tests are green before starting
2. Confirm plan with user — NEVER start without confirmation
3. Small incremental changes — refactor in tiny steps
4. Run tests after EACH change
5. Run lint: `uv run ruff check src/ tests/`
6. Run type check: `uv run mypy src/`

## Checklist

- [ ] All tests remain green
- [ ] Code duplication eliminated
- [ ] Names express intent clearly
- [ ] Methods have single responsibility
- [ ] HIPAA checklist items addressed
- [ ] Ruff passes: `uv run ruff check src/ tests/`
- [ ] mypy passes: `uv run mypy src/`
- [ ] Documentation updated if needed
