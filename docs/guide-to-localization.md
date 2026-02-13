# Guide to Localization (Self‑Guided)

This project already has a working i18n setup (locale‑prefixed routes + a message bundle per locale). This guide is a **future playbook** for adding new languages safely and consistently.

## Goals

- Add a new locale without breaking routing, authentication, or rendering.
- Ensure **every UI/a11y string** is localized (no hard‑coded user‑visible strings).
- Keep locale data consistent across all supported locales.

## Current Implementation (How it Works Today)

### Routing + Locale selection

- The app uses a `HashRouter` and locale‑prefixed routes: `#/en-US/...`, `#/en-CA/...`, `#/en-GB/...`.
- `LocaleGuard`:
  - Normalizes the URL locale casing (`/en-us/...` → `/en-US/...`).
  - Coerces unknown locales back to the default locale.
  - Loads locale resources and wraps the route subtree with `I18nProvider`.

**Important:** Auth UI (password screen) must be rendered inside `I18nProvider`. The route tree is structured so `LocaleGuard` wraps everything under `/:locale`.

### Message lookup

- `useI18n()` provides `t(key)`.
- If a key is missing, `t(key)` returns the key string (e.g., `settings.sections.general`).
  - This is helpful for spotting missing translations during manual testing.

### Locale resources

Each locale lives under:

- `src/locales/<locale>/messages.json` (primary UI strings)
- `src/locales/<locale>/medical-content.json` (medical demo content)
- `src/locales/<locale>/document-stack.json` (document stack demo content)

Locale support and normalization lives in:

- `src/i18n/locales.ts`

Resources loading lives in:

- `src/i18n/resources.*` (exact file name may vary)

## Best Practices (Rules to Follow)

### 1) Use `t("...")` for all user‑visible strings

Localize **all** of these:

- Visible UI text (headings, buttons, labels)
- Placeholder text
- Tooltips, dialogs, toast messages
- `aria-*` labels, `alt`, `title`
- Any sample/demo content that appears in UI

Avoid hard‑coding English strings directly in JSX/props.

### 2) Keep keys stable and structured

- Use dot‑paths grouped by feature: `settings.sections.profile`, `documentCard.orderDictation.newOrder`.
- Prefer nouns for sections and verbs for actions.
- Don’t reuse a key for unrelated text.

### 3) Prefer _literal keys_ over dynamic/template keys

Prefer:

```ts
t("settings.sections.profile");
```

Over:

```ts
t(`settings.sections.${id}`);
```

Dynamic keys are harder to validate. Use them only when the variable has a very tight union type (e.g., `"en" | "es"`) and you intentionally manage all variants.

### 4) Hook dependency correctness (stale locale prevention)

If you use `t(...)` inside `useMemo`/`useCallback`, include `t` in the dependency list (or otherwise ensure the value is recomputed on locale change).

### 5) Keep locale bundles complete

When adding a key to one locale, add it to all supported locales.

## Automated Guardrails (Must Run)

These scripts are designed to prevent the most common i18n breakages.

### Key coverage checker

```bash
npm run check:i18n
```

- Scans `src/` for `t("...")` calls.
- Verifies each referenced key exists as a string in **all** locales.

### Hook dependency checker

```bash
npm run check:i18n:hooks
```

- Scans `src/` for `useMemo/useCallback` blocks that call `t(...)`.
- Flags empty dependency arrays or deps that omit `t`.

### Run both

```bash
npm run check:i18n:all
```

### Build gate

```bash
npm run build
```

## Adding a New Locale (Step‑by‑Step)

### Step 1 — Pick the locale code

Decide the locale tag (BCP 47 style), e.g.:

- `es-ES` (Spanish - Spain)
- `fr-FR` (French - France)
- `pt-BR` (Portuguese - Brazil)

### Step 2 — Register the locale

Update `src/i18n/locales.ts`:

- Add the locale to `SUPPORTED_LOCALES`.
- If you need alias support, add it in `coerceSupportedLocale`.
- Decide fallback chain behavior (e.g., `fr-CA` → `fr-CA`, then `fr-FR`, then `en-US`).

### Step 3 — Create the locale folder and seed bundles

Create:

- `src/locales/<new-locale>/messages.json`
- `src/locales/<new-locale>/medical-content.json`
- `src/locales/<new-locale>/document-stack.json`

Best practice to start:

- Copy from `en-US/` and translate progressively.
- Keep the same JSON shape and keys.

### Step 4 — Ensure resources loader can load the locale

Update the locale resources loader (under `src/i18n/`) so `getLocaleResources(<new-locale>)` returns all required bundles.

### Step 5 — Validate with automated checks

Run:

```bash
npm run check:i18n:all
npm run build
```

Fix any missing keys or hook dependency issues before moving on.

### Step 6 — Manual runtime smoke test

Run:

```bash
npm run dev
```

Then open:

- `http://localhost:5173/#/<new-locale>/home`
- `http://localhost:5173/#/<new-locale>/task1-start`

What to look for:

- Any UI text showing raw keys like `documentCard.orderDictation.newOrder` (means missing translation).
- Any a11y labels that announce raw keys.
- Locale normalization working (e.g. `#/es-es/home` → `#/es-ES/home`).

## Troubleshooting

### “useI18n must be used within I18nProvider”

Cause:

- A component calling `useI18n()` is rendered outside `LocaleGuard`/`I18nProvider`.

Fix:

- Ensure the router renders `LocaleGuard` above anything that needs i18n (including authentication screens).

### Route not working (e.g., `#/en-CA/task1-start`)

Common causes:

- Auth: you’re redirected to the password screen.
- Locale normalization: URL casing is corrected and redirected.

### Missing translation keys in UI

If `t(key)` returns `key`, you’ll see dot‑paths in the UI. Use:

```bash
npm run check:i18n
```

to locate missing keys.

## Optional (Recommended) CI Integration

Add `npm run check:i18n:all` before `npm run build` in CI so localization regressions are blocked automatically.
