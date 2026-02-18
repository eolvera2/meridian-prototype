import React, { useState, useCallback } from "react";
import {
  Button,
  Input,
  Label,
  Textarea,
  Dropdown,
  Option,
  Checkbox,
} from "@fluentui/react-components";
import {
  Dismiss24Regular,
  PersonAdd20Regular,
  Person20Regular,
  Add16Regular,
  Delete16Regular,
  Stethoscope20Regular,
  Pill20Regular,
} from "@fluentui/react-icons";
import { useAddPatientFormStyles } from "./AddPatientForm.styles";
import type { CareCoordinationWorklistItem, CallType } from "./CareCoordinationWorklist.types";
import { CALL_TYPE_LABELS } from "./CareCoordinationWorklist.types";

interface MedicationEntry {
  name: string;
  dose: string;
  frequency: string;
}

interface AddPatientFormProps {
  onSave: (patient: CareCoordinationWorklistItem) => void;
  onCancel: () => void;
}

export const AddPatientForm: React.FC<AddPatientFormProps> = ({ onSave, onCancel }) => {
  const styles = useAddPatientFormStyles();

  // Call type
  const [callType, setCallType] = useState<CallType>("medication-adherence");

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
  const [medications, setMedications] = useState<MedicationEntry[]>([
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

  // ── Auto-fill on MRN blur ──
  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const randInt = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
  const pad2 = (n: number) => String(n).padStart(2, "0");

  const handleMrnBlur = useCallback(() => {
    if (!mrn.trim()) return;
    // Only auto-fill if the core fields are still empty
    if (firstName || lastName) return;

    const firstNames = {
      Male: ["James","Robert","Michael","William","David","Richard","Thomas","Daniel","Matthew","Andrew"],
      Female: ["Mary","Patricia","Jennifer","Linda","Elizabeth","Barbara","Susan","Jessica","Sarah","Karen"],
      Other: ["Alex","Jordan","Taylor","Morgan","Casey","Riley","Quinn","Avery","Jamie","Dakota"],
    } as Record<string, string[]>;
    const lastNames = ["Johnson","Williams","Brown","Garcia","Martinez","Davis","Rodriguez","Anderson","Wilson","Taylor","Thomas","Moore","Jackson","Martin","Lee","Thompson","White","Harris","Clark","Lewis"];
    const cities = ["Seattle","Portland","Austin","Denver","Phoenix","Chicago","Boston","Atlanta","Dallas","Miami"];
    const states = ["WA","OR","TX","CO","AZ","IL","MA","GA","TX","FL"];
    const streets = ["Oak St","Maple Ave","Pine Dr","Cedar Ln","Elm Blvd","Birch Way","Walnut Ct","Cherry Rd"];
    const providers = ["Dr. Sarah Chen","Dr. Michael Patel","Dr. Emily Torres","Dr. James Wilson","Dr. Lisa Nguyen","Dr. Robert Kim"];
    const nurses = ["RN Adams","RN Baker","RN Clark","RN Davis"];
    const locations = ["Main Campus, Bldg A","West Clinic","East Medical Center","Downtown Office","Northside Health Center"];

    const g = gender || pick(["Male","Female"]);
    const fName = pick(firstNames[g] ?? firstNames["Male"]);
    const lName = pick(lastNames);
    const birthYear = randInt(1945, 2000);
    const birthMonth = randInt(1, 12);
    const birthDay = randInt(1, 28);
    const dob = `${birthYear}-${pad2(birthMonth)}-${pad2(birthDay)}`;
    const cityIdx = randInt(0, cities.length - 1);
    const provider = pick(providers);
    const nurse = pick(nurses);

    if (!gender) setGender(g);
    setFirstName(fName);
    setLastName(lName);
    setDateOfBirth(dob);
    setPhone(`(${randInt(200,999)}) ${randInt(200,999)}-${pad2(randInt(0,99))}${pad2(randInt(0,99))}`);
    setEmail(`${fName.toLowerCase()}.${lName.toLowerCase()}@email.com`);
    setAddressLine1(`${randInt(100,9999)} ${pick(streets)}`);
    setAddressLine2(Math.random() > 0.6 ? `Apt ${randInt(1,300)}` : "");
    setCity(cities[cityIdx]);
    setState(states[cityIdx]);
    setZip(String(randInt(10000, 99999)));
    setCareTeam(`${provider}, ${nurse}`);
    setLanguagePreference(pick(["English","English","English","Spanish"]));

    const dischDate = new Date();
    dischDate.setDate(dischDate.getDate() - randInt(1, 14));
    setDischargeDate(`${dischDate.getFullYear()}-${pad2(dischDate.getMonth()+1)}-${pad2(dischDate.getDate())}`);

    if (callType === "medication-adherence") {
      setReason(pick([
        "Post-discharge medication reconciliation",
        "14-day follow-up: medication compliance check",
        "New prescription adherence monitoring",
        "Medication side-effect follow-up",
        "Refill coordination and adherence review",
      ]));
      setPrimaryDiagnosis(pick(["Atrial Fibrillation","Type 2 Diabetes","Heart Failure","COPD","Hyperlipidemia","Chronic Kidney Disease"]));
      setDischargeInstructions(pick([
        "Continue all medications as prescribed. Follow up in 2 weeks.",
        "Avoid NSAIDs. Take blood thinner with food. Monitor for bruising.",
        "Low-sodium diet. Weigh daily. Call if weight gain >3 lbs in a day.",
        "Check blood glucose twice daily. Adjust insulin per sliding scale.",
      ]));
      const medSets: MedicationEntry[][] = [
        [{ name: "Warfarin", dose: "5 mg", frequency: "Once daily" },{ name: "Metoprolol", dose: "25 mg", frequency: "Twice daily" }],
        [{ name: "Lisinopril", dose: "10 mg", frequency: "Once daily" },{ name: "Atorvastatin", dose: "40 mg", frequency: "Once daily at bedtime" }],
        [{ name: "Metformin", dose: "500 mg", frequency: "Twice daily" },{ name: "Glipizide", dose: "5 mg", frequency: "Once daily before breakfast" }],
        [{ name: "Amlodipine", dose: "5 mg", frequency: "Once daily" },{ name: "Furosemide", dose: "20 mg", frequency: "Once daily" },{ name: "Potassium Chloride", dose: "20 mEq", frequency: "Once daily" }],
      ];
      setMedications(pick(medSets));
    } else if (callType === "patient-intake") {
      setReason(pick([
        "New patient intake and onboarding",
        "Pre-visit registration and history collection",
        "Transfer patient intake assessment",
        "Annual wellness visit intake",
      ]));
      setPrimaryDiagnosis(pick(["General Check-up","Asthma","Migraine","Anxiety Disorder","Low Back Pain","Hypothyroidism"]));
      setDischargeInstructions("");
      setAllergies(pick(["Penicillin, Sulfa","None known","Latex, Codeine","Aspirin","Shellfish, Iodine","Amoxicillin"]));
      setMedicalHistory(pick([
        "Hypertension (5 years), Seasonal allergies",
        "Type 2 Diabetes (3 years), Obesity",
        "Asthma since childhood, GERD",
        "No significant past medical history",
        "Hypothyroidism (10 years), Vitamin D deficiency",
      ]));
      setSurgicalHistory(pick(["Appendectomy (2015)","None","Cholecystectomy (2018)","C-section (2020)","Right knee arthroscopy (2017)"]));
      const appt = new Date();
      appt.setDate(appt.getDate() + randInt(3, 21));
      setApptDate(`${appt.getFullYear()}-${pad2(appt.getMonth()+1)}-${pad2(appt.getDate())}`);
      setApptTime(pick(["9:00 AM","10:30 AM","1:00 PM","2:30 PM","3:45 PM"]));
      setApptProvider(provider);
      setApptLocation(pick(locations));
    } else if (callType === "hypertension-management") {
      setReason(pick([
        "Quarterly BP management follow-up",
        "Uncontrolled hypertension monitoring",
        "New hypertension diagnosis — lifestyle coaching",
        "Post-medication adjustment BP check",
        "Home BP log review and medication titration",
      ]));
      setPrimaryDiagnosis(pick(["Essential Hypertension","Resistant Hypertension","Hypertension with CKD","Hypertensive Heart Disease"]));
      setDischargeInstructions(pick([
        "Low-sodium DASH diet. Exercise 30 min/day. Monitor BP daily.",
        "Reduce caffeine. Take medication at same time each day.",
        "Limit alcohol. Record BP readings twice daily in log.",
      ]));
      setLastSystolic(String(randInt(128, 168)));
      setLastDiastolic(String(randInt(78, 102)));
      setHomeMonitor(Math.random() > 0.3);
      setLifestyleNotes(pick([
        "Sedentary lifestyle. High sodium diet. Non-smoker.",
        "Walks 20min daily. Moderate alcohol use. Former smoker.",
        "Active lifestyle. Low-salt diet. No tobacco or alcohol.",
        "Limited exercise due to knee pain. Smokes 1/2 pack/day.",
        "DASH diet adherent. Exercises 4x/week. No substances.",
      ]));
      const medSets: MedicationEntry[][] = [
        [{ name: "Amlodipine", dose: "10 mg", frequency: "Once daily" },{ name: "Lisinopril", dose: "20 mg", frequency: "Once daily" }],
        [{ name: "Losartan", dose: "50 mg", frequency: "Once daily" },{ name: "Hydrochlorothiazide", dose: "25 mg", frequency: "Once daily" }],
        [{ name: "Metoprolol", dose: "50 mg", frequency: "Twice daily" }],
      ];
      setMedications(pick(medSets));
    }
  }, [mrn, firstName, lastName, gender, callType]);

  const addMedication = useCallback(() => {
    setMedications((prev) => [...prev, { name: "", dose: "", frequency: "" }]);
  }, []);

  const removeMedication = useCallback((index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateMedication = useCallback(
    (index: number, field: keyof MedicationEntry, value: string) => {
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
      callType,
      reason,
      demographics,
      dischargeDate: dischargeFmt,
      languagePreference,
      lastContactDate: todayShort,
      lastContactSummary: "New patient added to worklist.",
      status: "Queued",
      group: "queue",
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
          {/* Call Type Selector */}
          <div>
            <div className={styles.sectionTitle}>
              Call Type
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldFullWidth}>
                <Label htmlFor="callType" required>Call Type</Label>
                <Dropdown
                  id="callType"
                  value={CALL_TYPE_LABELS[callType]}
                  onOptionSelect={(_, d) => setCallType((d.optionValue ?? "medication-adherence") as CallType)}
                  style={{ width: "100%" }}
                >
                  <Option value="medication-adherence">{CALL_TYPE_LABELS["medication-adherence"]}</Option>
                  <Option value="patient-intake">{CALL_TYPE_LABELS["patient-intake"]}</Option>
                  <Option value="hypertension-management">{CALL_TYPE_LABELS["hypertension-management"]}</Option>
                </Dropdown>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div>
            <div className={styles.sectionTitle}>
              <Person20Regular className={styles.sectionIcon} />
              Patient Information
            </div>
            <div className={styles.fieldGrid}>
              <div>
                <Label htmlFor="firstName" required>First Name</Label>
                <Input id="firstName" value={firstName} onChange={(_, d) => setFirstName(d.value)} placeholder="First name" style={{ width: "100%" }} />
              </div>
              <div>
                <Label htmlFor="lastName" required>Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(_, d) => setLastName(d.value)} placeholder="Last name" style={{ width: "100%" }} />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Dropdown id="gender" placeholder="Select gender" value={gender} onOptionSelect={(_, d) => setGender(d.optionText ?? "")} style={{ width: "100%" }}>
                  <Option>Male</Option>
                  <Option>Female</Option>
                  <Option>Other</Option>
                </Dropdown>
              </div>
              <div>
                <Label htmlFor="mrn" required>MRN</Label>
                <Input id="mrn" value={mrn} onChange={(_, d) => setMrn(d.value)} onBlur={handleMrnBlur} placeholder="e.g. 100234" style={{ width: "100%" }} />
              </div>
              <div>
                <Label htmlFor="language">Language Preference</Label>
                <Dropdown id="language" placeholder="Select language" value={languagePreference} onOptionSelect={(_, d) => setLanguagePreference(d.optionText ?? "English")} style={{ width: "100%" }}>
                  <Option>English</Option>
                  <Option>Spanish</Option>
                  <Option>French</Option>
                  <Option>Mandarin</Option>
                </Dropdown>
              </div>
              <div className={styles.fieldFullWidth}>
                <Label htmlFor="reason" required>Reason for Visit</Label>
                <Textarea id="reason" value={reason} onChange={(_, d) => setReason(d.value)} placeholder="Brief reason for visit" resize="vertical" style={{ width: "100%" }} />
              </div>
            </div>
          </div>

          {/* Demographics */}
          <div>
            <div className={styles.sectionTitle}>
              <Stethoscope20Regular className={styles.sectionIcon} />
              Demographics &amp; Clinical
            </div>
            <div className={styles.fieldGrid}>
              <div>
                <Label htmlFor="dob" required>Date of Birth</Label>
                <Input id="dob" type="date" value={dateOfBirth} onChange={(_, d) => setDateOfBirth(d.value)} style={{ width: "100%" }} />
              </div>
              <div>
                <Label htmlFor="phone" required>Phone</Label>
                <Input id="phone" value={phone} onChange={(_, d) => setPhone(d.value)} placeholder="(555) 000-0000" style={{ width: "100%" }} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(_, d) => setEmail(d.value)} placeholder="patient@email.com" style={{ width: "100%" }} />
              </div>
              <div>
                <Label htmlFor="dischargeDate">Discharge Date</Label>
                <Input id="dischargeDate" type="date" value={dischargeDate} onChange={(_, d) => setDischargeDate(d.value)} style={{ width: "100%" }} />
              </div>
              <div className={styles.fieldFullWidth}>
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input id="addressLine1" value={addressLine1} onChange={(_, d) => setAddressLine1(d.value)} placeholder="Street number and name" style={{ width: "100%" }} />
              </div>
              <div className={styles.fieldFullWidth}>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input id="addressLine2" value={addressLine2} onChange={(_, d) => setAddressLine2(d.value)} placeholder="Apartment, suite, unit, floor, building (optional)" style={{ width: "100%" }} />
              </div>
              <div className={styles.addressRow}>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={city} onChange={(_, d) => setCity(d.value)} placeholder="City" style={{ width: "100%" }} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={state} onChange={(_, d) => setState(d.value)} placeholder="State" style={{ width: "100%" }} />
                </div>
                <div>
                  <Label htmlFor="zip">Zip</Label>
                  <Input id="zip" value={zip} onChange={(_, d) => setZip(d.value)} placeholder="Zip code" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
                <Input id="primaryDiagnosis" value={primaryDiagnosis} onChange={(_, d) => setPrimaryDiagnosis(d.value)} placeholder="e.g. Atrial Fibrillation" style={{ width: "100%" }} />
              </div>
              <div>
                <Label htmlFor="careTeam">Care Team</Label>
                <Input id="careTeam" value={careTeam} onChange={(_, d) => setCareTeam(d.value)} placeholder="e.g. Dr. Smith, RN Jones" style={{ width: "100%" }} />
              </div>
              <div className={styles.fieldFullWidth}>
                <Label htmlFor="dischargeInstructions">Discharge Instructions</Label>
                <Textarea id="dischargeInstructions" value={dischargeInstructions} onChange={(_, d) => setDischargeInstructions(d.value)} placeholder="Discharge instructions" resize="vertical" style={{ width: "100%" }} />
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
                      onChange={(_, d) => updateMedication(idx, "name", d.value)}
                      placeholder="e.g. Warfarin"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input
                      value={med.dose}
                      onChange={(_, d) => updateMedication(idx, "dose", d.value)}
                      placeholder="e.g. 5mg"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Input
                      value={med.frequency}
                      onChange={(_, d) => updateMedication(idx, "frequency", d.value)}
                      placeholder="e.g. Once daily"
                      style={{ width: "100%" }}
                    />
                  </div>
                  {medications.length > 1 && (
                    <Button
                      appearance="subtle"
                      icon={<Delete16Regular />}
                      className={styles.removeBtn}
                      onClick={() => removeMedication(idx)}
                      aria-label="Remove medication"
                    />
                  )}
                </div>
              ))}
              <Button
                appearance="subtle"
                icon={<Add16Regular />}
                className={styles.addMedButton}
                onClick={addMedication}
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
                <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                <Input id="allergies" value={allergies} onChange={(_, d) => setAllergies(d.value)} placeholder="e.g. Penicillin, Sulfa" style={{ width: "100%" }} />
              </div>
              <div className={styles.fieldFullWidth}>
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea id="medicalHistory" value={medicalHistory} onChange={(_, d) => setMedicalHistory(d.value)} placeholder="Relevant medical history" resize="vertical" style={{ width: "100%" }} />
              </div>
              <div className={styles.fieldFullWidth}>
                <Label htmlFor="surgicalHistory">Surgical History</Label>
                <Textarea id="surgicalHistory" value={surgicalHistory} onChange={(_, d) => setSurgicalHistory(d.value)} placeholder="Previous surgeries" resize="vertical" style={{ width: "100%" }} />
              </div>
              <div>
                <Label htmlFor="apptDate">Upcoming Appointment Date</Label>
                <Input id="apptDate" type="date" value={apptDate} onChange={(_, d) => setApptDate(d.value)} style={{ width: "100%" }} />
              </div>
              <div>
                <Label htmlFor="apptTime">Appointment Time</Label>
                <Input id="apptTime" value={apptTime} onChange={(_, d) => setApptTime(d.value)} placeholder="e.g. 10:00 AM" style={{ width: "100%" }} />
              </div>
              <div>
                <Label htmlFor="apptProvider">Provider</Label>
                <Input id="apptProvider" value={apptProvider} onChange={(_, d) => setApptProvider(d.value)} placeholder="e.g. Dr. Smith" style={{ width: "100%" }} />
              </div>
              <div>
                <Label htmlFor="apptLocation">Location</Label>
                <Input id="apptLocation" value={apptLocation} onChange={(_, d) => setApptLocation(d.value)} placeholder="e.g. Main Campus, Bldg A" style={{ width: "100%" }} />
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
                <Input id="lastSystolic" type="number" value={lastSystolic} onChange={(_, d) => setLastSystolic(d.value)} placeholder="e.g. 145" style={{ width: "100%" }} />
              </div>
              <div>
                <Label htmlFor="lastDiastolic">Last Diastolic (mmHg)</Label>
                <Input id="lastDiastolic" type="number" value={lastDiastolic} onChange={(_, d) => setLastDiastolic(d.value)} placeholder="e.g. 92" style={{ width: "100%" }} />
              </div>
              <div className={styles.fieldFullWidth}>
                <Checkbox
                  checked={homeMonitor}
                  onChange={(_, d) => setHomeMonitor(!!d.checked)}
                  label="Patient has a home BP monitor"
                />
              </div>
              <div className={styles.fieldFullWidth}>
                <Label htmlFor="lifestyleNotes">Lifestyle Notes</Label>
                <Textarea id="lifestyleNotes" value={lifestyleNotes} onChange={(_, d) => setLifestyleNotes(d.value)} placeholder="Diet, exercise, smoking status…" resize="vertical" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button appearance="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            icon={<PersonAdd20Regular />}
            onClick={handleSave}
            disabled={!firstName.trim() || !lastName.trim()}
          >
            Save Patient
          </Button>
        </div>
      </div>
    </div>
  );
};
