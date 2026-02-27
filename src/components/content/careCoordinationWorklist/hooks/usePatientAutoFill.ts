import { useCallback } from "react";
import type { CallType } from "../CareCoordinationWorklist.types";
import type { FormMedicationEntry } from "../constants/campaignConfig";
import {
  pick, randInt, pad2,
  FIRST_NAMES, LAST_NAMES, CITIES, STATES, STREETS, PROVIDERS, NURSES, LOCATIONS,
  MED_ADHERENCE_REASONS, MED_ADHERENCE_DIAGNOSES, MED_ADHERENCE_INSTRUCTIONS, MED_ADHERENCE_SETS,
  INTAKE_REASONS, INTAKE_DIAGNOSES, INTAKE_ALLERGIES, INTAKE_MEDICAL_HISTORIES,
  INTAKE_SURGICAL_HISTORIES, INTAKE_APPT_TIMES,
  HTN_REASONS, HTN_DIAGNOSES, HTN_INSTRUCTIONS, HTN_LIFESTYLE_NOTES, HTN_MED_SETS,
} from "../constants/campaignConfig";

interface AutoFillSetters {
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setGender: (v: string) => void;
  setDateOfBirth: (v: string) => void;
  setPhone: (v: string) => void;
  setEmail: (v: string) => void;
  setAddressLine1: (v: string) => void;
  setAddressLine2: (v: string) => void;
  setCity: (v: string) => void;
  setState: (v: string) => void;
  setZip: (v: string) => void;
  setCareTeam: (v: string) => void;
  setLanguagePreference: (v: string) => void;
  setDischargeDate: (v: string) => void;
  setReason: (v: string) => void;
  setPrimaryDiagnosis: (v: string) => void;
  setDischargeInstructions: (v: string) => void;
  setMedications: (v: FormMedicationEntry[]) => void;
  setAllergies: (v: string) => void;
  setMedicalHistory: (v: string) => void;
  setSurgicalHistory: (v: string) => void;
  setApptDate: (v: string) => void;
  setApptTime: (v: string) => void;
  setApptProvider: (v: string) => void;
  setApptLocation: (v: string) => void;
  setLastSystolic: (v: string) => void;
  setLastDiastolic: (v: string) => void;
  setHomeMonitor: (v: boolean) => void;
  setLifestyleNotes: (v: string) => void;
}

export function usePatientAutoFill(
  mrn: string,
  firstName: string,
  lastName: string,
  gender: string,
  callType: CallType,
  setters: AutoFillSetters,
) {
  return useCallback(() => {
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

    if (!gender) setters.setGender(g);
    setters.setFirstName(fName);
    setters.setLastName(lName);
    setters.setDateOfBirth(dob);
    setters.setPhone(`(${randInt(200,999)}) ${randInt(200,999)}-${pad2(randInt(0,99))}${pad2(randInt(0,99))}`);
    setters.setEmail(`${fName.toLowerCase()}.${lName.toLowerCase()}@email.com`);
    setters.setAddressLine1(`${randInt(100,9999)} ${pick(STREETS)}`);
    setters.setAddressLine2(Math.random() > 0.6 ? `Apt ${randInt(1,300)}` : "");
    setters.setCity(CITIES[cityIdx]);
    setters.setState(STATES[cityIdx]);
    setters.setZip(String(randInt(10000, 99999)));
    setters.setCareTeam(`${provider}, ${nurse}`);
    setters.setLanguagePreference(pick(["English","English","English","Spanish"]));

    const dischDate = new Date();
    dischDate.setDate(dischDate.getDate() - randInt(1, 14));
    setters.setDischargeDate(`${dischDate.getFullYear()}-${pad2(dischDate.getMonth()+1)}-${pad2(dischDate.getDate())}`);

    if (callType === "medication-adherence") {
      setters.setReason(pick(MED_ADHERENCE_REASONS));
      setters.setPrimaryDiagnosis(pick(MED_ADHERENCE_DIAGNOSES));
      setters.setDischargeInstructions(pick(MED_ADHERENCE_INSTRUCTIONS));
      setters.setMedications(pick(MED_ADHERENCE_SETS));
    } else if (callType === "patient-intake") {
      setters.setReason(pick(INTAKE_REASONS));
      setters.setPrimaryDiagnosis(pick(INTAKE_DIAGNOSES));
      setters.setDischargeInstructions("");
      setters.setAllergies(pick(INTAKE_ALLERGIES));
      setters.setMedicalHistory(pick(INTAKE_MEDICAL_HISTORIES));
      setters.setSurgicalHistory(pick(INTAKE_SURGICAL_HISTORIES));
      const appt = new Date();
      appt.setDate(appt.getDate() + randInt(3, 21));
      setters.setApptDate(`${appt.getFullYear()}-${pad2(appt.getMonth()+1)}-${pad2(appt.getDate())}`);
      setters.setApptTime(pick(INTAKE_APPT_TIMES));
      setters.setApptProvider(provider);
      setters.setApptLocation(pick(LOCATIONS));
    } else if (callType === "hypertension-management") {
      setters.setReason(pick(HTN_REASONS));
      setters.setPrimaryDiagnosis(pick(HTN_DIAGNOSES));
      setters.setDischargeInstructions(pick(HTN_INSTRUCTIONS));
      setters.setLastSystolic(String(randInt(128, 168)));
      setters.setLastDiastolic(String(randInt(78, 102)));
      setters.setHomeMonitor(Math.random() > 0.3);
      setters.setLifestyleNotes(pick(HTN_LIFESTYLE_NOTES));
      setters.setMedications(pick(HTN_MED_SETS));
    }
  }, [mrn, firstName, lastName, gender, callType, setters]);
}
