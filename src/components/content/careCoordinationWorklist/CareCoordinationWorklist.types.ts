/**
 * Care Coordination Worklist Types
 *
 * Type definitions for the Care Coordination worklist supporting
 * Medication Adherence, Patient Intake, and Hypertension Management call types.
 */

export type CallType = "medication-adherence" | "patient-intake" | "hypertension-management";

export const CALL_TYPE_LABELS: Record<CallType, string> = {
  "medication-adherence": "Med Adherence",
  "patient-intake": "Patient Intake",
  "hypertension-management": "Chronic Care",
};

export interface CareCoordinationWorklistProps {
  isCollapsed?: boolean;
  onPatientSelect?: (patientId: string) => void;
  onAddPatient?: () => void;
  onMicButtonClick?: (patientId: string) => void;
}

export interface ContactHistoryEntry {
  date: string;
  method: "phone";
  callType?: CallType;
  transcriptLink?: boolean;
  transcriptSummary?: string;
  // Medication Adherence outcomes
  pickedUpMedication?: string;
  takingAsPrescribed?: { value: string; positive: boolean };
  sideEffects?: string;
  painLevel?: number;
  followUpNeeded?: { value: string; positive: boolean };
  reminderSet?: string;
  // Patient Intake outcomes
  intakeCompleted?: { value: string; positive: boolean };
  allergiesConfirmed?: string;
  medicalHistoryCollected?: { value: string; positive: boolean };
  symptomsReported?: string;
  redFlagIdentified?: { value: string; positive: boolean };
  // Hypertension Management outcomes
  bpReading?: { systolic: number; diastolic: number };
  bpAtGoal?: { value: string; positive: boolean };
  medicationAdherence?: { value: string; positive: boolean };
  symptomsPresent?: { value: string; positive: boolean };
  escalated?: { value: string; positive: boolean };
  notes?: string;
}

export interface MedicationEntry {
  name: string;
  dose: string;
  frequency: string;
  prescribedDate: string;
  refillsAvailable?: number;
}

export interface UpcomingAppointment {
  date: string;
  time: string;
  provider: string;
  type: string;
  location?: string;
}

export interface BpReading {
  date: string;
  systolic: number;
  diastolic: number;
  atGoal: boolean;
}

export interface CareCoordinationWorklistItem {
  id: string;
  name: string;
  mrn?: string;
  reason: string;
  demographics: string;
  dischargeDate: string;
  languagePreference: string;
  lastContactDate: string;
  lastContactSummary: string;
  callType?: CallType;
  status?: string;
  signed?: boolean;
  lastModified?: string;
  group?: string;
  // Shared patient detail fields
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  primaryDiagnosis?: string;
  careTeam?: string;
  // Medication Adherence fields
  dischargeInstructions?: string;
  // Patient Intake fields
  allergies?: string[];
  medicalHistory?: string;
  surgicalHistory?: string;
  upcomingAppointment?: UpcomingAppointment;
  logisticalNeeds?: string;
  // Hypertension Management fields
  bpReadings?: BpReading[];
  homeMonitor?: boolean;
  lifestyleNotes?: string;
  // Shared
  contactHistory?: ContactHistoryEntry[];
  medications?: MedicationEntry[];
  scheduled?: boolean;
}

export type CareCoordinationSortOrder = "none" | "asc" | "desc";

// ── Contact record types (used by Context + table/filter components) ──

export type CallRecordStatus = "in-progress" | "needs-review" | "completed" | "scheduled-for-retry" | "reviewed" | "scheduled";

export interface ContactRecord {
  id: string;
  patientId: string;
  name: string;
  mrn: string;
  callType: CallType;
  contactDate: string;
  contactTime: string;
  daysAgo: number;
  phone: string;
  // Med Adherence outcomes
  pickedUpMeds: string;
  takingAsRx: { value: string; warning: boolean };
  sideEffects: { value: string; warning: boolean };
  painLevel: number;
  followUp: { value: string; warning: boolean };
  // Patient Intake outcomes
  intakeCompleted?: { value: string; warning: boolean };
  allergiesConfirmed?: string;
  redFlag?: { value: string; warning: boolean };
  symptomsReported?: string;
  // Hypertension outcomes
  bpReading?: { systolic: number; diastolic: number };
  bpAtGoal?: { value: string; warning: boolean };
  medAdherence?: { value: string; warning: boolean };
  symptomsPresent?: { value: string; warning: boolean };
  escalated?: { value: string; warning: boolean };
  reviewed: boolean;
  scheduledForRetry?: boolean;
  scheduled?: boolean;
  statusUrgencyNote?: string;
}

export interface ActiveCallRecord {
  id: string;
  patientId: string;
  name: string;
  mrn: string;
  callType: CallType;
  contactDate: string;
  contactTime: string;
  phone: string;
  status: CallRecordStatus;
  // Med Adherence outcomes
  pickedUpMeds: string;
  takingAsRx: { value: string; warning: boolean };
  sideEffects: { value: string; warning: boolean };
  painLevel: number;
  followUp: { value: string; warning: boolean };
  // Patient Intake outcomes
  intakeCompleted?: { value: string; warning: boolean };
  allergiesConfirmed?: string;
  redFlag?: { value: string; warning: boolean };
  symptomsReported?: string;
  // Hypertension outcomes
  bpReading?: { systolic: number; diastolic: number };
  bpAtGoal?: { value: string; warning: boolean };
  medAdherence?: { value: string; warning: boolean };
  symptomsPresent?: { value: string; warning: boolean };
  escalated?: { value: string; warning: boolean };
}
