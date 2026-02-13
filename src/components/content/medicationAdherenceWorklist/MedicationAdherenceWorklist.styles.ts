/**
 * Worklist Styles
 *
 * Contains all makeStyles definitions for the Worklist component.
 */

import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  worklist: {
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
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    minHeight: 0,
    "@media (max-width: 768px)": {
      width: "100%",
      zIndex: "var(--z-index-navigation-secondary)",
      position: "relative",
    },
  },

  worklistCollapsed: {
    display: "none",
  },

  header: {
    display: "flex",
    flexDirection: "column",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },

  worklistBody: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    paddingRight: "var(--spacing-small-4)",
  },

  tabs: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "12px 8px 0px 0px",
    gap: "var(--gap-large)",
    position: "relative",
    flexWrap: "nowrap",
    "& .fui-TabList": {
      minHeight: "auto",
      flex: "1",
    },
    "& .fui-Tab": {
      fontSize: tokens.fontSizeBase300,
      fontWeight: 500,
    },
    "& .fui-Tab[aria-selected=true]": {
      fontWeight: 600,
    },
  },

  tabStretchList: {
    flex: "1 1 auto",
    minWidth: 0,
    display: "flex",
    gap: 0,
    padding: 0,
  },

  tabStretch: {
    flex: "1 1 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    paddingInline: tokens.spacingHorizontalS,
    minWidth: 0,
    "& .fui-Tab__content": {
      overflow: "visible",
      textOverflow: "unset",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
    },
  },

  tabUrgent: {
    "&[aria-selected='true']::after": {
      borderBottomColor: "#D13438 !important",
      backgroundColor: "#D13438 !important",
    },
  },

  tabQueue: {
    "&[aria-selected='true']::after": {
      borderBottomColor: "#FDE300 !important",
      backgroundColor: "#FDE300 !important",
    },
  },

  tabCleared: {
    "&[aria-selected='true']::after": {
      borderBottomColor: "#107C10 !important",
      backgroundColor: "#107C10 !important",
    },
  },

  tabLabel: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingHorizontalXS,
    maxWidth: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  tabDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
    display: "inline-block",
  },

  tabDotUrgent: {
    backgroundColor: "#D13438",
  },

  tabDotQueue: {
    backgroundColor: "#FDE300",
  },

  tabDotCleared: {
    backgroundColor: "#107C10",
  },

  tabsSearchActive: {
    justifyContent: "stretch",
    padding: "0px 0px 0 0px",
  },

  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
    position: "relative",
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

  searchButton: {
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

  calendarFilter: {
    padding: "8px 8px 8px 8px",
  },

  dateRange: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--gap-large)",
  },

  selectAllRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-medium)",
  },

  dateInput: {
    flex: 1,
  },

  dateInputContent: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-medium)",
  },

  dateIcon: {
    color: tokens.colorNeutralForeground3,
  },

  dateText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },

  chevronIcon: {
    color: tokens.colorNeutralForeground3,
  },

  dateUnderline: {
    height: "1px",
    marginTop: "var(--spacing-small-4)",
    backgroundColor: tokens.colorNeutralStroke2,
  },

  filterOptions: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-medium)",
  },

  filterButton: {
    minWidth: "var(--button-size-standard)",
    minHeight: "var(--button-size-standard)",
    padding: "var(--spacing-medium)",
  },

  content: {
    flex: 1,
    padding: "0 0 16px 0",
  },

  groupHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    backgroundColor: tokens.colorNeutralBackground3,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    cursor: "pointer",
  },

  groupTitle: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    lineHeight: "28px",
    color: tokens.colorNeutralForeground1,
    fontWeight: 600,
  },

  headerChevron: {
    width: "20px",
    height: "20px",
    color: tokens.colorNeutralForeground3,
    transition: "transform 120ms ease",
    marginRight: "var(--spacing-large)",
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
    "&:hover .mic-button": {
      opacity: 1,
    },
    "&:active": {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
  },

  listItemContent: {
    display: "flex",
    gap: "var(--gap-medium)",
    alignItems: "flex-start",
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

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
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

  patientName: {
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },

  patientCheckbox: {
    marginTop: "-2px",
    flexShrink: 0,
  },

  rightSide: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
  },

  timeText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },

  moreButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "var(--spacing-small-4)",
    transition: "var(--transition-opacity-normal)",
  },

  micButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "var(--spacing-small-4)",
    opacity: 0,
    transition: "var(--transition-opacity-normal)",
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    "&:hover": {
      color: tokens.colorBrandForeground2,
    },
    "&:active": {
      color: tokens.colorBrandForeground2,
    },
  },

  actionButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "var(--gap-large)",
  },

  actionButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "var(--spacing-small-4)",
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      color: tokens.colorBrandForeground2,
    },
    "&:active": {
      color: tokens.colorBrandForeground2,
    },
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

  detailsLine: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    lineHeight: "1.4",
  },

  metaInfoRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-medium)",
    flexWrap: "wrap",
  },

  inlineMeta: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    minWidth: 0,
  },

  inlineMetaLabel: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase100,
    lineHeight: "1.4",
    whiteSpace: "nowrap",
  },

  inlineMetaValue: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: "1.4",
    whiteSpace: "nowrap",
  },

  contactMethodIcon: {
    display: "inline-flex",
    alignItems: "center",
    color: tokens.colorNeutralForeground3,
    "& svg": {
      fontSize: "14px",
    },
  },

  patientMetaGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-small)",
  },

  patientMetaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--gap-medium)",
  },

  patientMetaLabel: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase100,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  patientMetaValue: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    textAlign: "right",
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--gap-small)",
  },

  contactMethod: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--gap-small)",
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase100,
    "& svg": {
      fontSize: "14px",
    },
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
  },

  statusBadge: {
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    backgroundColor: tokens.colorNeutralForeground3,
  },

  signedPill: {
    display: "inline-flex",
    gap: "var(--gap-large)",
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground4,
    padding: "3px",
    borderRadius: "16px",
  },

  signedText: {
    color: tokens.colorNeutralForeground2,
    fontSize: "10px",
    fontWeight: 600,
    marginRight: "var(--spacing-large)",
  },

  modifiedText: {
    color: tokens.colorNeutralForeground3,
    fontSize: "12px",
    fontWeight: 400,
  },

  syncPill: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground4,
    color: tokens.colorNeutralForeground3,
    padding: "2px 8px",
    borderRadius: "16px",
    fontSize: "10px",
    fontWeight: 600,
    marginRight: "var(--spacing-large)",
  },

  userAddedPill: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "var(--palette-yellow-f9e2ae)",
    color: tokens.colorNeutralForeground2,
    padding: "2px 8px",
    borderRadius: "16px",
    fontSize: "10px",
    fontWeight: 600,
    marginRight: "var(--spacing-large)",
  },

  createdText: {
    color: tokens.colorNeutralForeground3,
    fontSize: "10px",
    fontWeight: 600,
  },

  statusText: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--gap-large)",
  },

  footer: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: "12px 16px 20px 16px",
    position: "sticky",
    bottom: 0,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: "var(--shadow-top)",
    flexShrink: 0,
    zIndex: 1,
  },

  footerContent: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  footerLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },

  footerActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  worklistMobile: {
    "@media (max-width: 768px)": {
      position: "absolute",
      left: "0px",
      right: "0px",
      top: "44px",
      bottom: "72px",
      width: "100%",
      maxHeight: "calc(100% - 116px)",
      height: "auto",
      overflow: "hidden",
      zIndex: 6,
    },
  },
});
