/**
 * Document Component Module
 *
 * Re-exports all document-related components, types, styles, and hooks.
 */

// Types
export type {
  DocumentData,
  DocumentGridItem,
  DocumentItem,
  DocumentSection,
  ReferenceItem,
  OrderItem,
  AutoSelectTextConfig,
  DocumentComponentProps,
  DocumentCardProps,
  TooltipPosition,
  DocumentToDelete,
} from "./DocumentComponent.types";

// Constants
export {
  DICTATION_CONTENT_MAP,
  PATIENT_DOCUMENT_CONTENT,
  DOCUMENT_TIMING_MS,
  getDictationContentForSection,
  getPatientContentForSection,
  ORDER_DICTATION_ITEMS,
  REFERRAL_LETTER_TEMPLATE,
  createDocumentFromType,
} from "./DocumentComponent.constants";

// Styles
export {
  useStyles,
  useDocumentStyles,
  useHeaderStyles,
  useTableStyles,
  useCardStyles,
  useToolbarStyles,
  useSectionStyles,
  useReferenceStyles,
  useOrderStyles,
  useSkeletonStyles,
} from "./DocumentComponent.styles";

// Hooks
export {
  useTooltipHandlers,
  useDictationSimulation,
  useSectionDictation,
  useTypingReplacement,
  useDocumentHandlers,
  useSkeletonGeneration,
  useAutoSelectText,
  useDocumentEffects,
} from "./hooks";
export type {
  UseTooltipHandlersOptions,
  UseTooltipHandlersReturn,
  UseDictationSimulationOptions,
  UseDictationSimulationReturn,
  UseSectionDictationOptions,
  UseSectionDictationReturn,
  UseTypingReplacementOptions,
  UseTypingReplacementReturn,
  UseDocumentHandlersOptions,
  UseDocumentHandlersReturn,
  UseSkeletonGenerationOptions,
  UseSkeletonGenerationReturn,
  UseAutoSelectTextOptions,
  UseDocumentEffectsOptions,
  UseDocumentEffectsReturn,
  AmbientState,
} from "./hooks";

// Components
export {
  DocumentCard,
  RecentsTable,
  DeleteDocumentDialog,
  DocumentHeader,
} from "./components";
export type {
  CursorTooltipHandlers,
  OrderSimulationState,
  RecentsTableProps,
  DeleteDocumentDialogProps,
  DocumentHeaderProps,
} from "./components";
