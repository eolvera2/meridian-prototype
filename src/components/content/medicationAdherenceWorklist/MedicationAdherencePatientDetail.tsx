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
} from "@fluentui/react-icons";
import { usePatientDetailStyles } from "./MedicationAdherencePatientDetail.styles";
import { useMedicationAdherenceWorklistContext } from "./MedicationAdherenceWorklistContext";
import type { MedicationAdherenceWorklistItem } from "./MedicationAdherenceWorklist.types";

const ChevronLeft = bundleIcon(ChevronLeft24Filled, ChevronLeft24Regular);

// ── Static medication data per patient (keyed by patient id) ──
const MEDICATIONS: Record<string, { name: string; dose: string; adherence: number }[]> = {
  "ma-1": [
    { name: "Warfarin 5 mg", dose: "Once daily at bedtime", adherence: 50 },
    { name: "Metoprolol 25 mg", dose: "Twice daily with meals", adherence: 85 },
    { name: "Aspirin 81 mg", dose: "Once daily", adherence: 100 },
  ],
  "ma-2": [
    { name: "Insulin Glargine 20 units", dose: "Once daily at bedtime", adherence: 60 },
    { name: "Metformin 1000 mg", dose: "Twice daily with meals", adherence: 90 },
    { name: "Lisinopril 10 mg", dose: "Once daily", adherence: 95 },
  ],
  "ma-3": [
    { name: "Lisinopril 20 mg", dose: "Once daily (discontinued by patient)", adherence: 0 },
    { name: "Amlodipine 5 mg", dose: "Once daily", adherence: 85 },
    { name: "Hydrochlorothiazide 25 mg", dose: "Once daily", adherence: 90 },
  ],
  "ma-4": [
    { name: "Carvedilol 12.5 mg", dose: "Twice daily", adherence: 57 },
    { name: "Furosemide 40 mg", dose: "Once daily", adherence: 71 },
    { name: "Potassium Chloride 20 mEq", dose: "Once daily", adherence: 71 },
    { name: "Lisinopril 10 mg", dose: "Once daily", adherence: 86 },
  ],
};

// Fallback medications for patients without specific data
const DEFAULT_MEDICATIONS = [
  { name: "Medication details pending", dose: "Awaiting pharmacy data", adherence: 0 },
];

function getAdherenceClass(styles: ReturnType<typeof usePatientDetailStyles>, rate: number) {
  if (rate >= 80) return styles.adherenceGood;
  if (rate >= 50) return styles.adherenceWarning;
  return styles.adherencePoor;
}

function getStatusColor(status?: string) {
  const s = status?.toLowerCase() ?? "";
  if (s.includes("urgent") || s.includes("escalat")) return { bg: "#FDE7E9", text: "#D13438", dot: "#D13438" };
  if (s.includes("pending") || s.includes("queued")) return { bg: "#FFF4CE", text: "#797673", dot: "#FDE300" };
  if (s.includes("cleared")) return { bg: "#DFF6DD", text: "#107C10", dot: "#107C10" };
  if (s.includes("clinician")) return { bg: "#FDE7E9", text: "#D13438", dot: "#D13438" };
  return { bg: "#F0F0F0", text: "#616161", dot: "#616161" };
}

function capitalizeMethod(method: string) {
  return method.charAt(0).toUpperCase() + method.slice(1);
}

export const MedicationAdherencePatientDetail: React.FC = () => {
  const styles = usePatientDetailStyles();
  const { selectedPatientId, getPatient, setSelectedPatientId } =
    useMedicationAdherenceWorklistContext();

  const patient: MedicationAdherenceWorklistItem | undefined = selectedPatientId
    ? getPatient(selectedPatientId)
    : undefined;

  if (!patient) return null;

  const medications = MEDICATIONS[patient.id] ?? DEFAULT_MEDICATIONS;
  const statusColor = getStatusColor(patient.status);

  // Parse demographics for the header "Reason for Visit" line
  // The patient data uses "reason" for the adherence issue description
  const reasonText = patient.reason;

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
              <span>{reasonText}</span>
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
        {/* Patient Overview */}
        <div className={styles.sectionCard}>
          <span className={styles.sectionTitle}>Patient Overview</span>
          <div
            className={styles.statusPill}
            style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
          >
            <span className={styles.statusDot} style={{ backgroundColor: statusColor.dot }} />
            {patient.status}
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Language</span>
              <span className={styles.infoValue}>{patient.languagePreference}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Discharge Date</span>
              <span className={styles.infoValue}>{patient.dischargeDate}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Last Contact</span>
              <span className={styles.infoValue}>{patient.lastContactDate}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Contact Method</span>
              <span className={styles.infoValue}>{capitalizeMethod(patient.lastContactMethod)}</span>
            </div>
          </div>
          <div className={styles.actionsRow}>
            <Button appearance="primary" icon={<Call20Regular />} size="small">
              Call Patient
            </Button>
            <Button appearance="outline" icon={<Chat20Regular />} size="small">
              Send Message
            </Button>
          </div>
        </div>

        {/* Medications & Adherence */}
        <div className={styles.sectionCard}>
          <span className={styles.sectionTitle}>Medications &amp; Adherence</span>
          <span className={styles.sectionSubtitle}>Current prescriptions and adherence rates</span>
          {medications.map((med) => (
            <div className={styles.medicationItem} key={med.name}>
              <div>
                <div className={styles.medicationName}>{med.name}</div>
                <div className={styles.medicationDose}>{med.dose}</div>
              </div>
              <span
                className={mergeClasses(
                  styles.medicationAdherenceBadge,
                  getAdherenceClass(styles, med.adherence)
                )}
              >
                {med.adherence}%
              </span>
            </div>
          ))}
        </div>

        {/* Last Contact Summary */}
        <div className={styles.sectionCard}>
          <span className={styles.sectionTitle}>Contact History</span>
          <div className={styles.contactEntry}>
            <div className={styles.contactHeader}>
              <span className={styles.contactMethod}>
                {patient.lastContactMethod === "phone" ? (
                  <Call20Regular />
                ) : (
                  <Chat20Regular />
                )}
                {capitalizeMethod(patient.lastContactMethod)} Contact
              </span>
              <span className={styles.contactDate}>{patient.lastContactDate}</span>
            </div>
            <span className={styles.contactSummary}>{patient.lastContactSummary}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
