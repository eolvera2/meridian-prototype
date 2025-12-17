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
            content: `The patient is a 41-year-old who presents for an annual physical exam. He underwent his initial colonoscopy at the age of 35, prompted by a family history of colorectal issues. He acknowledges that he was due for a follow-up procedure in the previous year but failed to schedule it. His last endoscopy was performed in 2018. He has expressed interest in scheduling a colonoscopy at the age of 45.

The patient had previously scheduled a dermatological appointment, which was subsequently cancelled. He has a history of actinic keratoses on his facial region. He has requested a referral to Dr. Charles Taylor at MGH, as recommended by his father.

He reports no significant changes in his auditory or visual acuity, although he occasionally experiences a sensation of blockage in one ear upon awakening. This issue typically resolves after exposure to steam during his morning shower. He maintains a regular ear cleaning regimen using Q-tips.

He does not engage in any form of exercise but does participate in walking and hiking activities. He applies high SPF sunscreen when planning to spend extended periods outdoors during the summer months.

The patient has observed a change in his urine color over the past year, noting a dark, apple juice-like appearance. This discoloration is most pronounced with his first morning void, despite his routine consumption of coffee. The color remains dark during his subsequent urination at work but tends to lighten to clear with increased water intake. However, the urine reverts to a yellow hue by the time he returns home. He is uncertain if this is a normal variation. He also reports frequent urination, even with minimal fluid intake. He recalls an instance where he consumed a single glass of wine and water during a meal out yet needed to urinate three times.

He is currently not on any medications.

The patient denies experiencing any severe pain following his discectomy. He occasionally experiences discomfort, which he manages with light stretching exercises as instructed during his physical therapy sessions at Spaulding. He attributes his current lack of physical fitness to his back condition. He has expressed interest in obtaining a referral to Spaulding for swimming lessons. He has a history of lumbar spine injury and has been advised against heavy weightlifting. Prior to his injury, he maintained an active lifestyle, running approximately 15 miles per week and engaging in regular weight training.

• He works in the finance field for the state.
• His father had skin cancer treatments and removals.`,
            checked: false,
          },
          {
            id: "physical",
            title: "Physical Exam",
            content: `Impacted cerumen is present in the right ear. No abnormal lymph nodes are felt in the neck. The thyroid appears normal. Both lungs are clear. The heart has a regular rate and rhythm. No murmurs are detected. The abdomen is soft and nontender. There is no swelling in the ankles. Actinic keratoses are present on the face. The skin on the back appears healthy.

Blood pressure is 109/72. Heart rate is 87.`,
            checked: false,
          },
          {
            id: "results",
            title: "Results",
            content: `Colonoscopy in 2018 showed normal colon.`,
            checked: false,
          },
          {
            id: "assessment",
            title: "Assessment & Plan",
            content: `1. Annual physical examination. The patient's blood pressure readings are within the normal range, and he is not currently on any antihypertensive medications. His cholesterol levels have been slightly elevated in the past. I will proceed with ordering blood work and a urinalysis. If the results indicate any abnormalities, I will recommend fasting blood work for further evaluation.

2. Colonoscopy. The patient underwent a colonoscopy in 2018, which yielded normal results. A repeat colonoscopy was recommended at the age of 50. I have advised the patient to postpone the colonoscopy until he reaches the age of 50, unless there are specific indications that necessitate an earlier procedure.

3. Skin evaluation. The patient has a history of actinic keratoses on his face. A referral to Dr. Charles Taylor at MGH will be arranged for further evaluation and management.

4. Prostate check. The patient's urinary symptoms are unlikely to be related to prostate issues. However, they could potentially be indicative of diabetes. A PSA test will be ordered to rule out any prostate-related concerns.

5. Cerumen impaction. The patient has impacted cerumen in his right ear. Cerumen irrigation will be performed to alleviate the impaction.

6. Back pain. The patient has a history of lumbar spine injury and has previously undergone discectomy surgery. I have recommended that the patient consider joining a gym and working with a personal trainer to improve his physical fitness. He should inform the trainer about his past discectomy surgery and exercise caution with his back. At this time, a referral to Spaulding is not necessary.`,
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
                initialDictationState="off" // Start with mic "off"
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
