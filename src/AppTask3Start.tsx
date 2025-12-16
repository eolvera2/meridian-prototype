/**
 * AppTask3Start Component
 *
 * Task3 variant of the app that:
 * - Starts with Ellis Turner's document view already open
 * - Starts in Dictation mode (checkbox checked)
 * - Navigates to success page when user switches to Ambient mode
 *   (either by unchecking the Dictation checkbox or using the Tooltip)
 */

import { useState, useMemo } from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { TitleBar } from "./components";
import { MainContent } from "./components/core/MainContent";
import { TooltipProvider } from "./components/content/tooltip";
import { WorklistProvider } from "./components/content/worklist";
import { navigateToSuccess } from "./utils/navigation";
import type { DocumentItem } from "./components/content";
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
  const [isSuccess, setIsSuccess] = useState(false); // Track success state for modified timestamp

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
      // User switched to ambient mode - set success state and navigate
      setIsSuccess(true);
      navigateToSuccess();
    }
  };

  // Task 3: Start with task2 success state - documents populated and expanded, dictation on
  // Modified timestamp is added on success (when user switches to ambient mode)
  const initialDocuments: DocumentItem[] = useMemo(
    () => [
      {
        id: "orders-1",
        name: "Orders",
        created: "12:00 PM",
        ...(isSuccess && { modified: "12:05 PM" }),
        type: "orders",
        sections: [
          {
            id: "orders-section",
            title: "Orders",
            content: "",
            checked: false,
            orderItems: [
              {
                id: "1",
                text: "Start spironolactone 25 mg daily.",
                code: "150.33",
              },
              {
                id: "2",
                text: "Continue metoprolol succinate 50 mg daily.",
              },
              {
                id: "3",
                text: "Increase lisinopril to 20 mg daily.",
              },
              {
                id: "4",
                text: "Order echocardiogram.",
                code: "93306",
              },
              {
                id: "5",
                text: "Schedule follow-up in 2 weeks.",
              },
            ],
          },
        ],
        isExpanded: true,
      },
      {
        id: "1",
        name: "Note",
        created: "12:00 PM",
        ...(isSuccess && { modified: "12:05 PM" }),
        type: "progress-note",
        sections: [
          {
            id: "history",
            title: "History of Present Illness",
            content:
              "Mr. Turner is a 41-year-old male presenting to the emergency department with chest pain that began approximately 2 hours ago. He describes the pain as substernal, pressure-like, radiating to his left arm and jaw. The pain is moderate to severe in intensity (7/10) and is not relieved by rest. He denies any recent trauma or exertion prior to symptom onset. Associated symptoms include mild shortness of breath and diaphoresis. He denies nausea, vomiting, or palpitations.\n\nPast medical history is significant for hypertension and hyperlipidemia, both managed with medications. He has no known history of coronary artery disease or prior cardiac events. Family history is notable for a father who had a myocardial infarction at age 60. Patient is a former smoker, quit 10 years ago with a 20 pack-year history.",
            checked: false,
          },
          {
            id: "physical",
            title: "Physical Exam",
            content:
              "Vitals: BP 145/92 mmHg, HR 88 bpm, RR 18/min, Temp 98.4°F, SpO2 97% on room air\nGeneral: Alert and oriented, appears uncomfortable but in no acute distress\nHEENT: Normocephalic, atraumatic, pupils equal and reactive to light\nNeck: No jugular venous distension, no carotid bruits\nCardiovascular: Regular rate and rhythm, no murmurs, rubs, or gallops, S1 and S2 normal\nLungs: Clear to auscultation bilaterally, no wheezes, rales, or rhonchi\nAbdomen: Soft, non-tender, non-distended, normal bowel sounds\nExtremities: No edema, pulses 2+ and equal bilaterally\nNeurological: Cranial nerves II-XII intact, strength 5/5 in all extremities",
            checked: false,
          },
          {
            id: "results",
            title: "Results",
            content:
              "EKG: Normal sinus rhythm at 85 bpm. ST-segment elevations in leads II, III, and aVF consistent with inferior wall MI. No Q waves present.\n\nTroponin I: 2.3 ng/mL (elevated, normal <0.04 ng/mL)\nCK-MB: 45 U/L (elevated)\nBMP: Na 138, K 4.2, Cl 102, CO2 24, BUN 18, Cr 1.0, Glucose 110\nCBC: WBC 11.2, Hgb 14.5, Hct 43%, Platelets 245,000\n\nChest X-ray: No acute cardiopulmonary process, normal cardiac silhouette",
            checked: false,
          },
          {
            id: "assessment",
            title: "Assessment & Plan",
            content:
              "41-year-old male with acute ST-elevation myocardial infarction (STEMI) - inferior wall\n\nPlan:\n1. Cardiology consultation for urgent cardiac catheterization\n2. Administer aspirin 325 mg, loading dose of clopidogrel 600 mg\n3. Start heparin drip per protocol\n4. Beta-blocker therapy (metoprolol) once hemodynamically stable\n5. Statin therapy (atorvastatin 80 mg)\n6. Admit to CCU for continuous cardiac monitoring\n7. Serial troponins and EKGs\n8. Patient and family education regarding cardiac event and lifestyle modifications",
            checked: false,
          },
        ],
        references: [
          {
            id: "1",
            title: "Transcript",
            type: "transcript",
          },
        ],
        isExpanded: false,
      },
    ],
    [isSuccess]
  );

  const initialExpandedDocuments = useMemo(() => new Set(["orders-1"]), []);

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
                initialDictationState="on" // Start with mic "on"
                onDictationModeChange={handleDictationModeChange}
                initialDocuments={initialDocuments}
                initialExpandedDocuments={initialExpandedDocuments}
                keepMicOnWhenUnchecking={true}
              />
            </div>
          </div>
        </TooltipProvider>
      </WorklistProvider>
    </FluentProvider>
  );
}

export default AppTask3Start;
