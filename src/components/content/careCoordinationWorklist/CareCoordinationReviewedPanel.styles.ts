/**
 * CareCoordinationReviewedPanel Styles
 *
 * Styles for the simplified Reviewed panel (right side).
 * Reuses patterns from CareCoordinationWorklist.styles but without
 * checkbox/footer elements.
 */

import { makeStyles, tokens } from "@fluentui/react-components";

export const useReviewedPanelStyles = makeStyles({
  panel: {
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground2,
    boxShadow:
      "0px 1px 2px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: "var(--z-index-content)",
    height: "100%",
    flexShrink: 0,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    minHeight: 0,
  },

  header: {
    display: "flex",
    flexDirection: "column",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 8px 8px 16px",
  },

  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "0px",
  },

  headerButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "var(--spacing-medium)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "var(--button-size-standard)",
    minHeight: "var(--button-size-standard)",
    flexShrink: 0,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      borderRadius: "var(--border-radius-medium)",
    },
  },

  searchContainerActive: {
    width: "100%",
    padding: "8px 8px 8px 8px",
  },

  searchBox: {
    width: "100%",
    display: "flex",
    flex: 1,
    "& .fui-Input": {
      fontSize: tokens.fontSizeBase300,
      minHeight: "40px",
      padding: "8px 12px",
      width: "100%",
    },
    "& .fui-Input__input": {
      fontSize: tokens.fontSizeBase300,
      lineHeight: "1.5",
    },
  },

  filterRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "4px 8px 4px 16px",
    gap: "var(--gap-medium)",
  },

  filterButton: {
    minWidth: "var(--button-size-standard)",
    minHeight: "var(--button-size-standard)",
    padding: "var(--spacing-medium)",
  },

  body: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    paddingRight: "var(--spacing-small-4)",
  },

  content: {
    flex: 1,
    padding: "0 0 16px 0",
  },

  listItem: {
    padding: "var(--spacing-xxlarge) var(--spacing-xxlarge) var(--spacing-xxlarge) 8px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    cursor: "pointer",
    transition: "var(--transition-fluent)",
    backgroundColor: "transparent",
    position: "relative",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      borderBottomColor: tokens.colorNeutralStroke1Hover,
    },
    "&:active": {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
  },

  listItemMain: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-medium)",
  },

  listItemHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--gap-large)",
  },

  patientName: {
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },

  headerActionsRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  callTypePill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  callType_medication_adherence: {
    backgroundColor: "#E8F0FE",
    color: "#1B6EC2",
  },

  callType_patient_intake: {
    backgroundColor: "#E1F5F0",
    color: "#0E7C6B",
  },

  callType_hypertension_management: {
    backgroundColor: "#F3E8FD",
    color: "#7B2D8E",
  },

  statusPill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.colorNeutralBackground4,
    color: tokens.colorNeutralForeground2,
    borderRadius: "16px",
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  moreButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "var(--spacing-small-4)",
    transition: "var(--transition-opacity-normal)",
  },

  summaryText: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: "1.4",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  metaInfoRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-medium)",
    flexWrap: "nowrap",
  },

  inlineMeta: {
    display: "inline-flex",
    alignItems: "center",
    gap: "3px",
    minWidth: 0,
  },

  inlineMetaLabel: {
    color: tokens.colorNeutralForeground3,
    fontSize: "10px",
    lineHeight: "1.4",
    whiteSpace: "nowrap",
  },

  inlineMetaValue: {
    color: tokens.colorNeutralForeground2,
    fontSize: "10px",
    lineHeight: "1.4",
    whiteSpace: "nowrap",
  },

  actionButtonsSpacer: {
    height: "20px",
    flexShrink: 0,
  },

  emptyState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 12px",
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});
