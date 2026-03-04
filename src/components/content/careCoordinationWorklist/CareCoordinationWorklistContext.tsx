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
import type { CareCoordinationWorklistItem, CallType, ContactHistoryEntry, CallRecordStatus, ContactRecord, ActiveCallRecord } from "./CareCoordinationWorklist.types";
import { useI18n } from "../../../i18n/I18nContext";
import { TeamsDialerPopup } from "./TeamsDialerPopup";
import { INITIAL_CONTACT_RECORDS } from "./data/initialContactRecords";
import { pickOutcome, buildContactEntry } from "./data/outcomePools";
import type { ResolvedOutcome } from "./data/outcomePools";

// Re-export record types from the canonical types file
export type { CallRecordStatus, ContactRecord, ActiveCallRecord } from "./CareCoordinationWorklist.types";

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
  /** Contact Status filter — persisted across navigation */
  statusFilter: string;
  /** Set the Contact Status filter */
  setStatusFilter: (filter: string) => void;
  /** Patient search text — persisted across navigation */
  patientSearch: string;
  /** Set the patient search text */
  setPatientSearch: (search: string) => void;
}

const CareCoordinationWorklistContext =
  createContext<CareCoordinationWorklistContextValue | null>(null);

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
  const [statusFilter, setStatusFilter] = useState<string>("all-active");
  const [patientSearch, setPatientSearch] = useState<string>("");

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
      mrn: p.mrn || "",
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

    // Pick outcome based on call type (special case for ma-1)
    let resolvedOutcome: ResolvedOutcome;
    if (record?.patientId === "ma-1") {
      resolvedOutcome = { pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "Nausea reported", warning: true }, painLevel: 0, followUp: { value: "Not needed", warning: false }, status: "needs-review" };
    } else {
      resolvedOutcome = pickOutcome(patientCallType);
    }

    if (record) {
      const patient = patientRegistryRef.current.get(record.patientId);
      if (patient) {
        const newEntry: ContactHistoryEntry = buildContactEntry(
          patientCallType,
          resolvedOutcome,
          record.contactDate,
          record.contactTime,
        );

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

    // If patient is added directly to contact list (scheduled), create a ContactRecord
    if (patient.group === "contact-list" && patient.status === "Scheduled") {
      const newRecord: ContactRecord = {
        id: `cr-new-${Date.now()}`,
        patientId: patient.id,
        name: patient.name,
        mrn: patient.mrn || "",
        callType: patient.callType || "medication-adherence",
        contactDate: "--",
        contactTime: "",
        daysAgo: 0,
        phone: patient.phone || "",
        pickedUpMeds: "—",
        takingAsRx: { value: "—", warning: false },
        sideEffects: { value: "—", warning: false },
        painLevel: 0,
        followUp: { value: "—", warning: false },
        reviewed: false,
        scheduled: true,
      };
      setContactRecords((prev) => [newRecord, ...prev]);
    }
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
      statusFilter,
      setStatusFilter,
      patientSearch,
      setPatientSearch,
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
      statusFilter,
      patientSearch,
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
