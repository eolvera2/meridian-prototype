/**
 * AppTask1 Component
 *
 * Task1 variant of the app that navigates to success page when ambient recording stops.
 */

import { useState, useEffect, useRef } from "react";
import logoSvg from "./assets/logo.svg";
import MsftLogo from "./assets/MsftLogo.svg";
import {
  FluentProvider,
  webLightTheme,
  Spinner,
} from "@fluentui/react-components";
import { TitleBar } from "./components";
import { MainContent } from "./components/core/MainContent";
import { TooltipProvider } from "./components/content/tooltip";
import { WorklistProvider } from "./components/content/worklist";
import { navigateToSuccess } from "./utils/navigation";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./App.css";

function AppTask1() {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<
    "home" | "avatar" | "settings" | "help" | null
  >("home");

  // Worklist state for TitleBar integration
  const [worklistCollapsed, setWorklistCollapsed] = useState(false);
  const [patientSelected, setPatientSelected] = useState(false);

  const handleWindowControls = {
    minimize: () => {},
    maximize: () => {},
    close: () => {},
  };

  // Worklist state handlers
  const handleWorklistStateChange = (collapsed: boolean, selected: boolean) => {
    setWorklistCollapsed(collapsed);
    setPatientSelected(selected);

    if (collapsed && selected) {
      setNavCollapsed(true);
    } else if (!collapsed && !selected) {
      setNavCollapsed(false);
    }
  };

  const handleHomeToggle = () => {
    if (worklistCollapsed && patientSelected) {
      setWorklistCollapsed(false);
      setPatientSelected(false);
      setNavCollapsed(false);

      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 50);
    }
  };

  // Handle ambient recording stop - append SUCCESS to the URL
  const handleAmbientRecordingStop = () => {
    navigateToSuccess();
  };

  // Loading overlay state: show for 5s, then fade out
  const [showLoading, setShowLoading] = useState(true);
  const [loadingHidden, setLoadingHidden] = useState(false);
  const loadingTimer = useRef<number | null>(null);

  useEffect(() => {
    loadingTimer.current = window.setTimeout(() => {
      setLoadingHidden(true);
      setTimeout(() => setShowLoading(false), 700);
    }, 5000);

    return () => {
      if (loadingTimer.current) {
        clearTimeout(loadingTimer.current);
      }
    };
  }, []);

  return (
    <FluentProvider theme={webLightTheme}>
      <WorklistProvider>
        <TooltipProvider>
          <div className="app-container">
            {showLoading && (
              <div
                className={`loading-overlay ${loadingHidden ? "hidden" : ""}`}
              >
                <div
                  className="loading-logo"
                  style={{ backgroundImage: `url(${logoSvg})` }}
                  aria-hidden
                />
                <div className="loading-spinner">
                  <Spinner size="tiny" label="Loading ..." />
                </div>
                <div className="loading-bottom">
                  <img className="ms-logo" src={MsftLogo} alt="Microsoft" />
                </div>
              </div>
            )}
            <TitleBar
              title="Dragon Copilot"
              onMinimize={handleWindowControls.minimize}
              onMaximize={handleWindowControls.maximize}
              onClose={handleWindowControls.close}
            />

            <div className="app-body">
              <MainContent
                navCollapsed={navCollapsed}
                worklistCollapsed={worklistCollapsed}
                onWorklistStateChange={handleWorklistStateChange}
                homeToggleActive={worklistCollapsed && patientSelected}
                onHomeToggle={handleHomeToggle}
                activeNavItem={activeNavItem}
                onNavItemChange={setActiveNavItem}
                onAmbientRecordingStop={handleAmbientRecordingStop}
                autoDictationDisableOnDocumentView={true}
              />
            </div>
          </div>
        </TooltipProvider>
      </WorklistProvider>
    </FluentProvider>
  );
}

export default AppTask1;
