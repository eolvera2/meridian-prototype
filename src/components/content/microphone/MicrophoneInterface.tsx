/**
 * MicrophoneInterface Component
 *
 * Provides the main microphone recording interface with action buttons.
 * Features responsive design and proper z-index layering.
 */
import React, { useState, useEffect, useRef } from "react";
import {
  mergeClasses,
  ToggleButton,
  SplitButton,
  Checkbox,
  Tooltip,
} from "@fluentui/react-components";
import {
  MicOffRegular,
  Mic24Filled,
  ChevronDownRegular,
  NoteRegular,
  NoteFilled,
  AlertRegular,
  AlertFilled,
  DeviceEqRegular,
} from "@fluentui/react-icons";
import CopilotIdle from "../../../assets/Copilot.svg";
import { DictationModeToast } from "../DictationModeToast";
import { useStyles } from "./MicrophoneInterface.styles";
import type { MicrophoneInterfaceProps } from "./MicrophoneInterface.types";
import { useI18n } from "../../../i18n/I18nContext";
import { MICROPHONE_TIMING_MS } from "./MicrophoneInterface.constants";

export const MicrophoneInterface: React.FC<MicrophoneInterfaceProps> = ({
  isRecording = false,
  onStartRecording,
  onStopRecording,
  onCopilotClick,
  onNotificationClick,
  onMemoClick,
  resetToggleButtons = false,
  resetRecordingTime = false,
  initialRecordingSeconds = 0,
  activeContent = null,
  worklistCollapsed = true,
  documentVisible = false,
  onDictationModeChange,
  onMicModeChange,
  isDictationEnabled: controlledDictationEnabled,
  onDictationEnabledChange,
  dictationState = "off",
  ambientState = "stop",
  onDictationStateChange,
  disableNavigation = false,
  onAmbientStateChange,
  onShowStopRecordingDialog,
}) => {
  const styles = useStyles();
  const { t } = useI18n();
  const [recordingTime, setRecordingTime] = useState(initialRecordingSeconds);
  const [isNoteActive, setIsNoteActive] = useState(false);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [isCopilotActive, setIsCopilotActive] = useState(false);
  const [internalDictationEnabled, setInternalDictationEnabled] =
    useState(true);
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);

  const isDictationEnabled =
    controlledDictationEnabled ?? internalDictationEnabled;

  const handleDictationCheckboxChange = (enabled: boolean) => {
    if (enabled && (ambientState === "recording" || ambientState === "pause")) {
      onShowStopRecordingDialog?.();
      return;
    }
    setIsDictationEnabled(enabled);
  };

  const setIsDictationEnabled = (enabled: boolean) => {
    if (onDictationEnabledChange) {
      onDictationEnabledChange(enabled);
    } else {
      setInternalDictationEnabled(enabled);
    }
  };

  useEffect(() => {
    if (controlledDictationEnabled !== undefined) return;
    if (documentVisible) {
      // In Document view, allow user to toggle
      setInternalDictationEnabled(false);
    } else {
      // In Home view, force Dictation mode ON
      setInternalDictationEnabled(true);
    }
  }, [documentVisible, controlledDictationEnabled]);

  useEffect(() => {
    setIsCopilotActive(activeContent === "copilot");
    setIsAlertActive(activeContent === "notifications");
    setIsNoteActive(activeContent === "memos");
  }, [activeContent]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Computed values
  const isWorklistVisible = !worklistCollapsed;
  const isAmbientMode =
    documentVisible && !isWorklistVisible && !isDictationEnabled;
  const isInDictationMode = isDictationEnabled;
  const micMode: "dictation" | "ambient" = isDictationEnabled
    ? "dictation"
    : "ambient";
  const shouldDisableMic = isWorklistVisible && !isDictationEnabled;

  const isDictationActive = dictationState === "on";
  const isAmbientActive =
    ambientState === "recording" || ambientState === "pause";
  const shouldUseBrandStyles = isDictationActive || isAmbientActive;
  const shouldShowGradientAnimation = isDictationActive || isAmbientActive;
  const shouldShowTimeDisplay =
    !isInDictationMode &&
    (isAmbientMode || recordingTime > 0 || shouldDisableMic);
  const displayedTime = shouldDisableMic ? "--:--" : formatTime(recordingTime);

  useEffect(() => {
    let interval: number;
    if (isRecording && !isInDictationMode) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
        }, MICROPHONE_TIMING_MS.recordingTickInterval);
    }
    return () => clearInterval(interval);
  }, [isRecording, isInDictationMode]);

  useEffect(() => {
    if (resetToggleButtons) {
      setIsNoteActive(false);
      setIsAlertActive(false);
      setIsCopilotActive(false);
    }
  }, [resetToggleButtons]);

  useEffect(() => {
    if (resetRecordingTime) {
      setRecordingTime(initialRecordingSeconds);
    }
  }, [resetRecordingTime, initialRecordingSeconds]);

  // Sync recording time when patient changes (initialRecordingSeconds changes)
  // This ensures the initial time is set even on first render with a pre-selected patient
  useEffect(() => {
    setRecordingTime(initialRecordingSeconds);
  }, [initialRecordingSeconds]);

  const prevDisableState = useRef(shouldDisableMic);
  const prevDocumentVisible = useRef(documentVisible);
  const prevMicMode = useRef<"dictation" | "ambient">(micMode);
  const prevIsDictationEnabled = useRef(isDictationEnabled);

  useEffect(() => {
    if (prevMicMode.current !== micMode) {
      onMicModeChange?.(micMode);
      prevMicMode.current = micMode;

      setShowToast(true);

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }

      toastTimeoutRef.current = window.setTimeout(() => {
        setShowToast(false);
      }, MICROPHONE_TIMING_MS.modeToastAutoHide);
    }
  }, [micMode, onMicModeChange]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (
      documentVisible &&
      isDictationEnabled &&
      !prevIsDictationEnabled.current
    ) {
      onDictationModeChange?.(true);
    } else if (
      prevIsDictationEnabled.current &&
      !isDictationEnabled &&
      documentVisible
    ) {
      onDictationModeChange?.(false);
    }
    prevIsDictationEnabled.current = isDictationEnabled;
  }, [isDictationEnabled, documentVisible, onDictationModeChange, isRecording]);

  useEffect(() => {
    if (shouldDisableMic && !prevDisableState.current) {
      if (isRecording) {
        onStopRecording?.();
      }
      setRecordingTime(initialRecordingSeconds);
    } else if (!shouldDisableMic && prevDisableState.current) {
      setRecordingTime(initialRecordingSeconds);
    }
    prevDisableState.current = shouldDisableMic;
  }, [shouldDisableMic, isRecording, onStopRecording, initialRecordingSeconds]);

  useEffect(() => {
    if (documentVisible && !prevDocumentVisible.current) {
      // When document becomes visible, use the patient's initial recording time
      setRecordingTime(initialRecordingSeconds);
    } else if (!documentVisible && prevDocumentVisible.current) {
      setRecordingTime(initialRecordingSeconds);
      if (isRecording) {
        onStopRecording?.();
      }
    }
    prevDocumentVisible.current = documentVisible;
  }, [documentVisible, isRecording, onStopRecording, initialRecordingSeconds]);

  const handleMicClick = () => {
    if (isDictationEnabled) {
      const newDictationState = dictationState === "on" ? "off" : "on";
      onDictationStateChange?.(newDictationState);
    } else {
      if (ambientState === "recording") {
        onAmbientStateChange?.("stop");
        onStopRecording?.();
      } else {
        onAmbientStateChange?.("recording");
        onStartRecording?.();
      }
    }
  };

  const handleNoteClick = () => {
    const newNoteState = !isNoteActive;
    setIsNoteActive(newNoteState);
    if (newNoteState) {
      setIsAlertActive(false);
      setIsCopilotActive(false);
    }
    onMemoClick?.();
  };

  const handleAlertClick = () => {
    const newAlertState = !isAlertActive;
    setIsAlertActive(newAlertState);
    if (newAlertState) {
      setIsNoteActive(false);
      setIsCopilotActive(false);
    }
    onNotificationClick?.();
  };

  const handleCopilotClick = () => {
    const newCopilotState = !isCopilotActive;
    setIsCopilotActive(newCopilotState);
    if (newCopilotState) {
      setIsNoteActive(false);
      setIsAlertActive(false);
    }
    onCopilotClick?.();
  };

  const handleToastClose = () => {
    setShowToast(false);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
  };

  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const micButtonAriaLabel = shouldDisableMic
    ? t("microphone.aria.enableDictationToUseMic")
    : documentVisible
    ? isRecording
      ? t("microphone.aria.pauseMicSession")
      : t("microphone.aria.resumeMicSession")
    : isRecording
    ? t("microphone.aria.stopRecording")
    : t("microphone.aria.startRecording");

  return (
    <div
      className={mergeClasses(
        styles.microphoneInterface,
        styles.microphoneInterfaceMobile,
        shouldShowGradientAnimation && styles.microphoneInterfaceRecording
      )}
      style={{
        ...(isSmallScreen ? { left: "0px" } : {}),
        transition: "left 0.3s cubic-bezier(0.1,0.9,0.2,1)",
      }}
    >
      <div
        className={mergeClasses(styles.micContainer, styles.micContainerMobile)}
      >
        {/* Left Section - Dictation Checkbox */}
        <div className={styles.leftSection}>
          <Checkbox
            label={t("common.dictation")}
            checked={isDictationEnabled}
            onChange={(_ev, data) =>
              handleDictationCheckboxChange(!!data.checked)
            }
            className={styles.dictationCheckbox}
            disabled={!documentVisible}
          />
        </div>

        {/* Center Section - Microphone Button */}
        <div className={styles.centerControls}>
          <SplitButton
            appearance="subtle"
            className={mergeClasses(
              styles.micButton,
              shouldUseBrandStyles && styles.micButtonRecording,
              shouldDisableMic && styles.micButtonDisabled
            )}
            primaryActionButton={{
              onClick: handleMicClick,
              disabled: shouldDisableMic,
              "aria-label": micButtonAriaLabel,
              className: mergeClasses(
                styles.micSplitPrimaryButton,
                shouldUseBrandStyles && styles.micSplitPrimaryButtonRecording
              ),
            }}
            menuButton={{
              disabled: true,
              "aria-label": t("microphone.aria.options"),
              className: mergeClasses(
                styles.secondaryAction,
                styles.micSplitMenuButton,
                shouldUseBrandStyles && styles.micSplitMenuButtonRecording,
                shouldUseBrandStyles && styles.secondaryActionRecording
              ),
              icon: (
                <ChevronDownRegular
                  className={mergeClasses(
                    styles.chevronIcon,
                    shouldUseBrandStyles && styles.chevronIconRecording
                  )}
                />
              ),
            }}
          >
            <div
              className={mergeClasses(
                styles.primaryAction,
                isInDictationMode && styles.primaryActionDictationCompact
              )}
            >
              <div className={styles.micIconSection}>
                {shouldDisableMic ? (
                  <DeviceEqRegular
                    className={mergeClasses(
                      styles.micIcon,
                      styles.micIconDisabled
                    )}
                  />
                ) : isAmbientMode ? (
                  <DeviceEqRegular
                    className={mergeClasses(
                      styles.micIcon,
                      shouldUseBrandStyles && styles.micIconRecording
                    )}
                  />
                ) : shouldUseBrandStyles ? (
                  <Mic24Filled
                    className={mergeClasses(
                      styles.micIcon,
                      styles.micIconRecording
                    )}
                  />
                ) : (
                  <MicOffRegular className={styles.micIcon} />
                )}
              </div>

              {shouldShowTimeDisplay && (
                <div
                  className={mergeClasses(
                    styles.timeDisplay,
                    shouldUseBrandStyles && styles.timeDisplayRecording,
                    shouldDisableMic && styles.timeDisplayDisabled
                  )}
                >
                  {displayedTime}
                </div>
              )}
            </div>
          </SplitButton>
        </div>

        <div className={styles.rightActions}>
          <Tooltip content={t("microphone.tooltip.memos")} relationship="label">
            <span className="inline-flex">
              <ToggleButton
                appearance="subtle"
                icon={
                  isNoteActive ? (
                    <NoteFilled className={styles.iconActive} />
                  ) : (
                    <NoteRegular />
                  )
                }
                checked={isNoteActive}
                onClick={handleNoteClick}
                className={styles.settingsButton}
                aria-label={t("microphone.aria.toggleDocumentPanel")}
                disabled={disableNavigation || activeContent === "settings"}
                style={
                  disableNavigation
                    ? { opacity: 0.4, cursor: "not-allowed" }
                    : undefined
                }
              />
            </span>
          </Tooltip>

          <Tooltip
            content={t("microphone.tooltip.notifications")}
            relationship="label"
          >
            <span className="inline-flex">
              <ToggleButton
                appearance="subtle"
                icon={
                  isAlertActive ? (
                    <AlertFilled className={styles.iconActive} />
                  ) : (
                    <AlertRegular />
                  )
                }
                checked={isAlertActive}
                onClick={handleAlertClick}
                className={styles.settingsButton}
                aria-label={t("microphone.aria.toggleAlerts")}
                disabled={disableNavigation || activeContent === "settings"}
                style={
                  disableNavigation
                    ? { opacity: 0.4, cursor: "not-allowed" }
                    : undefined
                }
              />
            </span>
          </Tooltip>

          <Tooltip
            content={t("microphone.tooltip.copilot")}
            relationship="label"
          >
            <span className="inline-flex">
              <ToggleButton
                appearance="subtle"
                icon={
                  <img
                    src={CopilotIdle}
                    alt={t("microphone.copilotAlt")}
                    width={24}
                    height={24}
                  />
                }
                checked={isCopilotActive}
                onClick={handleCopilotClick}
                className={styles.settingsButton}
                aria-label={t("microphone.aria.toggleCopilot")}
                disabled={disableNavigation || activeContent === "settings"}
                style={
                  disableNavigation
                    ? { opacity: 0.4, cursor: "not-allowed" }
                    : undefined
                }
              />
            </span>
          </Tooltip>
        </div>
      </div>

      <DictationModeToast
        visible={showToast}
        mode={micMode}
        onClose={handleToastClose}
      />
    </div>
  );
};

export default MicrophoneInterface;
