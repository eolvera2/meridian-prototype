import type { CareCoordinationWorklistItem, CallType } from "../CareCoordinationWorklist.types";
import type { FormMedicationEntry } from "../constants/campaignConfig";

export interface NewPatientFields {
  firstName: string;
  lastName: string;
  mrn: string;
  callType: CallType;
  reason: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  languagePreference: string;
  dischargeDate: string;
  dischargeInstructions: string;
  primaryDiagnosis: string;
  careTeam: string;
  medications: FormMedicationEntry[];
  allergies: string;
  medicalHistory: string;
  surgicalHistory: string;
  apptDate: string;
  apptTime: string;
  apptProvider: string;
  apptLocation: string;
  lastSystolic: string;
  lastDiastolic: string;
  homeMonitor: boolean;
  lifestyleNotes: string;
}

export function buildNewPatient(fields: NewPatientFields): CareCoordinationWorklistItem {
  const now = new Date();
  const age = fields.dateOfBirth
    ? Math.floor(
        (now.getTime() - new Date(fields.dateOfBirth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : 0;
  const dobFormatted = fields.dateOfBirth
    ? new Date(fields.dateOfBirth).toLocaleDateString("en-US", {
        month: "2-digit", day: "2-digit", year: "numeric",
      })
    : "";
  const demographics = `${fields.gender || "Unknown"}, ${age} YO, ${dobFormatted}, MRN${fields.mrn}`;
  const dischargeFmt = fields.dischargeDate
    ? new Date(fields.dischargeDate).toLocaleDateString("en-US", {
        month: "2-digit", day: "2-digit", year: "numeric",
      })
    : "";
  const todayShort = `${now.getMonth() + 1}/${now.getDate()}/${String(now.getFullYear()).slice(-2)}`;

  return {
    id: `ma-new-${Date.now()}`,
    name: `${fields.firstName} ${fields.lastName}`.trim(),
    mrn: fields.mrn.replace(/^MRN/i, ""),
    callType: fields.callType,
    reason: fields.reason,
    demographics,
    dischargeDate: dischargeFmt,
    languagePreference: fields.languagePreference,
    lastContactDate: todayShort,
    lastContactSummary: "New patient added to worklist.",
    status: "Scheduled",
    group: "contact-list",
    scheduled: true,
    dateOfBirth: dobFormatted,
    phone: fields.phone,
    email: fields.email,
    address: [fields.addressLine1, fields.addressLine2, `${fields.city}, ${fields.state} ${fields.zip}`].filter(Boolean).join(", "),
    dischargeInstructions: fields.dischargeInstructions,
    primaryDiagnosis: fields.primaryDiagnosis,
    careTeam: fields.careTeam,
    contactHistory: [],
    medications: fields.medications
      .filter((m) => m.name.trim())
      .map((m) => ({
        name: m.name, dose: m.dose, frequency: m.frequency, prescribedDate: todayShort,
      })),
    ...(fields.callType === "patient-intake" && {
      allergies: fields.allergies ? fields.allergies.split(",").map((a) => a.trim()).filter(Boolean) : [],
      medicalHistory: fields.medicalHistory,
      surgicalHistory: fields.surgicalHistory,
      upcomingAppointment: fields.apptDate ? {
        date: fields.apptDate, time: fields.apptTime,
        provider: fields.apptProvider, type: "Follow-up", location: fields.apptLocation,
      } : undefined,
    }),
    ...(fields.callType === "hypertension-management" && {
      bpReadings: fields.lastSystolic && fields.lastDiastolic ? [{
        date: todayShort,
        systolic: Number(fields.lastSystolic), diastolic: Number(fields.lastDiastolic),
        atGoal: Number(fields.lastSystolic) < 130 && Number(fields.lastDiastolic) < 80,
      }] : [],
      homeMonitor: fields.homeMonitor,
      lifestyleNotes: fields.lifestyleNotes,
    }),
  };
}
