/**
 * TranscriptPanel Component
 *
 * Displays a list of transcript recordings with expandable message cards.
 */

import React, { useState } from "react";
import {
  Button,
  Checkbox,
  mergeClasses,
  Card,
  Tooltip,
  Dialog,
  DialogSurface,
  tokens,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@fluentui/react-components";
import {
  ChevronDown20Regular,
  ChevronRight20Regular,
  Delete20Regular,
  MoreHorizontal20Regular,
  SelectAllOn20Regular,
  ChatSparkle20Regular,
  Copy20Regular,
  Person20Regular,
  Dismiss24Regular,
} from "@fluentui/react-icons";
import { useStyles, type TranscriptStyles } from "./TranscriptPanel.styles";
import type { TranscriptMessage, Recording } from "./TranscriptPanel.types";
import { generateSampleRecordings } from "./TranscriptPanel.data";
import { useI18n } from "../../../i18n/I18nContext";

// ============================================================================
// MessageCard Component
// ============================================================================

interface MessageCardProps {
  message: TranscriptMessage;
  styles: TranscriptStyles;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, styles }) => {
  const { t } = useI18n();
  // Highlight medication in content
  const renderContent = () => {
    if (!message.highlightedMedication) {
      return message.content;
    }

    const { name, dosage } = message.highlightedMedication;
    const fullMedication = `${name} ${dosage}`;
    const parts = message.content.split(
      new RegExp(`(${name}\\s+${dosage})`, "i")
    );

    return parts.map((part, index) => {
      if (part.toLowerCase() === fullMedication.toLowerCase()) {
        return (
          <span key={index} className={styles.medicationHighlight}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Card className={styles.messageCard} appearance="filled">
      <div className={styles.messageHeader}>
        <div className={styles.speakerSection}>
          <div
            className={mergeClasses(
              styles.speakerAvatar,
              message.speaker === "Unknown" && styles.unknownAvatar
            )}
          >
            {message.speaker === "Unknown" ? (
              <Person20Regular />
            ) : (
              message.speakerInitials
            )}
          </div>
          <div className={styles.speakerInfo}>
            <span className={styles.speakerName}>{message.speaker}</span>
            <span className={styles.messageTime}>{message.timestamp}</span>
          </div>
        </div>
        <Tooltip content={t("transcript.tooltip.menu")} relationship="label">
          <Button
            appearance="subtle"
            icon={<MoreHorizontal20Regular />}
            className={styles.moreButton}
            aria-label={t("transcript.aria.menu")}
          />
        </Tooltip>
      </div>
      <div className={styles.messageContent}>{renderContent()}</div>
      {message.ordersDetected && (
        <div className={styles.ordersDetected}>
          <span className={styles.ordersLabel}>{t("transcript.ordersDetected")}</span>
          {message.ordersDetected}
        </div>
      )}
    </Card>
  );
};

// ============================================================================
// RecordingSection Component
// ============================================================================

interface RecordingSectionProps {
  recording: Recording;
  styles: TranscriptStyles;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const RecordingSection: React.FC<RecordingSectionProps> = ({
  recording,
  styles,
  onToggle,
  onDelete,
}) => {
  const { t } = useI18n();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(recording.id);
    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className={styles.recordingSection}>
        <div
          className={styles.recordingHeader}
          onClick={() => onToggle(recording.id)}
        >
          <div className={styles.recordingHeaderLeft}>
            {recording.isExpanded ? (
              <ChevronDown20Regular className={styles.chevronIcon} />
            ) : (
              <ChevronRight20Regular className={styles.chevronIcon} />
            )}
            <Checkbox
              className={styles.recordingCheckbox}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
            <span className={styles.recordingName}>{recording.name}</span>
          </div>
          <div className={styles.recordingHeaderRight}>
            <span className={styles.recordingDateTime}>
              {recording.date} {recording.time}
            </span>
            <Tooltip content={t("common.delete")} relationship="label">
              <Button
                appearance="subtle"
                icon={<Delete20Regular />}
                className={styles.deleteButton}
                aria-label={t("transcript.aria.deleteRecording")}
                onClick={handleDeleteClick}
              />
            </Tooltip>
          </div>
        </div>
        {recording.isExpanded && (
          <div className={styles.messagesContainer}>
            {recording.messages.map((message) => (
              <MessageCard key={message.id} message={message} styles={styles} />
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(_, data) => {
          if (!data.open) {
            handleCancelDelete();
          }
        }}
      >
        <DialogSurface className="dialog-surface-standard">
          <DialogBody>
            <DialogTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label={t("common.close")}
                  icon={<Dismiss24Regular />}
                  onClick={handleCancelDelete}
                  style={{
                    minWidth: "auto",
                    padding: "var(--spacing-small-4)",
                  }}
                />
              }
              style={{
                fontSize: tokens.fontSizeBase500,
                fontWeight: 600,
                lineHeight: "28px",
                fontFamily: "'Segoe UI', sans-serif",
                marginBottom: "var(--spacing-xxlarge)",
              }}
            >
              {t("transcript.deleteDialog.title")}
            </DialogTitle>
            <DialogContent
              style={{
                fontSize: tokens.fontSizeBase300,
                fontWeight: 400,
                lineHeight: "20px",
                fontFamily: "'Segoe UI', sans-serif",
                marginBottom: "var(--spacing-huge)",
              }}
            >
              {t("transcript.deleteDialog.bodyPrefix")} "{recording.name}"
              {t("transcript.deleteDialog.bodySuffix")}
            </DialogContent>
            <DialogActions
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--gap-large)",
              }}
            >
              <Button appearance="secondary" onClick={handleCancelDelete}>
                {t("common.cancel")}
              </Button>
              <Button appearance="primary" onClick={handleConfirmDelete}>
                {t("common.delete")}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};

// ============================================================================
// TranscriptPanel Component
// ============================================================================

export const TranscriptPanel: React.FC = () => {
  const styles = useStyles();
  const { t } = useI18n();
  const [recordings, setRecordings] = useState<Recording[]>(
    generateSampleRecordings()
  );

  const handleToggleRecording = (id: string) => {
    setRecordings((prev) =>
      prev.map((recording) =>
        recording.id === id
          ? { ...recording, isExpanded: !recording.isExpanded }
          : recording
      )
    );
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings((prev) => prev.filter((recording) => recording.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <Tooltip content={t("transcript.tooltip.selectAll")} relationship="label">
          <Button
            appearance="subtle"
            icon={<SelectAllOn20Regular />}
            className={styles.toolbarButton}
            aria-label={t("transcript.aria.selectAll")}
          />
        </Tooltip>
        <Tooltip content={t("transcript.tooltip.aiChat")} relationship="label">
          <Button
            appearance="subtle"
            icon={<ChatSparkle20Regular />}
            className={styles.toolbarButton}
            aria-label={t("transcript.aria.chat")}
          />
        </Tooltip>
        <Tooltip content={t("common.copy")} relationship="label">
          <Button
            appearance="subtle"
            icon={<Copy20Regular />}
            className={styles.toolbarButton}
            aria-label={t("common.copy")}
          />
        </Tooltip>
      </div>
      <div
        className={mergeClasses(
          styles.recordingsList,
          "right-drawer-scroll-container"
        )}
      >
        {recordings.map((recording) => (
          <RecordingSection
            key={recording.id}
            recording={recording}
            styles={styles}
            onToggle={handleToggleRecording}
            onDelete={handleDeleteRecording}
          />
        ))}
      </div>
    </div>
  );
};

export default TranscriptPanel;
