/**
 * FloatingMicBar Styles
 *
 * Styles for the floating Dragon Copilot mic bar
 */

import { makeStyles, tokens } from "@fluentui/react-components";

export const useFloatingMicBarStyles = makeStyles({
  container: {
    position: "absolute",
    top: "140px",
    right: "140px",
    width: "275px",
    backgroundColor: "var(--colorNeutralBackground1)", // Set background to white
    borderRadius: "var(--border-radius-xlarge)",
    border: "1px solid var(--palette-gray-b7b7b7)",
    boxShadow: "var(--shadow-medium)",
    zIndex: 1000,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },

  // Title Bar
  titleBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 6px",
    height: "var(--button-size-standard)",
    backgroundColor: "var(--colorNeutralBackground1)", // Set background to white
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },

  titleBarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-small)",
  },

  dragonLogo: {
    width: "21px",
    height: "22px",
  },

  titleBarRight: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-small)",
  },

  titleBarButton: {
    width: "var(--button-size-standard)",
    height: "var(--button-size-standard)",
    minWidth: "var(--button-size-standard)",
    padding: "var(--spacing-medium)",
  },

  // Content Bar
  contentBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px 4px 10px",
    backgroundColor: tokens.colorNeutralBackground3,
  },

  headerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-small)",
  },

  patientName: {
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase200,
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground2,
  },

  editButton: {
    width: "var(--icon-size-standard)",
    height: "var(--icon-size-standard)",
    minWidth: "var(--icon-size-standard)",
    marginLeft: "4px",
  },

  // Main Content Area
  mainContent: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    maxHeight: "200px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },

  // Microphone Container
  micContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px 10px 12px",
    gap: "var(--gap-xxxlarge)",
    backgroundColor: tokens.colorNeutralBackground1,
  },

  micBarMicRow: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "var(--spacing-large)",
    paddingBottom: "var(--spacing-small-4)",
  },

  micBarToggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "8px 4px 12px 4px",
    backgroundColor: tokens.colorNeutralBackground1,
  },

  dictationCheckbox: {
    marginLeft: "4px",
    flex: "0 0 auto",
  },

  micBarToggleRowActions: {
    display: "flex",
    gap: "var(--gap-large)",
    marginRight: "4px",
  },

  micContainerRecording: {
    position: "relative",
    "&::before": {
      content: "''",
      position: "absolute",
      top: 0,
      left: 0,
      width: "200%",
      height: "100%",
      backgroundImage:
        "linear-gradient(90deg, rgba(13, 145, 225, 0.2) 0%, rgba(140, 72, 255, 0.2) 25%, rgba(255, 95, 61, 0.2) 50%, rgba(242, 244, 253, 0.2) 75%, rgba(13, 145, 225, 0.2) 100%)",
      pointerEvents: "none",
      zIndex: "var(--z-index-base)",
      opacity: 0.9,
      animationDuration: "3.6s",
      animationTimingFunction: "cubic-bezier(0.6, 0, 0.4, 1)",
      animationIterationCount: "infinite",
      animationDirection: "alternate",
      animationName: {
        from: { transform: "translateX(0)" },
        to: { transform: "translateX(-50%)" },
      },
    },
  },

  centerControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    zIndex: 1,
  },

  micButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--colorNeutralBackground1)",
    border: "1px solid transparent",
    borderRadius: "var(--border-radius-circular)",
    boxShadow:
      "0px 2px 4px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)",
    cursor: "pointer",
    padding: "0",
    minHeight: "var(--button-size-standard)",
    maxHeight: "40px",
    minWidth: "95px",
    width: "95px",
    transition: "var(--transition-fluent)",
    "&:hover:not(:disabled)": {
      boxShadow:
        "0px 4px 8px 0px rgba(0,0,0,0.16), 0px 0px 4px 0px rgba(0,0,0,0.14)",
    },
  },

  micButtonRecording: {
    backgroundColor: `${tokens.colorBrandBackground} !important`,
  },

  micButtonContent: {
    display: "flex",
    alignItems: "center",
    width: "auto",
    height: "40px",
  },

  primaryAction: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--gap-medium)",
    paddingLeft: "var(--spacing-large)",
    paddingRight: "6px",
    flex: 1,
    height: "100%",
    borderRadius: "9999px 0 0 9999px",
  },

  micIconSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "var(--button-size-standard)",
  },

  micIcon: {
    width: "var(--icon-size-standard)",
    height: "var(--icon-size-standard)",
    color: tokens.colorNeutralForeground2,
  },

  micIconRecording: {
    color: "var(--colorBrandForeground)",
  },

  secondaryAction: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "var(--button-size-standard)",
    maxWidth: "32px",
    height: "100%",
    borderRadius: "0 9999px 9999px 0",
    borderLeft: `1px solid ${tokens.colorNeutralStroke1}`,
  },

  secondaryActionRecording: {
    borderLeftColor: "rgba(255, 255, 255, 0.3)",
  },

  chevronIcon: {
    width: "12px",
    height: "12px",
    color: "var(--colorNeutralForeground2)",
  },

  chevronIconRecording: {
    color: "var(--colorBrandForeground)",
  },

  rightActions: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-medium)",
    position: "relative",
    zIndex: 1,
  },

  actionButton: {
    minWidth: "var(--button-size-standard)",
    height: "var(--button-size-standard)",
  },

  iconActive: {
    color: tokens.colorBrandForeground1,
  },

  memosLabel: {
    display: "flex",
    height: "var(--icon-size-standard)",
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
    color: tokens.colorNeutralForeground2,
    textOverflow: "ellipsis",
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase100, // Caption 2 Strong = 10px
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: tokens.lineHeightBase100, // Caption 2 Strong = 14px
    margin: "4px",
  },
});
