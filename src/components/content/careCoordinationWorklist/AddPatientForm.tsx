import React, { useState, useCallback } from "react";
import { Button, Label } from "@fluentui/react-components";
import { Dismiss24Regular, Call20Regular, ChevronDown16Regular, ChevronRight16Regular } from "@fluentui/react-icons";
import { useAddPatientFormStyles } from "./AddPatientForm.styles";
import type { CareCoordinationWorklistItem, CallType } from "./CareCoordinationWorklist.types";
import type { FormMedicationEntry } from "./constants/campaignConfig";
import {
  pick, randInt, pad2,
  FIRST_NAMES, LAST_NAMES, CITIES, STATES, STREETS, PROVIDERS, NURSES, LOCATIONS,
  MED_ADHERENCE_REASONS, MED_ADHERENCE_DIAGNOSES, MED_ADHERENCE_INSTRUCTIONS, MED_ADHERENCE_SETS,
  INTAKE_REASONS, INTAKE_DIAGNOSES, INTAKE_ALLERGIES, INTAKE_MEDICAL_HISTORIES,
  INTAKE_SURGICAL_HISTORIES, INTAKE_APPT_TIMES,
  HTN_REASONS, HTN_DIAGNOSES, HTN_INSTRUCTIONS, HTN_LIFESTYLE_NOTES, HTN_MED_SETS,
  campaignOutcomes,
} from "./constants/campaignConfig";
import { PatientInfoSection } from "./components/PatientInfoSection";
import { CampaignSection } from "./components/CampaignSection";
import { CampaignSettings } from "./components/CampaignSettings";
import { ClinicalFieldsSection } from "./components/ClinicalFieldsSection";

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
  const handleMrnBlur = useCallback(() => {
    if (!mrn.trim()) return;
    if (firstName || lastName) return;

    const g = gender || pick(["Male", "Female"]);
    const fName = pick(FIRST_NAMES[g] ?? FIRST_NAMES["Male"]);
    const lName = pick(LAST_NAMES);
    const birthYear = randInt(1945, 2000);
    const birthMonth = randInt(1, 12);
    const birthDay = randInt(1, 28);
    const dob = `${birthYear}-${pad2(birthMonth)}-${pad2(birthDay)}`;
    const cityIdx = randInt(0, CITIES.length - 1);
    const provider = pick(PROVIDERS);
    const nurse = pick(NURSES);

    if (!gender) setGender(g);
    setFirstName(fName);
    setLastName(lName);
    setDateOfBirth(dob);
    setPhone(`(${randInt(200,999)}) ${randInt(200,999)}-${pad2(randInt(0,99))}${pad2(randInt(0,99))}`);
    setEmail(`${fName.toLowerCase()}.${lName.toLowerCase()}@email.com`);
    setAddressLine1(`${randInt(100,9999)} ${pick(STREETS)}`);
    setAddressLine2(Math.random() > 0.6 ? `Apt ${randInt(1,300)}` : "");
    setCity(CITIES[cityIdx]);
    setState(STATES[cityIdx]);
    setZip(String(randInt(10000, 99999)));
    setCareTeam(`${provider}, ${nurse}`);
    setLanguagePreference(pick(["English","English","English","Spanish"]));

    const dischDate = new Date();
    dischDate.setDate(dischDate.getDate() - randInt(1, 14));
    setDischargeDate(`${dischDate.getFullYear()}-${pad2(dischDate.getMonth()+1)}-${pad2(dischDate.getDate())}`);

    if (callType === "medication-adherence") {
      setReason(pick(MED_ADHERENCE_REASONS));
      setPrimaryDiagnosis(pick(MED_ADHERENCE_DIAGNOSES));
      setDischargeInstructions(pick(MED_ADHERENCE_INSTRUCTIONS));
      setMedications(pick(MED_ADHERENCE_SETS));
    } else if (callType === "patient-intake") {
      setReason(pick(INTAKE_REASONS));
      setPrimaryDiagnosis(pick(INTAKE_DIAGNOSES));
      setDischargeInstructions("");
      setAllergies(pick(INTAKE_ALLERGIES));
      setMedicalHistory(pick(INTAKE_MEDICAL_HISTORIES));
      setSurgicalHistory(pick(INTAKE_SURGICAL_HISTORIES));
      const appt = new Date();
      appt.setDate(appt.getDate() + randInt(3, 21));
      setApptDate(`${appt.getFullYear()}-${pad2(appt.getMonth()+1)}-${pad2(appt.getDate())}`);
      setApptTime(pick(INTAKE_APPT_TIMES));
      setApptProvider(provider);
      setApptLocation(pick(LOCATIONS));
    } else if (callType === "hypertension-management") {
      setReason(pick(HTN_REASONS));
      setPrimaryDiagnosis(pick(HTN_DIAGNOSES));
      setDischargeInstructions(pick(HTN_INSTRUCTIONS));
      setLastSystolic(String(randInt(128, 168)));
      setLastDiastolic(String(randInt(78, 102)));
      setHomeMonitor(Math.random() > 0.3);
      setLifestyleNotes(pick(HTN_LIFESTYLE_NOTES));
      setMedications(pick(HTN_MED_SETS));
    }
  }, [mrn, firstName, lastName, gender, callType]);

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
    const now = new Date();
    const age = dateOfBirth
      ? Math.floor(
          (now.getTime() - new Date(dateOfBirth).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        )
      : 0;
    const dobFormatted = dateOfBirth
      ? new Date(dateOfBirth).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
      : "";
    const demographics = `${gender || "Unknown"}, ${age} YO, ${dobFormatted}, MRN${mrn}`;
    const dischargeFmt = dischargeDate
      ? new Date(dischargeDate).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
      : "";
    const todayShort = `${now.getMonth() + 1}/${now.getDate()}/${String(now.getFullYear()).slice(-2)}`;

    const newPatient: CareCoordinationWorklistItem = {
      id: `ma-new-${Date.now()}`,
      name: `${firstName} ${lastName}`.trim(),
      mrn: mrn.replace(/^MRN/i, ""),
      callType,
      reason,
      demographics,
      dischargeDate: dischargeFmt,
      languagePreference,
      lastContactDate: todayShort,
      lastContactSummary: "New patient added to worklist.",
      status: "Scheduled",
      group: "contact-list",
      scheduled: true,
      dateOfBirth: dobFormatted,
      phone,
      email,
      address: [addressLine1, addressLine2, `${city}, ${state} ${zip}`].filter(Boolean).join(", "),
      dischargeInstructions,
      primaryDiagnosis,
      careTeam,
      contactHistory: [],
      medications: medications
        .filter((m) => m.name.trim())
        .map((m) => ({
          name: m.name,
          dose: m.dose,
          frequency: m.frequency,
          prescribedDate: todayShort,
        })),
      ...(callType === "patient-intake" && {
        allergies: allergies ? allergies.split(",").map((a) => a.trim()).filter(Boolean) : [],
        medicalHistory,
        surgicalHistory,
        upcomingAppointment: apptDate ? {
          date: apptDate,
          time: apptTime,
          provider: apptProvider,
          type: "Follow-up",
          location: apptLocation,
        } : undefined,
      }),
      ...(callType === "hypertension-management" && {
        bpReadings: lastSystolic && lastDiastolic ? [{
          date: todayShort,
          systolic: Number(lastSystolic),
          diastolic: Number(lastDiastolic),
          atGoal: Number(lastSystolic) < 130 && Number(lastDiastolic) < 80,
        }] : [],
        homeMonitor,
        lifestyleNotes,
      }),
    };

    onSave(newPatient);
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
