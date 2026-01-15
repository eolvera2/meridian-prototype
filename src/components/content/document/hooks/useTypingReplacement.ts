/**
 * useTypingReplacement Hook
 *
 * Manages typing replacement simulation for auto-select text functionality.
 * Simulates character-by-character typing to replace selected text.
 */

import { useRef, useCallback } from "react";
import type { AutoSelectTextConfig } from "../DocumentComponent.types";
import type { DocumentItem } from "../DocumentComponent.types";
import { DOCUMENT_TIMING_MS } from "../DocumentComponent.constants";

export interface UseTypingReplacementOptions {
  /** Ref to track if simulation is currently running */
  isSimulatingRef: React.MutableRefObject<boolean>;
  /** Auto-select text configuration */
  autoSelectText: AutoSelectTextConfig | undefined;
  /** Function to update documents */
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  /** Function to show/hide tooltip */
  setTooltipVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UseTypingReplacementReturn {
  /** Run the typing simulation to replace selected text */
  runTypingSimulation: () => boolean;
  /** Ref for the replacement interval */
  replacementIntervalRef: React.RefObject<number | null>;
  /** Ref to track if replacement has been simulated */
  hasSimulatedReplacementRef: React.RefObject<boolean>;
}

export const useTypingReplacement = (
  options: UseTypingReplacementOptions
): UseTypingReplacementReturn => {
  const { isSimulatingRef, autoSelectText, setDocuments, setTooltipVisible } =
    options;

  const replacementIntervalRef = useRef<number | null>(null);
  const hasSimulatedReplacementRef = useRef(false);

  // Reusable function to run the typing simulation
  const runTypingSimulation = useCallback(() => {
    if (!autoSelectText) {
      return false;
    }

    // Prevent running twice
    if (hasSimulatedReplacementRef.current) {
      return false;
    }

    const { textToSelect, documentId, sectionId } = autoSelectText;

    // The replacement text is the same as textToSelect - we're typing the entire content
    const replacementText = textToSelect;

    // Find the textarea for the specific document and section
    const sectionKey = `${documentId}-${sectionId}`;
    const targetTextarea = document.querySelector(
      `textarea[data-section="${sectionKey}"]`
    ) as HTMLTextAreaElement;

    if (!targetTextarea) {
      return false;
    }

    // Mark as simulated
    hasSimulatedReplacementRef.current = true;

    // Hide tooltip during simulation
    setTooltipVisible(false);
    isSimulatingRef.current = true;

    // Get the document and section IDs
    const docId = documentId;
    const secId = sectionId;

    // Clear the content first
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            sections:
              doc.sections?.map((section) =>
                section.id === secId ? { ...section, content: "" } : section
              ) || [],
          };
        }
        return doc;
      })
    );

    // Wait for DOM to update, then focus and scroll before starting typing
    setTimeout(() => {
      const ta = document.querySelector(
        `textarea[data-section="${sectionKey}"]`
      ) as HTMLTextAreaElement;
      if (ta) {
        // First, find the section container (parent elements) to scroll into view
        // Look for the section's accordion item or card
        const sectionContainer =
          ta.closest('[class*="section"]') || ta.parentElement?.parentElement;

        // Scroll the section container into view first
        if (sectionContainer && sectionContainer instanceof HTMLElement) {
          sectionContainer.scrollIntoView({
            behavior: "instant",
            block: "start",
          });
        }

        // Small delay to let the scroll settle
        setTimeout(() => {
          // Focus the textarea
          ta.focus();

          // Scroll the textarea itself to ensure it's centered
          ta.scrollIntoView({ behavior: "instant", block: "center" });

          // Wait for everything to settle before starting typing
          setTimeout(() => {
            startTypingAnimation();
          }, DOCUMENT_TIMING_MS.typingReplacementStartDelay);
        }, DOCUMENT_TIMING_MS.typingReplacementScrollSettleDelay);
      }
    }, DOCUMENT_TIMING_MS.typingReplacementDomUpdateDelay);

    // Function to start the typing animation
    const startTypingAnimation = () => {
      // Now simulate typing the replacement text character by character
      let charIndex = 0;
      const typingSpeed = DOCUMENT_TIMING_MS.typingReplacementCharInterval;

      // Clear any existing replacement interval
      if (replacementIntervalRef.current) {
        clearInterval(replacementIntervalRef.current);
      }

      replacementIntervalRef.current = window.setInterval(() => {
        if (charIndex <= replacementText.length) {
          const currentTypedText = replacementText.substring(0, charIndex);

          setDocuments((prevDocuments) =>
            prevDocuments.map((doc) => {
              if (doc.id === docId) {
                return {
                  ...doc,
                  sections:
                    doc.sections?.map((section) =>
                      section.id === secId
                        ? { ...section, content: currentTypedText }
                        : section
                    ) || [],
                };
              }
              return doc;
            })
          );

          // Update cursor position in textarea
          setTimeout(() => {
            const ta = document.querySelector(
              `textarea[data-section="${sectionKey}"]`
            ) as HTMLTextAreaElement;
            if (ta) {
              ta.focus();
              ta.setSelectionRange(charIndex, charIndex);
            }
          }, DOCUMENT_TIMING_MS.typingReplacementCursorUpdateDelay);

          charIndex++;
        } else {
          // Typing complete
          if (replacementIntervalRef.current) {
            clearInterval(replacementIntervalRef.current);
            replacementIntervalRef.current = null;
          }
          isSimulatingRef.current = false;

          // Place cursor at the end
          setTimeout(() => {
            const ta = document.querySelector(
              `textarea[data-section="${sectionKey}"]`
            ) as HTMLTextAreaElement;
            if (ta) {
              ta.focus();
              ta.setSelectionRange(
                replacementText.length,
                replacementText.length
              );
            }
          }, DOCUMENT_TIMING_MS.typingReplacementEndCursorDelay);
        }
      }, typingSpeed);
    };

    return true;
  }, [autoSelectText, isSimulatingRef, setDocuments, setTooltipVisible]);

  return {
    runTypingSimulation,
    replacementIntervalRef,
    hasSimulatedReplacementRef,
  };
};
