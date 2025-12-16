/**
 * useSectionContent Hook
 *
 * Manages AI-generated section content for notes,
 * including pronoun replacement and referral letter content.
 */

import * as React from "react";
import type { DocumentItem } from "../DocumentComponent.types";

export interface UseSectionContentOptions {
  document: DocumentItem;
  showSkeleton: boolean;
  isPronounReplacement: boolean;
  isDraftingReferralLetter: boolean;
}

export interface UseSectionContentReturn {
  aiSectionContent: Record<string, string>;
  setAiSectionContent: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

// Pool of AI-generated section content for Notes
// Based on annual physical examination comprehensive data
const AI_SECTION_CONTENT_POOL: Record<string, string[]> = {
  Note: [
    "The patient is a 41-year-old who presents for an annual physical exam. He underwent his initial colonoscopy at the age of 35, prompted by a family history of colorectal issues. He has a history of actinic keratoses on his facial region and has requested a referral to Dr. Charles Taylor at MGH. He does not engage in any form of exercise but does participate in walking and hiking activities. He applies high SPF sunscreen when planning to spend extended periods outdoors. The patient denies experiencing any severe pain following his discectomy. He occasionally experiences discomfort managed with light stretching exercises. He works in the finance field for the state. His father had skin cancer treatments and removals.",
    "Patient presents for routine wellness examination. Reports overall good health with no acute concerns. Has been maintaining walking and hiking activities. Denies chest pain, shortness of breath, or palpitations. No current medications. History of lumbar spine injury status post discectomy without severe pain. Discussed preventive health measures including colorectal cancer screening and dermatology follow-up.",
    "Annual physical examination for established patient. Currently feeling well with no new complaints. History of actinic keratoses requiring dermatology follow-up. Reports occasional ear blockage upon awakening that resolves with steam. Notes change in urine color and frequency over past year. Not currently on any medications. Uses high SPF sunscreen appropriately when outdoors.",
    "Routine health maintenance visit. Patient is a well-appearing 41-year-old in no acute distress. Reports interest in improving physical fitness following past lumbar spine injury. Comprehensive review of systems reveals occasional ear blockage and urinary frequency concerns. No current medications. Discussed advance directive planning and healthcare proxy designation. Follow-up scheduled in one year for annual wellness exam.",
  ],
  "Well visit - Note": [
    "Patient presents for routine well visit. Reports feeling well overall with no acute concerns. Has been maintaining walking and hiking activities with regular use of high SPF sunscreen. Denies chest pain, shortness of breath, or palpitations. Sleep is adequate. No current medications. Vitals: BP 109/72, HR 87. General: Well-appearing, in no acute distress. Cardiovascular: Regular rate and rhythm, no murmurs. Lungs: Clear bilaterally. Preventive care discussed including skin cancer screening and physical fitness recommendations. Return in 1 year or sooner if concerns arise.",
  ],
  "Annual - Note": [
    "Patient presents for annual physical examination. He reports overall good health following past lumbar spine injury status post discectomy. History of actinic keratoses requiring dermatology follow-up. Family history significant for skin cancer in father. Reports occasional ear blockage upon awakening, resolves with steam. Notes change in urine color and frequency over past year. Not currently on any medications. Exercises by walking and hiking regularly. Uses high SPF sunscreen appropriately. Vitals: BP 109/72, HR 87. Physical exam shows impacted cerumen right ear, actinic keratoses on face, otherwise unremarkable. Follow up in 3 months for lab results or sooner if needed.",
  ],
  "History of Present Illness": [
    "The patient is a 41-year-old who presents for an annual physical exam. He underwent his initial colonoscopy at the age of 35, prompted by a family history of colorectal issues. He acknowledges that he was due for a follow-up procedure in the previous year but failed to schedule it. His last endoscopy was performed in 2018. The patient had previously scheduled a dermatological appointment, which was subsequently cancelled. He has a history of actinic keratoses on his facial region. He reports no significant changes in his auditory or visual acuity, although he occasionally experiences a sensation of blockage in one ear upon awakening. This issue typically resolves after exposure to steam during his morning shower.",
    "Patient reports walking and hiking activities but no structured exercise program. Does not engage in any form of exercise beyond walking. Applies high SPF sunscreen when planning to spend extended periods outdoors during the summer months. The patient has observed a change in his urine color over the past year, noting a dark, apple juice-like appearance. This discoloration is most pronounced with his first morning void. He also reports frequent urination, even with minimal fluid intake.",
    "The patient denies experiencing any severe pain following his discectomy. He occasionally experiences discomfort, which he manages with light stretching exercises as instructed during his physical therapy sessions at Spaulding. He attributes his current lack of physical fitness to his back condition. He has a history of lumbar spine injury and has been advised against heavy weightlifting. Prior to his injury, he maintained an active lifestyle, running approximately 15 miles per week and engaging in regular weight training. He works in the finance field for the state. His father had skin cancer treatments and removals.",
    "Patient has requested a referral to Dr. Charles Taylor at MGH, as recommended by his father. He has a history of actinic keratoses on his facial region. He maintains a regular ear cleaning regimen using Q-tips. He has expressed interest in obtaining a referral to Spaulding for swimming lessons. He recalls an instance where he consumed a single glass of wine and water during a meal out yet needed to urinate three times. He is currently not on any medications.",
  ],
  "Physical Exam": [
    "Impacted cerumen is present in the right ear. No abnormal lymph nodes are felt in the neck. The thyroid appears normal. Both lungs are clear. The heart has a regular rate and rhythm. No murmurs are detected. The abdomen is soft and nontender. There is no swelling in the ankles. Actinic keratoses are present on the face. The skin on the back appears healthy. Vital Signs Blood pressure is 109/72. Heart rate is 87.",
    "BP 109/72, HR 87. General: Well-appearing, comfortable, no acute distress. HEENT: PERRLA, EOMI, impacted cerumen right ear. Neck: No thyromegaly, no JVD, no abnormal lymph nodes. CV: RRR, S1/S2 normal, no murmurs. Lungs: CTAB, no rales or wheezes. Abdomen: Soft, nontender, no masses. Extremities: No edema. Skin: Actinic keratoses on face, back appears healthy.",
  ],
  Results: [
    "Imaging Colonoscopy in 2018 showed normal colon.",
    "Labs pending: Comprehensive metabolic panel, lipid panel, urinalysis, PSA. Colonoscopy 2018 normal. No acute findings on today's examination.",
  ],
  "Assessment & Plan": [
    "1. Annual physical examination. The patient's blood pressure readings are within the normal range, and he is not currently on any antihypertensive medications. His cholesterol levels have been slightly elevated in the past. I will proceed with ordering blood work and a urinalysis. If the results indicate any abnormalities, I will recommend fasting blood work for further evaluation. 2. Colonoscopy. The patient underwent a colonoscopy in 2018, which yielded normal results. A repeat colonoscopy was recommended at the age of 50. I have advised the patient to postpone the colonoscopy until he reaches the age of 50, unless there are specific indications that necessitate an earlier procedure. 3. Skin evaluation. The patient has a history of actinic keratoses on his face. A referral to Dr. Charles Taylor at MGH will be arranged for further evaluation and management. 4. Prostate check. The patient's urinary symptoms are unlikely to be related to prostate issues. However, they could potentially be indicative of diabetes. A PSA test will be ordered to rule out any prostate-related concerns. 5. Cerumen impaction. The patient has impacted cerumen in his right ear. Cerumen irrigation will be performed to alleviate the impaction. 6. Back pain. The patient has a history of lumbar spine injury and has previously undergone discectomy surgery. I have recommended that the patient consider joining a gym and working with a personal trainer to improve his physical fitness.",
    "Preventive health maintenance - labs and urinalysis ordered. Dermatology referral for actinic keratoses management. Urinary symptoms evaluation - PSA ordered to rule out prostate concerns. Cerumen impaction - irrigation performed today. Physical fitness - gym membership with personal trainer recommended. Follow up in 3 months for lab results or sooner if needed.",
  ],
};

// Referral letter template for Ellis Turner's dermatology case
const REFERRAL_LETTER_CONTENT = `Dear Dr. Taylor,

I am referring my patient, a 41 year old male, for dermatologic evaluation and management of recurrent actinic keratoses on his facial region. He has a prior history of actinic keratoses and was previously scheduled to see Dermatology, but that appointment was cancelled. He specifically requested referral to your care at MGH, based on a recommendation from his father.

During his annual physical examination, multiple actinic keratoses were noted on his face. The remainder of his skin exam was unremarkable. His father has a history of skin cancer requiring treatment and excisions, which further increases the importance of dermatologic surveillance.

Additional relevant clinical information includes:

Past Medical/Surgical History: Lumbar spine injury status post discectomy; history of cerumen impaction; no current medications.

Social History: Works in the finance sector for the state; engages in walking and hiking but no structured exercise regimen; uses highSPF sunscreen when outdoors.

Other Current Concerns: None directly related to dermatologic conditions. No systemic symptoms reported.

Given his dermatologic history and family risk factors, I would appreciate your assessment regarding further management, potential treatment of current lesions, and recommendations for ongoing skin cancer surveillance.

Please let me know if additional information is needed. Thank you in advance for your evaluation and care.`;

// Helper function to replace pronouns with they/them and fix grammar
const replacePronounsWithTheyThem = (text: string): string => {
  let result = text;

  // Replace pronouns first
  result = result
    .replace(/\bHe\b/g, "They")
    .replace(/\bShe\b/g, "They")
    .replace(/\bhe\b/g, "they")
    .replace(/\bshe\b/g, "they")
    .replace(/\bHim\b/g, "Them")
    .replace(/\bHer\b(?!\s+\w)/g, "Them")
    .replace(/\bhim\b/g, "them")
    .replace(/\bher\b(?!\s+\w)/g, "them")
    .replace(/\bHis\b/g, "Their")
    .replace(/\bHer\s+(?=\w)/g, "Their ")
    .replace(/\bhis\b/g, "their")
    .replace(/\bher\s+(?=\w)/g, "their ")
    .replace(/\bHimself\b/g, "Themselves")
    .replace(/\bHerself\b/g, "Themselves")
    .replace(/\bhimself\b/g, "themselves")
    .replace(/\bherself\b/g, "themselves");

  // Fix verb conjugations after they/them replacement
  // Must fix common irregular verbs and present tense third-person singular forms
  result = result
    // Fix irregular verbs first (highest priority)
    .replace(/\b(They|they)\s+is\b/g, "$1 are")
    .replace(/\b(They|they)\s+was\b/g, "$1 were")
    .replace(/\b(They|they)\s+has\b/g, "$1 have")
    .replace(/\b(They|they)\s+does\b/g, "$1 do")

    // Fix verbs ending in -es (goes, does, etc.)
    .replace(/\b(They|they)\s+goes\b/g, "$1 go")
    .replace(/\b(They|they)\s+does\b/g, "$1 do")

    // Fix common medical/clinical verbs ending in -s
    .replace(/\b(They|they)\s+describes\b/g, "$1 describe")
    .replace(/\b(They|they)\s+denies\b/g, "$1 deny")
    .replace(/\b(They|they)\s+reports\b/g, "$1 report")
    .replace(/\b(They|they)\s+presents\b/g, "$1 present")
    .replace(/\b(They|they)\s+appears\b/g, "$1 appear")
    .replace(/\b(They|they)\s+experiences\b/g, "$1 experience")
    .replace(/\b(They|they)\s+undergoes\b/g, "$1 undergo")
    .replace(/\b(They|they)\s+continues\b/g, "$1 continue")
    .replace(/\b(They|they)\s+remains\b/g, "$1 remain")
    .replace(/\b(They|they)\s+requires\b/g, "$1 require")
    .replace(/\b(They|they)\s+shows\b/g, "$1 show")
    .replace(/\b(They|they)\s+exhibits\b/g, "$1 exhibit")
    .replace(/\b(They|they)\s+demonstrates\b/g, "$1 demonstrate")
    .replace(/\b(They|they)\s+complains\b/g, "$1 complain")
    .replace(/\b(They|they)\s+notes\b/g, "$1 note")
    .replace(/\b(They|they)\s+mentions\b/g, "$1 mention")
    .replace(/\b(They|they)\s+states\b/g, "$1 state")
    .replace(/\b(They|they)\s+indicates\b/g, "$1 indicate")
    .replace(/\b(They|they)\s+suggests\b/g, "$1 suggest")
    .replace(/\b(They|they)\s+feels\b/g, "$1 feel")
    .replace(/\b(They|they)\s+needs\b/g, "$1 need")
    .replace(/\b(They|they)\s+wants\b/g, "$1 want")
    .replace(/\b(They|they)\s+takes\b/g, "$1 take")
    .replace(/\b(They|they)\s+uses\b/g, "$1 use")
    .replace(/\b(They|they)\s+works\b/g, "$1 work")
    .replace(/\b(They|they)\s+lives\b/g, "$1 live")
    .replace(/\b(They|they)\s+smokes\b/g, "$1 smoke")
    .replace(/\b(They|they)\s+drinks\b/g, "$1 drink")
    .replace(/\b(They|they)\s+exercises\b/g, "$1 exercise")
    .replace(/\b(They|they)\s+engages\b/g, "$1 engage");

  return result;
};

export function useSectionContent({
  document,
  showSkeleton,
  isPronounReplacement,
  isDraftingReferralLetter,
}: UseSectionContentOptions): UseSectionContentReturn {
  // Track previous skeleton state
  const previousShowSkeletonRef = React.useRef(showSkeleton);

  // Local state for AI-generated section content (for Notes)
  const [aiSectionContent, setAiSectionContent] = React.useState<
    Record<string, string>
  >({});

  // Generate AI content for sections when skeleton ends
  React.useEffect(() => {
    const wasShowingSkeleton = previousShowSkeletonRef.current;
    previousShowSkeletonRef.current = showSkeleton;

    // Generate AI content for Note sections when skeleton ends
    if (
      wasShowingSkeleton &&
      !showSkeleton &&
      document.type !== "orders" &&
      document.type !== "referral-letter" &&
      !isPronounReplacement &&
      !isDraftingReferralLetter
    ) {
      const newContent: Record<string, string> = {};
      document.sections?.forEach((section) => {
        const contentPool = AI_SECTION_CONTENT_POOL[section.title];
        if (contentPool && contentPool.length > 0) {
          const randomIndex = Math.floor(Math.random() * contentPool.length);
          newContent[section.id] = contentPool[randomIndex];
        }
      });
      setAiSectionContent(newContent);
    }

    // Replace pronouns in Note sections when pronoun replacement skeleton ends
    if (
      wasShowingSkeleton &&
      !showSkeleton &&
      document.type !== "orders" &&
      isPronounReplacement
    ) {
      setAiSectionContent((prev) => {
        const newContent: Record<string, string> = {};
        document.sections?.forEach((section) => {
          const currentContent = prev[section.id] || section.content;
          if (currentContent) {
            newContent[section.id] =
              replacePronounsWithTheyThem(currentContent);
          }
        });
        return { ...prev, ...newContent };
      });
    }

    // Generate content for Referral Letter when drafting referral letter skeleton ends
    if (
      wasShowingSkeleton &&
      !showSkeleton &&
      document.type === "referral-letter" &&
      isDraftingReferralLetter
    ) {
      const firstSectionId = document.sections?.[0]?.id;
      if (firstSectionId) {
        setAiSectionContent((prev) => ({
          ...prev,
          [firstSectionId]: REFERRAL_LETTER_CONTENT,
        }));
      }
    }
  }, [
    showSkeleton,
    document.type,
    document.sections,
    isPronounReplacement,
    isDraftingReferralLetter,
  ]);

  return {
    aiSectionContent,
    setAiSectionContent,
  };
}
