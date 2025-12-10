/**
 * useSectionDictation Hook
 *
 * Manages section-level dictation simulation for typing content into document sections.
 */

import { useRef, useCallback } from "react";
import type { TextFieldElement } from "../../../../utils/getCaretCoordinates";
import { getDictationContentForSection } from "../DocumentComponent.constants";
import type { DocumentItem } from "../DocumentComponent.types";

export interface UseSectionDictationOptions {
  /** Ref to track if simulation is currently running */
  isSimulatingRef: React.MutableRefObject<boolean>;
  /** Ref for the field being simulated */
  simulatingFieldRef: React.MutableRefObject<TextFieldElement | null>;
  /** Current documents array */
  documents: DocumentItem[];
  /** Function to update documents */
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  /** Function to hide/show tooltip */
  setTooltipVisible: React.Dispatch<React.SetStateAction<boolean>>;
  /** Ref for the active field */
  activeFieldRef: React.MutableRefObject<TextFieldElement | null>;
  /** Function to update tooltip position from caret */
  updateTooltipFromCaret?: (element: TextFieldElement) => void;
}

export interface UseSectionDictationReturn {
  /** Start dictation simulation for a section */
  startSectionDictation: (
    documentId: string,
    sectionId: string,
    sectionTitle: string
  ) => void;
  /** Stop dictation simulation */
  stopSectionDictation: () => void;
  /** Ref for the current simulation state */
  currentSimulationRef: React.RefObject<{
    documentId: string;
    sectionId: string;
    charIndex: number;
    fullText: string;
  } | null>;
  /** Ref for the dictation interval */
  dictationIntervalRef: React.RefObject<number | null>;
}

export const useSectionDictation = (
  options: UseSectionDictationOptions
): UseSectionDictationReturn => {
  const {
    isSimulatingRef,
    simulatingFieldRef,
    documents,
    setDocuments,
    setTooltipVisible,
    activeFieldRef,
    updateTooltipFromCaret,
  } = options;

  const dictationIntervalRef = useRef<number | null>(null);
  const tooltipFadeTimeoutRef = useRef<number | null>(null);
  const currentSimulationRef = useRef<{
    documentId: string;
    sectionId: string;
    charIndex: number;
    fullText: string;
  } | null>(null);

  // Start dictation simulation for a specific section
  const startSectionDictation = useCallback(
    (documentId: string, sectionId: string, sectionTitle: string) => {
      const sectionKey = `${documentId}-${sectionId}`;

      // Check if already simulating
      if (isSimulatingRef.current) {
        console.log("Already simulating, skipping");
        return;
      }

      console.log("Starting dictation for section:", sectionTitle);
      isSimulatingRef.current = true;

      // Use the already-focused field from activeFieldRef if available
      // This avoids re-querying the DOM and potentially getting the wrong element
      let fieldElement = activeFieldRef.current;

      // Only query DOM if we don't have an active field reference
      if (!fieldElement) {
        // Fluent UI Textarea wraps the native textarea, so try multiple selectors
        fieldElement = document.querySelector(
          `textarea[data-section="${sectionKey}"]`
        ) as TextFieldElement;

        // If not found, try finding textarea inside an element with data-section
        if (!fieldElement) {
          const wrapper = document.querySelector(
            `[data-section="${sectionKey}"]`
          );
          fieldElement = wrapper?.querySelector("textarea") as TextFieldElement;
        }
      }

      if (fieldElement) {
        simulatingFieldRef.current = fieldElement;
        // Keep the tooltip visible - don't update position here as focus handler already did it
        setTooltipVisible(true);
      }

      const fullText = getDictationContentForSection(sectionTitle);

      // Get current section content to determine where to start
      const currentDocument = documents.find((doc) => doc.id === documentId);
      const currentSection = currentDocument?.sections?.find(
        (sec) => sec.id === sectionId
      );
      const currentContent = currentSection?.content || "";

      // Start from current content length (continue from where we left off)
      const startIndex = currentContent.length;

      currentSimulationRef.current = {
        documentId,
        sectionId,
        charIndex: startIndex,
        fullText,
      };

      // Clear any existing interval
      if (dictationIntervalRef.current) {
        clearInterval(dictationIntervalRef.current);
      }

      const typingSpeed = 30; // milliseconds per character

      // Hide tooltip when dictation typing starts
      setTooltipVisible(false);

      // Clear any existing fade timeout
      if (tooltipFadeTimeoutRef.current) {
        clearTimeout(tooltipFadeTimeoutRef.current);
        tooltipFadeTimeoutRef.current = null;
      }

      dictationIntervalRef.current = window.setInterval(() => {
        if (!currentSimulationRef.current) return;

        const {
          documentId: docId,
          sectionId: secId,
          charIndex,
          fullText: text,
        } = currentSimulationRef.current;

        if (charIndex <= text.length) {
          const currentText = text.substring(0, charIndex);

          // Update the section content
          setDocuments((prevDocuments) =>
            prevDocuments.map((doc) => {
              if (doc.id === docId) {
                return {
                  ...doc,
                  sections:
                    doc.sections?.map((section) =>
                      section.id === secId
                        ? { ...section, content: currentText }
                        : section
                    ) || [],
                };
              }
              return doc;
            })
          );

          // Update caret position without scrolling (textarea will auto-grow)
          if (simulatingFieldRef.current) {
            const field = simulatingFieldRef.current;
            // Set selection to end of text to position caret
            field.setSelectionRange(currentText.length, currentText.length);
          }

          currentSimulationRef.current.charIndex++;
        } else {
          // Typing complete for this section
          console.log("Typing complete for section:", sectionTitle);
          if (dictationIntervalRef.current) {
            clearInterval(dictationIntervalRef.current);
            dictationIntervalRef.current = null;
          }
          isSimulatingRef.current = false;
          currentSimulationRef.current = null;

          // Show tooltip after 1 second delay when typing stops
          tooltipFadeTimeoutRef.current = window.setTimeout(() => {
            if (simulatingFieldRef.current) {
              updateTooltipFromCaret?.(simulatingFieldRef.current);
            } else if (activeFieldRef.current) {
              updateTooltipFromCaret?.(activeFieldRef.current);
            }
            setTooltipVisible(true);
            simulatingFieldRef.current = null;
            tooltipFadeTimeoutRef.current = null;
          }, 1000);
        }
      }, typingSpeed);
    },
    [
      documents,
      updateTooltipFromCaret,
      isSimulatingRef,
      simulatingFieldRef,
      setDocuments,
      setTooltipVisible,
      activeFieldRef,
    ]
  );

  // Stop dictation simulation
  const stopSectionDictation = useCallback(() => {
    if (dictationIntervalRef.current) {
      clearInterval(dictationIntervalRef.current);
      dictationIntervalRef.current = null;
    }
    if (tooltipFadeTimeoutRef.current) {
      clearTimeout(tooltipFadeTimeoutRef.current);
      tooltipFadeTimeoutRef.current = null;
    }
    isSimulatingRef.current = false;
    currentSimulationRef.current = null;
    simulatingFieldRef.current = null;
  }, [isSimulatingRef, simulatingFieldRef]);

  return {
    startSectionDictation,
    stopSectionDictation,
    currentSimulationRef,
    dictationIntervalRef,
  };
};
