---
name: tdd
description: 'Test-driven development workflow for Meridian. Use when implementing new features with a test-first approach. Adapts Red-Green-Refactor for three test suites (unit, API, Cosmos) with Meridian-specific conventions.'
---

# TDD for Meridian

## Overview

Red-Green-Refactor adapted for Meridian's 3 Python test suites. Each suite has its own fixtures, patterns, and Docker requirements.

## Step 1: Choose the Right Test Suite

| Question | Answer → Suite |
|----------|---------------|
| Does it test a route/endpoint? | **API** (`tests/api/`) — needs Docker |
| Does it test repository methods directly? | **Cosmos** (`tests/cosmos/`) — needs Docker |
| Does it test business logic with mocked dependencies? | **Unit** (`tests/unit/`) — no Docker |

## Step 2: Red — Write a Failing Test

### File Placement (MUST follow)

**Before creating any test file, determine the correct location:**

1. **Pick the suite directory** based on Step 1: `tests/unit/`, `tests/api/`, or `tests/cosmos/`
2. **Name the file by domain**: `test_{domain}.py` where domain matches the source module being tested (e.g., `patients`, `users`, `transcripts`, `voice`)
3. **Check if the file already exists** — if `tests/unit/test_patients.py` exists, add to it; do NOT create a new file
4. **Group by feature using test classes** inside the file: `TestPatientSearch`, `TestPatientList`, etc.
5. **Split only when a file exceeds ~300 lines** — then split by feature into separate files

```
tests/
├── conftest.py                          # Shared fixtures, stable UUIDs
├── unit/
│   ├── conftest.py                      # unit_client, mock_repo
│   ├── test_patients.py                 # TestPatientList, TestPatientSearch, TestPatientDetail
│   ├── test_users.py                    # TestUserCreate, TestUserRoles
│   └── test_transcripts.py             # TestTranscriptList, TestTranscriptDelete
├── api/
│   ├── conftest.py                      # client, auth_headers
│   ├── test_patients.py                 # API-level patient tests
│   └── test_users.py                    # API-level user tests
└── cosmos/
    ├── conftest.py                      # cosmos_repo
    └── test_patient_repository.py       # Cosmos repository tests
```

**Domain-to-file mapping:**

| Source module | Test file name | Example classes |
|--------------|---------------|-----------------|
| `patients.py` / patient routes | `test_patients.py` | `TestPatientList`, `TestPatientSearch`, `TestPatientDetail` |
| `users.py` / user routes | `test_users.py` | `TestUserCreate`, `TestUserRoles` |
| `transcripts.py` / transcript routes | `test_transcripts.py` | `TestTranscriptList`, `TestTranscriptDelete` |
| `voice_live.py` / voice routes | `test_voice.py` | `TestVoiceSession`, `TestVoiceWebSocket` |
| `cosmos_repository.py` | `test_patient_repository.py` | `TestPatientCRUD`, `TestPatientQueries` |

> ⚠️ **Never** derive the test file name from the user's request text. Always derive it from the source module being tested.

### Naming Convention
```python
class TestPatientSearch:
    async def test_search_by_name_returns_matches_GH002(self, client, auth_headers):
        """
        GH-002: As a nurse, I can search patients by name.
        AC: GET /api/patients?q=Jane returns matching patients.
        """
```

- Method: `test_<behavior>_GH0XX`
- Class: `Test<Feature>` organized by feature within the domain file
- Docstring: reference user story + acceptance criteria

### Fixture Selection

**Unit tests:**
```python
async def test_something_unit_GH005(self, unit_client, mock_repo):
    # Arrange
    mock_repo.get_patient.return_value = {"id": PATIENT_1_ID, "first_name": "Jane"}
    
    # Act
    response = await unit_client.get(f"/api/patients/{PATIENT_1_ID}")
    
    # Assert
    assert response.status_code == 200
```

**API tests:**
```python
async def test_something_api_GH005(self, client, auth_headers):
    # Arrange — data seeded by conftest
    
    # Act
    response = await client.get("/api/patients", headers=auth_headers)
    
    # Assert
    assert response.status_code == 200
    assert len(response.json()["items"]) == 2
```

**Cosmos tests:**
```python
async def test_something_cosmos(self, cosmos_repo):
    # Arrange
    await cosmos_repo.create_patient({"id": str(uuid4()), ...})
    
    # Act
    result = await cosmos_repo.get_patient(patient_id)
    
    # Assert
    assert result is not None
```

### Stable UUIDs
```python
from tests.conftest import PATIENT_1_ID, PATIENT_2_ID, USER_1_ID, USER_2_ID
```

### PHI in Tests
Use synthetic data ONLY: "Jane Doe", "John Smith", DOB "1990-01-15", SSN "000-00-0000".

## Step 3: Green — Minimal Implementation

Write the **minimum code** to make the test pass:
- Don't add features the test doesn't verify
- Don't optimize yet
- Don't refactor yet

## Step 4: Refactor

With green tests as your safety net:
- Extract duplicated logic
- Improve naming
- Apply patterns from existing code
- Run lint: `uv run ruff check src/ tests/`

## Step 5: Verify

```bash
uv run pytest tests/unit/ -v               # Unit (fast, no Docker)
uv run pytest tests/api/ -v                # API (needs Docker)
uv run pytest tests/cosmos/ --confcutdir=tests/cosmos -v  # Cosmos (needs Docker)
uv run ruff check src/ tests/             # Lint
```

## Checklist

- [ ] Test file placed in correct suite directory (`tests/unit/`, `tests/api/`, or `tests/cosmos/`)
- [ ] File named by domain (`test_{domain}.py`), NOT derived from user request text
- [ ] Added to existing domain file if one exists (no duplicate files)
- [ ] Correct test suite selected (unit/API/cosmos)
- [ ] Test name follows `test_<behavior>_GH0XX` convention
- [ ] Docstring references user story + acceptance criteria
- [ ] Arrange / Act / Assert with section comments
- [ ] Correct fixtures used for the suite
- [ ] Stable UUIDs imported from conftest
- [ ] Synthetic PHI only (no real patient data)
- [ ] Test fails for the right reason (Red ✅)
- [ ] Minimal implementation makes test pass (Green ✅)
- [ ] Code refactored with tests still passing (Refactor ✅)
- [ ] Lint passes: `uv run ruff check src/ tests/`
