import React, { useState, useRef, useEffect, useCallback } from "react";
import documentsData from "../../data/documentsData.json";
import { GeneratingToast } from "./GeneratingToast";
import type { TextFieldElement } from "../../utils/getCaretCoordinates.ts";
import { AddNoteDialog } from "./AddNoteDialog";
import { useTooltipContext } from "./tooltip";
import { useWorklistContext } from "./worklist";

// Import from extracted modules
import {
  useStyles,
  DocumentCard,
  DeleteDocumentDialog,
  DocumentHeader,
  useSectionDictation,
  useTypingReplacement,
  useDocumentHandlers,
  useSkeletonGeneration,
  useAutoSelectText,
  createDocumentFromType,
} from "./document";
import type {
  DocumentItem,
  DocumentGridItem,
  DocumentComponentProps,
} from "./document";

export const DocumentComponent: React.FC<DocumentComponentProps> = ({
  documents: propDocuments = documentsData as DocumentItem[],
  onDocumentClick,
  onSectionToggle,
  onSectionContentChange,
  onDocumentCheckToggle,
  isRecording = false,
  ambientState = "stop",
  micMode = "ambient",
  // onMicModeToggle now handled globally in MainContent
  dictationState = "off",
  onNavigateToDocumentSettings,
  triggerPronounReplacement = false,
  triggerDraftReferralLetter = false,
  autoSelectText,
  onReferralLetterAdd,
  onOrderDelete,
  initialExpandedDocuments,
  onPronounReplacementComplete,
}) => {
  const styles = useStyles();
  const { updateSelectedPatientLastModified } = useWorklistContext();
  const [documents, setDocuments] = useState<DocumentItem[]>(propDocuments);
  // Expand Note by default, or use initialExpandedDocuments if provided
  const [expandedDocuments, setExpandedDocuments] = useState<Set<string>>(
    initialExpandedDocuments ?? new Set(["1"])
  );
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  // Track documents that should auto-focus their textarea
  const [autoFocusDocuments, setAutoFocusDocuments] = useState<Set<string>>(
    new Set()
  );
  // State for document delete confirmation dialog
  const [isDeleteDocumentDialogOpen, setIsDeleteDocumentDialogOpen] =
    useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  // Track order counts per document (updated when orders are added/deleted in cards)
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({});
  // Track if we're doing pronoun replacement (triggered by Library prompt)
  const [isPronounReplacement, setIsPronounReplacement] = useState(false);
  const prevTriggerPronounRef = useRef(triggerPronounReplacement);
  // Track if we're drafting referral letter (triggered by Library prompt)
  const [isDraftingReferralLetter, setIsDraftingReferralLetter] =
    useState(false);
  const prevTriggerReferralRef = useRef(triggerDraftReferralLetter);
  // Track ambient recording state
  const [ambientRecordingStarted, setAmbientRecordingStarted] = useState(false);
  // Track when ambient recording has stopped (for timestamp updates)
  const [ambientRecordingStopped, setAmbientRecordingStopped] = useState(false);

  console.log(
    "DocumentComponent render, isAddNoteDialogOpen:",
    isAddNoteDialogOpen
  );

  const documentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const simulatingFieldRef = useRef<TextFieldElement | null>(null);

  // Use skeleton generation hook for loading animations and toast
  const {
    showSkeleton,
    showGeneratingToast,
    setShowGeneratingToast,
    skeletonTimeoutRef,
    toastTimeoutRef,
    triggerSkeletonGeneration,
    getGeneratingText,
  } = useSkeletonGeneration({
    documents,
    setExpandedDocuments,
  });

  // Use global tooltip context instead of local hook
  const {
    setTooltipVisible,
    activeFieldRef,
    cursorTooltipHandlers,
    isSimulatingRef,
    updateTooltipFromCaret,
  } = useTooltipContext();

  // Use the extracted section dictation hook
  const { startSectionDictation, stopSectionDictation, dictationIntervalRef } =
    useSectionDictation({
      isSimulatingRef,
      simulatingFieldRef,
      documents,
      setDocuments,
      setTooltipVisible,
      activeFieldRef,
      updateTooltipFromCaret,
    });

  // Sync with prop changes only on initial mount or when selected patient changes
  // This prevents resetting local document changes when user adds/modifies documents
  const initialPropDocumentsRef = useRef(propDocuments);
  useEffect(() => {
    // Only reset if propDocuments reference actually changed (new patient selected)
    if (propDocuments !== initialPropDocumentsRef.current) {
      console.log(
        "propDocuments changed, resetting documents to:",
        propDocuments
      );
      setDocuments(propDocuments);
      initialPropDocumentsRef.current = propDocuments;
    }
  }, [propDocuments]);

  // Scroll to the first initially expanded document on mount
  const hasScrolledToInitialRef = useRef(false);
  useEffect(() => {
    // Only scroll once on mount when we have initialExpandedDocuments
    if (hasScrolledToInitialRef.current || !initialExpandedDocuments) {
      return;
    }

    // Get the first expanded document ID from the set
    const firstExpandedId = Array.from(initialExpandedDocuments)[0];
    if (!firstExpandedId) {
      return;
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const element = documentRefs.current[firstExpandedId];
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        hasScrolledToInitialRef.current = true;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [initialExpandedDocuments]);

  // Use the extracted typing replacement hook
  const {
    runTypingSimulation,
    replacementIntervalRef,
    hasSimulatedReplacementRef,
  } = useTypingReplacement({
    isSimulatingRef,
    autoSelectText,
    setDocuments,
    setTooltipVisible,
  });

  // Use the extracted document handlers hook
  const {
    handleDocumentClick,
    handleSectionToggle,
    handleSectionContentChange,
    handleDocumentCheckToggle,
    areAllSectionsChecked,
    areSomeSectionsChecked,
    registerDocumentRef,
  } = useDocumentHandlers({
    documents,
    setDocuments,
    expandedDocuments,
    setExpandedDocuments,
    onDocumentClick,
    onSectionToggle,
    onSectionContentChange,
    onDocumentCheckToggle,
    documentRefs,
  });

  // Use the extracted auto-select text hook
  useAutoSelectText({
    autoSelectText,
    setExpandedDocuments,
    documentRefs,
  });

  // Note: Tooltip click handling is now managed globally in MainContent

  // Track previous dictation state to detect transitions
  const prevDictationStateRef = useRef(dictationState);

  // Trigger typing simulation when dictationState changes to "on" (user clicked mic after enabling dictation)
  useEffect(() => {
    const wasOff = prevDictationStateRef.current === "off";
    const isNowOn = dictationState === "on";
    prevDictationStateRef.current = dictationState;

    // Only trigger when transitioning from "off" to "on" and we have autoSelectText config
    if (
      wasOff &&
      isNowOn &&
      autoSelectText &&
      !hasSimulatedReplacementRef.current
    ) {
      console.log(
        "[DictationState] Detected transition to 'on', triggering typing simulation"
      );
      // Small delay to let the UI update
      setTimeout(() => {
        runTypingSimulation();
      }, 100);
    }
    // Note: hasSimulatedReplacementRef is intentionally excluded - we only want to check its current value,
    // not re-run the effect when the ref object changes (refs are stable across renders)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictationState, autoSelectText, runTypingSimulation]);

  // Clean up on unmount
  useEffect(() => {
    // Copy refs to local variables for cleanup
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
    // Refs are stable across renders and don't need to be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll handling for tooltip is now managed globally in TooltipContext

  // Track ambient recording state and trigger skeleton animation when it stops (not pauses)
  const previousIsRecordingRef = useRef(isRecording);
  const previousAmbientStateRef = useRef(ambientState);

  useEffect(() => {
    const wasRecording = previousIsRecordingRef.current;
    const prevAmbientState = previousAmbientStateRef.current;
    previousIsRecordingRef.current = isRecording;
    previousAmbientStateRef.current = ambientState;

    // Only trigger skeleton when ambient recording fully stops (not when paused)
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
      setAmbientRecordingStopped(true);

      // Add Orders document BEFORE skeleton animation starts
      setDocuments((prev) => {
        const hasOrders = prev.some((doc) => doc.type === "orders");
        if (!hasOrders) {
          // Add Orders document with empty timestamp to show skeleton
          const ordersDoc: DocumentItem = {
            id: "orders-1",
            name: "Orders",
            created: "",
            type: "orders",
            sections: [
              {
                id: "orders-section",
                title: "Orders",
                content: "",
                checked: false,
                orderItems: [],
              },
            ],
            isExpanded: true,
          };

          // Return Orders first, then other documents
          return [ordersDoc, ...prev];
        }
        return prev;
      });

      // Set expanded documents to include Orders
      setExpandedDocuments((prev) => new Set([...prev, "orders-1"]));

      // Start skeleton animation
      triggerSkeletonGeneration({
        duration: 6000,
        toastDelay: 3000,
        afterComplete: () => {
          // After skeleton animation, populate Orders and update timestamps
          setDocuments((prev) => {
            return prev.map((doc) => {
              if (doc.type === "orders") {
                return {
                  ...doc,
                  created: "12:00 PM",
                  sections: [
                    {
                      id: "orders-section",
                      title: "Orders",
                      content: "",
                      checked: false,
                      orderItems: [
                        {
                          id: "1",
                          text: "Start spironolactone 25 mg daily.",
                          code: "150.33",
                        },
                        {
                          id: "2",
                          text: "Continue metoprolol succinate 50 mg daily.",
                        },
                        {
                          id: "3",
                          text: "Increase lisinopril to 20 mg daily.",
                        },
                        {
                          id: "4",
                          text: "Order echocardiogram.",
                          code: "93306",
                        },
                        {
                          id: "5",
                          text: "Schedule follow-up in 2 weeks.",
                        },
                      ],
                    },
                  ],
                  isExpanded: true,
                };
              } else if (doc.type === "progress-note") {
                return { ...doc, isExpanded: false, created: "12:00 PM" };
              }
              return doc;
            });
          });

          // Set expanded documents to only include Orders
          setExpandedDocuments(new Set(["orders-1"]));
        },
      });
    } else if (micMode === "ambient" && isRecording && !wasRecording) {
      // Ambient recording just started
      setAmbientRecordingStarted(true);
    }
  }, [
    isRecording,
    ambientState,
    micMode,
    ambientRecordingStarted,
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

    // Only trigger when the prop transitions from false to true
    if (!wasTrigger && triggerPronounReplacement) {
      setIsPronounReplacement(true);
      triggerSkeletonGeneration({
        duration: 5500,
        toastDelay: 3000,
        afterComplete: () => {
          setIsPronounReplacement(false);
          // Update Note and Referral Letter modified timestamps after pronoun replacement completes
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.type === "progress-note" || doc.type === "referral-letter"
                ? { ...doc, modified: "12:25 PM" }
                : doc
            )
          );
          onPronounReplacementComplete?.();
        },
      });
    }
  }, [
    triggerPronounReplacement,
    triggerSkeletonGeneration,
    onPronounReplacementComplete,
  ]);

  // Watch for draft referral letter trigger from Library prompt click
  useEffect(() => {
    const wasTrigger = prevTriggerReferralRef.current;
    prevTriggerReferralRef.current = triggerDraftReferralLetter;

    // Only trigger when the prop transitions from false to true
    if (!wasTrigger && triggerDraftReferralLetter) {
      // Find existing referral letter or create a new one
      let referralLetter = documents.find(
        (doc) => doc.type === "referral-letter"
      );

      if (!referralLetter) {
        // Create a new referral letter document
        const newReferralLetter: DocumentItem = {
          id: `doc-${Date.now()}`,
          name: "Referral Letter",
          created: "12:20 PM",
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

        // Add the new referral letter to documents
        setDocuments((prev) => [newReferralLetter, ...prev]);
        referralLetter = newReferralLetter;
      }

      setIsDraftingReferralLetter(true);

      // Update the patient's lastModified timestamp in the worklist
      updateSelectedPatientLastModified();

      // Auto-expand the referral letter
      setExpandedDocuments((prev) => {
        const newSet = new Set(prev);
        newSet.add(referralLetter!.id);
        return newSet;
      });

      // Mark for auto-focus
      setAutoFocusDocuments((prev) => {
        const newSet = new Set(prev);
        newSet.add(referralLetter!.id);
        return newSet;
      });

      // Fire callback for referral letter add (from Library)
      onReferralLetterAdd?.();

      // Scroll to the referral letter document
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

      // Trigger skeleton for just the referral letter
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
    onReferralLetterAdd,
    updateSelectedPatientLastModified,
  ]);

  // Transform documents for DataGrid
  const gridItems: DocumentGridItem[] = documents
    .filter((doc) => doc.type !== "after-visit-summary")
    .map((doc) => ({
      id: doc.id,
      name: doc.name,
      created: doc.created,
      document: doc,
      isExpanded: expandedDocuments.has(doc.id),
    }));

  // Callback to update order count when orders change in a card
  const handleOrderCountChange = useCallback(
    (documentId: string, count: number) => {
      setOrderCounts((prev) => ({ ...prev, [documentId]: count }));
    },
    []
  );

  // Handler to consume auto-focus after it's been applied
  const handleAutoFocusConsumed = useCallback((documentId: string) => {
    setAutoFocusDocuments((prev) => {
      const newSet = new Set(prev);
      newSet.delete(documentId);
      return newSet;
    });
  }, []);

  // Note: Document syncing with propDocuments is handled by the useEffect at lines 127-137
  // which only resets when the reference actually changes (e.g., new patient selected)
  // We don't want to reset on every propDocuments change as it would lose user-added documents

  const handleAddNotes = (noteTypes: string[]) => {
    console.log("handleAddNotes received:", noteTypes);

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const newDocuments: DocumentItem[] = noteTypes.map((noteType, index) => {
      console.log(`Processing noteType: "${noteType}"`);
      return createDocumentFromType(noteType, index, today);
    });

    console.log("Adding documents:", newDocuments);
    setDocuments((prev) => {
      const updated = [...newDocuments, ...prev];
      console.log("Updated documents:", updated);
      return updated;
    });
    setIsAddNoteDialogOpen(false);

    // Auto-expand newly added documents
    setExpandedDocuments((prev) => {
      const newSet = new Set(prev);
      newDocuments.forEach((doc) => newSet.add(doc.id));
      return newSet;
    });

    // Mark new documents for auto-focus (focus the first one added)
    if (newDocuments.length > 0) {
      setAutoFocusDocuments((prev) => {
        const newSet = new Set(prev);
        newSet.add(newDocuments[0].id);
        return newSet;
      });
    }

    // Check if referral letter was added
    const hasReferralLetter = noteTypes.some((type) =>
      type.toLowerCase().includes("referral")
    );

    // Update the patient's lastModified timestamp in the worklist
    updateSelectedPatientLastModified();

    // Fire callback if referral letter was added
    if (hasReferralLetter) {
      onReferralLetterAdd?.();
    }
  };

  // Handle document delete request - show confirmation dialog
  const handleDeleteDocumentRequest = (
    documentId: string,
    documentName: string
  ) => {
    setDocumentToDelete({ id: documentId, name: documentName });
    setIsDeleteDocumentDialogOpen(true);
  };

  // Confirm document deletion
  const handleConfirmDeleteDocument = () => {
    if (documentToDelete) {
      setDocuments((prev) =>
        prev.filter((doc) => doc.id !== documentToDelete.id)
      );
      // Also remove from expanded documents
      setExpandedDocuments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(documentToDelete.id);
        return newSet;
      });
    }
    setIsDeleteDocumentDialogOpen(false);
    setDocumentToDelete(null);
  };

  // Cancel document deletion
  const handleCancelDeleteDocument = () => {
    setIsDeleteDocumentDialogOpen(false);
    setDocumentToDelete(null);
  };

  return (
    <div className={`${styles.documentComponent} document-component-root`}>
      {/* Document Header */}
      <DocumentHeader
        styles={styles}
        gridItems={gridItems}
        orderCounts={orderCounts}
        onDocumentClick={handleDocumentClick}
        onNavigateToDocumentSettings={onNavigateToDocumentSettings}
        onOpenAddNoteDialog={() => setIsAddNoteDialogOpen(true)}
        ambientRecordingStopped={ambientRecordingStopped}
      />

      {/* AI disclaimer message */}
      <div className={styles.addDocumentRow}>
        <div className={styles.addDocumentHelperText}>
          Check for mistakes in all content created by AI.
        </div>
      </div>

      {/* Document Stack */}
      <div className={styles.documentStack}>
        {documents
          .filter((doc) => doc.type !== "after-visit-summary")
          .map((document) => {
            const isExpanded = expandedDocuments.has(document.id);
            const isDocumentChecked = areAllSectionsChecked(document);
            const isDocumentPartiallyChecked =
              !isDocumentChecked && areSomeSectionsChecked(document);
            const documentCheckboxState = isDocumentChecked
              ? true
              : isDocumentPartiallyChecked
              ? "mixed"
              : false;

            return (
              <DocumentCard
                key={document.id}
                document={document}
                styles={styles}
                isExpanded={isExpanded}
                checkboxState={documentCheckboxState}
                onDocumentClick={handleDocumentClick}
                onDocumentCheckToggle={handleDocumentCheckToggle}
                onSectionToggle={handleSectionToggle}
                onSectionContentChange={handleSectionContentChange}
                registerDocumentRef={registerDocumentRef}
                micMode={micMode}
                isRecording={isRecording}
                dictationState={dictationState}
                cursorTooltipHandlers={cursorTooltipHandlers}
                setTooltipVisible={setTooltipVisible}
                updateTooltipFromCaret={updateTooltipFromCaret}
                onStartSectionDictation={startSectionDictation}
                onStopSectionDictation={stopSectionDictation}
                onOrderCountChange={handleOrderCountChange}
                onDeleteDocument={handleDeleteDocumentRequest}
                showSkeleton={
                  isDraftingReferralLetter
                    ? showSkeleton && document.type === "referral-letter"
                    : showSkeleton
                }
                isPronounReplacement={isPronounReplacement}
                isDraftingReferralLetter={isDraftingReferralLetter}
                autoFocus={autoFocusDocuments.has(document.id)}
                onAutoFocusConsumed={handleAutoFocusConsumed}
                onOrderDelete={
                  document.type === "orders" ? onOrderDelete : undefined
                }
              />
            );
          })}
      </div>

      {/* MicCursorTooltip is now rendered globally in MainContent */}

      <GeneratingToast
        visible={showGeneratingToast}
        text={getGeneratingText()}
        onClose={() => setShowGeneratingToast(false)}
        showProgress={showSkeleton}
      />

      <AddNoteDialog
        open={isAddNoteDialogOpen}
        onClose={() => setIsAddNoteDialogOpen(false)}
        onAdd={handleAddNotes}
      />

      {/* Delete Document Confirmation Dialog */}
      <DeleteDocumentDialog
        open={isDeleteDocumentDialogOpen}
        documentName={documentToDelete?.name}
        onConfirm={handleConfirmDeleteDocument}
        onCancel={handleCancelDeleteDocument}
      />
    </div>
  );
};

export default DocumentComponent;
