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
} from "react";
import medicationAdherenceWorklistData from "../../../data/medicationAdherenceWorklistData.json";
import type { MedicationAdherenceWorklistItem } from "./MedicationAdherenceWorklist.types";
import { useI18n } from "../../../i18n/I18nContext";

export type CallRecordStatus = "in-progress" | "needs-review" | "completed";

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
      return patients.find((p) => p.id === patientId);
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

    setActiveCallRecords((prevRecords) => [...newRecords, ...prevRecords]);
    setPatients((prev) => prev.filter((p) => !calledSet.has(p.id)));
  }, [formatTime, patients]);

  const resolveCallRecord = useCallback((recordId: string) => {
    const outcome = OUTCOME_POOLS[outcomeIndex % OUTCOME_POOLS.length];
    outcomeIndex++;

    setActiveCallRecords((prev) =>
      prev.map((r) =>
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
      )
    );
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
