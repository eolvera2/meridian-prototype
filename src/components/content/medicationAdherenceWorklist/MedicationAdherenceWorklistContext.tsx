/* eslint-disable react-refresh/only-export-components */
/**
 * MedicationAdherenceWorklistContext
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
import medicationAdherenceWorklistData from "../../../data/medicationAdherenceWorklistData.json";
import type { MedicationAdherenceWorklistItem } from "./MedicationAdherenceWorklist.types";
import { useI18n } from "../../../i18n/I18nContext";

export type CallRecordStatus = "in-progress" | "needs-review" | "completed";

export interface ContactRecord {
  id: string;
  patientId: string;
  name: string;
  contactDate: string;
  contactTime: string;
  daysAgo: number;
  phone: string;
  pickedUpMeds: string;
  takingAsRx: { value: string; warning: boolean };
  sideEffects: { value: string; warning: boolean };
  painLevel: number;
  followUp: { value: string; warning: boolean };
  reviewed: boolean;
}

const INITIAL_CONTACT_RECORDS: ContactRecord[] = [
  { id: "cr-1", patientId: "ch-1", name: "Michael Chen", contactDate: "Feb 5, 2026", contactTime: "6:09 AM", daysAgo: 8, phone: "(555) 234-5678", pickedUpMeds: "Yes", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "Reported", warning: true }, painLevel: 6, followUp: { value: "Yes", warning: true }, reviewed: false },
  { id: "cr-2", patientId: "ch-2", name: "Patricia Martinez", contactDate: "Feb 6, 2026", contactTime: "7:30 PM", daysAgo: 7, phone: "(256) 431-7337", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 2, followUp: { value: "Not needed", warning: false }, reviewed: false },
  { id: "cr-3", patientId: "ch-3", name: "Sarah Johnson", contactDate: "Jan 28, 2026", contactTime: "10:15 AM", daysAgo: 16, phone: "(312) 555-0198", pickedUpMeds: "No", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "None", warning: false }, painLevel: 7, followUp: { value: "Yes", warning: true }, reviewed: false },
  { id: "cr-4", patientId: "ch-4", name: "Robert Kim", contactDate: "Jan 20, 2026", contactTime: "2:45 PM", daysAgo: 24, phone: "(415) 555-0342", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "Reported", warning: true }, painLevel: 4, followUp: { value: "Yes", warning: true }, reviewed: false },
  { id: "cr-5", patientId: "ch-5", name: "Linda Nguyen", contactDate: "Jan 15, 2026", contactTime: "9:00 AM", daysAgo: 29, phone: "(650) 555-0477", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 1, followUp: { value: "Not needed", warning: false }, reviewed: false },
  { id: "cr-6", patientId: "ch-6", name: "James Wilson", contactDate: "Dec 20, 2025", contactTime: "11:30 AM", daysAgo: 55, phone: "(206) 555-0613", pickedUpMeds: "Yes", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "Reported", warning: true }, painLevel: 8, followUp: { value: "Yes", warning: true }, reviewed: false },
  { id: "cr-7", patientId: "ch-7", name: "Maria Garcia", contactDate: "Dec 10, 2025", contactTime: "4:20 PM", daysAgo: 65, phone: "(713) 555-0829", pickedUpMeds: "No", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "None", warning: false }, painLevel: 5, followUp: { value: "Yes", warning: true }, reviewed: false },
  { id: "cr-8", patientId: "ch-8", name: "David Thompson", contactDate: "Nov 25, 2025", contactTime: "8:00 AM", daysAgo: 80, phone: "(503) 555-0156", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 3, followUp: { value: "Not needed", warning: false }, reviewed: false },
];

export interface ActiveCallRecord {
  id: string;
  patientId: string;
  name: string;
  contactDate: string;
  contactTime: string;
  phone: string;
  status: CallRecordStatus;
  pickedUpMeds: string;
  takingAsRx: { value: string; warning: boolean };
  sideEffects: { value: string; warning: boolean };
  painLevel: number;
  followUp: { value: string; warning: boolean };
}

interface MedicationAdherenceWorklistContextValue {
  /** Current worklist data */
  patients: MedicationAdherenceWorklistItem[];
  /** Currently selected patient ID */
  selectedPatientId: string | null;
  /** Set the selected patient ID */
  setSelectedPatientId: (patientId: string | null) => void;
  /** Update a patient's lastModified timestamp to current time */
  updatePatientLastModified: (patientId: string) => void;
  /** Update the currently selected patient's lastModified timestamp */
  updateSelectedPatientLastModified: () => void;
  /** Get a patient by ID */
  getPatient: (patientId: string) => MedicationAdherenceWorklistItem | undefined;
  /** Active call records from patient calls */
  activeCallRecords: ActiveCallRecord[];
  /** Call patients: remove from worklist and add to contact history */
  callPatients: (patientIds: string[]) => void;
  /** Resolve a call record after the 10s timer */
  resolveCallRecord: (recordId: string) => void;
  /** Contact records for the Dashboard's Patient Contact History table */
  contactRecords: ContactRecord[];
  /** Mark a patient as reviewed: remove from contact history, add to reviewed tab */
  markPatientAsReviewed: (patientId: string) => void;
  /** Check if a patient currently has "needs-review" status */
  isPatientNeedsReview: (patientId: string) => boolean;
}

const MedicationAdherenceWorklistContext =
  createContext<MedicationAdherenceWorklistContextValue | null>(null);

// Realistic outcome data pools for resolved calls
const OUTCOME_POOLS: {
  pickedUpMeds: string;
  takingAsRx: { value: string; warning: boolean };
  sideEffects: { value: string; warning: boolean };
  painLevel: number;
  followUp: { value: string; warning: boolean };
  status: CallRecordStatus;
}[] = [
  { pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 0, followUp: { value: "Not needed", warning: false }, status: "needs-review" },
  { pickedUpMeds: "Yes", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "Reported", warning: true }, painLevel: 8, followUp: { value: "Yes", warning: true }, status: "needs-review" },
  { pickedUpMeds: "No", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "None", warning: false }, painLevel: 10, followUp: { value: "Yes", warning: true }, status: "needs-review" },
  { pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "Reported", warning: true }, painLevel: 3, followUp: { value: "Yes", warning: true }, status: "needs-review" },
  { pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, painLevel: 5, followUp: { value: "Not needed", warning: false }, status: "needs-review" },
];

let outcomeIndex = 0;

export const MedicationAdherenceWorklistProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children,
}) => {
  const { formatTime } = useI18n();
  const [patients, setPatients] = useState<MedicationAdherenceWorklistItem[]>(
    medicationAdherenceWorklistData as MedicationAdherenceWorklistItem[]
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [activeCallRecords, setActiveCallRecords] = useState<ActiveCallRecord[]>([]);
  // Ref mirror of activeCallRecords so resolveCallRecord can read without closing over state
  const activeCallRecordsRef = useRef<ActiveCallRecord[]>([]);
  const [contactRecords, setContactRecords] = useState<ContactRecord[]>(INITIAL_CONTACT_RECORDS);

  // Registry preserves full patient data even after patients are removed from the worklist via callPatients
  const patientRegistryRef = useRef<Map<string, MedicationAdherenceWorklistItem>>(
    new Map(
      (medicationAdherenceWorklistData as MedicationAdherenceWorklistItem[]).map(p => [p.id, p])
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
  }, [formatTime, patients]);

  const resolvedRecordIds = useRef<Set<string>>(new Set());

  const resolveCallRecord = useCallback((recordId: string) => {
    // Guard against double-invocation (React StrictMode / concurrent re-renders)
    if (resolvedRecordIds.current.has(recordId)) return;
    resolvedRecordIds.current.add(recordId);

    const outcome = OUTCOME_POOLS[outcomeIndex % OUTCOME_POOLS.length];
    outcomeIndex++;

    // Mutate registry OUTSIDE the state updater to prevent double-mutation
    const record = activeCallRecordsRef.current.find(r => r.id === recordId);
    if (record) {
      const patient = patientRegistryRef.current.get(record.patientId);
      if (patient) {
        const sideEffectText = outcome.sideEffects.value === "None" ? "Not reported" : outcome.sideEffects.value;
        const newEntry: NonNullable<MedicationAdherenceWorklistItem["contactHistory"]>[number] = {
          date: record.contactDate,
          method: "phone",
          transcriptLink: true,
          transcriptSummary: `AI call completed. Medication pickup: ${outcome.pickedUpMeds}. Taking as prescribed: ${outcome.takingAsRx.value}. Side effects: ${sideEffectText}. Pain level: ${outcome.painLevel}/10.`,
          pickedUpMedication: outcome.pickedUpMeds,
          takingAsPrescribed: { value: outcome.takingAsRx.value, positive: !outcome.takingAsRx.warning },
          sideEffects: sideEffectText,
          painLevel: outcome.painLevel,
          followUpNeeded: { value: outcome.followUp.value, positive: !outcome.followUp.warning },
          reminderSet: outcome.followUp.warning ? "No" : "Yes",
          notes: `Automated call at ${record.contactTime}. Outcomes recorded and pending review.`,
        };
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
              status: outcome.status,
              pickedUpMeds: outcome.pickedUpMeds,
              takingAsRx: outcome.takingAsRx,
              sideEffects: outcome.sideEffects,
              painLevel: outcome.painLevel,
              followUp: outcome.followUp,
            }
          : r
      );
      activeCallRecordsRef.current = next;
      return next;
    });
  }, []);

  const markPatientAsReviewed = useCallback((patientId: string) => {
    // Remove from contactRecords (static ch-* patients)
    setContactRecords((prev) => prev.filter((r) => r.patientId !== patientId));
    // Remove from activeCallRecords (dynamically called patients)
    setActiveCallRecords((prev) => {
      const next = prev.filter((r) => r.patientId !== patientId);
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
    // Check static contact records
    const inContactRecords = contactRecords.some((r) => r.patientId === patientId && !r.reviewed);
    // Check active call records
    const inActiveRecords = activeCallRecords.some((r) => r.patientId === patientId && r.status === "needs-review");
    return inContactRecords || inActiveRecords;
  }, [contactRecords, activeCallRecords]);

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
    ]
  );

  return (
    <MedicationAdherenceWorklistContext.Provider value={value}>
      {children}
    </MedicationAdherenceWorklistContext.Provider>
  );
};

export const useMedicationAdherenceWorklistContext =
  (): MedicationAdherenceWorklistContextValue => {
  const context = useContext(MedicationAdherenceWorklistContext);
  if (!context) {
    throw new Error(
      "useMedicationAdherenceWorklistContext must be used within a MedicationAdherenceWorklistProvider"
    );
  }
  return context;
};

export default MedicationAdherenceWorklistContext;
