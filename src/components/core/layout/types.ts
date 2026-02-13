import type { DictationState } from "../../shared";
import type { AutoSelectTextConfig, DocumentItem } from "../../content";

export interface WorklistActions {
  onPatientSelect: (patientId: string) => void;
  onAddPatient: () => void;
  onMicButtonClick: (patientId: string) => void;
}

export interface LeftNavigationHandlers {
  onSettingsClick: () => void;
  onMedicationAdherenceClick: () => void;
  onHelpClick: () => void;
  onProfileClick: () => void;
  onHomeToggle: () => void;
}

export interface DocumentHandlers {
  onDocumentClick: (documentId: string) => void;
  onAddDocument: () => void;
  onSectionToggle: (
    documentId: string,
    sectionId: string,
    checked: boolean
  ) => void;
  onSectionContentChange: (
    documentId: string,
    sectionId: string,
    content: string
  ) => void;
  onDocumentCheckToggle: (documentId: string, checked: boolean) => void;
  isRecording?: boolean;
  dictationState?: DictationState;
  onNavigateToDocumentSettings?: () => void;
  triggerPronounReplacement?: boolean;
  triggerDraftReferralLetter?: boolean;
  autoSelectText?: AutoSelectTextConfig;
  onReferralLetterAdd?: () => void;
  onOrderDelete?: () => void;
  documents?: DocumentItem[];
  initialExpandedDocuments?: Set<string>;
  onPronounReplacementComplete?: () => void;
  scrollToTop?: boolean;
}
