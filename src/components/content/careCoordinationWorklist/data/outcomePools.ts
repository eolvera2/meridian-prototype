import type { CallRecordStatus } from "../CareCoordinationWorklistContext";
import type { ContactHistoryEntry, CallType } from "../CareCoordinationWorklist.types";

/* ────────────────────────────────────────────────────────────────
 * Outcome pool types
 * ──────────────────────────────────────────────────────────────── */

export interface MaOutcome {
  pickedUpMeds: string;
  takingAsRx: { value: string; warning: boolean };
  sideEffects: { value: string; warning: boolean };
  painLevel: number;
  followUp: { value: string; warning: boolean };
  status: CallRecordStatus;
}

export interface PiOutcome {
  intakeCompleted: { value: string; warning: boolean };
  allergiesConfirmed: string;
  redFlag: { value: string; warning: boolean };
  symptomsReported: string;
  followUp: { value: string; warning: boolean };
  status: CallRecordStatus;
}

export interface HtOutcome {
  bpReading: { systolic: number; diastolic: number };
  bpAtGoal: { value: string; warning: boolean };
  medAdherence: { value: string; warning: boolean };
  symptomsPresent: { value: string; warning: boolean };
  escalated: { value: string; warning: boolean };
  followUp: { value: string; warning: boolean };
  status: CallRecordStatus;
}

/* ────────────────────────────────────────────────────────────────
 * Outcome pools
 * ──────────────────────────────────────────────────────────────── */

export const MA_OUTCOME_POOLS: MaOutcome[] = [
  { pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 0, followUp: { value: "Not needed", warning: false }, status: "needs-review" },
  { pickedUpMeds: "Yes", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "Reported", warning: true }, painLevel: 8, followUp: { value: "Yes", warning: true }, status: "needs-review" },
  { pickedUpMeds: "No", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "None", warning: false }, painLevel: 10, followUp: { value: "Yes", warning: true }, status: "needs-review" },
  { pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "Reported", warning: true }, painLevel: 3, followUp: { value: "Yes", warning: true }, status: "needs-review" },
  { pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 5, followUp: { value: "Not needed", warning: false }, status: "needs-review" },
];

export const PI_OUTCOME_POOLS: PiOutcome[] = [
  { intakeCompleted: { value: "Yes", warning: false }, allergiesConfirmed: "Confirmed", redFlag: { value: "None", warning: false }, symptomsReported: "None", followUp: { value: "Not needed", warning: false }, status: "needs-review" },
  { intakeCompleted: { value: "Partial", warning: true }, allergiesConfirmed: "Pending verification", redFlag: { value: "None", warning: false }, symptomsReported: "Headache, fatigue", followUp: { value: "Yes", warning: true }, status: "needs-review" },
  { intakeCompleted: { value: "Yes", warning: false }, allergiesConfirmed: "Penicillin", redFlag: { value: "Chest pain reported", warning: true }, symptomsReported: "Chest tightness", followUp: { value: "Urgent", warning: true }, status: "needs-review" },
];

export const HT_OUTCOME_POOLS: HtOutcome[] = [
  { bpReading: { systolic: 128, diastolic: 80 }, bpAtGoal: { value: "Yes", warning: false }, medAdherence: { value: "Yes", warning: false }, symptomsPresent: { value: "None", warning: false }, escalated: { value: "No", warning: false }, followUp: { value: "Not needed", warning: false }, status: "needs-review" },
  { bpReading: { systolic: 152, diastolic: 94 }, bpAtGoal: { value: "No", warning: true }, medAdherence: { value: "Partial", warning: true }, symptomsPresent: { value: "Headache", warning: true }, escalated: { value: "No", warning: false }, followUp: { value: "Yes", warning: true }, status: "needs-review" },
  { bpReading: { systolic: 198, diastolic: 105 }, bpAtGoal: { value: "No — Critical", warning: true }, medAdherence: { value: "Stopped", warning: true }, symptomsPresent: { value: "None", warning: false }, escalated: { value: "Yes — Urgent", warning: true }, followUp: { value: "Urgent", warning: true }, status: "needs-review" },
];

/* ────────────────────────────────────────────────────────────────
 * Round-robin counters (module-level singletons)
 * ──────────────────────────────────────────────────────────────── */

let maIndex = 0;
let piIndex = 0;
let htIndex = 0;

/* ────────────────────────────────────────────────────────────────
 * Resolved outcome type used by the context
 * ──────────────────────────────────────────────────────────────── */

export interface ResolvedOutcome {
  status: CallRecordStatus;
  pickedUpMeds?: string;
  takingAsRx?: { value: string; warning: boolean };
  sideEffects?: { value: string; warning: boolean };
  painLevel?: number;
  followUp: { value: string; warning: boolean };
  intakeCompleted?: { value: string; warning: boolean };
  allergiesConfirmed?: string;
  redFlag?: { value: string; warning: boolean };
  symptomsReported?: string;
  bpReading?: { systolic: number; diastolic: number };
  bpAtGoal?: { value: string; warning: boolean };
  medAdherence?: { value: string; warning: boolean };
  symptomsPresent?: { value: string; warning: boolean };
  escalated?: { value: string; warning: boolean };
}

/**
 * Pick a resolved outcome from the pool for the given call type,
 * cycling round-robin through each pool.
 */
export function pickOutcome(callType: CallType): ResolvedOutcome {
  if (callType === "patient-intake") {
    const pool = PI_OUTCOME_POOLS[piIndex++ % PI_OUTCOME_POOLS.length];
    return { ...pool, pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0 };
  }
  if (callType === "hypertension-management") {
    const pool = HT_OUTCOME_POOLS[htIndex++ % HT_OUTCOME_POOLS.length];
    return { ...pool, pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0 };
  }
  const pool = MA_OUTCOME_POOLS[maIndex++ % MA_OUTCOME_POOLS.length];
  return { ...pool };
}

/* ────────────────────────────────────────────────────────────────
 * Transcript summary generation
 * ──────────────────────────────────────────────────────────────── */

/**
 * Build a ContactHistoryEntry (with transcript summary) from a resolved
 * outcome. Returns the entry ready to be prepended to contactHistory.
 */
export function buildContactEntry(
  callType: CallType,
  outcome: ResolvedOutcome,
  contactDate: string,
  contactTime: string,
): ContactHistoryEntry {
  const newEntry: ContactHistoryEntry = {
    date: contactDate,
    method: "phone",
    callType,
    transcriptLink: true,
    transcriptSummary: "",
    followUpNeeded: { value: outcome.followUp.value, positive: !outcome.followUp.warning },
    notes: `Automated call at ${contactTime}. Outcomes recorded and pending review.`,
  };

  let transcriptSummary: string;

  if (callType === "patient-intake") {
    transcriptSummary = `AI-assisted pre-visit intake call completed successfully. Patient confirmed intake status as ${outcome.intakeCompleted?.value}. Known allergies were reviewed and ${outcome.allergiesConfirmed === "Confirmed" ? "confirmed by the patient with no new allergies reported" : "could not be fully confirmed and require follow-up verification at the visit"}. Red flag screening result: ${outcome.redFlag?.value}. Patient-reported symptoms: ${outcome.symptomsReported}. Medical history was collected and documented for provider review prior to the scheduled appointment. The patient was reminded of pre-visit preparation instructions and encouraged to bring a current medication list to the appointment.`;
    newEntry.intakeCompleted = outcome.intakeCompleted ? { value: outcome.intakeCompleted.value, positive: !outcome.intakeCompleted.warning } : undefined;
    newEntry.allergiesConfirmed = outcome.allergiesConfirmed;
    newEntry.redFlagIdentified = outcome.redFlag ? { value: outcome.redFlag.value, positive: !outcome.redFlag.warning } : undefined;
    newEntry.symptomsReported = outcome.symptomsReported;
    newEntry.medicalHistoryCollected = { value: "Yes", positive: true };
  } else if (callType === "hypertension-management") {
    const bp = outcome.bpReading;
    const bpGoalNote = outcome.bpAtGoal?.value === "Yes"
      ? "Blood pressure is within the target range, indicating effective management with current therapy."
      : "Blood pressure is above the target range, suggesting the need for medication adjustment or lifestyle modification counseling.";
    transcriptSummary = `AI-assisted blood pressure management call completed. Patient reported a home BP reading of ${bp?.systolic}/${bp?.diastolic} mmHg. ${bpGoalNote} Medication adherence was assessed as ${outcome.medAdherence?.value}. The patient was counseled on the importance of consistent dosing, dietary sodium reduction, and regular physical activity. Clinical escalation status: ${outcome.escalated?.value}. The patient was advised to continue monitoring blood pressure daily and to report any new symptoms such as headaches, dizziness, or visual changes to the care team immediately.`;
    newEntry.bpReading = outcome.bpReading;
    newEntry.bpAtGoal = outcome.bpAtGoal ? { value: outcome.bpAtGoal.value, positive: !outcome.bpAtGoal.warning } : undefined;
    newEntry.medicationAdherence = outcome.medAdherence ? { value: outcome.medAdherence.value, positive: !outcome.medAdherence.warning } : undefined;
    newEntry.symptomsPresent = outcome.symptomsPresent ? { value: outcome.symptomsPresent.value, positive: !outcome.symptomsPresent.warning } : undefined;
    newEntry.escalated = outcome.escalated ? { value: outcome.escalated.value, positive: !outcome.escalated.warning } : undefined;
    newEntry.sideEffects = "Not reported";
  } else {
    const sideEffectText = outcome.sideEffects?.value === "None" ? "Not reported" : (outcome.sideEffects?.value ?? "Not reported");
    const sideEffectNote = sideEffectText === "Not reported"
      ? "No adverse side effects were reported by the patient during the call."
      : `The patient reported experiencing ${sideEffectText.toLowerCase()} as a side effect. This has been documented for provider review.`;
    transcriptSummary = `AI-assisted medication adherence call completed. Medication pickup status: ${outcome.pickedUpMeds}. The patient ${outcome.takingAsRx?.value === "Yes" ? "confirmed taking medications as prescribed with no missed doses in the current reporting period" : "reported difficulty maintaining the prescribed medication schedule and may benefit from adherence support interventions"}. ${sideEffectNote} Current self-reported pain level: ${outcome.painLevel}/10. ${outcome.followUp.warning ? "A follow-up call has been flagged as needed to reassess the patient's adherence and symptom management." : "No immediate follow-up is required. The patient will continue on the current regimen with routine monitoring."} A medication reminder has been ${outcome.followUp.warning ? "recommended" : "confirmed"} to support ongoing adherence.`;
    newEntry.pickedUpMedication = outcome.pickedUpMeds;
    newEntry.takingAsPrescribed = outcome.takingAsRx ? { value: outcome.takingAsRx.value, positive: !outcome.takingAsRx.warning } : undefined;
    newEntry.sideEffects = sideEffectText;
    newEntry.painLevel = outcome.painLevel;
    newEntry.reminderSet = outcome.followUp.warning ? "No" : "Yes";
  }

  newEntry.transcriptSummary = transcriptSummary;
  return newEntry;
}
