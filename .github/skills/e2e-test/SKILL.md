---
name: e2e-test
description: 'Playwright E2E testing workflow for Meridian. Use when writing or running browser-based tests against the React frontend and FastAPI backend. Handles voice call UI, patient management flows, and WebSocket mocking.'
---

# Playwright E2E Testing

## Overview

Write and run Playwright E2E tests against the Meridian React frontend (Vite :5173) backed by FastAPI (:8000). Uses the Playwright MCP server for browser automation.

## Prerequisites

- Playwright MCP server configured in `.github/copilot/mcp.json`
- Frontend: `cd frontend && npm install`
- Backend: `uv sync --dev`

## Workflow

### 1. Start Dev Servers

```bash
# Terminal 1: Backend
uv run uvicorn meridian.api.app:create_app --factory --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Frontend
cd frontend && npm run dev
```

### 2. Explore with Playwright MCP

Before writing tests, use Playwright MCP to navigate the app and understand the UI:
- Take page snapshots to identify elements
- Navigate through key user flows
- Identify correct locators (prefer `data-testid`, `role`, `label`)

### 3. Key User Flows to Test

| Flow | Route | Key Elements |
|------|-------|-------------|
| Patient list | `/` | Patient cards, search, pagination |
| Patient detail | `/patients/:id` | Demographics, medications (from FHIR), contacts |
| Voice call | `/patients/:id` | Call button, voice UI (`useVoiceCall.js`), status indicator |
| Transcript view | `/patients/:id/transcripts` | Transcript list, detail view, delete |
| Admin: Users | `/admin/users` | User list, create, role assignment |

### 4. Write Tests

```javascript
// Example: Patient list loads
test('patient list displays patients', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // Wait for data to load
  await page.waitForSelector('[data-testid="patient-card"]');
  
  // Verify patients are displayed
  const patients = await page.locator('[data-testid="patient-card"]').count();
  expect(patients).toBeGreaterThan(0);
});
```

### 5. WebSocket Mocking for Voice UI

The voice call UI uses WebSocket. For E2E tests:
- **Don't test actual ACS calls** — mock the WebSocket connection
- Test that the voice UI shows correct states (connecting, connected, disconnected)
- Test that the call button triggers the WebSocket connection
- Test error handling (connection failed, timeout)

```javascript
// Mock WebSocket for voice tests
test('voice call shows connecting state', async ({ page }) => {
  await page.goto('http://localhost:5173/patients/test-id');
  await page.click('[data-testid="call-button"]');
  await page.waitForSelector('[data-testid="call-status-connecting"]');
});
```

### 6. Test Data

- **Synthetic patients only**: Jane Doe, John Smith
- **No real PHI** in test assertions or snapshots
- Backend should be seeded with test data (or use mock API)

## Checklist

- [ ] Dev servers running (frontend :5173, backend :8000)
- [ ] Explored UI with Playwright MCP before writing tests
- [ ] Key user flows covered (patient list, detail, voice, transcripts)
- [ ] WebSocket mocked for voice call tests (no real ACS)
- [ ] Synthetic patient data only
- [ ] Tests use accessible locators (data-testid, role, label)
- [ ] Tests pass reliably (no flaky timeouts)
