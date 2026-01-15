/**
 * AppTask1 Component
 *
 * Task1 variant of the app that navigates to success page when ambient recording stops.
 */

import { useState, useEffect, useRef, useMemo } from "react";
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
import { useI18n } from "./i18n/I18nContext";
import { createEnGbProgressNoteSections } from "./utils/enGbNote";
import type { DocumentItem } from "./components/content";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./App.css";

function AppTask1() {
  const { t, locale, medical } = useI18n();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<
    "home" | "avatar" | "settings" | "help" | null
  >("home");

  const initialDocuments: DocumentItem[] | undefined = useMemo(() => {
    if (locale !== "en-GB") {
      return undefined;
    }

    return [
      {
        id: "letter-to-gp-1",
        name: "Letter to GP",
        created: "--",
        type: "letter-to-gp",
        sections: [
          {
            id: "letter-to-gp",
            title: "Letter to GP",
            content: "",
            checked: false,
          },
        ],
        isExpanded: true,
      },
      {
        id: "1",
        name: "Note",
        created: "--",
        type: "progress-note",
        sections: createEnGbProgressNoteSections({ isEmpty: true, medical }),
        references: [
          {
            id: "1",
            title: "Transcript",
            type: "transcript",
          },
        ],
        isExpanded: true,
      },
    ];
  }, [locale, medical]);

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
                onAmbientRecordingStop={handleAmbientRecordingStop}
                autoDictationDisableOnDocumentView={true}
                initialDocuments={initialDocuments}
              />
            </div>
          </div>
        </TooltipProvider>
      </WorklistProvider>
    </FluentProvider>
  );
}

export default AppTask1;
