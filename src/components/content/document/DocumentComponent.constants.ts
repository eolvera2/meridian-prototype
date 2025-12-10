/**
 * DocumentComponent Constants
 *
 * Contains dictation content mappings and helper functions for document content.
 */

// ============================================================================
// Dictation Content Mapping
// ============================================================================

/**
 * Maps section titles to their pre-defined dictation content.
 * Used for simulating AI-generated text during dictation mode.
 */
export const DICTATION_CONTENT_MAP: Record<string, string> = {
  "History of Present Illness":
    "Patient presents with a three-day history of persistent cough and mild fever. Reports experiencing increased fatigue and occasional shortness of breath during physical activity. Denies chest pain or difficulty breathing at rest. Has been taking over-the-counter medication with minimal relief. No recent travel or known sick contacts reported.",
  "Physical Exam":
    "Vital signs: Temperature 99.2°F, Blood pressure 128/82 mmHg, Heart rate 78 bpm, Respiratory rate 16/min, SpO2 97% on room air. General: Alert and oriented, no acute distress. HEENT: Oropharynx mildly erythematous, no exudates. Neck: Supple, no lymphadenopathy. Lungs: Scattered rhonchi bilaterally, no wheezes. Heart: Regular rate and rhythm, no murmurs. Abdomen: Soft, non-tender.",
  Results:
    "CBC: WBC 11.2 (mildly elevated), Hgb 14.1, Plt 245. BMP within normal limits. Chest X-ray shows mild peribronchial thickening, no consolidation or effusion. Rapid strep negative. COVID-19 PCR pending.",
  "Assessment & Plan":
    "Assessment: Acute bronchitis, likely viral etiology. Plan: 1) Supportive care with rest and hydration. 2) Guaifenesin 400mg every 4 hours as needed for cough. 3) Acetaminophen 650mg every 6 hours as needed for fever. 4) Return if symptoms worsen or persist beyond 10 days. 5) Follow up on COVID results.",
  "Referral Note":
    "Dear Colleague, I am referring this patient for specialist evaluation. The patient has been experiencing symptoms that warrant further investigation by your expertise. Please see the attached clinical documentation for complete history and examination findings. Thank you for your consultation.",
  "Summary Note":
    "Thank you for visiting our clinic today. Your diagnosis is acute bronchitis. Please take your medications as prescribed, get plenty of rest, and drink fluids. Watch for warning signs such as high fever, difficulty breathing, or chest pain. Follow up in 7-10 days if symptoms persist. Contact us immediately if your condition worsens.",
  Note: "Patient presents for routine wellness examination. Reports overall good health with no acute concerns. Has been maintaining regular exercise 3 times per week and following a balanced diet. Denies chest pain, shortness of breath, or palpitations. Sleep quality is adequate at 7-8 hours per night. Current medications include lisinopril 10 mg daily for hypertension with good BP control. No medication side effects reported. Vitals today: BP 128/78, HR 72, SpO2 98% on room air. Physical exam unremarkable. Discussed preventive health measures including colorectal cancer screening and flu vaccination. Follow-up scheduled in one year for annual wellness exam.",
  "Well visit - Note":
    "Patient presents for routine well visit. She reports feeling well overall with no acute concerns. Has been maintaining a healthy lifestyle with regular exercise 3 times per week and following a balanced diet. Denies chest pain, shortness of breath, palpitations, or syncope. No recent weight changes. Sleep is adequate at 7-8 hours per night. Stress levels are manageable. Vitals: BP 122/78 mmHg, HR 68 bpm, Temp 98.4°F, SpO2 99% on room air. General: Well-appearing, in no acute distress. Cardiovascular: Regular rate and rhythm, no murmurs. Lungs: Clear to auscultation bilaterally. Labs reviewed - lipid panel and CBC within normal limits. Preventive care discussed including flu vaccine and skin cancer prevention. Continue current lifestyle habits. Return in 1 year or sooner if concerns arise.",
  "Annual - Note":
    "Patient presents for annual physical examination. He reports overall good health with well-controlled chronic conditions. Hypertension has been stable on current medications with home BP readings averaging 130/82 mmHg. Reports compliance with medication regimen and dietary modifications. Exercises by walking 30 minutes daily. Denies any new symptoms including chest pain, dyspnea, dizziness, or visual changes. Vitals: BP 132/84 mmHg, HR 74 bpm, SpO2 98% on room air. Physical exam unremarkable. Labs: HbA1c 5.8% indicating prediabetes, LDL 128 slightly elevated, Vitamin D 28 low-normal. Assessment: 1) Hypertension - controlled, continue current regimen. 2) Prediabetes - lifestyle modifications, recheck in 3 months. 3) Borderline hyperlipidemia - trial lifestyle changes. Flu vaccine and tetanus booster administered today. Follow up in 3 months for lab recheck.",
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Gets the dictation content for a given section title.
 * Falls back to a generic message if the section is not found.
 */
export const getDictationContentForSection = (sectionTitle: string): string => {
  return (
    DICTATION_CONTENT_MAP[sectionTitle] ||
    `Content for ${sectionTitle} section.`
  );
};

// ============================================================================
// Order Dictation Content
// ============================================================================

/**
 * Default order items to add during order dictation simulation.
 */
export const ORDER_DICTATION_ITEMS = [
  "Order thyroid function tests.",
  "Prescribe levothyroxine 50mcg daily.",
  "Schedule follow-up in 6 weeks for lab review.",
];

// ============================================================================
// Referral Letter Template
// ============================================================================

/**
 * Template content for referral letter generation.
 */
export const REFERRAL_LETTER_TEMPLATE = {
  name: "Referral Letter",
  type: "Letter",
  sections: [
    {
      id: "referral-note",
      title: "Referral Note",
      content:
        "Dear Colleague,\n\nI am referring [Patient Name] for specialist evaluation regarding [Chief Complaint]. The patient has been experiencing [symptoms] that warrant further investigation by your expertise.\n\nPlease see the attached clinical documentation for complete history and examination findings.\n\nThank you for your consultation.\n\nSincerely,\n[Provider Name]",
      checked: true,
    },
  ],
};

// ============================================================================
// Document Factory Functions
// ============================================================================

/**
 * Creates a new document based on the note type.
 * @param noteType The type of note/document to create
 * @param index Index for unique ID generation
 * @param today Formatted date string
 * @returns A new DocumentItem
 */
export const createDocumentFromType = (
  noteType: string,
  index: number,
  today: string
): {
  id: string;
  name: string;
  created: string;
  type: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
    checked: boolean;
  }>;
  isExpanded: boolean;
} => {
  const timestamp = Date.now();

  switch (noteType) {
    case "Well visit":
      return {
        id: `doc-${timestamp}-${index}`,
        name: "Well visit",
        created: today,
        type: "well-visit",
        sections: [
          {
            id: `note-${timestamp}-${index}`,
            title: "Well visit - Note",
            content: "",
            checked: false,
          },
        ],
        isExpanded: false,
      };

    case "Annual":
      return {
        id: `doc-${timestamp}-${index}`,
        name: "Annual",
        created: today,
        type: "annual",
        sections: [
          {
            id: `note-${timestamp}-${index}`,
            title: "Annual - Note",
            content: "",
            checked: false,
          },
        ],
        isExpanded: false,
      };

    case "Referral letter":
      return {
        id: `doc-${timestamp}-${index}`,
        name: "Referral Letter",
        created: "12:20 PM",
        type: "referral-letter",
        sections: [
          {
            id: `referral-${timestamp}-${index}`,
            title: "Referral Note",
            content: "",
            checked: false,
          },
        ],
        isExpanded: false,
      };

    case "After Visit Summary":
      return {
        id: `doc-${timestamp}-${index}`,
        name: "After Visit Summary",
        created: today,
        type: "after-visit-summary",
        sections: [
          {
            id: `summary-${timestamp}-${index}`,
            title: "Summary Note",
            content: "",
            checked: false,
          },
        ],
        isExpanded: false,
      };

    default:
      return {
        id: `doc-${timestamp}-${index}`,
        name: noteType,
        created: today,
        type: noteType.toLowerCase().replace(/\s+/g, "-"),
        sections: [
          {
            id: `section-${timestamp}-${index}`,
            title: "Content",
            content: "",
            checked: false,
          },
        ],
        isExpanded: false,
      };
  }
};
