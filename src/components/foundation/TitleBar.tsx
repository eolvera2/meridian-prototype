import React from "react";
import {
  Text,
  Button,
  SplitButton,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  Subtract24Regular as MinimizeIcon,
  Square24Regular as MaximizeIcon,
  Dismiss24Regular as CloseIcon,
  LayoutColumnOneThirdRightRegular as LayoutOneThirdIcon,
  LayoutColumnFourRegular as LayoutStackedIcon,
  LayoutRowFourRegular as LayoutWideIcon,
  ChevronDown16Regular,
} from "@fluentui/react-icons";
import logoSvg from "../../assets/logo.svg";
import { useI18n } from "../../i18n/I18nContext";

type LayoutOption = "twoColumn" | "stacked" | "wide";

interface TitleBarProps {
  title?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  onLayoutOptionSelect?: (option: LayoutOption) => void;
}

const useStyles = makeStyles({
  titleBar: {
    gridArea: "titlebar",
    height: "var(--title-bar-height)",
    backgroundColor: tokens.colorNeutralBackground4,
    border: `1px solid ${tokens.colorNeutralStrokeAlpha}`,
    display: "flex",
    alignItems: "center",
    padding: `0 ${tokens.spacingHorizontalSNudge}`,
    userSelect: "none",
    WebkitAppRegion: "drag",
    width: "100%", // Take full width
    // Increase z-index so TitleBar renders above all UI layers
    zIndex: "var(--z-index-titlebar)",
    // Remove overflow hidden to allow menu to show
  },
  titleContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  titleLeft: {
    display: "flex",
    alignItems: "center",
    marginLeft: tokens.spacingHorizontalS,
    gap: tokens.spacingHorizontalM,
    // Make interactive controls inside the title area clickable
    // (the parent titleBar uses WebkitAppRegion: 'drag')
    WebkitAppRegion: "no-drag",
  },
  titleActions: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
    WebkitAppRegion: "no-drag", // Make window controls clickable
    // Remove positioning and overflow constraints
  },
  icon: {
    color: tokens.colorNeutralForeground2,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
  },
  layoutMenuWrapper: {
    display: "flex",
    alignItems: "stretch",
    WebkitAppRegion: "no-drag",
  },
  layoutSplitButton: {
    padding: 0,
    minWidth: "auto",
    height: "var(--button-size-standard)",
    backgroundColor: "transparent",
  },
});

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  onMinimize,
  onMaximize,
  onClose,
  onLayoutOptionSelect,
}) => {
  const styles = useStyles();
  const { t } = useI18n();
  const resolvedTitle = title ?? t("app.title");
  const layoutOptions = React.useMemo(
    () => [
      {
        key: "twoColumn" as const,
        label: t("titleBar.layout.splitColumns"),
        Icon: LayoutOneThirdIcon,
      },
      {
        key: "stacked" as const,
        label: t("titleBar.layout.stackedViews"),
        Icon: LayoutStackedIcon,
      },
      {
        key: "wide" as const,
        label: t("titleBar.layout.wideCanvas"),
        Icon: LayoutWideIcon,
      },
    ],
    [t]
  );

  const handleLayoutSelect = (option: LayoutOption) => {
    onLayoutOptionSelect?.(option);
  };

  return (
    <div className={styles.titleBar}>
      <div className={styles.titleContent}>
        <div className={styles.titleLeft}>
          <img
            src={logoSvg}
            alt={t("common.logoAlt")}
            className={styles.logo}
          />
          <Text weight="semibold">{resolvedTitle}</Text>
        </div>
        <div className={styles.titleActions}>
          <div className={styles.layoutMenuWrapper}>
            <Menu positioning="below-end">
              <MenuTrigger disableButtonEnhancement>
                <SplitButton
                  appearance="subtle"
                  className={styles.layoutSplitButton}
                  icon={<LayoutOneThirdIcon className={styles.icon} />}
                  primaryActionButton={{
                    "aria-label": t("titleBar.layout.applyLastSplitLayout"),
                    onClick: () => handleLayoutSelect("twoColumn"),
                  }}
                  menuButton={{
                    "aria-label": t(
                      "titleBar.layout.chooseDifferentWindowLayout"
                    ),
                    icon: <ChevronDown16Regular />,
                  }}
                />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {layoutOptions.map(({ key, label, Icon }) => (
                    <MenuItem
                      key={key}
                      icon={<Icon className={styles.icon} />}
                      onClick={() => handleLayoutSelect(key)}
                    >
                      {label}
                    </MenuItem>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
          <Button
            appearance="subtle"
            icon={<MinimizeIcon className={styles.icon} />}
            onClick={onMinimize}
            aria-label={t("common.minimize")}
          />
          <Button
            appearance="subtle"
            icon={<MaximizeIcon className={styles.icon} />}
            onClick={onMaximize}
            aria-label={t("common.maximize")}
          />
          <Button
            appearance="subtle"
            icon={<CloseIcon className={styles.icon} />}
            onClick={onClose}
            aria-label={t("common.close")}
          />
        </div>
      </div>
    </div>
  );
};
