import React from "react";
import { mergeClasses } from "@fluentui/react-components";
import {
  Checkmark16Regular,
  Warning16Regular,
} from "@fluentui/react-icons";
import { usePatientDetailStyles } from "../CareCoordinationPatientDetail.styles";
import type { ContactHistoryEntry, CallType } from "../CareCoordinationWorklist.types";

interface OutcomeGridProps {
  entry: ContactHistoryEntry;
  callType: CallType;
}

/** Renders a boolean-ish outcome field with checkmark/warning icon. */
const BooleanOutcome: React.FC<{
  label: string;
  value: { value: string; positive: boolean } | undefined;
  /** When true, invert icon semantics (warning = positive). Used for "red flag" / "escalated". */
  invertIcon?: boolean;
  styles: ReturnType<typeof usePatientDetailStyles>;
}> = ({ label, value, invertIcon, styles }) => {
  if (value == null) {
    return (
      <div className={styles.outcomeItem}>
        <span className={styles.outcomeLabel}>{label}</span>
        <span className={styles.outcomeValue}>—</span>
      </div>
    );
  }

  const showPositiveIcon = invertIcon ? !value.positive : value.positive;
  const positiveClass = invertIcon
    ? (value.positive ? styles.outcomeNegative : styles.outcomePositive)
    : (value.positive ? styles.outcomePositive : styles.outcomeNegative);

  return (
    <div className={styles.outcomeItem}>
      <span className={styles.outcomeLabel}>{label}</span>
      {showPositiveIcon ? (
        <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
      ) : (
        <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
      )}
      <span className={mergeClasses(styles.outcomeValue, positiveClass)}>
        {value.value}
      </span>
    </div>
  );
};

/** Renders a plain-text outcome field with no icon. */
const TextOutcome: React.FC<{
  label: string;
  value: string | undefined;
  styles: ReturnType<typeof usePatientDetailStyles>;
}> = ({ label, value, styles }) => (
  <div className={styles.outcomeItem}>
    <span className={styles.outcomeLabel}>{label}</span>
    <span className={mergeClasses(styles.outcomeValue, styles.outcomeNeutral)}>
      {value ?? "—"}
    </span>
  </div>
);

/* ── Patient Intake ── */

const PatientIntakeOutcome: React.FC<{ entry: ContactHistoryEntry; styles: ReturnType<typeof usePatientDetailStyles> }> = ({ entry, styles }) => (
  <div className={styles.outcomeGrid}>
    <BooleanOutcome label="Intake completed" value={entry.intakeCompleted} styles={styles} />
    <BooleanOutcome label="Allergies confirmed" value={entry.allergiesConfirmed != null ? { value: entry.allergiesConfirmed ? "Yes" : "No", positive: !!entry.allergiesConfirmed } : undefined} styles={styles} />
    <BooleanOutcome label="Medical history collected" value={entry.medicalHistoryCollected} styles={styles} />
    <TextOutcome label="Symptoms reported" value={entry.symptomsReported} styles={styles} />
    <BooleanOutcome label="Red flag identified" value={entry.redFlagIdentified} invertIcon styles={styles} />
  </div>
);

/* ── Hypertension Management ── */

const HypertensionOutcome: React.FC<{ entry: ContactHistoryEntry; styles: ReturnType<typeof usePatientDetailStyles> }> = ({ entry, styles }) => {
  const bpText = entry.bpReading
    ? (typeof entry.bpReading === "string"
      ? entry.bpReading
      : `${entry.bpReading.systolic}/${entry.bpReading.diastolic}`)
    : undefined;

  return (
    <div className={styles.outcomeGrid}>
      <TextOutcome label="BP reading" value={bpText} styles={styles} />
      <BooleanOutcome label="BP at goal" value={entry.bpAtGoal} styles={styles} />
      <BooleanOutcome label="Medication adherence" value={entry.medicationAdherence} styles={styles} />
      <BooleanOutcome label="Symptoms present" value={entry.symptomsPresent} invertIcon styles={styles} />
      <BooleanOutcome label="Escalated" value={entry.escalated} invertIcon styles={styles} />
    </div>
  );
};

/* ── Medication Adherence (default) ── */

const MedAdherenceOutcome: React.FC<{ entry: ContactHistoryEntry; styles: ReturnType<typeof usePatientDetailStyles> }> = ({ entry, styles }) => {
  const hasSideEffects = entry.sideEffects != null && entry.sideEffects !== "Not reported";

  return (
    <div className={styles.outcomeGrid}>
      <TextOutcome label="Picked up medication" value={entry.pickedUpMedication} styles={styles} />

      {/* Taking as prescribed */}
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

      {/* Side effects */}
      <div className={styles.outcomeItem}>
        <span className={styles.outcomeLabel}>Side effects</span>
        {hasSideEffects ? (
          <>
            <Warning16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomeNegative)} />
            <span className={mergeClasses(styles.outcomeValue, styles.outcomeNegative)}>
              {entry.sideEffects}
            </span>
          </>
        ) : (
          <>
            <Checkmark16Regular className={mergeClasses(styles.outcomeIcon, styles.outcomePositive)} />
            <span className={mergeClasses(styles.outcomeValue, styles.outcomePositive)}>
              {entry.sideEffects ?? "Not reported"}
            </span>
          </>
        )}
      </div>

      {/* Pain level */}
      <div className={styles.outcomeItem}>
        <span className={styles.outcomeLabel}>Pain level</span>
        {entry.painLevel != null ? (
          <span className={mergeClasses(
            styles.outcomeValue,
            entry.painLevel === 0 ? styles.outcomePositive
              : entry.painLevel <= 6 ? styles.outcomeNeutral
              : styles.outcomeNegative
          )}>
            {entry.painLevel}/10
          </span>
        ) : (
          <span className={styles.outcomeValue}>—</span>
        )}
      </div>

      {/* Follow-up needed */}
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

      {/* Reminder set */}
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
  );
};

/* ── Main export ── */

export const OutcomeGrid: React.FC<OutcomeGridProps> = ({ entry, callType }) => {
  const styles = usePatientDetailStyles();

  switch (callType) {
    case "patient-intake":
      return <PatientIntakeOutcome entry={entry} styles={styles} />;
    case "hypertension-management":
      return <HypertensionOutcome entry={entry} styles={styles} />;
    default:
      return <MedAdherenceOutcome entry={entry} styles={styles} />;
  }
};
