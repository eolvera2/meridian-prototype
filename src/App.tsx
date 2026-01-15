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
import { useI18n } from "./i18n/I18nContext";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./App.css"; // Make sure App.css is imported

function App() {
  const { t } = useI18n();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<
    "home" | "avatar" | "settings" | "help" | null
  >("home");

  // Worklist state for TitleBar integration
  const [worklistCollapsed, setWorklistCollapsed] = useState(false);
  const [patientSelected, setPatientSelected] = useState(false);

  const handleWindowControls = {
    minimize: () => {
      // Window controls wired - action handled by host
    },
    maximize: () => {
      // Window controls wired - action handled by host
    },
    close: () => {
      // Window controls wired - action handled by host
    },
  };

  // Handle navigation toggle
  // Note: Navigation toggle is now managed within MainContent

  // Worklist state handlers
  const handleWorklistStateChange = (collapsed: boolean, selected: boolean) => {
    setWorklistCollapsed(collapsed);
    setPatientSelected(selected);

    // Also collapse/expand the navigation along with the worklist
    if (collapsed && selected) {
      // When worklist collapses (patient selected), also collapse navigation
      setNavCollapsed(true);
    } else if (!collapsed && !selected) {
      // When worklist expands (navigating home), also expand navigation
      setNavCollapsed(false);
    }
  };

  const handleHomeToggle = () => {
    if (worklistCollapsed && patientSelected) {
      // If worklist is collapsed and patient is selected, show both worklist and navigation
      setWorklistCollapsed(false);
      setPatientSelected(false);
      // Expand navigation when revealing worklist
      setNavCollapsed(false);

      // Give time for the DOM to update before triggering layout calculations
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 50);
    }
  };

  // Loading overlay state: show for 5s, then fade out
  const [showLoading, setShowLoading] = useState(true);
  const [loadingHidden, setLoadingHidden] = useState(false);
  const loadingTimer = useRef<number | null>(null);

  useEffect(() => {
    // Start 5s timer on mount
    loadingTimer.current = window.setTimeout(() => {
      // trigger fade by setting hidden class
      setLoadingHidden(true);
      // after fade duration remove overlay from DOM
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
                  <Spinner size="tiny" label={t("common.loading")} />
                </div>
                <div className="loading-bottom">
                  <img
                    className="ms-logo"
                    src={MsftLogo}
                    alt={t("common.microsoft")}
                  />
                </div>
              </div>
            )}
            <TitleBar
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
              />
            </div>
          </div>
        </TooltipProvider>
      </WorklistProvider>
    </FluentProvider>
  );
}

export default App;
