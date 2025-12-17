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
  getDictationContentForSection,
  getPatientContentForSection,
} from "../DocumentComponent.constants";

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

      // Fix verb conjugations - account for both plain text and span-wrapped pronouns
      // Pattern matches: "They verb" or "<span...>They</span> verb"
      const verbStyle = 'style="color: #0078D4; font-weight: 600;"';
      const spanPattern = `(<span ${verbStyle}>(?:They|they)<\\/span>)`;
      const plainPattern = "(They|they)";

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
      fixVerb("is", "are");
      fixVerb("was", "were");
      fixVerb("has", "have");
      fixVerb("does", "do");
      fixVerb("goes", "go");

      // Common medical/clinical verbs
      fixVerb("acknowledges", "acknowledge");
      fixVerb("maintains", "maintain");
      fixVerb("applies", "apply");
      fixVerb("describes", "describe");
      fixVerb("denies", "deny");
      fixVerb("reports", "report");
      fixVerb("presents", "present");
      fixVerb("appears", "appear");
      fixVerb("experiences", "experience");
      fixVerb("undergoes", "undergo");
      fixVerb("continues", "continue");
      fixVerb("remains", "remain");
      fixVerb("requires", "require");
      fixVerb("shows", "show");
      fixVerb("exhibits", "exhibit");
      fixVerb("demonstrates", "demonstrate");
      fixVerb("complains", "complain");
      fixVerb("notes", "note");
      fixVerb("mentions", "mention");
      fixVerb("states", "state");
      fixVerb("indicates", "indicate");
      fixVerb("suggests", "suggest");
      fixVerb("feels", "feel");
      fixVerb("needs", "need");
      fixVerb("wants", "want");
      fixVerb("takes", "take");
      fixVerb("uses", "use");
      fixVerb("works", "work");
      fixVerb("lives", "live");
      fixVerb("smokes", "smoke");
      fixVerb("drinks", "drink");
      fixVerb("exercises", "exercise");
      fixVerb("engages", "engage");
      fixVerb("expresses", "express");
      fixVerb("requests", "request");
      fixVerb("schedules", "schedule");
      fixVerb("performs", "perform");

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
      fixVerbWithAdverb("acknowledges", "acknowledge");
      fixVerbWithAdverb("maintains", "maintain");
      fixVerbWithAdverb("applies", "apply");
      fixVerbWithAdverb("experiences", "experience");
      fixVerbWithAdverb("reports", "report");
      fixVerbWithAdverb("describes", "describe");
      fixVerbWithAdverb("denies", "deny");
      fixVerbWithAdverb("presents", "present");
      fixVerbWithAdverb("engages", "engage");
      fixVerbWithAdverb("uses", "use");
      fixVerbWithAdverb("takes", "take");

      // Fix "but does participate" → "but do participate" patterns
      result = result.replace(/\bbut does\s+/g, "but do ");
      result = result.replace(/\bbut doesn't\s+/g, "but don't ");
      result = result.replace(/\band does\s+/g, "and do ");
      result = result.replace(/\band doesn't\s+/g, "and don't ");

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
        // Use patient-specific content if available, otherwise fallback to random pool
        const content = getPatientContentForSection(section.title, patientId);
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

    // Generate content for Referral Letter when drafting referral letter skeleton ends
    if (
      wasShowingSkeleton &&
      !showSkeleton &&
      document.type === "referral-letter" &&
      isDraftingReferralLetter
    ) {
      const referralContent = `Dear Dr. Taylor,

I am referring my patient, a 41 year old male, for dermatologic evaluation and management of recurrent actinic keratoses on his facial region. He has a prior history of actinic keratoses and was previously scheduled to see Dermatology, but that appointment was cancelled. He specifically requested referral to your care at MGH, based on a recommendation from his father.

During his annual physical examination, multiple actinic keratoses were noted on his face. The remainder of his skin exam was unremarkable. His father has a history of skin cancer requiring treatment and excisions, which further increases the importance of dermatologic surveillance.

Additional relevant clinical information includes:

Past Medical/Surgical History: Lumbar spine injury status post discectomy; history of cerumen impaction; no current medications.

Social History: Works in the finance sector for the state; engages in walking and hiking but no structured exercise regimen; uses highSPF sunscreen when outdoors.

Other Current Concerns: None directly related to dermatologic conditions. No systemic symptoms reported.

Given his dermatologic history and family risk factors, I would appreciate your assessment regarding further management, potential treatment of current lesions, and recommendations for ongoing skin cancer surveillance.

Please let me know if additional information is needed. Thank you in advance for your evaluation and care.`;

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
    patientId,
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
      }, 0);

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
          className={styles.cardTitle}
          onClick={() => onDocumentClick(document.id, true)}
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

        <Tooltip content="Menu" relationship="label">
          <span style={{ display: "inline-flex" }}>
            <button
              className={styles.cardMenuButton}
              aria-label="Menu"
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
                  <Tooltip content="Export" relationship="label">
                    <span style={{ display: "inline-flex" }}>
                      <button
                        className={styles.toolbarButton}
                        aria-label="Export"
                      >
                        <ArrowExportUp24Regular
                          className={styles.toolbarIcon}
                        />
                      </button>
                    </span>
                  </Tooltip>
                  <Tooltip content="Reload" relationship="label">
                    <span style={{ display: "inline-flex" }}>
                      <button
                        className={styles.toolbarButton}
                        aria-label="Reload"
                      >
                        <ArrowSync24Regular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>
                  <Tooltip content="Restore" relationship="label">
                    <span style={{ display: "inline-flex" }}>
                      <button
                        className={styles.toolbarButton}
                        aria-label="Restore"
                      >
                        <History24Regular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>
                  <Tooltip content="Highlight" relationship="label">
                    <span style={{ display: "inline-flex" }}>
                      <button
                        className={styles.toolbarButton}
                        aria-label="Highlight"
                      >
                        <HighlightRegular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip content="Select All" relationship="label">
                    <span style={{ display: "inline-flex" }}>
                      <button
                        className={styles.toolbarButton}
                        aria-label="Select All"
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

                  <Tooltip content="Copy" relationship="label">
                    <span style={{ display: "inline-flex" }}>
                      <button
                        className={styles.toolbarButton}
                        aria-label="Copy"
                      >
                        <Copy24Regular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>

                  <Tooltip content="Export" relationship="label">
                    <span style={{ display: "inline-flex" }}>
                      <button
                        className={styles.toolbarButton}
                        aria-label="Export"
                      >
                        <ArrowExportUp24Regular
                          className={styles.toolbarIcon}
                        />
                      </button>
                    </span>
                  </Tooltip>

                  <Tooltip content="Reload" relationship="label">
                    <span style={{ display: "inline-flex" }}>
                      <button
                        className={styles.toolbarButton}
                        aria-label="Reload"
                      >
                        <ArrowSync24Regular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>

                  <Tooltip content="Delete" relationship="label">
                    <span style={{ display: "inline-flex" }}>
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
                    </span>
                  </Tooltip>

                  <Tooltip content="Restore" relationship="label">
                    <span style={{ display: "inline-flex" }}>
                      <button
                        className={styles.toolbarButton}
                        aria-label="Restore"
                      >
                        <History24Regular className={styles.toolbarIcon} />
                      </button>
                    </span>
                  </Tooltip>
                </>
              )}
            </div>
            <div className={styles.rightActions}>
              <Tooltip content="Feedback" relationship="label">
                <span style={{ display: "inline-flex" }}>
                  <button className={styles.starButton} aria-label="Feedback">
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

                              <Tooltip content="Delete" relationship="label">
                                <span style={{ display: "inline-flex" }}>
                                  <button
                                    className={styles.orderDeleteButton}
                                    onClick={() =>
                                      handleDeleteOrder(section.id, order.id)
                                    }
                                    aria-label="Delete order"
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
                                        styles.highlightedContentDiv,
                                        styles.sectionTextareaDictationFocus
                                      )
                                    : styles.highlightedContentDiv
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
