import React from "react";
import { mergeClasses } from "@fluentui/react-components";
import {
  MicrophoneInterface,
  Worklist,
  DocumentComponent,
  SettingsPanel,
  FAB,
} from "../../content";
import {
  CareCoordinationWorklist,
  CareCoordinationWorklistProvider,
  CareCoordinationDashboard,
  CareCoordinationPatientDetail,
  useCareCoordinationWorklistContext,
} from "../../content/careCoordinationWorklist";
import { Header } from "../Header";
import type { HeaderProps } from "../Header";
import { RightDrawer } from "../../foundation/RightDrawer";
import { LeftNavigation } from "../../foundation";
import type { MainContentStyles } from "../MainContent.styles";
import type { RightDrawerContent } from "../../shared";
import type {
  WorklistActions,
  LeftNavigationHandlers,
  DocumentHandlers,
} from "./types";

/** Inner component that reads medication adherence context to decide dashboard vs detail */
const CareCoordinationContent: React.FC<{ onPatientSelectedChange: (hasPatient: boolean) => void }> = ({ onPatientSelectedChange }) => {
  const { selectedPatientId } = useCareCoordinationWorklistContext();

  React.useEffect(() => {
    onPatientSelectedChange(!!selectedPatientId);
  }, [selectedPatientId, onPatientSelectedChange]);

  return selectedPatientId ? (
    <CareCoordinationPatientDetail />
  ) : (
    <CareCoordinationDashboard />
  );
};

interface DesktopWorkspaceProps {
  styles: MainContentStyles;
  leftNavHidden: boolean;
  leftNavOpen: boolean;
  leftNavHandlers: LeftNavigationHandlers;
  homeToggleActive: boolean;
  activeNavItem?:
    | "home"
    | "avatar"
    | "settings"
    | "careCoordination"
    | "help"
    | null;
  worklistCollapsed: boolean;
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

const TITLE_BAR_HEIGHT = 44;
const HEADER_FALLBACK_HEIGHT = 88;

export const DesktopWorkspace: React.FC<DesktopWorkspaceProps> = ({
  styles,
  leftNavHidden,
  leftNavOpen,
  leftNavHandlers,
  homeToggleActive,
  activeNavItem,
  worklistCollapsed,
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
  const showSettingsPanel =
    rightDrawerVisible && rightDrawerContent === "settings";
  const headerRef = React.useRef<HTMLDivElement>(null);
  const microphoneRef = React.useRef<HTMLDivElement>(null);
  const [layoutOffsets, setLayoutOffsets] = React.useState({
    header: 0,
    microphone: 0,
    contentArea: 0,
  });
  const contentAreaRef = React.useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [maPatientSelected, setMaPatientSelected] = React.useState(false);
  const handleMaPatientChange = React.useCallback((hasPatient: boolean) => {
    setMaPatientSelected(hasPatient);
  }, []);
  const updateMeasurements = React.useCallback(() => {
    setLayoutOffsets({
      header: headerRef.current?.getBoundingClientRect().height ?? 0,
      microphone: microphoneRef.current?.getBoundingClientRect().height ?? 0,
      contentArea: contentAreaRef.current?.getBoundingClientRect().height ?? 0,
    });
  }, []);

  React.useLayoutEffect(() => {
    updateMeasurements();
  }, [updateMeasurements, worklistCollapsed, selectedPatient]);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleResize = () => {
      setIsDesktop(window.matchMedia("(min-width: 769px)").matches);
      updateMeasurements();
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateMeasurements]);

  const isDocumentView = worklistCollapsed && !!selectedPatient;
  const effectiveHeaderHeight = isDocumentView
    ? layoutOffsets.header || HEADER_FALLBACK_HEIGHT
    : TITLE_BAR_HEIGHT;
  const drawerHeightOffset = effectiveHeaderHeight + layoutOffsets.microphone;
  const shouldConstrainDrawer =
    isDesktop && rightDrawerVisible && rightDrawerContent !== "settings";
  const constrainedHeight =
    isDocumentView && layoutOffsets.contentArea
      ? `${layoutOffsets.contentArea}px`
      : `calc(100vh - ${drawerHeightOffset}px)`;
  const desktopDrawerStyle = shouldConstrainDrawer
    ? {
        height: constrainedHeight,
        maxHeight: constrainedHeight,
      }
    : undefined;

  return (
    <div className={styles.desktopWrapper}>
      <div
        className={mergeClasses(
          styles.leftNavigationDesktop,
          leftNavHidden && styles.leftNavigationDesktopHidden
        )}
      >
        <LeftNavigation
          open={leftNavOpen}
          onSettingsClick={leftNavHandlers.onSettingsClick}
          onCareCoordinationClick={
            leftNavHandlers.onCareCoordinationClick
          }
          onHelpClick={leftNavHandlers.onHelpClick}
          onProfileClick={leftNavHandlers.onProfileClick}
          onHomeToggle={leftNavHandlers.onHomeToggle}
          homeToggleActive={homeToggleActive}
          activeNavItem={activeNavItem}
        />
      </div>

      <div className={styles.desktopMainArea}>
        {showSettingsPanel ? (
          <div className={styles.settingsPanel}>
            <SettingsPanel
              activeSubPage={settingsSubPage}
              onSubPageChange={onSettingsSubPageChange}
            />
          </div>
        ) : (
          <div className={styles.desktopContentArea}>
            {activeNavItem === "careCoordination" ? (
              <CareCoordinationWorklistProvider>
                <div
                  className={`${styles.worklistContainer} ${
                    maPatientSelected ? styles.worklistContainerHidden : ""
                  }`}
                >
                  <CareCoordinationWorklist
                    isCollapsed={maPatientSelected}
                    {...handleWorklistActions}
                  />
                </div>

                <div className={styles.headerAndContentContainer}>
                  <div className={styles.contentContainer} ref={contentAreaRef}>
                    <div
                      className={mergeClasses(
                        styles.documentArea,
                        "document-scroll-container"
                      )}
                    >
                      <CareCoordinationContent onPatientSelectedChange={handleMaPatientChange} />
                    </div>
                    <div className={styles.drawerArea}>
                      {rightDrawerVisible && rightDrawerContent !== "settings" && (
                        <RightDrawer
                          isOpen={rightDrawerVisible}
                          content={rightDrawerContent}
                          onClose={onCloseRightDrawer}
                          onLibraryPromptClick={onLibraryPromptClick}
                          type="inline"
                          isFullWidth={!selectedPatient}
                          style={desktopDrawerStyle}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CareCoordinationWorklistProvider>
            ) : (
            <><div
              className={`${styles.worklistContainer} ${
                worklistCollapsed ? styles.worklistContainerHidden : ""
              }`}
            >
                <Worklist
                  isCollapsed={worklistCollapsed}
                  {...handleWorklistActions}
                />
            </div>

            <div className={styles.headerAndContentContainer}>
              {worklistCollapsed && (
                <div className={styles.headerContainer} ref={headerRef}>
                  <Header {...headerProps} />
                </div>
              )}

              <div className={styles.contentContainer} ref={contentAreaRef}>
                <div
                  className={mergeClasses(
                    styles.documentArea,
                    "document-scroll-container"
                  )}
                >
                    {worklistCollapsed && selectedPatient && (
                      <DocumentComponent
                        key={selectedPatient.id}
                        micMode={micMode}
                        onMicModeToggle={onMicModeToggle}
                        {...documentHandlers}
                      />
                    )}
                </div>
                <div className={styles.drawerArea}>
                  {rightDrawerVisible && rightDrawerContent !== "settings" && (
                    <RightDrawer
                      isOpen={rightDrawerVisible}
                      content={rightDrawerContent}
                      onClose={onCloseRightDrawer}
                      onLibraryPromptClick={onLibraryPromptClick}
                      type="inline"
                      isFullWidth={!selectedPatient}
                      style={desktopDrawerStyle}
                    />
                  )}
                </div>
              </div>
            </div>
            </>
            )}
          </div>
        )}

        <FAB
          scrollTargetSelector=".right-drawer-scroll-container, .document-scroll-container"
          visible={
            !!selectedPatient && worklistCollapsed && !rightDrawerVisible
          }
        />

        <div className={styles.desktopMicrophoneContainer} ref={microphoneRef}>
          <MicrophoneInterface {...microphoneProps} />
        </div>
      </div>
    </div>
  );
};
