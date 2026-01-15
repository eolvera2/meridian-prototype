import { useCallback, useState, useEffect } from "react";
import worklistData from "../../../data/worklistData.json";
import type { HeaderPatient } from "../Header";
import type { WorklistItem } from "../../shared";
import { useWorklistContext } from "../../content/worklist/WorklistContext";

type WorklistStateChange = (collapsed: boolean, selected: boolean) => void;

const mapToHeaderPatient = (item: WorklistItem, fallbackId: string) => ({
  id: item?.id ?? fallbackId,
  name: item?.name ?? fallbackId,
  reason: item?.reason,
  time: item?.time,
  details: item?.details,
  initialRecordingSeconds: item?.initialRecordingSeconds,
});

/**
 * Hook for managing patient selection state and worklist interactions.
 * 
 * Handles patient selection, recording controls, and worklist state changes.
 * Synchronizes selected patient with WorklistContext.
 * 
 * @param onWorklistStateChange - Callback when worklist collapse/selection state changes
 * @param onStartRecording - Callback when recording should start
 * @param initialPatientId - Optional initial patient ID to select on mount
 * @returns Patient selection state and control functions
 */
export const usePatientSelection = (
  onWorklistStateChange?: WorklistStateChange,
  onStartRecording?: () => void,
  initialPatientId?: string
) => {
  const { setSelectedPatientId } = useWorklistContext();

  const [selectedPatient, setSelectedPatient] = useState<HeaderPatient | null>(
    () => {
      // Initialize with patient if initialPatientId is provided
      if (initialPatientId) {
        const found = (worklistData as WorklistItem[]).find(
          (patient) => patient.id === initialPatientId
        );
        if (found) {
          return mapToHeaderPatient(found, initialPatientId);
        }
      }
      return null;
    }
  );
  const [resetRecordingTime, setResetRecordingTime] = useState(false);

  // Effect to notify parent of initial patient selection
  useEffect(() => {
    if (initialPatientId && selectedPatient) {
      // Notify parent that patient is selected (worklist collapsed)
      onWorklistStateChange?.(true, true);
      // Update context with initial patient ID
      setSelectedPatientId(initialPatientId);
    }
    // Intentionally run only on mount - we want to notify parent of initial state once,
    // not on every change to these values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerRecordingReset = useCallback(() => {
    setResetRecordingTime(true);
    setTimeout(() => setResetRecordingTime(false), 100);
  }, []);

  const handlePatientSelect = useCallback(
    (patientId: string) => {
      const found = (worklistData as WorklistItem[]).find(
        (patient) => patient.id === patientId
      );

      const fallbackItem: WorklistItem = { id: patientId, name: patientId };
      setSelectedPatient(mapToHeaderPatient(found ?? fallbackItem, patientId));
      setSelectedPatientId(patientId); // Update context with selected patient

      triggerRecordingReset();
      onWorklistStateChange?.(true, true);
    },
    [triggerRecordingReset, onWorklistStateChange, setSelectedPatientId]
  );

  const handleAddPatient = useCallback(() => {
    onWorklistStateChange?.(false, false);
  }, [onWorklistStateChange]);

  const handleMicButtonClick = useCallback(
    (patientId: string) => {
      // First select the patient
      const found = (worklistData as WorklistItem[]).find(
        (patient) => patient.id === patientId
      );

      const fallbackItem: WorklistItem = { id: patientId, name: patientId };
      setSelectedPatient(mapToHeaderPatient(found ?? fallbackItem, patientId));
      setSelectedPatientId(patientId); // Update context with selected patient

      triggerRecordingReset();
      onWorklistStateChange?.(true, true);

      // Then start recording
      onStartRecording?.();
    },
    [
      triggerRecordingReset,
      onWorklistStateChange,
      onStartRecording,
      setSelectedPatientId,
    ]
  );

  const clearSelectedPatient = useCallback(() => {
    setSelectedPatient(null);
  }, []);

  return {
    selectedPatient,
    resetRecordingTime,
    triggerRecordingReset,
    handleWorklistActions: {
      onPatientSelect: handlePatientSelect,
      onAddPatient: handleAddPatient,
      onMicButtonClick: handleMicButtonClick,
    },
    clearSelectedPatient,
  } as const;
};
