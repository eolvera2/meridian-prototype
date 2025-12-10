import React from "react";
import {
  Button,
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

const useCustomHeaderStyles = makeStyles({
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontWeight: 600,
    fontSize: tokens.fontSizeBase400,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  generalChatButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
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
    height: "24px",
    backgroundColor: tokens.colorNeutralStroke2,
    marginLeft: "4px",
  },
  iconButton: {
    minWidth: "32px",
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
        return "Copilot";
      case "notifications":
        return "Notifications";
      case "memos":
        return "Memos";
      case "transcription":
        return "Transcript";
      case "extensions":
        return "Extensions";
      case "library":
        return "Library";
      case "settings":
        return "Settings";
      default:
        return "Panel";
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
        return <PlaceholderPanel message="Extensions content coming soon..." />;
      case "library":
        return <LibraryPanel onPromptClick={onLibraryPromptClick} />;
      case "settings":
        return <Settings onClose={onClose} />;
      default:
        return <PlaceholderPanel message="Select a tool to view content" />;
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
                  <span>General chat</span>
                </button>
                <div className={headerStyles.divider} />
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={onClose}
                />
              </div>
            }
          >
            <span className={headerStyles.title}>Copilot</span>
          </DrawerHeaderTitle>
        ) : content === "memos" ? (
          <DrawerHeaderTitle
            action={
              <div className={headerStyles.rightSection}>
                <Button
                  appearance="subtle"
                  aria-label="Search"
                  icon={<Search20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label="Filter"
                  icon={<Filter20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label="Divider"
                  disabled={true}
                  icon={<DividerTall20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={onClose}
                />
              </div>
            }
          >
            <span className={headerStyles.title}>Memos</span>
          </DrawerHeaderTitle>
        ) : content === "transcription" ? (
          <DrawerHeaderTitle
            action={
              <div className={headerStyles.rightSection}>
                <Button
                  appearance="subtle"
                  aria-label="Search"
                  icon={<Search20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label="Filter"
                  icon={<Filter20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label="Divider"
                  disabled={true}
                  icon={<DividerTall20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={onClose}
                />
              </div>
            }
          >
            <span className={headerStyles.title}>Transcript</span>
          </DrawerHeaderTitle>
        ) : content === "notifications" ? (
          <DrawerHeaderTitle
            action={
              <div className={headerStyles.rightSection}>
                <Button
                  appearance="subtle"
                  aria-label="Search"
                  icon={<Search20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label="Filter"
                  icon={<Filter20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label="Divider"
                  disabled={true}
                  icon={<DividerTall20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={onClose}
                />
              </div>
            }
          >
            <span className={headerStyles.title}>Notifications</span>
          </DrawerHeaderTitle>
        ) : content === "library" ? (
          <DrawerHeaderTitle
            action={
              <div className={headerStyles.rightSection}>
                <Button
                  appearance="subtle"
                  aria-label="Search"
                  icon={<Search20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label="Filter"
                  icon={<Filter20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label="Divider"
                  disabled={true}
                  icon={<DividerTall20Regular />}
                />
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={onClose}
                />
              </div>
            }
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <span className={headerStyles.title}>Library</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  appearance="outline"
                  icon={<AddRegular />}
                  size="small"
                  style={{
                    flex: "1 1 auto",
                    minWidth: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Create prompt
                </Button>
                <Button
                  appearance="outline"
                  icon={<OpenRegular />}
                  size="small"
                  style={{
                    flex: "1 1 auto",
                    minWidth: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Manage library
                </Button>
              </div>
            </div>
          </DrawerHeaderTitle>
        ) : (
          <DrawerHeaderTitle
            action={
              content !== "settings" ? (
                <Button
                  appearance="subtle"
                  aria-label="Close"
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

      <DrawerBody>{renderContent()}</DrawerBody>
    </Drawer>
  );
};
