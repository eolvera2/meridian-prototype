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
}

const MedicationAdherenceWorklistContext =
  createContext<MedicationAdherenceWorklistContextValue | null>(null);

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

  const value = useMemo(
    () => ({
      patients,
      selectedPatientId,
      setSelectedPatientId,
      updatePatientLastModified,
      updateSelectedPatientLastModified,
      getPatient,
    }),
    [
      patients,
      selectedPatientId,
      updatePatientLastModified,
      updateSelectedPatientLastModified,
      getPatient,
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
