export { MicrophoneInterface } from "./microphone";
export type {
  MicrophoneInterfaceProps,
  DictationState,
  AmbientState,
} from "./microphone";
export { Worklist } from "./worklist";
export type { WorklistProps, WorklistItem } from "./worklist";
export { DocumentComponent } from "./DocumentComponent";
export { Settings } from "./settings";
export type { SettingsProps } from "./settings";
export { SettingsPanel } from "./SettingsPanel";
export { CopilotThread } from "./CopilotThread";
export { MemosPanel } from "./MemosPanel";
export { NotificationsPanel } from "./notifications";
export { TranscriptPanel } from "./transcript";
export { LibraryPanel } from "./LibraryPanel";
export { AddNoteDialog } from "./AddNoteDialog";
export { OrdersComponent } from "./orders";
export type { OrdersComponentProps, OrderItem } from "./orders";
export { DictationModeToast } from "./DictationModeToast";
export { GeneratingToast } from "./GeneratingToast";
export { AIRequestToast } from "./AIRequestToast";
export { FAB } from "./FAB";
export type { FABProps, ScrollDirection } from "./FAB";
export {
  TooltipProvider,
  useTooltipContext,
  useOptionalTooltipContext,
} from "./tooltip";
export type {
  TooltipContextValue,
  TooltipHandlers,
  TooltipPosition,
} from "./tooltip";
// Re-export document types from the document module
export type {
  DocumentComponentProps,
  AutoSelectTextConfig,
  DocumentItem,
  DocumentSection,
  ReferenceItem,
} from "./document";
export type { CopilotThreadProps } from "./CopilotThread";
export type { AddNoteDialogProps } from "./AddNoteDialog";
