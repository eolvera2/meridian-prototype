import React, { useState } from "react";
import { Button, Tooltip, mergeClasses } from "@fluentui/react-components";
import {
  bundleIcon,
  ChevronLeft24Regular,
  ChevronLeft24Filled,
  Script24Regular,
  Library24Regular,
  MoreVertical24Regular,
  CalendarLtr20Regular,
  CalendarArrowRight20Regular,
  Phone20Regular,
  Mail20Regular,
  Location20Regular,
  People20Regular,
  Clock20Regular,
  Link20Regular,
  Checkmark16Regular,
  Warning16Regular,
  ClipboardTask20Regular,
  Stethoscope20Regular,
  ClipboardCheckmark20Regular,
  Pill20Regular,
} from "@fluentui/react-icons";
import { usePatientDetailStyles } from "./CareCoordinationPatientDetail.styles";
import { useCareCoordinationWorklistContext } from "./CareCoordinationWorklistContext";
import type { CareCoordinationWorklistItem, CallType } from "./CareCoordinationWorklist.types";
import { CALL_TYPE_LABELS } from "./CareCoordinationWorklist.types";
import { AICallTranscriptModal } from "./AICallTranscriptModal";

const ChevronLeft = bundleIcon(ChevronLeft24Filled, ChevronLeft24Regular);

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
            <span style={{
              display: "inline-flex", alignItems: "center", marginLeft: 8,
              borderRadius: 16, padding: "2px 8px", fontSize: 10, fontWeight: 600,
              backgroundColor: patientCallType === "patient-intake" ? "#E1F5F0" : patientCallType === "hypertension-management" ? "#F3E8FD" : "#E8F0FE",
              color: patientCallType === "patient-intake" ? "#0E7C6B" : patientCallType === "hypertension-management" ? "#7B2D8E" : "#1B6EC2",
            }}>
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
            <Button
              appearance="primary"
              size="small"
              icon={<ClipboardCheckmark20Regular />}
              style={{ marginLeft: "auto" }}
              disabled={!needsReview}
              onClick={() => {
                if (selectedPatientId) {
                  markPatientAsReviewed(selectedPatientId);
                  setSelectedPatientId(null);
                }
              }}
            >
              Mark as Reviewed
            </Button>
          </div>

          {contactHistory.map((entry, idx) => (
            <div className={styles.contactEntry} key={idx}>
              {/* Date + transcript link */}
              <div className={styles.contactHeaderRow}>
                <span className={styles.contactDate}>{entry.date}</span>
                {entry.transcriptLink && (
                  <span className={styles.transcriptLink} onClick={() => setTranscriptOpen(true)}>
                    <Script24Regular style={{ width: 14, height: 14 }} />
                    View AI Call Transcript
                  </span>
                )}
              </div>

              {/* Transcript summary */}
              {entry.transcriptSummary && (
                <div className={styles.contactSummary}>
                  {entry.transcriptSummary}
                </div>
              )}

              {/* Outcome grid — branched by call type */}
              {patientCallType === "patient-intake" ? (
              <div className={styles.outcomeGrid}>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Intake completed</span>
                  {entry.intakeCompleted != null ? (
                    <>
                      {entry.intakeCompleted ? (
                        <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
                      ) : (
                        <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
                      )}
                      <span className={mergeClasses(styles.outcomeValue, entry.intakeCompleted ? styles.outcomePositive : styles.outcomeNegative)}>
                        {entry.intakeCompleted ? "Yes" : "No"}
                      </span>
                    </>
                  ) : <span className={styles.outcomeValue}>—</span>}
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Allergies confirmed</span>
                  {entry.allergiesConfirmed != null ? (
                    <>
                      {entry.allergiesConfirmed ? (
                        <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
                      ) : (
                        <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
                      )}
                      <span className={mergeClasses(styles.outcomeValue, entry.allergiesConfirmed ? styles.outcomePositive : styles.outcomeNegative)}>
                        {entry.allergiesConfirmed ? "Yes" : "No"}
                      </span>
                    </>
                  ) : <span className={styles.outcomeValue}>—</span>}
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Medical history collected</span>
                  {entry.medicalHistoryCollected != null ? (
                    <>
                      {entry.medicalHistoryCollected ? (
                        <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
                      ) : (
                        <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
                      )}
                      <span className={mergeClasses(styles.outcomeValue, entry.medicalHistoryCollected ? styles.outcomePositive : styles.outcomeNegative)}>
                        {entry.medicalHistoryCollected ? "Yes" : "No"}
                      </span>
                    </>
                  ) : <span className={styles.outcomeValue}>—</span>}
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Symptoms reported</span>
                  <span className={mergeClasses(styles.outcomeValue, styles.outcomeNeutral)}>
                    {entry.symptomsReported ?? "—"}
                  </span>
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Red flag identified</span>
                  {entry.redFlagIdentified != null ? (
                    <>
                      {entry.redFlagIdentified ? (
                        <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
                      ) : (
                        <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
                      )}
                      <span className={mergeClasses(styles.outcomeValue, entry.redFlagIdentified ? styles.outcomeNegative : styles.outcomePositive)}>
                        {entry.redFlagIdentified ? "Yes" : "No"}
                      </span>
                    </>
                  ) : <span className={styles.outcomeValue}>—</span>}
                </div>
              </div>
              ) : patientCallType === "hypertension-management" ? (
              <div className={styles.outcomeGrid}>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>BP reading</span>
                  <span className={mergeClasses(styles.outcomeValue, styles.outcomeNeutral)}>
                    {entry.bpReading ? (typeof entry.bpReading === "string" ? entry.bpReading : `${entry.bpReading.systolic}/${entry.bpReading.diastolic}`) : "—"}
                  </span>
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>BP at goal</span>
                  {entry.bpAtGoal != null ? (
                    <>
                      {entry.bpAtGoal ? (
                        <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
                      ) : (
                        <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
                      )}
                      <span className={mergeClasses(styles.outcomeValue, entry.bpAtGoal ? styles.outcomePositive : styles.outcomeNegative)}>
                        {entry.bpAtGoal ? "Yes" : "No"}
                      </span>
                    </>
                  ) : <span className={styles.outcomeValue}>—</span>}
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Medication adherence</span>
                  {entry.medicationAdherence != null ? (
                    <>
                      {entry.medicationAdherence ? (
                        <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
                      ) : (
                        <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
                      )}
                      <span className={mergeClasses(styles.outcomeValue, entry.medicationAdherence ? styles.outcomePositive : styles.outcomeNegative)}>
                        {entry.medicationAdherence ? "Yes" : "No"}
                      </span>
                    </>
                  ) : <span className={styles.outcomeValue}>—</span>}
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Symptoms present</span>
                  {entry.symptomsPresent != null ? (
                    <>
                      {entry.symptomsPresent ? (
                        <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
                      ) : (
                        <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
                      )}
                      <span className={mergeClasses(styles.outcomeValue, entry.symptomsPresent ? styles.outcomeNegative : styles.outcomePositive)}>
                        {entry.symptomsPresent ? "Yes" : "No"}
                      </span>
                    </>
                  ) : <span className={styles.outcomeValue}>—</span>}
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Escalated</span>
                  {entry.escalated != null ? (
                    <>
                      {entry.escalated ? (
                        <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
                      ) : (
                        <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
                      )}
                      <span className={mergeClasses(styles.outcomeValue, entry.escalated ? styles.outcomeNegative : styles.outcomePositive)}>
                        {entry.escalated ? "Yes" : "No"}
                      </span>
                    </>
                  ) : <span className={styles.outcomeValue}>—</span>}
                </div>
              </div>
              ) : (
              /* Medication Adherence — default */
              <div className={styles.outcomeGrid}>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Picked up medication</span>
                  <span className={mergeClasses(styles.outcomeValue, styles.outcomeNeutral)}>
                    {entry.pickedUpMedication ?? "—"}
                  </span>
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Taking as prescribed</span>
                  {entry.takingAsPrescribed ? (
                    <>
                      {entry.takingAsPrescribed.positive ? (
                        <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
                      ) : (
                        <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
                      )}
                      <span className={mergeClasses(
                        styles.outcomeValue,
                        entry.takingAsPrescribed.positive ? styles.outcomePositive : styles.outcomeNegative
                      )}>
                        {entry.takingAsPrescribed.value}
                      </span>
                    </>
                  ) : (
                    <span className={styles.outcomeValue}>—</span>
                  )}
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Side effects</span>
                  <span className={mergeClasses(styles.outcomeValue, styles.outcomeNeutral)}>
                    {entry.sideEffects ?? "—"}
                  </span>
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Pain level</span>
                  {entry.painLevel != null ? (
                    <span className={mergeClasses(
                      styles.outcomeValue,
                      entry.painLevel === 0 ? styles.outcomePositive
                        : entry.painLevel <= 3 ? styles.outcomeNeutral
                        : entry.painLevel <= 6 ? styles.outcomeNeutral
                        : styles.outcomeNegative
                    )}>
                      {entry.painLevel}/10
                    </span>
                  ) : (
                    <span className={styles.outcomeValue}>—</span>
                  )}
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Follow-up needed</span>
                  {entry.followUpNeeded ? (
                    <>
                      {entry.followUpNeeded.positive ? (
                        <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
                      ) : (
                        <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
                      )}
                      <span className={mergeClasses(
                        styles.outcomeValue,
                        entry.followUpNeeded.positive ? styles.outcomePositive : styles.outcomeNegative
                      )}>
                        {entry.followUpNeeded.value}
                      </span>
                    </>
                  ) : (
                    <span className={styles.outcomeValue}>—</span>
                  )}
                </div>
                <div className={styles.outcomeItem}>
                  <span className={styles.outcomeLabel}>Reminder set</span>
                  {entry.reminderSet ? (
                    <>
                      {entry.reminderSet === "Yes" ? (
                        <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
                      ) : (
                        <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
                      )}
                      <span className={mergeClasses(
                        styles.outcomeValue,
                        entry.reminderSet === "Yes" ? styles.outcomePositive : styles.outcomeNegative
                      )}>
                        {entry.reminderSet}
                      </span>
                    </>
                  ) : (
                    <span className={styles.outcomeValue}>—</span>
                  )}
                </div>
              </div>
              )}

              {/* Notes */}
              {entry.notes && (
                <div className={styles.notesBox}>
                  <div className={styles.notesLabel}>Notes</div>
                  {entry.notes}
                </div>
              )}
            </div>
          ))}

          {contactHistory.length === 0 && (
            <span className={styles.infoValue} style={{ fontStyle: "italic" }}>
              No contact history available.
            </span>
          )}
        </div>

        {/* ── Patient Information Card ── */}
        <div className={styles.sectionCard}>
          <div className={styles.infoColumns}>
            {/* Left column */}
            <div className={styles.infoColumn}>
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <CalendarLtr20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>DATE OF BIRTH</span>
                </div>
                <span className={styles.infoValue}>{patient.dateOfBirth ?? "—"}</span>
              </div>
              {(patientCallType === "medication-adherence") && (
              <>
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <CalendarArrowRight20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>DISCHARGE DATE</span>
                </div>
                <span className={styles.infoValue}>{patient.dischargeDate}</span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <ClipboardTask20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>DISCHARGE INSTRUCTIONS</span>
                </div>
                <span className={styles.infoValue}>{patient.dischargeInstructions ?? "—"}</span>
              </div>
              </>
              )}
              {patientCallType === "patient-intake" && patient.upcomingAppointment && (
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <CalendarArrowRight20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>UPCOMING APPOINTMENT</span>
                </div>
                <span className={styles.infoValue}>
                  {patient.upcomingAppointment.date} {patient.upcomingAppointment.time && `at ${patient.upcomingAppointment.time}`}
                  {patient.upcomingAppointment.provider && ` — ${patient.upcomingAppointment.provider}`}
                  {patient.upcomingAppointment.location && ` (${patient.upcomingAppointment.location})`}
                </span>
              </div>
              )}
              {patientCallType === "patient-intake" && patient.allergies && patient.allergies.length > 0 && (
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <Warning16Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>ALLERGIES</span>
                </div>
                <span className={styles.infoValue}>{patient.allergies.join(", ")}</span>
              </div>
              )}
              {patientCallType === "patient-intake" && patient.medicalHistory && (
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <Stethoscope20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>MEDICAL HISTORY</span>
                </div>
                <span className={styles.infoValue}>{patient.medicalHistory}</span>
              </div>
              )}
              {patientCallType === "patient-intake" && patient.surgicalHistory && (
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <ClipboardTask20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>SURGICAL HISTORY</span>
                </div>
                <span className={styles.infoValue}>{patient.surgicalHistory}</span>
              </div>
              )}
              {patientCallType === "hypertension-management" && patient.bpReadings && patient.bpReadings.length > 0 && (
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <Stethoscope20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>RECENT BP READINGS</span>
                </div>
                <span className={styles.infoValue}>
                  {patient.bpReadings.map((r) => `${r.date}: ${r.systolic}/${r.diastolic}`).join(" | ")}
                </span>
              </div>
              )}
              {patientCallType === "hypertension-management" && (
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <ClipboardTask20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>HOME BP MONITOR</span>
                </div>
                <span className={styles.infoValue}>{patient.homeMonitor ? "Yes" : "No"}</span>
              </div>
              )}
              {patientCallType === "hypertension-management" && patient.lifestyleNotes && (
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <ClipboardTask20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>LIFESTYLE NOTES</span>
                </div>
                <span className={styles.infoValue}>{patient.lifestyleNotes}</span>
              </div>
              )}
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <Stethoscope20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>PRIMARY DIAGNOSIS</span>
                </div>
                <span className={styles.infoValue}>{patient.primaryDiagnosis ?? "—"}</span>
              </div>
            </div>

            {/* Right column */}
            <div className={styles.infoColumn}>
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <Phone20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>PHONE</span>
                </div>
                <span className={styles.infoValue}>{patient.phone ?? "—"}</span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <Mail20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>EMAIL</span>
                </div>
                <span className={styles.infoValue}>{patient.email ?? "—"}</span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <Location20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>ADDRESS</span>
                </div>
                <span className={styles.infoValue}>{patient.address ?? "—"}</span>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <People20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>CARE TEAM</span>
                </div>
                <span className={styles.infoValue}>{patient.careTeam ?? "—"}</span>
              </div>
            </div>
          </div>
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
            <span className={styles.infoValue} style={{ fontStyle: "italic" }}>
              No medication data available.
            </span>
          )}
        </div>
      </div>
      {transcriptOpen && <AICallTranscriptModal onClose={() => setTranscriptOpen(false)} callType={patientCallType} />}
    </div>
  );
};
