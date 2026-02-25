---
name: prd
description: >
  Generate Product Requirements Documents for Meridian features. Use when
  defining new features, creating user stories, or writing acceptance
  criteria. Outputs structured PRD with GH-0XX user story IDs, HIPAA
  considerations, and Azure service dependencies. Trigger: 'create prd',
  'write requirements', 'define feature', 'new user stories'.
---

# Create PRD

Generate detailed, actionable Product Requirements Documents for Meridian.

## Before Writing

1. **Ask clarifying questions** (3-5) to reduce ambiguity about scope, audience, constraints
2. **Analyse codebase** to understand architecture, integration points, technical constraints
3. **Review existing PRD** at `implementation-docs/prd.md` for conventions and ID ranges

## Output Location

Save PRD to `implementation-docs/` directory. Name: `prd-{feature}.md` or update existing `prd.md`.

Product documentation (user-facing) goes in `docs/`. PRDs are implementation artifacts.

## PRD Structure

### PRD: {project_title}

### 1. Product overview

- 1.1 Document title and version
- 1.2 Product summary (2-3 paragraphs)

### 2. Goals

- 2.1 Business goals
- 2.2 User goals
- 2.3 Non-goals

### 3. User personas

- 3.1 Key user types
- 3.2 Basic persona details
- 3.3 Role-based access (nurse, admin — maps to Meridian auth roles)

### 4. Functional requirements

- **{feature_name}** (Priority: {level}) with specific requirements

### 5. User experience

- 5.1 Entry points and first-time user flow
- 5.2 Core experience
- 5.3 Advanced features and edge cases
- 5.4 UI/UX highlights (WCAG 2.1 AA for healthcare accessibility)

### 6. Narrative

Concise user journey paragraph.

### 7. Success metrics

- 7.1 User-centric, 7.2 Business, 7.3 Technical

### 8. Technical considerations

- 8.1 Integration points (Cosmos DB, FHIR, Voice Live, MAF agents)
- 8.2 Data storage and privacy (**HIPAA**: audio never persisted, FHIR read-only, PHI scrubbed from logs)
- 8.3 Scalability and performance
- 8.4 Potential challenges

### 9. Milestones and sequencing

- Suggested phases with key deliverables

### 10. User stories

Each user story:

- **ID**: GH-0XX (continuing from existing range GH-001 through GH-017)
- **Description**: As a {role}, I can {action} so that {benefit}
- **Acceptance criteria**: testable bullet list

## Formatting Rules

- Title case for main title only; sentence case for all other headings
- No horizontal rules or dividers
- Valid Markdown, no disclaimers or footers
- Every user story must be testable
- Include auth/security user story if applicable

## After PRD

Ask user for approval. Then offer to create GitHub issues for user stories.
