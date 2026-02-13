/**
 * MedicationAdherenceWorklist Types
 *
 * Type definitions for the MedicationAdherenceWorklist component.
 */

export interface MedicationAdherenceWorklistProps {
  isCollapsed?: boolean;
  onPatientSelect?: (patientId: string) => void;
  onAddPatient?: () => void;
  onMicButtonClick?: (patientId: string) => void;
}

export interface MedicationAdherenceWorklistItem {
  id: string;
  name: string;
  reason: string;
  demographics: string;
  dischargeDate: string;
  languagePreference: string;
  lastContactDate: string;
  lastContactMethod: "chat" | "phone";
  lastContactSummary: string;
  status?: string;
  signed?: boolean;
  lastModified?: string;
  group?: string;
}

export type MedicationAdherenceSortOrder = "none" | "asc" | "desc";
