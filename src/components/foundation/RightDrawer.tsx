import React from "react";
import {
  Button,
  Tooltip,
  mergeClasses,
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  Dismiss24Regular,
  OpenRegular,
  AddRegular,
  Search20Regular,
  Filter20Regular,
  DividerTall20Regular,
} from "@fluentui/react-icons";
import { Settings } from "../content/settings";
import { CopilotThread } from "../content/CopilotThread";
import { MemosPanel } from "../content/MemosPanel";
import { NotificationsPanel } from "../content/notifications";
import { TranscriptPanel } from "../content/transcript";
import { LibraryPanel } from "../content/LibraryPanel";
import { PlaceholderPanel } from "../shared/PlaceholderPanel";
import { useRightDrawerStyles } from "./RightDrawer.styles";
import "./RightDrawer.css";
import { useI18n } from "../../i18n/I18nContext";

const useCustomHeaderStyles = makeStyles({
  title: {
    fontWeight: 600,
    fontSize: tokens.fontSizeBase400,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-small)",
    flexShrink: 0,
    minWidth: "max-content",
  },
  librarySubHeader: {
    display: "flex",
    gap: "var(--gap-large)",
    paddingTop: "var(--spacing-large)",
  },
  generalChatButton: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-medium)",
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: "transparent",
    border: "none",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  divider: {
    width: "1px",
    height: "var(--icon-size-standard)",
    backgroundColor: tokens.colorNeutralStroke2,
    marginLeft: "4px",
  },
  iconButton: {
    minWidth: "var(--button-size-standard)",
    color: tokens.colorNeutralForeground2,
  },
});

export interface RightDrawerProps {
  isOpen: boolean;
  content:
    | "copilot"
    | "notifications"
    | "memos"
    | "transcription"
    | "extensions"
    | "library"
    | "settings";
  onClose?: () => void;
  onLibraryPromptClick?: (prompt: string) => void;
  type?: "overlay" | "inline";
  isFullWidth?: boolean; // Add back for compatibility
  hasHeader?: boolean; // Whether Header is shown (affects positioning)
  headerHeight?: number; // Dynamic header height in pixels
  style?: React.CSSProperties;
}

export const RightDrawer: React.FC<RightDrawerProps> = ({
  isOpen,
  content,
  onClose,
  onLibraryPromptClick,
  type = "overlay",
  isFullWidth = false,
  hasHeader = false,
  headerHeight,
  style,
}) => {
  const styles = useRightDrawerStyles();
  const headerStyles = useCustomHeaderStyles();
  const { t } = useI18n();
  const overlayProps =
    type === "overlay" ? { modalType: "non-modal" as const } : {};

  // Compute dynamic style with header height CSS variable
  const dynamicStyle: React.CSSProperties = {
    ...style,
    ...(headerHeight !== undefined &&
      ({
        "--dynamic-header-height": `${headerHeight}px`,
      } as React.CSSProperties)),
  };

  const getDrawerTitle = () => {
    switch (content) {
      case "copilot":
        return t("rightDrawer.titles.copilot");
      case "notifications":
        return t("rightDrawer.titles.notifications");
      case "memos":
        return t("rightDrawer.titles.memos");
      case "transcription":
        return t("rightDrawer.titles.transcript");
      case "extensions":
        return t("rightDrawer.titles.extensions");
      case "library":
        return t("rightDrawer.titles.library");
      case "settings":
        return t("rightDrawer.titles.settings");
      default:
        return t("rightDrawer.titles.panel");
    }
  };

  const renderContent = () => {
    switch (content) {
      case "copilot":
        return <CopilotThread />;
      case "notifications":
        return <NotificationsPanel />;
      case "memos":
        return <MemosPanel />;
      case "transcription":
        return <TranscriptPanel />;
      case "extensions":
        return (
          <PlaceholderPanel message={t("rightDrawer.placeholders.extensionsComingSoon")} />
        );
      case "library":
        return <LibraryPanel onPromptClick={onLibraryPromptClick} />;
      case "settings":
        return <Settings onClose={onClose} />;
      default:
        return <PlaceholderPanel message={t("rightDrawer.placeholders.selectTool")} />;
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(_: unknown, { open }: { open: boolean }) =>
        !open && onClose?.()
      }
      position="end"
      type={type}
      {...overlayProps}
      style={dynamicStyle}
      className={mergeClasses(
        styles.drawerBase,
        content === "settings"
          ? styles.settingsDrawer
          : isFullWidth
          ? styles.drawerFullWidth
          : hasHeader
          ? styles.drawerWithHeader
          : styles.drawer
      )}
    >
      <DrawerHeader>
        {content === "copilot" ? (
          <DrawerHeaderTitle
            action={
              <div className={headerStyles.rightSection}>
                <button className={headerStyles.generalChatButton}>
                  <OpenRegular style={{ fontSize: "16px" }} />
                  <span>{t("rightDrawer.actions.generalChat")}</span>
                </button>
                <div className={headerStyles.divider} />
                <Button
                  appearance="subtle"
                  aria-label={t("common.close")}
                  icon={<Dismiss24Regular />}
                  onClick={onClose}
                />
              </div>
            }
          >
            <span className={headerStyles.title}>{t("rightDrawer.titles.copilot")}</span>
          </DrawerHeaderTitle>
        ) : content === "memos" ? (
          <DrawerHeaderTitle
            action={
              <div className={headerStyles.rightSection}>
                <Button
                  appearance="subtle"
                  aria-label={t("common.search")}
                  icon={<Search20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label={t("common.filter")}
                  icon={<Filter20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label={t("common.divider")}
                  disabled={true}
                  icon={<DividerTall20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label={t("common.close")}
                  icon={<Dismiss24Regular />}
                  onClick={onClose}
                />
              </div>
            }
          >
            <span className={headerStyles.title}>{t("rightDrawer.titles.memos")}</span>
          </DrawerHeaderTitle>
        ) : content === "transcription" ? (
          <DrawerHeaderTitle
            action={
              <div className={headerStyles.rightSection}>
                <Tooltip content={t("common.search")} relationship="label">
                  <Button
                    appearance="subtle"
                    aria-label={t("common.search")}
                    icon={<Search20Regular />}
                  />
                </Tooltip>
                <Tooltip content={t("common.filter")} relationship="label">
                  <Button
                    appearance="subtle"
                    aria-label={t("common.filter")}
                    icon={<Filter20Regular />}
                  />
                </Tooltip>
                <Button
                  appearance="subtle"
                  aria-label={t("common.divider")}
                  disabled={true}
                  icon={<DividerTall20Regular />}
                />
                <Tooltip content={t("common.close")} relationship="label">
                  <Button
                    appearance="subtle"
                    aria-label={t("common.close")}
                    icon={<Dismiss24Regular />}
                    onClick={onClose}
                  />
                </Tooltip>
              </div>
            }
          >
            <span className={headerStyles.title}>{t("rightDrawer.titles.transcript")}</span>
          </DrawerHeaderTitle>
        ) : content === "notifications" ? (
          <DrawerHeaderTitle
            action={
              <div className={headerStyles.rightSection}>
                <Button
                  appearance="subtle"
                  aria-label={t("common.search")}
                  icon={<Search20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label={t("common.filter")}
                  icon={<Filter20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label={t("common.divider")}
                  disabled={true}
                  icon={<DividerTall20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label={t("common.close")}
                  icon={<Dismiss24Regular />}
                  onClick={onClose}
                />
              </div>
            }
          >
            <span className={headerStyles.title}>{t("rightDrawer.titles.notifications")}</span>
          </DrawerHeaderTitle>
        ) : content === "library" ? (
          <>
            <DrawerHeaderTitle
              action={
                <div className={headerStyles.rightSection}>
                  <Tooltip content={t("common.search")} relationship="label">
                    <Button
                      appearance="subtle"
                      aria-label={t("common.search")}
                      icon={<Search20Regular />}
                    />
                  </Tooltip>
                  <Tooltip content={t("common.filter")} relationship="label">
                    <Button
                      appearance="subtle"
                      aria-label={t("common.filter")}
                      icon={<Filter20Regular />}
                    />
                  </Tooltip>
                  <Button
                    appearance="subtle"
                    aria-label={t("common.divider")}
                    disabled={true}
                    icon={<DividerTall20Regular />}
                  />
                  <Tooltip content={t("common.close")} relationship="label">
                    <Button
                      appearance="subtle"
                      aria-label={t("common.close")}
                      icon={<Dismiss24Regular />}
                      onClick={onClose}
                    />
                  </Tooltip>
                </div>
              }
            >
              <span className={headerStyles.title}>{t("rightDrawer.titles.library")}</span>
            </DrawerHeaderTitle>

            <div className={headerStyles.librarySubHeader}>
              <Button appearance="outline" icon={<AddRegular />} size="small">
                {t("rightDrawer.actions.createPrompt")}
              </Button>
              <Button appearance="outline" icon={<OpenRegular />} size="small">
                {t("rightDrawer.actions.manageLibrary")}
              </Button>
            </div>
          </>
        ) : (
          <DrawerHeaderTitle
            action={
              content !== "settings" ? (
                <Button
                  appearance="subtle"
                  aria-label={t("common.close")}
                  icon={<Dismiss24Regular />}
                  onClick={onClose}
                />
              ) : null
            }
          >
            {getDrawerTitle()}
          </DrawerHeaderTitle>
        )}
      </DrawerHeader>

      <DrawerBody
        className={mergeClasses(
          styles.drawerBody,
          "right-drawer-scroll-container"
        )}
      >
        {renderContent()}
      </DrawerBody>
    </Drawer>
  );
};
