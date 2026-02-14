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
  // Extended patient detail fields
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  dischargeInstructions?: string;
  primaryDiagnosis?: string;
  careTeam?: string;
  contactHistory?: {
    date: string;
    method: "phone" | "chat";
    transcriptLink?: boolean;
    transcriptSummary?: string;
    pickedUpMedication?: string;
    takingAsPrescribed?: { value: string; positive: boolean };
    sideEffects?: string;
    followUpNeeded?: { value: string; positive: boolean };
    notes?: string;
  }[];
  medications?: {
    name: string;
    dose: string;
    frequency: string;
    prescribedDate: string;
  }[];
}

export type MedicationAdherenceSortOrder = "none" | "asc" | "desc";
