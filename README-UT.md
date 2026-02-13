# User Testing Guide (Tasks 1–9)

This document is a **hands-on guide** for manually user-testing the Task 1–Task 9 flows.

## Quick start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open the app:

   - Default locale (redirect):
     - `http://localhost:5173/#/`

## Login (required)

This app is protected by a simple password gate.

- **Password:** `Dr@g0nAzYb18`
- Session duration: **2 hours** (stored in `localStorage`)
- Testing shortcut: **Ctrl+Shift+L** logs out and reloads (useful to re-run the login flow)

## Supported locales

- Supported: `en-US`, `en-CA`, `en-GB`
- Default locale: `en-US`

## Routes

The app uses a HashRouter. There are two kinds of routes:

1. **Locale-prefixed routes** (recommended for testing)
2. **Legacy non-locale routes** that redirect to the default locale

### Route patterns (recommended)

Use this pattern for all testing:

- `http://localhost:5173/#/<locale>/<route>`

Where `<locale>` is one of: `en-US`, `en-CA`, `en-GB`.

### Available locale routes

| Route                                     | What it shows                                                |
| ----------------------------------------- | ------------------------------------------------------------ |
| `/#/<locale>/home`                        | Main app “home” experience                                   |
| `/#/<locale>/narrow`                      | Narrow wrapper (375px) for `home` (renders via iframe)       |
| `/#/<locale>/task1-start` … `task8-start` | **Narrow Task wrapper** (renders via iframe to `taskN-home`) |
| `/#/<locale>/task1-home` … `task8-home`   | Full Task content (the iframe target)                        |
| `/#/<locale>/task9-start`                 | Task 9 (standalone Contoso EHR screen)                       |

### Legacy routes

The following also exist, but redirect to the default locale (`en-US`):

- `/#/home`
- `/#/task1-home`, `/#/task1-start`
- `/#/task2-home`, `/#/task2-start`
- `/#/task3-home`, `/#/task3-start`
- `/#/task4-home`, `/#/task4-start`
- `/#/task5-home`, `/#/task5-start`
- `/#/task6-home`, `/#/task6-start`
- `/#/task7-home`, `/#/task7-start`
- `/#/task8-home`, `/#/task8-start`
- `/#/task9-start`
- `/#/narrow`

## How “success” is signaled

Tasks “hit success” by appending `success=true` to the current hash route.

Example:

- Before: `#/en-US/task4-start`
- After: `#/en-US/task4-start?success=true`

Important:

- Tasks 1–8 use a **narrow wrapper** that renders the real app in an iframe.
- Success is appended to the **parent window** hash when possible.

## Success conditions table (Tasks 1–9)

| Task | Recommended entry route   | Success trigger (what you do)                                                            | What to verify           |
| ---: | ------------------------- | ---------------------------------------------------------------------------------------- | ------------------------ |
|    1 | `/#/<locale>/task1-start` | Stop **ambient** recording (recording → stop while not in Dictation mode)                | URL gets `?success=true` |
|    2 | `/#/<locale>/task2-start` | Switch **to Dictation mode** while in document view                                      | URL gets `?success=true` |
|    3 | `/#/<locale>/task3-start` | Switch **to Ambient mode** (turn Dictation off) while in document view                   | URL gets `?success=true` |
|    4 | `/#/<locale>/task4-start` | Add a **Referral Letter** document (via Add or Library “Draft a referral letter”)        | URL gets `?success=true` |
|    5 | `/#/<locale>/task5-start` | Delete an **order item** from the Orders document                                        | URL gets `?success=true` |
|    6 | `/#/<locale>/task6-start` | Navigate to **Settings → Documents** sub-page                                            | URL gets `?success=true` |
|    7 | `/#/<locale>/task7-start` | Run Library pronoun replacement (“Change pronouns to they/them”) and wait for completion | URL gets `?success=true` |
|    8 | `/#/<locale>/task8-start` | Open the **Copilot panel** from the mic bar                                              | URL gets `?success=true` |
|    9 | `/#/<locale>/task9-start` | In Floating Memos, click **Copy memo**                                                   | URL gets `?success=true` |

## Step-by-step user test scenarios

### Common setup (recommended)

1. Open the task start route, e.g. `http://localhost:5173/#/en-US/task1-start`.
2. Log in with the password above.
3. Perform the task action.
4. Confirm the URL now includes `success=true`.

If you need to re-run login:

- Press **Ctrl+Shift+L**.

---

### Task 1 — Ambient recording stop

- Route: `/#/<locale>/task1-start`
- Goal: confirm success is triggered when ambient recording stops.

Steps:

1. Enter Task 1.
2. Select a patient (document view becomes visible).
3. Start ambient recording (use the mic control).
4. Stop recording.

Expected:

- When ambient recording transitions from **recording → stop** (and you are not in dictation mode), the app appends `?success=true`.

Notes:

- `en-GB` has a “Letter to GP” document seeded **empty** in Task 1.

---

### Task 2 — Switch to Dictation mode

- Route: `/#/<locale>/task2-start`
- Goal: confirm success is triggered when dictation mode becomes active.

Steps:

1. Enter Task 2 (starts with document view open).
2. Switch the mic mode to **Dictation** (e.g., via the dictation toggle/checkbox/tooltip).

Expected:

- URL updates with `?success=true` immediately after dictation mode becomes active.

Notes:

- In `en-GB`, “Letter to GP” should be present **with content** from Task 2 onward.

---

### Task 3 — Switch to Ambient mode

- Route: `/#/<locale>/task3-start`
- Goal: confirm success is triggered when dictation mode is turned off.

Steps:

1. Enter Task 3 (starts in dictation mode).
2. Switch to **Ambient** (turn dictation off).

Expected:

- URL updates with `?success=true`.

---

### Task 4 — Add Referral Letter

- Route: `/#/<locale>/task4-start`
- Goal: confirm success is triggered when a referral letter document is added.

Steps (either path):

- Path A (Add):

  1. Use the Add-document flow.
  2. Add a “Referral Letter”.

- Path B (Library):
  1. Open the Library panel.
  2. Choose the prompt that drafts a referral letter.

Expected:

- After a referral letter document is added, URL updates with `?success=true`.

Notes:

- `en-GB` referral letter content is sourced from the locale medical bundle.

---

### Task 5 — Delete an order

- Route: `/#/<locale>/task5-start`
- Goal: confirm success is triggered when an order is deleted.

Steps:

1. Enter Task 5.
2. Open the Orders document.
3. Delete a single order item.

Expected:

- URL updates with `?success=true`.

---

### Task 6 — Settings → Documents

- Route: `/#/<locale>/task6-start`
- Goal: confirm success is triggered when user reaches the Documents sub-page in Settings.

Steps:

1. Enter Task 6.
2. Open Settings.
3. Navigate to the **Documents** sub-page.

Expected:

- URL updates with `?success=true`.

---

### Task 7 — Pronoun replacement via Library

- Route: `/#/<locale>/task7-start`
- Goal: confirm success is triggered when pronoun replacement completes.

Steps:

1. Enter Task 7.
2. Open the Library panel.
3. Trigger the pronoun replacement request.
4. Wait for the request to complete (toast sequence + skeleton completion).

Expected:

- After completion, URL updates with `?success=true`.

Tip:

- The UI toast highlight text for this request is **“Change pronouns to they/them”**.

---

### Task 8 — Open Copilot panel

- Route: `/#/<locale>/task8-start`
- Goal: confirm success is triggered when the Copilot panel opens.

Steps:

1. Enter Task 8.
2. Click the Copilot control in the mic bar to open the Copilot panel.

Expected:

- URL updates with `?success=true` immediately when the panel opens.

---

### Task 9 — Copy memo (Contoso EHR)

- Route: `/#/<locale>/task9-start`
- Goal: confirm success is triggered when copying a memo.

Steps:

1. Enter Task 9.
2. In the floating mic bar, locate the Floating Memos panel.
3. Click the **Copy memo** action.

Expected:

- URL updates with `?success=true`.
