import React, { useState, useCallback } from "react";
import {
  Button,
  Input,
  Label,
  Textarea,
  Dropdown,
  Option,
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
import type { MedicationAdherenceWorklistItem } from "./MedicationAdherenceWorklist.types";

interface MedicationEntry {
  name: string;
  dose: string;
  frequency: string;
}

interface AddPatientFormProps {
  onSave: (patient: MedicationAdherenceWorklistItem) => void;
  onCancel: () => void;
}

export const AddPatientForm: React.FC<AddPatientFormProps> = ({ onSave, onCancel }) => {
  const styles = useAddPatientFormStyles();

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

    const newPatient: MedicationAdherenceWorklistItem = {
      id: `ma-new-${Date.now()}`,
      name: `${firstName} ${lastName}`.trim(),
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
                <Input id="mrn" value={mrn} onChange={(_, d) => setMrn(d.value)} placeholder="e.g. 100234" style={{ width: "100%" }} />
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

          {/* Medications */}
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
