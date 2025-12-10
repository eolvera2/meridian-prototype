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
    zIndex: 1100,
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
    gap: "8px",
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
    height: "32px",
    backgroundColor: "transparent",
  },
});

export const TitleBar: React.FC<TitleBarProps> = ({
  title = "Dragon Copilot",
  onMinimize,
  onMaximize,
  onClose,
  onLayoutOptionSelect,
}) => {
  const styles = useStyles();
  const layoutOptions = React.useMemo(
    () => [
      {
        key: "twoColumn" as const,
        label: "Split columns",
        Icon: LayoutOneThirdIcon,
      },
      {
        key: "stacked" as const,
        label: "Stacked views",
        Icon: LayoutStackedIcon,
      },
      {
        key: "wide" as const,
        label: "Wide canvas",
        Icon: LayoutWideIcon,
      },
    ],
    []
  );

  const handleLayoutSelect = (option: LayoutOption) => {
    onLayoutOptionSelect?.(option);
  };

  return (
    <div className={styles.titleBar}>
      <div className={styles.titleContent}>
        <div className={styles.titleLeft}>
          <img src={logoSvg} alt="Logo" className={styles.logo} />
          <Text weight="semibold">{title}</Text>
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
                    "aria-label": "Apply last split layout",
                    onClick: () => handleLayoutSelect("twoColumn"),
                  }}
                  menuButton={{
                    "aria-label": "Choose different window layout",
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
            aria-label="Minimize"
          />
          <Button
            appearance="subtle"
            icon={<MaximizeIcon className={styles.icon} />}
            onClick={onMaximize}
            aria-label="Maximize"
          />
          <Button
            appearance="subtle"
            icon={<CloseIcon className={styles.icon} />}
            onClick={onClose}
            aria-label="Close"
          />
        </div>
      </div>
    </div>
  );
};
