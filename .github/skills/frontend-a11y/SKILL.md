---
name: frontend-a11y
description: 'Accessibility audit for Meridian React components. Use when auditing WCAG 2.1 AA compliance, adding new interactive components, or reviewing healthcare UI accessibility. Covers Radix UI primitives, keyboard navigation, screen reader testing, and healthcare-specific patterns.'
---

# Frontend Accessibility Audit

## Workflow

1. **Identify scope** — which components or pages to audit
2. **Run automated checks** — axe-core, ESLint a11y plugin
3. **Manual keyboard audit** — tab order, focus traps, skip links
4. **Screen reader review** — ARIA roles, live regions, announcements
5. **Healthcare-specific checks** — patient data tables, call status, medication displays
6. **Fix and verify** — implement fixes, re-test

## Automated Testing

```bash
# Install axe-core for automated audits (if not present)
cd frontend && npm install --save-dev @axe-core/react

# ESLint a11y plugin (add to eslint.config.js if not present)
cd frontend && npm install --save-dev eslint-plugin-jsx-a11y
```

In development, add axe-core to `main.tsx` for console warnings:

```typescript
// Only in development — remove before production
if (import.meta.env.DEV) {
  import('@axe-core/react').then(({ default: axe }) => {
    axe(React, ReactDOM, 1000)
  })
}
```

## WCAG 2.1 AA Checklist — Healthcare UI

### Patient Data Tables

- [ ] Table has `<caption>` or `aria-label` describing content
- [ ] Column headers use `<th scope="col">`
- [ ] Row selection announced via `aria-selected`
- [ ] Sort state announced via `aria-sort`
- [ ] Empty state has descriptive message (not blank)
- [ ] Pagination controls are keyboard accessible

### Call Status & Controls

- [ ] Call status uses text + icon (not color alone)
- [ ] Phone/webchat buttons have descriptive `aria-label` (e.g., "Call Jane Doe")
- [ ] Active call state announced via `aria-live="polite"` region
- [ ] Call progress updates announced to screen readers
- [ ] Keyboard shortcut for ending calls (if applicable)

### Modals & Dialogs (Radix UI)

- [ ] Focus trapped inside open dialog (Radix handles this)
- [ ] Focus returns to trigger on close (Radix handles this)
- [ ] Escape key closes dialog (Radix handles this)
- [ ] Dialog has `aria-labelledby` pointing to title
- [ ] Long content scrollable via keyboard

### Forms (Login, Patient Edit, Prompt Edit)

- [ ] Every input has a visible `<label>` or `aria-label`
- [ ] Required fields indicated with `aria-required="true"`
- [ ] Error messages linked via `aria-describedby`
- [ ] Submit button disabled state announced
- [ ] Form errors summarized at top with links to fields

### Toast Notifications (Sonner)

- [ ] Toasts use `role="status"` or `aria-live="polite"`
- [ ] Error toasts use `role="alert"` for immediate announcement
- [ ] Toasts dismissible via keyboard (close button or auto-dismiss)
- [ ] Toast content is descriptive (not just "Error")

### Sidebar Navigation

- [ ] Current page indicated via `aria-current="page"`
- [ ] Navigation landmark: `<nav aria-label="Main navigation">`
- [ ] All nav items keyboard accessible
- [ ] Logout action has confirmation or undo

### Medication Displays

- [ ] Boolean medication facts (picked up, taking, side effects) use text labels not just icons
- [ ] "Unknown/null" states clearly communicated (not just empty)
- [ ] Medication list uses semantic `<ul>` or `<table>`

## Radix UI — Built-in A11y

Radix primitives handle most ARIA automatically. Don't override unless needed:

- **Dialog**: Focus trap, escape close, overlay click close, aria-labelledby
- **Select**: Keyboard navigation, typeahead, aria-expanded
- **Checkbox**: Checked/indeterminate states, keyboard toggle
- **Radio Group**: Arrow key navigation, grouping

**Do** customize:
- `aria-label` on icon-only buttons
- `aria-describedby` for supplementary help text
- `aria-live` regions for dynamic content updates

## Color & Contrast

- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 for large text and UI components
- Status indicators: always pair color with icon or text label
  - ✅ Green dot + "Completed" text
  - ❌ Green dot alone

## Keyboard Navigation Patterns

- **Tab**: Move between focusable elements
- **Enter/Space**: Activate buttons, toggle checkboxes
- **Arrow keys**: Navigate within radio groups, select menus, table rows
- **Escape**: Close modals, dismiss toasts, cancel actions
- **Skip link**: Add "Skip to main content" link as first focusable element

## Testing Commands

```bash
# Run Playwright a11y tests (if configured)
cd frontend && npx playwright test --grep a11y

# Check for a11y violations in CI
cd frontend && npx axe-cli http://localhost:5173 --exit
```

## Manual Testing Protocol

1. **Keyboard-only**: Unplug mouse, navigate entire workflow
2. **Screen reader**: Test with NVDA (Windows) or VoiceOver (macOS)
3. **Zoom**: Verify layout at 200% and 400% zoom
4. **Reduced motion**: Test with `prefers-reduced-motion: reduce`
5. **High contrast**: Test with Windows High Contrast Mode
