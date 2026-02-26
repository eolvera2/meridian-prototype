import type { CallType } from "../CareCoordinationWorklist.types";

/** Lightweight medication shape used by the add-patient form (no prescribedDate). */
export interface FormMedicationEntry {
  name: string;
  dose: string;
  frequency: string;
}

// ── Campaign metadata ──────────────────────────────────────────────

export const campaignDescriptions: Record<CallType, string> = {
  "medication-adherence":
    "Post-discharge medication follow-up to ensure patients are taking prescribed medications correctly, identify barriers to adherence, and coordinate refills or care team interventions.",
  "patient-intake":
    "Pre-appointment intake calls to collect patient medical history, current medications, allergies, and reason for visit before their scheduled appointment.",
  "hypertension-management":
    "Ongoing blood pressure management outreach to monitor home readings, assess medication adherence, coach on lifestyle modifications, and escalate uncontrolled hypertension.",
};

export const campaignOutcomes: Record<CallType, string[]> = {
  "medication-adherence": [
    "Confirm Rx pickup",
    "Verify medication adherence",
    "Capture side effects",
    "Assess pain level",
    "Determine follow-up needs",
    "Set medication reminders",
  ],
  "patient-intake": [
    "Confirm intake completion",
    "Verify allergies",
    "Collect medical history",
    "Record current symptoms",
    "Screen for red flags",
  ],
  "hypertension-management": [
    "Record BP reading",
    "Assess BP goal status",
    "Verify medication adherence",
    "Screen for symptoms",
    "Determine escalation needs",
  ],
};

// ── Auto-fill data pools ───────────────────────────────────────────

export const FIRST_NAMES: Record<string, string[]> = {
  Male: ["James","Robert","Michael","William","David","Richard","Thomas","Daniel","Matthew","Andrew"],
  Female: ["Mary","Patricia","Jennifer","Linda","Elizabeth","Barbara","Susan","Jessica","Sarah","Karen"],
  Other: ["Alex","Jordan","Taylor","Morgan","Casey","Riley","Quinn","Avery","Jamie","Dakota"],
};

export const LAST_NAMES = [
  "Johnson","Williams","Brown","Garcia","Martinez","Davis","Rodriguez",
  "Anderson","Wilson","Taylor","Thomas","Moore","Jackson","Martin",
  "Lee","Thompson","White","Harris","Clark","Lewis",
];

export const CITIES = [
  "Seattle","Portland","Austin","Denver","Phoenix",
  "Chicago","Boston","Atlanta","Dallas","Miami",
];

export const STATES = ["WA","OR","TX","CO","AZ","IL","MA","GA","TX","FL"];

export const STREETS = [
  "Oak St","Maple Ave","Pine Dr","Cedar Ln",
  "Elm Blvd","Birch Way","Walnut Ct","Cherry Rd",
];

export const PROVIDERS = [
  "Dr. Sarah Chen","Dr. Michael Patel","Dr. Emily Torres",
  "Dr. James Wilson","Dr. Lisa Nguyen","Dr. Robert Kim",
];

export const NURSES = ["RN Adams","RN Baker","RN Clark","RN Davis"];

export const LOCATIONS = [
  "Main Campus, Bldg A","West Clinic","East Medical Center",
  "Downtown Office","Northside Health Center",
];

// ── Medication-adherence pools ─────────────────────────────────────

export const MED_ADHERENCE_REASONS = [
  "Post-discharge medication reconciliation",
  "14-day follow-up: medication compliance check",
  "New prescription adherence monitoring",
  "Medication side-effect follow-up",
  "Refill coordination and adherence review",
];

export const MED_ADHERENCE_DIAGNOSES = [
  "Atrial Fibrillation","Type 2 Diabetes","Heart Failure",
  "COPD","Hyperlipidemia","Chronic Kidney Disease",
];

export const MED_ADHERENCE_INSTRUCTIONS = [
  "Continue all medications as prescribed. Follow up in 2 weeks.",
  "Avoid NSAIDs. Take blood thinner with food. Monitor for bruising.",
  "Low-sodium diet. Weigh daily. Call if weight gain >3 lbs in a day.",
  "Check blood glucose twice daily. Adjust insulin per sliding scale.",
];

export const MED_ADHERENCE_SETS: FormMedicationEntry[][] = [
  [{ name: "Warfarin", dose: "5 mg", frequency: "Once daily" },{ name: "Metoprolol", dose: "25 mg", frequency: "Twice daily" }],
  [{ name: "Lisinopril", dose: "10 mg", frequency: "Once daily" },{ name: "Atorvastatin", dose: "40 mg", frequency: "Once daily at bedtime" }],
  [{ name: "Metformin", dose: "500 mg", frequency: "Twice daily" },{ name: "Glipizide", dose: "5 mg", frequency: "Once daily before breakfast" }],
  [{ name: "Amlodipine", dose: "5 mg", frequency: "Once daily" },{ name: "Furosemide", dose: "20 mg", frequency: "Once daily" },{ name: "Potassium Chloride", dose: "20 mEq", frequency: "Once daily" }],
];

// ── Patient-intake pools ───────────────────────────────────────────

export const INTAKE_REASONS = [
  "New patient intake and onboarding",
  "Pre-visit registration and history collection",
  "Transfer patient intake assessment",
  "Annual wellness visit intake",
];

export const INTAKE_DIAGNOSES = [
  "General Check-up","Asthma","Migraine",
  "Anxiety Disorder","Low Back Pain","Hypothyroidism",
];

export const INTAKE_ALLERGIES = [
  "Penicillin, Sulfa","None known","Latex, Codeine",
  "Aspirin","Shellfish, Iodine","Amoxicillin",
];

export const INTAKE_MEDICAL_HISTORIES = [
  "Hypertension (5 years), Seasonal allergies",
  "Type 2 Diabetes (3 years), Obesity",
  "Asthma since childhood, GERD",
  "No significant past medical history",
  "Hypothyroidism (10 years), Vitamin D deficiency",
];

export const INTAKE_SURGICAL_HISTORIES = [
  "Appendectomy (2015)","None","Cholecystectomy (2018)",
  "C-section (2020)","Right knee arthroscopy (2017)",
];

export const INTAKE_APPT_TIMES = ["9:00 AM","10:30 AM","1:00 PM","2:30 PM","3:45 PM"];

// ── Hypertension-management pools ──────────────────────────────────

export const HTN_REASONS = [
  "Quarterly BP management follow-up",
  "Uncontrolled hypertension monitoring",
  "New hypertension diagnosis — lifestyle coaching",
  "Post-medication adjustment BP check",
  "Home BP log review and medication titration",
];

export const HTN_DIAGNOSES = [
  "Essential Hypertension","Resistant Hypertension",
  "Hypertension with CKD","Hypertensive Heart Disease",
];

export const HTN_INSTRUCTIONS = [
  "Low-sodium DASH diet. Exercise 30 min/day. Monitor BP daily.",
  "Reduce caffeine. Take medication at same time each day.",
  "Limit alcohol. Record BP readings twice daily in log.",
];

export const HTN_LIFESTYLE_NOTES = [
  "Sedentary lifestyle. High sodium diet. Non-smoker.",
  "Walks 20min daily. Moderate alcohol use. Former smoker.",
  "Active lifestyle. Low-salt diet. No tobacco or alcohol.",
  "Limited exercise due to knee pain. Smokes 1/2 pack/day.",
  "DASH diet adherent. Exercises 4x/week. No substances.",
];

export const HTN_MED_SETS: FormMedicationEntry[][] = [
  [{ name: "Amlodipine", dose: "10 mg", frequency: "Once daily" },{ name: "Lisinopril", dose: "20 mg", frequency: "Once daily" }],
  [{ name: "Losartan", dose: "50 mg", frequency: "Once daily" },{ name: "Hydrochlorothiazide", dose: "25 mg", frequency: "Once daily" }],
  [{ name: "Metoprolol", dose: "50 mg", frequency: "Twice daily" }],
];

// ── Utility helpers ────────────────────────────────────────────────

export const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const randInt = (lo: number, hi: number): number =>
  Math.floor(Math.random() * (hi - lo + 1)) + lo;

export const pad2 = (n: number): string => String(n).padStart(2, "0");
