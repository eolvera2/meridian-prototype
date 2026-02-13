/**
 * useAutoSelectText Hook
 *
 * Manages automatic text selection in document sections.
 * Expands documents, scrolls to the target textarea, and selects specified text.
 */

import { useEffect } from "react";
import type { AutoSelectTextConfig } from "../DocumentComponent.types";
import { DOCUMENT_TIMING_MS } from "../DocumentComponent.constants";

export interface UseAutoSelectTextOptions {
  /** Auto-select configuration from props */
  autoSelectText: AutoSelectTextConfig | undefined;
  /** Function to update expanded documents */
  setExpandedDocuments: React.Dispatch<React.SetStateAction<Set<string>>>;
  /** Refs to document elements for scrolling */
  documentRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
}

/**
 * Hook to automatically select text in a document section.
 * When autoSelectText config is provided, it will:
 * 1. Expand the target document
 * 2. Scroll to the document card
 * 3. Find the textarea containing the text
 * 4. Select the specified text
 */
export const useAutoSelectText = (options: UseAutoSelectTextOptions): void => {
  const { autoSelectText, setExpandedDocuments, documentRefs } = options;

  useEffect(() => {
    if (!autoSelectText) return;

    const { documentId, sectionId, textToSelect } = autoSelectText;
    const sectionKey = `${documentId}-${sectionId}`;

    // First, ensure the document is expanded by adding it to the set
    setExpandedDocuments((prev) => {
      const newSet = new Set(prev);
      newSet.add(documentId);
      return newSet;
    });

    // Also click on the document header to ensure it's truly expanded in the UI
    // and scroll it into view
    const expandAndSelect = () => {
      // Find the document card and click on it to expand
      const documentCard = documentRefs.current[documentId];
      if (documentCard) {
        // Find the scrollable container (documentArea) instead of using global scrollIntoView
        const scrollContainer = documentCard.closest('[class*="documentArea"]');
        if (scrollContainer) {
          // Calculate position relative to scroll container
          const containerRect = scrollContainer.getBoundingClientRect();
          const cardRect = documentCard.getBoundingClientRect();
          const scrollTop =
            scrollContainer.scrollTop + (cardRect.top - containerRect.top);
          scrollContainer.scrollTo({ top: scrollTop, behavior: "smooth" });
        } else {
          documentCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      // Wait for expansion animation and DOM update
      setTimeout(() => {
        // Now look for the textarea with the text
        let textarea: HTMLTextAreaElement | null = null;
        const allTextareas = document.querySelectorAll("textarea");

        for (const ta of allTextareas) {
          const value = ta.value || "";
          if (value.includes(textToSelect)) {
            // Make sure this is in the right section by checking data-section
            const parent = ta.closest(`[data-section="${sectionKey}"]`);
            if (parent || value.includes("Mr. Brown")) {
              // Specific check for History of Present Illness content
              textarea = ta as HTMLTextAreaElement;
              break;
            }
          }
        }

        if (textarea) {
          const textContent = textarea.value;
          const startIndex = textContent.indexOf(textToSelect);

          if (startIndex !== -1) {
            const endIndex = startIndex + textToSelect.length;

            // Store reference
            const targetTextarea = textarea;

            // Scroll textarea into view within the scrollable container
            const scrollContainer = textarea.closest('[class*="documentArea"]');
            if (scrollContainer) {
              const containerRect = scrollContainer.getBoundingClientRect();
              const textareaRect = textarea.getBoundingClientRect();
              // Calculate scroll position to center the textarea
              const scrollTop =
                scrollContainer.scrollTop +
                (textareaRect.top - containerRect.top) -
                containerRect.height / 2 +
                textareaRect.height / 2;
              scrollContainer.scrollTo({
                top: Math.max(0, scrollTop),
                behavior: "smooth",
              });
            } else {
              textarea.scrollIntoView({ behavior: "smooth", block: "center" });
            }

            // Apply selection after scroll completes
            setTimeout(() => {
              targetTextarea.focus();
              targetTextarea.setSelectionRange(startIndex, endIndex);
            }, DOCUMENT_TIMING_MS.autoSelectApplySelectionDelay);
          }
        }
      }, DOCUMENT_TIMING_MS.autoSelectAfterExpandDelay);
    };

    // Start the process after a short delay to let React render
    const timer = setTimeout(expandAndSelect, DOCUMENT_TIMING_MS.autoSelectStartDelay);
    return () => clearTimeout(timer);
  }, [autoSelectText, setExpandedDocuments, documentRefs]);
};
