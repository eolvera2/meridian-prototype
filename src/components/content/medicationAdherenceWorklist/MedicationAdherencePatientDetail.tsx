import React from "react";
import { Button, Tooltip, mergeClasses } from "@fluentui/react-components";
import {
  bundleIcon,
  ChevronLeft24Regular,
  ChevronLeft24Filled,
  Script24Regular,
  Library24Regular,
  MoreVertical24Regular,
  Call20Regular,
  Chat20Regular,
  CalendarLtr20Regular,
  Phone20Regular,
  Mail20Regular,
  Location20Regular,
  People20Regular,
  Clock20Regular,
  Link20Regular,
  Checkmark16Regular,
  Warning16Regular,
} from "@fluentui/react-icons";
import { usePatientDetailStyles } from "./MedicationAdherencePatientDetail.styles";
import { useMedicationAdherenceWorklistContext } from "./MedicationAdherenceWorklistContext";
import type { MedicationAdherenceWorklistItem } from "./MedicationAdherenceWorklist.types";

const ChevronLeft = bundleIcon(ChevronLeft24Filled, ChevronLeft24Regular);

export const MedicationAdherencePatientDetail: React.FC = () => {
  const styles = usePatientDetailStyles();
  const { selectedPatientId, getPatient, setSelectedPatientId } =
    useMedicationAdherenceWorklistContext();

  const patient: MedicationAdherenceWorklistItem | undefined = selectedPatientId
    ? getPatient(selectedPatientId)
    : undefined;

  if (!patient) return null;

  const contactHistory = patient.contactHistory ?? [];
  const medications = patient.medications ?? [];

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
          <div className={styles.patientName}>{patient.name}</div>
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
              <div className={styles.infoItem}>
                <div className={styles.infoItemRow}>
                  <CalendarLtr20Regular className={styles.infoItemIcon} />
                  <span className={styles.infoLabel}>DISCHARGE DATE</span>
                </div>
                <span className={styles.infoValue}>{patient.dischargeDate}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>DISCHARGE INSTRUCTIONS</span>
                <span className={styles.infoValue}>{patient.dischargeInstructions ?? "—"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>PRIMARY DIAGNOSIS</span>
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

        {/* ── Contact History ── */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionTitleRow}>
            <Clock20Regular className={styles.sectionIcon} />
            <span className={styles.sectionTitle}>Contact History</span>
          </div>

          {contactHistory.map((entry, idx) => (
            <div className={styles.contactEntry} key={idx}>
              {/* Date + transcript link + action buttons */}
              <div className={styles.contactHeaderRow}>
                <span className={styles.contactDate}>{entry.date}</span>
                {entry.transcriptLink && (
                  <span className={styles.transcriptLink}>
                    <Script24Regular style={{ width: 14, height: 14 }} />
                    View AI Call Transcript
                  </span>
                )}
                <div className={styles.contactActions}>
                  <Button
                    size="small"
                    icon={<Call20Regular />}
                    className={styles.callButton}
                  >
                    Call
                  </Button>
                  <Button
                    appearance="outline"
                    size="small"
                    icon={<Chat20Regular />}
                    className={styles.chatButton}
                  >
                    Chat
                  </Button>
                </div>
              </div>

              {/* Transcript summary */}
              {entry.transcriptSummary && (
                <div className={styles.contactSummary}>
                  {entry.transcriptSummary}
                </div>
              )}

              {/* Outcome grid */}
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
              </div>

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

        {/* ── Medications ── */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionTitleRow}>
            <Link20Regular className={styles.sectionIcon} />
            <span className={styles.sectionTitle}>Medications</span>
          </div>

          <div className={styles.medicationGrid}>
            {medications.map((med, idx) => (
              <div className={styles.medicationCard} key={idx}>
                <span className={styles.medicationName}>{med.name}</span>
                <span className={styles.medicationDose}>{med.dose}</span>
                <div className={styles.medicationMeta}>
                  <span className={styles.frequencyPill}>{med.frequency}</span>
                  <span className={styles.prescribedDate}>Prescribed: {med.prescribedDate}</span>
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
    </div>
  );
};
