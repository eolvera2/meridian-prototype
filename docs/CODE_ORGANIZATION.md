# Code Organization Guide

## Large Files Structure

This document describes the organization of large files in the codebase and how to work with them effectively.

### DocumentComponent.styles.ts (1,687 lines)

**Location**: `src/components/content/document/DocumentComponent.styles.ts`

**Purpose**: Comprehensive styling for the DocumentComponent and all its sub-components.

**Organization**: The file is organized into 10 logical sections with clear markers:

1. **Main Document Styles** (`useDocumentStyles`)
   - Document container layout
   - Responsive breakpoints
   - Document stack arrangement

2. **Document Header Styles** (`useHeaderStyles`)
   - Header layout and spacing
   - Title and activity banner
   - Action buttons and dividers

3. **Table/Grid Styles** (`useTableStyles`)
   - Document table layouts
   - Grid layouts for recent documents
   - Cell and row styling

4. **Document Card Styles** (`useCardStyles`)
   - Card container and header
   - Expand/collapse buttons
   - Card title and badges
   - Menu buttons

5. **Toolbar Styles** (`useToolbarStyles`)
   - Toolbar layout
   - Action buttons (left/right)
   - Icon styles
   - Star/favorite button

6. **Section Styles** (`useSectionStyles`)
   - Section containers
   - Section headers and titles
   - Checkboxes
   - Text areas and content areas
   - Dictation focus states
   - Highlighted content

7. **Reference Styles** (`useReferenceStyles`)
   - Reference list layout
   - Reference items
   - Reference icons and numbers
   - Dividers

8. **Order Styles** (`useOrderStyles`)
   - Order list layout
   - Order badges and items
   - Order input fields
   - Add/delete buttons
   - Focus indicators

9. **Skeleton/Loading Styles** (`useSkeletonStyles`)
   - Loading state containers
   - Animated skeleton items
   - Shimmer effects

10. **Combined Styles Hook** (`useStyles`)
    - Backwards compatibility hook
    - Merges all style categories

**Usage**:

```typescript
import {
  useDocumentStyles,
  useHeaderStyles,
  useSectionStyles,
  // ... other specific hooks
} from './DocumentComponent.styles';

// In your component
const documentStyles = useDocumentStyles();
const headerStyles = useHeaderStyles();
```

**Alternative Import** (via index):
```typescript
import {
  useDocumentStyles,
  useHeaderStyles,
} from './styles';
```

**Why Not Split?**
- File is already well-organized with clear sections
- All styles are related to a single component
- Splitting would create import overhead
- Current organization makes it easy to find related styles
- Section markers provide clear navigation

### DocumentCard.tsx (1,621 lines)

**Location**: `src/components/content/document/components/DocumentCard.tsx`

**Purpose**: Renders individual document cards with sections, orders, and AI content.

**Main Responsibilities**:
- Expandable document sections
- Order management (add, edit, delete)
- AI-generated content handling
- Dictation simulation
- Skeleton loading states

**Key Features**:
- **State Management**: Local state for orders, AI content, skeleton
- **Event Handlers**: Document interactions, section toggling, order operations
- **Hooks Integration**: i18n, refs, effects for simulation
- **Render Logic**: Complex conditional rendering based on document state

**Potential Sub-Components** (if splitting needed):
1. `DocumentCardHeader` - Card header with title and actions
2. `DocumentSection` - Individual section rendering
3. `OrdersList` - Order management UI
4. `OrderItem` - Single order with input/buttons
5. `DeleteOrderDialog` - Order deletion confirmation

**Why Not Split Yet?**
- Component state is tightly coupled
- Many callbacks and handlers are shared
- Splitting would require complex prop drilling or context
- Current structure keeps related logic together
- Would need significant refactoring for proper separation

### MainContent.styles.ts (480 lines)

**Location**: `src/components/core/MainContent.styles.ts`

**Purpose**: Layout styles for the main content area.

**Organization**:
- **Main Layout** (`useMainContentStyles`): Desktop and mobile layouts
- **Dialog Styles** (`useDialogStyles`): Modal and dialog containers

**Why Not Split?**
- Only 2 style exports
- Closely related layout concerns
- Small enough to navigate easily

## Working with Large Files

### Best Practices

1. **Use Section Markers**: Large files have clear `// ===` markers - use them for navigation

2. **IDE Navigation**:
   - Use "Go to Symbol" (Ctrl/Cmd + Shift + O) to jump to specific styles
   - Use file outline view for quick navigation
   - Collapse sections you're not working on

3. **Search Within File**:
   - Use Ctrl/Cmd + F to find specific style names
   - Use regex search for pattern matching

4. **Import Only What You Need**:
   ```typescript
   // Good - specific imports
   import { useDocumentStyles, useHeaderStyles } from './styles';
   
   // Avoid - importing everything
   import * as styles from './styles';
   ```

5. **Comment Your Changes**:
   - Add comments for non-obvious style decisions
   - Reference design tokens used
   - Note responsive breakpoints

### When to Split

Consider splitting when:
- File exceeds 2000 lines AND lacks clear organization
- Multiple unrelated components share the file
- Team struggles to navigate or causes merge conflicts
- Performance issues from large bundle size

Don't split when:
- File is well-organized with clear sections
- All content relates to a single component/feature
- Splitting would create excessive import overhead
- Current structure works well for the team

## Summary

The large files in this codebase are:
1. **Well-organized** with clear section markers
2. **Logically structured** around single components
3. **Easy to navigate** using IDE tools
4. **Not candidates for splitting** at this time

The focus has been on:
- ✅ Removing hard-coded values (800+ replaced)
- ✅ Standardizing with design tokens
- ✅ Improving consistency
- ✅ Adding documentation

Rather than split files that work well, we've created clear documentation and navigation aids.
