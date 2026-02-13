/**
 * TranscriptPanel Styles
 *
 * Fluent UI makeStyles definitions for TranscriptPanel components.
 */

import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
    overflow: "hidden",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-small)",
    padding: "8px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  toolbarButton: {
    minWidth: "auto",
    padding: "var(--spacing-medium)",
    color: tokens.colorNeutralForeground2,
  },
  recordingsList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 0",
  },
  recordingSection: {
    marginBottom: "0",
    width: "100%",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  recordingHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  recordingHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
  },
  chevronIcon: {
    color: tokens.colorNeutralForeground2,
  },
  recordingCheckbox: {
    marginRight: "4px",
  },
  recordingName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  recordingHeaderRight: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
  },
  recordingDateTime: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  deleteButton: {
    minWidth: "auto",
    padding: "var(--spacing-small-4)",
    color: tokens.colorNeutralForeground3,
  },
  messagesContainer: {
    padding: "8px 16px 16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-large)",
  },
  messageCard: {
    padding: "12px 16px",
  },
  messageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "var(--spacing-large)",
  },
  speakerSection: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
  },
  speakerAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: tokens.colorNeutralBackground5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  unknownAvatar: {
    backgroundColor: tokens.colorPalettePinkBackground2,
    color: tokens.colorPalettePinkForeground2,
  },
  speakerInfo: {
    display: "flex",
    flexDirection: "column",
  },
  speakerName: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  messageTime: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  moreButton: {
    minWidth: "auto",
    padding: "var(--spacing-small-4)",
    color: tokens.colorNeutralForeground3,
  },
  messageContent: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
    lineHeight: tokens.lineHeightBase300,
  },
  medicationHighlight: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightBold,
  },
  ordersDetected: {
    backgroundColor: "var(--palette-green-f1faf1)",
    padding: "4px 7px",
    margin: "12px -16px -12px -16px",
    boxShadow:
      "0px 1px 2px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)",
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground1,
  },
  ordersLabel: {
    fontWeight: tokens.fontWeightSemibold,
  },
});

export type TranscriptStyles = ReturnType<typeof useStyles>;
