/**
 * DocumentCard Component
 * Renders an individual document card with sections, orders, and AI content generation
 */

import * as React from "react";
import {
  Checkbox,
  Dialog,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Textarea,
  mergeClasses,
} from "@fluentui/react-components";
import type {
  CheckboxOnChangeData,
  TextareaOnChangeData,
} from "@fluentui/react-components";
import {
  ChevronDown12Regular,
  ChevronRight12Regular,
  MoreVertical24Regular,
  ArrowExportUp24Regular,
  ArrowSync24Regular,
  History24Regular,
  Cart20Regular,
  SelectAllOn24Regular,
  Copy24Regular,
  Delete24Regular,
  Delete20Regular,
  PersonFeedbackRegular,
  DocumentCopy16Regular,
  Copy20Regular,
  AddCircleRegular,
  Dismiss24Regular,
} from "@fluentui/react-icons";

import type {
  DocumentCardProps,
  OrderSimulationState,
} from "./DocumentCard.types";
import type { OrderItem } from "../DocumentComponent.types";
import { getDictationContentForSection } from "../DocumentComponent.constants";

/**
 * DocumentCard component renders a single document card with:
 * - Expandable sections with checkboxes
 * - Order management (add, edit, delete)
 * - AI-generated content (notes and orders)
 * - Dictation simulation
 * - Skeleton loading states
 */
function DocumentCard({
  document,
  styles,
  isExpanded,
  checkboxState,
  onDocumentClick,
  onDocumentCheckToggle,
  onSectionToggle,
  onSectionContentChange,
  registerDocumentRef,
  micMode,
  isRecording,
  dictationState = "off",
  cursorTooltipHandlers,
  setTooltipVisible,
  updateTooltipFromCaret,
  onStartSectionDictation,
  onStopSectionDictation,
  onOrderCountChange,
  onDeleteDocument,
  showSkeleton = false,
  isPronounReplacement = false,
  isDraftingReferralLetter = false,
  autoFocus = false,
  onAutoFocusConsumed,
  onOrderDelete,
}: DocumentCardProps) {
  // Note: micMode and isRecording are currently unused but kept for API compatibility
  void micMode;
  void isRecording;

  // Track focused section for dictation
  const [focusedSectionId, setFocusedSectionId] = React.useState<string | null>(
    null
  );
  const [focusedOrderId, setFocusedOrderId] = React.useState<string | null>(
    null
  );

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [orderToDelete, setOrderToDelete] = React.useState<{
    sectionId: string;
    orderId: string;
  } | null>(null);

  // Refs for order dictation
  const simulatedOrdersRef = React.useRef<Set<string>>(new Set());
  const orderDictationIntervalRef = React.useRef<number | null>(null);
  const orderTooltipFadeTimeoutRef = React.useRef<number | null>(null);
  const currentOrderSimulationRef = React.useRef<OrderSimulationState | null>(
    null
  );
  const orderInputRefs = React.useRef<
    Record<string, HTMLTextAreaElement | null>
  >({});
  const previousShowSkeletonRef = React.useRef(showSkeleton);

  // State to track which sections have highlighted pronouns
  const [highlightedSections, setHighlightedSections] = React.useState<
    Set<string>
  >(new Set());

  // Ref for auto-focus on first section textarea
  const firstSectionTextareaRef = React.useRef<HTMLTextAreaElement | null>(
    null
  );

  // Auto-focus effect: focus the first section textarea when autoFocus is true and document is expanded
  React.useEffect(() => {
    if (autoFocus && isExpanded && firstSectionTextareaRef.current) {
      // Small delay to ensure the DOM is fully rendered
      const timeoutId = setTimeout(() => {
        firstSectionTextareaRef.current?.focus();
        onAutoFocusConsumed?.(document.id);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [autoFocus, isExpanded, document.id, onAutoFocusConsumed]);

  // Pool of AI-generated orders
  const AI_ORDER_POOL = React.useMemo(
    () => [
      "Check BMP and CBC in 2 weeks.",
      "Order echocardiogram to assess cardiac function.",
      "Schedule follow-up appointment in 4 weeks.",
      "Prescribe metoprolol succinate 50 mg daily.",
      "Order chest X-ray PA and lateral.",
      "Refer to cardiology for further evaluation.",
      "Start lisinopril 10 mg daily for hypertension.",
      "Order lipid panel fasting.",
      "Discontinue aspirin due to bleeding risk.",
      "Order TSH and free T4.",
      "Prescribe atorvastatin 40 mg at bedtime.",
      "Refer to nephrology.",
      "Start furosemide 20 mg daily.",
    ],
    []
  );

  // Pool of AI-generated section content for Notes
  const AI_SECTION_CONTENT_POOL: Record<string, string[]> = React.useMemo(
    () => ({
      Note: [
        "Patient presents for routine wellness examination. Reports overall good health with no acute concerns. Has been maintaining regular exercise 3 times per week and following a balanced diet. Denies chest pain, shortness of breath, or palpitations. Sleep quality is adequate at 7-8 hours per night. Current medications include lisinopril 10 mg daily for hypertension with good BP control. No medication side effects reported. Discussed preventive health measures including colorectal cancer screening and flu vaccination.",
        "Annual physical examination for established patient. Currently feeling well with no new complaints. Chronic conditions including hypertension and hyperlipidemia remain stable on current regimen. Recent labs show HbA1c 5.6%, lipid panel within target. BMI 26.2, down from 27.1 last year. Patient reports improved dietary habits and increased physical activity. Reviewed medication list for accuracy. Up to date on immunizations. Discussed age-appropriate cancer screenings.",
        "Wellness visit for preventive care. Patient reports general good health. Vitals today: BP 128/78, HR 72, SpO2 98% on room air. Physical exam unremarkable. Depression screening (PHQ-9) score 2, negative. Alcohol use screening (AUDIT-C) score 1, low risk. Discussed smoking cessation resources as patient reports occasional social smoking. Reviewed family history noting new diagnosis of colon cancer in sibling - referred for early colonoscopy.",
        "Routine health maintenance visit. Patient is a well-appearing adult in no acute distress. Comprehensive review of systems negative except for occasional mild headaches relieved with acetaminophen. Physical examination within normal limits. Labs reviewed: CBC normal, CMP normal, TSH 2.1. Immunizations current. Discussed advance directive planning and healthcare proxy designation. Follow-up scheduled in one year for annual wellness exam.",
      ],
      "Well visit - Note": [
        "Patient presents for routine well visit. She reports feeling well overall with no acute concerns. Has been maintaining a healthy lifestyle with regular exercise 3 times per week and following a balanced diet. Denies chest pain, shortness of breath, palpitations, or syncope. No recent weight changes. Sleep is adequate at 7-8 hours per night. Stress levels are manageable. Vitals: BP 122/78 mmHg, HR 68 bpm, Temp 98.4°F, SpO2 99% on room air. General: Well-appearing, in no acute distress. Cardiovascular: Regular rate and rhythm, no murmurs. Lungs: Clear to auscultation bilaterally. Labs reviewed - lipid panel and CBC within normal limits. Preventive care discussed including flu vaccine and skin cancer prevention. Continue current lifestyle habits. Return in 1 year or sooner if concerns arise.",
        "Well child visit for routine health maintenance. Patient appears healthy and developmentally appropriate. Growth parameters within normal percentiles. Immunizations up to date per schedule. Developmental milestones met. Vision and hearing screening passed. Anticipatory guidance provided regarding nutrition, physical activity, and safety. No acute concerns identified. Follow-up for next well visit as scheduled.",
        "Routine wellness examination. Patient reports feeling good with no new health concerns. Currently taking prenatal vitamins daily. Exercising regularly with walking and prenatal yoga. Diet is balanced with adequate hydration. Sleep slightly disrupted but manageable. Vitals stable. Fundal height appropriate for gestational age. Fetal heart tones present and reassuring. Routine labs reviewed - all within normal limits. Discussed birth plan preferences and upcoming glucose screening. Next visit scheduled in 4 weeks.",
      ],
      "Annual - Note": [
        "Patient presents for annual physical examination. He reports overall good health with well-controlled chronic conditions. Hypertension has been stable on current medications with home BP readings averaging 130/82 mmHg. Reports compliance with medication regimen and dietary modifications. Exercises by walking 30 minutes daily. Denies any new symptoms including chest pain, dyspnea, dizziness, or visual changes. Vitals: BP 132/84 mmHg, HR 74 bpm, SpO2 98% on room air. Physical exam unremarkable. Labs: HbA1c 5.8% indicating prediabetes, LDL 128 slightly elevated, Vitamin D 28 low-normal. Assessment: 1) Hypertension - controlled, continue current regimen. 2) Prediabetes - lifestyle modifications, recheck in 3 months. 3) Borderline hyperlipidemia - trial lifestyle changes. Flu vaccine and tetanus booster administered today. Follow up in 3 months for lab recheck.",
        "Annual comprehensive health evaluation. Patient is a 58-year-old male with history of type 2 diabetes and hypertension. Reports good medication adherence. Home glucose logs show fasting readings 110-130 mg/dL. Completed recommended colonoscopy - results pending. Current medications reviewed and reconciled. Vitals: BP 126/78, HR 70, BMI 27.8. Physical exam notable for mild peripheral neuropathy in feet bilaterally. Labs: HbA1c 7.1% at goal, eGFR 72 stable, microalbumin/creatinine ratio normal. Continue current diabetes regimen. Reinforce foot care education. Ophthalmology referral for annual diabetic eye exam. Return in 6 months.",
        "Annual health assessment for preventive care. Patient reports general well-being with stable chronic conditions. Osteoarthritis symptoms managed with physical therapy and occasional acetaminophen. DEXA scan shows osteopenia, currently on calcium and vitamin D supplementation. Mammogram from last month was negative. Due for shingles vaccine - administered today. Discussed fall prevention strategies and home safety modifications. Mental health screening negative for depression and anxiety. Cognitive screening (Mini-Cog) within normal limits. Advance directive on file and confirmed. Continue current management plan. Annual follow-up scheduled.",
      ],
      "History of Present Illness": [
        "Patient presents with a three-day history of persistent cough and mild fever. Reports experiencing increased fatigue and occasional shortness of breath during physical activity. Denies chest pain or difficulty breathing at rest. Has been taking over-the-counter medication with minimal relief. No recent travel or known sick contacts reported.",
        "41-year-old male with chief complaint of headaches for the past 2 weeks. Describes pain as bilateral, pressure-like, rated 6/10, worse in the morning. Associated with mild nausea but no vomiting. Denies visual changes, neck stiffness, or fever. Takes ibuprofen with partial relief.",
        "Patient reports worsening lower back pain over the past month, radiating to left leg. Pain is sharp, rated 7/10, aggravated by sitting and bending. Reports tingling in left foot. No bowel or bladder dysfunction. Has history of lumbar disc herniation.",
        "41-year-old male presents with progressive dyspnea on exertion over 3 months. Now unable to climb one flight of stairs without stopping. Associated with bilateral leg swelling. Denies orthopnea or PND. History of hypertension and diabetes mellitus type 2.",
      ],
      "Physical Exam": [
        "Vital signs: Temperature 99.2°F, Blood pressure 128/82 mmHg, Heart rate 78 bpm, Respiratory rate 16/min, SpO2 97% on room air. General: Alert and oriented, no acute distress. HEENT: Oropharynx mildly erythematous, no exudates. Neck: Supple, no lymphadenopathy. Lungs: Scattered rhonchi bilaterally, no wheezes. Heart: Regular rate and rhythm, no murmurs. Abdomen: Soft, non-tender.",
        "BP 142/88, HR 72, RR 14, SpO2 98% RA. General: Well-appearing, comfortable. HEENT: PERRLA, EOMI, TMs clear bilaterally. Neck: No thyromegaly, no JVD. CV: RRR, S1/S2 normal, no murmurs. Lungs: CTAB, no rales or wheezes. Extremities: No edema, pulses 2+ throughout.",
        "Vitals stable. Patient appears fatigued but in no acute distress. Cardiac exam reveals irregular rhythm with variable intensity S1. Lungs with bibasilar crackles. Abdomen benign. Lower extremities with 2+ pitting edema bilaterally to mid-calf. Skin warm and dry.",
        "T 98.6°F, BP 118/76, HR 68, RR 12. Neurological: Alert, oriented x4. Cranial nerves II-XII intact. Motor strength 5/5 throughout. Sensation intact. DTRs 2+ and symmetric. Gait steady. Romberg negative. No pronator drift.",
      ],
      Results: [
        "CBC: WBC 11.2 (mildly elevated), Hgb 14.1, Plt 245. BMP within normal limits. Chest X-ray shows mild peribronchial thickening, no consolidation or effusion. Rapid strep negative. COVID-19 PCR pending.",
        "Labs: WBC 8.2, Hgb 12.8, Plt 198. BMP: Na 140, K 4.2, Cl 102, CO2 24, BUN 18, Cr 1.0, Glucose 156. HbA1c 7.8%. Lipid panel: TC 245, LDL 158, HDL 42, TG 180. TSH 2.4.",
        "ECG: Normal sinus rhythm, rate 74, no ST changes. Echo: EF 35-40%, moderate LV dilation, mild MR. BNP 892. Troponin negative x2. CXR: Mild cardiomegaly, vascular congestion.",
        "MRI lumbar spine: L4-L5 disc herniation with left lateral recess stenosis and compression of left L5 nerve root. No spinal cord compression. Mild degenerative changes at L3-L4.",
      ],
      "Assessment & Plan": [
        "Assessment: Acute bronchitis, likely viral etiology. Plan: 1) Supportive care with rest and hydration. 2) Guaifenesin 400mg every 4 hours as needed for cough. 3) Acetaminophen 650mg every 6 hours as needed for fever. 4) Return if symptoms worsen or persist beyond 10 days. 5) Follow up on COVID results.",
        "1. Hypertension, uncontrolled - Increase lisinopril to 20mg daily, add amlodipine 5mg daily. 2. Type 2 DM, suboptimal control - Increase metformin to 1000mg BID, dietary counseling. 3. Hyperlipidemia - Start atorvastatin 40mg at bedtime. 4. Follow up in 4 weeks with repeat labs.",
        "1. Heart failure with reduced EF (HFrEF) - Start lisinopril 5mg daily, carvedilol 6.25mg BID, furosemide 40mg daily. Low sodium diet, fluid restriction 2L/day. 2. Refer to cardiology for further management. 3. Daily weights, call if gain >3 lbs in 24 hours.",
        "L5 radiculopathy secondary to L4-L5 disc herniation. Plan: 1) Physical therapy referral. 2) Gabapentin 300mg TID for neuropathic pain. 3) Activity modification, avoid heavy lifting. 4) NSAIDs contraindicated due to renal function. 5) Neurosurgery referral if no improvement in 6 weeks.",
      ],
    }),
    []
  );

  // Local state for AI-generated section content (for Notes)
  const [aiSectionContent, setAiSectionContent] = React.useState<
    Record<string, string>
  >({});

  // Helper function to replace pronouns with they/them
  const replacePronounsWithTheyThem = React.useCallback(
    (text: string): string => {
      let result = text;

      // Replace pronouns first - wrap in span with blue color
      result = result
        .replace(
          /\bHe\b/g,
          '<span style="color: #0078D4; font-weight: 600;">They</span>'
        )
        .replace(
          /\bShe\b/g,
          '<span style="color: #0078D4; font-weight: 600;">They</span>'
        )
        .replace(
          /\bhe\b/g,
          '<span style="color: #0078D4; font-weight: 600;">they</span>'
        )
        .replace(
          /\bshe\b/g,
          '<span style="color: #0078D4; font-weight: 600;">they</span>'
        )
        .replace(
          /\bHim\b/g,
          '<span style="color: #0078D4; font-weight: 600;">Them</span>'
        )
        .replace(
          /\bHer\b(?!\s+\w)/g,
          '<span style="color: #0078D4; font-weight: 600;">Them</span>'
        )
        .replace(
          /\bhim\b/g,
          '<span style="color: #0078D4; font-weight: 600;">them</span>'
        )
        .replace(
          /\bher\b(?!\s+\w)/g,
          '<span style="color: #0078D4; font-weight: 600;">them</span>'
        )
        .replace(
          /\bHis\b/g,
          '<span style="color: #0078D4; font-weight: 600;">Their</span>'
        )
        .replace(
          /\bHer\s+(?=\w)/g,
          '<span style="color: #0078D4; font-weight: 600;">Their</span> '
        )
        .replace(
          /\bhis\b/g,
          '<span style="color: #0078D4; font-weight: 600;">their</span>'
        )
        .replace(
          /\bher\s+(?=\w)/g,
          '<span style="color: #0078D4; font-weight: 600;">their</span> '
        )
        .replace(
          /\bHimself\b/g,
          '<span style="color: #0078D4; font-weight: 600;">Themselves</span>'
        )
        .replace(
          /\bHerself\b/g,
          '<span style="color: #0078D4; font-weight: 600;">Themselves</span>'
        )
        .replace(
          /\bhimself\b/g,
          '<span style="color: #0078D4; font-weight: 600;">themselves</span>'
        )
        .replace(
          /\bherself\b/g,
          '<span style="color: #0078D4; font-weight: 600;">themselves</span>'
        );

      // Fix verb conjugations - wrap only the changed verb in blue
      result = result
        .replace(
          /\b(They|they)\s+is\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">are</span>'
        )
        .replace(
          /\b(They|they)\s+was\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">were</span>'
        )
        .replace(
          /\b(They|they)\s+has\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">have</span>'
        )
        .replace(
          /\b(They|they)\s+does\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">do</span>'
        )
        .replace(
          /\b(They|they)\s+goes\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">go</span>'
        )
        .replace(
          /\b(They|they)\s+describes\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">describe</span>'
        )
        .replace(
          /\b(They|they)\s+denies\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">deny</span>'
        )
        .replace(
          /\b(They|they)\s+reports\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">report</span>'
        )
        .replace(
          /\b(They|they)\s+presents\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">present</span>'
        )
        .replace(
          /\b(They|they)\s+appears\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">appear</span>'
        )
        .replace(
          /\b(They|they)\s+experiences\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">experience</span>'
        )
        .replace(
          /\b(They|they)\s+undergoes\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">undergo</span>'
        )
        .replace(
          /\b(They|they)\s+continues\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">continue</span>'
        )
        .replace(
          /\b(They|they)\s+remains\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">remain</span>'
        )
        .replace(
          /\b(They|they)\s+requires\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">require</span>'
        )
        .replace(
          /\b(They|they)\s+shows\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">show</span>'
        )
        .replace(
          /\b(They|they)\s+exhibits\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">exhibit</span>'
        )
        .replace(
          /\b(They|they)\s+demonstrates\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">demonstrate</span>'
        )
        .replace(
          /\b(They|they)\s+complains\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">complain</span>'
        )
        .replace(
          /\b(They|they)\s+notes\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">note</span>'
        )
        .replace(
          /\b(They|they)\s+mentions\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">mention</span>'
        )
        .replace(
          /\b(They|they)\s+states\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">state</span>'
        )
        .replace(
          /\b(They|they)\s+indicates\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">indicate</span>'
        )
        .replace(
          /\b(They|they)\s+suggests\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">suggest</span>'
        )
        .replace(
          /\b(They|they)\s+feels\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">feel</span>'
        )
        .replace(
          /\b(They|they)\s+needs\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">need</span>'
        )
        .replace(
          /\b(They|they)\s+wants\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">want</span>'
        )
        .replace(
          /\b(They|they)\s+takes\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">take</span>'
        )
        .replace(
          /\b(They|they)\s+uses\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">use</span>'
        )
        .replace(
          /\b(They|they)\s+works\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">work</span>'
        )
        .replace(
          /\b(They|they)\s+lives\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">live</span>'
        )
        .replace(
          /\b(They|they)\s+smokes\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">smoke</span>'
        )
        .replace(
          /\b(They|they)\s+drinks\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">drink</span>'
        )
        .replace(
          /\b(They|they)\s+exercises\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">exercise</span>'
        )
        .replace(
          /\b(They|they)\s+engages\b/g,
          '$1 <span style="color: #0078D4; font-weight: 600;">engage</span>'
        );

      return result;
    },
    []
  );

  // Local state for order items within sections
  const [sectionOrders, setSectionOrders] = React.useState<
    Record<string, OrderItem[]>
  >(() => {
    const initialOrders: Record<string, OrderItem[]> = {};
    document.sections?.forEach((section) => {
      if (section.orderItems) {
        initialOrders[section.id] = section.orderItems;
      }
    });
    return initialOrders;
  });

  // Notify parent when order count changes
  React.useEffect(() => {
    if (document.type === "orders" && onOrderCountChange) {
      const totalOrders = Object.values(sectionOrders).reduce(
        (sum, orders) => sum + orders.length,
        0
      );
      onOrderCountChange(document.id, totalOrders);
    }
  }, [sectionOrders, document.id, document.type, onOrderCountChange]);

  // Generate random AI orders when skeleton animation ends
  React.useEffect(() => {
    const wasShowingSkeleton = previousShowSkeletonRef.current;
    previousShowSkeletonRef.current = showSkeleton;

    // Only regenerate orders if skeleton just finished AND not a pronoun replacement AND not drafting referral letter
    if (
      wasShowingSkeleton &&
      !showSkeleton &&
      document.type === "orders" &&
      !isPronounReplacement &&
      !isDraftingReferralLetter
    ) {
      // For task1, always generate exactly 5 orders; otherwise random 3-8
      const isTask1 = window.location.hash.includes("task1");
      const numOrders = isTask1 ? 5 : Math.floor(Math.random() * 6) + 3;
      const shuffled = [...AI_ORDER_POOL].sort(() => Math.random() - 0.5);
      const selectedOrders = shuffled.slice(0, numOrders);

      const newOrders: OrderItem[] = selectedOrders.map((text, index) => ({
        id: `ai-order-${Date.now()}-${index}`,
        text,
        code:
          Math.random() > 0.6
            ? String(90000 + Math.floor(Math.random() * 10000))
            : undefined,
      }));

      const firstSectionId = document.sections?.[0]?.id;
      if (firstSectionId) {
        setSectionOrders((prev) => ({
          ...prev,
          [firstSectionId]: newOrders,
        }));
      }
    }

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
      const newContent: Record<string, string> = {};
      const sectionsWithHighlights = new Set<string>();

      document.sections?.forEach((section) => {
        const currentContent = aiSectionContent[section.id] || section.content;
        if (currentContent) {
          newContent[section.id] = replacePronounsWithTheyThem(currentContent);
          sectionsWithHighlights.add(section.id);
        }
      });

      setAiSectionContent((prev) => ({ ...prev, ...newContent }));
      setHighlightedSections(sectionsWithHighlights);
    }

    // Replace pronouns in Order items when pronoun replacement skeleton ends
    if (
      wasShowingSkeleton &&
      !showSkeleton &&
      document.type === "orders" &&
      isPronounReplacement
    ) {
      setSectionOrders((prev) => {
        const newOrders: Record<string, OrderItem[]> = {};
        Object.entries(prev).forEach(([sectionId, orders]) => {
          newOrders[sectionId] = orders.map((order) => ({
            ...order,
            text: replacePronounsWithTheyThem(order.text),
          }));
        });
        return newOrders;
      });
    }

    // Generate content for Referral Letter when drafting referral letter skeleton ends
    if (
      wasShowingSkeleton &&
      !showSkeleton &&
      document.type === "referral-letter" &&
      isDraftingReferralLetter
    ) {
      const referralContent = `Dear Dr. Johnson,

I am writing to refer my patient, Ellis Turner, a 41-year-old male, for cardiology evaluation and follow-up management of his recent ST-elevation myocardial infarction (STEMI).

Mr. Turner presented to the emergency department with acute chest pain and was diagnosed with an inferior wall STEMI. He underwent successful cardiac catheterization and is currently stable on medical management.

Current medications:
- Aspirin 81 mg daily
- Clopidogrel 75 mg daily
- Metoprolol succinate 50 mg daily
- Lisinopril 20 mg daily
- Atorvastatin 80 mg at bedtime
- Spironolactone 25 mg daily

I would appreciate your expert evaluation for ongoing cardiac rehabilitation and long-term management recommendations.

Thank you for your assistance in the care of this patient.

Sincerely,
Dr. Smith`;

      const newContent: Record<string, string> = {};
      document.sections?.forEach((section) => {
        newContent[section.id] = referralContent;
      });
      setAiSectionContent((prev) => ({ ...prev, ...newContent }));
    }
  }, [
    showSkeleton,
    document.type,
    document.sections,
    AI_ORDER_POOL,
    AI_SECTION_CONTENT_POOL,
    isPronounReplacement,
    isDraftingReferralLetter,
    aiSectionContent,
    replacePronounsWithTheyThem,
  ]);

  // Handle section focus - start dictation if in dictation mode and recording
  const handleSectionFocus = React.useCallback(
    (sectionId: string, sectionTitle: string) => {
      setFocusedSectionId(sectionId);

      const section = document.sections?.find((s) => s.id === sectionId);
      const currentContent =
        aiSectionContent[sectionId] || section?.content || "";
      const fullContent = getDictationContentForSection(sectionTitle);

      if (dictationState === "on" && currentContent !== fullContent) {
        onStartSectionDictation?.(document.id, sectionId, sectionTitle);
      }
    },
    [
      document.id,
      document.sections,
      dictationState,
      onStartSectionDictation,
      aiSectionContent,
    ]
  );

  // Stop dictation on blur
  const handleSectionBlur = React.useCallback(() => {
    setFocusedSectionId(null);
    onStopSectionDictation?.();
  }, [onStopSectionDictation]);

  // Order dictation content
  const getOrderDictationContent = React.useCallback(
    (orderIndex: number): string => {
      const orderTexts = [
        "Start spironolactone 25 mg daily.",
        "Continue metoprolol succinate 50 mg daily.",
        "Increase lisinopril to 20 mg daily.",
        "Order echocardiogram.",
        "Schedule follow-up in 2 weeks.",
      ];
      return orderTexts[orderIndex % orderTexts.length] || "New order.";
    },
    []
  );

  // Trigger dictation when dictationState changes to "on" and a section is already focused
  React.useEffect(() => {
    if (dictationState === "on" && focusedSectionId) {
      const section = document.sections?.find((s) => s.id === focusedSectionId);
      if (!section) return;

      const currentContent =
        aiSectionContent[focusedSectionId] || section.content || "";
      const fullContent = getDictationContentForSection(section.title);

      if (currentContent !== fullContent) {
        onStartSectionDictation?.(document.id, focusedSectionId, section.title);
      }
    }
  }, [
    dictationState,
    focusedSectionId,
    document.id,
    document.sections,
    aiSectionContent,
    onStartSectionDictation,
  ]);

  // Trigger order dictation when dictationState changes to "on" and an order is already focused
  React.useEffect(() => {
    if (dictationState === "on" && focusedOrderId) {
      for (const section of document.sections || []) {
        if (section.orderItems) {
          const orderIndex = section.orderItems.findIndex(
            (o) => o.id === focusedOrderId
          );
          if (orderIndex !== -1) {
            const orderKey = `${document.id}-${section.id}-${focusedOrderId}`;
            const orders =
              sectionOrders[section.id] || section.orderItems || [];
            const order = orders.find((o) => o.id === focusedOrderId);

            if (
              !simulatedOrdersRef.current.has(orderKey) &&
              (!order || order.text.trim() === "")
            ) {
              simulatedOrdersRef.current.add(orderKey);
              const fullText = getOrderDictationContent(orderIndex);
              currentOrderSimulationRef.current = {
                sectionId: section.id,
                orderId: focusedOrderId,
                charIndex: 0,
                fullText,
              };

              if (orderDictationIntervalRef.current) {
                clearInterval(orderDictationIntervalRef.current);
              }

              const typingSpeed = 30;

              orderDictationIntervalRef.current = window.setInterval(() => {
                if (!currentOrderSimulationRef.current) return;

                const {
                  sectionId: secId,
                  orderId: oId,
                  charIndex,
                  fullText: text,
                } = currentOrderSimulationRef.current;

                if (charIndex <= text.length) {
                  const currentText = text.substring(0, charIndex);
                  setSectionOrders((prev) => ({
                    ...prev,
                    [secId]: (prev[secId] || []).map((o) =>
                      o.id === oId ? { ...o, text: currentText } : o
                    ),
                  }));
                  currentOrderSimulationRef.current.charIndex++;
                } else {
                  if (orderDictationIntervalRef.current) {
                    clearInterval(orderDictationIntervalRef.current);
                    orderDictationIntervalRef.current = null;
                  }
                  currentOrderSimulationRef.current = null;
                }
              }, typingSpeed);
            }
            break;
          }
        }
      }
    }
  }, [
    dictationState,
    focusedOrderId,
    document.id,
    document.sections,
    sectionOrders,
    getOrderDictationContent,
  ]);

  // Start dictation for an order
  const startOrderDictation = React.useCallback(
    (sectionId: string, orderId: string, orderIndex: number) => {
      const orderKey = `${document.id}-${sectionId}-${orderId}`;

      if (simulatedOrdersRef.current.has(orderKey)) return;
      if (currentOrderSimulationRef.current) return;

      const orders = sectionOrders[sectionId] || [];
      const order = orders.find((o) => o.id === orderId);
      if (order && order.text.trim() !== "") return;

      simulatedOrdersRef.current.add(orderKey);
      const fullText = getOrderDictationContent(orderIndex);
      currentOrderSimulationRef.current = {
        sectionId,
        orderId,
        charIndex: 0,
        fullText,
      };

      if (orderDictationIntervalRef.current) {
        clearInterval(orderDictationIntervalRef.current);
      }

      // Clear any existing fade timeout
      if (orderTooltipFadeTimeoutRef.current) {
        clearTimeout(orderTooltipFadeTimeoutRef.current);
        orderTooltipFadeTimeoutRef.current = null;
      }

      // Hide tooltip when order typing starts - use setTimeout to ensure it happens
      // after all sync state updates and React's batched renders
      setTimeout(() => {
        setTooltipVisible?.(false);
      }, 0);

      const typingSpeed = 30;

      orderDictationIntervalRef.current = window.setInterval(() => {
        if (!currentOrderSimulationRef.current) return;

        const {
          sectionId: secId,
          orderId: oId,
          charIndex,
          fullText: text,
        } = currentOrderSimulationRef.current;

        if (charIndex <= text.length) {
          const currentText = text.substring(0, charIndex);
          setSectionOrders((prev) => ({
            ...prev,
            [secId]:
              prev[secId]?.map((order) =>
                order.id === oId ? { ...order, text: currentText } : order
              ) || [],
          }));
          currentOrderSimulationRef.current.charIndex++;
        } else {
          if (orderDictationIntervalRef.current) {
            clearInterval(orderDictationIntervalRef.current);
            orderDictationIntervalRef.current = null;
          }
          currentOrderSimulationRef.current = null;

          // Show tooltip after 1 second delay when typing stops
          orderTooltipFadeTimeoutRef.current = window.setTimeout(() => {
            const inputRef = orderInputRefs.current[`${secId}-${oId}`];
            if (inputRef) {
              updateTooltipFromCaret?.(inputRef);
            }
            setTooltipVisible?.(true);
            orderTooltipFadeTimeoutRef.current = null;
          }, 1000);
        }
      }, typingSpeed);
    },
    [
      document.id,
      getOrderDictationContent,
      sectionOrders,
      setTooltipVisible,
      updateTooltipFromCaret,
    ]
  );

  // Stop order dictation
  const stopOrderDictation = React.useCallback(() => {
    if (orderDictationIntervalRef.current) {
      clearInterval(orderDictationIntervalRef.current);
      orderDictationIntervalRef.current = null;
    }
    if (orderTooltipFadeTimeoutRef.current) {
      clearTimeout(orderTooltipFadeTimeoutRef.current);
      orderTooltipFadeTimeoutRef.current = null;
    }
    currentOrderSimulationRef.current = null;
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (orderDictationIntervalRef.current) {
        clearInterval(orderDictationIntervalRef.current);
      }
      if (orderTooltipFadeTimeoutRef.current) {
        clearTimeout(orderTooltipFadeTimeoutRef.current);
      }
    };
  }, []);

  // Order item handlers
  const handleOrderChange = React.useCallback(
    (sectionId: string, orderId: string, text: string) => {
      setSectionOrders((prev) => ({
        ...prev,
        [sectionId]:
          prev[sectionId]?.map((order) =>
            order.id === orderId ? { ...order, text } : order
          ) || [],
      }));
    },
    []
  );

  const handleAddOrder = React.useCallback((sectionId: string) => {
    setSectionOrders((prev) => {
      const currentOrders = prev[sectionId] || [];
      const newId = String(currentOrders.length + 1);
      const newOrders = [...currentOrders, { id: newId, text: "" }];

      setTimeout(() => {
        const inputKey = `${sectionId}-${newId}`;
        const input = orderInputRefs.current[inputKey];
        if (input) {
          input.focus();
        }
      }, 0);

      return {
        ...prev,
        [sectionId]: newOrders,
      };
    });
  }, []);

  const handleDeleteOrder = React.useCallback(
    (sectionId: string, orderId: string) => {
      setOrderToDelete({ sectionId, orderId });
      setDeleteDialogOpen(true);
    },
    []
  );

  const handleConfirmDelete = React.useCallback(() => {
    if (orderToDelete) {
      setSectionOrders((prev) => ({
        ...prev,
        [orderToDelete.sectionId]:
          prev[orderToDelete.sectionId]?.filter(
            (order) => order.id !== orderToDelete.orderId
          ) || [],
      }));
      // Notify parent that an order was deleted
      onOrderDelete?.();
    }
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  }, [orderToDelete, onOrderDelete]);

  const handleCancelDelete = React.useCallback(() => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  }, []);

  // Handle order focus for dictation
  const handleOrderFocus = React.useCallback(
    (sectionId: string, orderId: string, orderIndex: number) => {
      setFocusedOrderId(orderId);

      if (dictationState === "on") {
        const orderKey = `${document.id}-${sectionId}-${orderId}`;
        if (!simulatedOrdersRef.current.has(orderKey)) {
          startOrderDictation(sectionId, orderId, orderIndex);
        }
      }
    },
    [dictationState, document.id, startOrderDictation]
  );

  // Handle order blur
  const handleOrderBlur = React.useCallback(() => {
    setFocusedOrderId(null);
    stopOrderDictation();
  }, [stopOrderDictation]);

  return (
    <div
      className={styles.documentCard}
      ref={(el) => registerDocumentRef(document.id, el)}
    >
      <div className={styles.cardHeader}>
        <div
          className={styles.cardTitle}
          onClick={() => onDocumentClick(document.id)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flex: 1,
          }}
        >
          <button
            className={styles.expandButton}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown12Regular
                style={{
                  width: "20px",
                  height: "20px",
                  color: "#424242",
                }}
              />
            ) : (
              <ChevronRight12Regular
                style={{
                  width: "20px",
                  height: "20px",
                  color: "#424242",
                }}
              />
            )}
          </button>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <h3 className={styles.cardTitleText}>{document.name}</h3>
            {document.type === "orders" &&
            document.sections?.[0]?.orderItems ? (
              <div className={styles.ordersBadge}>
                <div className={styles.dividerVertical} />
                <span className={styles.ordersText}>
                  {sectionOrders[document.sections[0].id]?.length ||
                    document.sections[0].orderItems.length}
                </span>
              </div>
            ) : document.orders ? (
              <div className={styles.ordersBadge}>
                <div className={styles.dividerVertical} />
                <span className={styles.ordersText}>
                  Orders {document.orders}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <button
          className={styles.cardMenuButton}
          aria-label="Document actions"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreVertical24Regular className={styles.toolbarIcon} />
        </button>
      </div>

      {isExpanded && (
        <>
          <div className={styles.toolbar}>
            <div className={styles.leftActions}>
              {document.type === "orders" ? (
                <>
                  <button className={styles.toolbarButton} aria-label="Export">
                    <ArrowExportUp24Regular className={styles.toolbarIcon} />
                  </button>
                  <button className={styles.toolbarButton} aria-label="Sync">
                    <ArrowSync24Regular className={styles.toolbarIcon} />
                  </button>
                  <button className={styles.toolbarButton} aria-label="History">
                    <History24Regular className={styles.toolbarIcon} />
                  </button>
                  <button className={styles.toolbarButton} aria-label="Cart">
                    <Cart20Regular className={styles.toolbarIcon} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.toolbarButton}
                    aria-label="Toggle select all sections"
                    onClick={() =>
                      onDocumentCheckToggle(
                        document.id,
                        checkboxState === true ? false : true
                      )
                    }
                    aria-pressed={checkboxState === true}
                  >
                    <SelectAllOn24Regular className={styles.toolbarIcon} />
                  </button>
                  <button className={styles.toolbarButton} aria-label="Copy">
                    <Copy24Regular className={styles.toolbarIcon} />
                  </button>
                  <button className={styles.toolbarButton} aria-label="Export">
                    <ArrowExportUp24Regular className={styles.toolbarIcon} />
                  </button>
                  <button className={styles.toolbarButton} aria-label="Sync">
                    <ArrowSync24Regular className={styles.toolbarIcon} />
                  </button>
                  <button
                    className={styles.toolbarButton}
                    aria-label="Delete"
                    onClick={() =>
                      onDeleteDocument?.(document.id, document.name)
                    }
                    disabled={document.type === "progress-note"}
                  >
                    <Delete24Regular className={styles.toolbarIcon} />
                  </button>
                  <button className={styles.toolbarButton} aria-label="History">
                    <History24Regular className={styles.toolbarIcon} />
                  </button>
                </>
              )}
            </div>
            <div className={styles.rightActions}>
              <button className={styles.starButton} aria-label="Star">
                <PersonFeedbackRegular
                  style={{
                    width: "24px",
                    height: "24px",
                    color: "#424242",
                  }}
                />
              </button>
            </div>
          </div>

          <div className={styles.sectionDivider} />

          {document.sections && document.sections.length > 0 && (
            <div className={styles.documentSections}>
              {document.sections.map((section, sectionIndex) => {
                const orders =
                  sectionOrders[section.id] || section.orderItems || [];
                const hasOrders = orders.length > 0;

                return (
                  <div key={section.id} className={styles.documentSection}>
                    {/* Hide section header (title + checkbox) for referral letters and sections with orders */}
                    {!hasOrders && document.type !== "referral-letter" && (
                      <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitle}>
                          {section.title}
                        </div>
                        <div className={styles.sectionCheckbox}>
                          <Checkbox
                            checked={section.checked}
                            onChange={(
                              _: React.ChangeEvent<HTMLInputElement>,
                              data: CheckboxOnChangeData
                            ) =>
                              onSectionToggle(
                                document.id,
                                section.id,
                                !!data.checked
                              )
                            }
                          />
                        </div>
                      </div>
                    )}

                    {hasOrders ? (
                      showSkeleton ? (
                        <div className={styles.skeletonContainer}>
                          <div className={styles.skeletonItem} />
                          <div className={styles.skeletonItem} />
                          <div className={styles.skeletonItem} />
                          <div className={styles.skeletonItem} />
                        </div>
                      ) : (
                        <div className={styles.ordersList}>
                          {orders.map((order, index) => (
                            <div key={order.id} className={styles.orderItem}>
                              <div className={styles.orderBadge}>
                                <span className={styles.orderBadgeText}>
                                  {index + 1}
                                </span>
                              </div>

                              <div className={styles.orderInputContainer}>
                                <textarea
                                  className={
                                    focusedOrderId === order.id
                                      ? mergeClasses(
                                          styles.orderInput,
                                          styles.orderInputFocused
                                        )
                                      : styles.orderInput
                                  }
                                  value={order.text}
                                  onChange={(e) => {
                                    handleOrderChange(
                                      section.id,
                                      order.id,
                                      e.target.value
                                    );
                                    e.target.style.height = "auto";
                                    e.target.style.height =
                                      e.target.scrollHeight + "px";
                                  }}
                                  onFocus={(e) => {
                                    // Call tooltip handler first
                                    cursorTooltipHandlers?.onFocus(
                                      e as unknown as React.FocusEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                      >
                                    );
                                    // Then handle order focus which will start dictation and hide tooltip
                                    handleOrderFocus(
                                      section.id,
                                      order.id,
                                      index
                                    );
                                    e.target.style.height = "auto";
                                    e.target.style.height =
                                      e.target.scrollHeight + "px";
                                  }}
                                  onBlur={(e) => {
                                    handleOrderBlur();
                                    cursorTooltipHandlers?.onBlur(
                                      e as unknown as React.FocusEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                      >
                                    );
                                  }}
                                  onMouseEnter={(e) =>
                                    cursorTooltipHandlers?.onMouseEnter(
                                      e as unknown as React.MouseEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                      >
                                    )
                                  }
                                  onMouseMove={(e) =>
                                    cursorTooltipHandlers?.onMouseMove(
                                      e as unknown as React.MouseEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                      >
                                    )
                                  }
                                  onMouseLeave={(e) =>
                                    cursorTooltipHandlers?.onMouseLeave(
                                      e as unknown as React.MouseEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                      >
                                    )
                                  }
                                  onClick={(e) =>
                                    cursorTooltipHandlers?.onClick(
                                      e as unknown as React.MouseEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                      >
                                    )
                                  }
                                  onKeyDown={(e) =>
                                    cursorTooltipHandlers?.onKeyDown(
                                      e as unknown as React.KeyboardEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                      >
                                    )
                                  }
                                  onKeyUp={(e) =>
                                    cursorTooltipHandlers?.onKeyUp(
                                      e as unknown as React.KeyboardEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                      >
                                    )
                                  }
                                  placeholder=""
                                  rows={1}
                                  ref={(el) => {
                                    const inputKey = `${section.id}-${order.id}`;
                                    orderInputRefs.current[inputKey] = el;
                                    if (el) {
                                      el.style.height = "auto";
                                      el.style.height = el.scrollHeight + "px";
                                    }
                                  }}
                                />
                                {focusedOrderId === order.id && (
                                  <div className={styles.orderFocusIndicator} />
                                )}
                              </div>

                              {order.code && (
                                <button
                                  className={styles.orderCodeButton}
                                  aria-label="Copy code"
                                >
                                  <Copy20Regular
                                    className={styles.orderCodeIcon}
                                  />
                                  <span className={styles.orderCodeText}>
                                    {order.code}
                                  </span>
                                </button>
                              )}

                              <button
                                className={styles.orderDeleteButton}
                                onClick={() =>
                                  handleDeleteOrder(section.id, order.id)
                                }
                                aria-label="Delete order"
                              >
                                <Delete20Regular />
                              </button>
                            </div>
                          ))}

                          <button
                            className={styles.addOrderButton}
                            onClick={() => handleAddOrder(section.id)}
                            aria-label="Add order"
                          >
                            <AddCircleRegular
                              style={{ width: "20px", height: "20px" }}
                            />
                            <span>Add order</span>
                          </button>
                        </div>
                      )
                    ) : (
                      <>
                        {showSkeleton ? (
                          <div className={styles.skeletonContainer}>
                            <div className={styles.skeletonItem} />
                            <div className={styles.skeletonItem} />
                            <div className={styles.skeletonItem} />
                            <div className={styles.skeletonItem} />
                          </div>
                        ) : (
                          <div
                            className={
                              dictationState === "on" &&
                              focusedSectionId === section.id
                                ? mergeClasses(
                                    styles.sectionContent,
                                    styles.sectionContentDictationFocus
                                  )
                                : focusedSectionId === section.id
                                ? mergeClasses(
                                    styles.sectionContent,
                                    styles.sectionContentFocus
                                  )
                                : styles.sectionContent
                            }
                          >
                            {highlightedSections.has(section.id) ? (
                              <div
                                className={
                                  dictationState === "on" &&
                                  focusedSectionId === section.id
                                    ? mergeClasses(
                                        styles.sectionTextarea,
                                        styles.sectionTextareaDictationFocus
                                      )
                                    : styles.sectionTextarea
                                }
                                style={{
                                  whiteSpace: "pre-wrap",
                                  wordWrap: "break-word",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html:
                                    aiSectionContent[section.id] ||
                                    section.content,
                                }}
                              />
                            ) : (
                              <Textarea
                                className={
                                  dictationState === "on" &&
                                  focusedSectionId === section.id
                                    ? mergeClasses(
                                        styles.sectionTextarea,
                                        styles.sectionTextareaDictationFocus
                                      )
                                    : styles.sectionTextarea
                                }
                                value={
                                  aiSectionContent[section.id] ||
                                  section.content
                                }
                                textarea={
                                  {
                                    "data-section": `${document.id}-${section.id}`,
                                    ref:
                                      sectionIndex === 0
                                        ? firstSectionTextareaRef
                                        : undefined,
                                  } as React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
                                    ref?: React.Ref<HTMLTextAreaElement>;
                                  }
                                }
                                onChange={(
                                  _: React.ChangeEvent<HTMLTextAreaElement>,
                                  data: TextareaOnChangeData
                                ) => {
                                  if (aiSectionContent[section.id]) {
                                    setAiSectionContent((prev) => {
                                      const newContent = { ...prev };
                                      delete newContent[section.id];
                                      return newContent;
                                    });
                                  }
                                  onSectionContentChange(
                                    document.id,
                                    section.id,
                                    data.value || ""
                                  );
                                }}
                                onFocus={(
                                  event: React.FocusEvent<HTMLTextAreaElement>
                                ) => {
                                  // Call tooltip handler FIRST before dictation starts
                                  cursorTooltipHandlers?.onFocus(event);
                                  handleSectionFocus(section.id, section.title);
                                }}
                                onBlur={(
                                  event: React.FocusEvent<HTMLTextAreaElement>
                                ) => {
                                  handleSectionBlur();
                                  cursorTooltipHandlers?.onBlur(event);
                                }}
                                onMouseEnter={(
                                  event: React.MouseEvent<HTMLTextAreaElement>
                                ) => cursorTooltipHandlers?.onMouseEnter(event)}
                                onMouseMove={(
                                  event: React.MouseEvent<HTMLTextAreaElement>
                                ) => cursorTooltipHandlers?.onMouseMove(event)}
                                onMouseLeave={(
                                  event: React.MouseEvent<HTMLTextAreaElement>
                                ) => cursorTooltipHandlers?.onMouseLeave(event)}
                                onClick={(
                                  event: React.MouseEvent<HTMLTextAreaElement>
                                ) => cursorTooltipHandlers?.onClick(event)}
                                onKeyDown={(
                                  event: React.KeyboardEvent<HTMLTextAreaElement>
                                ) => cursorTooltipHandlers?.onKeyDown(event)}
                                onKeyUp={(
                                  event: React.KeyboardEvent<HTMLTextAreaElement>
                                ) => cursorTooltipHandlers?.onKeyUp(event)}
                              />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {document.references && document.references.length > 0 && (
            <div className={styles.referencesSection}>
              <div className={styles.referencesHeader}>References</div>
              <div className={styles.referencesRow}>
                {document.references.map((reference, index) => (
                  <div key={reference.id} className={styles.referenceItem}>
                    <div className={styles.referenceNumber}>{index + 1}</div>
                    <div className={styles.referenceDivider}>
                      <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
                        <path d="M5 0V16" stroke="#E0E0E0" />
                      </svg>
                    </div>
                    <div className={styles.referenceTitle}>
                      <DocumentCopy16Regular className={styles.referenceIcon} />
                      {reference.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(_, data) => {
          if (!data.open) {
            handleCancelDelete();
          }
        }}
      >
        <DialogSurface style={{ maxWidth: "320px", padding: "24px" }}>
          <DialogBody>
            <DialogTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={handleCancelDelete}
                  style={{
                    minWidth: "auto",
                    padding: "4px",
                  }}
                />
              }
              style={{
                fontSize: "20px",
                fontWeight: 600,
                lineHeight: "28px",
                fontFamily: "'Segoe UI', sans-serif",
                marginBottom: "12px",
              }}
            >
              Remove order?
            </DialogTitle>
            <DialogContent
              style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                fontFamily: "'Segoe UI', sans-serif",
                marginBottom: "24px",
              }}
            >
              Removing this order will generate the note.
            </DialogContent>
            <DialogActions
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button appearance="secondary" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={handleConfirmDelete}>
                Remove
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}

export default DocumentCard;
