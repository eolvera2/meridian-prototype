---
name: tdd-red
description: >
  TDD Red phase: write failing tests first. Use when starting a new feature
  or bug fix with test-driven development. Guides writing clear, specific
  failing tests from GitHub issue requirements before any implementation.
  Adapts Red phase for Python (pytest) and TypeScript (Vitest) with
  Meridian conventions (GH-0XX naming, 3 test suites, HIPAA-safe test data).
---

# TDD Red Phase — Write Failing Tests First

Write clear, specific failing tests that describe desired behaviour before implementation exists.

## GitHub Issue Integration

- Extract issue number from branch name or user request
- Parse user stories and acceptance criteria into testable behaviours
- Use issue checklist items as test validation points
- One test at a time — iterate RED, GREEN, REFACTOR per test

## Choose the Right Test Suite

| Question | Suite |
|----------|-------|
| Tests a route/endpoint? | **API** (`tests/api/`) — needs Docker |
| Tests repository methods directly? | **Cosmos** (`tests/cosmos/`) — needs Docker |
| Tests business logic with mocked deps? | **Unit** (`tests/unit/`) — no Docker |

## File Placement

1. Pick suite directory based on table above
2. Name file by domain: `test_{domain}.py` (e.g., `test_patients.py`, `test_voice.py`)
3. If file exists, add to it — do NOT create a new file
4. Group by feature using test classes: `TestPatientSearch`, `TestPatientList`
5. Split only when file exceeds ~300 lines

## Python Test Patterns

### Naming

```python
class TestPatientSearch:
    async def test_search_by_name_returns_matches_GH002(self, client, auth_headers):
        """GH-002: As a nurse, I can search patients by name."""
```

- Method: `test_<behavior>_GH0XX`
- Class: `Test<Feature>`
- Docstring: reference user story + acceptance criteria

### Fixtures

| Fixture | Suite | Purpose |
|---------|-------|---------|
| `client` | API | Async httpx AsyncClient |
| `auth_headers` | API | JWT for nurse user |
| `admin_auth_headers` | API | JWT for admin user |
| `mock_repo` | Unit | AsyncMock(spec=RepositoryProtocol) |
| `unit_client` | Unit | httpx client with mocked deps |
| `cosmos_repo` | Cosmos | Real CosmosRepository instance |

### Structure (Arrange / Act / Assert)

```python
async def test_patient_list_returns_patients_GH002(self, client, auth_headers):
    """GH-002: As a nurse, I can view my patient list."""
    # Arrange — data seeded by conftest

    # Act
    response = await client.get("/api/patients", headers=auth_headers)

    # Assert
    assert response.status_code == 200
    assert len(response.json()["patients"]) == 2
```

### Stable UUIDs

```python
from tests.conftest import PATIENT_1_ID, PATIENT_2_ID, USER_1_ID, USER_2_ID
```

### Parametrize (replaces C# Theory tests)

```python
@pytest.mark.parametrize("status", ["pending", "contacted", "needs_review"])
async def test_filter_by_status_GH002(self, client, auth_headers, status):
    response = await client.get(f"/api/patients?status={status}", headers=auth_headers)
    assert response.status_code == 200
```

## TypeScript Test Patterns

```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

describe("PatientList", () => {
  it("renders patient names from API response", async () => {
    render(<PatientList />)
    expect(await screen.findByText("Jane Doe")).toBeInTheDocument()
  })
})
```

## PHI in Tests

Synthetic data ONLY: "Jane Doe", "John Smith", DOB "1990-01-15". Never real patient data.

## Execution

1. Confirm plan with user — NEVER start without confirmation
2. Write ONE failing test
3. Run it: `uv run pytest tests/unit/test_{domain}.py -v -k test_name`
4. Verify it fails for the RIGHT reason (missing implementation, not syntax error)
5. Proceed to GREEN phase

## Checklist

- [ ] Correct suite selected (unit/API/cosmos)
- [ ] File placed in correct directory, named by domain
- [ ] Test name: `test_<behavior>_GH0XX`
- [ ] Docstring references user story
- [ ] Arrange / Act / Assert with comments
- [ ] Correct fixtures for the suite
- [ ] Synthetic PHI only
- [ ] Test fails for the right reason
- [ ] No production code written yet
