import React, { useState, useCallback } from "react";
import { Button, Tooltip, mergeClasses } from "@fluentui/react-components";
import {
  bundleIcon,
  ChevronLeft24Regular,
  ChevronLeft24Filled,
  Script24Regular,
  Library24Regular,
  MoreVertical24Regular,
  Clock20Regular,
  Link20Regular,
  People20Regular,
  Pill20Regular,
} from "@fluentui/react-icons";
import { usePatientDetailStyles } from "./CareCoordinationPatientDetail.styles";
import { useCareCoordinationWorklistContext } from "./CareCoordinationWorklistContext";
import type { CareCoordinationWorklistItem, CallType } from "./CareCoordinationWorklist.types";
import { CALL_TYPE_LABELS } from "./CareCoordinationWorklist.types";
import { useOptionalTooltipContext } from "../tooltip/useTooltipHooks";
import { AICallTranscriptModal } from "./AICallTranscriptModal";
import { ContactHistoryEntryRow } from "./components/ContactHistoryEntry";
import { PatientInfoGrid } from "./components/PatientInfoGrid";

const ChevronLeft = bundleIcon(ChevronLeft24Filled, ChevronLeft24Regular);

/** Map a call type to its badge style class. */
const BADGE_CLASS_MAP: Record<CallType, "callTypeBadgeMedAdherence" | "callTypeBadgePatientIntake" | "callTypeBadgeHypertension"> = {
  "medication-adherence": "callTypeBadgeMedAdherence",
  "patient-intake": "callTypeBadgePatientIntake",
  "hypertension-management": "callTypeBadgeHypertension",
};

export const CareCoordinationPatientDetail: React.FC = () => {
  const styles = usePatientDetailStyles();
  const { selectedPatientId, getPatient, setSelectedPatientId, markPatientAsReviewed, isPatientNeedsReview } =
    useCareCoordinationWorklistContext();

  const patient: CareCoordinationWorklistItem | undefined = selectedPatientId
    ? getPatient(selectedPatientId)
    : undefined;

  if (!patient) return null;

  const contactHistory = patient.contactHistory ?? [];
  const medications = patient.medications ?? [];
  const needsReview = selectedPatientId ? isPatientNeedsReview(selectedPatientId) : false;
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const patientCallType: CallType = patient.callType || "medication-adherence";
  const tooltipContext = useOptionalTooltipContext();
  const tooltipHandlers = tooltipContext?.cursorTooltipHandlers;
  const [editedNotes, setEditedNotes] = useState<Record<number, string>>({});

  const handleNoteChange = useCallback((idx: number, value: string) => {
    setEditedNotes(prev => ({ ...prev, [idx]: value }));
  }, []);

  const handleMarkReviewed = useCallback(() => {
    if (selectedPatientId) {
      markPatientAsReviewed(selectedPatientId);
      setSelectedPatientId(null);
    }
  }, [selectedPatientId, markPatientAsReviewed, setSelectedPatientId]);

  return (
    <div className={styles.root}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <Tooltip content="Back to list" relationship="label">
          <Button
            onClick={() => setSelectedPatientId(null)}
            className={styles.backButton}
            icon={<ChevronLeft className={styles.icon} />}
            appearance="transparent"
            size="small"
            aria-label="Back to patient list"
          />
        </Tooltip>

        <div className={styles.patientInfo}>
          <div className={styles.patientName}>
            {patient.name}
            <span className={mergeClasses(styles.callTypeBadge, styles[BADGE_CLASS_MAP[patientCallType]])}>
              {CALL_TYPE_LABELS[patientCallType]}
            </span>
          </div>
          <div className={styles.subtitle}>
            <div className={styles.reasonRow}>
              <span className={styles.reasonLabel}>Reason for Visit:</span>
              <span>{patient.reason}</span>
            </div>
            <div className={styles.detailsRow}>{patient.demographics}</div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Tooltip content="Transcript" relationship="label">
            <Button
              appearance="subtle"
              size="small"
              icon={<Script24Regular className={styles.icon} />}
              className={styles.iconButton}
              aria-label="Transcript"
            />
          </Tooltip>
          <Tooltip content="Library" relationship="label">
            <Button
              appearance="subtle"
              size="small"
              icon={<Library24Regular className={styles.icon} />}
              className={styles.iconButton}
              aria-label="Library"
            />
          </Tooltip>
          <Tooltip content="More options" relationship="label">
            <Button
              appearance="subtle"
              size="small"
              icon={<MoreVertical24Regular className={styles.icon} />}
              className={styles.iconButton}
              aria-label="More options"
            />
          </Tooltip>
        </div>
      </div>

      {/* ── Accent bar ── */}
      <div className={styles.accentBar} />

      {/* ── Content area ── */}
      <div className={styles.content}>
        {/* ── Contact History ── */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionTitleRow}>
            <Clock20Regular className={styles.sectionIcon} />
            <span className={styles.sectionTitle}>Contact History</span>
          </div>

          {contactHistory.map((entry, idx) => (
            <ContactHistoryEntryRow
              key={idx}
              entry={entry}
              index={idx}
              callType={patientCallType}
              needsReview={needsReview}
              editedNote={editedNotes[idx]}
              onNoteChange={handleNoteChange}
              onTranscriptOpen={() => setTranscriptOpen(true)}
              onMarkReviewed={handleMarkReviewed}
              tooltipHandlers={tooltipHandlers}
            />
          ))}

          {contactHistory.length === 0 && (
            <span className={mergeClasses(styles.infoValue, styles.emptyStateItalic)}>
              No contact history available.
            </span>
          )}
        </div>

        {/* ── Medications ── */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionTitleRow}>
            <Link20Regular className={styles.sectionIcon} />
            <span className={styles.sectionTitle}>Medications</span>
          </div>

          <div className={styles.medicationGrid}>
            {medications.map((med, idx) => (
              <div className={styles.medicationCard} key={idx}>
                <div className={styles.medicationInfo}>
                  <span className={styles.medicationName}>{med.name}</span>
                  <span className={styles.medicationDose}>{med.dose}</span>
                  <span className={styles.frequencyPill}>{med.frequency}</span>
                  <span className={styles.prescribedDate}>Prescribed: {med.prescribedDate}</span>
                </div>
                <div className={styles.medicationRefill}>
                  {(med.refillsAvailable ?? 0) > 0 ? (
                    <Button
                      appearance="secondary"
                      size="small"
                      icon={<Pill20Regular />}
                    >
                      Order Refill
                    </Button>
                  ) : (
                    <Button
                      appearance="secondary"
                      size="small"
                      disabled
                    >
                      No Refills Available
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {medications.length === 0 && (
            <span className={mergeClasses(styles.infoValue, styles.emptyStateItalic)}>
              No medication data available.
            </span>
          )}
        </div>

        {/* ── Patient Information Card ── */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionTitleRow}>
            <People20Regular className={styles.sectionIcon} />
            <span className={styles.sectionTitle}>Patient Information</span>
          </div>
          <PatientInfoGrid patient={patient} callType={patientCallType} />
        </div>
      </div>
      {transcriptOpen && <AICallTranscriptModal onClose={() => setTranscriptOpen(false)} callType={patientCallType} />}
    </div>
  );
};
