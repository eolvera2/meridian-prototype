import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import type { HeaderProps } from "./Header";
import { usePanelControls } from "./hooks/usePanelControls";
import { usePatientSelection } from "./hooks/usePatientSelection";
import { useMainContentStyles, useDialogStyles } from "./MainContent.styles";
import { MAIN_CONTENT_TIMING_MS } from "./MainContent.constants";
import { DesktopWorkspace, MobileWorkspace } from "./layout";
import type { MainContentProps, DialogReason } from "./MainContent.types";
import type {
  RightDrawerContent,
  DictationState,
  AmbientState,
} from "../shared";
import { useTooltipContext } from "../content/tooltip";
import { MicCursorTooltip } from "../content/MicCursorTooltip";
import { useI18n } from "../../i18n/I18nContext";

export const MainContent: React.FC<MainContentProps> = ({
  navCollapsed = false,
  worklistCollapsed: externalWorklistCollapsed,
  onWorklistStateChange,
  homeToggleActive = false,
  onHomeToggle,
  activeNavItem = "home",
  onNavItemChange,
  initialPatientId,
  autoSelectText,
  disableNavigation = false,
  onAmbientRecordingStop,
  onDictationModeChange,
  initialMicMode = "ambient",
  initialDictationState = "off",
  onReferralLetterAdd,
  onOrderDelete,
  initialDocuments,
  initialExpandedDocuments,
  onSettingsDocumentsReached,
  onPronounReplacementComplete,
  onCopilotPanelOpen,
  autoDictationDisableOnDocumentView = false,
  keepMicOnWhenUnchecking = false,
  scrollToTop = false,
}) => {
  const styles = useMainContentStyles();
  const dialogStyles = useDialogStyles();
  const { t } = useI18n();

  // Global tooltip context for all input/textarea elements
  const { tooltipVisible, tooltipPosition } = useTooltipContext();

  // New state machine for microphone modes
  const [dictationState, setDictationState] = useState<DictationState>(
    initialDictationState
  );
  const [ambientState, setAmbientState] = useState<AmbientState>("stop");
  const [scriptChecked, setScriptChecked] = useState(false);
  const [libraryChecked, setLibraryChecked] = useState(false);
  const [documentActivity, setDocumentActivity] = useState<string | null>(null);
  const [micTooltipMode, setMicTooltipMode] = useState<"dictation" | "ambient">(
    initialMicMode
  );
  // Derived state: isDictationEnabled = true when in dictation mode
  const isDictationEnabled = micTooltipMode === "dictation";
  const documentActivityTimeoutRef = useRef<number | null>(null);
  // Track previous ambient state for detecting recording stop
  const prevAmbientStateRef = useRef<AmbientState>(ambientState);
  // State for stop recording confirmation dialog
  const [isStopRecordingDialogOpen, setIsStopRecordingDialogOpen] =
    useState(false);
  // Track the reason for showing the dialog: 'dictation' or 'navigation'
  const [dialogReason, setDialogReason] = useState<DialogReason>("dictation");

  // Derived state for backward compatibility: isRecording = ambient is recording
  const isRecording = ambientState === "recording";

  // Detect when ambient recording stops (transitions from recording to stop)
  useEffect(() => {
    if (
      prevAmbientStateRef.current === "recording" &&
      ambientState === "stop" &&
      !isDictationEnabled
    ) {
      // Ambient recording just stopped - call the callback
      onAmbientRecordingStop?.();
    }
    prevAmbientStateRef.current = ambientState;
  }, [ambientState, isDictationEnabled, onAmbientRecordingStop]);

  const {
    selectedPatient,
    resetRecordingTime,
    triggerRecordingReset,
    handleWorklistActions,
    clearSelectedPatient,
  } = usePatientSelection(
    onWorklistStateChange,
    () => setAmbientState("recording"),
    initialPatientId
  );

  // Wrap handleWorklistActions.onPatientSelect - dictation continues running if active
  const handlePatientSelectWithDictationStop = (patientId: string) => {
    // Dictation mode continues running when navigating - user controls stopping manually
    // Call the original patient select handler
    handleWorklistActions.onPatientSelect(patientId);
  };

  // Wrap handleWorklistActions.onMicButtonClick to start ambient recording
  const handleMicButtonClickWithDictationStop = (patientId: string) => {
    // If mic is 'On' in 'Dictation' mode, first stop dictation
    if (dictationState === "on") {
      setDictationState("off");
    }

    // Switch to 'Ambient' mode
    setMicTooltipMode("ambient");

    // Ensure ambient state starts at 'stop' before transitioning to 'recording'
    // This ensures proper state transition detection in DocumentComponent
    setAmbientState("stop");

    // Use setTimeout to ensure the state update is processed before starting recording
    setTimeout(() => {
      // Call the original mic button click handler (which will start ambient recording)
      handleWorklistActions.onMicButtonClick(patientId);
    }, MAIN_CONTENT_TIMING_MS.deferStartAmbientRecording);
  };

  // Create modified worklist actions with the wrapped handlers
  const worklistActionsWithDictationStop = {
    ...handleWorklistActions,
    onPatientSelect: handlePatientSelectWithDictationStop,
    onMicButtonClick: handleMicButtonClickWithDictationStop,
  };

  const {
    rightDrawerVisible,
    setRightDrawerVisible,
    rightDrawerContent,
    setRightDrawerContent,
    shouldUseDrawerLayout,
    shouldShowWorklistWithDrawer,
  } = usePanelControls();

  // Reset toggle buttons state
  const [resetToggleButtons, setResetToggleButtons] = useState(false);
  const [settingsSubPage, setSettingsSubPage] = useState<string | null>(null);
  // State to trigger pronoun replacement in DocumentComponent
  const [triggerPronounReplacement, setTriggerPronounReplacement] =
    useState(false);
  // State to trigger draft referral letter in DocumentComponent
  const [triggerDraftReferralLetter, setTriggerDraftReferralLetter] =
    useState(false);

  // Compute documentVisible early so we can use it in effects
  const worklistCollapsed = externalWorklistCollapsed ?? false;
  const documentVisible = worklistCollapsed && !!selectedPatient;

  // Track previous documentVisible to detect view transitions
  const prevDocumentVisibleRef = useRef(documentVisible);

  // Force Dictation mode when in Home view (not in document view)
  // Optionally auto-disable dictation when entering document view (task1 behavior)
  useEffect(() => {
    const justEnteredDocumentView =
      !prevDocumentVisibleRef.current && documentVisible;
    prevDocumentVisibleRef.current = documentVisible;

    if (!documentVisible) {
      // In Home view, force Dictation mode
      setMicTooltipMode("dictation");
    } else if (autoDictationDisableOnDocumentView && justEnteredDocumentView) {
      // Only when FIRST entering Document view, automatically switch to ambient mode
      // This allows users to start ambient recording immediately, but doesn't prevent
      // them from switching to dictation mode afterwards
      setMicTooltipMode("ambient");
      // Ensure dictation is stopped if it was active
      if (dictationState === "on") {
        setDictationState("off");
      }
    }
  }, [documentVisible, autoDictationDisableOnDocumentView, dictationState]);

  useEffect(() => {
    return () => {
      if (documentActivityTimeoutRef.current) {
        window.clearTimeout(documentActivityTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (rightDrawerContent !== "settings") {
      setSettingsSubPage(null);
    }
  }, [rightDrawerContent]);

  // Detect when user navigates to Settings -> Documents sub-page
  useEffect(() => {
    if (settingsSubPage === "documents") {
      onSettingsDocumentsReached?.();
    }
  }, [settingsSubPage, onSettingsDocumentsReached]);

  const recordDocumentActivity = (message: string) => {
    setDocumentActivity(message);
    if (documentActivityTimeoutRef.current) {
      window.clearTimeout(documentActivityTimeoutRef.current);
    }
    documentActivityTimeoutRef.current = window.setTimeout(() => {
      setDocumentActivity(null);
      documentActivityTimeoutRef.current = null;
    }, MAIN_CONTENT_TIMING_MS.documentActivityClear);
  };

  const describeDocumentContext = (documentId: string) => {
    const patientName = selectedPatient?.name;
    return patientName ? `${patientName} · ${documentId}` : documentId;
  };

  const handleDocumentClickEvent = (documentId: string) => {
    recordDocumentActivity(`Opened ${describeDocumentContext(documentId)}`);
  };

  const handleAddDocumentEvent = () => {
    recordDocumentActivity("Started a new document draft");
  };

  const handleSectionToggleEvent = (
    documentId: string,
    sectionId: string,
    checked: boolean
  ) => {
    recordDocumentActivity(
      `${
        checked ? "Completed" : "Reopened"
      } ${sectionId} in ${describeDocumentContext(documentId)}`
    );
  };

  const handleSectionContentChangeEvent = (
    documentId: string,
    sectionId: string,
    content: string
  ) => {
    if (!content && !documentActivity) {
      return;
    }
    recordDocumentActivity(
      `Editing ${sectionId} in ${describeDocumentContext(documentId)}`
    );
  };

  const handleDocumentCheckToggleEvent = (
    documentId: string,
    checked: boolean
  ) => {
    recordDocumentActivity(
      `${checked ? "Selected" : "Cleared"} ${describeDocumentContext(
        documentId
      )}`
    );
  };

  // Use prop if provided for controlled behavior - worklistCollapsed is declared earlier
  const worklistDrawerVisible = shouldShowWorklistWithDrawer(worklistCollapsed);

  // NOTE: Removed automatic sync useEffect to prevent circular updates
  // onWorklistStateChange is now called explicitly where needed:
  // - onPatientSelect (when selecting a patient)
  // - onAddPatient (when adding a patient)
  // - onHomeClick (when navigating home)

  // Helper function to close drawer and reset toggle buttons
  const closeRightDrawer = () => {
    setRightDrawerVisible(false);
    setResetToggleButtons(true);
    // Reset all Header toggle states
    setScriptChecked(false);
    setLibraryChecked(false);
    // Reset the trigger after a brief delay
    setTimeout(
      () => setResetToggleButtons(false),
      MAIN_CONTENT_TIMING_MS.resetToggleButtons
    );
  };

  // Handler for library prompt click (e.g., "Change pronouns to they them", "Draft referral letter")
  const handleLibraryPromptClick = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();

    // Check if this is the pronoun replacement prompt
    if (lowerPrompt.includes("change pronouns")) {
      // Close the Library drawer
      closeRightDrawer();

      // Trigger pronoun replacement with skeleton animation
      setTriggerPronounReplacement(true);

      // Reset the trigger after the skeleton animation completes
      setTimeout(() => {
        setTriggerPronounReplacement(false);
      }, MAIN_CONTENT_TIMING_MS.triggerReset);
    }

    // Check if this is the draft referral letter prompt
    if (lowerPrompt.includes("draft referral letter")) {
      // Close the Library drawer
      closeRightDrawer();

      // Trigger draft referral letter with skeleton animation
      setTriggerDraftReferralLetter(true);

      // Reset the trigger after the skeleton animation completes
      setTimeout(() => {
        setTriggerDraftReferralLetter(false);
      }, MAIN_CONTENT_TIMING_MS.triggerReset);
    }
  };

  // Centralized handler for returning to the worklist/home state
  const handleNavigateHome = () => {
    // If ambient recording is active, show confirmation dialog
    if (ambientState === "recording" || ambientState === "pause") {
      // Pause if recording
      if (ambientState === "recording") {
        setAmbientState("pause");
      }
      setDialogReason("navigation");
      setIsStopRecordingDialogOpen(true);
      return;
    }
    // Otherwise, navigate directly
    performHomeNavigation();
  };

  // Actual navigation logic (called directly or after dialog confirmation)
  const performHomeNavigation = () => {
    closeRightDrawer();
    clearSelectedPatient();
    onWorklistStateChange?.(false, false);
    onNavItemChange?.("home");
    triggerRecordingReset();
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, MAIN_CONTENT_TIMING_MS.homeResizeDispatch);
  };

  // Handle showing dialog when switching to dictation mode during ambient recording
  const handleShowStopRecordingDialog = () => {
    // Pause if recording
    if (ambientState === "recording") {
      setAmbientState("pause");
    }
    setDialogReason("dictation");
    setIsStopRecordingDialogOpen(true);
  };

  // Handle dialog confirmation - stop recording and perform action based on reason
  const handleStopRecordingConfirm = () => {
    // Stop the ambient recording - this triggers AI content generation in DocumentComponent
    // The skeleton animation check requires micMode === "ambient", so we must
    // set ambientState to "stop" first and delay the mode switch
    setAmbientState("stop");

    if (dialogReason === "dictation") {
      // Delay mode switch to allow the useEffect in DocumentComponent to detect
      // the pause→stop transition while micMode is still "ambient"
      setTimeout(() => {
        setMicTooltipMode("dictation");
      }, MAIN_CONTENT_TIMING_MS.dictationModeSwitchAfterStop);
    } else {
      // Navigate home
      performHomeNavigation();
    }
    // Close the dialog
    setIsStopRecordingDialogOpen(false);
  };

  // Handle dialog cancel - resume recording and stay in current mode/view
  const handleStopRecordingCancel = () => {
    // Resume the recording
    setAmbientState("recording");
    // Close the dialog
    setIsStopRecordingDialogOpen(false);
  };

  // Toggle between dictation and ambient mode (used by tooltip click)
  // If in Dictation mode with state 'on', turn it 'off' but stay in Dictation mode
  // If in Dictation mode with state 'off', switch to Ambient mode
  // If in Ambient mode, switch to Dictation mode AND start dictation
  const handleMicModeToggle = () => {
    if (micTooltipMode === "dictation" && dictationState === "on") {
      // Turn off dictation but stay in Dictation mode
      setDictationState("off");
    } else if (micTooltipMode === "dictation" && dictationState === "off") {
      // In Dictation mode with mic off - turn ON the mic (start dictation)
      setDictationState("on");
    } else {
      // In Ambient mode, switch to Dictation mode AND start dictation automatically
      // If ambient is recording, show confirmation dialog first
      if (ambientState === "recording" || ambientState === "pause") {
        handleShowStopRecordingDialog();
        return;
      }
      setMicTooltipMode("dictation");
      setDictationState("on");
    }
  };

  // Handle dictation checkbox change from MicrophoneInterface
  const handleDictationEnabledChange = (enabled: boolean) => {
    const newMode = enabled ? "dictation" : "ambient";

    // If unchecking dictation while mic is on in dictation mode
    if (!enabled && dictationState === "on") {
      // Task3 behavior: keep mic "on" but switch to ambient mode
      if (keepMicOnWhenUnchecking) {
        setMicTooltipMode(newMode);
        // Switch to ambient mode and start ambient recording
        setAmbientState("recording");
        return;
      }
      // Default behavior: stop dictation
      setDictationState("off");
    }

    setMicTooltipMode(newMode);

    // If switching to dictation mode while ambient is recording, pause ambient
    if (newMode === "dictation" && ambientState === "recording") {
      setAmbientState("pause");
    }
  };

  const handleMicrophoneActions = {
    // New state machine props
    dictationState,
    ambientState,
    onDictationStateChange: (state: DictationState) => {
      setDictationState(state);
      // When dictation turns on, ensure mode is set to dictation
      if (state === "on") {
        setMicTooltipMode("dictation");
      }
    },
    onAmbientStateChange: setAmbientState,
    // Legacy props for backward compatibility
    onStartRecording: () => setAmbientState("recording"),
    onStopRecording: () => setAmbientState("stop"),
    onMicModeChange: (mode: "dictation" | "ambient") => {
      setMicTooltipMode(mode);
    },
    isDictationEnabled,
    onDictationEnabledChange: handleDictationEnabledChange,
    onCopilotClick: () => {
      if (rightDrawerVisible && rightDrawerContent === "copilot") {
        closeRightDrawer();
      } else {
        // Close Header toggles when opening MicrophoneInterface panel
        setScriptChecked(false);
        setLibraryChecked(false);
        setRightDrawerContent("copilot");
        setRightDrawerVisible(true);
        // Call the callback when opening the Copilot panel
        onCopilotPanelOpen?.();
      }
    },
    onNotificationClick: () => {
      if (rightDrawerVisible && rightDrawerContent === "notifications") {
        closeRightDrawer();
      } else {
        // Close Header toggles when opening MicrophoneInterface panel
        setScriptChecked(false);
        setLibraryChecked(false);
        setRightDrawerContent("notifications");
        setRightDrawerVisible(true);
      }
    },
    onMemoClick: () => {
      if (rightDrawerVisible && rightDrawerContent === "memos") {
        closeRightDrawer();
      } else {
        // Close Header toggles when opening MicrophoneInterface panel
        setScriptChecked(false);
        setLibraryChecked(false);
        setRightDrawerContent("memos");
        setRightDrawerVisible(true);
      }
    },
  };

  const leftNavHidden =
    navCollapsed ||
    (worklistCollapsed &&
      !!selectedPatient &&
      rightDrawerContent !== "settings");
  const leftNavOpen = !leftNavHidden;

  const setPanelContent = (content: RightDrawerContent) => {
    setRightDrawerContent(content);
    setRightDrawerVisible(true);
    setResetToggleButtons(true);
    setTimeout(
      () => setResetToggleButtons(false),
      MAIN_CONTENT_TIMING_MS.resetToggleButtons
    );
  };

  const handleScriptToggle = (next: boolean) => {
    if (next) {
      setLibraryChecked(false);
      setScriptChecked(true);
      setPanelContent("transcription");
    } else {
      setScriptChecked(false);
      setRightDrawerVisible(false);
    }
  };

  const handleLibraryToggle = (next: boolean) => {
    if (next) {
      setScriptChecked(false);
      setLibraryChecked(true);
      setPanelContent("library");
    } else {
      setLibraryChecked(false);
      setRightDrawerVisible(false);
    }
  };

  const handleSettingsClick = () => {
    // Always open settings, don't toggle
    // Reset to parent settings page if currently on a child page
    setSettingsSubPage(null);
    setRightDrawerContent("settings");
    setRightDrawerVisible(true);
    onNavItemChange?.("settings");
  };

  const handleDocumentSettingsNavigation = () => {
    // Step 1: Navigate home and clear patient
    clearSelectedPatient();
    onWorklistStateChange?.(false, false);
    onNavItemChange?.("home");

    // Step 2: After home navigation settles, open settings
    setTimeout(() => {
      setRightDrawerContent("settings");
      setRightDrawerVisible(true);
      onNavItemChange?.("settings");

      // Step 3: After settings opens, navigate to documents subpage
      setTimeout(() => {
        setSettingsSubPage("documents");
      }, MAIN_CONTENT_TIMING_MS.settingsNavigationStep);
    }, MAIN_CONTENT_TIMING_MS.settingsNavigationStep);
  };

  const handleHelpClick = () => {
    // Always navigate to help, don't close
    onNavItemChange?.("help");
  };

  const handleProfileClick = () => {
    // Always navigate to profile, don't close
    onNavItemChange?.("avatar");
  };

  const handleCareCoordinationClick = () => {
    closeRightDrawer();
    onHomeToggle?.();
    onNavItemChange?.("careCoordination");
    triggerRecordingReset();
  };

  const handleHomeToggleClick = () => {
    // Always navigate to home and close right drawer
    closeRightDrawer();
    onHomeToggle?.();
    onNavItemChange?.("home");
    triggerRecordingReset();
  };

  const leftNavHandlers = {
    onSettingsClick: handleSettingsClick,
    onCareCoordinationClick: handleCareCoordinationClick,
    onHelpClick: handleHelpClick,
    onProfileClick: handleProfileClick,
    onHomeToggle: handleHomeToggleClick,
  } as const;

  const headerProps: HeaderProps = {
    patient: selectedPatient,
    scriptChecked,
    libraryChecked,
    homeChecked: homeToggleActive,
    worklistCollapsed,
    onHomeClick: handleNavigateHome,
    onToggleScript: handleScriptToggle,
    onToggleLibrary: handleLibraryToggle,
    disableNavigation,
  };

  const microphoneProps = {
    isRecording,
    resetToggleButtons,
    resetRecordingTime,
    initialRecordingSeconds: selectedPatient?.initialRecordingSeconds ?? 0,
    activeContent: rightDrawerVisible ? rightDrawerContent : null,
    worklistCollapsed,
    documentVisible,
    disableNavigation,
    onShowStopRecordingDialog: handleShowStopRecordingDialog,
    onDictationModeChange,
    ...handleMicrophoneActions,
  };

  const documentHandlers = {
    onDocumentClick: handleDocumentClickEvent,
    onAddDocument: handleAddDocumentEvent,
    onSectionToggle: handleSectionToggleEvent,
    onSectionContentChange: handleSectionContentChangeEvent,
    onDocumentCheckToggle: handleDocumentCheckToggleEvent,
    isRecording,
    ambientState,
    dictationState,
    onNavigateToDocumentSettings: disableNavigation
      ? undefined
      : handleDocumentSettingsNavigation,
    triggerPronounReplacement,
    triggerDraftReferralLetter,
    autoSelectText,
    onReferralLetterAdd,
    onOrderDelete,
    documents: initialDocuments,
    initialExpandedDocuments,
    onPronounReplacementComplete,
    scrollToTop,
  } as const;

  const usingDrawerLayout = shouldUseDrawerLayout();

  return (
    <div className={styles.mainContent}>
      <DesktopWorkspace
        styles={styles}
        leftNavHidden={leftNavHidden}
        leftNavOpen={leftNavOpen}
        leftNavHandlers={leftNavHandlers}
        homeToggleActive={homeToggleActive}
        activeNavItem={activeNavItem}
        worklistCollapsed={worklistCollapsed}
        selectedPatient={selectedPatient}
        headerProps={headerProps}
        rightDrawerVisible={rightDrawerVisible}
        rightDrawerContent={rightDrawerContent}
        onCloseRightDrawer={closeRightDrawer}
        onLibraryPromptClick={handleLibraryPromptClick}
        handleWorklistActions={worklistActionsWithDictationStop}
        microphoneProps={microphoneProps}
        documentHandlers={documentHandlers}
        micMode={micTooltipMode}
        onMicModeToggle={handleMicModeToggle}
        settingsSubPage={settingsSubPage}
        onSettingsSubPageChange={setSettingsSubPage}
      />

      <MobileWorkspace
        styles={styles}
        navCollapsed={navCollapsed}
        leftNavHandlers={leftNavHandlers}
        homeToggleActive={homeToggleActive}
        activeNavItem={activeNavItem}
        worklistCollapsed={worklistCollapsed}
        worklistDrawerVisible={worklistDrawerVisible}
        usingDrawerLayout={usingDrawerLayout}
        selectedPatient={selectedPatient}
        headerProps={headerProps}
        rightDrawerVisible={rightDrawerVisible}
        rightDrawerContent={rightDrawerContent}
        onCloseRightDrawer={closeRightDrawer}
        onLibraryPromptClick={handleLibraryPromptClick}
        handleWorklistActions={worklistActionsWithDictationStop}
        microphoneProps={microphoneProps}
        documentHandlers={documentHandlers}
        micMode={micTooltipMode}
        onMicModeToggle={handleMicModeToggle}
        settingsSubPage={settingsSubPage}
        onSettingsSubPageChange={setSettingsSubPage}
      />

      {/* Stop Recording Confirmation Dialog */}
      <Dialog
        open={isStopRecordingDialogOpen}
        onOpenChange={(_event, data) => {
          if (!data.open) {
            handleStopRecordingCancel();
          }
        }}
      >
        <DialogSurface className={dialogStyles.dialogSurface}>
          <DialogBody>
            <DialogTitle
              className={dialogStyles.dialogTitle}
              action={
                <Button
                  appearance="subtle"
                  aria-label={t("common.close")}
                  icon={<Dismiss24Regular />}
                  onClick={handleStopRecordingCancel}
                  className={dialogStyles.dialogCloseButton}
                />
              }
            >
              <span className={dialogStyles.dialogTitleText}>
                {t("mainContent.stopRecordingDialog.title")}
              </span>
            </DialogTitle>
            <DialogContent className={dialogStyles.dialogContent}>
              {t("mainContent.stopRecordingDialog.body")}
            </DialogContent>
            <DialogActions className={dialogStyles.dialogActions}>
              <Button
                appearance="primary"
                onClick={handleStopRecordingConfirm}
                className={dialogStyles.dialogButton}
              >
                {t("common.continue")}
              </Button>
              <Button
                appearance="secondary"
                onClick={handleStopRecordingCancel}
                className={dialogStyles.dialogButton}
              >
                {t("common.cancel")}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Global MicCursorTooltip for all input/textarea elements */}
      <MicCursorTooltip
        x={tooltipPosition.x}
        y={tooltipPosition.y}
        visible={tooltipVisible}
        fieldRect={tooltipPosition.fieldRect}
        mode={micTooltipMode}
        isActive={dictationState === "on"}
        onModeToggle={() => {
          if (micTooltipMode === "dictation") {
            // When switching from dictation to ambient, stop dictation if active
            if (dictationState === "on") {
              setDictationState("off");
            }
          }
          // Toggle the mode
          handleMicModeToggle();
        }}
      />
    </div>
  );
};
