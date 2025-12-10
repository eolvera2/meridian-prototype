/**
 * useTypingReplacement Hook
 *
 * Manages typing replacement simulation for auto-select text functionality.
 * Simulates character-by-character typing to replace selected text.
 */

import { useRef, useCallback } from "react";
import type { AutoSelectTextConfig } from "../DocumentComponent.types";
import type { DocumentItem } from "../DocumentComponent.types";

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
      console.log("[TypingSimulation] Already simulated, skipping");
      return false;
    }

    const { textToSelect } = autoSelectText;
    const replacementText = "46-year"; // The text to type as replacement

    // Find the textarea with the selected text
    let targetTextarea: HTMLTextAreaElement | null = null;
    const allTextareas = document.querySelectorAll("textarea");

    for (const ta of allTextareas) {
      const value = ta.value || "";
      if (value.includes(textToSelect)) {
        targetTextarea = ta as HTMLTextAreaElement;
        break;
      }
    }

    if (!targetTextarea) {
      console.log(
        "[TypingSimulation] Could not find textarea with target text"
      );
      return false;
    }

    console.log("[TypingSimulation] Starting typing simulation");

    // Mark as simulated
    hasSimulatedReplacementRef.current = true;

    // Hide tooltip during simulation
    setTooltipVisible(false);
    isSimulatingRef.current = true;

    const textContent = targetTextarea.value;
    const startIndex = textContent.indexOf(textToSelect);

    if (startIndex === -1) {
      console.log("[TypingSimulation] Text not found in textarea");
      isSimulatingRef.current = false;
      return false;
    }

    const endIndex = startIndex + textToSelect.length;

    // First, delete the selected text by setting selection and replacing with empty
    const beforeText = textContent.substring(0, startIndex);
    const afterText = textContent.substring(endIndex);

    // Get the document and section from the textarea's data attribute
    const sectionKey = targetTextarea.getAttribute("data-section") || "";
    const [docId, ...sectionParts] = sectionKey.split("-");
    const secId = sectionParts.join("-");

    // Clear the selected text first
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            sections:
              doc.sections?.map((section) =>
                section.id === secId
                  ? { ...section, content: beforeText + afterText }
                  : section
              ) || [],
          };
        }
        return doc;
      })
    );

    // Now simulate typing the replacement text character by character
    let charIndex = 0;
    const typingSpeed = 200; // milliseconds per character (slower for better visibility)

    // Clear any existing replacement interval
    if (replacementIntervalRef.current) {
      clearInterval(replacementIntervalRef.current);
    }

    replacementIntervalRef.current = window.setInterval(() => {
      if (charIndex <= replacementText.length) {
        const currentTypedText = replacementText.substring(0, charIndex);
        const newContent = beforeText + currentTypedText + afterText;

        setDocuments((prevDocuments) =>
          prevDocuments.map((doc) => {
            if (doc.id === docId) {
              return {
                ...doc,
                sections:
                  doc.sections?.map((section) =>
                    section.id === secId
                      ? { ...section, content: newContent }
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
            const cursorPos = startIndex + charIndex;
            ta.focus();
            ta.setSelectionRange(cursorPos, cursorPos);
          }
        }, 0);

        charIndex++;
      } else {
        // Typing complete
        console.log("[TypingSimulation] Typing simulation complete");
        if (replacementIntervalRef.current) {
          clearInterval(replacementIntervalRef.current);
          replacementIntervalRef.current = null;
        }
        isSimulatingRef.current = false;

        // Select the newly typed text
        setTimeout(() => {
          const ta = document.querySelector(
            `textarea[data-section="${sectionKey}"]`
          ) as HTMLTextAreaElement;
          if (ta) {
            ta.focus();
            ta.setSelectionRange(
              startIndex,
              startIndex + replacementText.length
            );
          }
        }, 100);
      }
    }, typingSpeed);

    return true;
  }, [autoSelectText, isSimulatingRef, setDocuments, setTooltipVisible]);

  return {
    runTypingSimulation,
    replacementIntervalRef,
    hasSimulatedReplacementRef,
  };
};
