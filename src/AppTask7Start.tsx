/**
 * AppTask7Start Component
 *
 * Task7 variant of the app that:
 * - Starts with Ellis Turner's document view already open
 * - Starts with task6 state (same as task5 success): Referral Letter, Orders (4 items), and Note
 * - Scrolls to the Note document on load
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

// Referral letter content for Ellis Turner's STEMI case
const REFERRAL_LETTER_CONTENT = `Dear Dr. Taylor,

I am referring my patient, a 41 year old male, for dermatologic evaluation and management of recurrent actinic keratoses on his facial region. He has a prior history of actinic keratoses and was previously scheduled to see Dermatology, but that appointment was cancelled. He specifically requested referral to your care at MGH, based on a recommendation from his father.

During his annual physical examination, multiple actinic keratoses were noted on his face. The remainder of his skin exam was unremarkable. His father has a history of skin cancer requiring treatment and excisions, which further increases the importance of dermatologic surveillance.

Additional relevant clinical information includes:

Past Medical/Surgical History: Lumbar spine injury status post discectomy; history of cerumen impaction; no current medications.

Social History: Works in the finance sector for the state; engages in walking and hiking but no structured exercise regimen; uses highSPF sunscreen when outdoors.

Other Current Concerns: None directly related to dermatologic conditions. No systemic symptoms reported.

Given his dermatologic history and family risk factors, I would appreciate your assessment regarding further management, potential treatment of current lesions, and recommendations for ongoing skin cancer surveillance.

Please let me know if additional information is needed. Thank you in advance for your evaluation and care.`;

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

  // Task 7: Start with task6 state (same as task5 success) - scrolled to Note
  const initialDocuments: DocumentItem[] = useMemo(
    () => [
      // Referral Letter at the top (from task4/task5)
      {
        id: "referral-task7",
        name: "Referral Letter",
        created: "12:20 PM",
        type: "referral-letter",
        sections: [
          {
            id: "referral-content-task7",
            title: "Referral Note",
            content: REFERRAL_LETTER_CONTENT,
            checked: false,
          },
        ],
        isExpanded: true,
      },
      // Orders document (4 items - one deleted in task5)
      {
        id: "orders-1",
        name: "Orders",
        created: "12:00 PM",
        modified: "12:23 PM",
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
            ],
          },
        ],
        isExpanded: false,
      },
      // Note document with Ellis Turner STEMI content
      {
        id: "1",
        name: "Note",
        created: "12:00 PM",
        modified: "12:23 PM",
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
    []
  );

  // Expand only the topmost accordion (referral letter) by default
  const initialExpandedDocuments = useMemo(
    () => new Set(["referral-task7"]),
    []
  );

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
