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

// ============================================================================
// MessageCard Component
// ============================================================================

interface MessageCardProps {
  message: TranscriptMessage;
  styles: TranscriptStyles;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, styles }) => {
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
        <Tooltip content="Menu" relationship="label">
          <Button
            appearance="subtle"
            icon={<MoreHorizontal20Regular />}
            className={styles.moreButton}
            aria-label="Menu"
          />
        </Tooltip>
      </div>
      <div className={styles.messageContent}>{renderContent()}</div>
      {message.ordersDetected && (
        <div className={styles.ordersDetected}>
          <span className={styles.ordersLabel}>Orders detected: </span>
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
            <Tooltip content="Delete" relationship="label">
              <Button
                appearance="subtle"
                icon={<Delete20Regular />}
                className={styles.deleteButton}
                aria-label="Delete recording"
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
        <DialogSurface style={{ maxWidth: "320px", padding: "24px" }}>
          <DialogBody>
            <DialogTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={handleCancelDelete}
                  style={{
                    minWidth: "auto",
                    padding: "4px",
                  }}
                />
              }
              style={{
                fontSize: "20px",
                fontWeight: 600,
                lineHeight: "28px",
                fontFamily: "'Segoe UI', sans-serif",
                marginBottom: "12px",
              }}
            >
              Delete recording
            </DialogTitle>
            <DialogContent
              style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                fontFamily: "'Segoe UI', sans-serif",
                marginBottom: "24px",
              }}
            >
              Are you sure you want to delete "{recording.name}"? This action
              cannot be undone.
            </DialogContent>
            <DialogActions
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button appearance="secondary" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={handleConfirmDelete}>
                Delete
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
        <Tooltip content="Select All" relationship="label">
          <Button
            appearance="subtle"
            icon={<SelectAllOn20Regular />}
            className={styles.toolbarButton}
            aria-label="Select all"
          />
        </Tooltip>
        <Tooltip content="AI Chat" relationship="label">
          <Button
            appearance="subtle"
            icon={<ChatSparkle20Regular />}
            className={styles.toolbarButton}
            aria-label="Chat"
          />
        </Tooltip>
        <Tooltip content="Copy" relationship="label">
          <Button
            appearance="subtle"
            icon={<Copy20Regular />}
            className={styles.toolbarButton}
            aria-label="Copy"
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
