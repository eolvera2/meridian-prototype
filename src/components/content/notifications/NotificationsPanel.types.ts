/**
 * NotificationsPanel Types
 *
 * Type definitions for the NotificationsPanel component.
 */

/**
 * Types of notifications that can be displayed.
 */
export type NotificationType = "alert" | "info" | "recommendation";

/**
 * A notification item.
 */
export interface Notification {
  id: string;
  author: string;
  isAIGenerated: boolean;
  timestamp: Date;
  title: string;
  description: string;
  type: NotificationType;
}

/**
 * A group of notifications organized by date.
 */
export interface NotificationGroup {
  label: string;
  notifications: Notification[];
}
