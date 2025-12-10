# Implementation Plan: Dragon Copilot Patient Dashboard

**Project**: HiFi Prototype Implementation  
**Technology Stack**: Vite + React 19 + TypeScript + Fluent UI v2  
**Development Methodology**: Shell-First Incremental Component Development  
**Date**: June 30, 2025  
**Version**: 1.0 (Living Document - Will Evolve During Development)

> **Note**: This implementation plan is designed to be a living document that will be updated and refined as we progress through development. Component specifications, design decisions, and technical approaches may evolve based on discoveries during implementation, user feedback, and technical constraints.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Design Analysis](#design-analysis)
3. [Phase 1: Application Shell](#phase-1-application-shell)
4. [Phase 2: Main/Core Components](#phase-2-maincore-components)
5. [Phase 3: Body/Content Components](#phase-3-bodycontent-components)
6. [Responsive Design Strategy](#responsive-design-strategy)
7. [Component Architecture](#component-architecture)
8. [Implementation Guidelines](#implementation-guidelines)
9. [Testing & Validation](#testing--validation)

---

## Executive Summary

This implementation plan provides a structured approach to building a high-fidelity prototype of the Dragon Copilot Patient Dashboard based on the Figma design. The application will be developed in three distinct phases, prioritizing responsive design and component reusability across Large (Desktop), Medium (Tablet), and Small (Mobile) screen sizes.

### Key Features Identified:

- **Medical Document Management**: Patient dashboard with document workflow
- **AI-Powered Copilot**: Right panel with conversational AI interface
- **Voice Recording**: Integrated microphone functionality
- **Patient Summary**: Expandable sections with medical information
- **Real-time Workflow**: Document creation and memo management

---

## Design Analysis

### Layout Structure

The design follows a three-column layout structure:

1. **Left Navigation**: Collapsible sidebar (44px width when collapsed)
2. **Main Content**: Variable width content area with workflow and patient information
3. **Right Panel**: Fixed-width AI Copilot interface (320px)

### Color Palette (Fluent UI v2 Design Tokens)

```typescript
import { tokens } from "@fluentui/react-components";

// Primary Brand Colors
tokens.colorBrandBackground1; // #ebf3fc (light brand background)
tokens.colorBrandBackground2; // Brand background variations
tokens.colorBrandForeground1; // #0f6cbd (primary brand)
tokens.colorBrandForeground2; // #115ea3 (secondary brand)

// Neutral Background Colors
tokens.colorNeutralBackground1; // #ffffff (primary background)
tokens.colorNeutralBackground2; // #fafafa (subtle background)
tokens.colorNeutralBackground3; // #f5f5f5 (card/surface background)
tokens.colorNeutralBackground4; // #f0f0f0 (elevated surface)
tokens.colorNeutralBackground5; // #ebebeb (pressed surface)
tokens.colorNeutralBackground6; // #e0e0e0 (subtle borders)

// Neutral Foreground Colors
tokens.colorNeutralForeground1; // #242424 (primary text)
tokens.colorNeutralForeground2; // #424242 (secondary text)
tokens.colorNeutralForeground3; // #616161 (tertiary text)
tokens.colorNeutralForegroundOnBrand; // #ffffff (text on brand)

// Stroke/Border Colors
tokens.colorNeutralStroke1; // #d1d1d1 (subtle borders)
tokens.colorNeutralStroke2; // #c7c7c7 (medium borders)
tokens.colorNeutralStrokeAccessible; // #616161 (accessible borders)

// Status Colors
tokens.colorPaletteGreenForeground1; // Success/positive states
tokens.colorStatusSuccessBorder1; // #00cc6a (success borders)
tokens.colorNeutralForegroundDisabled; // #bdbdbd (disabled state)
```

### Typography System

```typescript
import { tokens } from "@fluentui/react-components";

// Font Family
tokens.fontFamilyBase; // 'Segoe UI', sans-serif

// Font Sizes
tokens.fontSizeBase100; // 10px (caption/small text)
tokens.fontSizeBase200; // 12px (caption text)
tokens.fontSizeBase300; // 14px (body text)
tokens.fontSizeBase400; // 16px (body large)
tokens.fontSizeBase500; // 20px (subtitle)
tokens.fontSizeBase600; // 24px (title)

// Line Heights
tokens.lineHeightBase100; // 14px (tight)
tokens.lineHeightBase200; // 16px (caption)
tokens.lineHeightBase300; // 20px (body)
tokens.lineHeightBase400; // 22px (body large)
tokens.lineHeightBase500; // 28px (subtitle)
tokens.lineHeightBase600; // 32px (title)

// Font Weights
tokens.fontWeightRegular; // 400
tokens.fontWeightMedium; // 500
tokens.fontWeightSemibold; // 600
tokens.fontWeightBold; // 700
```

### Spacing & Layout System

```typescript
import { tokens } from "@fluentui/react-components";

// Spacing Scale
tokens.spacingNone; // 0px
tokens.spacingHorizontalXXS; // 2px
tokens.spacingHorizontalXS; // 4px
tokens.spacingHorizontalSNudge; // 6px
tokens.spacingHorizontalS; // 8px
tokens.spacingHorizontalMNudge; // 10px
tokens.spacingHorizontalM; // 12px
tokens.spacingHorizontalL; // 16px
tokens.spacingHorizontalXL; // 20px
tokens.spacingHorizontalXXL; // 24px

// Vertical Spacing
tokens.spacingVerticalXXS; // 2px
tokens.spacingVerticalXS; // 4px
tokens.spacingVerticalS; // 8px
tokens.spacingVerticalM; // 12px
tokens.spacingVerticalL; // 16px
tokens.spacingVerticalXL; // 20px
tokens.spacingVerticalXXL; // 24px

// Border Radius
tokens.borderRadiusNone; // 0px
tokens.borderRadiusSmall; // 4px
tokens.borderRadiusMedium; // 6px
tokens.borderRadiusLarge; // 8px
tokens.borderRadiusXLarge; // 12px
tokens.borderRadiusCircular; // 9999px

// Shadows
tokens.shadow2; // Subtle card elevation
tokens.shadow4; // Standard elevation
tokens.shadow8; // Higher elevation
tokens.shadow16; // Modal/overlay elevation
```

### Fluent UI v2 Token Integration

**Critical Implementation Note**: All design system values (colors, typography, spacing, borders, shadows, etc.) must use Fluent UI v2 React tokens instead of hardcoded CSS values. This ensures consistency with Microsoft Design Language and enables automatic theme switching.

**Token Usage Guidelines:**

- ✅ **Use Fluent UI tokens for**: Colors, typography, spacing scales, border radius, shadows, breakpoints
- ✅ **Use hardcoded values for**: Component-specific dimensions (panel widths, button sizes), layout constraints, max-widths
- ✅ **Example**: `width: '320px'` (component dimension) vs `padding: tokens.spacingHorizontalM` (design system spacing)

#### Example Component Styling with Tokens:

```typescript
import { tokens } from "@fluentui/react-components";
import { makeStyles } from "@fluentui/react-components";

// Define styles using Fluent UI v2 tokens
const useStyles = makeStyles({
  container: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    padding: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: tokens.shadow4,
  },

  primaryButton: {
    backgroundColor: tokens.colorBrandBackground1,
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    borderRadius: tokens.borderRadiusMedium,
    border: "none",
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2,
    },
  },

  card: {
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    padding: tokens.spacingHorizontalL,
    marginBottom: tokens.spacingVerticalM,
    boxShadow: tokens.shadow2,
  },
});

// Usage in component
export const PatientCard: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.card}>
      <h3
        style={{
          fontSize: tokens.fontSizeBase500,
          fontWeight: tokens.fontWeightSemibold,
          color: tokens.colorNeutralForeground1,
          margin: 0,
          marginBottom: tokens.spacingVerticalS,
        }}
      >
        Patient Information
      </h3>

      <button className={styles.primaryButton}>View Details</button>
    </div>
  );
};
```

#### Responsive Design with Tokens:

```typescript
const useResponsiveStyles = makeStyles({
  sidebar: {
    width: "320px",
    backgroundColor: tokens.colorNeutralBackground2,
    padding: tokens.spacingHorizontalM,

    "@media (max-width: 1024px)": {
      width: "280px",
      padding: tokens.spacingHorizontalS,
    },

    "@media (max-width: 768px)": {
      width: "100%",
      padding: tokens.spacingHorizontalXS,
    },
  },
});
```

#### Token Categories:

- **Colors**: `tokens.colorBrand*`, `tokens.colorNeutral*`, `tokens.colorStatus*`
- **Typography**: `tokens.fontSize*`, `tokens.fontWeight*`, `tokens.lineHeight*`
- **Spacing**: `tokens.spacingHorizontal*`, `tokens.spacingVertical*`
- **Layout**: `tokens.borderRadius*`, `tokens.shadow*`

---

## Phase 1: Application Shell

**Duration**: Week 1  
**Objective**: Establish the foundational layout and navigation structure

### 1.1 Core Infrastructure

#### Project Setup

```bash
# Initial setup commands
npm create vite@latest dragon-copilot -- --template react-ts
cd dragon-copilot
npm install @fluentui/react-components @fluentui/react-icons
```

#### Root App Component (`src/App.tsx`)

```typescript
interface AppProps {
  className?: string;
}

export const App: React.FC<AppProps> = ({ className }) => {
  return (
    <FluentProvider theme={webLightTheme}>
      <div className={`app-container ${className || ""}`}>
        <TitleBar />
        <div className="app-body">
          <LeftNavigation />
          <MainContent />
          <RightPanel />
        </div>
      </div>
    </FluentProvider>
  );
};
```

### 1.2 Title Bar Component

**File**: `src/components/foundation/TitleBar.tsx`

```typescript
interface TitleBarProps {
  title?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title = "Dragon Copilot",
  onMinimize,
  onMaximize,
  onClose,
}) => {
  return (
    <div className="title-bar">
      <div className="title-content">
        <div className="title-left">
          <CopilotIcon />
          <Text weight="semibold">{title}</Text>
        </div>
        <div className="title-actions">
          <Button
            appearance="subtle"
            icon={<Minimize20Regular />}
            onClick={onMinimize}
          />
          <Button
            appearance="subtle"
            icon={<Maximize20Regular />}
            onClick={onMaximize}
          />
          <Button
            appearance="subtle"
            icon={<Dismiss20Regular />}
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};
```

**Styles**: Using `makeStyles` with Fluent UI v2 tokens

```typescript
import { makeStyles, tokens } from "@fluentui/react-components";

const useTitleBarStyles = makeStyles({
  titleBar: {
    height: "35px",
    backgroundColor: tokens.colorNeutralBackground4,
    borderTopLeftRadius: tokens.borderRadiusLarge,
    borderTopRightRadius: tokens.borderRadiusLarge,
    display: "flex",
    alignItems: "center",
    padding: `0 ${tokens.spacingHorizontalL}`,
  },

  titleContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  titleLeft: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
  },

  titleActions: {
    display: "flex",
    gap: tokens.spacingHorizontalXS,
  },

  // Responsive Design
  titleBarMobile: {
    "@media (max-width: 768px)": {
      padding: `0 ${tokens.spacingHorizontalS}`,
    },
  },

  titleLeftMobile: {
    "@media (max-width: 768px)": {
      gap: tokens.spacingHorizontalS,
    },
  },

  titleActionsMobile: {
    "@media (max-width: 480px)": {
      gap: tokens.spacingHorizontalXXS,
    },
  },
});
```

### 1.3 Left Navigation Component

**File**: `src/components/foundation/LeftNavigation.tsx`

```typescript
interface NavigationItem {
  id: string;
  icon: React.ComponentType;
  label: string;
  active?: boolean;
}

interface LeftNavigationProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const LeftNavigation: React.FC<LeftNavigationProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const topNavItems: NavigationItem[] = [
    { id: "menu", icon: Navigation20Regular, label: "Menu" },
    { id: "person", icon: Person20Regular, label: "Person" },
    { id: "patient", icon: Patient20Regular, label: "Patient", active: true },
    { id: "calendar", icon: Calendar20Regular, label: "Calendar" },
    { id: "documents", icon: Document20Regular, label: "Documents" },
  ];

  const bottomNavItems: NavigationItem[] = [
    { id: "settings", icon: Settings20Regular, label: "Settings" },
    { id: "help", icon: QuestionCircle20Regular, label: "Help" },
    { id: "profile", icon: PersonCircle20Regular, label: "Profile" },
    { id: "signout", icon: SignOut20Regular, label: "Sign Out" },
  ];

  return (
    <nav className={`left-navigation ${collapsed ? "collapsed" : ""}`}>
      <div className="nav-top">
        {topNavItems.map((item) => (
          <NavItem key={item.id} item={item} collapsed={collapsed} />
        ))}
      </div>
      <div className={styles.navBottom}>
        {bottomNavItems.map((item) => (
          <NavItem key={item.id} item={item} collapsed={collapsed} />
        ))}
      </div>
    </nav>
  );
};
```

**Styles**: Using `makeStyles` with Fluent UI v2 tokens

```typescript
import { makeStyles, tokens } from "@fluentui/react-components";

const useLeftNavigationStyles = makeStyles({
  leftNavigation: {
    width: "44px",
    backgroundColor: tokens.colorNeutralBackground4,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transitionProperty: "width",
    transitionDuration: "0.3s",
    transitionTimingFunction: "ease",
  },

  expanded: {
    width: "200px",
  },

  navTop: {
    display: "flex",
    flexDirection: "column",
  },

  navBottom: {
    display: "flex",
    flexDirection: "column",
  },

  navItem: {
    height: "35px",
    display: "flex",
    alignItems: "center",
    padding: `0 ${tokens.spacingHorizontalM}`,
    cursor: "pointer",
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
    transitionTimingFunction: "ease",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1,
    },
  },

  navItemActive: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderLeft: `4px solid ${tokens.colorBrandForeground1}`,
  },
});
```

/_ Responsive Design - Mobile First _/
@media (max-width: 768px) {
.left-navigation {
position: fixed;
left: -44px;
top: 35px;
height: calc(100vh - 35px);
z-index: 1000;
transition: left 0.3s ease;
}

.left-navigation.mobile-open {
left: 0;
}

.left-navigation.expanded {
width: 250px;
}
}

@media (max-width: 480px) {
.left-navigation.expanded {
width: 100vw;
}
}

````

### 1.4 Patient Summary Header

**File**: `src/components/foundation/PatientSummaryHeader.tsx`

```typescript
interface PatientSummaryHeaderProps {
  patientName: string;
  recordingTime?: string;
  isRecording?: boolean;
}

export const PatientSummaryHeader: React.FC<PatientSummaryHeaderProps> = ({
  patientName,
  recordingTime = "00:00",
  isRecording = false
}) => {
  return (
    <div className="patient-summary-header">
      <div className="patient-info">
        <Badge
          appearance="filled"
          color="informative"
          icon={<Play16Regular />}
        >
          {recordingTime}
        </Badge>
        <Text size={500} weight="semibold">{patientName}</Text>
      </div>
    </div>
  );
};
````

**Styles**: Using `makeStyles` with Fluent UI v2 tokens

```typescript
import { makeStyles, tokens } from "@fluentui/react-components";

const usePatientSummaryHeaderStyles = makeStyles({
  patientSummaryHeader: {
    backgroundColor: tokens.colorBrandBackground1,
    borderBottom: `1px solid ${tokens.colorBrandForeground1}`,
    padding: tokens.spacingHorizontalM,
  },

  patientInfo: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },

  // Responsive Design
  patientSummaryHeaderTablet: {
    "@media (max-width: 768px)": {
      padding: tokens.spacingHorizontalS,
    },
  },

  patientInfoTablet: {
    "@media (max-width: 768px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: tokens.spacingHorizontalS,
    },
  },

  patientSummaryHeaderMobile: {
    "@media (max-width: 480px)": {
      padding: tokens.spacingHorizontalSNudge,
    },
  },
});
```

### 1.5 Responsive Layout Container

**File**: `src/components/foundation/ResponsiveLayout.tsx`

```typescript
interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 480);
      setIsTablet(window.innerWidth >= 480 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div
      className={`responsive-layout ${className || ""} ${
        isMobile ? "mobile" : isTablet ? "tablet" : "desktop"
      }`}
    >
      {children}
    </div>
  );
};
```

**Phase 1 Deliverables:**

- [ ] Project setup with Vite + React + TypeScript
- [ ] Fluent UI v2 integration
- [ ] Title bar with window controls
- [ ] Collapsible left navigation
- [ ] Patient summary header
- [ ] Responsive layout foundation
- [ ] CSS custom properties system
- [ ] Basic routing structure

---

## Phase 2: Main/Core Components

**Duration**: Week 2  
**Objective**: Build the main content area and workflow components

### 2.1 Action Bar Component

**File**: `src/components/core/ActionBar.tsx`

```typescript
interface ActionBarProps {
  title: string;
  leftActions?: React.ReactNode[];
  rightActions?: React.ReactNode[];
}

export const ActionBar: React.FC<ActionBarProps> = ({
  title,
  leftActions = [],
  rightActions = [],
}) => {
  return (
    <div className="action-bar">
      <div className="action-bar-content">
        <Text size={500} weight="bold">
          {title}
        </Text>
        <div className="action-groups">
          <div className="left-actions">
            <Button appearance="subtle" icon={<ArrowUpRight20Filled />}>
              Workflow
            </Button>
            <Divider vertical />
            <Button appearance="outline" icon={<DocumentAdd16Regular />}>
              Add document
            </Button>
            {leftActions}
          </div>
          <div className="right-actions">
            <Button appearance="subtle" icon={<Search16Regular />} />
            <Button appearance="subtle" icon={<MoreHorizontal16Regular />} />
            <Button appearance="subtle" icon={<Settings16Regular />} />
            {rightActions}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 2.2 Workflow Panel Component

**File**: `src/components/core/WorkflowPanel.tsx`

```typescript
interface WorkflowSection {
  title: string;
  items: string[];
  checked: boolean[];
}

interface WorkflowPanelProps {
  onStartRecording?: () => void;
  onReviewPatient?: () => void;
  onToggleExpanded?: () => void;
  expanded?: boolean;
}

export const WorkflowPanel: React.FC<WorkflowPanelProps> = ({
  onStartRecording,
  onReviewPatient,
  onToggleExpanded,
  expanded = false,
}) => {
  const documentsSection: WorkflowSection = {
    title: "Documents and orders",
    items: ["Note", "Referral letter", "Orders"],
    checked: [true, true, true],
  };

  const suggestionsSection: WorkflowSection = {
    title: "Suggestions",
    items: ["After visit summary", "Document name"],
    checked: [false, false],
  };

  return (
    <Card className="workflow-panel">
      <div className="workflow-header">
        <Button
          appearance="subtle"
          icon={<ArrowUpRight20Regular />}
          onClick={onToggleExpanded}
        />
        <Text size={500} weight="semibold">
          Workflow
        </Text>
        <Button
          appearance="subtle"
          icon={<Dismiss20Regular />}
          onClick={onToggleExpanded}
        />
      </div>

      <div className="workflow-content">
        <div className="workflow-sections">
          <WorkflowSection section={documentsSection} />
          <WorkflowSection section={suggestionsSection} />
        </div>

        <div className="workflow-actions">
          <Button
            appearance="primary"
            icon={<Mic24Regular />}
            onClick={onStartRecording}
          >
            Start recording
          </Button>
          <Button appearance="outline" onClick={onReviewPatient}>
            Review patient
          </Button>
        </div>
      </div>
    </Card>
  );
};
```

### 2.3 Main Content Container

**File**: `src/components/core/MainContent.tsx`

```typescript
interface MainContentProps {
  children?: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <div className="main-content">
      <ActionBar title="Patient dashboard" />
      <WorkflowPanel />
      <div className="content-body">{children}</div>
    </div>
  );
};
```

**Styles**: `src/components/core/MainContent.module.css`

```css
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevents flex item from overflowing */
}

.content-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .content-body {
    flex-direction: column;
  }
}
```

### 2.4 Right Panel (Copilot Interface)

**File**: `src/components/core/CopilotPanel.tsx`

```typescript
interface CopilotMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  references?: Reference[];
}

interface CopilotPanelProps {
  messages?: CopilotMessage[];
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({
  messages = [],
  onSendMessage,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="copilot-panel">
      <div className="copilot-header">
        <div className="header-content">
          <CopilotIcon size={24} />
          <Text size={400} weight="semibold">
            Copilot
          </Text>
        </div>
        <Button
          appearance="subtle"
          icon={<Dismiss20Regular />}
          onClick={onClose}
        />
      </div>

      <div className="copilot-body">
        <div className="messages-container">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>

      <div className="copilot-footer">
        <Textarea
          placeholder="Ask Dragon Copilot for help"
          value={inputValue}
          onChange={(_, data) => setInputValue(data.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          appearance="subtle"
          icon={<Send20Regular />}
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};
```

**Styles**: Using `makeStyles` with Fluent UI v2 tokens

```typescript
import { makeStyles, tokens } from "@fluentui/react-components";

const useCopilotPanelStyles = makeStyles({
  copilotPanel: {
    width: "320px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },

  copilotHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },

  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },

  copilotBody: {
    flex: 1,
    overflowY: "auto",
    padding: tokens.spacingHorizontalL,
  },

  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },

  copilotFooter: {
    padding: tokens.spacingHorizontalS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    gap: tokens.spacingHorizontalS,
    alignItems: "flex-end",
  },

  // Responsive Design
  copilotPanelTablet: {
    "@media (max-width: 1024px)": {
      width: "280px",
    },
  },

  copilotPanelMobile: {
    "@media (max-width: 768px)": {
      position: "fixed",
      top: 0,
      right: "-100%",
      width: "100%",
      height: "100vh",
      zIndex: 1000,
      transitionProperty: "right",
      transitionDuration: "0.3s",
      transitionTimingFunction: "ease",
    },
  },

  mobileOpen: {
    "@media (max-width: 768px)": {
      right: 0,
    },
  },

  copilotFooterMobile: {
    "@media (max-width: 480px)": {
      padding: tokens.spacingHorizontalSNudge,
    },
  },
});
```

**Phase 2 Deliverables:**

- [ ] Action bar with title and controls
- [ ] Workflow panel with checkboxes
- [ ] Main content layout structure
- [ ] Copilot panel foundation
- [ ] Message bubble components
- [ ] Input/textarea components
- [ ] Responsive behavior for tablet sizes

---

## Phase 3: Body/Content Components

**Duration**: Week 3  
**Objective**: Implement patient content and detailed medical components

### 3.1 Patient Summary Accordion

**File**: `src/components/content/PatientSummaryAccordion.tsx`

```typescript
interface PatientSummaryData {
  personalInfo: {
    name: string;
    age: number;
    gender: string;
    bmi: number;
    allergies: string[];
  };
  medications: Medication[];
  medicalHistory: string[];
}

interface PatientSummaryAccordionProps {
  data: PatientSummaryData;
  defaultExpanded?: boolean;
}

export const PatientSummaryAccordion: React.FC<
  PatientSummaryAccordionProps
> = ({ data, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card className="patient-summary-accordion">
      <div className="accordion-header" onClick={() => setExpanded(!expanded)}>
        <Button
          appearance="subtle"
          icon={expanded ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
        />
        <Text size={500} weight="bold">
          Patient summary
        </Text>
        <div className="header-actions">
          <Button appearance="outline" size="small">
            Standard
          </Button>
          <Button appearance="subtle" icon={<Copy16Regular />} />
          <Button appearance="subtle" icon={<Share16Regular />} />
        </div>
      </div>

      {expanded && (
        <div className="accordion-content">
          <div className="summary-text">
            <Text>
              {data.personalInfo.name} is a middle-aged{" "}
              {data.personalInfo.gender.toLowerCase()}
              with a history of chronic hypertension and hyperlipidemia. He is a
              former smoker (quit in 2021) and has a family history of cardiovascular
              disease. His BMI is {data.personalInfo.bmi}. No known drug allergies.
            </Text>
          </div>

          <div className="medications-section">
            <Text weight="semibold" block>
              Current medications
            </Text>
            <ul className="medications-list">
              {data.medications.map((med, index) => (
                <li key={index}>
                  <Text>
                    {med.name} {med.dosage} {med.frequency}
                  </Text>
                </li>
              ))}
            </ul>
          </div>

          <div className="subsections">
            <SubAccordion title="Problem list" />
            <SubAccordion title="Imaging" />
            <SubAccordion title="Previous note" />
          </div>

          <ReferenceList
            references={[
              { id: "1", type: "transcript", title: "Transcript" },
              { id: "2", type: "note", title: "Note" },
            ]}
          />

          <div className="ai-disclaimer">
            <Text size={200}>AI generated content may be incorrect</Text>
          </div>
        </div>
      )}
    </Card>
  );
};
```

### 3.2 Memo Component

**File**: `src/components/content/MemoComponent.tsx`

```typescript
interface MemoData {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  isEditing?: boolean;
}

interface MemoComponentProps {
  memo: MemoData;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onToggleEdit?: (id: string) => void;
}

export const MemoComponent: React.FC<MemoComponentProps> = ({
  memo,
  onEdit,
  onDelete,
  onToggleEdit,
}) => {
  const [content, setContent] = useState(memo.content);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="memo-component">
      <div className="memo-header">
        <Button appearance="subtle" icon={<ChevronDown20Regular />} />
        <Text size={500} weight="bold">
          Memos
        </Text>
      </div>

      <div className="memo-actions">
        <Button appearance="primary" size="small" icon={<Add12Regular />}>
          Add memo
        </Button>
        <Button appearance="subtle" icon={<Copy16Regular />} />
        <Button appearance="subtle" icon={<Share16Regular />} />
      </div>

      <div className="memo-content">
        <div className="memo-title-row">
          <div className="memo-indicator" />
          <Input
            value={memo.title}
            appearance="underline"
            readOnly={!memo.isEditing}
          />
          <Button appearance="subtle" icon={<Edit16Regular />} />
          <Button appearance="subtle" icon={<Delete16Regular />} />
          <Checkbox />
        </div>

        <div className="memo-text-area">
          <Textarea
            value={content}
            onChange={(_, data) => setContent(data.value)}
            placeholder="Start typing your memo..."
            rows={8}
            appearance={memo.isEditing ? "filled-darker" : "outline"}
            readOnly={!memo.isEditing}
          />

          {isLoading && (
            <div className="loading-indicator">
              <Spinner size="small" />
            </div>
          )}
        </div>

        <Button
          appearance="primary"
          icon={<Add12Regular />}
          style={{ width: "100%" }}
        >
          Add memo
        </Button>
      </div>
    </Card>
  );
};
```

### 3.3 Message Bubble Component

**File**: `src/components/content/MessageBubble.tsx`

```typescript
interface Reference {
  id: string;
  type: "transcript" | "note" | "document";
  title: string;
}

interface MessageBubbleProps {
  message: CopilotMessage;
  onCopy?: () => void;
  onFeedback?: (positive: boolean) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onCopy,
  onFeedback,
}) => {
  const isUser = message.type === "user";

  return (
    <div className={`message-bubble ${isUser ? "user" : "assistant"}`}>
      {isUser ? (
        <div className="user-message">
          <Text>{message.content}</Text>
        </div>
      ) : (
        <Card className="assistant-message">
          <div className="message-header">
            <Text size={200} color="secondary">
              {message.timestamp.toLocaleTimeString()}
            </Text>
            <Text size={200} color="secondary">
              AI response
            </Text>
            <div className="message-actions">
              <Button
                appearance="subtle"
                size="small"
                icon={<Copy16Regular />}
                onClick={onCopy}
              />
              <Button
                appearance="subtle"
                size="small"
                icon={<ThumbLike16Regular />}
                onClick={() => onFeedback?.(true)}
              />
            </div>
          </div>

          <div className="message-title">
            <CopilotIcon size={20} />
            <Text weight="semibold">Information Assist</Text>
          </div>

          <div className="message-content">
            <MarkdownRenderer content={message.content} />
          </div>

          {message.references && (
            <ReferenceList references={message.references} />
          )}

          <div className="ai-disclaimer">
            <Text size={200}>AI generated content may be incorrect</Text>
          </div>
        </Card>
      )}
    </div>
  );
};
```

### 3.4 Microphone Interface

**File**: `src/components/content/MicrophoneInterface.tsx`

```typescript
interface MicrophoneInterfaceProps {
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onPauseRecording?: () => void;
}

export const MicrophoneInterface: React.FC<MicrophoneInterfaceProps> = ({
  isRecording = false,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
}) => {
  return (
    <Card className="microphone-interface">
      <div className="mic-container">
        <Button appearance="subtle" icon={<Document24Regular />} />

        <div className="mic-center">
          <div className="mic-controls">
            <Button appearance="subtle" icon={<Settings20Regular />} />
            <Button appearance="subtle" icon={<ChevronDown12Regular />} />
          </div>

          <div className="mic-button-container">
            <div className={`mic-waves ${isRecording ? "active" : ""}`} />
            <Button
              appearance="primary"
              size="large"
              icon={<Mic32Regular />}
              className="mic-button"
              onClick={isRecording ? onStopRecording : onStartRecording}
            />
          </div>
        </div>

        <Button appearance="subtle" icon={<CopilotIcon />} />
      </div>
    </Card>
  );
};
```

**Styles**: Using `makeStyles` with Fluent UI v2 tokens

```typescript
import { makeStyles, tokens } from "@fluentui/react-components";

const useMicrophoneInterfaceStyles = makeStyles({
  microphoneInterface: {
    margin: tokens.spacingHorizontalM,
    padding: tokens.spacingHorizontalM,
  },

  micContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingHorizontalM,
    maxWidth: "800px",
    margin: "0 auto",
  },

  micCenter: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: tokens.spacingHorizontalL,
  },

  micControls: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
  },

  micButtonContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  micButton: {
    width: "56px",
    height: "56px",
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandForeground2,
    color: tokens.colorNeutralForegroundOnBrand,
    position: "relative",
    zIndex: 2,
  },

  micWaves: {
    position: "absolute",
    width: "74px",
    height: "74px",
    borderRadius: tokens.borderRadiusCircular,
    border: `2px solid ${tokens.colorBrandForeground1}`,
    opacity: 0,
    animationName: "none",
  },

  micWavesActive: {
    opacity: 1,
    animationName: "pulse",
    animationDuration: "2s",
    animationIterationCount: "infinite",
  },

  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(1.2)",
      opacity: 0,
    },
  },

  // Responsive Design
  micContainerMobile: {
    "@media (max-width: 768px)": {
      flexDirection: "column",
      gap: tokens.spacingHorizontalL,
    },
  },

  micCenterMobile: {
    "@media (max-width: 768px)": {
      order: 2,
    },
  },

  microphoneInterfaceSmall: {
    "@media (max-width: 480px)": {
      margin: tokens.spacingHorizontalS,
      padding: tokens.spacingHorizontalS,
    },
  },

  micButtonSmall: {
    "@media (max-width: 480px)": {
      width: "48px",
      height: "48px",
    },
  },
});
```

    width: 48px;
    height: 48px;

}

.mic-waves {
width: 64px;
height: 64px;
}
}

````

**Phase 3 Deliverables:**

- [ ] Patient summary accordion with medical data
- [ ] Expandable sub-accordions
- [ ] Memo creation and editing interface
- [ ] Copilot message bubbles with markdown
- [ ] Reference citation system
- [ ] Microphone interface with recording states
- [ ] Loading states and animations
- [ ] Complete responsive design implementation

---

## Responsive Design Strategy

### Breakpoint System

```css
/* Mobile First Approach */
:root {
  --breakpoint-mobile: 480px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-large: 1200px;
}

/* Responsive Mixins */
@media (max-width: 479px) {
  /* Small - Mobile */
}
@media (min-width: 480px) and (max-width: 767px) {
  /* Medium - Large Mobile */
}
@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet */
}
@media (min-width: 1024px) {
  /* Desktop */
}
````

### Screen Size Adaptations

#### Large Screens (Desktop 1024px+)

- **Layout**: Three-column layout with fixed sidebars
- **Navigation**: Always visible, expanded labels
- **Content**: Maximum width constraints for readability
- **Copilot Panel**: Fixed 320px width, always visible

#### Medium Screens (Tablet 768px-1023px)

- **Layout**: Flexible two-column with collapsible panels
- **Navigation**: Collapsible with icons only
- **Content**: Adaptive width with horizontal scrolling prevention
- **Copilot Panel**: Overlay mode or reduced width (280px)

#### Small Screens (Mobile <768px)

- **Layout**: Single-column stack with navigation drawer
- **Navigation**: Hidden drawer, hamburger menu activation
- **Content**: Full-width stacked components
- **Copilot Panel**: Full-screen overlay
- **Workflow Panel**: Collapsible accordion

### Component Responsive Patterns

#### Flex Layout Pattern

#### Responsive Container Pattern

```typescript
import { makeStyles, tokens } from "@fluentui/react-components";

const useResponsiveStyles = makeStyles({
  responsiveContainer: {
    display: "flex",
    flexDirection: "row",
    gap: tokens.spacingHorizontalM,
  },

  responsiveContainerMobile: {
    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  },
});
```

#### Grid Layout Pattern

```typescript
const useGridStyles = makeStyles({
  responsiveGrid: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: tokens.spacingHorizontalM,
  },

  responsiveGridTablet: {
    "@media (max-width: 1024px)": {
      gridTemplateColumns: "auto 1fr",
    },
  },

  responsiveGridMobile: {
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    },
  },
});
```

---

## Component Architecture

### Folder Structure

```
src/
├── components/
│   ├── foundation/          # Phase 1 - Basic layout components
│   │   ├── TitleBar.tsx
│   │   ├── LeftNavigation.tsx
│   │   ├── PatientSummaryHeader.tsx
│   │   └── ResponsiveLayout.tsx
│   ├── core/               # Phase 2 - Main functionality
│   │   ├── ActionBar.tsx
│   │   ├── WorkflowPanel.tsx
│   │   ├── MainContent.tsx
│   │   └── CopilotPanel.tsx
│   ├── content/            # Phase 3 - Content components
│   │   ├── PatientSummaryAccordion.tsx
│   │   ├── MemoComponent.tsx
│   │   ├── MessageBubble.tsx
│   │   └── MicrophoneInterface.tsx
│   └── shared/             # Reusable utilities
│       ├── Icons/
│       ├── LoadingStates/
│       └── References/
├── hooks/                  # Custom React hooks
├── context/               # React Context providers
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── styles/                # Global styles and themes
    ├── globals.css
    ├── tokens.css
    └── responsive.css
```

### Component Props Standards

#### Base Interface Pattern

```typescript
interface BaseComponentProps {
  className?: string;
  "data-testid"?: string;
  children?: React.ReactNode;
}

interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}
```

#### Responsive Props Pattern

```typescript
interface ResponsiveComponentProps extends BaseComponentProps {
  mobileProps?: Partial<ComponentProps>;
  tabletProps?: Partial<ComponentProps>;
  desktopProps?: Partial<ComponentProps>;
}
```

---

## Implementation Guidelines

### Development Workflow

1. **Component Development Order**:

   - Foundation components (layout structure)
   - Core components (main functionality)
   - Content components (detailed features)

2. **Testing Strategy**:

   - Unit tests for each component
   - Integration tests for user workflows
   - Visual regression tests for responsive design
   - Accessibility compliance testing

3. **Code Quality Standards**:
   - TypeScript strict mode enabled
   - ESLint + Prettier configuration
   - Semantic HTML structure
   - ARIA labels and roles
   - Keyboard navigation support

### Performance Considerations

#### Code Splitting

```typescript
// Lazy load heavy components
const CopilotPanel = lazy(() => import("./components/core/CopilotPanel"));
const MemoComponent = lazy(() => import("./components/content/MemoComponent"));
```

#### Image Optimization

```typescript
// Use responsive image loading
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  loading?: "lazy" | "eager";
}
```

#### State Management

```typescript
// Use React Context for global state
interface AppContextType {
  user: UserProfile;
  patient: PatientData;
  ui: {
    isMobileMenuOpen: boolean;
    isCopilotPanelOpen: boolean;
    activeWorkflow: string;
  };
}
```

### Accessibility Requirements

1. **Keyboard Navigation**: All interactive elements accessible via keyboard
2. **Screen Reader Support**: Proper ARIA labels and descriptions
3. **Color Contrast**: WCAG AA compliance (4.5:1 contrast ratio)
4. **Focus Management**: Visible focus indicators and logical tab order
5. **Responsive Text**: Support for 200% zoom without horizontal scrolling

---

## Testing & Validation

### Phase Validation Criteria

#### Phase 1 Success Criteria

- [ ] Application loads without errors on all device sizes
- [ ] Navigation is accessible via keyboard and screen readers
- [ ] Title bar controls function correctly
- [ ] Patient header displays accurately
- [ ] CSS custom properties are applied consistently

#### Phase 2 Success Criteria

- [ ] Workflow panel interactions work across all devices
- [ ] Action bar adapts to different screen sizes
- [ ] Copilot panel opens/closes smoothly
- [ ] Message input accepts and displays text correctly
- [ ] Component state management functions properly

#### Phase 3 Success Criteria

- [ ] Patient summary accordion expands/collapses correctly
- [ ] Memo editing interface works on touch devices
- [ ] Message bubbles render markdown properly
- [ ] Microphone interface animates recording states
- [ ] All components maintain functionality at 200% zoom
- [ ] Application works offline (cached components)

### Cross-Browser Testing

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

### Device Testing Matrix

- **Desktop**: 1920x1080, 1366x768, 1440x900
- **Tablet**: iPad (1024x768), iPad Pro (1366x1024), Android tablets
- **Mobile**: iPhone 12/13/14, Samsung Galaxy S21/S22, Pixel 6/7

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

## Plan Status & Updates

**Current Version**: 1.0  
**Last Updated**: June 30, 2025  
**Status**: Implementation Ready

### Document Evolution Notes

This plan will be updated as development progresses. Key areas that may evolve include:

- **Component Specifications**: Detailed props interfaces and API contracts
- **Technical Decisions**: Framework patterns and architectural choices
- **Responsive Breakpoints**: Fine-tuning based on user testing feedback
- **Performance Optimizations**: Specific strategies based on initial implementation results
- **Accessibility Enhancements**: WCAG compliance refinements and screen reader optimizations

### Implementation Readiness Checklist

- [x] **Design Analysis**: Figma components and variables extracted
- [x] **Responsive Strategy**: Mobile-first approach with three breakpoints defined
- [x] **Technology Stack**: Vite + React 19 + TypeScript + Fluent UI v2 confirmed
- [x] **Component Architecture**: Phase-based development plan established
- [x] **Fluent UI v2 Integration**: Token usage strategy documented
- [x] **Accessibility Guidelines**: WCAG compliance requirements specified
- [ ] **Development Environment**: Setup and tooling configuration
- [ ] **Phase 1 Implementation**: Application shell development
- [ ] **Phase 2 Implementation**: Main/core components development
- [ ] **Phase 3 Implementation**: Body/content components development

---

## Conclusion

This implementation plan provides a comprehensive roadmap for building a responsive, accessible, and performant Dragon Copilot Patient Dashboard prototype. The phased approach ensures steady progress while maintaining code quality and user experience standards across all device sizes.

**Key Success Factors:**

1. Adherence to the three-phase development schedule
2. Consistent application of responsive design principles
3. Regular testing and validation at each phase
4. Component reusability and maintainability
5. Accessibility compliance throughout development

**Next Steps:**

1. Review and approve implementation plan
2. Set up development environment and tooling
3. Begin Phase 1 development with foundation components
4. Establish code review and testing processes
5. Plan user testing sessions for each phase completion
