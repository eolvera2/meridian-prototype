/**
 * DocumentComponent Type Definitions
 *
 * Contains all interfaces and types used by DocumentComponent and its sub-components.
 */

import type { AmbientState } from "../../shared";

// ============================================================================
// Core Data Types
// ============================================================================

/**
 * Document data structure from the DataGrid
 */
export type DocumentData = {
  id: string;
  name: string;
  created: string;
  type: string;
  sections?: DocumentSection[];
  orders?: number;
  references?: ReferenceItem[];
  isExpanded?: boolean;
};

/**
 * Document grid item for DataGrid display
 */
export type DocumentGridItem = {
  id: string;
  name: string;
  created: string;
  document: DocumentData;
  isExpanded: boolean;
};

/**
 * Document item structure
 */
export interface DocumentItem {
  id: string;
  name: string;
  created: string;
  type: string;
  sections?: DocumentSection[];
  orders?: number;
  references?: ReferenceItem[];
  isExpanded: boolean;
}

/**
 * Document section with content and state
 */
export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  checked: boolean;
  orderItems?: OrderItem[];
}

/**
 * Reference item in a document
 */
export interface ReferenceItem {
  id: string;
  title: string;
  type: string;
}

/**
 * Order item in a document section
 */
export interface OrderItem {
  id: string;
  text: string;
  code?: string;
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Configuration for auto-selecting text in a document
 */
export interface AutoSelectTextConfig {
  documentId: string;
  sectionId: string;
  textToSelect: string;
}

/**
 * Main DocumentComponent props
 */
export interface DocumentComponentProps {
  documents?: DocumentItem[];
  onDocumentClick?: (documentId: string) => void;
  onAddDocument?: () => void;
  onSectionToggle?: (
    documentId: string,
    sectionId: string,
    checked: boolean
  ) => void;
  onSectionContentChange?: (
    documentId: string,
    sectionId: string,
    content: string
  ) => void;
  onDocumentCheckToggle?: (documentId: string, checked: boolean) => void;
  isRecording?: boolean;
  ambientState?: AmbientState;
  micMode?: "dictation" | "ambient";
  onMicModeToggle?: () => void;
  dictationState?: "on" | "off";
  onNavigateToDocumentSettings?: () => void;
  triggerPronounReplacement?: boolean;
  triggerDraftReferralLetter?: boolean;
  autoSelectText?: AutoSelectTextConfig;
  /** Callback when a referral letter is added (via Add dialog or Library) */
  onReferralLetterAdd?: () => void;
  /** Callback when an order is deleted from Orders document */
  onOrderDelete?: () => void;
  /** Initial set of expanded document IDs */
  initialExpandedDocuments?: Set<string>;
  /** Callback when pronoun replacement completes */
  onPronounReplacementComplete?: () => void;
}

/**
 * DocumentCard component props
 */
export interface DocumentCardProps {
  document: DocumentItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSectionToggle?: (
    documentId: string,
    sectionId: string,
    checked: boolean
  ) => void;
  onSectionContentChange?: (
    documentId: string,
    sectionId: string,
    content: string
  ) => void;
  onDelete?: (documentId: string) => void;
  onOrderCountChange?: (documentId: string, count: number) => void;
  orderCount?: number;
  isRecording?: boolean;
  micMode?: "dictation" | "ambient";
  dictationState?: "on" | "off";
  onMicModeToggle?: () => void;
  showSkeletonFor?: string[];
  onDictationComplete?: (sectionId: string) => void;
  onFieldFocus?: (
    event: React.FocusEvent<HTMLTextAreaElement>,
    sectionId: string
  ) => void;
  onFieldBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFieldMouseEnter?: (event: React.MouseEvent<HTMLTextAreaElement>) => void;
  onFieldMouseLeave?: (event: React.MouseEvent<HTMLTextAreaElement>) => void;
  onFieldClick?: (event: React.MouseEvent<HTMLTextAreaElement>) => void;
  onTextChange?: (sectionId: string) => void;
  activeFieldRef?: React.RefObject<HTMLTextAreaElement | null>;
  focusedFieldRef?: React.RefObject<HTMLTextAreaElement | null>;
  simulatingFieldRef?: React.RefObject<HTMLTextAreaElement | null>;
  isSimulating?: boolean;
  isPronounReplacement?: boolean;
  isDraftingReferralLetter?: boolean;
}

// ============================================================================
// Tooltip Types
// ============================================================================

/**
 * Tooltip position state
 */
export interface TooltipPosition {
  x: number;
  y: number;
  fieldRect: DOMRect | null;
}

// ============================================================================
// State Types
// ============================================================================

/**
 * Document delete confirmation state
 */
export interface DocumentToDelete {
  id: string;
  name: string;
}
