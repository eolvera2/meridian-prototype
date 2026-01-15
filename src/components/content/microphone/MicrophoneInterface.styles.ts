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
    zIndex: "var(--z-index-microphone)",
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
      zIndex: "var(--z-index-base)",
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
    maxWidth: "var(--content-max-width)",
    margin: "0 auto",
    height: "100%",
    gap: "var(--gap-xxxlarge)",
    position: "relative",
    zIndex: "var(--z-index-below)",
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
    backgroundColor: "var(--colorNeutralBackground1)",
    border: "1px solid transparent",
    borderRadius: "var(--border-radius-circular)",
    boxShadow:
      "0px 2px 4px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)",
    cursor: "pointer",
    padding: "0",
    minHeight: "32px",
    maxHeight: "40px",
    minWidth: "32px",
    width: "auto",
    transition: "var(--transition-fluent)",
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
      boxShadow: "var(--shadow-none)",
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
      zIndex: "var(--z-index-below)",
      pointerEvents: "none",
    },
  },

  micButtonDisabled: {
    backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: "var(--shadow-none)",
    color: tokens.colorNeutralForegroundDisabled,
    pointerEvents: "none",
    "&:hover": {
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      boxShadow: "var(--shadow-none)",
    },
    "&:active": {
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      boxShadow: "var(--shadow-none)",
    },
    "&:focus": {
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      boxShadow: "var(--shadow-none)",
    },
    "&:focus-visible": {
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      boxShadow: "var(--shadow-none)",
    },
  },

  micButtonContent: {
    display: "flex",
    alignItems: "center",
    width: "auto",
    height: "40px",
  },

  micSplitPrimaryButton: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: "16px",
    paddingRight: "var(--spacing-xxxlarge)",
    minHeight: "40px",
    height: "40px",
    border: "none",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent !important",
    },
    "&:active": {
      backgroundColor: "transparent !important",
    },
    "&:focus": {
      backgroundColor: "transparent !important",
    },
    "&:focus-visible": {
      backgroundColor: "transparent !important",
    },
    minWidth: "auto",
    width: "auto",
    borderRadius: "9999px 0 0 9999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  micSplitPrimaryButtonRecording: {
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent !important",
    },
    "&:active": {
      backgroundColor: "transparent !important",
    },
    "&:focus": {
      backgroundColor: "transparent !important",
    },
    "&:focus-visible": {
      backgroundColor: "transparent !important",
    },
  },

  micSplitMenuButton: {
    padding: 0,
    minHeight: "40px",
    height: "40px",
    border: "none",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent !important",
    },
    "&:active": {
      backgroundColor: "transparent !important",
    },
    "&:focus": {
      backgroundColor: "transparent !important",
    },
    "&:focus-visible": {
      backgroundColor: "transparent !important",
    },
    "&:disabled": {
      opacity: 1,
      cursor: "default",
      backgroundColor: "transparent",
    },
  },

  micSplitMenuButtonRecording: {
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent !important",
    },
    "&:active": {
      backgroundColor: "transparent !important",
    },
    "&:focus": {
      backgroundColor: "transparent !important",
    },
    "&:focus-visible": {
      backgroundColor: "transparent !important",
    },
  },

  micButtonDocumentExpanded: {
    width: "114px",
    height: "46px",
  },

  primaryAction: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--gap-medium)",
    height: "100%",
    borderRadius: "9999px 0 0 9999px",
  },

  primaryActionDictationCompact: {
    gap: "var(--gap-small)",
  },

  timeDisplay: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase300,
    fontWeight: "400",
    color: "var(--colorNeutralForeground2)",
    lineHeight: "20px",
    letterSpacing: "0.5px",
    minWidth: "32px",
    textAlign: "center",
  },

  timeDisplayDisabled: {
    color: tokens.colorNeutralForegroundDisabled,
    fontSize: tokens.fontSizeBase200,
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
    position: "relative",
    "&::before": {
      content: "''",
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "1px",
      backgroundColor: tokens.colorNeutralStroke1,
    },
  },

  secondaryActionRecording: {
    "&::before": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
  },

  micIconSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "24px",
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
    color: "var(--colorNeutralForeground2)",
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
      gap: "var(--gap-small)",
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
    fontSize: tokens.fontSizeBase500,
    fontWeight: 600,
    lineHeight: "28px",
    fontFamily: "'Segoe UI', sans-serif",
  },

  dialogCloseButton: {
    minWidth: "auto",
    padding: "var(--spacing-small-4)",
  },

  dialogContent: {
    fontSize: tokens.fontSizeBase300,
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
    borderRadius: "var(--border-radius-medium)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "var(--transition-fluent)",
    "&:hover": {
      backgroundColor: "var(--colorNeutralBackground3)",
      transform: "scale(1.05)",
    },
    "&[aria-pressed='true']": {
      backgroundColor: "var(--colorNeutralBackground3)",
    },
    "@media (max-width: 768px)": {
      width: "28px",
      height: "28px",
      borderRadius: "var(--border-radius-small)",
    },
  },

  iconActive: {
    color: "var(--palette-black)",
    transform: "scale(1.1)",
    transition: "var(--transition-fluent)",
  },

  microphoneInterfaceMobile: {
    "@media (max-width: 768px)": {
      position: "relative",
      left: "0 !important",
      right: 0,
      width: "100%",
      height: "70px",
      padding: "8px 12px",
      zIndex: "var(--z-index-microphone)",
    },
    "@media (max-width: 480px)": {
      position: "relative",
      left: "0 !important",
      right: "0 !important",
      width: "100%",
      zIndex: "var(--z-index-microphone)",
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
