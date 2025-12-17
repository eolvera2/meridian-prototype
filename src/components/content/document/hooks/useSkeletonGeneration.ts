/**
 * useSkeletonGeneration Hook
 *
 * Manages skeleton loading animations and "generating" toast notifications
 * for document generation scenarios (ambient recording stop, pronoun replacement,
 * referral letter drafting).
 */

import { useState, useRef, useCallback } from "react";
import type { DocumentItem } from "../DocumentComponent.types";

export interface UseSkeletonGenerationOptions {
  /** Current documents array */
  documents: DocumentItem[];
  /** Function to update expanded documents */
  setExpandedDocuments: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export interface UseSkeletonGenerationReturn {
  /** Whether skeleton animation is showing */
  showSkeleton: boolean;
  /** Set skeleton visibility */
  setShowSkeleton: React.Dispatch<React.SetStateAction<boolean>>;
  /** Whether generating toast is showing */
  showGeneratingToast: boolean;
  /** Set generating toast visibility */
  setShowGeneratingToast: React.Dispatch<React.SetStateAction<boolean>>;
  /** List of documents being generated */
  generatingDocuments: string[];
  /** Set generating documents list */
  setGeneratingDocuments: React.Dispatch<React.SetStateAction<string[]>>;
  /** Ref for skeleton timeout */
  skeletonTimeoutRef: React.RefObject<number | null>;
  /** Ref for toast timeout */
  toastTimeoutRef: React.RefObject<number | null>;
  /** Trigger skeleton animation with document expansion and toast */
  triggerSkeletonGeneration: (options: {
    duration?: number;
    toastDelay?: number;
    documentIds?: string[];
    documentNames?: string[];
    afterComplete?: () => void;
  }) => void;
  /** Get visible documents for generation (applies filtering) */
  getVisibleDocumentsForGeneration: () => DocumentItem[];
  /** Format generating documents text for display */
  getGeneratingText: () => string;
}

export const useSkeletonGeneration = (
  options: UseSkeletonGenerationOptions
): UseSkeletonGenerationReturn => {
  const { documents, setExpandedDocuments } = options;

  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showGeneratingToast, setShowGeneratingToast] = useState(false);
  const [generatingDocuments, setGeneratingDocuments] = useState<string[]>([]);
  const skeletonTimeoutRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  // Get visible documents for generation (with default filtering applied)
  const getVisibleDocumentsForGeneration = useCallback((): DocumentItem[] => {
    return documents;
  }, [documents]);

  // Trigger skeleton animation with options
  const triggerSkeletonGeneration = useCallback(
    (triggerOptions: {
      duration?: number;
      toastDelay?: number;
      documentIds?: string[];
      documentNames?: string[];
      afterComplete?: () => void;
    }) => {
      const {
        duration = 3000,
        toastDelay = 500,
        documentIds,
        documentNames,
        afterComplete,
      } = triggerOptions;

      // Show skeleton immediately
      setShowSkeleton(true);

      // Determine which documents to expand and show as generating
      let docsToGenerate: DocumentItem[];
      if (documentIds) {
        docsToGenerate = documents.filter((doc) =>
          documentIds.includes(doc.id)
        );
      } else {
        docsToGenerate = getVisibleDocumentsForGeneration();
      }

      // Expand documents
      const idsToExpand = docsToGenerate.map((doc) => doc.id);
      setExpandedDocuments((prev) => new Set([...prev, ...idsToExpand]));

      // Set generating documents for toast
      const names = documentNames || docsToGenerate.map((doc) => doc.name);
      setGeneratingDocuments(names);
      setShowGeneratingToast(true);

      // Clear any existing timeouts
      if (skeletonTimeoutRef.current) {
        clearTimeout(skeletonTimeoutRef.current);
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }

      // Hide skeleton after duration
      skeletonTimeoutRef.current = window.setTimeout(() => {
        setShowSkeleton(false);
        skeletonTimeoutRef.current = null;

        // Call afterComplete callback after a brief delay
        if (afterComplete) {
          setTimeout(afterComplete, 100);
        }
      }, duration);

      // Hide toast after skeleton duration + toastDelay
      toastTimeoutRef.current = window.setTimeout(() => {
        setShowGeneratingToast(false);
        toastTimeoutRef.current = null;
      }, duration + toastDelay);
    },
    [documents, getVisibleDocumentsForGeneration, setExpandedDocuments]
  );

  // Format generating documents text for display
  const getGeneratingText = useCallback((): string => {
    if (generatingDocuments.length === 0) {
      return "Generating documents...";
    }
    if (generatingDocuments.length === 1) {
      return `Generating: ${generatingDocuments[0]}`;
    }
    if (generatingDocuments.length === 2) {
      return `Generating: ${generatingDocuments[0]} and ${generatingDocuments[1]}`;
    }
    // For 3 or more documents
    const lastDoc = generatingDocuments[generatingDocuments.length - 1];
    const otherDocs = generatingDocuments.slice(0, -1).join(", ");
    return `Generating: ${otherDocs}, and ${lastDoc}`;
  }, [generatingDocuments]);

  return {
    showSkeleton,
    setShowSkeleton,
    showGeneratingToast,
    setShowGeneratingToast,
    generatingDocuments,
    setGeneratingDocuments,
    skeletonTimeoutRef,
    toastTimeoutRef,
    triggerSkeletonGeneration,
    getVisibleDocumentsForGeneration,
    getGeneratingText,
  };
};
