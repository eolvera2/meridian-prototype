/**
 * MicrophoneInterface Styles
 *
 * Contains all makeStyles definitions for the MicrophoneInterface component.
 */

import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  microphoneInterface: {
    height: "72px",
    background: tokens.colorNeutralBackground1,
    boxShadow: `0 14px 28px 0 ${tokens.colorNeutralShadowKeyDarker}, 0 0 8px 0 ${tokens.colorNeutralShadowAmbientDarker}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 12px 16px 12px",
    width: "100%",
    flexShrink: 0,
    zIndex: 200,
    position: "relative",
    overflow: "hidden",
  },

  microphoneInterfaceRecording: {
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
    "&::after": {
      content: "''",
      position: "absolute",
      top: 0,
      left: "-50%",
      width: "250%",
      height: "100%",
      backgroundImage:
        "linear-gradient(120deg, rgba(255, 255, 255, 0.08) 0%, rgba(140, 72, 255, 0.2) 40%, rgba(13, 145, 225, 0.15) 70%, rgba(255, 148, 41, 0.15) 100%)",
      pointerEvents: "none",
      zIndex: 0,
      opacity: 0.7,
      mixBlendMode: "screen",
      animationDuration: "5.2s",
      animationDelay: "-1.3s",
      animationTimingFunction: "cubic-bezier(0.45, 0.05, 0.55, 0.95)",
      animationIterationCount: "infinite",
      animationDirection: "alternate",
      animationName: {
        from: { transform: "translateX(0)" },
        to: { transform: "translateX(-40%)" },
      },
    },
  },

  micContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    height: "100%",
    gap: "16px",
    position: "relative",
    zIndex: 1,
  },

  leftSection: {
    flex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    minWidth: "0",
  },

  centerControls: {
    flex: "0 0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "@media (max-width: 480px)": {
      flex: "1",
    },
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
    minWidth: "48px",
    width: "auto",
    transition: "all 0.2s cubic-bezier(0.1,0.9,0.2,1)",
    "&:hover:not(:disabled)": {
      boxShadow:
        "0px 4px 8px 0px rgba(0,0,0,0.16), 0px 0px 4px 0px rgba(0,0,0,0.14)",
    },
    "&:active:not(:disabled)": {
      transform: "scale(0.98)",
    },
    "&:disabled": {
      backgroundColor: tokens.colorNeutralBackgroundDisabled,
      color: tokens.colorNeutralForegroundDisabled,
      border: `1px solid ${tokens.colorNeutralStroke1}`,
      boxShadow: "none",
      cursor: "not-allowed",
      opacity: 0.7,
    },
  },

  micButtonDocumentBorder: {
    position: "relative",
    borderRadius: tokens.borderRadiusCircular,
    backgroundClip: "padding-box",
    boxShadow: `0 2px 4px 0 ${tokens.colorNeutralShadowKey}, 0 0 2px 0 ${tokens.colorNeutralShadowAmbient}`,
    "&::before": {
      content: "''",
      position: "absolute",
      inset: 0,
      borderRadius: tokens.borderRadiusCircular,
      padding: "2px",
      background:
        "linear-gradient(143deg, rgba(255,255,255,0) 8.35%, rgba(13,145,225,0.03) 30.83%, rgba(45,180,255,0.30) 45.49%, rgba(214,96,255,0.30) 75.79%, rgba(254,168,116,0.30) 95.33%)",
      WebkitMask:
        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
      zIndex: 1,
      pointerEvents: "none",
    },
  },

  micButtonDisabled: {
    backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: "none",
    color: tokens.colorNeutralForegroundDisabled,
    pointerEvents: "none",
    "&:hover": {
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      boxShadow: "none",
    },
    "&:active": {
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      boxShadow: "none",
    },
    "&:focus": {
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      boxShadow: "none",
    },
    "&:focus-visible": {
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      boxShadow: "none",
    },
  },

  micButtonContent: {
    display: "flex",
    alignItems: "center",
    width: "auto",
    height: "40px",
  },

  micButtonDocumentExpanded: {
    width: "114px",
    height: "46px",
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

  timeDisplay: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "14px",
    fontWeight: "400",
    color: "#424242",
    lineHeight: "20px",
    letterSpacing: "0.5px",
    minWidth: "32px",
    textAlign: "center",
  },

  timeDisplayDisabled: {
    color: tokens.colorNeutralForegroundDisabled,
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: 600,
  },

  timeDisplayRecording: {
    color: tokens.colorNeutralForegroundOnBrand,
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

  micIconDisabled: {
    color: tokens.colorNeutralForegroundDisabled,
  },

  micIconBrand: {
    color: tokens.colorBrandForeground1,
  },

  chevronIcon: {
    width: "12px",
    height: "12px",
    color: "#424242",
  },

  chevronIconRecording: {
    color: tokens.colorNeutralForegroundOnBrand,
  },

  micButtonRecording: {
    backgroundColor: `${tokens.colorBrandBackground} !important`,
  },

  micIconRecording: {
    color: tokens.colorNeutralForegroundOnBrand,
  },

  rightActions: {
    flex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: tokens.spacingHorizontalXXS,
    minWidth: "0",
    "@media (max-width: 768px)": {
      gap: "4px",
    },
    "@media (max-width: 480px)": {
      gap: "2px",
    },
  },

  dictationCheckbox: {
    "& .fui-Checkbox__label": {
      fontFamily: "'Segoe UI', sans-serif",
      fontSize: "10px",
      fontWeight: 400,
      lineHeight: "14px",
      color: tokens.colorNeutralForeground2,
    },
  },

  dialogSurface: {
    width: "320px",
    maxWidth: "calc(100% - 32px)",
    padding: tokens.spacingHorizontalXXL,
    borderRadius: tokens.borderRadiusXLarge,
  },

  dialogTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
    paddingRight: 0,
  },

  dialogTitleText: {
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: "28px",
    fontFamily: "'Segoe UI', sans-serif",
  },

  dialogCloseButton: {
    minWidth: "auto",
    padding: "4px",
  },

  dialogContent: {
    fontSize: "14px",
    lineHeight: "20px",
    color: tokens.colorNeutralForeground2,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalL,
  },

  dialogActions: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    paddingTop: tokens.spacingVerticalS,
  },

  dialogButton: {
    width: "100%",
  },

  settingsButton: {
    width: "32px",
    height: "32px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      transform: "scale(1.05)",
    },
    "&[aria-pressed='true']": {
      backgroundColor: "#f5f5f5",
    },
    "@media (max-width: 768px)": {
      width: "28px",
      height: "28px",
      borderRadius: "3px",
    },
  },

  iconActive: {
    color: "#000000",
    transform: "scale(1.1)",
    transition: "all 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)",
  },

  microphoneInterfaceMobile: {
    "@media (max-width: 768px)": {
      position: "relative",
      left: "0 !important",
      right: 0,
      width: "100%",
      height: "70px",
      padding: "8px 12px",
      zIndex: 200,
    },
    "@media (max-width: 480px)": {
      position: "relative",
      left: "0 !important",
      right: "0 !important",
      width: "100%",
      zIndex: 200,
    },
  },

  micContainerMobile: {
    "@media (max-width: 768px)": {
      maxWidth: "100%",
      width: "100%",
      margin: 0,
      position: "relative",
    },
  },
});
