/**
 * NotificationsPanel Styles
 *
 * Fluent UI makeStyles definitions for NotificationsPanel components.
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
  notificationsList: {
    flex: 1,
    overflowY: "auto",
    padding: "0 16px 16px 16px",
  },
  dateGroup: {
    marginBottom: "var(--spacing-large)",
  },
  dateLabel: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 0",
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  dateLineLeft: {
    width: "12px",
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
  },
  dateLine: {
    flex: 1,
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
  },
  notificationCard: {
    marginBottom: "var(--spacing-large)",
    padding: "12px 16px",
  },
  notificationHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "var(--spacing-large)",
  },
  authorSection: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
  },
  authorLogo: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
  },
  authorName: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightRegular,
  },
  authorNameAI: {
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
  },
  deleteButton: {
    minWidth: "auto",
    padding: "var(--spacing-small-4)",
    color: tokens.colorNeutralForeground3,
  },
  timestamp: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  notificationContent: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  notificationIcon: {
    flexShrink: 0,
    marginTop: "var(--spacing-xs)",
  },
  alertIcon: {
    color: tokens.colorPaletteRedForeground1,
  },
  infoIcon: {
    color: tokens.colorNeutralForeground2,
  },
  recommendationIcon: {
    color: tokens.colorNeutralForeground2,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: "4px",
    lineHeight: tokens.lineHeightBase300,
  },
  notificationDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

export type NotificationStyles = ReturnType<typeof useStyles>;
