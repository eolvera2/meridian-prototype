/**
 * TranscriptPanel Sample Data
 *
 * Sample recordings data for the TranscriptPanel component.
 */

import type { Recording } from "./TranscriptPanel.types";

/**
 * Generates sample transcript recordings for demo purposes.
 */
export const generateSampleRecordings = (): Recording[] => {
  return [
    {
      id: "1",
      name: "Recording 1",
      date: "12/13/25",
      time: "12:36 PM",
      isExpanded: true,
      messages: [
        {
          id: "1-1",
          speaker: "Doctor",
          speakerInitials: "MB",
          timestamp: "12:31 PM",
          content:
            "I think it would be beneficial to start you on Spironolactone 25 mg daily to help prevent fluid retention and counteract potassium loss.",
          highlightedMedication: {
            name: "Spironolactone",
            dosage: "25 mg daily",
          },
          ordersDetected: "Spironolactone 25 mg daily",
        },
        {
          id: "1-2",
          speaker: "Unknown",
          speakerInitials: "",
          timestamp: "12:32 PM",
          content: "Thank you, doctor.",
        },
        {
          id: "1-3",
          speaker: "Doctor",
          speakerInitials: "MB",
          timestamp: "12:32 PM",
          content:
            "Also, we should start you with Metoprolol succinate 50 mg to help keep your heart rate slow and reduce blood pressure.",
          highlightedMedication: {
            name: "Metoprolol succinate",
            dosage: "50 mg",
          },
          ordersDetected: "Spironolactone 25 mg daily",
        },
        {
          id: "1-4",
          speaker: "Doctor",
          speakerInitials: "MB",
          timestamp: "12:33 PM",
          content:
            "There shouldn't be any significant interactions but it's always important to monitor for any unusual symptoms. If you notice anything out of the ordinary, please let me know right away.",
        },
        {
          id: "1-5",
          speaker: "Doctor",
          speakerInitials: "MB",
          timestamp: "12:33 PM",
          content:
            "Depending on your symptoms, we may need to consider a cardiology evaluation or hospitalization. But only if necessary.",
          ordersDetected: "Admit to Internal Medicine / Cardiology service",
        },
      ],
    },
    {
      id: "2",
      name: "Recording 2",
      date: "12/12/25",
      time: "3:15 PM",
      isExpanded: false,
      messages: [
        {
          id: "2-1",
          speaker: "Doctor",
          speakerInitials: "MB",
          timestamp: "3:15 PM",
          content:
            "Let's review your recent lab results. Your potassium levels are slightly elevated.",
        },
        {
          id: "2-2",
          speaker: "Unknown",
          speakerInitials: "",
          timestamp: "3:16 PM",
          content: "Is that something I should be worried about?",
        },
        {
          id: "2-3",
          speaker: "Doctor",
          speakerInitials: "MB",
          timestamp: "3:16 PM",
          content:
            "We'll monitor it closely. I'd recommend reducing your intake of potassium-rich foods for now.",
        },
      ],
    },
    {
      id: "3",
      name: "Recording 3",
      date: "12/11/25",
      time: "10:00 AM",
      isExpanded: false,
      messages: [
        {
          id: "3-1",
          speaker: "Doctor",
          speakerInitials: "MB",
          timestamp: "10:00 AM",
          content:
            "Good morning. How have you been feeling since our last visit?",
        },
        {
          id: "3-2",
          speaker: "Unknown",
          speakerInitials: "",
          timestamp: "10:01 AM",
          content:
            "Much better, the new medication seems to be helping with the chest pain.",
        },
        {
          id: "3-3",
          speaker: "Doctor",
          speakerInitials: "MB",
          timestamp: "10:02 AM",
          content:
            "That's great to hear. Let's do a quick examination to make sure everything is progressing well.",
        },
      ],
    },
    {
      id: "4",
      name: "Recording 4",
      date: "12/10/25",
      time: "2:45 PM",
      isExpanded: false,
      messages: [
        {
          id: "4-1",
          speaker: "Doctor",
          speakerInitials: "MB",
          timestamp: "2:45 PM",
          content:
            "I've reviewed your ECG results. There are some irregularities we need to discuss.",
        },
        {
          id: "4-2",
          speaker: "Unknown",
          speakerInitials: "",
          timestamp: "2:46 PM",
          content: "What kind of irregularities?",
        },
        {
          id: "4-3",
          speaker: "Doctor",
          speakerInitials: "MB",
          timestamp: "2:47 PM",
          content:
            "Your heart rhythm shows some premature ventricular contractions. It's not uncommon, but we should keep an eye on it.",
          ordersDetected: "Holter monitor 24-hour",
        },
      ],
    },
  ];
};
