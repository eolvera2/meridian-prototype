/**
 * useOrderManagement Hook
 *
 * Manages order items state within document sections,
 * including AI-generated orders and order CRUD operations.
 */

import * as React from "react";
import type { OrderItem } from "../DocumentComponent.types";
import type { DocumentItem } from "../DocumentComponent.types";

export interface UseOrderManagementOptions {
  document: DocumentItem;
  onOrderCountChange?: (documentId: string, count: number) => void;
  showSkeleton: boolean;
  isPronounReplacement: boolean;
  isDraftingReferralLetter: boolean;
}

export interface UseOrderManagementReturn {
  sectionOrders: Record<string, OrderItem[]>;
  setSectionOrders: React.Dispatch<
    React.SetStateAction<Record<string, OrderItem[]>>
  >;
  handleAddOrder: (sectionId: string) => void;
  handleOrderTextChange: (
    sectionId: string,
    orderId: string,
    newText: string
  ) => void;
  handleDeleteOrder: (sectionId: string, orderId: string) => void;
}

// Pool of AI-generated orders
const AI_ORDER_POOL = [
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
];

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
  result = result
    // Fix irregular verbs first
    .replace(/\b(They|they)\s+is\b/g, "$1 are")
    .replace(/\b(They|they)\s+was\b/g, "$1 were")
    .replace(/\b(They|they)\s+has\b/g, "$1 have")
    .replace(/\b(They|they)\s+does\b/g, "$1 do")
    .replace(/\b(They|they)\s+goes\b/g, "$1 go")

    // Fix common medical/clinical verbs
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

export function useOrderManagement({
  document,
  onOrderCountChange,
  showSkeleton,
  isPronounReplacement,
  isDraftingReferralLetter,
}: UseOrderManagementOptions): UseOrderManagementReturn {
  // Track previous skeleton state
  const previousShowSkeletonRef = React.useRef(showSkeleton);

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
  }, [
    showSkeleton,
    document.type,
    document.sections,
    isPronounReplacement,
    isDraftingReferralLetter,
  ]);

  // Handle adding a new order
  const handleAddOrder = React.useCallback((sectionId: string) => {
    const newOrder: OrderItem = {
      id: `order-${Date.now()}`,
      text: "",
    };
    setSectionOrders((prev) => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] || []), newOrder],
    }));
  }, []);

  // Handle order text change
  const handleOrderTextChange = React.useCallback(
    (sectionId: string, orderId: string, newText: string) => {
      setSectionOrders((prev) => ({
        ...prev,
        [sectionId]: (prev[sectionId] || []).map((order) =>
          order.id === orderId ? { ...order, text: newText } : order
        ),
      }));
    },
    []
  );

  // Handle order deletion
  const handleDeleteOrder = React.useCallback(
    (sectionId: string, orderId: string) => {
      setSectionOrders((prev) => ({
        ...prev,
        [sectionId]: (prev[sectionId] || []).filter(
          (order) => order.id !== orderId
        ),
      }));
    },
    []
  );

  return {
    sectionOrders,
    setSectionOrders,
    handleAddOrder,
    handleOrderTextChange,
    handleDeleteOrder,
  };
}
