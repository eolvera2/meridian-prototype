/**
 * DocumentComponent Constants
 *
 * Contains dictation content mappings and helper functions for document content.
 */

import type { MedicalContentBundle } from "../../../i18n/resources";

// ============================================================================
// Timing Constants
// ============================================================================

export const DOCUMENT_TIMING_MS = {
  deferToNextTick: 0,

  initialScrollDelay: 100,
  typingSimulationStartDelay: 100,
  referralScrollDelay: 100,

  typingReplacementDomUpdateDelay: 100,
  typingReplacementScrollSettleDelay: 100,
  typingReplacementStartDelay: 300,
  typingReplacementCursorUpdateDelay: 0,
  typingReplacementEndCursorDelay: 100,
  typingReplacementCharInterval: 17,

  autoSelectStartDelay: 300,
  autoSelectAfterExpandDelay: 800,
  autoSelectApplySelectionDelay: 800,

  skeletonDefaultDuration: 3000,
  skeletonToastDelay: 500,
  skeletonAfterCompleteDelay: 100,

  dictationCharInterval: 30,
  tooltipAfterDictationDelay: 1000,

  tooltipAfterTypingIdleDelay: 500,

  aiToastDetectedDefault: 5000,
  aiToastDetectedPronoun: 3000,
  aiToastCompleted: 2000,
  pronounReplacementCompletionDelay: 100,
} as const;

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
    "The patient is a 41-year-old who presents for an annual physical exam.\n\nColonoscopy History\nHe underwent his initial colonoscopy at the age of 35, prompted by a family history of colorectal issues. He acknowledges that he was due for a follow-up procedure in the previous year but failed to schedule it. His last endoscopy was performed in 2018. He has expressed interest in scheduling a colonoscopy at the age of 45.\n\nDermatology\nThe patient had previously scheduled a dermatological appointment, which was subsequently cancelled. He has a history of actinic keratoses on his facial region. He has requested a referral to Dr. Charles Taylor at MGH, as recommended by his father.\n\nENT\nHe reports no significant changes in his auditory or visual acuity, although he occasionally experiences a sensation of blockage in one ear upon awakening. This issue typically resolves after exposure to steam during his morning shower. He maintains a regular ear cleaning regimen using Q-tips.\n\nActivity Level\nHe does not engage in any form of structured exercise but does participate in walking and hiking activities. He applies high SPF sunscreen when planning to spend extended periods outdoors during the summer months.",
  "Physical Exam":
    "General\nPatient is alert and oriented, in no acute distress.\n\nENT\nImpacted cerumen is present in the right ear. Ears otherwise normal.\n\nNeck\nNo abnormal lymph nodes are felt. The thyroid appears normal.\n\nCardiovascular\nThe heart has a regular rate and rhythm. No murmurs are detected.\n\nRespiratory\nBoth lungs are clear to auscultation bilaterally.\n\nAbdomen\nSoft and nontender. Normal bowel sounds.\n\nExtremities\nThere is no swelling in the ankles.\n\nSkin\nActinic keratoses are present on the face. The skin on the back appears healthy.\n\nVital Signs\nBlood pressure: 109/72 mmHg\nHeart rate: 87 bpm",
  Results: "Imaging\nColonoscopy in 2018 showed normal colon.",
  "Assessment & Plan":
    "1. Annual Physical Examination\nThe patient's blood pressure readings are within the normal range, and he is not currently on any antihypertensive medications. His cholesterol levels have been slightly elevated in the past. I will proceed with ordering blood work and a urinalysis. If the results indicate any abnormalities, I will recommend fasting blood work for further evaluation.\n\n2. Colonoscopy\nThe patient underwent a colonoscopy in 2018, which yielded normal results. A repeat colonoscopy was recommended at the age of 50. I have advised the patient to postpone the colonoscopy until he reaches the age of 50, unless there are specific indications that necessitate an earlier procedure.\n\n3. Skin Evaluation\nThe patient has a history of actinic keratoses on his face. A referral to Dr. Charles Taylor at MGH will be arranged for further evaluation and management.\n\n4. Prostate Check\nThe patient's urinary symptoms are unlikely to be related to prostate issues. However, they could potentially be indicative of diabetes. A PSA test will be ordered to rule out any prostate-related concerns.\n\n5. Cerumen Impaction\nThe patient has impacted cerumen in his right ear. Cerumen irrigation will be performed to alleviate the impaction.\n\n6. Back Pain\nThe patient has a history of lumbar spine injury and has previously undergone discectomy surgery. I have recommended that the patient consider joining a gym and working with a personal trainer to improve his physical fitness. He should inform the trainer about his past discectomy surgery and exercise caution with his back. At this time, a referral to Spaulding is not necessary.",
  "Referral Note":
    "Dear Dr. Taylor,\n\nI am referring my patient, a 41 year old male, for dermatologic evaluation and management of recurrent actinic keratoses on his facial region. He has a prior history of actinic keratoses and was previously scheduled to see Dermatology, but that appointment was cancelled. He specifically requested referral to your care at MGH, based on a recommendation from his father.\n\nDuring his annual physical examination, multiple actinic keratoses were noted on his face. The remainder of his skin exam was unremarkable. His father has a history of skin cancer requiring treatment and excisions, which further increases the importance of dermatologic surveillance.\n\nAdditional relevant clinical information includes:\n\nPast Medical/Surgical History: Lumbar spine injury status post discectomy; history of cerumen impaction; no current medications.\n\nSocial History: Works in the finance sector for the state; engages in walking and hiking but no structured exercise regimen; uses highSPF sunscreen when outdoors.\n\nOther Current Concerns: None directly related to dermatologic conditions. No systemic symptoms reported.\n\nGiven his dermatologic history and family risk factors, I would appreciate your assessment regarding further management, potential treatment of current lesions, and recommendations for ongoing skin cancer surveillance.\n\nPlease let me know if additional information is needed. Thank you in advance for your evaluation and care.",
  "Summary Note":
    "Thank you for visiting our clinic today. Your annual physical examination has been completed. Please follow up with the dermatology referral to Dr. Taylor at MGH for evaluation of actinic keratoses. We will contact you with blood work and urinalysis results. Continue your walking and hiking activities and consider joining a gym with a personal trainer who is aware of your back surgery history. Watch for any changes in urinary patterns or color and report if symptoms worsen. Schedule your next annual physical in one year.",
  Note: "Chief Complaint\nPatient presents for routine wellness examination. Reports overall good health with no acute concerns.\n\nHistory\nHas been maintaining walking and hiking activities but no structured exercise program. No current medications. History of lumbar spine injury status post discectomy. Denies severe pain but reports occasional discomfort managed with stretching.\n\nVitals\nBP 109/72 mmHg, HR 87 bpm\n\nPhysical Exam\nImpacted cerumen right ear, actinic keratoses on face, otherwise unremarkable.\n\nPlan\nLab work and urinalysis ordered. Discussed preventive health measures including colorectal cancer screening, dermatology referral, and prostate health. Follow-up scheduled in one year for annual wellness exam.",
  "Well visit - Note":
    "Chief Complaint\nPatient presents for routine wellness visit. Reports overall good health with no acute concerns.\n\nHistory\nMaintains regular physical activity through walking and occasional gym sessions. Sleep is adequate at 7-8 hours per night. No current medications.\n\nVitals\nWithin normal limits.\n\nPhysical Exam\nGeneral appearance is well-developed and well-nourished. Cardiovascular exam reveals regular rate and rhythm without murmurs. Lungs clear to auscultation bilaterally. Abdomen soft, non-tender, with normal bowel sounds. Skin exam unremarkable.\n\nPlan\nPreventive care measures discussed including vaccination updates, cancer screenings appropriate for age, and lifestyle modifications. Patient counseled on maintaining healthy diet and exercise regimen. No acute interventions required. Return in one year for annual wellness examination or sooner if concerns arise.",
  "Annual - Note":
    "Chief Complaint\nPatient presents for annual physical examination. Reports overall stable health since last visit.\n\nReview of Systems\nNotable for occasional fatigue attributed to work stress. No chest pain, shortness of breath, or palpitations. Bowel and bladder function normal.\n\nMedications\nCurrent medications reviewed and reconciled.\n\nFamily History\nReviewed with no new developments.\n\nSocial History\nNon-smoker, occasional alcohol use, regular exercise.\n\nVitals\nBlood pressure, heart rate, respiratory rate, and oxygen saturation all within normal parameters.\n\nPhysical Exam\nFindings within normal limits.\n\nAssessment & Plan\nHealth maintenance examination with age-appropriate screenings ordered. Plan includes routine laboratory work, lipid panel, and metabolic panel. Discussed importance of continued preventive care, physical activity, and healthy diet. Immunizations updated as appropriate. Follow-up in one year or sooner if new concerns develop.",
};

// ============================================================================
// Patient-Specific Document Content
// ============================================================================

/**
 * Patient-specific content for generated documents.
 * Keyed by patient ID, then by document type.
 */
export const PATIENT_DOCUMENT_CONTENT: Record<
  string,
  Record<string, string>
> = {
  // Ellis Turner - Male, 41 YO, Annual physical exam
  "3": {
    "Well visit - Note":
      "Patient presents for routine wellness visit. He is a 41-year-old male in overall good health. Reports maintaining regular walking and hiking activities. Denies tobacco or recreational drug use. Alcohol use is occasional and social. Sleep quality is good at 7-8 hours nightly. No current medications. History notable for lumbar discectomy. Vitals: BP 109/72, HR 87. Physical exam unremarkable except for noted actinic keratoses on face. Counseled on sun protection and skin cancer prevention given family history. Preventive care measures discussed. No acute concerns. Return in one year or sooner if issues arise.",
    "Annual - Note":
      "Patient presents for annual physical examination. He is a 41-year-old male with history of lumbar spine injury status post discectomy and actinic keratoses. Reports overall stable health. Occasional ear blockage noted upon awakening, resolves spontaneously. Notes mild change in urinary frequency over past year. No current medications. Family history significant for paternal skin cancer. Social history: Works in finance, walks and hikes regularly, uses sunscreen appropriately. Vitals: BP 109/72, HR 87. Physical exam: Impacted cerumen right ear, actinic keratoses on face, otherwise unremarkable. Assessment: 1) Annual health maintenance - labs ordered. 2) Cerumen impaction - irrigation performed. 3) Dermatology referral for actinic keratoses. 4) PSA ordered for urinary symptoms evaluation. Follow-up as needed.",
    "Referral Note":
      "Dear Dr. Taylor,\n\nI am referring Ellis Turner, a 41-year-old male, for dermatologic evaluation and management of actinic keratoses on his facial region. He has a prior history of actinic keratoses and has requested referral to your care at MGH.\n\nDuring his annual physical examination, multiple actinic keratoses were noted on his face. His father has a history of skin cancer requiring treatment, which increases the importance of dermatologic surveillance.\n\nPast Medical/Surgical History: Lumbar spine injury status post discectomy; history of cerumen impaction; no current medications.\n\nSocial History: Works in finance; engages in walking and hiking; uses high SPF sunscreen when outdoors.\n\nPlease evaluate for management of current lesions and recommendations for ongoing skin cancer surveillance.\n\nThank you for your consultation.",
    "Summary Note":
      "Thank you for visiting our clinic today, Mr. Turner. Your annual physical has been completed. We have arranged a dermatology referral to Dr. Taylor at MGH for your actinic keratoses. Your lab results will be sent to you once available. Continue your walking and hiking activities. Your cerumen impaction was addressed today. Please schedule your next annual exam in one year.",
  },

  // Jøran Steen - Male, 41 YO, Annual physical exam
  "1": {
    "Well visit - Note":
      "Patient presents for routine wellness visit. He is a 41-year-old male in good overall health. Reports regular exercise including swimming and cycling. Non-smoker. Social alcohol use only. Sleep is adequate. Currently taking daily multivitamin. No chronic conditions. Vitals: BP 118/76, HR 72. Physical exam unremarkable. BMI within normal range. Counseled on continued healthy lifestyle and age-appropriate cancer screenings. No acute concerns identified. Return in one year for annual wellness exam.",
    "Annual - Note":
      "Patient presents for annual physical examination. He is a 41-year-old male with no significant past medical history. Reports feeling well with good energy levels. Exercises regularly with swimming and cycling. Non-smoker, occasional alcohol. Diet is balanced. No current medications except daily multivitamin. Family history unremarkable. Vitals: BP 118/76, HR 72, SpO2 98%. Physical exam within normal limits. Assessment: Healthy adult male for age-appropriate preventive care. Plan: Routine labs including lipid panel, CBC, CMP ordered. Discussed colon cancer screening recommendations. Immunizations updated. Follow-up in one year.",
    "Referral Note":
      "Dear Colleague,\n\nI am referring Jøran Steen, a 41-year-old healthy male, for specialist evaluation. The patient has been seen for his annual physical examination and requires further assessment as indicated.\n\nPlease see attached clinical documentation for complete history and examination findings.\n\nThank you for your consultation.\n\nSincerely,\nPrimary Care Provider",
    "Summary Note":
      "Thank you for visiting our clinic today, Mr. Steen. Your annual physical examination has been completed successfully. All findings are within normal limits. Your lab results will be sent to you once available. Continue your excellent exercise regimen and healthy lifestyle. Remember to schedule your next annual exam in one year.",
  },

  // Meg Welly - Female, 38 YO, Follow-up cerumen impaction
  "2": {
    "Well visit - Note":
      "Patient presents for follow-up and wellness assessment. She is a 38-year-old female with history of recurrent cerumen impaction. Reports bilateral hearing has improved since last cerumen removal. Denies ear pain, drainage, or tinnitus. General health is good. Exercises regularly at gym. Non-smoker. No current medications. Vitals: BP 112/70, HR 68. Ears: Canals clear bilaterally, tympanic membranes intact and mobile. No active impaction. Counseled on ear hygiene and avoiding Q-tip use in canals. Return as needed or for annual exam.",
    "Annual - Note":
      "Patient presents for wellness evaluation alongside cerumen impaction follow-up. She is a 38-year-old female with recurrent cerumen impaction managed conservatively. Reports improved hearing since last visit. No new medical concerns. Exercises 3-4 times weekly. Non-smoker, occasional wine with dinner. No current medications. Family history notable for hypertension in mother. Vitals: BP 112/70, HR 68. Physical exam: Ears clear, no impaction noted. Remainder of exam unremarkable. Assessment: 1) Cerumen impaction resolved. 2) Health maintenance. Plan: Continue ear hygiene measures. Routine preventive labs ordered. Return in one year.",
    "Referral Note":
      "Dear Dr. Smith,\n\nI am referring Meg Welly, a 38-year-old female, for ENT evaluation due to recurrent cerumen impaction. She has required multiple in-office cerumen removals over the past two years despite counseling on ear hygiene.\n\nPlease evaluate for underlying anatomical factors and management recommendations.\n\nThank you for your consultation.",
    "Summary Note":
      "Thank you for your visit today, Ms. Welly. Your cerumen impaction has resolved and your ears are now clear. Please avoid using Q-tips inside your ear canals. If you experience hearing changes or fullness, please return for evaluation. Your next wellness visit is recommended in one year.",
  },

  // Tuisku Tuominen - Male, 43 YO, Back pain follow-up
  "4": {
    "Well visit - Note":
      "Patient presents for wellness visit with focus on back pain management. He is a 43-year-old male with chronic low back pain secondary to degenerative disc disease. Reports pain is well-controlled with physical therapy and home exercises. Currently taking ibuprofen PRN. Denies radiating leg pain or numbness. Exercises with walking and gentle stretching. Non-smoker. Vitals: BP 122/78, HR 74. Musculoskeletal: Mild tenderness lumbar paraspinals, full range of motion, no neurological deficits. Continue current management. Return if symptoms worsen.",
    "Annual - Note":
      "Patient presents for annual exam with back pain follow-up. He is a 43-year-old male with chronic low back pain from degenerative disc disease diagnosed 5 years ago. Reports good pain control with physical therapy and ibuprofen PRN. No new symptoms. Compliant with home exercise program. Non-smoker, moderate alcohol use. Family history: Father with hypertension, mother with osteoarthritis. Vitals: BP 122/78, HR 74. Physical exam: Lumbar spine with mild tenderness, no radiculopathy. Remainder unremarkable. Assessment: 1) Chronic low back pain - stable. 2) Preventive care. Plan: Continue PT, NSAIDs PRN. Routine labs ordered. Consider repeat imaging if symptoms change. Follow-up one year.",
    "Referral Note":
      "Dear Dr. Johnson,\n\nI am referring Tuisku Tuominen, a 43-year-old male, for pain management evaluation of chronic low back pain due to degenerative disc disease. He has been managing with physical therapy and NSAIDs but may benefit from additional interventions.\n\nPlease evaluate for injection therapy or other pain management modalities.\n\nThank you for your consultation.",
    "Summary Note":
      "Thank you for your visit today, Mr. Tuominen. Your back pain appears stable with your current management. Continue your physical therapy exercises and use ibuprofen as needed. Contact us if you develop leg weakness, numbness, or worsening pain. Your routine labs have been ordered and results will be sent to you. Follow-up in one year or sooner if needed.",
  },

  // Tyler Stein - Male, 39 YO, Dermatology referral discussion
  "5": {
    "Well visit - Note":
      "Patient presents for wellness visit and dermatology referral discussion. He is a 39-year-old male with history of atypical moles requiring regular monitoring. Reports no new or changing moles since last dermatology visit. Uses sunscreen regularly. No family history of melanoma. Non-smoker. Exercises with running and weight training. Vitals: BP 116/74, HR 66. Skin exam: Multiple benign-appearing nevi, no concerning lesions identified. Referred to dermatology for routine surveillance. Return in one year for wellness exam.",
    "Annual - Note":
      "Patient presents for annual physical with focus on dermatologic concerns. He is a 39-year-old male with history of atypical moles under dermatology surveillance. Last dermatology visit 6 months ago with stable findings. Uses SPF 50 sunscreen daily. No new symptoms. Runner and weight lifter. Non-smoker, social drinker. Family history negative for skin cancer. Vitals normal. Skin exam shows multiple stable nevi without concerning features. Assessment: 1) Atypical nevi - stable, continue dermatology follow-up. 2) Health maintenance. Plan: Routine labs, continue sun protection, dermatology surveillance annually. Return one year.",
    "Referral Note":
      "Dear Dr. Chen,\n\nI am referring Tyler Stein, a 39-year-old male, for continued dermatologic surveillance of atypical nevi. He has been under your care and requires routine monitoring.\n\nNo new concerning lesions identified on primary care exam. Please continue periodic full-body skin examinations as clinically indicated.\n\nThank you for your ongoing care.",
    "Summary Note":
      "Thank you for your visit today, Mr. Stein. Your skin exam today showed no new concerning lesions. Please continue your excellent sun protection habits. Your dermatology referral has been placed for routine surveillance. Continue self-skin exams monthly and report any new or changing moles promptly. Annual wellness exam recommended in one year.",
  },

  // Jordan Mitchell - Female, 45 YO, Urinary frequency evaluation
  "6": {
    "Well visit - Note":
      "Patient presents for wellness visit with urinary concerns. She is a 45-year-old female reporting increased urinary frequency over past 3 months. Denies dysuria, hematuria, or incontinence. No fever or flank pain. Drinks adequate water. Caffeine intake moderate. Premenopausal with regular cycles. No current medications. Vitals: BP 120/78, HR 72. Abdominal exam benign. UA obtained today. Assessment: Urinary frequency, etiology unclear. Plan: UA with culture, consider cystoscopy referral if symptoms persist. Return for results.",
    "Annual - Note":
      "Patient presents for annual exam with concern for urinary frequency. She is a 45-year-old female with 3-month history of increased urination frequency without dysuria or incontinence. Review of systems otherwise negative. Premenopausal, regular menses. No chronic conditions. Takes calcium supplement. Non-smoker. Walks daily for exercise. Family history: Mother with type 2 diabetes. Vitals: BP 120/78, HR 72. Exam unremarkable. Assessment: 1) Urinary frequency - workup initiated. 2) Preventive care. Plan: UA, urine culture, fasting glucose to rule out diabetes given family history. Consider urology referral if workup unrevealing. Follow-up for results.",
    "Referral Note":
      "Dear Dr. Williams,\n\nI am referring Jordan Mitchell, a 45-year-old female, for urology evaluation of persistent urinary frequency. She reports increased frequency over 3 months without dysuria, hematuria, or incontinence. Initial workup including UA is pending.\n\nPlease evaluate for underlying urological causes including possible overactive bladder or interstitial cystitis.\n\nThank you for your consultation.",
    "Summary Note":
      "Thank you for your visit today, Ms. Mitchell. We have collected a urine sample to evaluate your urinary frequency symptoms. Results will be available in 2-3 days. If the workup does not reveal a cause, we will refer you to urology for further evaluation. In the meantime, consider limiting caffeine intake which can worsen frequency. Contact us if you develop pain, fever, or blood in your urine.",
  },

  // Alex Kim - Male, 42 YO, Preventive care screening
  "7": {
    "Well visit - Note":
      "Patient presents for preventive care screening. He is a 42-year-old male with no significant medical history. Reports good overall health. Exercises 4-5 times weekly including running and strength training. Non-smoker. Minimal alcohol use. Diet is health-conscious. No current medications. No family history of early heart disease or cancer. Vitals: BP 114/72, HR 62. Physical exam unremarkable with athletic habitus. Assessment: Healthy male for age-appropriate preventive care. Plan: Routine labs, lipid panel. Discussed colorectal cancer screening options. Immunizations current. Return one year.",
    "Annual - Note":
      "Patient presents for annual preventive care. He is a 42-year-old male in excellent health. Very physically active with running and strength training. Non-smoker, rare alcohol. Follows Mediterranean-style diet. No medications. Family history unremarkable. Vitals excellent: BP 114/72, HR 62. BMI 23. Physical exam within normal limits. Assessment: Health maintenance for low-risk patient. Plan: Routine screening labs. Discussed colonoscopy at age 45 vs earlier screening options. Immunizations up to date. Continue healthy lifestyle. Follow-up one year.",
    "Referral Note":
      "Dear Colleague,\n\nI am referring Alex Kim, a 42-year-old healthy male, for consultation as indicated. The patient is in excellent health and maintains an active lifestyle.\n\nPlease see attached documentation for relevant clinical information.\n\nThank you for your consultation.",
    "Summary Note":
      "Thank you for your visit today, Mr. Kim. Your preventive care screening has been completed and all findings are excellent. Your lab results will be sent to you when available. Continue your outstanding exercise regimen and healthy diet. We discussed colorectal cancer screening which is recommended starting at age 45. Please schedule your next annual exam in one year.",
  },

  // Priya Raman - Female, 40 YO, Colonoscopy follow-up
  "8": {
    "Well visit - Note":
      "Patient presents for wellness visit and colonoscopy follow-up. She is a 40-year-old female who underwent screening colonoscopy 2 weeks ago showing 2 benign hyperplastic polyps, removed. Pathology confirmed benign. No GI symptoms currently. Reports regular bowel movements without blood. Non-smoker. Exercises with yoga and walking. Vitals: BP 110/68, HR 70. Abdominal exam benign. Assessment: Post-colonoscopy, benign findings. Plan: Repeat colonoscopy in 10 years per guidelines. Continue high-fiber diet. Return one year for wellness exam.",
    "Annual - Note":
      "Patient presents for annual exam with colonoscopy follow-up. She is a 40-year-old female with recent colonoscopy showing benign hyperplastic polyps. Family history notable for colon polyps in father. No current GI concerns. Practices yoga and walking. Non-smoker, occasional wine. Diet high in fiber and vegetables. No medications. Vitals: BP 110/68, HR 70. Exam unremarkable. Assessment: 1) Post-colonoscopy surveillance - benign polyps, repeat in 10 years. 2) Preventive care. Plan: Routine labs. Continue healthy lifestyle. Consider earlier repeat colonoscopy given family history. Follow-up one year.",
    "Referral Note":
      "Dear Dr. Patel,\n\nI am following up on Priya Raman, a 40-year-old female who recently had a screening colonoscopy with your team. Pathology showed benign hyperplastic polyps. Given her family history of colon polyps, please advise on appropriate surveillance interval.\n\nThank you for your guidance.",
    "Summary Note":
      "Thank you for your visit today, Ms. Raman. Your colonoscopy results confirmed that the polyps removed were benign. Based on guidelines, your next colonoscopy is recommended in 10 years, though we may consider earlier screening given your family history. Continue your high-fiber diet and healthy lifestyle. Your routine labs have been ordered. Please schedule your next annual exam in one year.",
  },

  // Sam Ortega - Male, 41 YO, Wellness exam, physical fitness
  "9": {
    "Well visit - Note":
      "Patient presents for wellness exam with focus on physical fitness. He is a 41-year-old male interested in optimizing exercise routine. Currently runs 3 times weekly and does bodyweight exercises. Considering training for half marathon. No current medical conditions. Takes fish oil supplement. Non-smoker, social drinker. Vitals: BP 120/76, HR 64. Physical exam shows fit individual with no limitations. Discussed graduated training program for half marathon. Cleared for increased physical activity. Return if concerns arise.",
    "Annual - Note":
      "Patient presents for annual wellness exam focused on physical fitness optimization. He is a 41-year-old male runner interested in training for half marathon. No medical conditions. Takes fish oil and vitamin D supplements. Non-smoker, 2-3 drinks weekly. Exercises regularly. Family history unremarkable. Vitals: BP 120/76, HR 64. Athletic build, BMI 24. Cardiovascular and musculoskeletal exams normal. Assessment: 1) Fitness optimization - cleared for increased training. 2) Preventive care. Plan: Routine labs. Exercise stress test not indicated given low risk. Discussed proper training progression. Follow-up one year.",
    "Referral Note":
      "Dear Dr. Martinez,\n\nI am referring Sam Ortega, a 41-year-old healthy male, for sports medicine consultation. He is an avid runner planning to train for a half marathon and would benefit from professional guidance on training optimization and injury prevention.\n\nPlease provide recommendations for training program and any indicated evaluations.\n\nThank you for your consultation.",
    "Summary Note":
      "Thank you for your visit today, Mr. Ortega. You are cleared for half marathon training. Remember to increase your mileage gradually (no more than 10% per week) to prevent injury. Proper hydration and nutrition are essential. Your lab work has been ordered. Contact us if you experience any chest pain, shortness of breath, or musculoskeletal injuries during training. Good luck with your race!",
  },

  // Lina Park - Female, 44 YO, Actinic keratoses evaluation
  "10": {
    "Well visit - Note":
      "Patient presents for wellness visit with concern for actinic keratoses. She is a 44-year-old female with multiple actinic keratoses on face and forearms noted over past year. History of significant sun exposure during childhood. Uses sunscreen now but inconsistently. Non-smoker. Exercises with tennis. No current medications. Vitals: BP 118/74, HR 68. Skin exam: Multiple rough, scaly patches on face and forearms consistent with actinic keratoses. Referred to dermatology for treatment. Counseled extensively on sun protection.",
    "Annual - Note":
      "Patient presents for annual exam with actinic keratoses concern. She is a 44-year-old female with increasing actinic keratoses, attributed to childhood sun exposure in sunny climate. Now uses SPF 30 but admits inconsistent application. No prior skin cancer. Family history negative for melanoma. Plays tennis outdoors. Non-smoker. No medications. Vitals normal. Skin exam confirms multiple AKs on sun-exposed areas. Assessment: 1) Actinic keratoses - dermatology referral. 2) Preventive care. Plan: Labs ordered. Dermatology consult for AK treatment. Emphasized daily SPF 50 use, protective clothing. Return one year.",
    "Referral Note":
      "Dear Dr. Lee,\n\nI am referring Lina Park, a 44-year-old female, for dermatologic evaluation and treatment of multiple actinic keratoses. She has developed numerous AKs on her face and forearms, attributed to significant childhood sun exposure.\n\nPlease evaluate for appropriate treatment modalities and provide recommendations for ongoing skin cancer prevention.\n\nThank you for your consultation.",
    "Summary Note":
      "Thank you for your visit today, Ms. Park. We have referred you to dermatology for treatment of your actinic keratoses. These are pre-cancerous lesions caused by sun exposure. It is extremely important that you use SPF 50 sunscreen daily on all exposed skin, wear protective clothing, and avoid peak sun hours (10am-4pm). Your routine labs have been ordered. Please follow up with dermatology as scheduled.",
  },

  // Omar Ali - Male, 40 YO, Lumbar spine injury follow-up
  "11": {
    "Well visit - Note":
      "Patient presents for wellness visit with lumbar spine follow-up. He is a 40-year-old male with history of L4-L5 disc herniation treated conservatively 2 years ago. Reports occasional low back stiffness, especially after prolonged sitting. No radiating leg pain. Does core strengthening exercises daily. Works at desk job. Takes ibuprofen occasionally. Vitals: BP 124/80, HR 70. Musculoskeletal exam shows mildly reduced lumbar flexion, no neurological deficits. Continue home exercise program. Ergonomic workstation review recommended.",
    "Annual - Note":
      "Patient presents for annual exam with lumbar spine injury follow-up. He is a 40-year-old male with L4-L5 disc herniation managed non-operatively. MRI 2 years ago showed moderate disc bulge without significant stenosis. Current symptoms limited to occasional stiffness with prolonged sitting. Compliant with core exercises. Uses standing desk intermittently. Takes ibuprofen PRN. Non-smoker. Family history unremarkable. Vitals: BP 124/80, HR 70. Exam: Lumbar spine with mild decreased ROM, strength and sensation intact. Assessment: 1) Lumbar disc disease - stable. 2) Preventive care. Plan: Continue exercises, ergonomic modifications. Labs ordered. Consider PT refresher if symptoms increase. Follow-up one year.",
    "Referral Note":
      "Dear Dr. Brown,\n\nI am referring Omar Ali, a 40-year-old male, for physical therapy re-evaluation for chronic lumbar disc disease. He was previously treated conservatively for L4-L5 disc herniation and would benefit from a refresher on core strengthening and ergonomic recommendations.\n\nPlease provide updated home exercise program and workplace ergonomic guidance.\n\nThank you for your consultation.",
    "Summary Note":
      "Thank you for your visit today, Mr. Ali. Your back condition remains stable. Continue your core strengthening exercises and maintain good posture, especially at your desk. Using a standing desk periodically is beneficial. Use ibuprofen as needed for discomfort. Consider a physical therapy visit if you notice any worsening symptoms. Your routine labs have been ordered. Please schedule your next annual exam in one year.",
  },

  // Maya Singh - Female, 43 YO, Cholesterol screening
  "12": {
    "Well visit - Note":
      "Patient presents for wellness visit focused on cholesterol screening. She is a 43-year-old female with family history of hyperlipidemia. Father had heart attack at age 55. Previous lipid panel 2 years ago showed borderline elevated LDL at 142. Has improved diet since then with more fish and vegetables, reduced red meat. Exercises with spin classes 3 times weekly. Non-smoker. Vitals: BP 116/72, HR 66. Physical exam unremarkable. BMI 24. Fasting lipid panel ordered today. Will discuss statin therapy if LDL remains elevated.",
    "Annual - Note":
      "Patient presents for annual exam with focus on cholesterol management. She is a 43-year-old female with family history of premature CAD (father MI at 55) and personal history of borderline hyperlipidemia. Has implemented lifestyle modifications over past 2 years. Diet improved, exercises regularly. No chest pain or exertional symptoms. Non-smoker. No medications. Vitals excellent. Exam unremarkable, no xanthomas. Assessment: 1) Hyperlipidemia - recheck today. 2) Cardiovascular risk assessment. 3) Preventive care. Plan: Fasting lipid panel. Calculate 10-year ASCVD risk. Discuss statin if LDL > 130 given family history. Follow-up for results.",
    "Referral Note":
      "Dear Dr. Thompson,\n\nI am referring Maya Singh, a 43-year-old female, for cardiology consultation regarding cardiovascular risk stratification. She has a significant family history of premature coronary artery disease (father MI at age 55) and borderline hyperlipidemia despite lifestyle modifications.\n\nPlease provide recommendations regarding lipid management and any indicated cardiac testing.\n\nThank you for your consultation.",
    "Summary Note":
      "Thank you for your visit today, Ms. Singh. Your fasting cholesterol panel has been drawn and results will be available in 2-3 days. Given your family history, we take your cardiovascular health seriously. Continue your excellent dietary habits and exercise routine. Depending on your results, we may discuss adding a cholesterol-lowering medication. We will contact you with results and next steps.",
  },

  // Carlos Ruiz - Male, 38 YO, Pre-operative clearance
  "13": {
    "Well visit - Note":
      "Patient presents for pre-operative medical clearance. He is a 38-year-old male scheduled for elective knee arthroscopy for meniscal repair. No significant medical history. No current medications. No allergies. Non-smoker. Drinks alcohol socially. Exercises regularly prior to knee injury. Vitals: BP 120/76, HR 68. Physical exam shows healthy male with right knee effusion and positive McMurray test. Cardiovascular and pulmonary exams normal. EKG normal sinus rhythm. Cleared for surgery with standard anesthesia. No additional cardiac workup required.",
    "Annual - Note":
      "Patient presents for pre-operative clearance serving as annual exam. He is a 38-year-old healthy male scheduled for right knee arthroscopy. Injured knee playing soccer 3 months ago. Otherwise no medical conditions. No medications or allergies. Non-smoker, social alcohol. Family history unremarkable. Vitals: BP 120/76, HR 68, SpO2 99%. Exam: HEENT normal, lungs clear, heart RRR no murmurs, right knee with effusion and mechanical symptoms. EKG: NSR, no abnormalities. Assessment: 1) Pre-op clearance - approved for elective surgery. 2) Preventive care. Plan: Labs (CBC, BMP, coags) ordered. Cleared for surgery. Follow-up post-operatively.",
    "Referral Note":
      "Dear Dr. Garcia,\n\nThis letter confirms pre-operative medical clearance for Carlos Ruiz, a 38-year-old healthy male, scheduled for right knee arthroscopy with meniscal repair.\n\nPre-operative evaluation reveals no significant medical conditions. EKG shows normal sinus rhythm. He is cleared for surgery with standard anesthesia protocols.\n\nPlease contact me with any questions.\n\nBest regards,\nPrimary Care Provider",
    "Summary Note":
      "Thank you for your visit today, Mr. Ruiz. You have been medically cleared for your knee surgery. Your pre-operative labs and EKG were normal. Please follow all pre-operative instructions from your surgeon, including fasting guidelines. After surgery, follow the rehabilitation plan prescribed by your orthopedic surgeon. Contact our office if you have any medical concerns during your recovery.",
  },

  // Nadia Petrova - Female, 42 YO, Annual physical exam
  "14": {
    "Well visit - Note":
      "Patient presents for routine wellness visit. She is a 42-year-old female in excellent overall health. Reports high energy and no current concerns. Exercises 5 days per week including running and Pilates. Non-smoker. Occasional wine with dinner. Balanced diet with emphasis on whole foods. Takes vitamin D supplement. No chronic conditions. Vitals: BP 108/68, HR 58. Physical exam unremarkable with athletic habitus. All preventive care up to date. Continue healthy lifestyle. Return in one year.",
    "Annual - Note":
      "Patient presents for annual physical examination. She is a 42-year-old female with no significant medical history. Extremely health-conscious with regular exercise (running, Pilates) and balanced diet. Non-smoker, minimal alcohol. Takes vitamin D. Menses regular. Last mammogram 1 year ago normal. Last Pap smear 2 years ago normal. Family history: Mother with osteoporosis. Vitals excellent: BP 108/68, HR 58. Physical exam completely normal. Assessment: Healthy female for age-appropriate preventive care. Plan: Routine labs. Discussed bone health given family history. Mammogram due. Continue healthy lifestyle. Follow-up one year.",
    "Referral Note":
      "Dear Colleague,\n\nI am referring Nadia Petrova, a 42-year-old healthy female, for evaluation as clinically indicated. The patient maintains excellent health through regular exercise and healthy lifestyle.\n\nPlease see attached documentation for relevant clinical details.\n\nThank you for your consultation.",
    "Summary Note":
      "Thank you for your visit today, Ms. Petrova. Your annual physical shows you are in excellent health. Continue your outstanding exercise regimen and healthy diet. Your lab results will be sent when available. Please schedule your mammogram as it is due this year. Given your family history of osteoporosis, continue vitamin D supplementation and consider calcium intake. We look forward to seeing you at your next annual exam in one year.",
  },
};

// ============================================================================
// Locale-specific section content helpers
// ============================================================================

export function getEnGbHealthCheckContentForSectionId(
  sectionId: string,
  medical: MedicalContentBundle
): string | undefined {
  const medicalContent = medical.medicalContent;
  const healthCheck =
    medicalContent && typeof medicalContent === "object"
      ? (medicalContent as Record<string, unknown>)["healthCheck"]
      : undefined;

  if (!healthCheck || typeof healthCheck !== "object") {
    return undefined;
  }

  const value = (healthCheck as Record<string, unknown>)[sectionId];
  return typeof value === "string" ? value : undefined;
}

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

/**
 * Gets patient-specific content for a given section title.
 * Falls back to generic dictation content if patient-specific content is not found.
 * @param sectionTitle The section title to get content for
 * @param patientId The patient ID to get content for (optional)
 * @returns The content for the section
 */
export const getPatientContentForSection = (
  sectionTitle: string,
  patientId?: string
): string => {
  // Try to get patient-specific content first
  if (patientId && PATIENT_DOCUMENT_CONTENT[patientId]) {
    const patientContent = PATIENT_DOCUMENT_CONTENT[patientId][sectionTitle];
    if (patientContent) {
      return patientContent;
    }
  }
  // Fall back to generic dictation content
  return getDictationContentForSection(sectionTitle);
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
            content: DICTATION_CONTENT_MAP["Referral Note"],
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
