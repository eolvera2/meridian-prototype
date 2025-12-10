/**
 * useDocumentEffects Hook
 *
 * Consolidates all useEffect hooks for the DocumentComponent,
 * including pronoun replacement, referral letter drafting,
 * ambient recording, and cleanup effects.
 */

import { useEffect, useRef } from "react";
import type { DocumentItem } from "../DocumentComponent.types";

export type AmbientState = "stop" | "recording" | "pause";

export interface UseDocumentEffectsOptions {
  // Props
  dictationState: "on" | "off";
  isRecording: boolean;
  ambientState: AmbientState;
  micMode: "ambient" | "dictation";
  triggerPronounReplacement: boolean;
  triggerDraftReferralLetter: boolean;
  autoSelectText?: { documentId: string; sectionId: string; text: string };

  // State
  documents: DocumentItem[];
  tooltipVisible: boolean;
  ambientRecordingStarted: boolean;

  // Setters
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  setAmbientRecordingStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPronounReplacement: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDraftingReferralLetter: React.Dispatch<React.SetStateAction<boolean>>;
  setShowReferralLetter: React.Dispatch<React.SetStateAction<boolean>>;

  // Refs
  documentRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  dictationIntervalRef: React.MutableRefObject<ReturnType<
    typeof setInterval
  > | null>;
  skeletonTimeoutRef: React.MutableRefObject<ReturnType<
    typeof setTimeout
  > | null>;
  replacementIntervalRef: React.MutableRefObject<ReturnType<
    typeof setInterval
  > | null>;
  toastTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  activeFieldRef: React.MutableRefObject<
    HTMLTextAreaElement | HTMLInputElement | null
  >;
  hasSimulatedReplacementRef: React.MutableRefObject<boolean>;

  // Callbacks
  updateTooltipFromCaret: (
    field: HTMLTextAreaElement | HTMLInputElement
  ) => void;
  stopSectionDictation: () => void;
  triggerSkeletonGeneration: (options: {
    duration: number;
    toastDelay: number;
    documentIds?: string[];
    documentNames?: string[];
    afterComplete?: () => void;
  }) => void;
  runTypingSimulation: () => void;
}

export interface UseDocumentEffectsReturn {
  prevDictationStateRef: React.MutableRefObject<"on" | "off">;
}

export function useDocumentEffects({
  dictationState,
  isRecording,
  ambientState,
  micMode,
  triggerPronounReplacement,
  triggerDraftReferralLetter,
  autoSelectText,
  documents,
  tooltipVisible,
  ambientRecordingStarted,
  setDocuments,
  setAmbientRecordingStarted,
  setIsPronounReplacement,
  setIsDraftingReferralLetter,
  setShowReferralLetter,
  documentRefs,
  dictationIntervalRef,
  skeletonTimeoutRef,
  replacementIntervalRef,
  toastTimeoutRef,
  activeFieldRef,
  hasSimulatedReplacementRef,
  updateTooltipFromCaret,
  stopSectionDictation,
  triggerSkeletonGeneration,
  runTypingSimulation,
}: UseDocumentEffectsOptions): UseDocumentEffectsReturn {
  // Track previous states for transition detection
  const prevDictationStateRef = useRef(dictationState);
  const prevTriggerPronounRef = useRef(triggerPronounReplacement);
  const prevTriggerReferralRef = useRef(triggerDraftReferralLetter);
  const previousIsRecordingRef = useRef(isRecording);
  const previousAmbientStateRef = useRef(ambientState);

  // Trigger typing simulation when dictationState changes to "on"
  useEffect(() => {
    const wasOff = prevDictationStateRef.current === "off";
    const isNowOn = dictationState === "on";
    prevDictationStateRef.current = dictationState;

    if (
      wasOff &&
      isNowOn &&
      autoSelectText &&
      !hasSimulatedReplacementRef.current
    ) {
      console.log(
        "[DictationState] Detected transition to 'on', triggering typing simulation"
      );
      setTimeout(() => {
        runTypingSimulation();
      }, 100);
    }
  }, [
    dictationState,
    autoSelectText,
    runTypingSimulation,
    hasSimulatedReplacementRef,
  ]);

  // Clean up on unmount
  useEffect(() => {
    // Capture current values of refs for cleanup
    const dictationInterval = dictationIntervalRef.current;
    const skeletonTimeout = skeletonTimeoutRef.current;
    const replacementInterval = replacementIntervalRef.current;
    const toastTimeout = toastTimeoutRef.current;

    return () => {
      if (dictationInterval) {
        clearInterval(dictationInterval);
      }
      if (skeletonTimeout) {
        clearTimeout(skeletonTimeout);
      }
      if (replacementInterval) {
        clearInterval(replacementInterval);
      }
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
    };
  }, [
    dictationIntervalRef,
    skeletonTimeoutRef,
    replacementIntervalRef,
    toastTimeoutRef,
  ]);

  // Update tooltip position on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (activeFieldRef.current && tooltipVisible) {
        updateTooltipFromCaret(activeFieldRef.current);
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [tooltipVisible, updateTooltipFromCaret, activeFieldRef]);

  // Track ambient recording state and trigger skeleton when it stops
  useEffect(() => {
    const wasRecording = previousIsRecordingRef.current;
    const prevAmbientState = previousAmbientStateRef.current;
    previousIsRecordingRef.current = isRecording;
    previousAmbientStateRef.current = ambientState;

    const isDirectStopFromRecording =
      micMode === "ambient" &&
      wasRecording &&
      !isRecording &&
      ambientState === "stop" &&
      prevAmbientState === "recording" &&
      ambientRecordingStarted;

    const isStopAfterPause =
      micMode === "ambient" &&
      prevAmbientState === "pause" &&
      ambientState === "stop" &&
      ambientRecordingStarted;

    const isFullyStoppedFromRecording =
      isDirectStopFromRecording || isStopAfterPause;

    if (isFullyStoppedFromRecording) {
      setAmbientRecordingStarted(false);
      triggerSkeletonGeneration({ duration: 6000, toastDelay: 3000 });
    } else if (micMode === "ambient" && isRecording && !wasRecording) {
      setAmbientRecordingStarted(true);
    }
  }, [
    isRecording,
    ambientState,
    micMode,
    ambientRecordingStarted,
    setAmbientRecordingStarted,
    triggerSkeletonGeneration,
  ]);

  // Stop typing animation when dictation state changes to "off"
  useEffect(() => {
    if (dictationState === "off") {
      stopSectionDictation();
    }
  }, [dictationState, stopSectionDictation]);

  // Watch for pronoun replacement trigger from Library prompt click
  useEffect(() => {
    const wasTrigger = prevTriggerPronounRef.current;
    prevTriggerPronounRef.current = triggerPronounReplacement;

    if (!wasTrigger && triggerPronounReplacement) {
      setIsPronounReplacement(true);
      triggerSkeletonGeneration({
        duration: 5500,
        toastDelay: 3000,
        afterComplete: () => setIsPronounReplacement(false),
      });
    }
  }, [
    triggerPronounReplacement,
    triggerSkeletonGeneration,
    setIsPronounReplacement,
  ]);

  // Watch for draft referral letter trigger from Library prompt click
  useEffect(() => {
    const wasTrigger = prevTriggerReferralRef.current;
    prevTriggerReferralRef.current = triggerDraftReferralLetter;

    if (!wasTrigger && triggerDraftReferralLetter) {
      let referralLetter = documents.find(
        (doc) => doc.type === "referral-letter"
      );

      if (!referralLetter) {
        const today = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        const newReferralLetter: DocumentItem = {
          id: `doc-${Date.now()}`,
          name: "Referral Letter",
          created: today,
          type: "referral-letter",
          sections: [
            {
              id: `referral-${Date.now()}`,
              title: "Referral Note",
              content: "",
              checked: false,
            },
          ],
          isExpanded: false,
        };

        setDocuments((prev) => [newReferralLetter, ...prev]);
        referralLetter = newReferralLetter;
      }

      setIsDraftingReferralLetter(true);
      setShowReferralLetter(true);

      const referralId = referralLetter.id;
      setTimeout(() => {
        const referralElement = documentRefs.current[referralId];
        if (referralElement) {
          referralElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);

      triggerSkeletonGeneration({
        duration: 5500,
        toastDelay: 3000,
        documentIds: [referralId],
        documentNames: ["Referral letter"],
        afterComplete: () => setIsDraftingReferralLetter(false),
      });
    }
  }, [
    triggerDraftReferralLetter,
    documents,
    triggerSkeletonGeneration,
    setDocuments,
    setIsDraftingReferralLetter,
    setShowReferralLetter,
    documentRefs,
  ]);

  return {
    prevDictationStateRef,
  };
}
