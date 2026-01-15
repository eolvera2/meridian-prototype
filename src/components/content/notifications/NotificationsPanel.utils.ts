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
export const formatDateLabel = (
  date: Date,
  locale: string = "en-US",
  t: (key: string) => string = (key) => key
): string => {
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
    return t("common.today");
  }
  if (notificationDate.getTime() === yesterday.getTime()) {
    return t("common.yesterday");
  }

  // Format as "Wednesday, November 27"
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
};

/**
 * Formats a date as a time string (e.g., "11:02 AM").
 */
export const formatTime = (date: Date, locale: string = "en-US"): string => {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

/**
 * Groups notifications by their date label.
 */
export const groupNotificationsByDate = (
  notifications: Notification[],
  locale: string = "en-US",
  t: (key: string) => string = (key) => key
): NotificationGroup[] => {
  const groups: Map<string, Notification[]> = new Map();

  // Sort notifications by date descending
  const sortedNotifications = [...notifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  sortedNotifications.forEach((notification) => {
    const label = formatDateLabel(notification.timestamp, locale, t);
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
export const generateSampleNotifications = (
  t: (key: string) => string = (key) => key
): Notification[] => {
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
      author: t("app.title"),
      isAIGenerated: true,
      timestamp: new Date(
        today.getTime() + 11 * 60 * 60 * 1000 + 2 * 60 * 1000
      ),
      title: t("notifications.sample.1.title"),
      description: t("notifications.sample.1.description"),
      type: "alert",
    },
    {
      id: "2",
      author: "Dakota Sanchez",
      isAIGenerated: false,
      timestamp: new Date(
        today.getTime() + 11 * 60 * 60 * 1000 + 2 * 60 * 1000
      ),
      title: t("notifications.sample.2.title"),
      description: t("notifications.sample.2.description"),
      type: "info",
    },
    {
      id: "3",
      author: "Dakota Sanchez",
      isAIGenerated: false,
      timestamp: new Date(
        today.getTime() + 11 * 60 * 60 * 1000 + 2 * 60 * 1000
      ),
      title: t("notifications.sample.3.title"),
      description: t("notifications.sample.3.description"),
      type: "recommendation",
    },
    {
      id: "4",
      author: "Dakota Sanchez",
      isAIGenerated: false,
      timestamp: new Date(
        yesterday.getTime() + 11 * 60 * 60 * 1000 + 2 * 60 * 1000
      ),
      title: t("notifications.sample.4.title"),
      description: t("notifications.sample.4.description"),
      type: "recommendation",
    },
    {
      id: "5",
      author: t("app.title"),
      isAIGenerated: true,
      timestamp: new Date(
        yesterday.getTime() + 9 * 60 * 60 * 1000 + 30 * 60 * 1000
      ),
      title: t("notifications.sample.5.title"),
      description: t("notifications.sample.5.description"),
      type: "alert",
    },
    {
      id: "6",
      author: "Emily Johnson",
      isAIGenerated: false,
      timestamp: new Date(
        yesterday.getTime() + 14 * 60 * 60 * 1000 + 15 * 60 * 1000
      ),
      title: t("notifications.sample.6.title"),
      description: t("notifications.sample.6.description"),
      type: "info",
    },
    {
      id: "7",
      author: t("app.title"),
      isAIGenerated: true,
      timestamp: new Date(
        twoDaysAgo.getTime() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000
      ),
      title: t("notifications.sample.7.title"),
      description: t("notifications.sample.7.description"),
      type: "alert",
    },
    {
      id: "8",
      author: "Michael Chen",
      isAIGenerated: false,
      timestamp: new Date(
        twoDaysAgo.getTime() + 16 * 60 * 60 * 1000 + 20 * 60 * 1000
      ),
      title: t("notifications.sample.8.title"),
      description: t("notifications.sample.8.description"),
      type: "info",
    },
    {
      id: "9",
      author: "Dakota Sanchez",
      isAIGenerated: false,
      timestamp: new Date(
        threeDaysAgo.getTime() + 8 * 60 * 60 * 1000 + 55 * 60 * 1000
      ),
      title: t("notifications.sample.9.title"),
      description: t("notifications.sample.9.description"),
      type: "recommendation",
    },
    {
      id: "10",
      author: t("app.title"),
      isAIGenerated: true,
      timestamp: new Date(
        threeDaysAgo.getTime() + 15 * 60 * 60 * 1000 + 10 * 60 * 1000
      ),
      title: t("notifications.sample.10.title"),
      description: t("notifications.sample.10.description"),
      type: "alert",
    },
    {
      id: "11",
      author: "Sarah Williams",
      isAIGenerated: false,
      timestamp: new Date(
        fourDaysAgo.getTime() + 11 * 60 * 60 * 1000 + 30 * 60 * 1000
      ),
      title: t("notifications.sample.11.title"),
      description: t("notifications.sample.11.description"),
      type: "info",
    },
    {
      id: "12",
      author: t("app.title"),
      isAIGenerated: true,
      timestamp: new Date(
        fourDaysAgo.getTime() + 13 * 60 * 60 * 1000 + 45 * 60 * 1000
      ),
      title: t("notifications.sample.12.title"),
      description: t("notifications.sample.12.description"),
      type: "recommendation",
    },
  ];
};
