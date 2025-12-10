import { makeStyles, tokens } from "@fluentui/react-components";

export const useRightDrawerStyles = makeStyles({
  drawerBase: {
    "& .fui-DrawerBody": {
      backgroundColor: tokens.colorNeutralBackground2,
      padding: 0,
    },
    "& .fui-DrawerHeader": {
      backgroundColor: tokens.colorNeutralBackground2,
      padding: "8px 16px",
    },
    "& .fui-Drawer": {
      backgroundColor: tokens.colorNeutralBackground2,
      borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
      boxShadow: "none !important",
    },
    // Additional high-specificity selectors to remove all shadows
    "& > .fui-Drawer": {
      boxShadow: "none !important",
    },
    "&&& .fui-Drawer": {
      boxShadow: "none !important",
    },
    boxShadow: "none !important",

    // Force relative positioning for desktop inline mode
    "@media (min-width: 769px)": {
      "& .fui-Drawer": {
        position: "relative",
        insetBlockStart: "auto",
        insetInlineEnd: "auto",
        insetBlockEnd: "auto",
        insetInlineStart: "auto",
      },
      "&&& .fui-Drawer": {
        position: "relative",
      },
    },
  },

  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0,
    minHeight: "48px",

    "@media (max-width: 768px) and (min-width: 481px)": {
      padding: "10px 12px",
      minHeight: "44px",
    },

    "@media (max-width: 480px)": {
      padding: "8px 12px",
      minHeight: "40px",
    },
  },

  drawerHeaderTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,

    "@media (max-width: 768px) and (min-width: 481px)": {
      fontSize: "14px",
    },

    "@media (max-width: 480px)": {
      fontSize: "14px",
    },
  },

  drawerBody: {
    flex: 1,
    overflow: "auto",
    backgroundColor: tokens.colorNeutralBackground2,
    minHeight: 0,

    "@media (max-width: 768px) and (min-width: 481px)": {
      flex: 1,
      overflow: "auto",
      height: "100%",
      minHeight: 0,
    },

    "@media (max-width: 480px)": {
      flex: 1,
      overflow: "auto",
      height: "100%",
      minHeight: 0,
    },
  },

  drawer: {
    marginTop: "-8px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    height: "100%",

    "@media (min-width: 769px)": {
      order: "unset",
      width: "350px",
      marginTop: "-8px",
      maxHeight: "100%",
      overflow: "hidden",
      "& .fui-Drawer": {
        position: "relative",
        width: "350px",
        height: "100%",
        maxHeight: "100%",
        transform: "none",
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto",
      },
    },

    "@media (max-width: 768px) and (min-width: 481px)": {
      position: "relative",
      width: "100%",
      height: "100%",
      marginTop: 0,
      "& .fui-Drawer": {
        position: "relative",
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
        transform: "none",
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto",
      },
    },

    "@media (max-width: 480px)": {
      position: "relative",
      width: "100%",
      height: "100%",
      marginTop: 0,
      "& .fui-Drawer": {
        position: "relative",
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        borderLeft: "none",
        transform: "none",
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto",
      },
    },
  },

  drawerWithHeader: {
    marginTop: "-8px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    height: "100%",

    "@media (min-width: 769px)": {
      order: "unset",
      width: "350px",
      marginTop: "-8px",
      maxHeight: "100%",
      overflow: "hidden",
      "& .fui-Drawer": {
        position: "relative",
        width: "350px",
        height: "100%",
        maxHeight: "100%",
        transform: "none",
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto",
      },
    },

    "@media (max-width: 768px) and (min-width: 481px)": {
      position: "relative",
      width: "100%",
      height: "100%",
      marginTop: 0,
      "& .fui-Drawer": {
        position: "relative",
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
        transform: "none",
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto",
      },
    },

    "@media (max-width: 480px)": {
      position: "relative",
      width: "100%",
      height: "100%",
      marginTop: 0,
      "& .fui-Drawer": {
        position: "relative",
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        borderLeft: "none",
        transform: "none",
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto",
      },
    },
  },

  drawerFullWidth: {
    width: "350px",

    "@media (min-width: 769px)": {
      width: "350px",
      "& .fui-Drawer": {
        position: "relative",
        width: "350px",
        height: "100%",
        transform: "none",
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto",
      },
    },

    "@media (max-width: 768px) and (min-width: 481px)": {
      position: "fixed",
      right: 0,
      top: "var(--title-bar-height, 44px)",
      bottom: "72px",
      width: "50%",
      height: "calc(100vh - var(--title-bar-height, 44px) - 72px)",
      zIndex: 150,
      "& .fui-Drawer": {
        position: "fixed",
        right: 0,
        top: "var(--title-bar-height, 44px)",
        bottom: "72px",
        width: "50%",
        height: "calc(100vh - var(--title-bar-height, 44px) - 72px)",
        maxWidth: "50%",
        borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
        transform: "none",
      },
    },

    "@media (max-width: 480px)": {
      position: "fixed",
      top: "var(--title-bar-height, 44px)",
      right: 0,
      bottom: "72px",
      width: "100%",
      height: "calc(100vh - var(--title-bar-height, 44px) - 72px)",
      zIndex: 150,
      "& .fui-Drawer": {
        position: "fixed",
        top: "var(--title-bar-height, 44px)",
        right: 0,
        bottom: "72px",
        width: "100%",
        height: "calc(100vh - var(--title-bar-height, 44px) - 72px)",
        maxWidth: "100%",
        borderLeft: "none",
        transform: "none",
      },
    },
  },

  settingsDrawer: {
    "& .fui-DrawerHeader": {
      height: "64px",
      minHeight: "64px",
      padding: "0 16px 0 24px",
      display: "flex",
      justifyContent: "center",
      boxSizing: "border-box",
    },
    "& .fui-Drawer": {
      width: "100% !important",
      maxWidth: "100% !important",
      height: "100% !important",
      boxSizing: "border-box",
    },
    "& .fui-DrawerBody": {
      width: "100%",
      height: "100%",
      overflow: "auto",
      boxSizing: "border-box",
      padding: 0,
    },
  },
});
