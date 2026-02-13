/**
 * Header Styles
 *
 * Fluent UI makeStyles definitions for the Header component.
 */

import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  header: {
    minHeight: "88px",
    backgroundColor: "var(--colorNeutralBackground1)",
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
    zIndex: "var(--z-index-header)",

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
    padding: "var(--spacing-xxlarge)",
    minHeight: "80px",
    width: "100%",
    paddingBottom: "var(--spacing-small-4)",
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
    marginRight: "var(--spacing-xxlarge)",
    flexShrink: 0,

    "@media (max-width: 768px)": {
      marginRight: "var(--spacing-large)",
    },

    "@media (max-width: 480px)": {
      marginRight: "4px",
    },
  },

  homeToggleButton: {
    backgroundColor: "transparent !important",
    border: "none !important",
    boxShadow: "var(--shadow-none) !important",
    color: `${tokens.colorNeutralForeground1} !important`,
    padding: 0,
    "&:hover": {
      backgroundColor: "transparent",
      color: `${tokens.colorBrandForeground1} !important`,
    },
    "&:active": {
      backgroundColor: "transparent",
      color: `${tokens.colorNeutralForeground1} !important`,
    },
    "&:focus": {
      backgroundColor: "transparent",
    },
    "&:focus-visible": {
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
      gap: "var(--gap-small)",
    },
  },

  patientInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-small)",
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
    color: "var(--palette-gray-242424)",
    fontSize: tokens.fontSizeBase500,
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
    color: "var(--palette-gray-242424)",
    fontSize: "10px",
    lineHeight: "14px",
    fontWeight: 400,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    paddingTop: "var(--spacing-xs)",
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
    gap: "var(--gap-small)",
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
    gap: "var(--gap-medium)",
    flexShrink: 0,
    marginLeft: "auto",

    "@media (max-width: 768px)": {
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "var(--gap-small)",
    },

    "@media (max-width: 480px)": {
      gap: "2px",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  },

  iconButton: {
    padding: "var(--spacing-medium)",
    borderRadius: "var(--border-radius-medium)",
    background: "rgba(255,255,255,0)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "var(--button-size-standard)",
    minHeight: "var(--button-size-standard)",
    color: tokens.colorNeutralForeground2,

    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorBrandForeground1,
    },

    "@media (max-width: 768px)": {
      padding: "var(--spacing-small-4)",
      minWidth: "28px",
      minHeight: "28px",
      borderRadius: "var(--border-radius-small)",
    },

    "@media (max-width: 480px)": {
      padding: "3px",
      minWidth: "24px",
      minHeight: "24px",
      borderRadius: "var(--border-radius-small)",
    },
  },

  icon: {
    color: "currentColor",
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
    color: "currentColor",
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

  toggleIconButton: {
    color: tokens.colorNeutralForeground2,
    "&:hover": {
      color: tokens.colorBrandForeground1,
    },
  },
});

export type HeaderStyles = ReturnType<typeof useStyles>;
