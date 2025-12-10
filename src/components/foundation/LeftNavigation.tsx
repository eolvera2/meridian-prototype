import React from "react";
import {
  makeStyles,
  tokens,
  Avatar,
  NavDrawer,
  NavDrawerBody,
  mergeClasses,
} from "@fluentui/react-components";
import {
  Settings20Regular,
  Settings20Filled,
  QuestionCircle20Regular,
  QuestionCircle20Filled,
  HomeMoreFilled,
  HomeMoreRegular,
  bundleIcon,
} from "@fluentui/react-icons";

// Create bundled icons for proper Fluent UI integration
const SettingsIcon = bundleIcon(Settings20Filled, Settings20Regular);
const HelpIcon = bundleIcon(QuestionCircle20Filled, QuestionCircle20Regular);
const HomeIcon = bundleIcon(HomeMoreFilled, HomeMoreRegular);

interface LeftNavigationProps {
  open?: boolean;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onProfileClick?: () => void;
  onHomeToggle?: () => void;
  homeToggleActive?: boolean;
  activeNavItem?: "home" | "avatar" | "settings" | "help" | null;
}

const useStyles = makeStyles({
  leftNavigation: {
    width: "44px", // Match original narrow width
    height: "100%",
    backgroundColor: tokens.colorNeutralBackground4,
    borderRight: "none",
    zIndex: 1150,
    flexShrink: 0,
    transition: "width 0.3s cubic-bezier(0.1,0.9,0.2,1), opacity 0.3s ease",

    "@media (max-width: 768px)": {
      zIndex: 5,
      position: "relative",
    },

    // Override NavDrawer default styles to match original design
    "& .fui-NavDrawer": {
      width: "44px !important",
      backgroundColor: tokens.colorNeutralBackground4,
      border: "none",
    },

    "& .fui-NavDrawerHeader": {
      display: "none", // Hide the header completely to match original
    },

    "& .fui-NavDrawerBody": {
      backgroundColor: tokens.colorNeutralBackground4,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      // paddingTop: "8px",
      // paddingBottom: "12px",
    },
  },

  // Hidden state to match original collapsed behavior
  collapsed: {
    width: "0px",
    opacity: 0,
    borderRight: "none",

    "@media (max-width: 768px)": {
      width: "0px",
      opacity: 0,
      borderRight: "none",
    },
  },

  navTop: {
    marginTop: "0px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: "10px",
  },

  navCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: "10px",
    marginTop: 0,
  },

  navBottom: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: "10px",
    marginTop: 0,
  },

  // Custom styles for icon-only navigation items to match original
  navButton: {
    width: "44px",
    height: "35px",
    minWidth: "44px",
    minHeight: "35px",
    padding: 0,
    borderRadius: 0,
    backgroundColor: tokens.colorNeutralBackground4,
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.1,0.9,0.2,1)",
    color: tokens.colorNeutralForeground1,
    position: "relative",

    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1,
    },

    "& svg": {
      fontSize: "24px",
    },

    "& img": {
      width: "24px",
      height: "24px",
      objectFit: "contain",
    },
  },

  homeButton: {
    padding: 0,
    "& svg": {
      fontSize: "24px",
      color: tokens.colorNeutralForeground1,
    },
  },

  selectedNavButton: {
    backgroundColor: tokens.colorNeutralBackground1,
  },

  selectionPill: {
    position: "absolute",
    left: "3px",
    width: "4px",
    height: "21px",
    borderRadius: "2px",
    backgroundColor: tokens.colorBrandBackground,
    transition: "top 0.3s cubic-bezier(0.1,0.9,0.2,1), opacity 0.2s ease",
    pointerEvents: "none",
    zIndex: 10,
  },

  avatarContainer: {
    width: "44px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.1,0.9,0.2,1)",
    backgroundColor: tokens.colorNeutralBackground4,

    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1,
    },
  },

  navWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    width: "100%",
    gap: "10px",
    position: "relative",
    // paddingTop: "10px",
  },
});

export const LeftNavigation: React.FC<LeftNavigationProps> = ({
  open = true,
  onSettingsClick,
  onHelpClick,
  onProfileClick,
  onHomeToggle,
  homeToggleActive = true,
  activeNavItem = "home",
}) => {
  const styles = useStyles();

  // Calculate pill position based on active nav item
  // Positions: home=6px, avatar=60px (44+10+6), settings=114px (44+10+44+10+6), help=168px (44+10+44+10+44+10+6)
  const getPillPosition = () => {
    switch (activeNavItem) {
      case "home":
        return "6px";
      case "avatar":
        return "60px";
      case "settings":
        return "96px";
      case "help":
        return "142px";
      default:
        return "-50px"; // Hidden
    }
  };

  // If not open, render collapsed state exactly like original
  if (!open) {
    return <div className={styles.collapsed} />;
  }

  return (
    <NavDrawer open={open} type="inline" className={styles.leftNavigation}>
      <NavDrawerBody>
        <div className={styles.navWrapper}>
          {/* Shared selection pill - hide when avatar is selected */}
          {activeNavItem && activeNavItem !== "avatar" && (
            <span
              className={styles.selectionPill}
              style={{ top: getPillPosition() }}
              aria-hidden="true"
            />
          )}

          {/* Primary navigation */}
          <div className={styles.navTop}>
            <button
              type="button"
              className={mergeClasses(
                styles.navButton,
                styles.homeButton,
                activeNavItem === "home" && styles.selectedNavButton
              )}
              onClick={onHomeToggle}
              aria-label="Return to schedule"
              aria-pressed={homeToggleActive}
            >
              <HomeIcon />
            </button>
            <div
              className={mergeClasses(
                styles.avatarContainer,
                activeNavItem === "avatar" && styles.selectedNavButton
              )}
              onClick={onProfileClick}
            >
              <Avatar name="Dr Jane Mason" size={28} />
            </div>
            <button
              className={mergeClasses(
                styles.navButton,
                activeNavItem === "settings" && styles.selectedNavButton
              )}
              onClick={onSettingsClick}
              aria-label="Open settings"
            >
              <SettingsIcon />
            </button>
            <button
              className={mergeClasses(
                styles.navButton,
                activeNavItem === "help" && styles.selectedNavButton
              )}
              onClick={onHelpClick}
              aria-label="Get help"
              disabled
              style={{ opacity: 0.4, cursor: "not-allowed" }}
            >
              <HelpIcon />
            </button>
          </div>
        </div>
      </NavDrawerBody>
    </NavDrawer>
  );
};
