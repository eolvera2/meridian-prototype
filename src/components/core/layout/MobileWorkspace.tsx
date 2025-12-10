import React, { useRef, useState, useEffect } from "react";
import {
  MicrophoneInterface,
  Worklist,
  DocumentComponent,
  SettingsPanel,
} from "../../content";
import { Header } from "../Header";
import { LeftNavigation } from "../../foundation";
import { RightDrawer } from "../../foundation/RightDrawer";
import type { HeaderProps } from "../Header";
import type { MainContentStyles } from "../MainContent.styles";
import type { RightDrawerContent } from "../../shared";
import type {
  WorklistActions,
  LeftNavigationHandlers,
  DocumentHandlers,
} from "./types";

interface MobileWorkspaceProps {
  styles: MainContentStyles;
  navCollapsed: boolean;
  leftNavHandlers: LeftNavigationHandlers;
  homeToggleActive: boolean;
  activeNavItem?: "home" | "avatar" | "settings" | "help" | null;
  worklistCollapsed: boolean;
  worklistDrawerVisible: boolean;
  usingDrawerLayout: boolean;
  selectedPatient: HeaderProps["patient"];
  headerProps: HeaderProps;
  rightDrawerVisible: boolean;
  rightDrawerContent: RightDrawerContent;
  onCloseRightDrawer: () => void;
  onLibraryPromptClick?: (prompt: string) => void;
  handleWorklistActions: WorklistActions;
  microphoneProps: React.ComponentProps<typeof MicrophoneInterface>;
  documentHandlers: DocumentHandlers;
  micMode: "dictation" | "ambient";
  onMicModeToggle?: () => void;
  settingsSubPage?: string | null;
  onSettingsSubPageChange?: (page: string | null) => void;
}

export const MobileWorkspace: React.FC<MobileWorkspaceProps> = ({
  styles,
  navCollapsed,
  leftNavHandlers,
  homeToggleActive,
  activeNavItem,
  worklistCollapsed,
  worklistDrawerVisible,
  usingDrawerLayout,
  selectedPatient,
  headerProps,
  rightDrawerVisible,
  rightDrawerContent,
  onCloseRightDrawer,
  onLibraryPromptClick,
  handleWorklistActions,
  microphoneProps,
  documentHandlers,
  micMode,
  onMicModeToggle,
  settingsSubPage,
  onSettingsSubPageChange,
}) => {
  // Ref to measure header height dynamically
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number | undefined>(
    undefined
  );

  // Measure header height when patient changes or drawer layout changes
  useEffect(() => {
    const measureHeader = () => {
      if (headerRef.current) {
        const height = headerRef.current.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
    };

    // Measure immediately
    measureHeader();

    // Also measure after a short delay to account for any layout shifts
    const timeoutId = setTimeout(measureHeader, 100);

    // Set up ResizeObserver to track header size changes
    const resizeObserver = new ResizeObserver(measureHeader);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [selectedPatient, usingDrawerLayout, worklistCollapsed]);

  const leftNavHidden =
    navCollapsed ||
    (worklistCollapsed &&
      !!selectedPatient &&
      !worklistDrawerVisible &&
      rightDrawerContent !== "settings");

  const showSettingsPanel =
    rightDrawerVisible && rightDrawerContent === "settings";
  const showDrawerHeader = Boolean(
    selectedPatient && usingDrawerLayout && worklistCollapsed
  );
  const showStandardHeader = Boolean(
    selectedPatient && worklistCollapsed && !usingDrawerLayout
  );

  const mobileAreaClass = usingDrawerLayout
    ? styles.mobileContentAreaWithDrawer
    : styles.mobileContentArea;
  const mobileNavClass = usingDrawerLayout
    ? styles.mobileLeftNavigationWithDrawer
    : styles.mobileLeftNavigation;
  const mobileContentWrapperClass = usingDrawerLayout
    ? styles.mobileContentWrapperWithDrawer
    : styles.mobileContentWrapper;

  return (
    <>
      <div
        className={mobileAreaClass}
        style={{
          marginTop: usingDrawerLayout ? 0 : undefined,
          flexDirection: usingDrawerLayout ? "column" : "row",
        }}
      >
        {showDrawerHeader && (
          <div ref={headerRef} className={styles.headerContainerWithDrawer}>
            <Header {...headerProps} />
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            minHeight: 0,
            width: "100%",
          }}
        >
          <div
            className={mobileNavClass}
            style={{
              display: leftNavHidden ? "none" : "flex",
            }}
          >
            <LeftNavigation
              open={!leftNavHidden}
              {...leftNavHandlers}
              homeToggleActive={homeToggleActive}
              activeNavItem={activeNavItem}
            />
          </div>

          {showSettingsPanel ? (
            <div className={styles.settingsPanel}>
              <SettingsPanel
                activeSubPage={settingsSubPage}
                onSubPageChange={onSettingsSubPageChange}
              />
            </div>
          ) : (
            <div
              className={`${styles.mobileWorklistContainer} ${
                worklistCollapsed && !worklistDrawerVisible
                  ? styles.mobileWorklistContainerHidden
                  : worklistDrawerVisible
                  ? styles.mobileWorklistContainerSideBySide
                  : usingDrawerLayout
                  ? styles.mobileWorklistContainerWithDrawer
                  : ""
              }`}
            >
              <Worklist
                isCollapsed={worklistCollapsed}
                {...handleWorklistActions}
              />
            </div>
          )}

          {worklistDrawerVisible && rightDrawerContent !== "settings" && (
            <div
              style={{
                width: "calc((100% - 44px) / 2)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                order: 2,
                flexShrink: 0,
              }}
            >
              <RightDrawer
                isOpen={true}
                content={rightDrawerContent}
                onClose={onCloseRightDrawer}
                onLibraryPromptClick={onLibraryPromptClick}
                type="inline"
                isFullWidth={false}
                hasHeader={false}
              />
            </div>
          )}

          <div
            className={mobileContentWrapperClass}
            style={{
              flex: usingDrawerLayout ? "none" : 1,
              display:
                worklistCollapsed && !worklistDrawerVisible ? "flex" : "none",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            {showStandardHeader && (
              <div ref={!showDrawerHeader ? headerRef : undefined}>
                <Header {...headerProps} />
              </div>
            )}
            <div className={styles.mobileContentContainer}>
              <div className={styles.mobileDocumentArea}>
                {selectedPatient && worklistCollapsed && (
                  <DocumentComponent
                    key={selectedPatient.id}
                    micMode={micMode}
                    onMicModeToggle={onMicModeToggle}
                    {...documentHandlers}
                  />
                )}
              </div>
            </div>
          </div>

          {usingDrawerLayout &&
          !worklistDrawerVisible &&
          rightDrawerContent !== "settings" ? (
            <div
              style={{
                width: "50%",
                height: "100%",
                order: 2,
                visibility: rightDrawerVisible ? "visible" : "hidden",
                opacity: rightDrawerVisible ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <RightDrawer
                isOpen={true}
                content={rightDrawerContent}
                onClose={onCloseRightDrawer}
                onLibraryPromptClick={onLibraryPromptClick}
                type="inline"
                isFullWidth={false}
                hasHeader={!!selectedPatient}
                headerHeight={headerHeight}
              />
            </div>
          ) : !worklistDrawerVisible &&
            rightDrawerVisible &&
            rightDrawerContent !== "settings" ? (
            <div
              style={{
                position: "fixed",
                // Only offset by header height when viewing a document (patient selected + worklist collapsed)
                top:
                  selectedPatient && worklistCollapsed && headerHeight
                    ? `calc(var(--title-bar-height, 44px) + ${headerHeight}px)`
                    : "var(--title-bar-height, 44px)",
                right: 0,
                bottom: "72px",
                width: "100%",
                zIndex: 150,
              }}
            >
              <RightDrawer
                isOpen={rightDrawerVisible}
                content={rightDrawerContent}
                onClose={onCloseRightDrawer}
                onLibraryPromptClick={onLibraryPromptClick}
                type="inline"
                isFullWidth={false}
                hasHeader={false}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.microphoneContainer}>
        <MicrophoneInterface {...microphoneProps} />
      </div>
    </>
  );
};
