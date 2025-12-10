/**
 * AppTask7Start Component
 *
 * Task7 variant of the app that:
 * - Starts with Ellis Turner's document view already open
 * - Has the Referral Letter and Orders pre-populated
 * - Has the Note document expanded
 * - Navigates to success page when user completes pronoun replacement via Library
 */

import { useState, useMemo } from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { TitleBar } from "./components";
import { MainContent } from "./components/core/MainContent";
import { TooltipProvider } from "./components/content/tooltip";
import { WorklistProvider } from "./components/content/worklist";
import type { DocumentItem } from "./components/content/document";
import { navigateToSuccess } from "./utils/navigation";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./App.css";

// Referral letter content (same as used in Library flow)
const REFERRAL_LETTER_CONTENT = `Dear Dr. Johnson,

I am writing to refer my patient, Angel Brown, a 45-year-old male, for evaluation and management of their chronic headaches and cardiovascular concerns.

Mr. Brown has a history of diabetes mellitus type 2 and hypertension, both of which are currently managed with oral medications. They have been experiencing frequent headaches over the past several months, which have become increasingly bothersome and are affecting their quality of life.

Recent vital signs:
- Blood pressure: 142/88 mmHg
- Heart rate: 78 bpm
- Temperature: 98.6°F

Current medications:
- Metformin 1000 mg twice daily
- Lisinopril 20 mg daily
- Atorvastatin 40 mg at bedtime

I would appreciate your expert evaluation and recommendations for further management. Please feel free to contact my office if you require any additional information.

Thank you for your assistance in the care of this patient.

Sincerely,
Dr. Smith`;

function AppTask7Start() {
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [worklistCollapsed, setWorklistCollapsed] = useState(true);
  const [patientSelected, setPatientSelected] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState<
    "home" | "avatar" | "settings" | "help" | null
  >("home");

  const handleWindowControls = {
    minimize: () => {},
    maximize: () => {},
    close: () => {},
  };

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

  // Handle pronoun replacement complete - change URL hash
  const handlePronounReplacementComplete = () => {
    navigateToSuccess();
  };

  // Create initial documents with pre-populated Referral Letter
  const initialDocuments: DocumentItem[] = useMemo(() => {
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return [
      // Referral Letter at the top with content
      {
        id: "referral-task7",
        name: "Referral Letter",
        created: today,
        type: "referral-letter",
        sections: [
          {
            id: "referral-content-task7",
            title: "Referral Note",
            content: REFERRAL_LETTER_CONTENT,
            checked: false,
          },
        ],
        isExpanded: false,
      },
      // Orders document
      {
        id: "orders-1",
        name: "Orders",
        created: "11/1 at 1:30 PM",
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
        isExpanded: false,
      },
      // Note document - expanded by default for this task
      {
        id: "1",
        name: "Note",
        created: "--",
        type: "progress-note",
        sections: [
          {
            id: "history",
            title: "History of Present Illness",
            content:
              "Mr. Brown is a 45-year-old male with a history of type 2 diabetes mellitus and hypertension who presents today with complaints of frequent headaches over the past 3 months. He describes the headaches as bilateral, pressure-like, occurring 3-4 times per week, and lasting several hours. He denies visual changes, nausea, or vomiting. He reports stress at work and poor sleep quality. His blood glucose has been well controlled on current medications.",
            checked: false,
          },
          {
            id: "physical",
            title: "Physical Exam",
            content:
              "Vitals: BP 138/88 mmHg, HR 72 bpm, Temp 98.6°F, SpO2 98% on room air\nGeneral: Alert and oriented, no acute distress\nHEENT: Normocephalic, atraumatic, pupils equal and reactive, no papilledema\nNeck: Supple, no lymphadenopathy, no thyromegaly\nCardiovascular: Regular rate and rhythm, no murmurs, rubs, or gallops\nLungs: Clear to auscultation bilaterally\nAbdomen: Soft, non-tender, non-distended\nExtremities: No edema, pulses 2+ bilaterally\nNeurological: Cranial nerves II-XII intact, strength 5/5 throughout",
            checked: false,
          },
          {
            id: "results",
            title: "Results",
            content:
              "Recent Labs (dated 10/15):\n- HbA1c: 6.8% (improved from 7.2%)\n- Fasting glucose: 118 mg/dL\n- BMP: Within normal limits, Cr 0.9\n- Lipid panel: Total cholesterol 195, LDL 110, HDL 52, TG 165\n- CBC: WNL\n\nEKG: Normal sinus rhythm, no ST changes",
            checked: false,
          },
          {
            id: "assessment",
            title: "Assessment & Plan",
            content:
              "1. Tension-type headaches - likely related to stress and poor sleep\n   - Recommend stress management techniques\n   - Trial of OTC acetaminophen or ibuprofen as needed\n   - Sleep hygiene counseling provided\n   - Follow up if headaches worsen or change in character\n\n2. Type 2 Diabetes Mellitus - well controlled\n   - Continue current regimen\n   - HbA1c at goal\n\n3. Hypertension - slightly elevated today\n   - Continue current medications\n   - Dietary counseling on sodium restriction\n   - Recheck BP in 2 weeks",
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
        isExpanded: true,
      },
    ];
  }, []);

  // Expand only Note by default
  const initialExpandedDocuments = useMemo(() => new Set(["1"]), []);

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
                initialMicMode="ambient"
                initialDocuments={initialDocuments}
                initialExpandedDocuments={initialExpandedDocuments}
                onPronounReplacementComplete={handlePronounReplacementComplete}
              />
            </div>
          </div>
        </TooltipProvider>
      </WorklistProvider>
    </FluentProvider>
  );
}

export default AppTask7Start;
