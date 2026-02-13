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
  Tooltip,
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
  HighlightRegular,
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
import {
  DOCUMENT_TIMING_MS,
  getDictationContentForSection,
  getEnGbHealthCheckContentForSectionId,
  getPatientContentForSection,
} from "../DocumentComponent.constants";
import { useI18n } from "../../../../i18n/I18nContext";
import { getMedicalContentString } from "../../../../utils/medicalBundle";
import { normalizeParagraphSpacing } from "../../../../utils/normalizeParagraphSpacing";

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
  patientId,
  isPronounReplacement = false,
  isDraftingReferralLetter = false,
  autoFocus = false,
  onAutoFocusConsumed,
  onOrderDelete,
}: DocumentCardProps) {
  const { t, locale, medical } = useI18n();
  // Note: micMode and isRecording are currently unused but kept for API compatibility
  void micMode;
  void isRecording;

  const getDictationContentForSectionLocalized = React.useCallback(
    (sectionTitle: string) => {
      if (locale === "en-GB" && sectionTitle === "Referral Note") {
        return (
          getMedicalContentString(medical, "referralLetter") ??
          getDictationContentForSection(sectionTitle)
        );
      }

      return getDictationContentForSection(sectionTitle);
    },
    [locale, medical]
  );

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
  const [previousOrderText, setPreviousOrderText] = React.useState<string>("");

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

  // Track last non-empty value for each order to detect text deletion
  const lastNonEmptyOrderValues = React.useRef<Record<string, string>>({});

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
      }, DOCUMENT_TIMING_MS.initialScrollDelay);
      return () => clearTimeout(timeoutId);
    }
  }, [autoFocus, isExpanded, document.id, onAutoFocusConsumed]);

  // Pool of AI-generated orders
  const AI_ORDER_POOL = React.useMemo(
    () => [
      t("documentCard.orderSuggestions.checkBmpAndCbcIn2Weeks"),
      t("documentCard.orderSuggestions.orderEchoAssessCardiacFunction"),
      t("documentCard.orderSuggestions.scheduleFollowUpIn4Weeks"),
      t("documentCard.orderSuggestions.prescribeMetoprolol50Daily"),
      t("documentCard.orderSuggestions.orderChestXrayPaLateral"),
      t("documentCard.orderSuggestions.referToCardiologyFurtherEval"),
      t("documentCard.orderSuggestions.startLisinopril10ForHypertension"),
      t("documentCard.orderSuggestions.orderLipidPanelFasting"),
      t("documentCard.orderSuggestions.discontinueAspirinBleedingRisk"),
      t("documentCard.orderSuggestions.orderTshAndFreeT4"),
      t("documentCard.orderSuggestions.prescribeAtorvastatin40AtBedtime"),
      t("documentCard.orderSuggestions.referToNephrology"),
      t("documentCard.orderSuggestions.startFurosemide20Daily"),
    ],
    [t]
  );

  // Local state for AI-generated section content (for Notes)
  const [aiSectionContent, setAiSectionContent] = React.useState<
    Record<string, string>
  >({});

  // Helper function to replace pronouns with they/them
  const replacePronounsWithTheyThem = React.useCallback(
    (text: string): string => {
      let result = text;

      const escapeRegExp = (value: string) =>
        value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const verbStyle = 'style="color: var(--colorBrandBackground); font-weight: 600;"';
      const wrapHighlighted = (word: string) =>
        `<span ${verbStyle}>${word}</span>`;

      const pronouns = {
        theyCap: t("documentCard.pronounReplacement.pronouns.theyCap"),
        theyLower: t("documentCard.pronounReplacement.pronouns.theyLower"),
        themCap: t("documentCard.pronounReplacement.pronouns.themCap"),
        themLower: t("documentCard.pronounReplacement.pronouns.themLower"),
        theirCap: t("documentCard.pronounReplacement.pronouns.theirCap"),
        theirLower: t("documentCard.pronounReplacement.pronouns.theirLower"),
        themselvesCap: t(
          "documentCard.pronounReplacement.pronouns.themselvesCap"
        ),
        themselvesLower: t(
          "documentCard.pronounReplacement.pronouns.themselvesLower"
        ),
      };

      const verbPlurals = {
        are: t("documentCard.pronounReplacement.verbs.are"),
        were: t("documentCard.pronounReplacement.verbs.were"),
        have: t("documentCard.pronounReplacement.verbs.have"),
        do: t("documentCard.pronounReplacement.verbs.do"),
        go: t("documentCard.pronounReplacement.verbs.go"),
        acknowledge: t("documentCard.pronounReplacement.verbs.acknowledge"),
        maintain: t("documentCard.pronounReplacement.verbs.maintain"),
        apply: t("documentCard.pronounReplacement.verbs.apply"),
        describe: t("documentCard.pronounReplacement.verbs.describe"),
        deny: t("documentCard.pronounReplacement.verbs.deny"),
        report: t("documentCard.pronounReplacement.verbs.report"),
        present: t("documentCard.pronounReplacement.verbs.present"),
        appear: t("documentCard.pronounReplacement.verbs.appear"),
        experience: t("documentCard.pronounReplacement.verbs.experience"),
        undergo: t("documentCard.pronounReplacement.verbs.undergo"),
        continue: t("documentCard.pronounReplacement.verbs.continue"),
        remain: t("documentCard.pronounReplacement.verbs.remain"),
        require: t("documentCard.pronounReplacement.verbs.require"),
        show: t("documentCard.pronounReplacement.verbs.show"),
        exhibit: t("documentCard.pronounReplacement.verbs.exhibit"),
        demonstrate: t("documentCard.pronounReplacement.verbs.demonstrate"),
        complain: t("documentCard.pronounReplacement.verbs.complain"),
        note: t("documentCard.pronounReplacement.verbs.note"),
        mention: t("documentCard.pronounReplacement.verbs.mention"),
        state: t("documentCard.pronounReplacement.verbs.state"),
        indicate: t("documentCard.pronounReplacement.verbs.indicate"),
        suggest: t("documentCard.pronounReplacement.verbs.suggest"),
        feel: t("documentCard.pronounReplacement.verbs.feel"),
        need: t("documentCard.pronounReplacement.verbs.need"),
        want: t("documentCard.pronounReplacement.verbs.want"),
        take: t("documentCard.pronounReplacement.verbs.take"),
        use: t("documentCard.pronounReplacement.verbs.use"),
        work: t("documentCard.pronounReplacement.verbs.work"),
        live: t("documentCard.pronounReplacement.verbs.live"),
        smoke: t("documentCard.pronounReplacement.verbs.smoke"),
        drink: t("documentCard.pronounReplacement.verbs.drink"),
        exercise: t("documentCard.pronounReplacement.verbs.exercise"),
        engage: t("documentCard.pronounReplacement.verbs.engage"),
        express: t("documentCard.pronounReplacement.verbs.express"),
        request: t("documentCard.pronounReplacement.verbs.request"),
        schedule: t("documentCard.pronounReplacement.verbs.schedule"),
        perform: t("documentCard.pronounReplacement.verbs.perform"),
      };

      // Replace pronouns first - wrap in span with blue color
      result = result
        .replace(/\bHe\b/g, wrapHighlighted(pronouns.theyCap))
        .replace(/\bShe\b/g, wrapHighlighted(pronouns.theyCap))
        .replace(/\bhe\b/g, wrapHighlighted(pronouns.theyLower))
        .replace(/\bshe\b/g, wrapHighlighted(pronouns.theyLower))
        .replace(/\bHim\b/g, wrapHighlighted(pronouns.themCap))
        .replace(/\bHer\b(?!\s+\w)/g, wrapHighlighted(pronouns.themCap))
        .replace(/\bhim\b/g, wrapHighlighted(pronouns.themLower))
        .replace(/\bher\b(?!\s+\w)/g, wrapHighlighted(pronouns.themLower))
        .replace(/\bHis\b/g, wrapHighlighted(pronouns.theirCap))
        .replace(/\bHer\s+(?=\w)/g, `${wrapHighlighted(pronouns.theirCap)} `)
        .replace(/\bhis\b/g, wrapHighlighted(pronouns.theirLower))
        .replace(/\bher\s+(?=\w)/g, `${wrapHighlighted(pronouns.theirLower)} `)
        .replace(/\bHimself\b/g, wrapHighlighted(pronouns.themselvesCap))
        .replace(/\bHerself\b/g, wrapHighlighted(pronouns.themselvesCap))
        .replace(/\bhimself\b/g, wrapHighlighted(pronouns.themselvesLower))
        .replace(/\bherself\b/g, wrapHighlighted(pronouns.themselvesLower));

      // Fix verb conjugations - account for both plain text and span-wrapped pronouns
      // Pattern matches: "They verb" or highlighted-pronoun + verb
      const spanPattern = `(<span ${verbStyle}>(?:${escapeRegExp(
        pronouns.theyCap
      )}|${escapeRegExp(pronouns.theyLower)})<\\/span>)`;
      const plainPattern = `(${escapeRegExp(pronouns.theyCap)}|${escapeRegExp(
        pronouns.theyLower
      )})`;

      // Helper to create replacement pattern that works with both formats
      const fixVerb = (singular: string, plural: string) => {
        // First fix span-wrapped version
        result = result.replace(
          new RegExp(`${spanPattern}\\s+${singular}\\b`, "g"),
          `$1 <span ${verbStyle}>${plural}</span>`
        );
        // Then fix any plain text version
        result = result.replace(
          new RegExp(`\\b${plainPattern}\\s+${singular}\\b`, "g"),
          `$1 <span ${verbStyle}>${plural}</span>`
        );
      };

      // Irregular verbs
      fixVerb("is", verbPlurals.are);
      fixVerb("was", verbPlurals.were);
      fixVerb("has", verbPlurals.have);
      fixVerb("does", verbPlurals.do);
      fixVerb("goes", verbPlurals.go);

      // Common medical/clinical verbs
      fixVerb("acknowledges", verbPlurals.acknowledge);
      fixVerb("maintains", verbPlurals.maintain);
      fixVerb("applies", verbPlurals.apply);
      fixVerb("describes", verbPlurals.describe);
      fixVerb("denies", verbPlurals.deny);
      fixVerb("reports", verbPlurals.report);
      fixVerb("presents", verbPlurals.present);
      fixVerb("appears", verbPlurals.appear);
      fixVerb("experiences", verbPlurals.experience);
      fixVerb("undergoes", verbPlurals.undergo);
      fixVerb("continues", verbPlurals.continue);
      fixVerb("remains", verbPlurals.remain);
      fixVerb("requires", verbPlurals.require);
      fixVerb("shows", verbPlurals.show);
      fixVerb("exhibits", verbPlurals.exhibit);
      fixVerb("demonstrates", verbPlurals.demonstrate);
      fixVerb("complains", verbPlurals.complain);
      fixVerb("notes", verbPlurals.note);
      fixVerb("mentions", verbPlurals.mention);
      fixVerb("states", verbPlurals.state);
      fixVerb("indicates", verbPlurals.indicate);
      fixVerb("suggests", verbPlurals.suggest);
      fixVerb("feels", verbPlurals.feel);
      fixVerb("needs", verbPlurals.need);
      fixVerb("wants", verbPlurals.want);
      fixVerb("takes", verbPlurals.take);
      fixVerb("uses", verbPlurals.use);
      fixVerb("works", verbPlurals.work);
      fixVerb("lives", verbPlurals.live);
      fixVerb("smokes", verbPlurals.smoke);
      fixVerb("drinks", verbPlurals.drink);
      fixVerb("exercises", verbPlurals.exercise);
      fixVerb("engages", verbPlurals.engage);
      fixVerb("expresses", verbPlurals.express);
      fixVerb("requests", verbPlurals.request);
      fixVerb("schedules", verbPlurals.schedule);
      fixVerb("performs", verbPlurals.perform);

      // Fix verbs with adverbs between subject and verb (e.g., "They occasionally experiences")
      // Pattern: They + adverb (ending in -ly) + verb
      const fixVerbWithAdverb = (singular: string, plural: string) => {
        // Fix span-wrapped version with adverb
        result = result.replace(
          new RegExp(`${spanPattern}\\s+(\\w+ly)\\s+${singular}\\b`, "g"),
          `$1 $2 <span ${verbStyle}>${plural}</span>`
        );
        // Fix plain text version with adverb
        result = result.replace(
          new RegExp(`\\b${plainPattern}\\s+(\\w+ly)\\s+${singular}\\b`, "g"),
          `$1 $2 <span ${verbStyle}>${plural}</span>`
        );
      };

      // Common verbs that appear with adverbs
      fixVerbWithAdverb("acknowledges", verbPlurals.acknowledge);
      fixVerbWithAdverb("maintains", verbPlurals.maintain);
      fixVerbWithAdverb("applies", verbPlurals.apply);
      fixVerbWithAdverb("experiences", verbPlurals.experience);
      fixVerbWithAdverb("reports", verbPlurals.report);
      fixVerbWithAdverb("describes", verbPlurals.describe);
      fixVerbWithAdverb("denies", verbPlurals.deny);
      fixVerbWithAdverb("presents", verbPlurals.present);
      fixVerbWithAdverb("engages", verbPlurals.engage);
      fixVerbWithAdverb("uses", verbPlurals.use);
      fixVerbWithAdverb("takes", verbPlurals.take);

      // Fix "but does participate" → "but do participate" patterns
      const phrases = {
        butDo: t("documentCard.pronounReplacement.phrases.butDo"),
        butDont: t("documentCard.pronounReplacement.phrases.butDont"),
        andDo: t("documentCard.pronounReplacement.phrases.andDo"),
        andDont: t("documentCard.pronounReplacement.phrases.andDont"),
      };

      result = result.replace(/\bbut does\s+/g, phrases.butDo);
      result = result.replace(/\bbut doesn't\s+/g, phrases.butDont);
      result = result.replace(/\band does\s+/g, phrases.andDo);
      result = result.replace(/\band doesn't\s+/g, phrases.andDont);

      return result;
    },
    [t]
  );

  // Local state for order items within sections
  const [sectionOrders, setSectionOrders] = React.useState<
    Record<string, OrderItem[]>
  >(() => {
    const initialOrders: Record<string, OrderItem[]> = {};
    document.sections?.forEach((section) => {
      if (section.orderItems) {
        initialOrders[section.id] = section.orderItems;
        // Initialize last non-empty values for each order
        section.orderItems.forEach((order) => {
          if (order.text.trim() !== "") {
            const orderKey = `${section.id}-${order.id}`;
            lastNonEmptyOrderValues.current[orderKey] = order.text;
          }
        });
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
        // en-GB progress-note uses stable section IDs + locale medical bundle.
        // Other locales keep existing title-based behavior.
        const content =
          locale === "en-GB" && document.type === "progress-note"
            ? getEnGbHealthCheckContentForSectionId(section.id, medical)
            : locale === "en-GB" && document.type === "letter-to-gp"
            ? normalizeParagraphSpacing(
                getMedicalContentString(medical, "letterToGp")
              )
            : getPatientContentForSection(section.title, patientId);
        if (content) {
          newContent[section.id] = content;
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

    const shouldReplaceReferralLetterWithEnGbBundle = (content: string) => {
      const trimmed = content.trim();
      return trimmed.length === 0 || trimmed.startsWith("Dear Dr. Taylor,");
    };

    // Generate content for Referral Letter when drafting referral letter skeleton ends
    if (
      wasShowingSkeleton &&
      !showSkeleton &&
      document.type === "referral-letter" &&
      isDraftingReferralLetter
    ) {
      const fallbackReferralContent = `Dear Dr. Taylor,

I am referring my patient, a 41 year old male, for dermatologic evaluation and management of recurrent actinic keratoses on his facial region. He has a prior history of actinic keratoses and was previously scheduled to see Dermatology, but that appointment was cancelled. He specifically requested referral to your care at MGH, based on a recommendation from his father.

During his annual physical examination, multiple actinic keratoses were noted on his face. The remainder of his skin exam was unremarkable. His father has a history of skin cancer requiring treatment and excisions, which further increases the importance of dermatologic surveillance.

Additional relevant clinical information includes:

Past Medical/Surgical History: Lumbar spine injury status post discectomy; history of cerumen impaction; no current medications.

Social History: Works in the finance sector for the state; engages in walking and hiking but no structured exercise regimen; uses highSPF sunscreen when outdoors.

Other Current Concerns: None directly related to dermatologic conditions. No systemic symptoms reported.

Given his dermatologic history and family risk factors, I would appreciate your assessment regarding further management, potential treatment of current lesions, and recommendations for ongoing skin cancer surveillance.

Please let me know if additional information is needed. Thank you in advance for your evaluation and care.`;

      const referralContent =
        locale === "en-GB"
          ? getMedicalContentString(medical, "referralLetter") ??
            fallbackReferralContent
          : fallbackReferralContent;

      const newContent: Record<string, string> = {};
      document.sections?.forEach((section) => {
        newContent[section.id] = referralContent;
      });
      setAiSectionContent((prev) => ({ ...prev, ...newContent }));
    }

    // If a referral letter already exists on an en-GB route, prefer the en-GB bundle
    // once it is available (avoid being stuck with the fallback Dr. Taylor template).
    if (
      !showSkeleton &&
      document.type === "referral-letter" &&
      locale === "en-GB"
    ) {
      const enGbReferralContent = getMedicalContentString(
        medical,
        "referralLetter"
      );
      if (enGbReferralContent) {
        const newContent: Record<string, string> = {};
        let shouldUpdate = false;

        document.sections?.forEach((section) => {
          const current = aiSectionContent[section.id] || section.content || "";
          if (shouldReplaceReferralLetterWithEnGbBundle(current)) {
            newContent[section.id] = enGbReferralContent;
            shouldUpdate = true;
          }
        });

        if (shouldUpdate) {
          setAiSectionContent((prev) => ({ ...prev, ...newContent }));
        }
      }
    }
  }, [
    showSkeleton,
    document.type,
    document.sections,
    AI_ORDER_POOL,
    patientId,
    isPronounReplacement,
    isDraftingReferralLetter,
    aiSectionContent,
    replacePronounsWithTheyThem,
    locale,
    medical,
  ]);

  // Handle section focus - start dictation if in dictation mode and recording
  const handleSectionFocus = React.useCallback(
    (sectionId: string, sectionTitle: string) => {
      setFocusedSectionId(sectionId);

      const section = document.sections?.find((s) => s.id === sectionId);
      const currentContent =
        aiSectionContent[sectionId] || section?.content || "";
      const fullContent = getDictationContentForSectionLocalized(sectionTitle);

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
      getDictationContentForSectionLocalized,
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
        t("documentCard.orderDictation.startSpironolactone25Daily"),
        t("documentCard.orderDictation.continueMetoprolol50Daily"),
        t("documentCard.orderDictation.increaseLisinoprilTo20Daily"),
        t("documentCard.orderDictation.orderEchocardiogram"),
        t("documentCard.orderDictation.scheduleFollowUpIn2Weeks"),
      ];
      return (
        orderTexts[orderIndex % orderTexts.length] ||
        t("documentCard.orderDictation.newOrder")
      );
    },
    [t]
  );

  // Trigger dictation when dictationState changes to "on" and a section is already focused
  React.useEffect(() => {
    if (dictationState === "on" && focusedSectionId) {
      const section = document.sections?.find((s) => s.id === focusedSectionId);
      if (!section) return;

      const currentContent =
        aiSectionContent[focusedSectionId] || section.content || "";
      const fullContent = getDictationContentForSectionLocalized(section.title);

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
    getDictationContentForSectionLocalized,
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
      }, DOCUMENT_TIMING_MS.deferToNextTick);

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
          }, DOCUMENT_TIMING_MS.tooltipAfterDictationDelay);
        }
      }, DOCUMENT_TIMING_MS.dictationCharInterval);
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
      const orderKey = `${sectionId}-${orderId}`;
      const storedText = lastNonEmptyOrderValues.current[orderKey] || "";

      // If text is cleared (empty), treat it as a deletion attempt
      if (text.trim() === "") {
        if (storedText && storedText.trim() !== "") {
          // Store the previous text before clearing
          setPreviousOrderText(storedText);
          setOrderToDelete({ sectionId, orderId });
          setDeleteDialogOpen(true);
          // Don't return - let the state update to empty so cancel can restore properly
        }
      } else {
        // Only update the stored value if text is getting longer (user is adding, not deleting)
        // This preserves the full original text for restoration on cancel
        if (text.length >= storedText.length) {
          lastNonEmptyOrderValues.current[orderKey] = text;
        }
      }

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
      }, DOCUMENT_TIMING_MS.deferToNextTick);

      return {
        ...prev,
        [sectionId]: newOrders,
      };
    });
  }, []);

  const handleDeleteOrder = React.useCallback(
    (sectionId: string, orderId: string) => {
      // Store the previous text before showing the delete dialog
      const orderKey = `${sectionId}-${orderId}`;
      const previousText = lastNonEmptyOrderValues.current[orderKey];
      if (previousText) {
        setPreviousOrderText(previousText);
      }
      setOrderToDelete({ sectionId, orderId });
      setDeleteDialogOpen(true);
    },
    []
  );

  const handleConfirmDelete = React.useCallback(() => {
    if (orderToDelete) {
      // Clean up the last non-empty value for this order
      const orderKey = `${orderToDelete.sectionId}-${orderToDelete.orderId}`;
      delete lastNonEmptyOrderValues.current[orderKey];

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
    setPreviousOrderText("");
  }, [orderToDelete, onOrderDelete]);

  const handleCancelDelete = React.useCallback(() => {
    // Restore the previous text if user cancels
    if (orderToDelete && previousOrderText) {
      setSectionOrders((prev) => ({
        ...prev,
        [orderToDelete.sectionId]:
          prev[orderToDelete.sectionId]?.map((order) =>
            order.id === orderToDelete.orderId
              ? { ...order, text: previousOrderText }
              : order
          ) || [],
      }));
    }
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
    setPreviousOrderText("");
  }, [orderToDelete, previousOrderText]);

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
          className={`${styles.cardTitle} clickable-flex-row`}
          onClick={() => onDocumentClick(document.id, true)}
        >
          <button
            className={styles.expandButton}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown12Regular
                className="icon-size-20"
                style={{ color: "var(--colorNeutralForeground2)" }}
              />
            ) : (
              <ChevronRight12Regular
                className="icon-size-20"
                style={{ color: "var(--colorNeutralForeground2)" }}
              />
            )}
          </button>

          <div className="flex-row-gap-4">
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
                  {t("orders.title")} {document.orders}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <Tooltip content={t("common.menu")} relationship="label">
          <span className="inline-flex">
            <button
              className={styles.cardMenuButton}
              aria-label={t("common.menu")}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreVertical24Regular className={styles.toolbarIcon} />
            </button>
          </span>
        </Tooltip>
      </div>

      {isExpanded && (
        <>
          <div className={styles.toolbar}>
            <div className={styles.leftActions}>
              {document.type === "orders" ? (
                <>
                  <Tooltip content={t("common.export")} relationship="label">
                    <span className="inline-flex">
                      <button
                        className={styles.toolbarButton}
                        aria-label={t("common.export")}
                      >
                        <ArrowExportUp24Regular
                          className={styles.toolbarIcon}
                        />
                      </button>
                    </span>
                  </Tooltip>
                  <Tooltip content={t("common.reload")} relationship="label">
                    <span className="inline-flex">
                      <button
                        className={styles.toolbarButton}
                        aria-label={t("common.reload")}
                      >
                        <ArrowSync24Regular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>
                  <Tooltip content={t("common.restore")} relationship="label">
                    <span className="inline-flex">
                      <button
                        className={styles.toolbarButton}
                        aria-label={t("common.restore")}
                      >
                        <History24Regular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>
                  <Tooltip content={t("common.highlight")} relationship="label">
                    <span className="inline-flex">
                      <button
                        className={styles.toolbarButton}
                        aria-label={t("common.highlight")}
                      >
                        <HighlightRegular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip content={t("common.selectAll")} relationship="label">
                    <span className="inline-flex">
                      <button
                        className={styles.toolbarButton}
                        aria-label={t("common.selectAll")}
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
                    </span>
                  </Tooltip>

                  <Tooltip content={t("common.copy")} relationship="label">
                    <span className="inline-flex">
                      <button
                        className={styles.toolbarButton}
                        aria-label={t("common.copy")}
                      >
                        <Copy24Regular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>

                  <Tooltip content={t("common.export")} relationship="label">
                    <span className="inline-flex">
                      <button
                        className={styles.toolbarButton}
                        aria-label={t("common.export")}
                      >
                        <ArrowExportUp24Regular
                          className={styles.toolbarIcon}
                        />
                      </button>
                    </span>
                  </Tooltip>

                  <Tooltip content={t("common.reload")} relationship="label">
                    <span className="inline-flex">
                      <button
                        className={styles.toolbarButton}
                        aria-label={t("common.reload")}
                      >
                        <ArrowSync24Regular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>

                  <Tooltip content={t("common.delete")} relationship="label">
                    <span className="inline-flex">
                      <button
                        className={styles.toolbarButton}
                        aria-label={t("common.delete")}
                        onClick={() =>
                          onDeleteDocument?.(document.id, document.name)
                        }
                        disabled={document.type === "progress-note"}
                      >
                        <Delete24Regular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>

                  <Tooltip content={t("common.restore")} relationship="label">
                    <span className="inline-flex">
                      <button
                        className={styles.toolbarButton}
                        aria-label={t("common.restore")}
                      >
                        <History24Regular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>
                </>
              )}
            </div>
            <div className={styles.rightActions}>
              <Tooltip content={t("common.feedback")} relationship="label">
                <span className="inline-flex">
                  <button
                    className={styles.starButton}
                    aria-label={t("common.feedback")}
                  >
                    <PersonFeedbackRegular className={styles.toolbarIcon} />
                  </button>
                </span>
              </Tooltip>
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
                                  aria-label={t("orders.copyCode")}
                                >
                                  <Copy20Regular
                                    className={styles.orderCodeIcon}
                                  />
                                  <span className={styles.orderCodeText}>
                                    {order.code}
                                  </span>
                                </button>
                              )}

                              <Tooltip
                                content={t("common.delete")}
                                relationship="label"
                              >
                                <span className="inline-flex">
                                  <button
                                    className={styles.orderDeleteButton}
                                    onClick={() =>
                                      handleDeleteOrder(section.id, order.id)
                                    }
                                    aria-label={t("orders.deleteOrder")}
                                  >
                                    <Delete20Regular />
                                  </button>
                                </span>
                              </Tooltip>
                            </div>
                          ))}

                          <button
                            className={styles.addOrderButton}
                            onClick={() => handleAddOrder(section.id)}
                            aria-label={t("orders.addOrder")}
                          >
                            <AddCircleRegular
                              className="icon-size-20"
                            />
                            <span>{t("orders.addOrderText")}</span>
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
                                        styles.highlightedContentDiv,
                                        styles.sectionTextareaDictationFocus,
                                        "pre-wrap"
                                      )
                                    : mergeClasses(
                                        styles.highlightedContentDiv,
                                        "pre-wrap"
                                      )
                                }
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
              <div className={styles.referencesHeader}>
                {t("documentCard.references")}
              </div>
              <div className={styles.referencesRow}>
                {document.references.map((reference, index) => (
                  <div key={reference.id} className={styles.referenceItem}>
                    <div className={styles.referenceNumber}>{index + 1}</div>
                    <div className={styles.referenceDivider}>
                      <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
                        <path d="M5 0V16" stroke="var(--palette-gray-e0e0e0)" />
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
        <DialogSurface className="dialog-surface-standard">
          <DialogBody>
            <DialogTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label={t("common.close")}
                  icon={<Dismiss24Regular />}
                  onClick={handleCancelDelete}
                  className="button-compact"
                />
              }
              className="dialog-title-standard"
            >
              {t("orders.removeOrderTitle")}
            </DialogTitle>
            <DialogContent className="dialog-content-standard">
              {t("orders.removeOrderBody")}
            </DialogContent>
            <DialogActions className="flex-row-gap-8">
              <Button appearance="secondary" onClick={handleCancelDelete}>
                {t("common.cancel")}
              </Button>
              <Button appearance="primary" onClick={handleConfirmDelete}>
                {t("orders.remove")}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}

export default DocumentCard;
