/**
 * AppTask3Start Component
 *
 * Task3 variant of the app that:
 * - Starts with Ellis Turner's document view already open
 * - Starts in Dictation mode (checkbox checked)
 * - Navigates to success page when user switches to Ambient mode
 *   (either by unchecking the Dictation checkbox or using the Tooltip)
 */

import { useState } from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { TitleBar } from "./components";
import { MainContent } from "./components/core/MainContent";
import { TooltipProvider } from "./components/content/tooltip";
import { WorklistProvider } from "./components/content/worklist";
import { navigateToSuccess } from "./utils/navigation";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./App.css";

function AppTask3Start() {
  const [navCollapsed, setNavCollapsed] = useState(true); // Nav collapsed when patient selected
  const [worklistCollapsed, setWorklistCollapsed] = useState(true); // Worklist collapsed when patient selected
  const [patientSelected, setPatientSelected] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState<
    "home" | "avatar" | "settings" | "help" | null
  >("home");

  const handleWindowControls = {
    minimize: () => {},
    maximize: () => {},
    close: () => {},
  };

  // Worklist state handlers - maintain collapsed state by default for task3
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

  // Handle dictation mode change - change URL hash when user switches to ambient mode
  const handleDictationModeChange = (isDictationActive: boolean) => {
    if (!isDictationActive) {
      // User switched to ambient mode - navigate to success
      navigateToSuccess();
    }
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <WorklistProvider>
        <TooltipProvider>
          <div className="app-container">
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
                initialPatientId="3" // Ellis Turner's patient ID
                initialMicMode="dictation" // Start in Dictation mode
                onDictationModeChange={handleDictationModeChange}
              />
            </div>
          </div>
        </TooltipProvider>
      </WorklistProvider>
    </FluentProvider>
  );
}

export default AppTask3Start;
