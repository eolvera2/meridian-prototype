/**
 * useDictationSimulation Hook
 *
 * Handles simulated dictation typing for document sections.
 */

import { useCallback, useRef } from "react";
import {
  DOCUMENT_TIMING_MS,
  getDictationContentForSection,
} from "../DocumentComponent.constants";
import type { DocumentItem } from "../DocumentComponent.types";
import type { TextFieldElement } from "../../../../utils/getCaretCoordinates";

export interface UseDictationSimulationOptions {
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  setTooltipVisible: React.Dispatch<React.SetStateAction<boolean>>;
  tooltipFadeTimeoutRef?: React.RefObject<number | null>;
}

export interface UseDictationSimulationReturn {
  isSimulatingRef: React.RefObject<boolean>;
  simulatingFieldRef: React.RefObject<TextFieldElement | null>;
  startSectionDictation: (
    documentId: string,
    sectionId: string,
    sectionTitle: string
  ) => void;
  stopSectionDictation: () => void;
}

export const useDictationSimulation = (
  options: UseDictationSimulationOptions
): UseDictationSimulationReturn => {
  const { documents, setDocuments, setTooltipVisible } = options;

  const dictationIntervalRef = useRef<number | null>(null);
  const isSimulatingRef = useRef(false);
  const simulatingFieldRef = useRef<TextFieldElement | null>(null);
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
        return;
      }
      isSimulatingRef.current = true;

      // Store reference to the field being simulated for auto-scroll
      // Fluent UI Textarea wraps the native textarea, so try multiple selectors
      let fieldElement = document.querySelector(
        `textarea[data-section="${sectionKey}"]`
      ) as TextFieldElement;

      // If not found, try finding textarea inside an element with data-section
      if (!fieldElement) {
        const wrapper = document.querySelector(
          `[data-section="${sectionKey}"]`
        );
        fieldElement = wrapper?.querySelector("textarea") as TextFieldElement;
      }

      if (fieldElement) {
        simulatingFieldRef.current = fieldElement;
        // Keep the tooltip visible during dictation
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

      const typingSpeed = DOCUMENT_TIMING_MS.dictationCharInterval;

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
          if (dictationIntervalRef.current) {
            clearInterval(dictationIntervalRef.current);
            dictationIntervalRef.current = null;
          }
          isSimulatingRef.current = false;
          currentSimulationRef.current = null;
          simulatingFieldRef.current = null;
        }
      }, typingSpeed);
    },
    [documents, setDocuments, setTooltipVisible]
  );

  // Stop dictation simulation
  const stopSectionDictation = useCallback(() => {
    if (dictationIntervalRef.current) {
      clearInterval(dictationIntervalRef.current);
      dictationIntervalRef.current = null;
    }
    isSimulatingRef.current = false;
    currentSimulationRef.current = null;
    simulatingFieldRef.current = null;
  }, []);

  return {
    isSimulatingRef,
    simulatingFieldRef,
    startSectionDictation,
    stopSectionDictation,
  };
};
