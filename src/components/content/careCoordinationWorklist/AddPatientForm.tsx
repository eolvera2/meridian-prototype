import React, { useState, useCallback, useMemo } from "react";
import { Button, Label } from "@fluentui/react-components";
import { Dismiss24Regular, Call20Regular, ChevronDown16Regular, ChevronRight16Regular } from "@fluentui/react-icons";
import { useAddPatientFormStyles } from "./AddPatientForm.styles";
import type { CallType, CareCoordinationWorklistItem } from "./CareCoordinationWorklist.types";
import type { FormMedicationEntry } from "./constants/campaignConfig";
import { campaignOutcomes } from "./constants/campaignConfig";
import { PatientInfoSection } from "./components/PatientInfoSection";
import { CampaignSection } from "./components/CampaignSection";
import { CampaignSettings } from "./components/CampaignSettings";
import { ClinicalFieldsSection } from "./components/ClinicalFieldsSection";
import { usePatientAutoFill } from "./hooks/usePatientAutoFill";
import { buildNewPatient } from "./utils/buildNewPatient";

interface AddPatientFormProps {
  onSave: (patient: CareCoordinationWorklistItem) => void;
  onCancel: () => void;
}

export const AddPatientForm: React.FC<AddPatientFormProps> = ({ onSave, onCancel }) => {
  const styles = useAddPatientFormStyles();

  // Call type
  const [callType, setCallType] = useState<CallType>("medication-adherence");
  const [campaignSettingsOpen, setCampaignSettingsOpen] = useState(false);

  // Patient info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [mrn, setMrn] = useState("");
  const [reason, setReason] = useState("");
  const [languagePreference, setLanguagePreference] = useState("English");

  // Demographics
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeInstructions, setDischargeInstructions] = useState("");
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState("");
  const [careTeam, setCareTeam] = useState("");

  // Medications
  const [medications, setMedications] = useState<FormMedicationEntry[]>([
    { name: "", dose: "", frequency: "" },
  ]);

  // Patient Intake fields
  const [allergies, setAllergies] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [surgicalHistory, setSurgicalHistory] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptProvider, setApptProvider] = useState("");
  const [apptLocation, setApptLocation] = useState("");

  // Hypertension fields
  const [lastSystolic, setLastSystolic] = useState("");
  const [lastDiastolic, setLastDiastolic] = useState("");
  const [homeMonitor, setHomeMonitor] = useState(false);
  const [lifestyleNotes, setLifestyleNotes] = useState("");

  // Campaign settings
  const [recurrenceInterval, setRecurrenceInterval] = useState(7);
  const [recurrenceUnit, setRecurrenceUnit] = useState("days");
  const [timingWindow, setTimingWindow] = useState("Weekdays (8 AM – 5 PM)");
  const [campaignStartDate, setCampaignStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [campaignEndDate, setCampaignEndDate] = useState("");
  const [retryCount, setRetryCount] = useState(3);
  const [retryIntervalHours, setRetryIntervalHours] = useState(2);
  const [leaveVoicemail, setLeaveVoicemail] = useState(true);
  const [liveTransfer, setLiveTransfer] = useState(false);
  const [daysBeforeAppt, setDaysBeforeAppt] = useState(2);

  // ── Auto-fill on MRN blur ──
  const autoFillSetters = useMemo(() => ({
    setFirstName, setLastName, setGender, setDateOfBirth,
    setPhone, setEmail, setAddressLine1, setAddressLine2,
    setCity, setState, setZip, setCareTeam, setLanguagePreference,
    setDischargeDate, setReason, setPrimaryDiagnosis, setDischargeInstructions,
    setMedications, setAllergies, setMedicalHistory, setSurgicalHistory,
    setApptDate, setApptTime, setApptProvider, setApptLocation,
    setLastSystolic, setLastDiastolic, setHomeMonitor, setLifestyleNotes,
  }), []);
  const handleMrnBlur = usePatientAutoFill(mrn, firstName, lastName, gender, callType, autoFillSetters);

  const addMedication = useCallback(() => {
    setMedications((prev) => [...prev, { name: "", dose: "", frequency: "" }]);
  }, []);

  const removeMedication = useCallback((index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateMedication = useCallback(
    (index: number, field: keyof FormMedicationEntry, value: string) => {
      setMedications((prev) =>
        prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
      );
    },
    []
  );

  const handleSave = () => {
    onSave(buildNewPatient({
      firstName, lastName, mrn, callType, reason, gender, dateOfBirth,
      phone, email, addressLine1, addressLine2, city, state, zip,
      languagePreference, dischargeDate, dischargeInstructions,
      primaryDiagnosis, careTeam, medications,
      allergies, medicalHistory, surgicalHistory,
      apptDate, apptTime, apptProvider, apptLocation,
      lastSystolic, lastDiastolic, homeMonitor, lifestyleNotes,
    }));
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerTitle}>Add New Patient</span>
          <Button
            appearance="subtle"
            icon={<Dismiss24Regular />}
            onClick={onCancel}
            aria-label="Close"
          />
        </div>

        {/* Body */}
        <div className={styles.body}>
          <PatientInfoSection
            mrn={mrn}
            onMrnChange={setMrn}
            onMrnBlur={handleMrnBlur}
            firstName={firstName}
            onFirstNameChange={setFirstName}
            lastName={lastName}
            onLastNameChange={setLastName}
            gender={gender}
            onGenderChange={setGender}
            languagePreference={languagePreference}
            onLanguagePreferenceChange={setLanguagePreference}
          />

          {/* Outreach Campaign */}
          <div>
            <div className={styles.sectionTitle}>
              <Call20Regular className={styles.sectionIcon} />
              Outreach Campaign
            </div>
            <div className={styles.fieldGrid}>
              <CampaignSection
                callType={callType}
                onCallTypeChange={setCallType}
                onLiveTransferChange={setLiveTransfer}
              />

              {/* Collapsible Campaign Settings */}
              <div className={styles.fieldFullWidth}>
                <div className={styles.collapsibleCard}>
                  <button
                    type="button"
                    onClick={() => setCampaignSettingsOpen(!campaignSettingsOpen)}
                    className={styles.collapsibleHeader}
                    aria-expanded={campaignSettingsOpen}
                  >
                    {campaignSettingsOpen ? <ChevronDown16Regular /> : <ChevronRight16Regular />}
                    Campaign Settings
                  </button>

                  {campaignSettingsOpen && (
                    <div className={styles.collapsibleContent}>
                      {/* What the system will collect */}
                      <div style={{ marginBottom: "16px" }}>
                        <Label className={styles.outcomesLabel}>What the system will collect</Label>
                        <div className={styles.outcomesGrid}>
                          {campaignOutcomes[callType].map((item, idx) => (
                            <span key={idx} className={styles.outcomeItem}>
                              • {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <CampaignSettings
                        callType={callType}
                        recurrenceInterval={recurrenceInterval}
                        onRecurrenceIntervalChange={setRecurrenceInterval}
                        recurrenceUnit={recurrenceUnit}
                        onRecurrenceUnitChange={setRecurrenceUnit}
                        timingWindow={timingWindow}
                        onTimingWindowChange={setTimingWindow}
                        campaignStartDate={campaignStartDate}
                        onCampaignStartDateChange={setCampaignStartDate}
                        campaignEndDate={campaignEndDate}
                        onCampaignEndDateChange={setCampaignEndDate}
                        retryCount={retryCount}
                        onRetryCountChange={setRetryCount}
                        retryIntervalHours={retryIntervalHours}
                        onRetryIntervalHoursChange={setRetryIntervalHours}
                        leaveVoicemail={leaveVoicemail}
                        onLeaveVoicemailChange={setLeaveVoicemail}
                        liveTransfer={liveTransfer}
                        onLiveTransferChange={setLiveTransfer}
                        daysBeforeAppt={daysBeforeAppt}
                        onDaysBeforeApptChange={setDaysBeforeAppt}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <ClinicalFieldsSection
            callType={callType}
            dateOfBirth={dateOfBirth}
            onDateOfBirthChange={setDateOfBirth}
            phone={phone}
            onPhoneChange={setPhone}
            email={email}
            onEmailChange={setEmail}
            dischargeDate={dischargeDate}
            onDischargeDateChange={setDischargeDate}
            addressLine1={addressLine1}
            onAddressLine1Change={setAddressLine1}
            addressLine2={addressLine2}
            onAddressLine2Change={setAddressLine2}
            city={city}
            onCityChange={setCity}
            state={state}
            onStateChange={setState}
            zip={zip}
            onZipChange={setZip}
            primaryDiagnosis={primaryDiagnosis}
            onPrimaryDiagnosisChange={setPrimaryDiagnosis}
            careTeam={careTeam}
            onCareTeamChange={setCareTeam}
            dischargeInstructions={dischargeInstructions}
            onDischargeInstructionsChange={setDischargeInstructions}
            medications={medications}
            onAddMedication={addMedication}
            onRemoveMedication={removeMedication}
            onUpdateMedication={updateMedication}
            reason={reason}
            onReasonChange={setReason}
            allergies={allergies}
            onAllergiesChange={setAllergies}
            medicalHistory={medicalHistory}
            onMedicalHistoryChange={setMedicalHistory}
            surgicalHistory={surgicalHistory}
            onSurgicalHistoryChange={setSurgicalHistory}
            apptDate={apptDate}
            onApptDateChange={setApptDate}
            apptTime={apptTime}
            onApptTimeChange={setApptTime}
            apptProvider={apptProvider}
            onApptProviderChange={setApptProvider}
            apptLocation={apptLocation}
            onApptLocationChange={setApptLocation}
            lastSystolic={lastSystolic}
            onLastSystolicChange={setLastSystolic}
            lastDiastolic={lastDiastolic}
            onLastDiastolicChange={setLastDiastolic}
            homeMonitor={homeMonitor}
            onHomeMonitorChange={setHomeMonitor}
            lifestyleNotes={lifestyleNotes}
            onLifestyleNotesChange={setLifestyleNotes}
          />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button appearance="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            icon={<Call20Regular />}
            onClick={handleSave}
            disabled={!mrn.trim() || !firstName.trim() || !lastName.trim()}
            className={styles.scheduleButton}
          >
            Schedule Call
          </Button>
        </div>
      </div>
    </div>
  );
};
