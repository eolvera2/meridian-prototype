/**
 * NotificationsPanel Utilities
 *
 * Helper functions and sample data for the NotificationsPanel component.
 */

import type {
  Notification,
  NotificationGroup,
} from "./NotificationsPanel.types";

/**
 * Formats a date as a relative label (Today, Yesterday, or full date).
 */
export const formatDateLabel = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const notificationDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (notificationDate.getTime() === today.getTime()) {
    return "Today";
  }
  if (notificationDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  // Format as "Wednesday, November 27"
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formats a date as a time string (e.g., "11:02 AM").
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Groups notifications by their date label.
 */
export const groupNotificationsByDate = (
  notifications: Notification[]
): NotificationGroup[] => {
  const groups: Map<string, Notification[]> = new Map();

  // Sort notifications by date descending
  const sortedNotifications = [...notifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  sortedNotifications.forEach((notification) => {
    const label = formatDateLabel(notification.timestamp);
    const existing = groups.get(label) || [];
    groups.set(label, [...existing, notification]);
  });

  return Array.from(groups.entries()).map(([label, notifications]) => ({
    label,
    notifications,
  }));
};

/**
 * Generates sample notifications for demo purposes.
 */
export const generateSampleNotifications = (): Notification[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const fourDaysAgo = new Date(today);
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

  return [
    {
      id: "1",
      author: "Dragon Copilot",
      isAIGenerated: true,
      timestamp: new Date(
        today.getTime() + 11 * 60 * 60 * 1000 + 2 * 60 * 1000
      ),
      title: "Mobile mic disconnected",
      description: "Retry pairing here and on your mobile device",
      type: "alert",
    },
    {
      id: "2",
      author: "Dakota Sanchez",
      isAIGenerated: false,
      timestamp: new Date(
        today.getTime() + 11 * 60 * 60 * 1000 + 2 * 60 * 1000
      ),
      title: "Information assistant response",
      description:
        "The plan includes a tiered pharmacy network. Preferred options include:",
      type: "info",
    },
    {
      id: "3",
      author: "Dakota Sanchez",
      isAIGenerated: false,
      timestamp: new Date(
        today.getTime() + 11 * 60 * 60 * 1000 + 2 * 60 * 1000
      ),
      title: "Optum recommendation",
      description: "Time: E/M Code 99214\n30-39 minutes spent on patient care",
      type: "recommendation",
    },
    {
      id: "4",
      author: "Dakota Sanchez",
      isAIGenerated: false,
      timestamp: new Date(
        yesterday.getTime() + 11 * 60 * 60 * 1000 + 2 * 60 * 1000
      ),
      title: "Canary alert",
      description: "Detected a depression biomarker",
      type: "recommendation",
    },
    {
      id: "5",
      author: "Dragon Copilot",
      isAIGenerated: true,
      timestamp: new Date(
        yesterday.getTime() + 9 * 60 * 60 * 1000 + 30 * 60 * 1000
      ),
      title: "Speech recognition paused",
      description:
        "Ambient listening has been paused due to inactivity. Click to resume.",
      type: "alert",
    },
    {
      id: "6",
      author: "Emily Johnson",
      isAIGenerated: false,
      timestamp: new Date(
        yesterday.getTime() + 14 * 60 * 60 * 1000 + 15 * 60 * 1000
      ),
      title: "Lab results available",
      description:
        "New lab results are ready for review. CBC and metabolic panel completed.",
      type: "info",
    },
    {
      id: "7",
      author: "Dragon Copilot",
      isAIGenerated: true,
      timestamp: new Date(
        twoDaysAgo.getTime() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000
      ),
      title: "Documentation reminder",
      description:
        "You have 3 unsigned notes from yesterday. Please review and sign.",
      type: "alert",
    },
    {
      id: "8",
      author: "Michael Chen",
      isAIGenerated: false,
      timestamp: new Date(
        twoDaysAgo.getTime() + 16 * 60 * 60 * 1000 + 20 * 60 * 1000
      ),
      title: "Prior authorization approved",
      description:
        "Prior auth for MRI lumbar spine has been approved. Valid for 30 days.",
      type: "info",
    },
    {
      id: "9",
      author: "Dakota Sanchez",
      isAIGenerated: false,
      timestamp: new Date(
        threeDaysAgo.getTime() + 8 * 60 * 60 * 1000 + 55 * 60 * 1000
      ),
      title: "Quality measure alert",
      description:
        "Patient is due for annual wellness visit. Last visit was 13 months ago.",
      type: "recommendation",
    },
    {
      id: "10",
      author: "Dragon Copilot",
      isAIGenerated: true,
      timestamp: new Date(
        threeDaysAgo.getTime() + 15 * 60 * 60 * 1000 + 10 * 60 * 1000
      ),
      title: "Medication interaction warning",
      description:
        "Potential interaction detected between newly prescribed medication and existing regimen.",
      type: "alert",
    },
    {
      id: "11",
      author: "Sarah Williams",
      isAIGenerated: false,
      timestamp: new Date(
        fourDaysAgo.getTime() + 11 * 60 * 60 * 1000 + 30 * 60 * 1000
      ),
      title: "Referral status update",
      description:
        "Cardiology referral for patient has been scheduled. Appointment set for next week.",
      type: "info",
    },
    {
      id: "12",
      author: "Dragon Copilot",
      isAIGenerated: true,
      timestamp: new Date(
        fourDaysAgo.getTime() + 13 * 60 * 60 * 1000 + 45 * 60 * 1000
      ),
      title: "Coding suggestion",
      description:
        "Based on documentation, consider adding diagnosis code for hypertension management.",
      type: "recommendation",
    },
  ];
};
