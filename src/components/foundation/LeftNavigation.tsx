import React from "react";
import {
  makeStyles,
  tokens,
  NavDrawer,
  NavDrawerBody,
  mergeClasses,
  Tooltip,
} from "@fluentui/react-components";
import {
  Settings20Regular,
  Settings20Filled,
  QuestionCircle20Regular,
  QuestionCircle20Filled,
  PeopleCommunication20Regular,
  PeopleCommunication20Filled,
  HomeMoreFilled,
  HomeMoreRegular,
  Person20Regular,
  bundleIcon,
} from "@fluentui/react-icons";
import { useI18n } from "../../i18n/I18nContext";

// Create bundled icons for proper Fluent UI integration
const SettingsIcon = bundleIcon(Settings20Filled, Settings20Regular);
const CareCoordinationIcon = bundleIcon(
  PeopleCommunication20Filled,
  PeopleCommunication20Regular
);
const HelpIcon = bundleIcon(QuestionCircle20Filled, QuestionCircle20Regular);
const HomeIcon = bundleIcon(HomeMoreFilled, HomeMoreRegular);

interface LeftNavigationProps {
  open?: boolean;
  onSettingsClick?: () => void;
  onCareCoordinationClick?: () => void;
  onHelpClick?: () => void;
  onProfileClick?: () => void;
  onHomeToggle?: () => void;
  homeToggleActive?: boolean;
  activeNavItem?:
    | "home"
    | "avatar"
    | "settings"
    | "careCoordination"
    | "help"
    | null;
}

const useStyles = makeStyles({
  leftNavigation: {
    width: "44px", // Match original narrow width
    height: "100%",
    backgroundColor: tokens.colorNeutralBackground4,
    borderRight: "none",
    zIndex: "var(--z-index-left-nav)",
    flexShrink: 0,
    transition: "width 0.3s cubic-bezier(0.1,0.9,0.2,1), opacity 0.3s ease",

    "@media (max-width: 768px)": {
      zIndex: "var(--z-index-content)",
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
      // paddingTop: "var(--spacing-large)",
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
    gap: "var(--gap-xlarge)",
  },

  navCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: "var(--gap-xlarge)",
    marginTop: 0,
  },

  navBottom: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: "var(--gap-xlarge)",
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
    transition: "var(--transition-fluent)",
    color: tokens.colorNeutralForeground1,
    position: "relative",

    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1,
    },

    "& svg": {
      fontSize: "24px",
    },

    "& img": {
      width: "var(--icon-size-standard)",
      height: "var(--icon-size-standard)",
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
    borderRadius: "var(--border-radius-small)",
    backgroundColor: tokens.colorBrandBackground,
    transition: "top 0.3s cubic-bezier(0.1,0.9,0.2,1), opacity 0.2s ease",
    pointerEvents: "none",
    zIndex: "var(--z-index-navigation)",
  },

  avatarContainer: {
    width: "44px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "var(--transition-fluent)",
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
    gap: "var(--gap-xlarge)",
    position: "relative",
    // paddingTop: "10px",
  },
});

export const LeftNavigation: React.FC<LeftNavigationProps> = ({
  open = true,
  onSettingsClick,
  onCareCoordinationClick,
  onHelpClick,
  onProfileClick,
  onHomeToggle,
  homeToggleActive = true,
  activeNavItem = "home",
}) => {
  const styles = useStyles();
  const { t } = useI18n();

  // Calculate pill position based on active nav item
  // Positions: home=6px, avatar=60px, settings=96px, careCoordination=142px, help=188px
  const getPillPosition = () => {
    switch (activeNavItem) {
      case "home":
        return "6px";
      case "avatar":
        return "60px";
      case "settings":
        return "96px";
      case "careCoordination":
        return "142px";
      case "help":
        return "188px";
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
            <Tooltip
              content={t("leftNav.tooltip.home")}
              relationship="label"
              positioning={"after"}
            >
              <span className="inline-flex">
                <button
                  type="button"
                  className={mergeClasses(
                    styles.navButton,
                    styles.homeButton,
                    activeNavItem === "home" && styles.selectedNavButton
                  )}
                  onClick={onHomeToggle}
                  aria-label={t("leftNav.aria.returnToSchedule")}
                  aria-pressed={homeToggleActive}
                >
                  <HomeIcon />
                </button>
              </span>
            </Tooltip>

            <Tooltip
              content={t("leftNav.tooltip.account")}
              relationship="label"
              positioning={"after"}
            >
              <span className="inline-flex">
                <button
                  type="button"
                  className={mergeClasses(
                    styles.navButton,
                    activeNavItem === "avatar" && styles.selectedNavButton
                  )}
                  onClick={onProfileClick}
                  aria-label={t("leftNav.aria.profile")}
                  disabled
                  style={{ opacity: 0.4, cursor: "not-allowed" }}
                >
                  <Person20Regular />
                </button>
              </span>
            </Tooltip>

            <Tooltip
              content={t("leftNav.tooltip.settings")}
              relationship="label"
              positioning={"after"}
            >
              <span className="inline-flex">
                <button
                  className={mergeClasses(
                    styles.navButton,
                    activeNavItem === "settings" && styles.selectedNavButton
                  )}
                  onClick={onSettingsClick}
                  aria-label={t("leftNav.aria.openSettings")}
                >
                  <SettingsIcon />
                </button>
              </span>
            </Tooltip>

            <Tooltip
              content={t("leftNav.tooltip.careCoordination")}
              relationship="label"
              positioning={"after"}
            >
              <span className="inline-flex">
                <button
                  className={mergeClasses(
                    styles.navButton,
                    activeNavItem === "careCoordination" &&
                      styles.selectedNavButton
                  )}
                  onClick={onCareCoordinationClick}
                  aria-label={t("leftNav.aria.openCareCoordination")}
                >
                  <CareCoordinationIcon />
                </button>
              </span>
            </Tooltip>

            <Tooltip
              content={t("leftNav.tooltip.help")}
              relationship="label"
              positioning={"after"}
            >
              <span className="inline-flex">
                <button
                  className={mergeClasses(
                    styles.navButton,
                    activeNavItem === "help" && styles.selectedNavButton
                  )}
                  onClick={onHelpClick}
                  aria-label={t("leftNav.aria.getHelp")}
                  disabled
                  style={{ opacity: 0.4, cursor: "not-allowed" }}
                >
                  <HelpIcon />
                </button>
              </span>
            </Tooltip>
          </div>
        </div>
      </NavDrawerBody>
    </NavDrawer>
  );
};
