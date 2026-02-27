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
    const intakeStatus = outcome.intakeCompleted?.value ?? "Pending";
    const allergies = outcome.allergiesConfirmed === "Confirmed"
      ? "Allergies confirmed by patient"
      : "Allergies need verification at visit";
    const redFlag = outcome.redFlag?.value === "None"
      ? "No red flags identified"
      : `Red flag: ${outcome.redFlag?.value} — needs provider review`;
    const bullets = [
      `Intake ${intakeStatus.toLowerCase()}`,
      allergies,
      redFlag,
    ];
    if (outcome.symptomsReported && outcome.symptomsReported !== "None") {
      bullets.push(`Reports ${outcome.symptomsReported.toLowerCase()}`);
    }
    bullets.push("Medical history collected and documented");
    transcriptSummary = bullets.map(b => `• ${b}`).join("\n");
    newEntry.intakeCompleted = outcome.intakeCompleted ? { value: outcome.intakeCompleted.value, positive: !outcome.intakeCompleted.warning } : undefined;
    newEntry.allergiesConfirmed = outcome.allergiesConfirmed;
    newEntry.redFlagIdentified = outcome.redFlag ? { value: outcome.redFlag.value, positive: !outcome.redFlag.warning } : undefined;
    newEntry.symptomsReported = outcome.symptomsReported;
    newEntry.medicalHistoryCollected = { value: "Yes", positive: true };
  } else if (callType === "hypertension-management") {
    const bp = outcome.bpReading;
    const atGoal = outcome.bpAtGoal?.value === "Yes"
      ? "at goal"
      : "above target";
    const adherence = outcome.medAdherence?.value === "Yes"
      ? "All medications taken as prescribed"
      : "Admitted missing doses";
    const bullets = [
      `BP ${bp?.systolic}/${bp?.diastolic}, ${atGoal}`,
      adherence,
    ];
    if (outcome.symptomsPresent?.value && outcome.symptomsPresent.value !== "None") {
      bullets.push(`Reports ${outcome.symptomsPresent.value.toLowerCase()}`);
    } else {
      bullets.push("No symptoms reported");
    }
    if (outcome.escalated?.value === "Yes") {
      bullets.push("Needs immediate escalation to provider");
    } else {
      bullets.push("Routine follow-up appropriate");
    }
    transcriptSummary = bullets.map(b => `• ${b}`).join("\n");
    newEntry.bpReading = outcome.bpReading;
    newEntry.bpAtGoal = outcome.bpAtGoal ? { value: outcome.bpAtGoal.value, positive: !outcome.bpAtGoal.warning } : undefined;
    newEntry.medicationAdherence = outcome.medAdherence ? { value: outcome.medAdherence.value, positive: !outcome.medAdherence.warning } : undefined;
    newEntry.symptomsPresent = outcome.symptomsPresent ? { value: outcome.symptomsPresent.value, positive: !outcome.symptomsPresent.warning } : undefined;
    newEntry.escalated = outcome.escalated ? { value: outcome.escalated.value, positive: !outcome.escalated.warning } : undefined;
    newEntry.sideEffects = "Not reported";
  } else {
    const sideEffectText = outcome.sideEffects?.value === "None" ? "Not reported" : (outcome.sideEffects?.value ?? "Not reported");
    const pickup = outcome.pickedUpMeds === "Yes" ? "Meds picked up from pharmacy" : "Meds not picked up from pharmacy";
    const adherent = outcome.takingAsRx?.value === "Yes"
      ? "Taking as directed"
      : "Not following prescribed schedule";
    const bullets = [pickup, adherent];
    if (sideEffectText !== "Not reported") {
      bullets.push(`Reports ${sideEffectText.toLowerCase().replace(/ reported$/, "")}`);
    } else {
      bullets.push("No side effects reported");
    }
    if ((outcome.painLevel ?? 0) > 0) {
      bullets.push(`Pain level ${outcome.painLevel}/10`);
    }
    if (outcome.followUp.warning) {
      bullets.push("Needs nurse follow-up");
    } else {
      bullets.push("No immediate concerns");
    }
    transcriptSummary = bullets.map(b => `• ${b}`).join("\n");
    newEntry.pickedUpMedication = outcome.pickedUpMeds;
    newEntry.takingAsPrescribed = outcome.takingAsRx ? { value: outcome.takingAsRx.value, positive: !outcome.takingAsRx.warning } : undefined;
    newEntry.sideEffects = sideEffectText;
    newEntry.painLevel = outcome.painLevel;
    newEntry.reminderSet = outcome.followUp.warning ? "No" : "Yes";
  }

  newEntry.transcriptSummary = transcriptSummary;
  return newEntry;
}
