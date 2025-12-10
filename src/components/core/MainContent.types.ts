/**
 * MainContent Types
 *
 * Type definitions for the MainContent component.
 */

import type { AutoSelectTextConfig, DocumentItem } from "../content";

/**
 * Props for the MainContent component.
 */
export interface MainContentProps {
  /** Whether the navigation is collapsed */
  navCollapsed?: boolean;
  /** Whether the worklist is collapsed */
  worklistCollapsed?: boolean;
  /** Callback when worklist state changes */
  onWorklistStateChange?: (collapsed: boolean, selected: boolean) => void;
  /** Whether the home toggle is active */
  homeToggleActive?: boolean;
  /** Callback when home is toggled */
  onHomeToggle?: () => void;
  /** Currently active navigation item */
  activeNavItem?: "home" | "avatar" | "settings" | "help" | null;
  /** Callback when navigation item changes */
  onNavItemChange?: (
    item: "home" | "avatar" | "settings" | "help" | null
  ) => void;
  /** Initial patient ID to select */
  initialPatientId?: string;
  /** Auto-select text configuration */
  autoSelectText?: AutoSelectTextConfig;
  /** Whether navigation is disabled */
  disableNavigation?: boolean;
  /** Callback when ambient recording stops (transitions from recording to stop) */
  onAmbientRecordingStop?: () => void;
  /** Callback when dictation mode changes (user switches to/from dictation) */
  onDictationModeChange?: (isDictationActive: boolean) => void;
  /** Initial microphone mode (dictation or ambient) */
  initialMicMode?: "dictation" | "ambient";
  /** Initial dictation state (on or off) when in dictation mode */
  initialDictationState?: "on" | "off";
  /** Callback when a referral letter is added (via Add dialog or Library) */
  onReferralLetterAdd?: () => void;
  /** Callback when an order is deleted from the Orders document */
  onOrderDelete?: () => void;
  /** Initial documents to display */
  initialDocuments?: DocumentItem[];
  /** Initial set of expanded document IDs */
  initialExpandedDocuments?: Set<string>;
  /** Callback when user reaches Settings -> Documents sub-page */
  onSettingsDocumentsReached?: () => void;
  /** Callback when pronoun replacement completes */
  onPronounReplacementComplete?: () => void;
  /** Callback when Copilot panel is opened */
  onCopilotPanelOpen?: () => void;
}

/**
 * Reason for showing the stop recording dialog.
 */
export type DialogReason = "dictation" | "navigation";
