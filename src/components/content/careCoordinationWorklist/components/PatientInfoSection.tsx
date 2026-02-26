import React from "react";
import {
  Input,
  Label,
  Dropdown,
  Option,
} from "@fluentui/react-components";
import { Person20Regular } from "@fluentui/react-icons";
import { useAddPatientFormStyles } from "../AddPatientForm.styles";

interface PatientInfoSectionProps {
  mrn: string;
  onMrnChange: (value: string) => void;
  onMrnBlur: () => void;
  firstName: string;
  onFirstNameChange: (value: string) => void;
  lastName: string;
  onLastNameChange: (value: string) => void;
  gender: string;
  onGenderChange: (value: string) => void;
  languagePreference: string;
  onLanguagePreferenceChange: (value: string) => void;
}

export const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({
  mrn,
  onMrnChange,
  onMrnBlur,
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  gender,
  onGenderChange,
  languagePreference,
  onLanguagePreferenceChange,
}) => {
  const styles = useAddPatientFormStyles();

  return (
    <div>
      <div className={styles.sectionTitle}>
        <Person20Regular className={styles.sectionIcon} />
        Patient Information
      </div>
      <div className={styles.fieldGrid}>
        <div className={styles.fieldFullWidth}>
          <Label htmlFor="mrn" required>MRN</Label>
          <Input
            id="mrn"
            value={mrn}
            onChange={(_, d) => onMrnChange(d.value)}
            onBlur={onMrnBlur}
            placeholder="e.g. 100234"
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <Label htmlFor="firstName" required>First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(_, d) => onFirstNameChange(d.value)}
            placeholder="First name"
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <Label htmlFor="lastName" required>Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(_, d) => onLastNameChange(d.value)}
            placeholder="Last name"
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Dropdown
            id="gender"
            placeholder="Select gender"
            value={gender}
            onOptionSelect={(_, d) => onGenderChange(d.optionText ?? "")}
            style={{ width: "100%" }}
          >
            <Option>Male</Option>
            <Option>Female</Option>
            <Option>Other</Option>
          </Dropdown>
        </div>
        <div>
          <Label htmlFor="language">Language Preference</Label>
          <Dropdown
            id="language"
            placeholder="Select language"
            value={languagePreference}
            onOptionSelect={(_, d) => onLanguagePreferenceChange(d.optionText ?? "English")}
            style={{ width: "100%" }}
          >
            <Option>English</Option>
            <Option>Spanish</Option>
            <Option>French</Option>
            <Option>Mandarin</Option>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
