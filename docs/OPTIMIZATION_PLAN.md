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

| Priority    | File                      | Lines | Status          | Target               |
| ----------- | ------------------------- | ----- | --------------- | -------------------- |
| 🔴 CRITICAL | `DocumentComponent.tsx`   | 3,857 | 19x over limit  | Split into 15+ files |
| 🔴 HIGH     | `Worklist.tsx`            | 1,059 | 5x over limit   | Split into 4-5 files |
| 🔴 HIGH     | `MicrophoneInterface.tsx` | 977   | 5x over limit   | Split into 4-5 files |
| 🟠 MEDIUM   | `MainContent.tsx`         | 722   | 3x over limit   | Split into 3-4 files |
| 🟠 MEDIUM   | `TranscriptPanel.tsx`     | 625   | 2x over limit   | Split into 2-3 files |
| 🟠 MEDIUM   | `NotificationsPanel.tsx`  | 590   | 2x over limit   | Split into 2-3 files |
| 🟠 MEDIUM   | `OrdersComponent.tsx`     | 573   | 2x over limit   | Split into 2-3 files |
| 🟡 LOW      | `Header.tsx`              | 450   | 1.5x over limit | Extract styles/types |
| 🟡 LOW      | `Settings.tsx`            | 446   | 1.5x over limit | Extract styles/types |
| 🟡 LOW      | `MainContent.styles.ts`   | 433   | 1.5x over limit | Organize by section  |
| 🟡 LOW      | `MicCursorTooltip.tsx`    | 403   | 1.3x over limit | Extract styles       |
| 🟡 LOW      | `MemosPanel.tsx`          | 389   | 1.3x over limit | Extract styles       |
| 🟡 LOW      | `RightDrawer.tsx`         | 381   | 1.3x over limit | Extract styles       |
| 🟡 LOW      | `RightDrawer.styles.ts`   | 310   | At limit        | OK after refactor    |
| 🟡 LOW      | `MobileWorkspace.tsx`     | 305   | At limit        | Minor cleanup        |

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

## Implementation Order

### Week 1: Critical Priority

1. ✅ Create this optimization plan
2. 🔄 **DocumentComponent.tsx** - Phase 1 (largest impact)
   - Day 1-2: Extract types, constants, styles
   - Day 3-4: Extract hooks
   - Day 5: Extract components
   - Day 6-7: Integration and testing

### Week 2: High Priority

1. **Worklist.tsx** - Phase 2
2. **MicrophoneInterface.tsx** - Phase 3

### Week 3: Medium Priority

1. **MainContent.tsx** - Phase 4
2. **TranscriptPanel.tsx** - Phase 5
3. **NotificationsPanel.tsx** - Phase 5

### Week 4: Low Priority + Cleanup

1. **OrdersComponent.tsx** - Phase 5
2. Style extractions for remaining files
3. Token replacement pass across all files
4. Final cleanup and documentation

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

3. **Integration Testing**
   - Component communication works
   - Props flow correctly
   - No console errors/warnings

---

## Rollback Plan

1. Each phase will be implemented in a separate branch
2. Full testing before merge
3. Tag releases at each phase completion
4. Keep old implementation commented initially (remove after verification)

---

## Success Metrics

| Metric                   | Before      | Target      |
| ------------------------ | ----------- | ----------- |
| Largest file size        | 3,857 lines | < 300 lines |
| Files over 300 lines     | 15 files    | 0 files     |
| Hardcoded color values   | ~50+        | 0           |
| Hardcoded spacing values | ~100+       | 0           |
| Code duplication         | High        | Minimal     |

---

## Notes

- All refactoring preserves existing functionality
- No changes to component APIs where possible
- Maintain backwards compatibility with existing imports
- Update index.ts files to maintain clean exports
