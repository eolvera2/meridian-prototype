---
globs: frontend/**
---

# Frontend Instructions

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework (hooks + functional components only) |
| TypeScript | 5.9 | Type safety, strict mode enabled |
| Vite | 7.2 | Build tool + dev server with HMR |
| Tailwind CSS | 4.1 | Utility-first CSS via `@tailwindcss/vite` plugin |
| Radix UI | latest | Accessible headless primitives (dialog, select, checkbox, etc.) |
| CVA | 0.7 | Variant-based component styling (`class-variance-authority`) |
| react-router-dom | 7.x | Client-side routing with `AuthGuard` |
| Sonner | 2.x | Toast notifications (`toast` from `sonner`) |
| Phosphor Icons | 2.x | Icon library (`@phosphor-icons/react`) |
| date-fns | 4.x | Date formatting (no moment.js) |
| ESLint | 9.x | Flat config with react-hooks + react-refresh plugins |

## Project Structure

```
frontend/src/
  components/
    ui/              # Shadcn-style primitives (button, card, dialog, input, table)
    layout/          # AppHeader, AppSidebar
    nurse-workspace/ # Nurse workspace feature components
    call-management/ # Call controls, patient list, progress panels
    transcripts/     # Transcript viewer components
    summaries/       # Call summary and transfer summary components
    prompts/         # Prompt management components
  hooks/             # Custom hooks (usePrompt, future: usePatients, useVoiceCall)
  lib/
    api.ts           # Centralized API client with JWT auth
    types.ts         # All TypeScript interfaces/types
    utils.ts         # cn() helper (clsx + tailwind-merge)
  pages/             # One file per route (LoginPage, NurseWorkspacePage, etc.)
  assets/            # Static assets
```

## Component Patterns

### UI Primitives (shadcn/ui style)

Built on Radix UI + CVA + `cn()`. Do NOT modify `components/ui/` directly — extend with wrapper components.

- Use `cn()` from `@/lib/utils` for class merging (never raw template literals for Tailwind)
- Use CVA `variants` for component variants (not conditional className strings)
- All primitives support `className` prop for consumer overrides
- Use `ComponentProps<"element">` for prop typing (not custom interfaces for simple wrappers)

### Feature Components

Organized by domain in `components/<feature>/`. Each feature folder groups related components:
- Keep components focused — one responsibility per file
- Extract shared state into custom hooks in `hooks/`
- Use `@/lib/types.ts` for shared interfaces (not per-component type files)

## API Integration

All backend calls go through `lib/api.ts`:

- `apiFetch<T>(endpoint, options?)` — generic wrapper with JWT auth + error handling
- Token stored in `sessionStorage` (never `localStorage` — cleared on tab close)
- 401 responses auto-redirect to `/login` and clear session
- `API_BASE_URL = '/api'` — Vite proxy forwards to FastAPI at `:8000`
- Backend returns `snake_case`; transform to `camelCase` in API functions

### Adding a New API Call

1. Add TypeScript types to `lib/types.ts`
2. Add function to `lib/api.ts` using `apiFetch<T>()`
3. Document the backend endpoint in a JSDoc comment: `/** Maps to: GET /api/... */`
4. Handle backend `snake_case` → frontend `camelCase` field mapping in the function

## Custom Hooks

Follow the `usePrompt.ts` pattern:

- Return an object with: state fields + action functions + loading/error states
- Use `useCallback` for stable action references
- Load data on mount with `useEffect` + load function
- Handle errors gracefully (set error state, don't throw to component)
- Name: `use<Feature>` (e.g., `usePrompt`, `usePatients`, `useVoiceCall`)

## Routing & Auth

- All authenticated routes wrapped in `<AuthGuard>` (redirects to `/login` if no token)
- Login stores JWT via `setAuthToken()` → `sessionStorage`
- `clearAuth()` removes token + user, used on logout and 401
- Post-login redirect via `location.state.from`

| Path | Page | Auth |
|---|---|---|
| `/login` | LoginPage | No |
| `/` | NurseWorkspacePage | Yes |
| `/nurse-workspace` | NurseWorkspacePage | Yes |
| `/dashboard` | DashboardPage | Yes |
| `/patients` | PatientsIndexPage | Yes |
| `/patients/:patientId/edit` | PatientEditPage | Yes |
| `/transcripts/:patientId?` | TranscriptViewerPage | Yes |
| `/prompts` | PromptIndexPage | Yes |
| `/prompts/:promptType` | PromptEditPage | Yes |

## Build & Dev

```bash
cd frontend && npm install && npm run dev   # Dev server on :5173
cd frontend && npm run build                # Production build to ../dist
cd frontend && npx eslint .                 # Lint TypeScript
cd frontend && npx tsc --noEmit             # Type check
```

### Vite Dev Proxy

Dev server proxies `/api` and `/acs` to `http://localhost:8000` (FastAPI). No CORS config needed in dev.

### Path Alias

`@/` maps to `./src/` — use for all imports:

```typescript
// ✅ Use path alias
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'

// ❌ Never use relative paths across directories
import { Button } from '../../../components/ui/button'
```

## Accessibility

WCAG 2.1 AA minimum — healthcare applications require accessible interfaces:

- All interactive elements must be keyboard accessible
- Semantic HTML and ARIA labels on all controls
- Color must not be the sole indicator (use icons, text, patterns)
- Focus management for modals, dialogs, and dynamic content
- Radix UI primitives provide built-in ARIA roles — don't override unless necessary
- Test with keyboard-only navigation and screen readers

## PHI Rules

- **No PHI in client-side logs** (`console.log`, `console.error`)
- **No PHI in `sessionStorage` or `localStorage`** (JWT token is not PHI)
- **No PHI in URL parameters** (use path params for IDs only)
- Use synthetic data in development fixtures ("Jane Doe", "John Smith")
- Voice/call data is ephemeral — never write to client-side storage
