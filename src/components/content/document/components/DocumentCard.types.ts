/**
 * DocumentCard Component Types
 * Defines interfaces for the DocumentCard internal component
 */

import type { DictationState } from "../../../shared/types";
import type { DocumentItem, OrderItem } from "../DocumentComponent.types";
import type { TextFieldElement } from "../../../../utils/getCaretCoordinates";

/**
 * Handlers for cursor tooltip interactions
 */
export interface CursorTooltipHandlers {
  onFocus: (
    e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onMouseEnter: (
    e: React.MouseEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onMouseMove: (
    e: React.MouseEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onMouseLeave: (
    e: React.MouseEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onClick: (
    e: React.MouseEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onKeyUp: (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

/**
 * Props for the DocumentCard component
 */
export interface DocumentCardProps {
  /** Document data to render */
  document: DocumentItem;
  /** Return type from useStyles hook */
  styles: ReturnType<typeof import("../DocumentComponent.styles").useStyles>;
  /** Whether the document is expanded */
  isExpanded: boolean;
  /** Checkbox state for the document (true, false, or 'mixed') */
  checkboxState: boolean | "mixed";
  /** Callback when document card is clicked */
  onDocumentClick: (documentId: string) => void;
  /** Callback to toggle document checkbox */
  onDocumentCheckToggle: (documentId: string, checked: boolean) => void;
  /** Callback to toggle section checkbox */
  onSectionToggle: (
    documentId: string,
    sectionId: string,
    checked: boolean
  ) => void;
  /** Callback when section content changes */
  onSectionContentChange: (
    documentId: string,
    sectionId: string,
    content: string
  ) => void;
  /** Register document ref for scroll behavior */
  registerDocumentRef: (
    documentId: string,
    element: HTMLDivElement | null
  ) => void;
  /** Current mic mode */
  micMode?: "dictation" | "ambient";
  /** Whether recording is active */
  isRecording?: boolean;
  /** Current dictation state */
  dictationState?: DictationState;
  /** Cursor tooltip event handlers */
  cursorTooltipHandlers?: CursorTooltipHandlers;
  /** Function to set tooltip visibility */
  setTooltipVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  /** Function to update tooltip position from caret */
  updateTooltipFromCaret?: (element: TextFieldElement) => void;
  /** Callback to start section dictation */
  onStartSectionDictation?: (
    documentId: string,
    sectionId: string,
    sectionTitle: string
  ) => void;
  /** Callback to stop section dictation */
  onStopSectionDictation?: () => void;
  /** Callback when order count changes */
  onOrderCountChange?: (documentId: string, count: number) => void;
  /** Callback to delete document */
  onDeleteDocument?: (documentId: string, documentName: string) => void;
  /** Whether to show skeleton loading animation */
  showSkeleton?: boolean;
  /** Whether pronoun replacement is in progress */
  isPronounReplacement?: boolean;
  /** Whether drafting referral letter is in progress */
  isDraftingReferralLetter?: boolean;
  /** Whether to auto-focus the first textarea when expanded */
  autoFocus?: boolean;
  /** Callback when auto-focus is consumed */
  onAutoFocusConsumed?: (documentId: string) => void;
  /** Callback when an order is deleted */
  onOrderDelete?: () => void;
}

/**
 * Order simulation tracking state
 */
export interface OrderSimulationState {
  sectionId: string;
  orderId: string;
  charIndex: number;
  fullText: string;
}

export type { OrderItem };
