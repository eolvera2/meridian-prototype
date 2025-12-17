import React from "react";
import {
  makeStyles,
  tokens,
  Button,
  mergeClasses,
} from "@fluentui/react-components";
import { ArrowUndoRegular, DismissRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  toastContainer: {
    position: "fixed",
    bottom: "72px", // Sits right on top of the 72px mic interface
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 201, // Just above mic interface (200)
    transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
    pointerEvents: "none", // Always none for the container
  },

  toastHidden: {
    opacity: 0,
    transform: "translateY(10px)",
  },

  toastVisible: {
    opacity: 1,
    transform: "translateY(0)",
  },

  toast: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "6px 12px",
    width: "100%",
    pointerEvents: "auto", // Enable clicks on the toast itself
  },

  toastDetected: {
    backgroundColor: tokens.colorStatusSuccessBackground1,
  },

  toastCompleted: {
    backgroundColor: tokens.colorStatusSuccessBackground1,
  },

  toastHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    height: "26px",
  },

  toastContent: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flex: 1,
  },

  toastText: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: "16px",
    color: tokens.colorNeutralForeground1,
    whiteSpace: "nowrap",
  },

  highlightedText: {
    color: tokens.colorBrandForeground1,
  },

  toastActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "4px",
    height: "26px",
    padding: "1px 0",
  },

  badge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: "11px",
    fontWeight: 600,
    fontFamily: "'Segoe UI', sans-serif",
    padding: "0 4px",
  },

  iconButton: {
    minWidth: "24px",
    width: "24px",
    height: "24px",
    padding: 0,
  },

  progressBarContainer: {
    width: "100%",
    height: "4px",
    backgroundColor: tokens.colorNeutralBackground6,
    borderRadius: tokens.borderRadiusCircular,
    overflow: "hidden",
    position: "relative",
  },

  progressBarTrack: {
    height: "100%",
    borderRadius: tokens.borderRadiusCircular,
    background:
      "linear-gradient(90deg, #0D91E1 0%, #5E62C6 25%, #D2007E 50%, #E94B3C 75%, #FF5F3D 100%)",
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    animationName: {
      "0%": {
        transform: "translateX(-100%)",
      },
      "100%": {
        transform: "translateX(100%)",
      },
    },
    animationDuration: "2s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
  },
});

interface AIRequestToastProps {
  visible: boolean;
  text: string;
  highlightedText?: string;
  mode?: "detected" | "completed";
  onUndo?: () => void;
  onClose?: () => void;
}

export const AIRequestToast: React.FC<AIRequestToastProps> = ({
  visible,
  text,
  highlightedText,
  mode = "completed",
  onUndo,
  onClose,
}) => {
  const styles = useStyles();

  const toastClass = mergeClasses(
    styles.toast,
    mode === "detected" ? styles.toastDetected : styles.toastCompleted
  );

  return (
    <div
      className={`${styles.toastContainer} ${
        visible ? styles.toastVisible : styles.toastHidden
      }`}
    >
      <div className={toastClass}>
        <div className={styles.toastHeader}>
          <div className={styles.toastContent}>
            <p className={styles.toastText}>
              {text}
              {highlightedText && (
                <span className={styles.highlightedText}>
                  {" "}
                  {highlightedText}
                </span>
              )}
            </p>
          </div>
          <div className={styles.toastActions}>
            <Button
              className={styles.iconButton}
              icon={<ArrowUndoRegular />}
              appearance="subtle"
              size="small"
              onClick={onUndo}
              aria-label="Undo"
            />
            <Button
              className={styles.iconButton}
              icon={<DismissRegular />}
              appearance="subtle"
              size="small"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
        </div>
        {mode === "detected" && (
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBarTrack} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRequestToast;
