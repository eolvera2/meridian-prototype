# Self-Guided PRD: Care Coordination View — Vite + React + TypeScript + Fluent UI v9

**Framework Version:** 2.0  
**Last Updated:** February 26, 2026  
**Target Technology Stack:** Vite 7, React 19, TypeScript 5.8, Fluent UI v9, Griffel  
**Development Methodology:** Shell-First Incremental Component Development  
**Domain:** Healthcare Care Coordination — AI-Assisted Outreach Campaigns

---

## Table of Contents

1. [Framework Overview](#framework-overview)
2. [Project Setup Guidelines](#project-setup-guidelines)
3. [Architecture Foundation](#architecture-foundation)
4. [Care Coordination Feature Architecture](#care-coordination-feature-architecture)
5. [Component Development Framework](#component-development-framework)
6. [Phase-Based Development Process](#phase-based-development-process)
7. [Design System Standards](#design-system-standards)
8. [Component Templates & Patterns](#component-templates--patterns)
9. [Technical Implementation Guidelines](#technical-implementation-guidelines)
10. [Quality Assurance Framework](#quality-assurance-framework)
11. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
12. [Validation Checklists](#validation-checklists)

---

## Framework Overview

### Purpose

This self-guided PRD documents the architecture, patterns, and implementation details of the Meridian Care Coordination prototype — a healthcare-focused React application that demonstrates AI-assisted patient outreach campaigns across three clinical workflows: Medication Adherence, Patient Intake, and Hypertension Management. It serves as both a living specification and a development guide for extending the platform.

### Key Principles

- **Shell-First Development**: Start with application structure, then add complexity incrementally
- **Component-Driven Architecture**: Build reusable, testable components organized by domain
- **Progressive Enhancement**: Add features incrementally with validation at each step
- **Design System Consistency**: Leverage Fluent UI v9 tokens and components for cohesive UX
- **Type Safety**: Use TypeScript throughout with strict mode for better developer experience
- **Context-Driven State**: Use React Context for domain-scoped state management without external libraries

### Expected Outcomes

- Faster prototype development (30-50% reduction in initial development time)
- Fewer architectural errors through proven patterns
- Consistent UI/UX across components following Fluent UI v9 design language
- Maintainable and scalable codebase organized by feature domains
- Clear development progression and milestones

---

## Project Setup Guidelines

### 1. Technology Stack Configuration

#### Core Dependencies

```json
{
  "dependencies": {
    "@fluentui/react-components": "^9.72.7",
    "@fluentui/react-icons": "^2.0.315",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.9.6"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.5.2",
    "vite": "^7.0.0",
    "eslint": "^9.29.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.34.1",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20"
  }
}
```

#### Project Structure

```
project-root/
├── docs/                                  # Project documentation & PRDs
├── public/                                # Static assets (audio files, images)
├── src/
│   ├── components/
│   │   ├── foundation/                    # App shell (TitleBar, Navigation, BodyContent)
│   │   ├── content/
│   │   │   ├── careCoordinationWorklist/  # ★ Care Coordination feature module
│   │   │   │   ├── CareCoordinationDashboard.tsx
│   │   │   │   ├── CareCoordinationDashboard.styles.ts
│   │   │   │   ├── CareCoordinationPatientDetail.tsx
│   │   │   │   ├── CareCoordinationPatientDetail.styles.ts
│   │   │   │   ├── CareCoordinationWorklistContext.tsx
│   │   │   │   ├── CareCoordinationWorklist.types.ts
│   │   │   │   ├── AddPatientForm.tsx
│   │   │   │   ├── AddPatientForm.styles.ts
│   │   │   │   ├── AICallTranscriptModal.tsx
│   │   │   │   ├── AICallTranscriptModal.styles.ts
│   │   │   │   ├── TeamsDialerPopup.tsx
│   │   │   │   ├── TeamsDialerPopup.styles.ts
│   │   │   │   └── index.ts
│   │   │   └── ...
│   │   ├── shared/                        # Shared cross-feature components
│   │   └── auth/                          # Authentication components
│   ├── data/
│   │   └── careCoordinationWorklistData.json  # Patient data (32 records)
│   ├── styles/                            # Global styles
│   ├── utils/                             # Utility functions
│   └── main.tsx                           # Application entry point
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js
```

### 2. Essential Configuration

#### Vite Configuration

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": "/src" } },
  optimizeDeps: {
    include: ["@fluentui/react-components", "@fluentui/react-icons"],
  },
});
```

#### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

---

## Architecture Foundation

### 1. Application Shell

The application follows a shell-first architecture where `App.tsx` provides:

- **FluentProvider** wrapping with theme configuration
- **Router** with navigation between views (Home, Care Coordination, etc.)
- **Context Providers** for state management scoped by feature domain
- **TitleBar** with global navigation and user actions

### 2. Context Architecture Pattern

Each major feature domain uses a dedicated React Context with co-located types:

```
FeatureContext.tsx    → Context provider + consumer hook + state logic
Feature.types.ts     → TypeScript interfaces for the feature
FeatureDashboard.tsx → Main view consuming context
FeatureDetail.tsx    → Detail panel consuming context
```

**Key Principle**: Context holds both data and actions. Components consume what they need via a custom hook (`useWorklistContext()`). No prop drilling.

### 3. Component File Pairing

Every component follows a strict `.tsx` + `.styles.ts` pairing:

```typescript
// ComponentName.styles.ts — Griffel makeStyles at module level
export const useStyles = makeStyles({
  root: { /* ... */ },
  header: { /* ... */ },
});

// ComponentName.tsx — Imports and uses styles
const styles = useStyles();
```

---

## Care Coordination Feature Architecture

### Overview

The Care Coordination view is a single-screen campaign management interface for healthcare outreach. It combines an **Admin Analytics Dashboard** with a **Patient Contact List** and a **Patient Detail Panel**, enabling care coordinators to manage AI-assisted patient calls across three clinical workflows.

### Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  TITLE BAR (App Header)                                       │
├──────────────┬───────────────────────────────────────────────┤
│              │                                               │
│  Navigation  │  Care Coordination View                       │
│  Sidebar     │  ┌─────────────────────┬────────────────────┐ │
│              │  │ Patient Contact List │ Patient Detail     │ │
│              │  │ (or Admin Dashboard) │ Panel              │ │
│              │  │                      │                    │ │
│              │  └─────────────────────┘────────────────────┘ │
│              │                                               │
├──────────────┴───────────────────────────────────────────────┤
│  FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

### Data Model

#### Core Types

```typescript
// Call types supported by the system
type CallType = "medication-adherence" | "patient-intake" | "hypertension-management";

// Status lifecycle for call records
type CallRecordStatus =
  | "in-progress"         // Call currently active
  | "needs-review"        // Call completed, awaiting nurse review
  | "completed"           // Reviewed and closed
  | "scheduled-for-retry" // Failed attempt, will retry
  | "reviewed"            // Marked as reviewed by nurse
  | "scheduled";          // Scheduled but not yet called
```

#### ContactRecord — Historical Call Data

Represents a completed or scheduled call with clinical outcomes:

- **Identity fields**: id, patientId, name, phone
- **Call metadata**: callType, contactDate, contactTime, daysAgo
- **Medication Adherence outcomes**: pickedUpMeds, takingAsRx, sideEffects, painLevel, followUp
- **Patient Intake outcomes** (optional): intakeCompleted, allergiesConfirmed, redFlag, symptomsReported
- **Hypertension outcomes** (optional): bpReading (systolic/diastolic), bpAtGoal, medAdherence, symptomsPresent, escalated
- **Status flags**: reviewed (boolean), scheduledForRetry, scheduled, statusUrgencyNote

Each outcome field uses `{ value: string; warning: boolean }` to drive icon/color styling.

#### ActiveCallRecord — Live Call State

Same fields as ContactRecord but uses `status: CallRecordStatus` enum instead of separate boolean flags.

#### Patient Worklist Item — Full Patient Record

Complete patient record including demographics, contact history, medications, appointments, and clinical data. Loaded from `careCoordinationWorklistData.json`.

### Context API

The `CareCoordinationWorklistContext` provides:

| Category | Members |
|----------|---------|
| **State** | patients, selectedPatientId, activeCallRecords, contactRecords, activeDialerCall, callTypeFilter |
| **Patient Actions** | setSelectedPatientId, addPatient, removeFromQueue |
| **Call Actions** | callPatients, resolveCallRecord, dismissDialer |
| **Review Actions** | markPatientAsReviewed, isPatientNeedsReview |
| **Filter Actions** | setCallTypeFilter |

### Initial Data

The system initializes with **22 ContactRecords**:

| Range | Count | Type | Status |
|-------|-------|------|--------|
| cr-1 to cr-8 | 8 | Medication Adherence | Active (mixed outcomes, 2 scheduled for retry) |
| cr-9 | 1 | Patient Intake | Active (intake completed) |
| cr-10 | 1 | Hypertension Management | Active (BP not at goal, urgency note) |
| cr-11 to cr-14 | 4 | Medication Adherence | Reviewed |
| cr-15 | 1 | Patient Intake | Reviewed |
| cr-16, cr-17 | 2 | Hypertension Management | Reviewed |
| cr-18 to cr-22 | 5 | Mixed | Scheduled (no contact date) |

Plus **32 full patient records** from JSON with demographics, contact history, medications, and AI-generated transcript summaries (400-600 chars each).

---

## Component Development Framework

### 1. CareCoordinationDashboard — Main View

The dashboard component serves dual purposes: an **Admin Analytics Dashboard** and a **Patient Contact List**, toggled via a switch.

#### Admin Dashboard (Analytics View)

```
┌─────────────────────────────────────────────────┐
│ Header: "Care Coordination" + Toggle Switch      │
│ Filters: Time Range | Call Type | Advanced       │
├─────────────────────────────────────────────────┤
│ Stats Grid (4 cards):                            │
│ ┌──────────┬──────────┬──────────┬──────────┐   │
│ │ Adherence│ Patients │ Contact  │ Follow-up│   │
│ │ Rate %   │ at Risk  │ Rate %   │ Needed   │   │
│ └──────────┴──────────┴──────────┴──────────┘   │
├─────────────────────────────────────────────────┤
│ Charts (collapsible):                            │
│ ┌──────────┬──────────────┬─────────────────┐   │
│ │ Trend    │ Non-Adherence│ Outreach        │   │
│ │ Line     │ Drivers      │ Effectiveness   │   │
│ │ Chart    │ Bar Chart    │ Horiz. Bars     │   │
│ └──────────┴──────────────┴─────────────────┘   │
└─────────────────────────────────────────────────┘
```

**Stats Cards** use semantic color-coding:
- **Good** (≥85% adherence, ≥70% contact): Green left border
- **Warning** (≥70% adherence, ≥50% contact): Yellow left border
- **Critical** (<70% adherence, <50% contact): Red left border

#### Patient Contact List

```
┌────────────────────────────────────────────────────────────┐
│ Header: "Patient Contact List"                              │
│ Right: Summary Counters                                     │
│  ┌───────┐ ┌─────────┬───────────┬──────────┐             │
│  │ Total │ │Need Rev.│In Progress│ Reviewed │             │
│  │  22   │ │   8     │    2      │    7     │             │
│  └───────┘ │Scheduled│Will Retry │          │             │
│            │   5     │    2      │          │             │
│            └─────────┴───────────┴──────────┘             │
├────────────────────────────────────────────────────────────┤
│ Filters Row:                                                │
│ [Contact Status ▼] [Call Type ▼] [Patient Search] [↻]      │
├────────────────────────────────────────────────────────────┤
│ Table (6 sortable columns):                                 │
│ Patient Name | Call Type | Contact Date↓ | Outcomes | F/U | Status │
│ ──────────────────────────────────────────────────────────  │
│ ...                                                         │
├────────────────────────────────────────────────────────────┤
│ Pagination: ◄ Page 1 of 3 ► Showing 1-10 of 22            │
└────────────────────────────────────────────────────────────┘
```

##### Summary Counters Layout

The counters are arranged with a **Total** badge on the left and a **3x2 grid** on the right:

| Row | Col 1 | Col 2 | Col 3 |
|-----|-------|-------|-------|
| 1 | Need Review | In Progress | Reviewed |
| 2 | Scheduled | Will Retry | — |

##### Filter System

| Filter | Component | Options |
|--------|-----------|---------|
| Contact Status | `Dropdown` (controlled) | **All Active Statuses** (bold, default), All Statuses, In Progress, Ready for Review, Scheduled, Scheduled for Retry, Reviewed |
| Call Type | `Dropdown` | All Types, Medication Adherence, Patient Intake, Hypertension Management |
| Patient Search | `Combobox` (freeform) | Type-ahead with patient name suggestions |
| Refresh | `Button` (icon) | `ArrowSync16Regular` |

**"All Active Statuses"** (default) filters to everything **except** Reviewed.  
**"All Statuses"** includes Reviewed records.

##### Table Columns

| Column | Sortable | Content |
|--------|----------|---------|
| Patient Name | Yes | Clickable link → opens Patient Detail panel |
| Call Type | Yes | Color-coded pill badge |
| Contact Date | Yes (default desc) | Date + time; "--" for scheduled records |
| Outcomes | No | Icon grid with warning/success indicators |
| Follow-up | Yes | Text with optional warning icon |
| Status | Yes | Status pill with icon |

##### Column Sorting (Fluent UI Best Practices)

- **Unsorted columns**: Dimmed `ArrowSort16Regular` icon (visible on hover)
- **Active sort column**: Bold `ArrowSortUp16Filled` or `ArrowSortDown16Filled`
- Default sort: **Contact Date descending** (most recent first)
- **Empty dates** ("--") always sort to bottom regardless of direction

##### Status Pills

| Status | Label | Icon | Text Color | Background |
|--------|-------|------|------------|------------|
| In Progress | "In Progress" | `Timer16Regular` | Blue | Light Blue |
| Needs Review | "Ready for Review" | `Checkmark16Regular` | Green (#0E700E) | Light Green |
| Scheduled for Retry | "Will Retry" | `HourglassRegular` | Purple (#5B2D8E) | Light Purple (#F3E8FD) |
| Reviewed | "Reviewed" | `Checkmark16Regular` | Dark Gray (#424242) | Light Gray (#F0F0F0) |
| Scheduled | "Scheduled" | `HourglassRegular` | Purple (#5B2D8E) | Light Purple (#F3E8FD) |

##### Call Type Pills

| Call Type | Label | Color Scheme |
|-----------|-------|-------------|
| medication-adherence | Medication Adherence | Blue |
| patient-intake | Patient Intake | Teal |
| hypertension-management | Hypertension Mgmt | Purple |

##### Outcome Icons (by Call Type)

**Medication Adherence:**

| Outcome | Good Icon | Warning Icon |
|---------|-----------|--------------|
| Picked up meds | `ShoppingBagCheckmark20Regular` | `ShoppingBagDismiss20Filled` |
| Taking as Rx | `ClipboardCheckmark20Regular` | `ClipboardError20Filled` |
| Side effects | `ChatMultipleCheckmark20Regular` | `ChatMultipleMinus20Filled` |
| Pain level | Numeric circle (green/yellow/orange/red) | — |

**Patient Intake:**

| Outcome | Good Icon | Warning Icon |
|---------|-----------|--------------|
| Intake complete | `DocumentCheckmark20Regular` | `DocumentDismiss20Filled` |
| Allergies | `LeafOne20Regular` | `LeafThree20Filled` |
| Red flag | `BookPulse20Regular` | `BookDismiss20Filled` |

**Hypertension Management:**

| Outcome | Good Icon | Warning Icon |
|---------|-----------|--------------|
| BP reading | `HeartPulseCheckmark20Regular` | `HeartPulseWarning20Filled` |
| BP at goal | `FlagCheckered20Regular` | `FlagOff20Filled` |
| Med adherence | `History20Regular` | `HistoryDismiss20Filled` |
| Escalated | `Emoji20Regular` | `EmojiAngry20Filled` |

---

### 2. CareCoordinationPatientDetail — Detail Panel

When a patient is selected from the contact list, the detail panel appears on the right.

#### Layout Structure

```
┌───────────────────────────────────────┐
│ Header: Patient Name + Call Type Badge │
│ Action buttons (Call, Add Note, etc.)  │
├───────────────────────────────────────┤
│ Accent Bar (colored divider)           │
├───────────────────────────────────────┤
│ CONTACT HISTORY                        │
│ ┌─────────────────────────────────┐   │
│ │ Entry 1 (most recent)           │   │
│ │ Date · Time · Duration          │   │
│ │ [View AI Transcript] [Review]   │   │
│ │                                 │   │
│ │ AI Call Summary (italic)        │   │
│ │ "AI-generated content may..."   │   │
│ │                                 │   │
│ │ Outcome Grid (call-type-specific)│   │
│ │                                 │   │
│ │ NOTES [editable textarea]       │   │
│ └─────────────────────────────────┘   │
├───────────────────────────────────────┤
│ MEDICATIONS (card grid with refills)   │
├───────────────────────────────────────┤
│ PATIENT INFORMATION (2-column grid)    │
└───────────────────────────────────────┘
```

#### Contact History Entry — Key Features

1. **Single-row header**: Date, call time/duration, transcript link, and review button all in one flex row
2. **Needs-review highlighting**: First entry gets yellow background (`#FFF8E1`) with orange-red left border (`3px solid #CA5010`)
3. **AI Call Summary**: Detailed narrative (400-600 chars), followed by centered italic disclaimer: *"AI-generated content may be incorrect"* (10px, `#707070`)
4. **Side effects**: Values other than "Not reported" render with `Warning16Regular` icon + red `outcomeNegative` styling
5. **Editable NOTES**: Native `<textarea>` with tooltip/dictation handlers for mic cursor integration
6. **Transcript link**: Opens `AICallTranscriptModal` showing the full AI-Patient conversation

#### Conditional Sections by Call Type

| Section | Medication Adherence | Patient Intake | Hypertension |
|---------|---------------------|----------------|--------------|
| Discharge Date/Instructions | Yes | No | No |
| Upcoming Appointment | No | Yes | No |
| Allergies | No | Yes | No |
| Medical/Surgical History | No | Yes | No |
| Recent BP Readings | No | No | Yes |
| Home BP Monitor | No | No | Yes |
| Lifestyle Notes | No | No | Yes |

---

### 3. AddPatientForm — Patient Onboarding + Campaign Configuration

The Add Patient form is a modal dialog that combines patient registration with outreach campaign configuration.

#### Form Sections (in order)

```
┌─────────────────────────────────────────┐
│ 1. PATIENT INFORMATION                   │
│    Record ID* (full-width, required)     │
│    First Name* | Last Name*              │
│    Gender      | Language Preference     │
├─────────────────────────────────────────┤
│ 2. OUTREACH CAMPAIGN                    │
│    Call Type [Dropdown]                  │
│    Campaign Description (read-only)      │
│    Outcomes Grid (2-column)              │
│    Campaign Settings (bordered card)     │
├─────────────────────────────────────────┤
│ 3. DEMOGRAPHICS & CLINICAL (auto-fill)  │
├─────────────────────────────────────────┤
│ 4. CALL-TYPE-SPECIFIC FIELDS            │
│    Medications (med-adherence only)      │
│    Intake Details (patient-intake only)  │
│    BP & Lifestyle (hypertension only)    │
├─────────────────────────────────────────┤
│              [Schedule Call]             │
└─────────────────────────────────────────┘
```

#### Campaign Descriptions

| Call Type | Description |
|-----------|-------------|
| Medication Adherence | Post-discharge medication follow-up to ensure patients are taking prescribed medications correctly, identify barriers to adherence, and coordinate refills or care team interventions. |
| Patient Intake | Pre-appointment intake calls to collect medical history, current medications, allergies, and reason for visit before scheduled appointment. |
| Hypertension Management | Ongoing blood pressure management outreach to monitor home readings, assess medication adherence, coach on lifestyle modifications, and escalate uncontrolled hypertension. |

#### Campaign Outcomes by Call Type

**Medication Adherence** (6 items, 2-column grid):
1. Confirm Rx pickup
2. Verify medication adherence
3. Capture side effects
4. Assess pain level
5. Determine follow-up needs
6. Set medication reminders

**Patient Intake** (5 items):
1. Confirm intake completion
2. Verify allergies
3. Collect medical history
4. Record current symptoms
5. Screen for red flags

**Hypertension Management** (5 items):
1. Record BP reading
2. Assess BP goal status
3. Verify medication adherence
4. Screen for symptoms
5. Determine escalation needs

#### Campaign Settings by Call Type

| Setting | Med Adherence | Patient Intake | Hypertension |
|---------|--------------|----------------|--------------|
| Recurrence (days/weeks/months) | Yes (default: 7 days) | No | Yes (default: 7 days) |
| Days before appointment | No | Yes (default: 2) | No |
| Timing window | Yes | Yes | Yes |
| Start/End dates | Yes | Yes | Yes |
| Retry count | Yes (default: 3) | Yes (default: 3) | Yes (default: 3) |
| Retry interval (hours) | Yes (default: 2) | Yes (default: 2) | Yes (default: 2) |
| Leave voicemail on last attempt | Yes (default: on) | Yes (default: on) | Yes (default: on) |
| Live transfer for escalations | Yes (default: off) | Yes (default: off) | Yes **(default: on)** |

#### Timing Window Options

- Weekday mornings (8 AM - 12 PM)
- Weekday afternoons (12 PM - 5 PM)
- Weekdays (8 AM - 5 PM)
- Any day (8 AM - 8 PM)

#### Schedule Call Button Behavior

- **Icon**: `Call20Regular`
- **Appearance**: Primary (blue), height 44px
- **Disabled when**: required identifier, First Name, or Last Name are empty
- **On click**: Creates patient with `status: "Scheduled"`, `group: "contact-list"`, adds to Patient Contact List with `contactDate: "--"` and `followUp: "--"`

#### Auto-Fill on Identifier Entry

When the record identifier field loses focus (onBlur), the form auto-populates demographics with realistic sample data appropriate to the selected call type (diagnosis, medications, appointment info, etc.).

---

### 4. AICallTranscriptModal — Transcript Viewer

A draggable overlay modal displaying the full AI-Patient call transcript.

- **Conversation bubbles**: Each message shows speaker identity (AI System / Patient), initials avatar, timestamp, and content in a Card component
- **Event badges**: Highlighted outcomes detected during the call (e.g., "Medication picked up", "BP reading recorded")
- **Three transcript templates**: One per call type with realistic clinical dialogue

### 5. TeamsDialerPopup — Call Simulation

A draggable popup simulating a Teams call interface:

- **Elapsed timer**: HH:MM:SS format counting up
- **Controls**: Mic toggle, Speaker toggle, More options, Hang up (red)
- **Patient info**: Name and phone number display
- **Audio**: Plays sample call audio on mount

---

## Phase-Based Development Process

### Phase 1: Foundation Shell

#### Objectives
- Establish project structure with Vite + React 19 + TypeScript
- Configure Fluent UI v9 with FluentProvider and theme
- Build application shell (TitleBar, Navigation, BodyContent)
- Set up routing with react-router-dom

#### Deliverables
- [ ] Project scaffolded with Vite
- [ ] Fluent UI v9 integrated with Griffel styling
- [ ] Basic navigation between views
- [ ] Theme configuration working
- [ ] TypeScript strict mode compilation clean

### Phase 2: Data Model & Context

#### Objectives
- Define TypeScript interfaces for all domain entities
- Build the WorklistContext with initial patient data
- Load JSON patient records
- Implement core actions (select patient, filter, sort)

#### Deliverables
- [ ] Types file with all interfaces
- [ ] Context provider with hook and full action set
- [ ] Patient data JSON with 30+ realistic records
- [ ] Contact records with mixed statuses and call types

### Phase 3: Dashboard & Contact List

#### Objectives
- Build the main dashboard with admin analytics toggle
- Implement the Patient Contact List with all columns
- Add filtering, sorting, and pagination
- Create status/outcome pill components

#### Deliverables
- [ ] Stats cards with semantic color-coding
- [ ] SVG charts (trend line, bar charts)
- [ ] 6-column sortable table with pagination
- [ ] Filter dropdowns (status, call type, patient search)
- [ ] Summary counter badges with 3x2 grid layout

### Phase 4: Patient Detail Panel

#### Objectives
- Build the patient detail panel with contact history
- Implement conditional sections by call type
- Add interactive elements (transcript link, review button, editable notes)
- Create medication cards and patient info grid

#### Deliverables
- [ ] Contact history entries with outcome grids
- [ ] AI call summary with disclaimer
- [ ] Editable notes textarea with tooltip integration
- [ ] Medication cards with refill buttons
- [ ] Conditional patient info sections

### Phase 5: Add Patient & Campaign Configuration

#### Objectives
- Build the Add Patient modal form
- Implement Outreach Campaign settings with call-type-specific configurations
- Add auto-fill behavior
- Connect Schedule Call to Patient Contact List

#### Deliverables
- [ ] Patient information form with validation
- [ ] Campaign description and outcomes display
- [ ] Dynamic campaign settings (recurrence, timing, retries, etc.)
- [ ] Schedule Call creates patient with Scheduled status
- [ ] Auto-fill with realistic clinical data

### Phase 6: Modals & Interactions

#### Objectives
- Build AI Call Transcript modal
- Build Teams Dialer popup
- Implement call flow (initiate → active → resolve → needs review → reviewed)
- Add Mark as Reviewed workflow

#### Deliverables
- [ ] Draggable transcript modal with conversation view
- [ ] Draggable dialer with timer and audio playback
- [ ] Full call lifecycle management
- [ ] Status transitions work correctly

---

## Design System Standards

### 1. Color Palette

#### Semantic Status Colors

```typescript
const statusColors = {
  inProgress:      { text: "blue",     bg: "light blue" },
  needsReview:     { text: "#0E700E",  bg: "#E6F4E6" },      // Green
  scheduledRetry:  { text: "#5B2D8E",  bg: "#F3E8FD" },      // Purple
  reviewed:        { text: "#424242",  bg: "#F0F0F0" },      // Gray
  scheduled:       { text: "#5B2D8E",  bg: "#F3E8FD" },      // Purple

  positive:        "#0E700E",   // Green
  negative:        "#D13438",   // Red
  warning:         "#CA5010",   // Orange
  neutral:         "#707070",   // Gray

  urgentHighlight: "#FFF8E1",   // Yellow background
  urgentBorder:    "#CA5010",   // Orange border
};
```

#### Pain Level Scale

| Level | Color | Severity |
|-------|-------|----------|
| 0 | #0E700E (Green) | No pain |
| 1-3 | #FFC107 (Yellow) | Mild |
| 4-6 | #FF9800 (Orange) | Moderate |
| 7-10 | #D13438 (Red) | Severe |

### 2. Typography

| Use Case | Size | Weight |
|----------|------|--------|
| Page title | 600 | semibold |
| Section header | 500 | semibold |
| Table header | 300 | semibold |
| Body text | 400 | regular |
| Caption / metadata | 200 | regular |
| AI disclaimer | 10px inline | regular italic |

### 3. Spacing

| Context | Value |
|---------|-------|
| Card padding | `tokens.spacingHorizontalM` (12px) |
| Section gap | `tokens.spacingVerticalM` (12px) |
| Filter row gap | `tokens.spacingHorizontalS` (8px) |
| Contact entry padding | `12px 16px 12px 0` |

### 4. Icon Usage

All icons from `@fluentui/react-icons`:

- **16px icons**: Sort indicators, status pill icons, warning indicators
- **20px icons**: Outcome grid icons, action buttons, patient info labels
- **24px icons**: Transcript link, major actions

Pattern: `*Regular` for default state, `*Filled` for active/warning state.

---

## Component Templates & Patterns

### 1. Status Pill Pattern

```typescript
const statusConfig = {
  "in-progress":         { icon: <Timer16Regular />,      class: "statusPillInProgress",  label: "In Progress" },
  "needs-review":        { icon: <Checkmark16Regular />,  class: "statusPillNeedsReview", label: "Ready for Review" },
  "scheduled-for-retry": { icon: <HourglassRegular />,    class: "statusPillRetry",       label: "Will Retry" },
  "reviewed":            { icon: <Checkmark16Regular />,  class: "statusPillReviewed",    label: "Reviewed" },
  "scheduled":           { icon: <HourglassRegular />,    class: "statusPillScheduled",   label: "Scheduled" },
};
```

### 2. Outcome Icon Pattern

```typescript
// Dual-icon outcome indicator (positive/negative)
const OutcomeIcon = ({ value, warning, goodIcon, badIcon, label }) => (
  <Tooltip content={`${label}: ${value}`} relationship="label">
    <span className={warning ? styles.outcomeWarning : styles.outcomeGood}>
      {warning ? badIcon : goodIcon}
    </span>
  </Tooltip>
);
```

### 3. Sortable Column Header Pattern

```typescript
// Fluent UI best practice: dimmed neutral icon → bold active icon
const SortIcon = ({ column }) => {
  if (sortColumn !== column) {
    return <ArrowSort16Regular style={{ opacity: 0.4 }} />;
  }
  return sortDirection === "asc"
    ? <ArrowSortUp16Filled />
    : <ArrowSortDown16Filled />;
};
```

### 4. Controlled Dropdown with Bold Option

```typescript
// When using JSX children in <Option>, provide explicit text prop
<Dropdown value={displayText} selectedOptions={[filterValue]}
  onOptionSelect={(_, data) => {
    setFilterValue(data.optionValue);
    setDisplayText(data.optionText ?? "");
  }}
>
  <Option value="all-active" text="All Active Statuses">
    <strong>All Active Statuses</strong>
  </Option>
  <Option value="all">All Statuses</Option>
</Dropdown>
```

### 5. Empty-Date Sort Pattern

```typescript
// Push records with no contact date to bottom regardless of direction
if (sortColumn === "contactDate") {
  const aEmpty = a.contactDate === "--";
  const bEmpty = b.contactDate === "--";
  if (aEmpty && !bEmpty) return 1;   // Empty always at bottom
  if (!aEmpty && bEmpty) return -1;
  if (aEmpty && bEmpty) return 0;
  // Lower daysAgo = more recent, so invert for natural sort
  cmp = (rb.daysAgo ?? 0) - (ra.daysAgo ?? 0);
}
```

---

## Technical Implementation Guidelines

### 1. Performance Optimization

#### Context Value Memoization

```typescript
const contextValue = useMemo(() => ({
  patients, selectedPatientId, activeCallRecords, contactRecords,
  setSelectedPatientId, callPatients, resolveCallRecord,
  markPatientAsReviewed, addPatient, removeFromQueue,
}), [patients, selectedPatientId, activeCallRecords, contactRecords]);
```

#### Table Record Computation

```typescript
// Combine active + history records, apply filters, then sort
const allTableRecords = useMemo(() => {
  let combined = [
    ...activeCallRecords.map(r => ({ type: "active", record: r })),
    ...contactRecords.map(r => ({ type: "history", record: r })),
  ];
  combined = combined.filter(filterPredicate);
  combined.sort(sortComparator);
  return combined;
}, [activeCallRecords, contactRecords, statusFilter, callTypeFilter,
    patientSearch, sortColumn, sortDirection]);
```

### 2. Dynamic Call Resolution

When a call is completed (`resolveCallRecord`), the system:

1. Selects an outcome from type-specific pools (cycling indices)
2. Generates a detailed transcript summary (400-600 chars)
3. Creates a ContactHistoryEntry with populated clinical fields
4. Updates the patient's contact history in the registry
5. Transitions the record from ActiveCallRecord to ContactRecord with status "needs-review"

### 3. Accessibility

- All interactive elements are keyboard accessible
- ARIA labels on icon-only buttons
- Tooltips on outcome icons provide text descriptions
- Focus management in modal dialogs
- Color is never the sole indicator (always paired with icons or text)

---

## Quality Assurance Framework

### Manual Testing Checklist

- [ ] All 6 status types render with correct pill styling
- [ ] Contact Status "All Active Statuses" excludes Reviewed records
- [ ] Column sorting cycles through asc/desc correctly
- [ ] Empty contact dates ("--") appear at table bottom
- [ ] Patient search filters table in real-time
- [ ] Add Patient form validates required fields before enabling Schedule Call
- [ ] Schedule Call adds patient to Contact List with Scheduled status
- [ ] Campaign settings update dynamically per call type
- [ ] Mark as Reviewed transitions record to Reviewed status
- [ ] AI Call Transcript modal opens and displays conversation
- [ ] TeamsDialerPopup plays audio and shows elapsed timer
- [ ] Pagination works with all filter combinations
- [ ] Patient detail shows correct conditional sections per call type
- [ ] Editable notes textarea accepts input
- [ ] Side effects render with red/warning styling when reported

---

## Common Pitfalls & Solutions

### 1. Controlled Dropdown Display Text

**Problem**: `<Option>` with JSX children (e.g., `<strong>`) doesn't resolve display text automatically.

**Solution**: Always provide explicit `text` prop on the Option component.

### 2. Date Sorting with Empty Values

**Problem**: Records with `contactDate: "--"` sort to top instead of bottom.

**Solution**: Handle empty dates before comparing — return `1` to push empties down.

### 3. daysAgo Sort Direction

**Problem**: `daysAgo` is inverted — lower = more recent. Naive ascending sort shows oldest first.

**Solution**: Invert the comparator: `(rb.daysAgo) - (ra.daysAgo)` instead of `(ra - rb)`.

### 4. Context Value Stability

**Problem**: Context value changes on every render, causing unnecessary re-renders.

**Solution**: Memoize the context value object and use `useCallback` for action functions.

### 5. Griffel Styles Outside Components

**Problem**: `makeStyles` called inside component body recreates styles each render.

**Solution**: Always define `useStyles = makeStyles({...})` at module level, outside the component.

### 6. Status Filter State Sync

**Problem**: Uncontrolled Dropdown loses selected value display on re-render.

**Solution**: Use controlled mode with both `value` (display text) and `selectedOptions` (selection array).

---

## Validation Checklists

### Data Model Validation

- [ ] All 3 call types have distinct outcome fields
- [ ] ContactRecord supports all 6 statuses
- [ ] Patient records include contact history, medications, appointments
- [ ] Scheduled records have empty contact dates and times
- [ ] daysAgo values are consistent with contact dates

### Dashboard Validation

- [ ] Admin toggle switches between analytics and contact list
- [ ] Stats cards show correct color-coding by threshold
- [ ] Charts render with realistic data
- [ ] Counter totals match filtered record counts
- [ ] All filter combinations produce correct results

### Contact List Validation

- [ ] Default sort: Contact Date descending, newest first
- [ ] Empty dates sort to bottom in both directions
- [ ] All 6 status pills render correctly
- [ ] Outcome icons match call type
- [ ] Pain level circles use correct severity colors
- [ ] Pagination respects active filters
- [ ] Patient search is case-insensitive

### Patient Detail Validation

- [ ] Contact history entries show newest first
- [ ] Needs-review entries have yellow highlight + orange border
- [ ] AI summary disclaimer is centered, gray, italic, small text
- [ ] Side effects render with red warning styling when reported
- [ ] Notes textarea is editable
- [ ] Medication refill button disabled when no refills available
- [ ] Conditional sections appear only for matching call types

### Add Patient Validation

- [ ] Auto-fill populates realistic data on identifier blur
- [ ] Campaign description updates with call type selection
- [ ] Outcomes grid shows 2-column layout
- [ ] Campaign settings are call-type-specific
- [ ] Hypertension auto-enables live transfer
- [ ] Schedule Call is disabled until required fields filled
- [ ] New patient appears in Contact List with Scheduled status and "--" date

### Interaction Validation

- [ ] Clicking patient name opens detail panel
- [ ] View AI Transcript opens modal with correct call type transcript
- [ ] Mark as Reviewed updates status pill in contact list
- [ ] Call button opens TeamsDialerPopup
- [ ] Hang up resolves call and generates contact record

---

## Conclusion

This PRD v2 documents the complete Care Coordination feature as implemented in the Meridian prototype. The system demonstrates a single-screen campaign management interface for AI-assisted healthcare outreach, supporting three clinical workflows with rich data visualization, interactive call management, and detailed patient tracking.

### Key Architectural Decisions

1. **React Context over Redux**: Feature-scoped context with co-located types keeps state management simple
2. **Co-located component + styles files**: Every `.tsx` has a paired `.styles.ts` using Griffel `makeStyles`
3. **Union types for statuses**: `CallRecordStatus` type union ensures type-safe status transitions
4. **Dual record types**: ContactRecord (historical) vs ActiveCallRecord (live) with different status representations
5. **Campaign configuration in Add Patient**: Combines patient onboarding with outreach campaign setup in a single workflow
6. **Controlled Fluent UI components**: All dropdowns use controlled mode for reliable state sync

### Framework Maintenance

- Review and update PRD when new call types or statuses are added
- Keep campaign settings table in sync with AddPatientForm implementation
- Update data model section when ContactRecord fields change
- Validate outcome icon mappings against dashboard styles

---

**Framework Prepared By**: Development Team  
**Version**: 2.0  
**Previous Version**: [SelfGuided-PRD-ViteReactTypeScript.md](SelfGuided-PRD-ViteReactTypeScript.md) (v1.0, generic framework)  
**Next Review**: Quarterly  
**Feedback**: Please contribute improvements and lessons learned back to this framework
