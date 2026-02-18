import React, { useRef, useEffect } from "react";
import { Button, Card, mergeClasses } from "@fluentui/react-components";
import { Dismiss24Regular, Bot20Regular, Person20Regular } from "@fluentui/react-icons";
import { useAICallTranscriptModalStyles } from "./AICallTranscriptModal.styles";
import type { CallType } from "./MedicationAdherenceWorklist.types";

interface TranscriptMessage {
  speaker: "AI System" | "Patient";
  initials: string;
  timestamp: string;
  content: string;
  event?: string;
}

const TRANSCRIPT: TranscriptMessage[] = [
  {
    speaker: "AI System",
    initials: "AI",
    timestamp: "12:30 PM",
    content:
      "Hello, hi. My name is Ava. I'm an AI assistant at Contoso hospital. May I speak with Robert? Please?",
  },
  {
    speaker: "Patient",
    initials: "RW",
    timestamp: "12:30 PM",
    content: "Yes, this is Robert.",
  },
  {
    speaker: "AI System",
    initials: "AI",
    timestamp: "12:30 PM",
    content:
      "Hi, Robert. I'm calling to see how you're feeling after your hospital discharge and to make sure you're taking your medications. Let's start by discussing your medication first. Can you confirm that you've picked up your warfarin, five milligrams prescription?",
  },
  {
    speaker: "Patient",
    initials: "RW",
    timestamp: "12:31 PM",
    content: "Yes, I was able to pick that up last week.",
    event: "Picked up medication: Yes",
  },
  {
    speaker: "AI System",
    initials: "AI",
    timestamp: "12:31 PM",
    content: "Great. Are you taking your Warfarin five milligrams as prescribed, once daily?",
  },
  {
    speaker: "Patient",
    initials: "RW",
    timestamp: "12:31 PM",
    content: "Yes, I am. My doctor wanted me to take it in the morning after breakfast.",
    event: "Taking as prescribed: Yes",
  },
  {
    speaker: "AI System",
    initials: "AI",
    timestamp: "12:32 PM",
    content:
      "That's good to hear. How have you been feeling since you started taking your warfarin? Have you experienced any side effects?",
  },
  {
    speaker: "Patient",
    initials: "RW",
    timestamp: "12:32 PM",
    content:
      "You know, the first day or two, I was a little bit nauseous after taking it, but I've been fine ever since.",
    event: "Side effects: Nausea reported",
  },
  {
    speaker: "AI System",
    initials: "AI",
    timestamp: "12:32 PM",
    content:
      "I'm glad to hear things have been better for you since you haven't had issues recently. Would you like to receive medication reminders by email or text message to help you stay on track? Many patients find these helpful as an extra support.",
  },
  {
    speaker: "Patient",
    initials: "RW",
    timestamp: "12:33 PM",
    content: "You know what a text message would be great.",
  },
  {
    speaker: "AI System",
    initials: "AI",
    timestamp: "12:33 PM",
    content:
      "Sure thing, could you please provide your preferred phone number so I can set up the text message reminders for you?",
  },
  {
    speaker: "Patient",
    initials: "RW",
    timestamp: "12:33 PM",
    content: "Sure it's 555-456-7890.",
  },
  {
    speaker: "AI System",
    initials: "AI",
    timestamp: "12:33 PM",
    content:
      "Thank you, Robert, I'll confirm: your phone number is 555-456-7890. Would you like to receive your medication reminders in the morning, around the time you take your warfarin, or is there a specific time that works best for you?",
  },
  {
    speaker: "Patient",
    initials: "RW",
    timestamp: "12:34 PM",
    content:
      "Yeah, you know what? I've been taking the warfarin just after breakfast. So if you could set that reminder for about 8:30 in the morning. That would be great.",
  },
  {
    speaker: "AI System",
    initials: "AI",
    timestamp: "12:34 PM",
    content:
      "Got it. So you'll receive your medication reminders at 8:30 in the morning. I'll make sure that's set up for you. Does that sound right? Is there anything else you'd like to discuss?",
    event: "Reminder set: Yes",
  },
  {
    speaker: "Patient",
    initials: "RW",
    timestamp: "12:34 PM",
    content: "No nothing else today. Thank you so much.",
  },
];

const INTAKE_TRANSCRIPT: TranscriptMessage[] = [
  { speaker: "AI System", initials: "AI", timestamp: "9:00 AM", content: "Hello, this is Ava, an AI assistant from Contoso Hospital. I'm calling to help you prepare for your upcoming appointment. May I speak with the patient, please?" },
  { speaker: "Patient", initials: "GM", timestamp: "9:00 AM", content: "Yes, this is George speaking." },
  { speaker: "AI System", initials: "AI", timestamp: "9:00 AM", content: "Thank you, George. I'd like to confirm some details and collect information ahead of your visit. First, can you confirm your date of birth for verification?" },
  { speaker: "Patient", initials: "GM", timestamp: "9:01 AM", content: "Sure, March 12, 1958." },
  { speaker: "AI System", initials: "AI", timestamp: "9:01 AM", content: "Thank you. Do you have any known allergies to medications, foods, or environmental substances?", event: "Identity verified" },
  { speaker: "Patient", initials: "GM", timestamp: "9:01 AM", content: "Yes, I'm allergic to Penicillin — I get hives. And I have a mild allergy to shellfish.", event: "Allergies confirmed: Penicillin, Shellfish" },
  { speaker: "AI System", initials: "AI", timestamp: "9:02 AM", content: "Thank you for sharing that. Now, could you tell me about your medical history? Any ongoing conditions or past diagnoses?" },
  { speaker: "Patient", initials: "GM", timestamp: "9:02 AM", content: "I have Type 2 diabetes, diagnosed about ten years ago. I also have high blood pressure. I had my appendix removed when I was 25.", event: "Medical history collected" },
  { speaker: "AI System", initials: "AI", timestamp: "9:03 AM", content: "I've noted that. Are you currently experiencing any symptoms you'd like to discuss at your appointment?" },
  { speaker: "Patient", initials: "GM", timestamp: "9:03 AM", content: "I've been having some numbness in my feet recently. It's mostly at night.", event: "Symptoms reported: Numbness in feet" },
  { speaker: "AI System", initials: "AI", timestamp: "9:03 AM", content: "I've recorded that symptom. Our clinical team will review this before your visit. Is there anything else you'd like to mention?" },
  { speaker: "Patient", initials: "GM", timestamp: "9:04 AM", content: "No, I think that covers everything. Thank you." },
  { speaker: "AI System", initials: "AI", timestamp: "9:04 AM", content: "You're all set, George. Your appointment is confirmed for January 20, 2025 at 10:00 AM with Dr. Elaine Rivera at the Main Campus. Please arrive 15 minutes early. Have a great day!", event: "Intake complete" },
];

const HYPERTENSION_TRANSCRIPT: TranscriptMessage[] = [
  { speaker: "AI System", initials: "AI", timestamp: "2:00 PM", content: "Hello, this is Ava from Contoso Hospital calling about your blood pressure management. May I speak with Donna, please?" },
  { speaker: "Patient", initials: "DF", timestamp: "2:00 PM", content: "Yes, this is Donna." },
  { speaker: "AI System", initials: "AI", timestamp: "2:00 PM", content: "Thank you, Donna. I'm following up on your hypertension management. Have you been checking your blood pressure at home?" },
  { speaker: "Patient", initials: "DF", timestamp: "2:01 PM", content: "Yes, I check it every morning. This morning it was 142 over 88.", event: "BP reading reported: 142/88" },
  { speaker: "AI System", initials: "AI", timestamp: "2:01 PM", content: "Thank you for monitoring regularly. Your target is below 130/80. Are you taking your Lisinopril 20mg daily as prescribed?" },
  { speaker: "Patient", initials: "DF", timestamp: "2:01 PM", content: "Yes, I've been taking it every morning with breakfast.", event: "Medication adherence: Yes" },
  { speaker: "AI System", initials: "AI", timestamp: "2:02 PM", content: "Good to hear. Have you experienced any symptoms like headaches, dizziness, or shortness of breath?" },
  { speaker: "Patient", initials: "DF", timestamp: "2:02 PM", content: "I've had a mild headache the past couple of days, but nothing severe.", event: "Symptoms: Mild headaches" },
  { speaker: "AI System", initials: "AI", timestamp: "2:02 PM", content: "I'll note that for your care team. How has your diet and exercise been? Have you been able to reduce sodium intake?" },
  { speaker: "Patient", initials: "DF", timestamp: "2:03 PM", content: "I've been trying. I cut out a lot of processed food, and I walk 30 minutes most days." },
  { speaker: "AI System", initials: "AI", timestamp: "2:03 PM", content: "That's excellent progress. I'll share this update with Dr. Kumar. Since your readings are still above target, the team may want to adjust your treatment. Would you like a follow-up call next week?" },
  { speaker: "Patient", initials: "DF", timestamp: "2:03 PM", content: "Yes, that would be helpful. Thank you." },
  { speaker: "AI System", initials: "AI", timestamp: "2:04 PM", content: "Great, I'll schedule that. Keep up the great work with your lifestyle changes, Donna. Have a wonderful day!", event: "Follow-up scheduled" },
];

const TRANSCRIPTS: Record<string, TranscriptMessage[]> = {
  "medication-adherence": TRANSCRIPT,
  "patient-intake": INTAKE_TRANSCRIPT,
  "hypertension-management": HYPERTENSION_TRANSCRIPT,
};

interface AICallTranscriptModalProps {
  onClose: () => void;
  callType?: CallType;
}

export const AICallTranscriptModal: React.FC<AICallTranscriptModalProps> = ({ onClose, callType }) => {
  const styles = useAICallTranscriptModalStyles();
  const bodyRef = useRef<HTMLDivElement>(null);
  const messages = TRANSCRIPTS[callType || "medication-adherence"] || TRANSCRIPT;

  useEffect(() => {
    bodyRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerTitle}>AI Call Transcript</span>
          <Button
            appearance="subtle"
            icon={<Dismiss24Regular />}
            onClick={onClose}
            aria-label="Close"
          />
        </div>

        {/* Body */}
        <div className={styles.body} ref={bodyRef}>
          {messages.map((msg, idx) => (
            <Card key={idx} className={styles.messageCard} appearance="filled">
              <div className={styles.messageHeader}>
                <div className={styles.speakerSection}>
                  <div
                    className={mergeClasses(
                      styles.speakerAvatar,
                      msg.speaker === "AI System" && styles.aiAvatar
                    )}
                  >
                    {msg.speaker === "AI System" ? <Bot20Regular /> : <Person20Regular />}
                  </div>
                  <div className={styles.speakerInfo}>
                    <span className={styles.speakerName}>{msg.speaker}</span>
                    <span className={styles.messageTime}>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className={styles.messageContent}>{msg.content}</div>
              {msg.event && (
                <div className={styles.eventDetected}>
                  <span className={styles.eventLabel}>Event detected: </span>
                  {msg.event}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
