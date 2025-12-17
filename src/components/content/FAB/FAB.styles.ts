/**
 * FAB (Floating Action Button) Styles
 *
 * Styles for the floating scroll button component.
 */

import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  fabContainer: {
    position: "fixed",
    bottom: "calc(72px + 20px)", // 72px mic interface height + 20px spacing
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 199, // Below mic interface (200) but above content
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  fabButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: `0 4px 12px ${tokens.colorNeutralShadowAmbient}, 0 2px 4px ${tokens.colorNeutralShadowKey}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    padding: 0,

    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      boxShadow: `0 6px 16px ${tokens.colorNeutralShadowAmbient}, 0 4px 8px ${tokens.colorNeutralShadowKey}`,
      transform: "scale(1.05)",
    },

    "&:active": {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
      transform: "scale(0.95)",
    },

    "&:focus-visible": {
      outline: `2px solid ${tokens.colorBrandStroke1}`,
      outlineOffset: "2px",
    },
  },

  fabIcon: {
    fontSize: "20px",
    color: tokens.colorNeutralForeground1,
  },

  // Badge indicator for scroll position
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: "10px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Hidden state when not needed
  hidden: {
    opacity: 0,
    pointerEvents: "none",
    transform: "translateX(-50%) translateY(10px)",
  },

  // Visible state with animation
  visible: {
    opacity: 1,
    pointerEvents: "auto",
    transform: "translateX(-50%) translateY(0)",
    transition: "opacity 0.2s ease, transform 0.2s ease",
  },
});
