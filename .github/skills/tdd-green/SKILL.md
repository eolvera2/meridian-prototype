---
name: tdd-green
description: >
  TDD Green phase: make failing tests pass with minimal code. Use after
  writing a failing test in the Red phase. Implements just enough code
  to satisfy requirements without over-engineering. Adapts Green phase
  for Python (FastAPI, async, plain dicts) and TypeScript (React hooks).
---

# TDD Green Phase — Make Tests Pass Quickly

Write the minimal code necessary to make failing tests pass. Resist the urge to write more than required.

## Core Principles

### Minimal Implementation

- **Just enough code** — only what's needed to make tests pass
- **Fake it till you make it** — start with hard-coded returns, then generalise
- **Obvious implementation** — when the solution is clear, implement it directly
- **Triangulation** — add more tests to force generalisation

### Speed Over Perfection

- **Green bar quickly** — prioritise passing tests over code quality
- **Ignore code smells temporarily** — refactor phase handles cleanup
- **Simple solutions first** — most straightforward path
- **Defer complexity** — don't anticipate requirements beyond current scope

## Python Implementation Patterns

### Repository Methods (return plain dicts)

```python
async def get_patient(self, patient_id: str) -> dict | None:
    try:
        item = await self._patients.read_item(patient_id, partition_key=patient_id)
        return dict(item)
    except CosmosResourceNotFoundError:
        return None
```

### Route Handlers (convert dicts to Pydantic)

```python
@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: str,
    current_user: dict = Depends(get_current_user),
    repo: RepositoryProtocol = Depends(get_repo),
) -> PatientResponse:
    patient = await repo.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return PatientResponse(**patient)
```

### Agent Tool Functions (return JSON strings, never raise)

```python
async def verify_medication(patient_id: str, medication_name: str) -> str:
    try:
        result = await _do_work(patient_id, medication_name)
        return json.dumps({"verified": True, "details": result})
    except Exception as e:
        return json.dumps({"error": str(e), "verified": False})
```

### Key Rules

- Repository methods return **plain dicts** (not Pydantic models)
- Routes use `Depends(get_repo)` for dependency injection
- Keep `RepositoryProtocol` and `CosmosRepository` in sync
- All I/O is `async def` with `await`
- Config via `get_settings()` (never import at module level)

## TypeScript Implementation Patterns

```typescript
// API functions return typed responses
export async function fetchPatients(): Promise<PatientListResponse> {
  return apiFetch<PatientListResponse>("/patients")
}

// React hooks with typed state
const [patients, setPatients] = useState<Patient[]>([])
```

## Execution

1. Run the failing test to confirm what needs implementing
2. Confirm plan with user — NEVER start without confirmation
3. Write minimal code to make test pass
4. Run ALL tests: `uv run pytest tests/ -v`
5. Do NOT modify the test in Green phase
6. Proceed to REFACTOR phase

## Checklist

- [ ] All tests passing (green bar)
- [ ] No more code than necessary
- [ ] Existing tests remain unbroken
- [ ] Implementation is simple and direct
- [ ] Test was NOT modified
- [ ] Ready for refactoring
