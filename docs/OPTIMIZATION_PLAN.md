# NorthStar-React Optimization Plan

> **CRITICAL**: This optimization plan preserves ALL current look, feel, and functionality.
> No visual or behavioral changes will be made.

## Executive Summary

This document outlines a comprehensive plan to refactor the NorthStar-React codebase following best practices:

- Target file size: **200-300 lines maximum**
- Replace hardcoded values with **Fluent UI v2 tokens**
- Extract reusable components and hooks
- Eliminate code duplication
- Improve maintainability and testability

---

## Current State Analysis

### File Size Audit (Lines of Code)

| Priority    | File                                      | Lines | Status          | Target               |
| ----------- | ----------------------------------------- | ----- | --------------- | -------------------- |
| 🔴 CRITICAL | `DocumentComponent.tsx`                   | 3,857 | 19x over limit  | Split into 15+ files |
| 🔴 CRITICAL | `CareCoordinationDashboard.tsx`           | 1,112 | 3.7x over limit | Split into 5-6 files |
| 🔴 HIGH     | `Worklist.tsx`                            | 1,059 | 5x over limit   | Split into 4-5 files |
| 🔴 HIGH     | `MicrophoneInterface.tsx`                 | 977   | 5x over limit   | Split into 4-5 files |
| 🔴 HIGH     | `AddPatientForm.tsx`                      | 810   | 2.7x over limit | Split into 4-5 files |
| 🟠 MEDIUM   | `MainContent.tsx`                         | 722   | 3x over limit   | Split into 3-4 files |
| 🟠 MEDIUM   | `CareCoordinationWorklist.styles.ts`      | 676   | 2.3x over limit | Organize by section  |
| 🟠 MEDIUM   | `CareCoordinationDashboard.styles.ts`     | 662   | 2.2x over limit | Organize by section  |
| 🟠 MEDIUM   | `CareCoordinationPatientDetail.tsx`       | 658   | 2.2x over limit | Split into 3-4 files |
| 🟠 MEDIUM   | `TranscriptPanel.tsx`                     | 625   | 2x over limit   | Split into 2-3 files |
| 🟠 MEDIUM   | `NotificationsPanel.tsx`                  | 590   | 2x over limit   | Split into 2-3 files |
| 🟠 MEDIUM   | `CareCoordinationWorklistContext.tsx`      | 586   | 2x over limit   | Extract data files   |
| 🟠 MEDIUM   | `OrdersComponent.tsx`                     | 573   | 2x over limit   | Split into 2-3 files |
| 🟡 LOW      | `CareCoordinationWorklist.tsx`            | 457   | 1.5x over limit | Extract styles/types |
| 🟡 LOW      | `Header.tsx`                              | 450   | 1.5x over limit | Extract styles/types |
| 🟡 LOW      | `Settings.tsx`                            | 446   | 1.5x over limit | Extract styles/types |
| 🟡 LOW      | `MainContent.styles.ts`                   | 433   | 1.5x over limit | Organize by section  |
| 🟡 LOW      | `MicCursorTooltip.tsx`                    | 403   | 1.3x over limit | Extract styles       |
| 🟡 LOW      | `MemosPanel.tsx`                          | 389   | 1.3x over limit | Extract styles       |
| 🟡 LOW      | `RightDrawer.tsx`                         | 381   | 1.3x over limit | Extract styles       |
| 🟡 LOW      | `CareCoordinationPatientDetail.styles.ts` | 347   | 1.2x over limit | OK after refactor    |
| 🟡 LOW      | `RightDrawer.styles.ts`                   | 310   | At limit        | OK after refactor    |
| 🟡 LOW      | `MobileWorkspace.tsx`                     | 305   | At limit        | Minor cleanup        |

### Hardcoded Values Audit

Common hardcoded values that should use Fluent UI tokens:

- Colors: `#ebebeb`, `#0f6cbd`, `#ffffff`, etc.
- Spacing: `8px`, `12px`, `16px`, `20px`, `24px`
- Font sizes: `12px`, `14px`, `16px`, `20px`
- Border radius: `4px`, `6px`, `8px`
- Shadows: Custom box-shadow values

---

## Phase 1: DocumentComponent.tsx (CRITICAL - 3,857 lines)

This is the largest file and requires the most significant refactoring.

### Proposed Structure

```
src/components/content/document/
├── index.ts                          # Public exports
├── DocumentComponent.tsx              # Main orchestrator (~200 lines)
├── DocumentComponent.types.ts         # All interfaces and types (~80 lines)
├── DocumentComponent.styles.ts        # All styles (~300 lines, split further if needed)
├── DocumentComponent.constants.ts     # DICTATION_CONTENT_MAP and other constants (~200 lines)
├── hooks/
│   ├── index.ts
│   ├── useDocumentState.ts           # Document state management (~150 lines)
│   ├── useDocumentEditing.ts         # Editing handlers (~150 lines)
│   ├── useTypingSimulation.ts        # AI typing simulation logic (~150 lines)
│   ├── useDictationHandlers.ts       # Dictation mode handlers (~100 lines)
│   └── useTooltipPosition.ts         # Tooltip positioning logic (~100 lines)
├── components/
│   ├── index.ts
│   ├── DocumentHeader.tsx            # Header with actions (~150 lines)
│   ├── DocumentCard.tsx              # Individual document card (~150 lines)
│   ├── DocumentStack.tsx             # Document list/stack (~100 lines)
│   ├── DocumentSection.tsx           # Expandable section (~200 lines)
│   ├── DocumentSectionContent.tsx    # Section content with textarea (~200 lines)
│   ├── DocumentReferences.tsx        # References section (~150 lines)
│   ├── DocumentOrders.tsx            # Orders section (~200 lines)
│   ├── OrderItem.tsx                 # Individual order item (~100 lines)
│   ├── DocumentActions.tsx           # Action buttons row (~100 lines)
│   └── SkeletonLoader.tsx            # Loading skeleton animation (~80 lines)
└── utils/
    ├── index.ts
    ├── pronounReplacer.ts            # Pronoun replacement utility (~50 lines)
    └── documentHelpers.ts            # Helper functions (~80 lines)
```

### Migration Steps

#### Step 1.1: Extract Types (DocumentComponent.types.ts)

```typescript
// Extract from lines 56-70, 919-943
export type DocumentData = { ... };
export type DocumentGridItem = { ... };
export interface DocumentSection { ... };
export interface ReferenceItem { ... };
export interface OrderItem { ... };
export interface AutoSelectTextConfig { ... };
export interface DocumentComponentProps { ... };
export interface DocumentCardProps { ... };
```

#### Step 1.2: Extract Styles (DocumentComponent.styles.ts)

```typescript
// Extract makeStyles from lines 75-918 (~840 lines of styles)
// Split into logical groups:
export const useDocumentStyles = makeStyles({ ... });      // Main container
export const useHeaderStyles = makeStyles({ ... });        // Header section
export const useSectionStyles = makeStyles({ ... });       // Section styles
export const useOrderStyles = makeStyles({ ... });         // Order item styles
export const useReferenceStyles = makeStyles({ ... });     // Reference styles
export const useActionStyles = makeStyles({ ... });        // Action button styles
```

#### Step 1.3: Extract Constants (DocumentComponent.constants.ts)

```typescript
// Extract DICTATION_CONTENT_MAP and related constants
// Lines ~850-908
export const DICTATION_CONTENT_MAP: Record<string, string> = { ... };
export const getDictationContentForSection = (sectionTitle: string): string => { ... };
```

#### Step 1.4: Extract Hooks

```typescript
// useDocumentState.ts - Main state management
export const useDocumentState = (initialDocuments: DocumentItem[]) => {
  // State declarations from lines ~950-1100
  // Return: { documents, setDocuments, expandedDocuments, ... }
};

// useTypingSimulation.ts - AI typing simulation
export const useTypingSimulation = () => {
  // Lines ~1388-1500: runTypingSimulation and related logic
};

// useDictationHandlers.ts - Dictation mode handlers
export const useDictationHandlers = () => {
  // handleFieldFocus, handleFieldBlur, etc.
};
```

#### Step 1.5: Extract Components

```typescript
// DocumentCard.tsx - Lines ~2613-2785
// DocumentSection.tsx - Section rendering logic
// DocumentOrders.tsx - Orders section with order items
// DocumentReferences.tsx - References section
// SkeletonLoader.tsx - Loading animation
```

### Token Replacement Map (DocumentComponent)

| Current Value                | Fluent UI Token                                                         |
| ---------------------------- | ----------------------------------------------------------------------- |
| `gap: "8px"`                 | `gap: tokens.spacingHorizontalS`                                        |
| `padding: "8px 20px"`        | `padding: \`${tokens.spacingVerticalS} ${tokens.spacingHorizontalXL}\`` |
| `borderRadius: "4px"`        | `borderRadius: tokens.borderRadiusSmall`                                |
| `fontSize: "14px"`           | `fontSize: tokens.fontSizeBase300`                                      |
| `fontWeight: 600`            | `fontWeight: tokens.fontWeightSemibold`                                 |
| `color: "#0f6cbd"`           | `color: tokens.colorBrandForeground1`                                   |
| `backgroundColor: "#ebebeb"` | `backgroundColor: tokens.colorNeutralBackground3`                       |

---

## Phase 2: Worklist.tsx (HIGH - 1,059 lines)

### Proposed Structure

```
src/components/content/worklist/
├── index.ts
├── Worklist.tsx                      # Main orchestrator (~200 lines)
├── Worklist.types.ts                 # Types and interfaces (~50 lines)
├── Worklist.styles.ts                # All styles (~250 lines)
├── components/
│   ├── index.ts
│   ├── WorklistHeader.tsx            # Header with tabs/search (~150 lines)
│   ├── PatientList.tsx               # Patient list container (~100 lines)
│   ├── PatientCard.tsx               # Individual patient card (~150 lines)
│   └── WorklistSearch.tsx            # Search functionality (~100 lines)
└── hooks/
    ├── index.ts
    └── useWorklistState.ts           # State management (~100 lines)
```

### Migration Steps

1. Extract types to `Worklist.types.ts`
2. Extract styles to `Worklist.styles.ts`
3. Extract `PatientCard` as standalone component
4. Extract search logic to custom hook
5. Create `WorklistHeader` component

---

## Phase 3: MicrophoneInterface.tsx (HIGH - 977 lines)

### Proposed Structure

```
src/components/content/microphone/
├── index.ts
├── MicrophoneInterface.tsx           # Main container (~150 lines)
├── MicrophoneInterface.types.ts      # Types (~50 lines)
├── MicrophoneInterface.styles.ts     # All styles (~250 lines)
├── components/
│   ├── index.ts
│   ├── MicButton.tsx                 # Main mic toggle button (~100 lines)
│   ├── ActionButtons.tsx             # Left action buttons group (~100 lines)
│   ├── RightActions.tsx              # Right action buttons group (~100 lines)
│   ├── ModeCheckbox.tsx              # Dictation/Ambient checkbox (~80 lines)
│   └── AnimatedBackground.tsx        # Recording animation (~80 lines)
└── hooks/
    ├── index.ts
    └── useMicrophoneState.ts         # State management (~100 lines)
```

### Migration Steps

1. Extract styles to separate file
2. Extract `MicButton` with its specific logic
3. Extract `ActionButtons` and `RightActions`
4. Extract animated background component
5. Consolidate state management into hook

---

## Phase 4: MainContent.tsx (MEDIUM - 722 lines)

### Proposed Structure

```
src/components/core/main-content/
├── index.ts
├── MainContent.tsx                   # Main orchestrator (~200 lines)
├── MainContent.types.ts              # Types (~40 lines)
├── MainContent.styles.ts             # Existing, reorganize (~250 lines)
├── hooks/
│   ├── index.ts
│   ├── useMainContentState.ts        # State management (~100 lines)
│   └── useDialogHandlers.ts          # Dialog handling (~80 lines)
└── components/
    ├── index.ts
    └── StopRecordingDialog.tsx       # Confirmation dialog (~80 lines)
```

---

## Phase 5: Medium Priority Files (590-625 lines)

### TranscriptPanel.tsx (625 lines)

```
src/components/content/transcript/
├── index.ts
├── TranscriptPanel.tsx               # Main (~200 lines)
├── TranscriptPanel.styles.ts         # Styles (~200 lines)
└── components/
    ├── TranscriptEntry.tsx           # Individual entry (~150 lines)
    └── TranscriptActions.tsx         # Action buttons (~100 lines)
```

### NotificationsPanel.tsx (590 lines)

```
src/components/content/notifications/
├── index.ts
├── NotificationsPanel.tsx            # Main (~200 lines)
├── NotificationsPanel.styles.ts      # Styles (~200 lines)
└── components/
    ├── NotificationItem.tsx          # Individual notification (~150 lines)
    └── NotificationActions.tsx       # Actions (~100 lines)
```

### OrdersComponent.tsx (573 lines)

```
src/components/content/orders/
├── index.ts
├── OrdersComponent.tsx               # Main (~200 lines)
├── OrdersComponent.styles.ts         # Styles (~150 lines)
└── components/
    ├── OrderItem.tsx                 # Individual order (~150 lines)
    └── OrderActions.tsx              # Actions (~100 lines)
```

---

## Phase 6: Low Priority Files (380-450 lines)

### Files to Extract Styles Only

These files can be improved by extracting styles to separate files:

1. **Header.tsx** (450 lines)

   - Extract to `Header.styles.ts`
   - Target: 200 lines in component, 250 in styles

2. **Settings.tsx** (446 lines)

   - Extract to `Settings.styles.ts`
   - Target: 200 lines in component, 250 in styles

3. **MicCursorTooltip.tsx** (403 lines)

   - Extract to `MicCursorTooltip.styles.ts`
   - Target: 200 lines in component, 200 in styles

4. **MemosPanel.tsx** (389 lines)

   - Extract to `MemosPanel.styles.ts`
   - Target: 200 lines in component, 200 in styles

5. **RightDrawer.tsx** (381 lines)
   - Merge with existing `RightDrawer.styles.ts`
   - Target: 200 lines in component, 350 in styles

---

## Shared Utilities and Patterns

### New Shared Hooks Directory

```
src/hooks/
├── index.ts
├── useToast.ts                       # Toast notification handling
├── useDialogState.ts                 # Common dialog state patterns
└── useMediaQuery.ts                  # Responsive breakpoint hook
```

### New Shared Types Directory

```
src/types/
├── index.ts
├── recording.types.ts                # DictationState, AmbientState, etc.
├── patient.types.ts                  # Patient-related types
└── document.types.ts                 # Document-related types
```

### Fluent UI Token Replacement Guide

#### Colors

```typescript
// Before                          // After
"#0f6cbd"                         tokens.colorBrandBackground1
"#115ea3"                         tokens.colorBrandBackground2
"#ffffff"                         tokens.colorNeutralBackground1
"#f5f5f5"                         tokens.colorNeutralBackground2
"#ebebeb"                         tokens.colorNeutralBackground3
"#e0e0e0"                         tokens.colorNeutralBackground4
"#242424"                         tokens.colorNeutralForeground1
"#616161"                         tokens.colorNeutralForeground2
"#a1a1a1"                         tokens.colorNeutralForeground3
"#d1d1d1"                         tokens.colorNeutralStroke1
"#c4c4c4"                         tokens.colorNeutralStroke2
"#e6f6e6"                         tokens.colorPaletteGreenBackground1
"#fff4ce"                         tokens.colorPaletteYellowBackground1
"#fde7e9"                         tokens.colorPaletteRedBackground1
```

#### Spacing

```typescript
// Before                          // After
"2px"                             tokens.spacingHorizontalXXS
"4px"                             tokens.spacingHorizontalXS
"6px"                             tokens.spacingHorizontalSNudge
"8px"                             tokens.spacingHorizontalS
"10px"                            tokens.spacingHorizontalMNudge
"12px"                            tokens.spacingHorizontalM
"16px"                            tokens.spacingHorizontalL
"20px"                            tokens.spacingHorizontalXL
"24px"                            tokens.spacingHorizontalXXL
```

#### Typography

```typescript
// Before                          // After
"10px"                            tokens.fontSizeBase100
"12px"                            tokens.fontSizeBase200
"14px"                            tokens.fontSizeBase300
"16px"                            tokens.fontSizeBase400
"20px"                            tokens.fontSizeBase500
"24px"                            tokens.fontSizeBase600
400                               tokens.fontWeightRegular
500                               tokens.fontWeightMedium
600                               tokens.fontWeightSemibold
700                               tokens.fontWeightBold
```

#### Border Radius

```typescript
// Before                          // After
"0px"                             tokens.borderRadiusNone
"4px"                             tokens.borderRadiusSmall
"6px"                             tokens.borderRadiusMedium
"8px"                             tokens.borderRadiusLarge
"12px"                            tokens.borderRadiusXLarge
"50%"                             tokens.borderRadiusCircular
```

---

## Phase 7: CareCoordinationDashboard.tsx (CRITICAL - 1,112 lines)

### Current State Analysis

| Issue | Count |
| --- | --- |
| Hardcoded colors | 21 (`#D13438`, `#CA5010`, `#0078D4`, `#FFF8E1`, etc.) |
| Inline px values | 22 |
| Inline style objects | ~15 |

### Proposed Structure

```
src/components/content/careCoordinationWorklist/
├── CareCoordinationDashboard.tsx          # Main orchestrator (~250 lines)
├── CareCoordinationDashboard.styles.ts    # Existing + moved inline styles
├── components/
│   ├── AdminDashboard.tsx                 # Stats cards + charts (~200 lines)
│   ├── ContactListTable.tsx               # Table rendering (~200 lines)
│   ├── ContactListFilters.tsx             # Filter dropdowns + search (~150 lines)
│   ├── SummaryCounters.tsx                # Counter badge grid (~80 lines)
│   ├── AdherenceTrendChart.tsx            # SVG line chart (~100 lines)
│   ├── BarCharts.tsx                      # Non-adherence + effectiveness charts (~100 lines)
│   └── SortIcon.tsx                       # Reusable sort indicator (~20 lines)
```

### Migration Steps

1. Extract `AdherenceTrendChart` component (lines 151-240) — standalone SVG chart
2. Extract `SummaryCounters` component (lines 740-805) — counter badge grid
3. Extract `ContactListFilters` component (lines 850-930) — filter row with dropdowns
4. Extract `ContactListTable` component (lines 935-1100) — table body with outcomes
5. Extract `AdminDashboard` component (lines 500-740) — stats cards and charts
6. Move all inline styles to `CareCoordinationDashboard.styles.ts`
7. Replace hardcoded colors with Fluent UI tokens or named constants

### Token Replacement Map

| Current Value | Replacement |
| --- | --- |
| `#0078D4` | `tokens.colorBrandBackground` |
| `#D13438` | `tokens.colorPaletteRedForeground1` |
| `#CA5010` | `tokens.colorPaletteDarkOrangeForeground1` |
| `#FFF8E1` | Named constant `URGENCY_BG` (no Fluent token) |
| `#e0e0e0` | `tokens.colorNeutralBackground4` |
| `#666` | `tokens.colorNeutralForeground3` |

---

## Phase 8: AddPatientForm.tsx (HIGH - 810 lines)

### Current State Analysis

| Issue | Count |
| --- | --- |
| Hardcoded colors | 4 (`#616161`, `#F5F5F5`, `#424242`, `#E0E0E0`) |
| Inline px values | 23 |
| Inline style objects | ~20 |

### Proposed Structure

```
src/components/content/careCoordinationWorklist/
├── AddPatientForm.tsx                     # Main form orchestrator (~250 lines)
├── AddPatientForm.styles.ts               # Existing + moved inline styles
├── components/
│   ├── PatientInfoSection.tsx             # Patient identity fields (~100 lines)
│   ├── CampaignSection.tsx                # Description + outcomes grid (~120 lines)
│   ├── CampaignSettings.tsx               # Recurrence, timing, retries (~200 lines)
│   └── ClinicalFieldsSection.tsx          # Demographics, meds, intake, BP (~150 lines)
├── constants/
│   └── campaignConfig.ts                  # Descriptions, outcomes, auto-fill data (~100 lines)
```

### Migration Steps

1. Extract `campaignDescriptions`, `campaignOutcomes`, and auto-fill data to `campaignConfig.ts`
2. Extract `PatientInfoSection` (lines 379-414) — identity fields
3. Extract `CampaignSection` (lines 418-470) — description + outcomes grid
4. Extract `CampaignSettings` (lines 470-592) — all campaign configuration controls
5. Extract `ClinicalFieldsSection` (lines 597-789) — demographics, meds, intake, BP
6. Move all inline styles to `AddPatientForm.styles.ts`

### Token Replacement Map

| Current Value | Replacement |
| --- | --- |
| `#616161` | `tokens.colorNeutralForeground3` |
| `#F5F5F5` | `tokens.colorNeutralBackground2` |
| `#424242` | `tokens.colorNeutralForeground2` |
| `#E0E0E0` | `tokens.colorNeutralStroke2` |

---

## Phase 9: CareCoordinationPatientDetail.tsx (MEDIUM - 658 lines)

### Current State Analysis

| Issue | Count |
| --- | --- |
| Hardcoded colors | 7 (`#E1F5F0`, `#0E7C6B`, `#F3E8FD`, `#FFF8E1`, `#CA5010`, `#707070`, `#d1d1d1`) |
| Inline px values | 9 |
| Inline style objects | ~8 |

### Proposed Structure

```
src/components/content/careCoordinationWorklist/
├── CareCoordinationPatientDetail.tsx      # Main orchestrator (~250 lines)
├── CareCoordinationPatientDetail.styles.ts # Existing + moved inline styles
├── components/
│   ├── ContactHistoryEntry.tsx            # Single contact entry (~200 lines)
│   ├── OutcomeGrid.tsx                    # Call-type-specific outcomes (~150 lines)
│   ├── MedicationsGrid.tsx                # Medication cards (~100 lines)
│   └── PatientInfoGrid.tsx                # Patient info 2-column grid (~150 lines)
```

### Migration Steps

1. Move inline style objects to `.styles.ts` (call type badge, urgency highlight, disclaimer, notes textarea)
2. Extract `ContactHistoryEntry` — one contact history block with header, summary, outcomes, notes
3. Extract `OutcomeGrid` — the 3-branch outcome rendering (med adherence, intake, hypertension)
4. Extract `MedicationsGrid` — medication card grid with refill buttons
5. Extract `PatientInfoGrid` — conditional patient info sections

### Token Replacement Map

| Current Value | Replacement |
| --- | --- |
| `#707070` | `tokens.colorNeutralForeground3` |
| `#d1d1d1` | `tokens.colorNeutralStroke1` |
| `#424242` | `tokens.colorNeutralForeground2` |
| `#FFF8E1` | Named constant `URGENCY_BG` |
| `#CA5010` | Named constant `URGENCY_BORDER` |
| `#E1F5F0`, `#0E7C6B` | Named constants for intake badge |
| `#F3E8FD`, `#7B2D8E` | Named constants for hypertension badge |
| `#E8F0FE`, `#1B6EC2` | Named constants for med-adherence badge |

---

## Phase 10: CareCoordinationWorklistContext.tsx (MEDIUM - 586 lines)

### Proposed Structure

```
src/components/content/careCoordinationWorklist/
├── CareCoordinationWorklistContext.tsx     # Context provider + hook (~250 lines)
├── data/
│   ├── initialContactRecords.ts           # 22 initial ContactRecord entries (~100 lines)
│   └── outcomePools.ts                    # MA/PI/HT outcome pools + transcript generation (~200 lines)
```

### Migration Steps

1. Extract `INITIAL_CONTACT_RECORDS` array to `data/initialContactRecords.ts`
2. Extract outcome pools (`MA_OUTCOME_POOLS`, `PI_OUTCOME_POOLS`, `HT_OUTCOME_POOLS`) and transcript summary generation to `data/outcomePools.ts`
3. Keep context provider, hook, and action functions in main file

---

## Implementation Order

### Week 1: Critical Priority (Home View)

1. ✅ Create this optimization plan
2. 🔄 **DocumentComponent.tsx** - Phase 1 (largest impact)
   - Day 1-2: Extract types, constants, styles
   - Day 3-4: Extract hooks
   - Day 5: Extract components
   - Day 6-7: Integration and testing

### Week 2: High Priority (Home View)

1. **Worklist.tsx** - Phase 2
2. **MicrophoneInterface.tsx** - Phase 3

### Week 3: Medium Priority (Home View)

1. **MainContent.tsx** - Phase 4
2. **TranscriptPanel.tsx** - Phase 5
3. **NotificationsPanel.tsx** - Phase 5

### Week 4: Low Priority (Home View) + Cleanup

1. **OrdersComponent.tsx** - Phase 5
2. Style extractions for remaining files (Phase 6)
3. Token replacement pass across Home View files

### Week 5: Critical Priority (Care Coordination)

1. ✅ **CareCoordinationDashboard.tsx** - Phase 7
   - Extracted: AdminDashboard, ContactListTable, ContactListFilters, SummaryCounters, AdherenceTrendChart
   - Result: 1,112 → 236 lines

### Week 6: High + Medium Priority (Care Coordination)

1. ✅ **AddPatientForm.tsx** - Phase 8
   - Extracted: PatientInfoSection, CampaignSection, CampaignSettings, ClinicalFieldsSection, campaignConfig constants
   - Extracted: usePatientAutoFill hook (115 lines), buildNewPatient utility (105 lines)
   - Result: 810 → 299 lines ✅ Under 300-line target
2. ✅ **CareCoordinationPatientDetail.tsx** - Phase 9
   - Extracted: ContactHistoryEntry, OutcomeGrid, PatientInfoGrid
   - Result: 658 → 218 lines ✅ Under 300-line target
3. ✅ **CareCoordinationWorklistContext.tsx** - Phase 10
   - Extracted: initial contact records, outcome pools, interfaces to types file
   - Result: 586 → 412 lines (interfaces and data extracted)
4. ✅ **ContactListTable.tsx** - Phase 10b (new)
   - Extracted: OutcomeIndicators (136 lines) with all icon maps, indicator components, SortIcon
   - Result: 427 → 317 lines

---

## Current State: Care Coordination File Audit

### Component Files (target: ≤300 lines)

| File | Lines | Status | Next Action |
| --- | --- | --- | --- |
| `CareCoordinationWorklist.tsx` | 456 | 🟠 Over limit | Extract patient card rendering, search logic |
| `CareCoordinationWorklistContext.tsx` | 412 | 🟠 Over limit | Extract action functions to custom hook |
| `ClinicalFieldsSection.tsx` | 334 | 🟡 Slightly over | Consider splitting by call type |
| `ContactListTable.tsx` | 317 | 🟡 Slightly over | Acceptable after indicator extraction |
| `AdminDashboard.tsx` | 314 | 🟡 Slightly over | Acceptable — chart + stats layout |
| `AddPatientForm.tsx` | 299 | ✅ At target | Done |
| `CareCoordinationReviewedPanel.tsx` | 268 | ✅ Under target | Done |
| `CareCoordinationDashboard.tsx` | 236 | ✅ Under target | Done |
| `OutcomeGrid.tsx` | 226 | ✅ Under target | Done |
| `AICallTranscriptModal.tsx` | 226 | ✅ Under target | Done |
| `CareCoordinationPatientDetail.tsx` | 218 | ✅ Under target | Done |
| All other components | <200 | ✅ Under target | Done |

### Style Files (target: organized, no hard limit)

| File | Lines | Notes |
| --- | --- | --- |
| `CareCoordinationDashboard.styles.ts` | 718 | Consider splitting by section |
| `CareCoordinationWorklist.styles.ts` | 676 | Consider splitting by section |
| `CareCoordinationPatientDetail.styles.ts` | 427 | Acceptable — well-organized with sections |

### Data/Config Files

| File | Lines | Status |
| --- | --- | --- |
| `outcomePools.ts` | 215 | ✅ Clean — outcome generation + templates |
| `campaignConfig.ts` | 189 | ✅ Clean — constants and auto-fill data |
| `CareCoordinationWorklist.types.ts` | 180 | ✅ Clean — canonical type definitions |
| `careCoordination.constants.ts` | 142 | ✅ Clean — colors, status, sort types |
| `OutcomeIndicators.tsx` | 136 | ✅ Clean — extracted icon components |
| `usePatientAutoFill.ts` | 115 | ✅ Clean — extracted hook |
| `buildNewPatient.ts` | 105 | ✅ Clean — extracted utility |

### Remaining Optimization Targets (Phase 11)

1. **CareCoordinationWorklist.tsx** (456 lines)
   - Extract patient card rendering to `PatientCard.tsx`
   - Extract sort/filter menu to `WorklistControls.tsx`
   - Target: ~250 lines

2. **CareCoordinationWorklistContext.tsx** (412 lines)
   - Extract `callPatients` / `addPatient` / action functions to `useCareCoordinationActions.ts` hook
   - Target: ~300 lines

3. **Style file organization** (718 + 676 lines)
   - Split `CareCoordinationDashboard.styles.ts` by section (table, filters, counters, charts)
   - Split `CareCoordinationWorklist.styles.ts` by section (worklist, cards, header)

---

## Testing Strategy

After each refactoring phase:

1. **Visual Regression Testing**

   - Screenshot comparison before/after
   - Verify all UI elements render correctly

2. **Functional Testing**

   - All click handlers work
   - State management intact
   - Dictation/Ambient mode behavior preserved
   - Dialog confirmations work
   - Care Coordination: sorting, filtering, pagination preserved
   - Care Coordination: status transitions work correctly
   - Care Coordination: campaign settings per call type preserved

3. **Integration Testing**
   - Component communication works
   - Props flow correctly
   - No console errors/warnings
   - Context consumers still receive all actions and state

---

## Rollback Plan

1. Each phase will be implemented in a separate branch
2. Full testing before merge
3. Tag releases at each phase completion
4. Keep old implementation commented initially (remove after verification)

---

## Success Metrics

| Metric                   | Before (Home) | Before (CC) | Current (CC) | Target      |
| ------------------------ | ------------- | ----------- | ------------ | ----------- |
| Largest file size        | 3,857 lines   | 1,112 lines | 456 lines    | < 300 lines |
| Files over 300 lines     | 15 files      | 7 files     | 5 files      | 0 files     |
| Hardcoded color values   | ~50+          | ~32         | ~15          | 0           |
| Hardcoded spacing values | ~100+         | ~54         | ~30          | 0           |
| Code duplication         | High          | Medium      | Low          | Minimal     |
| Extracted components     | 0             | 0           | 14           | —           |
| Extracted hooks          | 0             | 0           | 1            | —           |
| Extracted utilities      | 0             | 0           | 1            | —           |

---

## Notes

- All refactoring preserves existing functionality
- No changes to component APIs where possible
- Maintain backwards compatibility with existing imports
- Update index.ts files to maintain clean exports
- Care Coordination semantic colors (status pills, urgency, pain levels) that have no Fluent token equivalent should be defined as named constants in a shared `careCoordination.constants.ts` file
