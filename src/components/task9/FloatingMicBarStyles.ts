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
    backgroundColor: "#fff", // Set background to white
    borderRadius: "8px",
    border: "1px solid #b7b7b7",
    boxShadow: "0px 8px 16px rgba(0,0,0,0.14), 0px 0px 2px rgba(0,0,0,0.12)",
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
    height: "32px",
    backgroundColor: "#fff", // Set background to white
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },

  titleBarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  dragonLogo: {
    width: "21px",
    height: "22px",
  },

  titleBarRight: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  titleBarButton: {
    width: "32px",
    height: "32px",
    minWidth: "32px",
    padding: "6px",
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
    gap: "4px",
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
    width: "24px",
    height: "24px",
    minWidth: "24px",
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
    gap: "16px",
    backgroundColor: tokens.colorNeutralBackground1,
  },

  micBarMicRow: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "8px",
    paddingBottom: "4px",
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
    gap: "8px",
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
      zIndex: 0,
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
    backgroundColor: "#ffffff",
    border: "1px solid transparent",
    borderRadius: "9999px",
    boxShadow:
      "0px 2px 4px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)",
    cursor: "pointer",
    padding: "0",
    minHeight: "32px",
    maxHeight: "40px",
    minWidth: "95px",
    width: "95px",
    transition: "all 0.2s cubic-bezier(0.1,0.9,0.2,1)",
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
    gap: "6px",
    paddingLeft: "8px",
    paddingRight: "6px",
    flex: 1,
    height: "100%",
    borderRadius: "9999px 0 0 9999px",
  },

  micIconSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "32px",
  },

  micIcon: {
    width: "24px",
    height: "24px",
    color: tokens.colorNeutralForeground2,
  },

  micIconRecording: {
    color: "#ffffff",
  },

  secondaryAction: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
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
    color: "#424242",
  },

  chevronIconRecording: {
    color: "#ffffff",
  },

  rightActions: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    position: "relative",
    zIndex: 1,
  },

  actionButton: {
    minWidth: "32px",
    height: "32px",
  },

  iconActive: {
    color: tokens.colorBrandForeground1,
  },
});
