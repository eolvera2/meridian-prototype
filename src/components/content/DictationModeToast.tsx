import React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  toastContainer: {
    position: "fixed",
    bottom: "72px", // Sits right on top of the 72px mic interface
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 201, // Just above mic interface (200)
    transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
    pointerEvents: "none",
  },

  toastHidden: {
    opacity: 0,
    transform: "translateY(10px)",
    pointerEvents: "none",
  },

  toastVisible: {
    opacity: 1,
    transform: "translateY(0)",
    pointerEvents: "auto",
  },

  toast: {
    backgroundColor: tokens.colorNeutralBackground4,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "6px 12px",
    width: "100%",
    height: "40px",
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

  toastActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "26px",
    padding: "1px 0",
  },

  closeButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: tokens.colorNeutralForeground2,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

interface DictationModeToastProps {
  visible: boolean;
  mode: "dictation" | "ambient";
  onClose?: () => void;
}

export const DictationModeToast: React.FC<DictationModeToastProps> = ({
  visible,
  mode,
  onClose,
}) => {
  const styles = useStyles();

  const message =
    mode === "dictation" ? "Mic in dictation mode" : "Mic in ambient mode";

  return (
    <div
      className={`${styles.toastContainer} ${
        visible ? styles.toastVisible : styles.toastHidden
      }`}
    >
      <div className={styles.toast}>
        <div className={styles.toastContent}>
          <p className={styles.toastText}>{message}</p>
        </div>
        <div className={styles.toastActions}>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <Dismiss24Regular style={{ width: "20px", height: "20px" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DictationModeToast;
