# Self-Guided PRD: Vite + React + TypeScript + Fluent UI v9 Prototype Framework

**Framework Version:** 1.0  
**Last Updated:** June 30, 2025  
**Target Technology Stack:** Vite, React 19, TypeScript, Fluent UI v9  
**Development Methodology:** Shell-First Incremental Component Development

---

## Table of Contents

1. [Framework Overview](#framework-overview)
2. [Project Setup Guidelines](#project-setup-guidelines)
3. [Architecture Foundation](#architecture-foundation)
4. [Component Development Framework](#component-development-framework)
5. [Phase-Based Development Process](#phase-based-development-process)
6. [Design System Standards](#design-system-standards)
7. [Component Templates & Patterns](#component-templates--patterns)
8. [Technical Implementation Guidelines](#technical-implementation-guidelines)
9. [Quality Assurance Framework](#quality-assurance-framework)
10. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
11. [Validation Checklists](#validation-checklists)

---

## Framework Overview

### Purpose

This self-guided PRD framework provides a systematic approach to building React-based prototypes and applications using proven patterns from successful projects. It reduces errors, ensures consistency, and accelerates development through incremental, component-driven methodologies.

### Key Principles

- **Shell-First Development**: Start with application structure, then add complexity
- **Component-Driven Architecture**: Build reusable, testable components
- **Progressive Enhancement**: Add features incrementally with validation at each step
- **Design System Consistency**: Leverage Fluent UI v9 for cohesive user experience
- **Type Safety**: Use TypeScript throughout for better developer experience

### Expected Outcomes

- Faster prototype development (30-50% reduction in initial development time)
- Fewer architectural errors through proven patterns
- Consistent UI/UX across components
- Maintainable and scalable codebase
- Clear development progression and milestones

---

## Project Setup Guidelines

### 1. Technology Stack Configuration

#### Core Dependencies

```json
{
  "dependencies": {
    "@fluentui/react-components": "^9.63.0+",
    "@fluentui/react-icons": "^2.0.298+",
    "@fluentui/react-utilities": "^9.19.0+",
    "@griffel/react": "^1.5.30+",
    "react": "^19.0.0+",
    "react-dom": "^19.0.0+",
    "typescript": "~5.7.2+"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4+",
    "vite": "^6.3.1+",
    "eslint": "^9.22.0+",
    "typescript-eslint": "^8.26.1+"
  }
}
```

#### Recommended Additional Dependencies

```json
{
  "optional": {
    "@fluentui-copilot/react-copilot": "^0.25.2+",
    "@fluentui/react-context-selector": "^9.1.76+",
    "@fluentui/react-tabster": "^9.24.6+"
  }
}
```

#### Project Structure Template

```
project-root/
├── docs/                     # Project documentation
│   ├── requirements.md       # Functional requirements
│   ├── component-specs/      # Individual component specifications
│   └── architecture.md       # Technical architecture docs
├── src/
│   ├── components/           # Reusable components
│   │   ├── foundation/       # Basic UI components (TitleBar, Navigation, etc.)
│   │   ├── data-display/     # Data presentation components
│   │   ├── interactive/      # Interactive components (forms, dialogs, etc.)
│   │   └── specialized/      # Domain-specific components
│   ├── context/             # React Context providers and hooks
│   ├── theme/               # Theme configuration and utilities
│   ├── assets/              # Static assets and mock data
│   └── types/               # TypeScript type definitions
├── public/                  # Public assets
└── tests/                   # Test files
```

### 2. Essential Configuration Files

#### Vite Configuration

```typescript
// vite.config.ts - Optimized for Fluent UI
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  optimizeDeps: {
    include: ["@fluentui/react-components", "@fluentui/react-icons"],
  },
});
```

#### TypeScript Configuration

```json
// tsconfig.json - Strict configuration
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## Architecture Foundation

### 1. Core Application Structure

#### Main App Component Template

```typescript
// App.tsx - Foundation template
import { makeStyles, shorthands } from "@griffel/react";
import { ThemeProvider } from "./theme/ThemeProvider";
import { NavigationProvider } from "./context/NavigationProvider";
// Import your shell components
import { TitleBar } from "./components/foundation/TitleBar";
import { BodyContent } from "./components/foundation/BodyContent";

const useStyles = makeStyles({
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    backgroundColor: "var(--colorNeutralBackground1)",
    ...shorthands.margin(0),
    ...shorthands.padding(0),
  },
  appContent: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    maxWidth: "1200px", // Adjust based on your design
    margin: "0 auto",
    overflow: "auto",
  },
});

function App() {
  const styles = useStyles();

  return (
    <ThemeProvider>
      <NavigationProvider>
        <div className={styles.app}>
          <div className={styles.appContent}>
            <TitleBar />
            {/* Add other shell components progressively */}
            <BodyContent />
          </div>
        </div>
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default App;
```

### 2. Context Architecture Pattern

#### Navigation Context Template

```typescript
// context/NavigationProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface NavigationState {
  currentStep: number;
  totalSteps: number;
  currentTab: string;
}

interface NavigationContextType {
  navigationState: NavigationState;
  navigateToStep: (step: number) => void;
  setCurrentTab: (tab: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentStep: 1,
    totalSteps: 5,
    currentTab: "note",
  });

  const navigateToStep = (step: number) => {
    setNavigationState((prev) => ({ ...prev, currentStep: step }));
  };

  const setCurrentTab = (tab: string) => {
    setNavigationState((prev) => ({ ...prev, currentTab: tab }));
  };

  return (
    <NavigationContext.Provider
      value={{
        navigationState,
        navigateToStep,
        setCurrentTab,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook for easy consumption
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
};
```

### 3. Theme Configuration

#### Theme Provider Template

```typescript
// theme/ThemeProvider.tsx
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Theme,
} from "@fluentui/react-components";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const currentTheme = isDarkMode ? webDarkTheme : webLightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, currentTheme }}>
      <FluentProvider theme={currentTheme}>{children}</FluentProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
```

---

## Component Development Framework

### 1. Component Classification System

#### Foundation Components (Phase 1)

**Purpose**: Basic layout and navigation components that form the application shell.

**Examples**:

- `TitleBar`: Application header with branding and global actions
- `Navigation`: Main navigation or step navigation
- `Toolbar`: Context-sensitive action buttons
- `BodyContent`: Main content container
- `Footer`: Application footer (if needed)

**Template**:

```typescript
// components/foundation/TitleBar.tsx
import { makeStyles, tokens } from "@fluentui/react-components";
import { Button, Text } from "@fluentui/react-components";

const useStyles = makeStyles({
  titleBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground6,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
});

export interface TitleBarProps {
  title: string;
  logo?: React.ReactNode;
  actions?: React.ReactNode[];
}

export const TitleBar: React.FC<TitleBarProps> = ({ title, logo, actions }) => {
  const styles = useStyles();

  return (
    <div className={styles.titleBar}>
      <div className={styles.leftSection}>
        {logo}
        <Text size={500} weight="semibold">
          {title}
        </Text>
      </div>
      <div className={styles.rightSection}>
        {actions?.map((action, index) => (
          <React.Fragment key={index}>{action}</React.Fragment>
        ))}
      </div>
    </div>
  );
};
```

#### Data Display Components (Phase 2)

**Purpose**: Components that present information to users.

**Examples**:

- `Card`: Reusable card container
- `DataSection`: Structured content display
- `Summary`: Information summary displays
- `StatusIndicator`: Status and progress indicators

#### Interactive Components (Phase 3)

**Purpose**: Components that handle user input and interactions.

**Examples**:

- `Form`: Input forms with validation
- `Dialog`: Modal dialogs and overlays
- `ActionPanel`: Interactive control panels
- `Search`: Search and filter components

#### Specialized Components (Phase 4)

**Purpose**: Domain-specific components for your application's unique requirements.

**Examples** (based on medical app):

- `PatientSummary`: Medical summary display
- `DocumentSection`: Medical document sections
- `AssessmentPlan`: Medical assessment and plan

### 2. Component Props Interface Standards

#### Base Props Interface

```typescript
// types/ComponentBase.ts
export interface BaseComponentProps {
  /** Unique identifier for the component */
  id?: string;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles (use sparingly) */
  style?: React.CSSProperties;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** ARIA label for accessibility */
  "aria-label"?: string;
  /** Test ID for testing */
  "data-testid"?: string;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  /** Click handler */
  onClick?: (event: React.MouseEvent) => void;
  /** Focus handler */
  onFocus?: (event: React.FocusEvent) => void;
  /** Blur handler */
  onBlur?: (event: React.FocusEvent) => void;
}

export interface DataComponentProps extends BaseComponentProps {
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string | null;
  /** Empty state message */
  emptyMessage?: string;
}
```

#### Component-Specific Props Template

```typescript
// Example: components/data-display/DocumentSection.tsx
export interface DocumentSectionProps extends DataComponentProps {
  /** Section title */
  title: string;
  /** Section content */
  content: string | React.ReactNode;
  /** Whether content is AI-generated (affects styling) */
  isAIGenerated?: boolean;
  /** Whether section is selected */
  isSelected?: boolean;
  /** Whether section is collapsible */
  collapsible?: boolean;
  /** Whether section is initially collapsed */
  defaultCollapsed?: boolean;
  /** Selection change handler */
  onSelectionChange?: (selected: boolean) => void;
  /** Resize handler */
  onResize?: (height: number) => void;
  /** Additional actions for the section header */
  headerActions?: React.ReactNode[];
}
```

---

## Phase-Based Development Process

### Phase 1: Foundation Shell (Week 1)

#### Objectives

- Establish project structure and core dependencies
- Create basic application layout
- Implement theme and context architecture
- Build foundation components

#### Deliverables Checklist

- [ ] Project setup with Vite + React + TypeScript
- [ ] Fluent UI v9 integration and theme configuration
- [ ] Basic App.tsx with provider hierarchy
- [ ] TitleBar component with basic layout
- [ ] Navigation component (placeholder)
- [ ] BodyContent container
- [ ] Theme toggle functionality

#### Validation Criteria

- Application loads without errors
- Basic navigation between mock screens works
- Theme switching functions correctly
- TypeScript compilation is error-free
- Basic responsive layout adapts to mobile

### Phase 2: Core Components (Week 2)

#### Objectives

- Build essential UI components
- Implement navigation logic
- Add basic interactivity
- Establish component communication patterns

#### Deliverables Checklist

- [ ] Enhanced navigation with active states
- [ ] Toolbar component with action buttons
- [ ] Basic dialog/modal system
- [ ] Form input components
- [ ] Loading and error states
- [ ] Component prop validation

#### Validation Criteria

- All components render correctly
- Navigation state management works
- Form validation functions properly
- Accessibility basics are implemented
- Component APIs are well-defined

### Phase 3: Data Integration (Week 3)

#### Objectives

- Implement data display components
- Add realistic mock data
- Build complex interactive components
- Optimize performance

#### Deliverables Checklist

- [ ] Data display components (cards, lists, tables)
- [ ] Mock data system with realistic content
- [ ] Search and filter functionality
- [ ] Sorting and pagination (if needed)
- [ ] Performance optimization (memoization, lazy loading)

#### Validation Criteria

- Components handle various data states
- Mock data is comprehensive and realistic
- Performance is acceptable with large datasets
- Error handling is robust
- User feedback is clear and helpful

### Phase 4: Specialized Features (Week 4+)

#### Objectives

- Implement domain-specific components
- Add advanced interactions
- Polish user experience
- Prepare for production

#### Deliverables Checklist

- [ ] Domain-specific components
- [ ] Advanced user interactions
- [ ] Animation and micro-interactions
- [ ] Comprehensive error handling
- [ ] Documentation and testing
- [ ] Production build optimization

#### Validation Criteria

- All requirements are met
- User experience is polished
- Performance meets targets
- Accessibility compliance is verified
- Code quality standards are met

---

## Design System Standards

### 1. Color Usage Guidelines

#### Background Colors

```typescript
// Standard backgrounds
const backgrounds = {
  primary: tokens.colorNeutralBackground1, // Main app background
  secondary: tokens.colorNeutralBackground2, // Card backgrounds
  elevated: tokens.colorNeutralBackground3, // Elevated surfaces
  accent: tokens.colorNeutralBackground6, // Headers/toolbars
};

// Semantic backgrounds
const semanticBackgrounds = {
  aiGenerated: "#EBF3FC", // Light blue for AI content
  userGenerated: "transparent", // No background for user content
  warning: tokens.colorPaletteYellowBackground1,
  error: tokens.colorPaletteRedBackground1,
  success: tokens.colorPaletteGreenBackground1,
};
```

#### Text Colors

```typescript
const textColors = {
  primary: tokens.colorNeutralForeground1,
  secondary: tokens.colorNeutralForeground2,
  disabled: tokens.colorNeutralForegroundDisabled,
  accent: tokens.colorBrandForeground1,
  onAccent: tokens.colorNeutralForegroundOnBrand,
};
```

### 2. Typography Scale

```typescript
const typography = {
  display: { size: 900, weight: "semibold" as const },
  title1: { size: 800, weight: "semibold" as const },
  title2: { size: 700, weight: "semibold" as const },
  title3: { size: 600, weight: "semibold" as const },
  subtitle1: { size: 500, weight: "semibold" as const },
  subtitle2: { size: 400, weight: "semibold" as const },
  body1: { size: 400, weight: "regular" as const },
  body2: { size: 300, weight: "regular" as const },
  caption1: { size: 200, weight: "regular" as const },
  caption2: { size: 100, weight: "regular" as const },
};
```

### 3. Spacing System

```typescript
const spacing = {
  none: tokens.spacingHorizontalNone,
  xxs: tokens.spacingHorizontalXXS,
  xs: tokens.spacingHorizontalXS,
  s: tokens.spacingHorizontalS,
  sNudge: tokens.spacingHorizontalSNudge,
  m: tokens.spacingHorizontalM,
  mNudge: tokens.spacingHorizontalMNudge,
  l: tokens.spacingHorizontalL,
  xl: tokens.spacingHorizontalXL,
  xxl: tokens.spacingHorizontalXXL,
  xxxl: tokens.spacingHorizontalXXXL,
};
```

### 4. Component Sizing Standards

```typescript
const componentSizes = {
  touchTarget: "44px", // Minimum touch target size
  buttonHeight: "32px", // Standard button height
  inputHeight: "32px", // Standard input height
  iconSize: "20px", // Standard icon size
  avatarSize: "32px", // Standard avatar size
  cardPadding: tokens.spacingHorizontalM,
  dialogPadding: tokens.spacingHorizontalL,
};
```

---

## Component Templates & Patterns

### 1. Data Display Component Template

```typescript
// components/data-display/SummaryCard.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardPreview,
  Text,
  Button,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { Copy20Regular, Info20Regular } from "@fluentui/react-icons";
import { BaseComponentProps, DataComponentProps } from "@/types/ComponentBase";

const useStyles = makeStyles({
  card: {
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalM,
    boxShadow: tokens.shadow8,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: tokens.spacingVerticalS,
  },
  content: {
    marginBottom: tokens.spacingVerticalM,
  },
  aiContent: {
    backgroundColor: "#EBF3FC",
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusSmall,
  },
  actions: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    justifyContent: "flex-end",
  },
});

export interface SummaryCardProps extends DataComponentProps {
  /** Card title */
  title: string;
  /** Card subtitle */
  subtitle?: string;
  /** Main content */
  content: React.ReactNode;
  /** Whether content is AI-generated */
  isAIGenerated?: boolean;
  /** Action buttons */
  actions?: React.ReactNode[];
  /** Copy functionality */
  onCopy?: () => void;
  /** Info callback */
  onInfo?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  subtitle,
  content,
  isAIGenerated = false,
  actions = [],
  onCopy,
  onInfo,
  loading = false,
  error,
  className,
  ...props
}) => {
  const styles = useStyles();

  if (loading) {
    return (
      <Card className={className} {...props}>
        <div>Loading...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className} {...props}>
        <div>Error: {error}</div>
      </Card>
    );
  }

  return (
    <Card className={`${styles.card} ${className || ""}`} {...props}>
      <div className={styles.header}>
        <div>
          <Text size={500} weight="semibold">
            {title}
          </Text>
          {subtitle && (
            <Text size={300} color="secondary">
              {subtitle}
            </Text>
          )}
        </div>
        <div className={styles.actions}>
          {onInfo && (
            <Button
              appearance="subtle"
              icon={<Info20Regular />}
              onClick={onInfo}
              aria-label="More information"
            />
          )}
          {onCopy && (
            <Button
              appearance="subtle"
              icon={<Copy20Regular />}
              onClick={onCopy}
              aria-label="Copy content"
            />
          )}
        </div>
      </div>

      <div
        className={`${styles.content} ${isAIGenerated ? styles.aiContent : ""}`}
      >
        {content}
      </div>

      {actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </div>
      )}
    </Card>
  );
};
```

### 2. Interactive Component Template

```typescript
// components/interactive/ActionDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  Input,
  Label,
  Field,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { InteractiveComponentProps } from "@/types/ComponentBase";

const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
});

export interface ActionDialogProps extends InteractiveComponentProps {
  /** Dialog title */
  title: string;
  /** Trigger button text */
  triggerText: string;
  /** Form fields configuration */
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "email" | "password";
    required?: boolean;
    placeholder?: string;
  }>;
  /** Submit handler */
  onSubmit: (data: Record<string, string>) => void | Promise<void>;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text */
  cancelText?: string;
}

export const ActionDialog: React.FC<ActionDialogProps> = ({
  title,
  triggerText,
  fields,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  disabled = false,
  ...props
}) => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setOpen(false);
      setFormData({});
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = fields
    .filter((field) => field.required)
    .every((field) => formData[field.name]?.trim());

  return (
    <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Button disabled={disabled} {...props}>
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent className={styles.content}>
            {fields.map((field) => (
              <Field key={field.name} className={styles.field}>
                <Label required={field.required}>{field.label}</Label>
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(_, data) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: data.value,
                    }))
                  }
                />
              </Field>
            ))}
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">{cancelText}</Button>
            </DialogTrigger>
            <Button
              appearance="primary"
              disabled={!isFormValid || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : submitText}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
```

### 3. Specialized Component Template

```typescript
// components/specialized/ResizableSection.tsx
import React, { useState, useRef, useCallback } from "react";
import {
  Card,
  Checkbox,
  Text,
  Button,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  ChevronDown20Regular,
  ChevronUp20Regular,
  Copy20Regular,
  MoreHorizontal20Regular,
} from "@fluentui/react-icons";
import { BaseComponentProps } from "@/types/ComponentBase";

const useStyles = makeStyles({
  section: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },
  content: {
    padding: tokens.spacingHorizontalM,
    resize: "vertical",
    overflow: "auto",
    minHeight: "100px",
  },
  aiContent: {
    backgroundColor: "#EBF3FC",
  },
  resizeHandle: {
    height: "8px",
    backgroundColor: tokens.colorNeutralBackground3,
    cursor: "ns-resize",
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground4,
    },
  },
});

export interface ResizableSectionProps extends BaseComponentProps {
  /** Section title */
  title: string;
  /** Section content */
  content: React.ReactNode;
  /** Whether content is AI-generated */
  isAIGenerated?: boolean;
  /** Whether section is selected */
  isSelected?: boolean;
  /** Whether section is collapsible */
  collapsible?: boolean;
  /** Whether section is initially collapsed */
  defaultCollapsed?: boolean;
  /** Initial height */
  defaultHeight?: number;
  /** Selection change handler */
  onSelectionChange?: (selected: boolean) => void;
  /** Collapse state change handler */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Resize handler */
  onResize?: (height: number) => void;
  /** Copy handler */
  onCopy?: () => void;
}

export const ResizableSection: React.FC<ResizableSectionProps> = ({
  title,
  content,
  isAIGenerated = false,
  isSelected = false,
  collapsible = true,
  defaultCollapsed = false,
  defaultHeight = 200,
  onSelectionChange,
  onCollapseChange,
  onResize,
  onCopy,
  className,
  ...props
}) => {
  const styles = useStyles();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [height, setHeight] = useState(defaultHeight);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCollapseToggle = useCallback(() => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const handleSelectionChange = useCallback(
    (checked: boolean) => {
      onSelectionChange?.(checked);
    },
    [onSelectionChange]
  );

  const handleResize = useCallback(
    (newHeight: number) => {
      setHeight(newHeight);
      onResize?.(newHeight);
    },
    [onResize]
  );

  return (
    <div className={`${styles.section} ${className || ""}`} {...props}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Checkbox
            checked={isSelected}
            onChange={(_, data) => handleSelectionChange(data.checked === true)}
          />
          <Text
            size={400}
            weight="semibold"
            style={{ textTransform: "uppercase" }}
          >
            {title}
          </Text>
        </div>

        <div className={styles.headerRight}>
          {onCopy && (
            <Button
              appearance="subtle"
              size="small"
              icon={<Copy20Regular />}
              onClick={onCopy}
              aria-label="Copy section content"
            />
          )}
          <Button
            appearance="subtle"
            size="small"
            icon={<MoreHorizontal20Regular />}
            aria-label="More options"
          />
          {collapsible && (
            <Button
              appearance="subtle"
              size="small"
              icon={
                isCollapsed ? <ChevronDown20Regular /> : <ChevronUp20Regular />
              }
              onClick={handleCollapseToggle}
              aria-label={isCollapsed ? "Expand section" : "Collapse section"}
            />
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div
            ref={contentRef}
            className={`${styles.content} ${
              isAIGenerated ? styles.aiContent : ""
            }`}
            style={{ height: `${height}px` }}
          >
            {content}
          </div>
          <div
            className={styles.resizeHandle}
            onMouseDown={(e) => {
              const startY = e.clientY;
              const startHeight = height;

              const handleMouseMove = (e: MouseEvent) => {
                const newHeight = Math.max(
                  100,
                  startHeight + e.clientY - startY
                );
                handleResize(newHeight);
              };

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
          />
        </>
      )}
    </div>
  );
};
```

---

## Technical Implementation Guidelines

### 1. Performance Optimization Patterns

#### Component Memoization

```typescript
// Memoize expensive components
export const ExpensiveComponent = React.memo<ExpensiveComponentProps>(
  ({ data, onAction, ...props }) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    // Custom comparison function if needed
    return (
      prevProps.data.id === nextProps.data.id &&
      prevProps.loading === nextProps.loading
    );
  }
);

// Memoize expensive calculations
export const DataProcessor: React.FC<DataProcessorProps> = ({ rawData }) => {
  const processedData = useMemo(() => {
    return expensiveDataProcessing(rawData);
  }, [rawData]);

  return <div>{/* Use processedData */}</div>;
};
```

#### Context Value Optimization

```typescript
// Optimize context values to prevent unnecessary re-renders
export const NavigationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState(initialState);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      state,
      actions: {
        navigateToStep: (step: number) =>
          setState((prev) => ({ ...prev, currentStep: step })),
        setCurrentTab: (tab: string) =>
          setState((prev) => ({ ...prev, currentTab: tab })),
      },
    }),
    [state]
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};
```

### 2. Error Handling Patterns

#### Error Boundary Component

```typescript
// components/foundation/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import { MessageBar, MessageBarType, Button } from "@fluentui/react-components";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <MessageBar intent="error">
            <div>
              <div>Something went wrong: {this.state.error?.message}</div>
              <Button
                onClick={() => this.setState({ hasError: false })}
                style={{ marginTop: "8px" }}
              >
                Try again
              </Button>
            </div>
          </MessageBar>
        )
      );
    }

    return this.props.children;
  }
}
```

#### Async Error Handling Hook

```typescript
// hooks/useAsyncError.ts
import { useState, useCallback } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useAsyncError = <T>() => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });

    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
};
```

### 3. Accessibility Implementation

#### Focus Management Hook

```typescript
// hooks/useFocusManagement.ts
import { useRef, useCallback, useEffect } from "react";

export const useFocusManagement = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const captureFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  const trapFocus = useCallback(
    (containerRef: React.RefObject<HTMLElement>) => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Tab") return;

        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    },
    []
  );

  return { captureFocus, restoreFocus, trapFocus };
};
```

#### ARIA Announcements Hook

```typescript
// hooks/useAnnouncements.ts
import { useCallback } from "react";

export const useAnnouncements = () => {
  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      const announcer = document.createElement("div");
      announcer.setAttribute("aria-live", priority);
      announcer.setAttribute("aria-atomic", "true");
      announcer.style.position = "absolute";
      announcer.style.left = "-10000px";
      announcer.style.width = "1px";
      announcer.style.height = "1px";
      announcer.style.overflow = "hidden";

      document.body.appendChild(announcer);
      announcer.textContent = message;

      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    },
    []
  );

  return { announce };
};
```

---

## Quality Assurance Framework

### 1. Component Testing Template

#### Unit Test Template

```typescript
// __tests__/components/SummaryCard.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { SummaryCard, SummaryCardProps } from "../SummaryCard";

const renderComponent = (props: Partial<SummaryCardProps> = {}) => {
  const defaultProps: SummaryCardProps = {
    title: "Test Title",
    content: "Test content",
    onCopy: jest.fn(),
    onInfo: jest.fn(),
  };

  return render(
    <FluentProvider theme={webLightTheme}>
      <SummaryCard {...defaultProps} {...props} />
    </FluentProvider>
  );
};

describe("SummaryCard", () => {
  it("renders with basic props", () => {
    renderComponent();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("shows AI styling when isAIGenerated is true", () => {
    renderComponent({ isAIGenerated: true });
    const content = screen.getByText("Test content").closest("div");
    expect(content).toHaveStyle({ backgroundColor: "#EBF3FC" });
  });

  it("calls onCopy when copy button is clicked", () => {
    const mockCopy = jest.fn();
    renderComponent({ onCopy: mockCopy });

    const copyButton = screen.getByLabelText("Copy content");
    fireEvent.click(copyButton);

    expect(mockCopy).toHaveBeenCalledTimes(1);
  });

  it("displays loading state", () => {
    renderComponent({ loading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays error state", () => {
    renderComponent({ error: "Test error" });
    expect(screen.getByText("Error: Test error")).toBeInTheDocument();
  });
});
```

#### Integration Test Template

```typescript
// __tests__/integration/Navigation.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavigationProvider } from "../context/NavigationProvider";
import { Navigation } from "../components/Navigation";
import { BodyContent } from "../components/BodyContent";

const TestApp = () => (
  <NavigationProvider>
    <Navigation />
    <BodyContent />
  </NavigationProvider>
);

describe("Navigation Integration", () => {
  it("updates content when navigation changes", () => {
    render(<TestApp />);

    // Initial state
    expect(screen.getByText("Step 1 Content")).toBeInTheDocument();

    // Navigate to step 2
    fireEvent.click(screen.getByText("Step 2"));
    expect(screen.getByText("Step 2 Content")).toBeInTheDocument();
    expect(screen.queryByText("Step 1 Content")).not.toBeInTheDocument();
  });
});
```

### 2. Accessibility Testing Checklist

#### Automated Accessibility Testing

```typescript
// __tests__/accessibility/A11y.test.tsx
import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { App } from "../App";

expect.extend(toHaveNoViolations);

describe("Accessibility", () => {
  it("should not have accessibility violations", async () => {
    const { container } = render(
      <FluentProvider theme={webLightTheme}>
        <App />
      </FluentProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

#### Manual Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible and clear
- [ ] ARIA labels are provided for icon buttons
- [ ] Form fields have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Color is not the only means of conveying information
- [ ] Text has sufficient contrast ratio (4.5:1 minimum)
- [ ] Images have appropriate alt text
- [ ] Headings follow logical hierarchy
- [ ] Skip links are provided for main content

### 3. Performance Testing Guidelines

#### Performance Monitoring

```typescript
// utils/performanceMonitor.ts
export const measureComponentRender = (componentName: string) => {
  return {
    start: () => performance.mark(`${componentName}-render-start`),
    end: () => {
      performance.mark(`${componentName}-render-end`);
      performance.measure(
        `${componentName}-render`,
        `${componentName}-render-start`,
        `${componentName}-render-end`
      );

      const measure = performance.getEntriesByName(
        `${componentName}-render`
      )[0];
      if (measure.duration > 16) {
        // More than one frame at 60fps
        console.warn(`${componentName} render took ${measure.duration}ms`);
      }
    },
  };
};

// Usage in component
export const ExpensiveComponent: React.FC = () => {
  useEffect(() => {
    const monitor = measureComponentRender("ExpensiveComponent");
    monitor.start();

    return () => {
      monitor.end();
    };
  }, []);

  return <div>{/* Component content */}</div>;
};
```

---

## Common Pitfalls & Solutions

### 1. Context Performance Issues

#### Problem

Multiple context providers causing unnecessary re-renders.

#### Solution

```typescript
// ❌ Bad: Single large context
const AppContext = createContext({
  user: null,
  navigation: null,
  theme: null,
  // ... many other values
});

// ✅ Good: Separate contexts by concern
const UserContext = createContext(null);
const NavigationContext = createContext(null);
const ThemeContext = createContext(null);

// ✅ Better: Memoized context values
const NavigationProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const value = useMemo(
    () => ({
      state,
      actions: {
        navigateToStep: useCallback((step) => {
          setState((prev) => ({ ...prev, currentStep: step }));
        }, []),
      },
    }),
    [state]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
```

### 2. CSS-in-JS Performance Issues

#### Problem

Creating styles inside component render function.

#### Solution

```typescript
// ❌ Bad: Styles created on every render
const Component = () => {
  const styles = makeStyles({
    container: { padding: "16px" }, // Created every render
  })();

  return <div className={styles.container} />;
};

// ✅ Good: Styles created outside component
const useStyles = makeStyles({
  container: { padding: tokens.spacingHorizontalM },
});

const Component = () => {
  const styles = useStyles();
  return <div className={styles.container} />;
};
```

### 3. State Management Complexity

#### Problem

Deep prop drilling and complex state updates.

#### Solution

```typescript
// ❌ Bad: Deep prop drilling
const App = () => {
  const [user, setUser] = useState(null);
  return <Component1 user={user} setUser={setUser} />;
};

const Component1 = ({ user, setUser }) => {
  return <Component2 user={user} setUser={setUser} />;
};

// ✅ Good: Context for global state
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Better: Custom hook with actions
const useUser = () => {
  const context = useContext(UserContext);
  return {
    ...context,
    login: useCallback(
      async (credentials) => {
        const user = await authService.login(credentials);
        context.setUser(user);
      },
      [context.setUser]
    ),
  };
};
```

### 4. Accessibility Oversights

#### Common Issues and Solutions

```typescript
// ❌ Bad: Missing accessibility attributes
<button onClick={handleClick}>
  <Icon />
</button>

// ✅ Good: Proper accessibility
<Button
  onClick={handleClick}
  aria-label="Copy to clipboard"
  icon={<Copy20Regular />}
/>

// ❌ Bad: No focus management in modal
const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return <div className="modal">{children}</div>;
};

// ✅ Good: Proper focus management
const Modal = ({ isOpen, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { captureFocus, restoreFocus, trapFocus } = useFocusManagement();

  useEffect(() => {
    if (isOpen) {
      captureFocus();
      return trapFocus(modalRef);
    } else {
      restoreFocus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
};
```

---

## Validation Checklists

### Phase 1 Validation Checklist

#### Project Setup

- [ ] Vite project created with React + TypeScript template
- [ ] Fluent UI v9 dependencies installed and configured
- [ ] ESLint and TypeScript configurations are strict
- [ ] Basic folder structure follows framework guidelines
- [ ] Git repository initialized with appropriate .gitignore

#### Application Shell

- [ ] App.tsx renders without errors
- [ ] Theme provider wraps application correctly
- [ ] Context providers are properly nested
- [ ] Basic routing/navigation structure exists
- [ ] TitleBar component displays correctly
- [ ] BodyContent container is responsive

#### Development Environment

- [ ] Hot module replacement works
- [ ] TypeScript compilation is error-free
- [ ] ESLint shows no warnings in clean code
- [ ] Browser dev tools show no console errors
- [ ] Application loads in under 2 seconds

### Phase 2 Validation Checklist

#### Component Architecture

- [ ] All foundation components follow naming conventions
- [ ] Component props interfaces are well-defined
- [ ] Components are properly typed with TypeScript
- [ ] Shared component props extend base interfaces
- [ ] Component files include proper exports

#### Navigation and State

- [ ] Navigation context works correctly
- [ ] State changes trigger appropriate re-renders
- [ ] Context values are properly memoized
- [ ] Custom hooks provide clean API
- [ ] State updates don't cause performance issues

#### Styling and Design

- [ ] All components use Fluent UI design tokens
- [ ] Consistent spacing and typography throughout
- [ ] Color usage follows design system guidelines
- [ ] Components adapt to theme changes
- [ ] Mobile responsiveness works correctly

### Phase 3 Validation Checklist

#### Data Integration

- [ ] Mock data is realistic and comprehensive
- [ ] Components handle loading states properly
- [ ] Error states are displayed appropriately
- [ ] Empty states provide helpful guidance
- [ ] Data flow from context to components works

#### User Interactions

- [ ] All interactive elements respond to user input
- [ ] Form validation provides clear feedback
- [ ] Buttons have appropriate disabled states
- [ ] Hover and focus states are visible
- [ ] Touch targets meet minimum size requirements

#### Performance

- [ ] Components render in under 100ms
- [ ] No unnecessary re-renders detected
- [ ] Memory usage remains stable
- [ ] Smooth animations and transitions
- [ ] Bundle size is reasonable (<500kb gzipped)

### Phase 4 Validation Checklist

#### Feature Completeness

- [ ] All required features are implemented
- [ ] Specialized components work as specified
- [ ] Edge cases are handled properly
- [ ] User workflows function end-to-end
- [ ] Integration between components is seamless

#### Quality Assurance

- [ ] Automated tests pass
- [ ] Manual testing covers all user paths
- [ ] Accessibility standards are met
- [ ] Performance targets are achieved
- [ ] Error handling is comprehensive

#### Production Readiness

- [ ] Build process completes without errors
- [ ] Environment variables are properly configured
- [ ] Error logging is implemented
- [ ] Documentation is complete
- [ ] Code review checklist is satisfied

### Final Deployment Checklist

#### Code Quality

- [ ] No TypeScript errors or warnings
- [ ] ESLint rules pass without exceptions
- [ ] Code follows established patterns
- [ ] Comments explain complex logic
- [ ] No debug code or console.logs remain

#### Testing

- [ ] Unit tests cover critical functionality
- [ ] Integration tests verify component interaction
- [ ] Accessibility testing shows no violations
- [ ] Performance testing meets benchmarks
- [ ] Manual testing covers all features

#### Documentation

- [ ] README includes setup instructions
- [ ] Component APIs are documented
- [ ] Architecture decisions are recorded
- [ ] Deployment process is documented
- [ ] Known issues and limitations are noted

---

## Conclusion

This self-guided PRD framework provides a systematic approach to building React applications with Vite, TypeScript, and Fluent UI v9. By following the phase-based development process and using the provided templates and patterns, you can:

1. **Reduce development time** by leveraging proven architectural patterns
2. **Minimize errors** through comprehensive validation checklists
3. **Ensure consistency** with standardized component templates
4. **Maintain quality** through built-in testing and accessibility guidelines
5. **Scale effectively** with well-defined component hierarchies

### Next Steps

1. **Customize the framework** for your specific domain requirements
2. **Create domain-specific component templates** based on your use cases
3. **Establish team coding standards** using this framework as a baseline
4. **Iterate and improve** the framework based on project experiences
5. **Share learnings** back to the framework to improve future projects

### Framework Maintenance

- Review and update framework quarterly
- Incorporate lessons learned from completed projects
- Update dependencies and address breaking changes
- Expand component template library based on common patterns
- Enhance validation checklists based on encountered issues

---

**Framework Prepared By**: Development Team  
**Version**: 1.0  
**Next Review**: Quarterly  
**Feedback**: Please contribute improvements and lessons learned back to this framework
