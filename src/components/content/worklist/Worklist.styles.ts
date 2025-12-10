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
    zIndex: 5,
    height: "100%",
    flexShrink: 0,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    minHeight: 0,
    "@media (max-width: 768px)": {
      width: "100%",
      zIndex: 15,
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
    paddingRight: "4px",
  },

  tabs: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "12px 8px 0px 0px",
    gap: "8px",
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
    justifyContent: "flex-start",
    boxSizing: "border-box",
    paddingInline: tokens.spacingHorizontalS,
    minWidth: 0,
    "& .fui-Tab__content": {
      overflow: "visible",
      textOverflow: "unset",
      width: "100%",
      display: "flex",
      justifyContent: "flex-start",
      textAlign: "left",
    },
  },

  tabLabel: {
    display: "block",
    flex: 1,
    minWidth: 0,
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  tabsSearchActive: {
    justifyContent: "stretch",
    padding: "0px 0px 0 0px",
  },

  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "32px",
    minHeight: "32px",
    flexShrink: 0,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      borderRadius: "4px",
    },
  },

  calendarFilter: {
    padding: "8px 8px 8px 8px",
  },

  dateRange: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },

  dateInput: {
    flex: 1,
  },

  dateInputContent: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
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
    marginTop: "4px",
    backgroundColor: tokens.colorNeutralStroke2,
  },

  filterOptions: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  filterButton: {
    minWidth: "32px",
    minHeight: "32px",
    padding: "6px",
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
    marginRight: "8px",
  },

  listItem: {
    padding: "12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)",
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
    gap: "8px",
  },

  listItemMain: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  listItemHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },

  patientName: {
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },

  rightSide: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  timeText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },

  moreButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    transition: "opacity 0.2s ease",
  },

  micButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    opacity: 0,
    transition: "opacity 0.2s ease",
    color: tokens.colorBrandForeground1,
    fontSize: "20px",
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

  description: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: "1.4",
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  statusBadge: {
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    backgroundColor: tokens.colorNeutralForeground3,
  },

  signedPill: {
    display: "inline-flex",
    gap: "8px",
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground4,
    padding: "3px",
    borderRadius: "16px",
  },

  signedText: {
    color: tokens.colorNeutralForeground2,
    fontSize: "10px",
    fontWeight: 600,
    marginRight: "8px",
  },

  modifiedText: {
    color: tokens.colorNeutralForeground3,
    fontSize: "10px",
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
    marginRight: "8px",
  },

  userAddedPill: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#F9E2AE",
    color: tokens.colorNeutralForeground2,
    padding: "2px 8px",
    borderRadius: "16px",
    fontSize: "10px",
    fontWeight: 600,
    marginRight: "8px",
  },

  createdText: {
    color: tokens.colorNeutralForeground3,
    fontSize: "10px",
    fontWeight: 600,
  },

  statusText: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },

  footer: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: "12px 16px 20px 16px",
    position: "sticky",
    bottom: 0,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: "0 -6px 18px rgba(0,0,0,0.08)",
    flexShrink: 0,
    zIndex: 1,
  },

  addPatientButton: {
    backgroundColor: tokens.colorBrandBackground,
    border: "none",
    borderRadius: "4px",
    boxShadow:
      "0px 4px 8px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)",
    cursor: "pointer",
    display: "flex",
    gap: "6px",
    height: "44px",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 16px",
    width: "100%",
    ":hover": {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },

  addPatientText: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "16px",
    lineHeight: "22px",
    color: "#ffffff",
    fontWeight: 600,
  },

  addIcon: {
    width: "24px",
    height: "24px",
    color: "#ffffff",
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
