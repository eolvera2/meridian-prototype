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
 * Content based on annual physical examination example.
 */
export const DICTATION_CONTENT_MAP: Record<string, string> = {
  "History of Present Illness":
    "The patient is a 41-year-old who presents for an annual physical exam. He underwent his initial colonoscopy at the age of 35, prompted by a family history of colorectal issues. He acknowledges that he was due for a follow-up procedure in the previous year but failed to schedule it. His last endoscopy was performed in 2018. He has expressed interest in scheduling a colonoscopy at the age of 45. The patient had previously scheduled a dermatological appointment, which was subsequently cancelled. He has a history of actinic keratoses on his facial region. He has requested a referral to Dr. Charles Taylor at MGH, as recommended by his father. He reports no significant changes in his auditory or visual acuity, although he occasionally experiences a sensation of blockage in one ear upon awakening. This issue typically resolves after exposure to steam during his morning shower. He maintains a regular ear cleaning regimen using Q-tips. He does not engage in any form of exercise but does participate in walking and hiking activities. He applies high SPF sunscreen when planning to spend extended periods outdoors during the summer months.",
  "Physical Exam":
    "Impacted cerumen is present in the right ear. No abnormal lymph nodes are felt in the neck. The thyroid appears normal. Both lungs are clear. The heart has a regular rate and rhythm. No murmurs are detected. The abdomen is soft and nontender. There is no swelling in the ankles. Actinic keratoses are present on the face. The skin on the back appears healthy. Vital Signs Blood pressure is 109/72. Heart rate is 87.",
  Results: "Imaging Colonoscopy in 2018 showed normal colon.",
  "Assessment & Plan":
    "1. Annual physical examination. The patient's blood pressure readings are within the normal range, and he is not currently on any antihypertensive medications. His cholesterol levels have been slightly elevated in the past. I will proceed with ordering blood work and a urinalysis. If the results indicate any abnormalities, I will recommend fasting blood work for further evaluation. 2. Colonoscopy. The patient underwent a colonoscopy in 2018, which yielded normal results. A repeat colonoscopy was recommended at the age of 50. I have advised the patient to postpone the colonoscopy until he reaches the age of 50, unless there are specific indications that necessitate an earlier procedure. 3. Skin evaluation. The patient has a history of actinic keratoses on his face. A referral to Dr. Charles Taylor at MGH will be arranged for further evaluation and management. 4. Prostate check. The patient's urinary symptoms are unlikely to be related to prostate issues. However, they could potentially be indicative of diabetes. A PSA test will be ordered to rule out any prostate-related concerns. 5. Cerumen impaction. The patient has impacted cerumen in his right ear. Cerumen irrigation will be performed to alleviate the impaction. 6. Back pain. The patient has a history of lumbar spine injury and has previously undergone discectomy surgery. I have recommended that the patient consider joining a gym and working with a personal trainer to improve his physical fitness. He should inform the trainer about his past discectomy surgery and exercise caution with his back. At this time, a referral to Spaulding is not necessary.",
  "Referral Note":
    "Dear Dr. Taylor, I am referring my patient, a 41-year-old male, for dermatologic evaluation and management of recurrent actinic keratoses on his facial region. He has a prior history of actinic keratoses and was previously scheduled to see Dermatology, but that appointment was cancelled. He specifically requested referral to your care at MGH, based on a recommendation from his father. During his annual physical examination, multiple actinic keratoses were noted on his face. The remainder of his skin exam was unremarkable. His father has a history of skin cancer requiring treatment and excisions, which further increases the importance of dermatologic surveillance. Given his dermatologic history and family risk factors, I would appreciate your assessment regarding further management, potential treatment of current lesions, and recommendations for ongoing skin cancer surveillance. Please let me know if additional information is needed. Thank you in advance for your evaluation and care.",
  "Summary Note":
    "Thank you for visiting our clinic today. Your annual physical examination has been completed. Please follow up with the dermatology referral to Dr. Taylor at MGH for evaluation of actinic keratoses. We will contact you with blood work and urinalysis results. Continue your walking and hiking activities and consider joining a gym with a personal trainer who is aware of your back surgery history. Watch for any changes in urinary patterns or color and report if symptoms worsen. Schedule your next annual physical in one year.",
  Note: "Patient presents for routine wellness examination. Reports overall good health with no acute concerns. Has been maintaining walking and hiking activities but no structured exercise program. No current medications. History of lumbar spine injury status post discectomy. Denies severe pain but reports occasional discomfort managed with stretching. Vitals today: BP 109/72, HR 87. Physical exam shows impacted cerumen right ear, actinic keratoses on face, otherwise unremarkable. Lab work and urinalysis ordered. Discussed preventive health measures including colorectal cancer screening, dermatology referral, and prostate health. Follow-up scheduled in one year for annual wellness exam.",
  "Well visit - Note":
    "Patient presents for routine well visit. Reports feeling well overall with no acute concerns. Has been maintaining walking and hiking activities. Regular use of high SPF sunscreen when outdoors. Denies chest pain, shortness of breath, or palpitations. Sleep is adequate at 7-8 hours per night. No current medications. Vitals: BP 109/72, HR 87. General: Well-appearing, in no acute distress. Cardiovascular: Regular rate and rhythm, no murmurs. Lungs: Clear bilaterally. Labs pending. Preventive care discussed including skin cancer screening and physical fitness recommendations. Continue current healthy habits. Return in 1 year or sooner if concerns arise.",
  "Annual - Note":
    "Patient presents for annual physical examination. He reports overall good health with well-controlled chronic conditions from past lumbar spine injury. History of actinic keratoses requiring dermatology follow-up. Family history significant for skin cancer in father. Reports occasional ear blockage upon awakening, resolves with steam. Notes change in urine color and frequency over past year. Not currently on any medications. Exercises by walking and hiking regularly. Uses high SPF sunscreen appropriately. Vitals: BP 109/72, HR 87. Physical exam shows impacted cerumen right ear, actinic keratoses on face, otherwise unremarkable. Assessment: 1) Preventive health maintenance - labs and urinalysis ordered. 2) Dermatology referral for actinic keratoses management. 3) Urinary symptoms evaluation - PSA ordered to rule out prostate concerns. 4) Cerumen impaction - irrigation performed today. 5) Physical fitness - gym membership with personal trainer recommended. Follow up in 3 months for lab results or sooner if needed.",
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
