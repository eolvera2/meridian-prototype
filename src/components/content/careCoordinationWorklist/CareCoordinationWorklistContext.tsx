/* eslint-disable react-refresh/only-export-components */
/**
 * CareCoordinationWorklistContext
 *
 * Provides shared state for medication adherence worklist data.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import careCoordinationWorklistData from "../../../data/careCoordinationWorklistData.json";
import type { CareCoordinationWorklistItem, CallType, ContactHistoryEntry } from "./CareCoordinationWorklist.types";
import { useI18n } from "../../../i18n/I18nContext";
import { TeamsDialerPopup } from "./TeamsDialerPopup";

export type CallRecordStatus = "in-progress" | "needs-review" | "completed" | "scheduled-for-retry" | "reviewed" | "scheduled";

export interface ContactRecord {
  id: string;
  patientId: string;
  name: string;
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
}

const INITIAL_CONTACT_RECORDS: ContactRecord[] = [
  // Medication Adherence
  { id: "cr-1", patientId: "ch-1", name: "Michael Chen", callType: "medication-adherence", contactDate: "Feb 5, 2026", contactTime: "6:09 AM", daysAgo: 8, phone: "(555) 234-5678", pickedUpMeds: "Yes", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "Reported", warning: true }, painLevel: 6, followUp: { value: "Yes", warning: true }, reviewed: false },
  { id: "cr-2", patientId: "ch-2", name: "Patricia Martinez", callType: "medication-adherence", contactDate: "Feb 6, 2026", contactTime: "7:30 PM", daysAgo: 7, phone: "(256) 431-7337", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 2, followUp: { value: "Not needed", warning: false }, reviewed: false },
  { id: "cr-3", patientId: "ch-3", name: "Sarah Johnson", callType: "medication-adherence", contactDate: "Jan 28, 2026", contactTime: "10:15 AM", daysAgo: 16, phone: "(312) 555-0198", pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0, followUp: { value: "--", warning: false }, reviewed: false, scheduledForRetry: true },
  { id: "cr-4", patientId: "ch-4", name: "Robert Kim", callType: "medication-adherence", contactDate: "Jan 20, 2026", contactTime: "2:45 PM", daysAgo: 24, phone: "(415) 555-0342", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "Reported", warning: true }, painLevel: 4, followUp: { value: "Yes", warning: true }, reviewed: false },
  { id: "cr-5", patientId: "ch-5", name: "Linda Nguyen", callType: "medication-adherence", contactDate: "Jan 15, 2026", contactTime: "9:00 AM", daysAgo: 29, phone: "(650) 555-0477", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 1, followUp: { value: "Not needed", warning: false }, reviewed: false },
  { id: "cr-6", patientId: "ch-6", name: "James Wilson", callType: "medication-adherence", contactDate: "Dec 20, 2025", contactTime: "11:30 AM", daysAgo: 55, phone: "(206) 555-0613", pickedUpMeds: "Yes", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "Reported", warning: true }, painLevel: 8, followUp: { value: "Yes", warning: true }, reviewed: false, scheduledForRetry: true },
  { id: "cr-7", patientId: "ch-7", name: "Maria Garcia", callType: "medication-adherence", contactDate: "Dec 10, 2025", contactTime: "4:20 PM", daysAgo: 65, phone: "(713) 555-0829", pickedUpMeds: "No", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "None", warning: false }, painLevel: 5, followUp: { value: "Yes", warning: true }, reviewed: false },
  { id: "cr-8", patientId: "ch-8", name: "David Thompson", callType: "medication-adherence", contactDate: "Nov 25, 2025", contactTime: "8:00 AM", daysAgo: 80, phone: "(503) 555-0156", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 3, followUp: { value: "Not needed", warning: false }, reviewed: false },
  // Patient Intake
  { id: "cr-9", patientId: "pi-5", name: "George Martinez", callType: "patient-intake", contactDate: "Feb 8, 2026", contactTime: "4:00 PM", daysAgo: 5, phone: "(713) 555-0934", pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0, followUp: { value: "Not needed", warning: false }, intakeCompleted: { value: "Yes", warning: false }, allergiesConfirmed: "Metformin, Latex", redFlag: { value: "None", warning: false }, symptomsReported: "None acute", reviewed: false },
  // Hypertension Management
  { id: "cr-10", patientId: "ht-5", name: "Donna Fischer", callType: "hypertension-management", contactDate: "Feb 1, 2026", contactTime: "2:15 PM", daysAgo: 12, phone: "(206) 555-0789", pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0, followUp: { value: "Yes", warning: true }, bpReading: { systolic: 142, diastolic: 90 }, bpAtGoal: { value: "No", warning: true }, medAdherence: { value: "Yes", warning: false }, symptomsPresent: { value: "None", warning: false }, escalated: { value: "No", warning: false }, reviewed: false },
  // Reviewed — Medication Adherence
  { id: "cr-11", patientId: "ma-11", name: "Camila Rojas", callType: "medication-adherence", contactDate: "Feb 10, 2026", contactTime: "9:15 AM", daysAgo: 3, phone: "(213) 555-6047", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 0, followUp: { value: "Not needed", warning: false }, reviewed: true },
  { id: "cr-12", patientId: "ma-12", name: "Noah Watanabe", callType: "medication-adherence", contactDate: "Feb 9, 2026", contactTime: "11:00 AM", daysAgo: 4, phone: "(503) 555-8291", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 1, followUp: { value: "Not needed", warning: false }, reviewed: true },
  { id: "cr-13", patientId: "ma-13", name: "Aisha Banerjee", callType: "medication-adherence", contactDate: "Feb 8, 2026", contactTime: "2:30 PM", daysAgo: 5, phone: "(646) 555-3814", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 0, followUp: { value: "Not needed", warning: false }, reviewed: true },
  { id: "cr-14", patientId: "ma-14", name: "Gareth O'Neill", callType: "medication-adherence", contactDate: "Feb 7, 2026", contactTime: "10:45 AM", daysAgo: 6, phone: "(415) 555-9267", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 2, followUp: { value: "Not needed", warning: false }, reviewed: true },
  // Reviewed — Patient Intake
  { id: "cr-15", patientId: "pi-4", name: "Sandra Kowalski", callType: "patient-intake", contactDate: "Feb 10, 2026", contactTime: "3:00 PM", daysAgo: 3, phone: "(617) 555-2345", pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0, followUp: { value: "Not needed", warning: false }, intakeCompleted: { value: "Yes", warning: false }, allergiesConfirmed: "Aspirin (GI upset)", redFlag: { value: "None", warning: false }, symptomsReported: "None", reviewed: true },
  // Reviewed — Hypertension Management
  { id: "cr-16", patientId: "ht-1", name: "Laura Bennett", callType: "hypertension-management", contactDate: "Feb 15, 2026", contactTime: "1:30 PM", daysAgo: 0, phone: "(404) 555-1122", pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0, followUp: { value: "Not needed", warning: false }, bpReading: { systolic: 122, diastolic: 78 }, bpAtGoal: { value: "Yes", warning: false }, medAdherence: { value: "Yes", warning: false }, symptomsPresent: { value: "None", warning: false }, escalated: { value: "No", warning: false }, reviewed: true },
  { id: "cr-17", patientId: "ht-4", name: "William Chang", callType: "hypertension-management", contactDate: "Feb 12, 2026", contactTime: "4:15 PM", daysAgo: 1, phone: "(503) 555-6789", pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0, followUp: { value: "Not needed", warning: false }, bpReading: { systolic: 132, diastolic: 84 }, bpAtGoal: { value: "Yes", warning: false }, medAdherence: { value: "Yes", warning: false }, symptomsPresent: { value: "None", warning: false }, escalated: { value: "No", warning: false }, reviewed: true },
  // Scheduled
  { id: "cr-18", patientId: "ma-6", name: "Rafael Montes", callType: "medication-adherence", contactDate: "Feb 17, 2026", contactTime: "9:00 AM", daysAgo: 0, phone: "(305) 555-4891", pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0, followUp: { value: "--", warning: false }, reviewed: false, scheduled: true },
  { id: "cr-19", patientId: "pi-2", name: "Jamie Patel", callType: "patient-intake", contactDate: "Feb 18, 2026", contactTime: "10:30 AM", daysAgo: 0, phone: "(312) 555-9876", pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0, followUp: { value: "--", warning: false }, intakeCompleted: { value: "--", warning: false }, allergiesConfirmed: "--", redFlag: { value: "--", warning: false }, symptomsReported: "--", reviewed: false, scheduled: true },
  { id: "cr-20", patientId: "ht-3", name: "Priya Sharma", callType: "hypertension-management", contactDate: "Feb 18, 2026", contactTime: "2:00 PM", daysAgo: 0, phone: "(408) 555-8901", pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0, followUp: { value: "--", warning: false }, bpReading: undefined, bpAtGoal: { value: "--", warning: false }, medAdherence: { value: "--", warning: false }, symptomsPresent: { value: "--", warning: false }, escalated: { value: "--", warning: false }, reviewed: false, scheduled: true },
  { id: "cr-21", patientId: "ma-9", name: "Priyanka Menon", callType: "medication-adherence", contactDate: "Feb 19, 2026", contactTime: "8:30 AM", daysAgo: 0, phone: "(408) 555-1726", pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0, followUp: { value: "--", warning: false }, reviewed: false, scheduled: true },
  { id: "cr-22", patientId: "ma-10", name: "Howard Kimani", callType: "medication-adherence", contactDate: "Feb 20, 2026", contactTime: "11:00 AM", daysAgo: 0, phone: "(206) 555-7483", pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0, followUp: { value: "--", warning: false }, reviewed: false, scheduled: true },
];

export interface ActiveCallRecord {
  id: string;
  patientId: string;
  name: string;
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

interface CareCoordinationWorklistContextValue {
  /** Current worklist data */
  patients: CareCoordinationWorklistItem[];
  /** Currently selected patient ID */
  selectedPatientId: string | null;
  /** Set the selected patient ID */
  setSelectedPatientId: (patientId: string | null) => void;
  /** Update a patient's lastModified timestamp to current time */
  updatePatientLastModified: (patientId: string) => void;
  /** Update the currently selected patient's lastModified timestamp */
  updateSelectedPatientLastModified: () => void;
  /** Get a patient by ID */
  getPatient: (patientId: string) => CareCoordinationWorklistItem | undefined;
  /** Active call records from patient calls */
  activeCallRecords: ActiveCallRecord[];
  /** Call patients: remove from worklist and add to contact history */
  callPatients: (patientIds: string[]) => void;
  /** Resolve a call record after the 10s timer */
  resolveCallRecord: (recordId: string) => void;
  /** Contact records for the Dashboard's Patient Contact List table */
  contactRecords: ContactRecord[];
  /** Mark a patient as reviewed: remove from contact history, add to reviewed tab */
  markPatientAsReviewed: (patientId: string) => void;
  /** Check if a patient currently has "needs-review" status */
  isPatientNeedsReview: (patientId: string) => boolean;
  /** Active dialer call info for popup */
  activeDialerCall: { name: string; phone: string; recordId: string } | null;
  /** Dismiss the dialer popup */
  dismissDialer: () => void;
  /** Add a new patient to the worklist */
  addPatient: (patient: CareCoordinationWorklistItem) => void;
  /** Remove patients from the queue (status: removed-from-queue) */
  removeFromQueue: (patientIds: string[]) => void;
  /** Shared call type filter across all panels */
  callTypeFilter: "all" | CallType;
  /** Set the shared call type filter */
  setCallTypeFilter: (filter: "all" | CallType) => void;
}

const CareCoordinationWorklistContext =
  createContext<CareCoordinationWorklistContextValue | null>(null);

// Realistic outcome data pools for resolved calls — Medication Adherence
const MA_OUTCOME_POOLS = [
  { pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 0, followUp: { value: "Not needed", warning: false }, status: "needs-review" as CallRecordStatus },
  { pickedUpMeds: "Yes", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "Reported", warning: true }, painLevel: 8, followUp: { value: "Yes", warning: true }, status: "needs-review" as CallRecordStatus },
  { pickedUpMeds: "No", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "None", warning: false }, painLevel: 10, followUp: { value: "Yes", warning: true }, status: "needs-review" as CallRecordStatus },
  { pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "Reported", warning: true }, painLevel: 3, followUp: { value: "Yes", warning: true }, status: "needs-review" as CallRecordStatus },
  { pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 5, followUp: { value: "Not needed", warning: false }, status: "needs-review" as CallRecordStatus },
];

// Patient Intake outcome pools
const PI_OUTCOME_POOLS = [
  { intakeCompleted: { value: "Yes", warning: false }, allergiesConfirmed: "Confirmed", redFlag: { value: "None", warning: false }, symptomsReported: "None", followUp: { value: "Not needed", warning: false }, status: "needs-review" as CallRecordStatus },
  { intakeCompleted: { value: "Partial", warning: true }, allergiesConfirmed: "Pending verification", redFlag: { value: "None", warning: false }, symptomsReported: "Headache, fatigue", followUp: { value: "Yes", warning: true }, status: "needs-review" as CallRecordStatus },
  { intakeCompleted: { value: "Yes", warning: false }, allergiesConfirmed: "Penicillin", redFlag: { value: "Chest pain reported", warning: true }, symptomsReported: "Chest tightness", followUp: { value: "Urgent", warning: true }, status: "needs-review" as CallRecordStatus },
];

// Hypertension outcome pools
const HT_OUTCOME_POOLS = [
  { bpReading: { systolic: 128, diastolic: 80 }, bpAtGoal: { value: "Yes", warning: false }, medAdherence: { value: "Yes", warning: false }, symptomsPresent: { value: "None", warning: false }, escalated: { value: "No", warning: false }, followUp: { value: "Not needed", warning: false }, status: "needs-review" as CallRecordStatus },
  { bpReading: { systolic: 152, diastolic: 94 }, bpAtGoal: { value: "No", warning: true }, medAdherence: { value: "Partial", warning: true }, symptomsPresent: { value: "Headache", warning: true }, escalated: { value: "No", warning: false }, followUp: { value: "Yes", warning: true }, status: "needs-review" as CallRecordStatus },
  { bpReading: { systolic: 198, diastolic: 105 }, bpAtGoal: { value: "No — Critical", warning: true }, medAdherence: { value: "Stopped", warning: true }, symptomsPresent: { value: "None", warning: false }, escalated: { value: "Yes — Urgent", warning: true }, followUp: { value: "Urgent", warning: true }, status: "needs-review" as CallRecordStatus },
];

let outcomeIndex = 0;
let piOutcomeIndex = 0;
let htOutcomeIndex = 0;

export const CareCoordinationWorklistProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children,
}) => {
  const { formatTime } = useI18n();
  const [patients, setPatients] = useState<CareCoordinationWorklistItem[]>(
    careCoordinationWorklistData as CareCoordinationWorklistItem[]
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [activeCallRecords, setActiveCallRecords] = useState<ActiveCallRecord[]>([]);
  // Ref mirror of activeCallRecords so resolveCallRecord can read without closing over state
  const activeCallRecordsRef = useRef<ActiveCallRecord[]>([]);
  const [contactRecords, setContactRecords] = useState<ContactRecord[]>(INITIAL_CONTACT_RECORDS);
  const [activeDialerCall, setActiveDialerCall] = useState<{ name: string; phone: string; recordId: string } | null>(null);
  const [callTypeFilter, setCallTypeFilter] = useState<"all" | CallType>("all");

  // Registry preserves full patient data even after patients are removed from the worklist via callPatients
  const patientRegistryRef = useRef<Map<string, CareCoordinationWorklistItem>>(
    new Map(
      (careCoordinationWorklistData as CareCoordinationWorklistItem[]).map(p => [p.id, p])
    )
  );

  const updatePatientLastModified = useCallback((patientId: string) => {
    const now = new Date();
    const timeString = formatTime(now, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === patientId
          ? { ...patient, lastModified: timeString }
          : patient
      )
    );
  }, [formatTime]);

  const updateSelectedPatientLastModified = useCallback(() => {
    if (selectedPatientId) {
      updatePatientLastModified(selectedPatientId);
    }
  }, [selectedPatientId, updatePatientLastModified]);

  const getPatient = useCallback(
    (patientId: string) => {
      return patients.find((p) => p.id === patientId) ?? patientRegistryRef.current.get(patientId);
    },
    [patients]
  );

  const callPatients = useCallback((patientIds: string[]) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = formatTime(now, { hour: "numeric", minute: "2-digit", hour12: true });
    const calledSet = new Set(patientIds);
    const calledPatients = patients.filter((p) => calledSet.has(p.id));

    const newRecords: ActiveCallRecord[] = calledPatients.map((p) => ({
      id: `call-${p.id}-${Date.now()}`,
      patientId: p.id,
      name: p.name,
      callType: p.callType || "medication-adherence" as CallType,
      contactDate: dateStr,
      contactTime: timeStr,
      phone: p.phone || "(555) 000-0000",
      status: "in-progress" as CallRecordStatus,
      pickedUpMeds: "--",
      takingAsRx: { value: "--", warning: false },
      sideEffects: { value: "--", warning: false },
      painLevel: 0,
      followUp: { value: "--", warning: false },
    }));

    // Preserve full patient data in registry before removing from worklist
    calledPatients.forEach(p => {
      patientRegistryRef.current.set(p.id, { ...p });
    });

    setActiveCallRecords((prevRecords) => {
      const next = [...newRecords, ...prevRecords];
      activeCallRecordsRef.current = next;
      return next;
    });
    setPatients((prev) => prev.filter((p) => !calledSet.has(p.id)));

    // Show dialer popup for single-patient calls
    if (patientIds.length === 1 && calledPatients.length === 1) {
      const p = calledPatients[0];
      const recordId = newRecords[0].id;
      setActiveDialerCall({ name: p.name, phone: p.phone || "(555) 000-0000", recordId });
    }
  }, [formatTime, patients]);

  const resolvedRecordIds = useRef<Set<string>>(new Set());

  const resolveCallRecord = useCallback((recordId: string) => {
    // Guard against double-invocation (React StrictMode / concurrent re-renders)
    if (resolvedRecordIds.current.has(recordId)) return;
    resolvedRecordIds.current.add(recordId);

    // Mutate registry OUTSIDE the state updater to prevent double-mutation
    const record = activeCallRecordsRef.current.find(r => r.id === recordId);
    const patientCallType = record?.callType || "medication-adherence";

    // Pick outcome based on call type
    let resolvedOutcome: {
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
    };

    if (record?.patientId === "ma-1") {
      resolvedOutcome = { pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "Nausea reported", warning: true }, painLevel: 0, followUp: { value: "Not needed", warning: false }, status: "needs-review" };
    } else if (patientCallType === "patient-intake") {
      const pool = PI_OUTCOME_POOLS[piOutcomeIndex++ % PI_OUTCOME_POOLS.length];
      resolvedOutcome = { ...pool, pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0 };
    } else if (patientCallType === "hypertension-management") {
      const pool = HT_OUTCOME_POOLS[htOutcomeIndex++ % HT_OUTCOME_POOLS.length];
      resolvedOutcome = { ...pool, pickedUpMeds: "--", takingAsRx: { value: "--", warning: false }, sideEffects: { value: "--", warning: false }, painLevel: 0 };
    } else {
      const pool = MA_OUTCOME_POOLS[outcomeIndex++ % MA_OUTCOME_POOLS.length];
      resolvedOutcome = { ...pool };
    }

    if (record) {
      const patient = patientRegistryRef.current.get(record.patientId);
      if (patient) {
        let transcriptSummary: string;
        const newEntry: ContactHistoryEntry = {
          date: record.contactDate,
          method: "phone",
          callType: patientCallType,
          transcriptLink: true,
          transcriptSummary: "",
          followUpNeeded: { value: resolvedOutcome.followUp.value, positive: !resolvedOutcome.followUp.warning },
          notes: `Automated call at ${record.contactTime}. Outcomes recorded and pending review.`,
        };

        if (patientCallType === "patient-intake") {
          transcriptSummary = `AI intake call completed. Intake: ${resolvedOutcome.intakeCompleted?.value}. Allergies: ${resolvedOutcome.allergiesConfirmed}. Red flags: ${resolvedOutcome.redFlag?.value}. Symptoms: ${resolvedOutcome.symptomsReported}.`;
          newEntry.intakeCompleted = resolvedOutcome.intakeCompleted ? { value: resolvedOutcome.intakeCompleted.value, positive: !resolvedOutcome.intakeCompleted.warning } : undefined;
          newEntry.allergiesConfirmed = resolvedOutcome.allergiesConfirmed;
          newEntry.redFlagIdentified = resolvedOutcome.redFlag ? { value: resolvedOutcome.redFlag.value, positive: !resolvedOutcome.redFlag.warning } : undefined;
          newEntry.symptomsReported = resolvedOutcome.symptomsReported;
          newEntry.medicalHistoryCollected = { value: "Yes", positive: true };
        } else if (patientCallType === "hypertension-management") {
          const bp = resolvedOutcome.bpReading;
          transcriptSummary = `AI BP management call completed. BP: ${bp?.systolic}/${bp?.diastolic}. At goal: ${resolvedOutcome.bpAtGoal?.value}. Med adherence: ${resolvedOutcome.medAdherence?.value}. Escalated: ${resolvedOutcome.escalated?.value}.`;
          newEntry.bpReading = resolvedOutcome.bpReading;
          newEntry.bpAtGoal = resolvedOutcome.bpAtGoal ? { value: resolvedOutcome.bpAtGoal.value, positive: !resolvedOutcome.bpAtGoal.warning } : undefined;
          newEntry.medicationAdherence = resolvedOutcome.medAdherence ? { value: resolvedOutcome.medAdherence.value, positive: !resolvedOutcome.medAdherence.warning } : undefined;
          newEntry.symptomsPresent = resolvedOutcome.symptomsPresent ? { value: resolvedOutcome.symptomsPresent.value, positive: !resolvedOutcome.symptomsPresent.warning } : undefined;
          newEntry.escalated = resolvedOutcome.escalated ? { value: resolvedOutcome.escalated.value, positive: !resolvedOutcome.escalated.warning } : undefined;
          newEntry.sideEffects = "Not reported";
        } else {
          const sideEffectText = resolvedOutcome.sideEffects?.value === "None" ? "Not reported" : (resolvedOutcome.sideEffects?.value ?? "Not reported");
          transcriptSummary = `AI call completed. Medication pickup: ${resolvedOutcome.pickedUpMeds}. Taking as prescribed: ${resolvedOutcome.takingAsRx?.value}. Side effects: ${sideEffectText}. Pain level: ${resolvedOutcome.painLevel}/10.`;
          newEntry.pickedUpMedication = resolvedOutcome.pickedUpMeds;
          newEntry.takingAsPrescribed = resolvedOutcome.takingAsRx ? { value: resolvedOutcome.takingAsRx.value, positive: !resolvedOutcome.takingAsRx.warning } : undefined;
          newEntry.sideEffects = sideEffectText;
          newEntry.painLevel = resolvedOutcome.painLevel;
          newEntry.reminderSet = resolvedOutcome.followUp.warning ? "No" : "Yes";
        }
        newEntry.transcriptSummary = transcriptSummary;

        patientRegistryRef.current.set(record.patientId, {
          ...patient,
          contactHistory: [newEntry, ...(patient.contactHistory ?? [])],
        });
      }
    }

    setActiveCallRecords((prev) => {
      const next = prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: resolvedOutcome.status,
              pickedUpMeds: resolvedOutcome.pickedUpMeds ?? "--",
              takingAsRx: resolvedOutcome.takingAsRx ?? { value: "--", warning: false },
              sideEffects: resolvedOutcome.sideEffects ?? { value: "--", warning: false },
              painLevel: resolvedOutcome.painLevel ?? 0,
              followUp: resolvedOutcome.followUp,
              ...(patientCallType === "patient-intake" && {
                intakeCompleted: resolvedOutcome.intakeCompleted,
                allergiesConfirmed: resolvedOutcome.allergiesConfirmed,
                redFlag: resolvedOutcome.redFlag,
                symptomsReported: resolvedOutcome.symptomsReported,
              }),
              ...(patientCallType === "hypertension-management" && {
                bpReading: resolvedOutcome.bpReading,
                bpAtGoal: resolvedOutcome.bpAtGoal,
                medAdherence: resolvedOutcome.medAdherence,
                symptomsPresent: resolvedOutcome.symptomsPresent,
                escalated: resolvedOutcome.escalated,
              }),
            }
          : r
      );
      activeCallRecordsRef.current = next;
      return next;
    });
  }, []);

  const markPatientAsReviewed = useCallback((patientId: string) => {
    // Mark contact records as reviewed (static ch-* patients)
    setContactRecords((prev) => prev.map((r) => r.patientId === patientId ? { ...r, reviewed: true } : r));
    // Mark active call records as reviewed (dynamically called patients)
    setActiveCallRecords((prev) => {
      const next = prev.map((r) => r.patientId === patientId ? { ...r, status: "reviewed" as CallRecordStatus } : r);
      activeCallRecordsRef.current = next;
      return next;
    });
    // Add the patient to the patients list with group "reviewed"
    // Update lastContactDate/lastContactSummary from their most recent contact history entry
    const patient = patientRegistryRef.current.get(patientId);
    if (patient) {
      const latestEntry = (patient.contactHistory ?? [])[0];
      // Convert date from "Feb 5, 2026" format to "2/5/26" format
      let formattedDate = patient.lastContactDate;
      if (latestEntry) {
        const parsed = new Date(latestEntry.date);
        if (!isNaN(parsed.getTime())) {
          formattedDate = `${parsed.getMonth() + 1}/${parsed.getDate()}/${String(parsed.getFullYear()).slice(-2)}`;
        }
      }
      const reviewedPatient = {
        ...patient,
        group: "reviewed",
        status: "Reviewed",
        ...(patientId === "ma-1" && {
          reason: "Warfarin 5mg picked up, taking as Rx. Mild nausea resolved.",
        }),
        ...(latestEntry && {
          lastContactDate: formattedDate,
          lastContactSummary: latestEntry.transcriptSummary ?? patient.lastContactSummary,
        }),
      };
      patientRegistryRef.current.set(patientId, reviewedPatient);
      setPatients((prev) => {
        // Only add if not already present
        if (prev.some((p) => p.id === patientId)) {
          return prev.map((p) => p.id === patientId ? reviewedPatient : p);
        }
        return [...prev, reviewedPatient];
      });
    }
  }, []);

  const isPatientNeedsReview = useCallback((patientId: string) => {
    // Check static contact records (only unreviewed, non-scheduled)
    const inContactRecords = contactRecords.some((r) => r.patientId === patientId && !r.reviewed && !r.scheduledForRetry);
    // Check active call records
    const inActiveRecords = activeCallRecords.some((r) => r.patientId === patientId && r.status === "needs-review");
    return inContactRecords || inActiveRecords;
  }, [contactRecords, activeCallRecords]);

  const dismissDialer = useCallback(() => {
    setActiveDialerCall((prev) => {
      if (prev?.recordId) {
        resolveCallRecord(prev.recordId);
      }
      return null;
    });
  }, [resolveCallRecord]);

  const addPatient = useCallback((patient: CareCoordinationWorklistItem) => {
    patientRegistryRef.current.set(patient.id, patient);
    setPatients((prev) => [patient, ...prev]);
  }, []);

  const removeFromQueue = useCallback((patientIds: string[]) => {
    const removedSet = new Set(patientIds);
    // Update patients: change group to "removed" so they leave the queue
    setPatients((prev) =>
      prev.map((p) =>
        removedSet.has(p.id)
          ? { ...p, group: "removed", status: "Removed from Queue" }
          : p
      )
    );
    // Update registry
    patientIds.forEach((id) => {
      const patient = patientRegistryRef.current.get(id);
      if (patient) {
        patientRegistryRef.current.set(id, { ...patient, group: "removed", status: "Removed from Queue" });
      }
    });
  }, []);

  const value = useMemo(
    () => ({
      patients,
      selectedPatientId,
      setSelectedPatientId,
      updatePatientLastModified,
      updateSelectedPatientLastModified,
      getPatient,
      activeCallRecords,
      callPatients,
      resolveCallRecord,
      contactRecords,
      markPatientAsReviewed,
      isPatientNeedsReview,
      activeDialerCall,
      dismissDialer,
      addPatient,
      removeFromQueue,
      callTypeFilter,
      setCallTypeFilter,
    }),
    [
      patients,
      selectedPatientId,
      updatePatientLastModified,
      updateSelectedPatientLastModified,
      getPatient,
      activeCallRecords,
      callPatients,
      resolveCallRecord,
      contactRecords,
      markPatientAsReviewed,
      isPatientNeedsReview,
      activeDialerCall,
      dismissDialer,
      addPatient,
      removeFromQueue,
      callTypeFilter,
    ]
  );

  return (
    <CareCoordinationWorklistContext.Provider value={value}>
      {children}
      {activeDialerCall && (
        <TeamsDialerPopup
          patientName={activeDialerCall.name}
          phoneNumber={activeDialerCall.phone}
          onHangUp={dismissDialer}
        />
      )}
    </CareCoordinationWorklistContext.Provider>
  );
};

export const useCareCoordinationWorklistContext =
  (): CareCoordinationWorklistContextValue => {
  const context = useContext(CareCoordinationWorklistContext);
  if (!context) {
    throw new Error(
      "useCareCoordinationWorklistContext must be used within a CareCoordinationWorklistProvider"
    );
  }
  return context;
};

export default CareCoordinationWorklistContext;
