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
    method: "phone";
    transcriptLink?: boolean;
    transcriptSummary?: string;
    pickedUpMedication?: string;
    takingAsPrescribed?: { value: string; positive: boolean };
    sideEffects?: string;
    painLevel?: number;
    followUpNeeded?: { value: string; positive: boolean };
    reminderSet?: string;
    notes?: string;
  }[];
  medications?: {
    name: string;
    dose: string;
    frequency: string;
    prescribedDate: string;
    refillsAvailable?: number;
  }[];
}

export type MedicationAdherenceSortOrder = "none" | "asc" | "desc";
