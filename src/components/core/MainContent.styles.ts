import { makeStyles, tokens } from "@fluentui/react-components";

export const useMainContentStyles = makeStyles({
  mainContent: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: "100%",
    minHeight: 0,
    overflowX: "hidden",
    overflowY: "hidden",
    minWidth: 0,
    backgroundColor: tokens.colorNeutralBackground2,

    "@media (max-width: 768px)": {
      flexDirection: "column",
      overflowY: "auto",
    },
  },

  desktopWrapper: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    height: "100%",
    minHeight: 0,

    "@media (max-width: 768px)": {
      display: "none",
    },
  },

  desktopMainArea: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    position: "relative",
  },

  desktopContentArea: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    minHeight: 0,

    "@media (max-width: 768px)": {
      display: "none",
    },
  },

  worklistContainer: {
    width: "var(--content-min-width)",
    flexShrink: 0,
    transition: "width 0.3s ease, opacity 0.3s ease",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
  },

  worklistContainerHidden: {
    display: "none",
  },

  mobileWorklistContainer: {
    "@media (max-width: 768px)": {
      flex: 1,
      minWidth: 0,
      alignSelf: "stretch",
      height: "100%",
      position: "relative",
      order: 2,
      boxSizing: "border-box",
    },

    "@media (max-width: 768px) and (min-width: 481px)": {
      flex: 1,
      width: "100%",
      maxWidth: "100%",
    },
  },

  mobileWorklistContainerHidden: {
    "@media (max-width: 768px)": {
      display: "none",
    },
  },

  mobileWorklistContainerWithDrawer: {
    "@media (min-width: 769px)": {
      display: "block",
      minWidth: "auto",
      maxWidth: "none",
      marginLeft: 0,
      order: "unset",
      zIndex: "auto",
    },
    "@media (max-width: 768px) and (min-width: 481px)": {
      display: "flex",
      minWidth: "50%",
      maxWidth: "50%",
      marginLeft: 0,
      zIndex: 99,
      boxSizing: "border-box",
      order: 1,
      "& > *": {
        paddingTop: 0,
      },
    },
    "@media (max-width: 480px)": {
      display: "none",
    },
  },

  mobileWorklistContainerSideBySide: {
    "@media (max-width: 768px) and (min-width: 481px)": {
      display: "flex",
      width: "calc((100% - 44px) / 2)",
      minWidth: "calc((100% - 44px) / 2)",
      maxWidth: "calc((100% - 44px) / 2)",
      height: "100%",
      order: 1,
      zIndex: "var(--z-index-navigation)",
      boxSizing: "border-box",
      overflow: "hidden",
      flexShrink: 0,
    },
    "@media (max-width: 480px)": {
      display: "none",
    },
  },

  headerAndContentContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
    width: "100%",
    minHeight: 0,
  },

  headerContainer: {
    display: "flex",
    flexShrink: 0,
    width: "100%",
    position: "relative",
    zIndex: "var(--z-index-navigation)",
  },

  headerContainerWithDrawer: {
    "@media (max-width: 768px) and (min-width: 481px)": {
      position: "relative",
      top: 0,
      left: 0,
      right: 0,
      width: "100%",
      height: "64px",
      zIndex: "105",
      backgroundColor: "var(--colorNeutralBackground1)",
      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
      flexShrink: 0,
    },
    "@media (max-width: 480px)": {
      display: "flex",
      flexShrink: 0,
      width: "100%",
    },
  },

  contentContainer: {
    flex: 1,
    width: "100%",
    minHeight: 0,
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
    position: "relative",
  },

  documentArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    minWidth: 0,
    minHeight: 0,
    alignItems: "center",
  },

  drawerArea: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
    maxHeight: "100%",
    overflow: "hidden",
    position: "relative",
    flex: "0 0 auto",

    "@media (min-width: 769px)": {
      height: "100%",
    },
  },

  mobileContentArea: {
    display: "none",
    flexDirection: "row",
    flex: 1,
    minHeight: 0,
    alignItems: "stretch",
    position: "relative",

    "@media (max-width: 768px)": {
      display: "flex",
      paddingBottom: "var(--microphone-interface-height)",
      minHeight: 0,
    },
  },

  mobileContentAreaWithDrawer: {
    position: "relative",
    "@media (min-width: 769px)": {
      display: "none",
      paddingBottom: 0,
      height: "auto",
      marginTop: "auto",
    },
    "@media (max-width: 768px) and (min-width: 481px)": {
      display: "flex",
      flexDirection: "row",
      flex: 1,
      minHeight: 0,
      paddingBottom: "var(--microphone-interface-height)",
      height: "calc(100vh - 44px - 72px)",
      position: "relative",
      top: 0,
    },
    "@media (max-width: 480px)": {
      display: "flex",
      flexDirection: "row",
      flex: 1,
      minHeight: 0,
      alignItems: "stretch",
      paddingBottom: "var(--microphone-interface-height)",
      height: "100%",
    },
  },

  mobileContentWrapper: {
    "@media (max-width: 768px)": {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      alignSelf: "stretch",
      minHeight: 0,
      position: "relative",
      order: 3,
      overflowY: "auto",
    },
  },

  mobileContentWrapperWithDrawer: {
    "@media (max-width: 768px) and (min-width: 481px)": {
      display: "flex",
      flexDirection: "column",
      width: "50%",
      minWidth: "50%",
      maxWidth: "50%",
      height: "100%",
      overflow: "hidden",
      zIndex: "var(--z-index-sticky-header)",
      boxSizing: "border-box",
      paddingTop: 0,
      order: 1,
      overflowY: "auto",
    },
    "@media (max-width: 480px)": {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      alignSelf: "stretch",
      height: "100%",
      position: "relative",
      order: 3,
      overflowY: "auto",
    },
  },

  mobileContentRow: {
    "@media (max-width: 768px) and (min-width: 481px)": {
      display: "flex",
      flexDirection: "row",
      flex: 1,
      minHeight: 0,
      alignItems: "stretch",
      width: "100%",
    },
    "@media (max-width: 480px)": {
      display: "none",
    },
  },

  mobileLeftNavigation: {
    "@media (max-width: 768px)": {
      display: "flex",
      flexShrink: 0,
      width: "44px",
      backgroundColor: tokens.colorNeutralBackground4,
      alignSelf: "stretch",
      height: "100%",
      position: "relative",
      order: 1,
    },
  },

  mobileLeftNavigationWithDrawer: {
    "@media (max-width: 768px) and (min-width: 481px)": {
      display: "flex",
      flexShrink: 0,
      width: "44px",
      backgroundColor: tokens.colorNeutralBackground4,
      alignSelf: "stretch",
      height: "100%",
      position: "relative",
      order: 1,
    },
    "@media (max-width: 480px)": {
      display: "flex",
      flexShrink: 0,
      width: "44px",
      backgroundColor: tokens.colorNeutralBackground4,
      alignSelf: "stretch",
      height: "100%",
      position: "relative",
      order: 1,
    },
  },

  mobileContentContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
    minHeight: 0,
    height: "100%",
  },

  mobileDocumentArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    minHeight: 0,
    height: "100%",
    "@media (max-width: 768px)": {
      paddingBottom: "var(--microphone-interface-extended-height)",
      scrollPaddingBottom: "var(--microphone-interface-extended-height)",
    },
  },

  microphoneContainer: {
    display: "none",

    "@media (max-width: 768px)": {
      display: "block",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      width: "100%",
      zIndex: "var(--z-index-microphone)",
      flexShrink: 0,
      backgroundColor: tokens.colorNeutralBackground1,
      borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    },
  },

  desktopMicrophoneContainer: {
    flexShrink: 0,
    zIndex: "var(--z-index-microphone)",
    backgroundColor: tokens.colorNeutralBackground1,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    position: "relative",
    width: "100%",

    "@media (max-width: 768px)": {
      display: "none",
    },
  },

  leftNavigationDesktop: {
    display: "flex",
    flexShrink: 0,
    width: "44px",
    minWidth: "44px",
    maxWidth: "44px",

    "@media (max-width: 768px)": {
      display: "none",
    },
  },

  leftNavigationDesktopHidden: {
    width: 0,
    minWidth: 0,
    maxWidth: 0,
    overflow: "hidden",
  },

  settingsPanel: {
    flex: 1,
    minWidth: "var(--content-min-width)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    zIndex: "var(--z-index-content)",

    "@media (max-width: 768px)": {
      flex: 1,
      minWidth: 0,
      width: "100%",
      zIndex: "var(--z-index-navigation-secondary)",
      position: "relative",
      order: 2,
    },
  },
});

/**
 * Dialog styles for the Stop Recording confirmation dialog.
 */
export const useDialogStyles = makeStyles({
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
});

export type MainContentStyles = ReturnType<typeof useMainContentStyles>;
export type DialogStyles = ReturnType<typeof useDialogStyles>;
