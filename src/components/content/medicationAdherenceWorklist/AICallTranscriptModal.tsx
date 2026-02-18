import React, { useRef, useEffect } from "react";
import { Button, Card, mergeClasses } from "@fluentui/react-components";
import { Dismiss24Regular, Bot20Regular, Person20Regular } from "@fluentui/react-icons";
import { useAICallTranscriptModalStyles } from "./AICallTranscriptModal.styles";

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

interface AICallTranscriptModalProps {
  onClose: () => void;
}

export const AICallTranscriptModal: React.FC<AICallTranscriptModalProps> = ({ onClose }) => {
  const styles = useAICallTranscriptModalStyles();
  const bodyRef = useRef<HTMLDivElement>(null);

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
          {TRANSCRIPT.map((msg, idx) => (
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
