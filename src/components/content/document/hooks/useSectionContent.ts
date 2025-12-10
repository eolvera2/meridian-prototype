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
const AI_SECTION_CONTENT_POOL: Record<string, string[]> = {
  Note: [
    "Patient presents for routine wellness examination. Reports overall good health with no acute concerns. Has been maintaining regular exercise 3 times per week and following a balanced diet. Denies chest pain, shortness of breath, or palpitations. Sleep quality is adequate at 7-8 hours per night. Current medications include lisinopril 10 mg daily for hypertension with good BP control. No medication side effects reported. Discussed preventive health measures including colorectal cancer screening and flu vaccination.",
    "Annual physical examination for established patient. Currently feeling well with no new complaints. Chronic conditions including hypertension and hyperlipidemia remain stable on current regimen. Recent labs show HbA1c 5.6%, lipid panel within target. BMI 26.2, down from 27.1 last year. Patient reports improved dietary habits and increased physical activity. Reviewed medication list for accuracy. Up to date on immunizations. Discussed age-appropriate cancer screenings.",
    "Wellness visit for preventive care. Patient reports general good health. Vitals today: BP 128/78, HR 72, SpO2 98% on room air. Physical exam unremarkable. Depression screening (PHQ-9) score 2, negative. Alcohol use screening (AUDIT-C) score 1, low risk. Discussed smoking cessation resources as patient reports occasional social smoking. Reviewed family history noting new diagnosis of colon cancer in sibling - referred for early colonoscopy.",
    "Routine health maintenance visit. Patient is a well-appearing adult in no acute distress. Comprehensive review of systems negative except for occasional mild headaches relieved with acetaminophen. Physical examination within normal limits. Labs reviewed: CBC normal, CMP normal, TSH 2.1. Immunizations current. Discussed advance directive planning and healthcare proxy designation. Follow-up scheduled in one year for annual wellness exam.",
  ],
  "Well visit - Note": [
    "Patient presents for routine well visit. She reports feeling well overall with no acute concerns. Has been maintaining a healthy lifestyle with regular exercise 3 times per week and following a balanced diet. Denies chest pain, shortness of breath, palpitations, or syncope. No recent weight changes. Sleep is adequate at 7-8 hours per night. Stress levels are manageable. Vitals: BP 122/78 mmHg, HR 68 bpm, Temp 98.4°F, SpO2 99% on room air. General: Well-appearing, in no acute distress. Cardiovascular: Regular rate and rhythm, no murmurs. Lungs: Clear to auscultation bilaterally. Labs reviewed - lipid panel and CBC within normal limits. Preventive care discussed including flu vaccine and skin cancer prevention. Continue current lifestyle habits. Return in 1 year or sooner if concerns arise.",
  ],
  "Annual - Note": [
    "Patient presents for annual physical examination. He reports overall good health with well-controlled chronic conditions. Hypertension has been stable on current medications with home BP readings averaging 130/82 mmHg. Reports compliance with medication regimen and dietary modifications. Exercises by walking 30 minutes daily. Denies any new symptoms including chest pain, dyspnea, dizziness, or visual changes. Vitals: BP 132/84 mmHg, HR 74 bpm, SpO2 98% on room air. Physical exam unremarkable. Labs: HbA1c 5.8% indicating prediabetes, LDL 128 slightly elevated, Vitamin D 28 low-normal. Assessment: 1) Hypertension - controlled, continue current regimen. 2) Prediabetes - lifestyle modifications, recheck in 3 months. 3) Borderline hyperlipidemia - trial lifestyle changes. Flu vaccine and tetanus booster administered today. Follow up in 3 months for lab recheck.",
  ],
  "History of Present Illness": [
    "Patient presents with a three-day history of persistent cough and mild fever. Reports experiencing increased fatigue and occasional shortness of breath during physical activity. Denies chest pain or difficulty breathing at rest. Has been taking over-the-counter medication with minimal relief. No recent travel or known sick contacts reported.",
    "45-year-old male with chief complaint of headaches for the past 2 weeks. Describes pain as bilateral, pressure-like, rated 6/10, worse in the morning. Associated with mild nausea but no vomiting. Denies visual changes, neck stiffness, or fever. Takes ibuprofen with partial relief.",
    "Patient reports worsening lower back pain over the past month, radiating to left leg. Pain is sharp, rated 7/10, aggravated by sitting and bending. Reports tingling in left foot. No bowel or bladder dysfunction. Has history of lumbar disc herniation.",
    "62-year-old female presents with progressive dyspnea on exertion over 3 months. Now unable to climb one flight of stairs without stopping. Associated with bilateral leg swelling. Denies orthopnea or PND. History of hypertension and diabetes mellitus type 2.",
  ],
  "Physical Exam": [
    "Vital signs: Temperature 99.2°F, Blood pressure 128/82 mmHg, Heart rate 78 bpm, Respiratory rate 16/min, SpO2 97% on room air. General: Alert and oriented, no acute distress. HEENT: Oropharynx mildly erythematous, no exudates. Neck: Supple, no lymphadenopathy. Lungs: Scattered rhonchi bilaterally, no wheezes. Heart: Regular rate and rhythm, no murmurs. Abdomen: Soft, non-tender.",
    "BP 142/88, HR 72, RR 14, SpO2 98% RA. General: Well-appearing, comfortable. HEENT: PERRLA, EOMI, TMs clear bilaterally. Neck: No thyromegaly, no JVD. CV: RRR, S1/S2 normal, no murmurs. Lungs: CTAB, no rales or wheezes. Extremities: No edema, pulses 2+ throughout.",
  ],
  Results: [
    "CBC: WBC 11.2 (mildly elevated), Hgb 14.1, Plt 245. BMP within normal limits. Chest X-ray shows mild peribronchial thickening, no consolidation or effusion. Rapid strep negative. COVID-19 PCR pending.",
    "Labs: WBC 8.2, Hgb 12.8, Plt 198. BMP: Na 140, K 4.2, Cl 102, CO2 24, BUN 18, Cr 1.0, Glucose 156. HbA1c 7.8%. Lipid panel: TC 245, LDL 158, HDL 42, TG 180. TSH 2.4.",
  ],
  "Assessment & Plan": [
    "Assessment: Acute bronchitis, likely viral etiology. Plan: 1) Supportive care with rest and hydration. 2) Guaifenesin 400mg every 4 hours as needed for cough. 3) Acetaminophen 650mg every 6 hours as needed for fever. 4) Return if symptoms worsen or persist beyond 10 days. 5) Follow up on COVID results.",
    "1. Hypertension, uncontrolled - Increase lisinopril to 20mg daily, add amlodipine 5mg daily. 2. Type 2 DM, suboptimal control - Increase metformin to 1000mg BID, dietary counseling. 3. Hyperlipidemia - Start atorvastatin 40mg at bedtime. 4. Follow up in 4 weeks with repeat labs.",
  ],
};

// Referral letter template
const REFERRAL_LETTER_CONTENT = `Dear Dr. Johnson,

I am writing to refer my patient, Angel Brown, a 45-year-old male, for evaluation and management of their chronic headaches and cardiovascular concerns.

Mr. Brown has a history of diabetes mellitus type 2 and hypertension, both of which are currently managed with oral medications. They have been experiencing frequent headaches over the past several months, which have become increasingly bothersome and are affecting their quality of life.

Recent vital signs:
- Blood pressure: 142/88 mmHg
- Heart rate: 78 bpm
- Temperature: 98.6°F

Current medications:
- Metformin 1000 mg twice daily
- Lisinopril 20 mg daily
- Atorvastatin 40 mg at bedtime

I would appreciate your expert evaluation and recommendations for further management. Please feel free to contact my office if you require any additional information.

Thank you for your assistance in the care of this patient.

Sincerely,
Dr. Smith`;

// Helper function to replace pronouns with they/them
const replacePronounsWithTheyThem = (text: string): string => {
  return text
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
