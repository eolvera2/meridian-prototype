import React from "react";
import {
  CalendarLtr20Regular,
  CalendarArrowRight20Regular,
  Phone20Regular,
  Mail20Regular,
  Location20Regular,
  People20Regular,
  Warning16Regular,
  ClipboardTask20Regular,
  Stethoscope20Regular,
} from "@fluentui/react-icons";
import { usePatientDetailStyles } from "../CareCoordinationPatientDetail.styles";
import type { CareCoordinationWorklistItem, CallType } from "../CareCoordinationWorklist.types";

interface PatientInfoGridProps {
  patient: CareCoordinationWorklistItem;
  callType: CallType;
}

/** A single labelled info row with icon + uppercase label + value. */
const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  styles: ReturnType<typeof usePatientDetailStyles>;
}> = ({ icon, label, value, styles }) => (
  <div className={styles.infoItem}>
    <div className={styles.infoItemRow}>
      {icon}
      <span className={styles.infoLabel}>{label}</span>
    </div>
    <span className={styles.infoValue}>{value}</span>
  </div>
);

export const PatientInfoGrid: React.FC<PatientInfoGridProps> = ({ patient, callType }) => {
  const styles = usePatientDetailStyles();
  const iconCls = styles.infoItemIcon;

  return (
    <div className={styles.infoColumns}>
      {/* ── Left column ── */}
      <div className={styles.infoColumn}>
        <InfoItem icon={<CalendarLtr20Regular className={iconCls} />} label="DATE OF BIRTH" value={patient.dateOfBirth ?? "—"} styles={styles} />

        {callType === "medication-adherence" && (
          <>
            <InfoItem icon={<CalendarArrowRight20Regular className={iconCls} />} label="DISCHARGE DATE" value={patient.dischargeDate} styles={styles} />
            <InfoItem icon={<ClipboardTask20Regular className={iconCls} />} label="DISCHARGE INSTRUCTIONS" value={patient.dischargeInstructions ?? "—"} styles={styles} />
          </>
        )}

        {callType === "patient-intake" && patient.upcomingAppointment && (
          <InfoItem
            icon={<CalendarArrowRight20Regular className={iconCls} />}
            label="UPCOMING APPOINTMENT"
            value={[
              patient.upcomingAppointment.date,
              patient.upcomingAppointment.time && `at ${patient.upcomingAppointment.time}`,
              patient.upcomingAppointment.provider && `— ${patient.upcomingAppointment.provider}`,
              patient.upcomingAppointment.location && `(${patient.upcomingAppointment.location})`,
            ].filter(Boolean).join(" ")}
            styles={styles}
          />
        )}

        {callType === "patient-intake" && patient.allergies && patient.allergies.length > 0 && (
          <InfoItem icon={<Warning16Regular className={iconCls} />} label="ALLERGIES" value={patient.allergies.join(", ")} styles={styles} />
        )}

        {callType === "patient-intake" && patient.medicalHistory && (
          <InfoItem icon={<Stethoscope20Regular className={iconCls} />} label="MEDICAL HISTORY" value={patient.medicalHistory} styles={styles} />
        )}

        {callType === "patient-intake" && patient.surgicalHistory && (
          <InfoItem icon={<ClipboardTask20Regular className={iconCls} />} label="SURGICAL HISTORY" value={patient.surgicalHistory} styles={styles} />
        )}

        {callType === "hypertension-management" && patient.bpReadings && patient.bpReadings.length > 0 && (
          <InfoItem
            icon={<Stethoscope20Regular className={iconCls} />}
            label="RECENT BP READINGS"
            value={patient.bpReadings.map((r) => `${r.date}: ${r.systolic}/${r.diastolic}`).join(" | ")}
            styles={styles}
          />
        )}

        {callType === "hypertension-management" && (
          <InfoItem icon={<ClipboardTask20Regular className={iconCls} />} label="HOME BP MONITOR" value={patient.homeMonitor ? "Yes" : "No"} styles={styles} />
        )}

        {callType === "hypertension-management" && patient.lifestyleNotes && (
          <InfoItem icon={<ClipboardTask20Regular className={iconCls} />} label="LIFESTYLE NOTES" value={patient.lifestyleNotes} styles={styles} />
        )}

        <InfoItem icon={<Stethoscope20Regular className={iconCls} />} label="PRIMARY DIAGNOSIS" value={patient.primaryDiagnosis ?? "—"} styles={styles} />
      </div>

      {/* ── Right column ── */}
      <div className={styles.infoColumn}>
        <InfoItem icon={<Phone20Regular className={iconCls} />} label="PHONE" value={patient.phone ?? "—"} styles={styles} />
        <InfoItem icon={<Mail20Regular className={iconCls} />} label="EMAIL" value={patient.email ?? "—"} styles={styles} />
        <InfoItem icon={<Location20Regular className={iconCls} />} label="ADDRESS" value={patient.address ?? "—"} styles={styles} />
        <InfoItem icon={<People20Regular className={iconCls} />} label="CARE TEAM" value={patient.careTeam ?? "—"} styles={styles} />
      </div>
    </div>
  );
};
