/* eslint-disable react-refresh/only-export-components */
/**
 * WorklistContext
 *
 * Provides shared state for the worklist data, allowing components
 * to update patient information like lastModified timestamps.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import worklistData from "../../../data/worklistData.json";
import type { WorklistItem } from "../../shared";

interface WorklistContextValue {
  /** Current worklist data */
  patients: WorklistItem[];
  /** Currently selected patient ID */
  selectedPatientId: string | null;
  /** Set the selected patient ID */
  setSelectedPatientId: (patientId: string | null) => void;
  /** Update a patient's lastModified timestamp to current time */
  updatePatientLastModified: (patientId: string) => void;
  /** Update the currently selected patient's lastModified timestamp */
  updateSelectedPatientLastModified: () => void;
  /** Get a patient by ID */
  getPatient: (patientId: string) => WorklistItem | undefined;
}

const WorklistContext = createContext<WorklistContextValue | null>(null);

export const WorklistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [patients, setPatients] = useState<WorklistItem[]>(
    worklistData as WorklistItem[]
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  const updatePatientLastModified = useCallback((patientId: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
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
  }, []);

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
    <WorklistContext.Provider value={value}>
      {children}
    </WorklistContext.Provider>
  );
};

export const useWorklistContext = (): WorklistContextValue => {
  const context = useContext(WorklistContext);
  if (!context) {
    throw new Error(
      "useWorklistContext must be used within a WorklistProvider"
    );
  }
  return context;
};

export default WorklistContext;
