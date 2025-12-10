/**
 * Header Styles
 *
 * Fluent UI makeStyles definitions for the Header component.
 */

import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  header: {
    minHeight: "88px",
    backgroundColor: "#ffffff",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow:
      "0px 1px 2px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    flexShrink: 0,
    position: "sticky",
    top: 0,
    zIndex: 100,

    "@media (min-width: 769px)": {
      display: "flex",
      minHeight: "88px",
    },

    "@media (max-width: 768px)": {
      minHeight: "60px",
    },
  },

  headerHiddenOnMobile: {
    "@media (max-width: 768px)": {
      display: "none",
    },
    "@media (min-width: 769px)": {
      display: "flex",
    },
  },

  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "12px",
    minHeight: "80px",
    width: "100%",
    paddingBottom: "4px",
    gap: "12px",

    "@media (max-width: 768px)": {
      padding: "8px 0px",
      minHeight: "60px",
      flexDirection: "row",
      gap: "0px",
    },

    "@media (max-width: 480px)": {
      padding: "6px 8px",
      minHeight: "50px",
    },
  },

  homeButtonContainer: {
    display: "flex",
    alignItems: "center",
    alignSelf: "center",
    marginRight: "12px",
    flexShrink: 0,

    "@media (max-width: 768px)": {
      marginRight: "8px",
    },

    "@media (max-width: 480px)": {
      marginRight: "4px",
    },
  },

  homeToggleButton: {
    backgroundColor: "transparent !important",
    border: "none !important",
    boxShadow: "none !important",
    padding: 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&:active": {
      backgroundColor: "transparent",
    },
    "&[aria-pressed='true']": {
      backgroundColor: "transparent",
    },
    "&[data-selected='true']": {
      backgroundColor: "transparent",
    },
  },

  left: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
    flex: 1,

    "@media (max-width: 768px)": {
      alignSelf: "center",
      gap: "0px",
    },

    "@media (max-width: 480px)": {
      gap: "4px",
    },
  },

  patientInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
    flex: 1,

    "@media (max-width: 768px)": {
      gap: "2px",
    },

    "@media (max-width: 480px)": {
      gap: "1px",
    },
  },

  name: {
    fontFamily: "'Segoe UI', sans-serif",
    fontWeight: 600,
    color: "#242424",
    fontSize: "20px",
    lineHeight: "28px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",

    "@media (max-width: 768px)": {
      fontSize: "18px",
      lineHeight: "24px",
    },

    "@media (max-width: 480px)": {
      fontSize: "16px",
      lineHeight: "22px",
    },
  },

  subtitle: {
    fontFamily: "'Segoe UI', sans-serif",
    color: "#242424",
    fontSize: "10px",
    lineHeight: "14px",
    fontWeight: 400,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    paddingTop: "2px",
    width: "100%",

    "@media (max-width: 768px)": {
      fontSize: "9px",
      lineHeight: "12px",
      gap: "2px",
      paddingTop: "1px",
    },

    "@media (max-width: 480px)": {
      fontSize: "8px",
      lineHeight: "10px",
      gap: "1px",
    },
  },

  reasonLabel: {
    fontWeight: 600,
  },

  reasonRow: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  detailsRow: {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
  },

  right: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "6px",
    flexShrink: 0,
    marginLeft: "auto",

    "@media (max-width: 768px)": {
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "4px",
    },

    "@media (max-width: 480px)": {
      gap: "2px",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  },

  iconButton: {
    padding: "6px",
    borderRadius: "4px",
    background: "rgba(255,255,255,0)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "32px",
    minHeight: "32px",

    "@media (max-width: 768px)": {
      padding: "4px",
      minWidth: "28px",
      minHeight: "28px",
      borderRadius: "3px",
    },

    "@media (max-width: 480px)": {
      padding: "3px",
      minWidth: "24px",
      minHeight: "24px",
      borderRadius: "2px",
    },
  },

  icon: {
    color: "#424242",
    width: "20px",
    height: "20px",

    "@media (max-width: 768px)": {
      width: "18px",
      height: "18px",
    },

    "@media (max-width: 480px)": {
      width: "16px",
      height: "16px",
    },
  },

  iconFilled: {
    color: "#000000",
    width: "20px",
    height: "20px",

    "@media (max-width: 768px)": {
      width: "18px",
      height: "18px",
    },

    "@media (max-width: 480px)": {
      width: "16px",
      height: "16px",
    },
  },
});

export type HeaderStyles = ReturnType<typeof useStyles>;
