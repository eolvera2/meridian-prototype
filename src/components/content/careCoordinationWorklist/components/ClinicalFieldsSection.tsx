import React from "react";
import {
  Button,
  Input,
  Label,
  Textarea,
  Checkbox,
} from "@fluentui/react-components";
import {
  Add16Regular,
  Delete16Regular,
  Stethoscope20Regular,
  Pill20Regular,
} from "@fluentui/react-icons";
import { useAddPatientFormStyles } from "../AddPatientForm.styles";
import type { CallType } from "../CareCoordinationWorklist.types";
import type { FormMedicationEntry } from "../constants/campaignConfig";

interface ClinicalFieldsSectionProps {
  callType: CallType;
  // Demographics & Clinical
  dateOfBirth: string;
  onDateOfBirthChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  dischargeDate: string;
  onDischargeDateChange: (value: string) => void;
  addressLine1: string;
  onAddressLine1Change: (value: string) => void;
  addressLine2: string;
  onAddressLine2Change: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  state: string;
  onStateChange: (value: string) => void;
  zip: string;
  onZipChange: (value: string) => void;
  primaryDiagnosis: string;
  onPrimaryDiagnosisChange: (value: string) => void;
  careTeam: string;
  onCareTeamChange: (value: string) => void;
  dischargeInstructions: string;
  onDischargeInstructionsChange: (value: string) => void;
  // Medications
  medications: FormMedicationEntry[];
  onAddMedication: () => void;
  onRemoveMedication: (index: number) => void;
  onUpdateMedication: (index: number, field: keyof FormMedicationEntry, value: string) => void;
  // Patient Intake
  reason: string;
  onReasonChange: (value: string) => void;
  allergies: string;
  onAllergiesChange: (value: string) => void;
  medicalHistory: string;
  onMedicalHistoryChange: (value: string) => void;
  surgicalHistory: string;
  onSurgicalHistoryChange: (value: string) => void;
  apptDate: string;
  onApptDateChange: (value: string) => void;
  apptTime: string;
  onApptTimeChange: (value: string) => void;
  apptProvider: string;
  onApptProviderChange: (value: string) => void;
  apptLocation: string;
  onApptLocationChange: (value: string) => void;
  // Hypertension
  lastSystolic: string;
  onLastSystolicChange: (value: string) => void;
  lastDiastolic: string;
  onLastDiastolicChange: (value: string) => void;
  homeMonitor: boolean;
  onHomeMonitorChange: (value: boolean) => void;
  lifestyleNotes: string;
  onLifestyleNotesChange: (value: string) => void;
}

export const ClinicalFieldsSection: React.FC<ClinicalFieldsSectionProps> = ({
  callType,
  dateOfBirth,
  onDateOfBirthChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
  dischargeDate,
  onDischargeDateChange,
  addressLine1,
  onAddressLine1Change,
  addressLine2,
  onAddressLine2Change,
  city,
  onCityChange,
  state,
  onStateChange,
  zip,
  onZipChange,
  primaryDiagnosis,
  onPrimaryDiagnosisChange,
  careTeam,
  onCareTeamChange,
  dischargeInstructions,
  onDischargeInstructionsChange,
  medications,
  onAddMedication,
  onRemoveMedication,
  onUpdateMedication,
  reason,
  onReasonChange,
  allergies,
  onAllergiesChange,
  medicalHistory,
  onMedicalHistoryChange,
  surgicalHistory,
  onSurgicalHistoryChange,
  apptDate,
  onApptDateChange,
  apptTime,
  onApptTimeChange,
  apptProvider,
  onApptProviderChange,
  apptLocation,
  onApptLocationChange,
  lastSystolic,
  onLastSystolicChange,
  lastDiastolic,
  onLastDiastolicChange,
  homeMonitor,
  onHomeMonitorChange,
  lifestyleNotes,
  onLifestyleNotesChange,
}) => {
  const styles = useAddPatientFormStyles();

  return (
    <>
      {/* Demographics & Clinical */}
      <div>
        <div className={styles.sectionTitle}>
          <Stethoscope20Regular className={styles.sectionIcon} />
          Demographics &amp; Clinical
        </div>
        <div className={styles.fieldGrid}>
          <div>
            <Label htmlFor="dob" required>Date of Birth</Label>
            <Input id="dob" type="date" value={dateOfBirth} onChange={(_, d) => onDateOfBirthChange(d.value)} style={{ width: "100%" }} />
          </div>
          <div>
            <Label htmlFor="phone" required>Phone</Label>
            <Input id="phone" value={phone} onChange={(_, d) => onPhoneChange(d.value)} placeholder="(555) 000-0000" style={{ width: "100%" }} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(_, d) => onEmailChange(d.value)} placeholder="patient@email.com" style={{ width: "100%" }} />
          </div>
          <div>
            <Label htmlFor="dischargeDate">Discharge Date</Label>
            <Input id="dischargeDate" type="date" value={dischargeDate} onChange={(_, d) => onDischargeDateChange(d.value)} style={{ width: "100%" }} />
          </div>
          <div className={styles.fieldFullWidth}>
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input id="addressLine1" value={addressLine1} onChange={(_, d) => onAddressLine1Change(d.value)} placeholder="Street number and name" style={{ width: "100%" }} />
          </div>
          <div className={styles.fieldFullWidth}>
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input id="addressLine2" value={addressLine2} onChange={(_, d) => onAddressLine2Change(d.value)} placeholder="Apartment, suite, unit, floor, building (optional)" style={{ width: "100%" }} />
          </div>
          <div className={styles.addressRow}>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" value={city} onChange={(_, d) => onCityChange(d.value)} placeholder="City" style={{ width: "100%" }} />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" value={state} onChange={(_, d) => onStateChange(d.value)} placeholder="State" style={{ width: "100%" }} />
            </div>
            <div>
              <Label htmlFor="zip">Zip</Label>
              <Input id="zip" value={zip} onChange={(_, d) => onZipChange(d.value)} placeholder="Zip code" style={{ width: "100%" }} />
            </div>
          </div>
          <div>
            <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
            <Input id="primaryDiagnosis" value={primaryDiagnosis} onChange={(_, d) => onPrimaryDiagnosisChange(d.value)} placeholder="e.g. Atrial Fibrillation" style={{ width: "100%" }} />
          </div>
          <div>
            <Label htmlFor="careTeam">Care Team</Label>
            <Input id="careTeam" value={careTeam} onChange={(_, d) => onCareTeamChange(d.value)} placeholder="e.g. Dr. Smith, RN Jones" style={{ width: "100%" }} />
          </div>
          <div className={styles.fieldFullWidth}>
            <Label htmlFor="dischargeInstructions">Discharge Instructions</Label>
            <Textarea id="dischargeInstructions" value={dischargeInstructions} onChange={(_, d) => onDischargeInstructionsChange(d.value)} placeholder="Discharge instructions" resize="vertical" style={{ width: "100%" }} />
          </div>
        </div>
      </div>

      {/* Medications — show only for Med Adherence */}
      {callType === "medication-adherence" && (
      <div>
        <div className={styles.sectionTitle}>
          <Pill20Regular className={styles.sectionIcon} />
          Medications
        </div>
        <div className={styles.medicationList}>
          {medications.map((med, idx) => (
            <div key={idx} className={medications.length > 1 ? styles.medicationRowWithAction : styles.medicationRow}>
              <div>
                <Label>Medication Name</Label>
                <Input
                  value={med.name}
                  onChange={(_, d) => onUpdateMedication(idx, "name", d.value)}
                  placeholder="e.g. Warfarin"
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <Label>Dosage</Label>
                <Input
                  value={med.dose}
                  onChange={(_, d) => onUpdateMedication(idx, "dose", d.value)}
                  placeholder="e.g. 5mg"
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <Label>Frequency</Label>
                <Input
                  value={med.frequency}
                  onChange={(_, d) => onUpdateMedication(idx, "frequency", d.value)}
                  placeholder="e.g. Once daily"
                  style={{ width: "100%" }}
                />
              </div>
              {medications.length > 1 && (
                <Button
                  appearance="subtle"
                  icon={<Delete16Regular />}
                  className={styles.removeBtn}
                  onClick={() => onRemoveMedication(idx)}
                  aria-label="Remove medication"
                />
              )}
            </div>
          ))}
          <Button
            appearance="subtle"
            icon={<Add16Regular />}
            className={styles.addMedButton}
            onClick={onAddMedication}
          >
            Add Medication
          </Button>
        </div>
      </div>
      )}

      {/* Patient Intake sections */}
      {callType === "patient-intake" && (
      <div>
        <div className={styles.sectionTitle}>
          <Stethoscope20Regular className={styles.sectionIcon} />
          Intake Details
        </div>
        <div className={styles.fieldGrid}>
          <div className={styles.fieldFullWidth}>
            <Label htmlFor="reason" required>Reason for Visit</Label>
            <Textarea id="reason" value={reason} onChange={(_, d) => onReasonChange(d.value)} placeholder="Brief reason for visit" resize="vertical" style={{ width: "100%" }} />
          </div>
          <div className={styles.fieldFullWidth}>
            <Label htmlFor="allergies">Allergies (comma-separated)</Label>
            <Input id="allergies" value={allergies} onChange={(_, d) => onAllergiesChange(d.value)} placeholder="e.g. Penicillin, Sulfa" style={{ width: "100%" }} />
          </div>
          <div className={styles.fieldFullWidth}>
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea id="medicalHistory" value={medicalHistory} onChange={(_, d) => onMedicalHistoryChange(d.value)} placeholder="Relevant medical history" resize="vertical" style={{ width: "100%" }} />
          </div>
          <div className={styles.fieldFullWidth}>
            <Label htmlFor="surgicalHistory">Surgical History</Label>
            <Textarea id="surgicalHistory" value={surgicalHistory} onChange={(_, d) => onSurgicalHistoryChange(d.value)} placeholder="Previous surgeries" resize="vertical" style={{ width: "100%" }} />
          </div>
          <div>
            <Label htmlFor="apptDate">Upcoming Appointment Date</Label>
            <Input id="apptDate" type="date" value={apptDate} onChange={(_, d) => onApptDateChange(d.value)} style={{ width: "100%" }} />
          </div>
          <div>
            <Label htmlFor="apptTime">Appointment Time</Label>
            <Input id="apptTime" value={apptTime} onChange={(_, d) => onApptTimeChange(d.value)} placeholder="e.g. 10:00 AM" style={{ width: "100%" }} />
          </div>
          <div>
            <Label htmlFor="apptProvider">Provider</Label>
            <Input id="apptProvider" value={apptProvider} onChange={(_, d) => onApptProviderChange(d.value)} placeholder="e.g. Dr. Smith" style={{ width: "100%" }} />
          </div>
          <div>
            <Label htmlFor="apptLocation">Location</Label>
            <Input id="apptLocation" value={apptLocation} onChange={(_, d) => onApptLocationChange(d.value)} placeholder="e.g. Main Campus, Bldg A" style={{ width: "100%" }} />
          </div>
        </div>
      </div>
      )}

      {/* Hypertension fields */}
      {callType === "hypertension-management" && (
      <div>
        <div className={styles.sectionTitle}>
          <Stethoscope20Regular className={styles.sectionIcon} />
          Blood Pressure &amp; Lifestyle
        </div>
        <div className={styles.fieldGrid}>
          <div>
            <Label htmlFor="lastSystolic">Last Systolic (mmHg)</Label>
            <Input id="lastSystolic" type="number" value={lastSystolic} onChange={(_, d) => onLastSystolicChange(d.value)} placeholder="e.g. 145" style={{ width: "100%" }} />
          </div>
          <div>
            <Label htmlFor="lastDiastolic">Last Diastolic (mmHg)</Label>
            <Input id="lastDiastolic" type="number" value={lastDiastolic} onChange={(_, d) => onLastDiastolicChange(d.value)} placeholder="e.g. 92" style={{ width: "100%" }} />
          </div>
          <div className={styles.fieldFullWidth}>
            <Checkbox
              checked={homeMonitor}
              onChange={(_, d) => onHomeMonitorChange(!!d.checked)}
              label="Patient has a home BP monitor"
            />
          </div>
          <div className={styles.fieldFullWidth}>
            <Label htmlFor="lifestyleNotes">Lifestyle Notes</Label>
            <Textarea id="lifestyleNotes" value={lifestyleNotes} onChange={(_, d) => onLifestyleNotesChange(d.value)} placeholder="Diet, exercise, smoking status…" resize="vertical" style={{ width: "100%" }} />
          </div>
        </div>
      </div>
      )}
    </>
  );
};
