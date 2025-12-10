/**
 * NotificationsPanel Component
 *
 * Displays a list of notifications grouped by date.
 */

import React from "react";
import {
  Button,
  mergeClasses,
  Card,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@fluentui/react-components";
import {
  Delete20Regular,
  Warning20Filled,
  Lightbulb20Regular,
  Board20Regular,
  Dismiss24Regular,
} from "@fluentui/react-icons";
import DragonCopilotLogo from "../../../assets/logo.svg";
import {
  useStyles,
  type NotificationStyles,
} from "./NotificationsPanel.styles";
import type {
  Notification,
  NotificationType,
} from "./NotificationsPanel.types";
import {
  formatTime,
  groupNotificationsByDate,
  generateSampleNotifications,
} from "./NotificationsPanel.utils";

// ============================================================================
// Helper Functions
// ============================================================================

const getNotificationIcon = (
  type: NotificationType,
  styles: NotificationStyles
) => {
  switch (type) {
    case "alert":
      return (
        <Warning20Filled
          className={mergeClasses(styles.notificationIcon, styles.alertIcon)}
        />
      );
    case "info":
      return (
        <Lightbulb20Regular
          className={mergeClasses(styles.notificationIcon, styles.infoIcon)}
        />
      );
    case "recommendation":
      return (
        <Board20Regular
          className={mergeClasses(
            styles.notificationIcon,
            styles.recommendationIcon
          )}
        />
      );
    default:
      return null;
  }
};

// ============================================================================
// NotificationCard Component
// ============================================================================

interface NotificationCardProps {
  notification: Notification;
  styles: NotificationStyles;
  onDelete: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  styles,
  onDelete,
}) => {
  return (
    <Card className={styles.notificationCard} appearance="filled">
      <div className={styles.notificationHeader}>
        <div className={styles.authorSection}>
          {notification.isAIGenerated && (
            <img
              src={DragonCopilotLogo}
              alt="Dragon Copilot"
              className={styles.authorLogo}
            />
          )}
          <span
            className={mergeClasses(
              styles.authorName,
              notification.isAIGenerated && styles.authorNameAI
            )}
          >
            {notification.author}
          </span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.timestamp}>
            {formatTime(notification.timestamp)}
          </span>
          <Button
            appearance="subtle"
            icon={<Delete20Regular />}
            className={styles.deleteButton}
            aria-label="Delete notification"
            onClick={() => onDelete(notification.id)}
          />
        </div>
      </div>
      <div className={styles.notificationContent}>
        {getNotificationIcon(notification.type, styles)}
        <div className={styles.notificationText}>
          <div className={styles.notificationTitle}>{notification.title}</div>
          <div className={styles.notificationDescription}>
            {notification.description}
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// NotificationsPanel Component
// ============================================================================

export const NotificationsPanel: React.FC = () => {
  const styles = useStyles();
  const [notifications, setNotifications] = React.useState<Notification[]>(() =>
    generateSampleNotifications()
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [notificationToDelete, setNotificationToDelete] = React.useState<
    string | null
  >(null);

  const groupedNotifications = React.useMemo(
    () => groupNotificationsByDate(notifications),
    [notifications]
  );

  const handleDeleteClick = (id: string) => {
    setNotificationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (notificationToDelete) {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationToDelete)
      );
    }
    setDeleteDialogOpen(false);
    setNotificationToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setNotificationToDelete(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.notificationsList}>
        {groupedNotifications.map((group) => (
          <div key={group.label} className={styles.dateGroup}>
            <div className={styles.dateLabel}>
              <span className={styles.dateLineLeft} />
              <span>{group.label}</span>
              <span className={styles.dateLine} />
            </div>
            {group.notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                styles={styles}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(_, data) => {
          if (!data.open) {
            handleCancelDelete();
          }
        }}
      >
        <DialogSurface style={{ maxWidth: "320px", padding: "24px" }}>
          <DialogBody>
            <DialogTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={handleCancelDelete}
                  style={{
                    minWidth: "auto",
                    padding: "4px",
                  }}
                />
              }
              style={{
                fontSize: "20px",
                fontWeight: 600,
                lineHeight: "28px",
                fontFamily: "'Segoe UI', sans-serif",
                marginBottom: "12px",
              }}
            >
              Delete notification
            </DialogTitle>
            <DialogContent
              style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                fontFamily: "'Segoe UI', sans-serif",
                marginBottom: "24px",
              }}
            >
              Are you sure you want to delete this notification? This action
              cannot be undone.
            </DialogContent>
            <DialogActions
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button appearance="secondary" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default NotificationsPanel;
