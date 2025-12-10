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
