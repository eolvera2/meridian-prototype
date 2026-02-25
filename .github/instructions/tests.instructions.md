---
globs: tests/**
---

# Test Instructions

## Naming Convention

- Methods: `test_<behavior>_GH0XX` — suffix links to user story (GH-001 through GH-017)
- Classes: `Test<Feature>` organized by endpoint/feature
- Docstrings: reference user story and acceptance criteria

## Structure

Follow **Arrange / Act / Assert** with section comments:
```python
async def test_patient_list_returns_patients_GH002(self, client, auth_headers):
    """GH-002: As a nurse, I can view my patient list."""
    # Arrange — data seeded by conftest

    # Act
    response = await client.get("/api/patients", headers=auth_headers)

    # Assert
    assert response.status_code == 200
```

## Fixtures

| Fixture | Suite | Purpose |
|---------|-------|---------|
| `client` | API | Async httpx `AsyncClient` |
| `auth_headers` | API | JWT for nurse user |
| `admin_auth_headers` | API | JWT for admin user |
| `mock_repo` | Unit | `AsyncMock(spec=RepositoryProtocol)` |
| `unit_client` | Unit | httpx client with mocked deps |

## Stable UUIDs

```python
from tests.conftest import PATIENT_1_ID, PATIENT_2_ID, USER_1_ID, USER_2_ID
```

## PHI Rules

**Synthetic data ONLY**: "Jane Doe", "John Smith", DOB "1990-01-15". Never real patient data.
