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
    backgroundColor: tokens.colorNeutralBackground4,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "6px 12px",
    width: "100%",
    pointerEvents: "auto", // Enable clicks on the toast itself
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

interface GeneratingToastProps {
  visible: boolean;
  text: string;
  onClose?: () => void;
  showProgress?: boolean;
}

export const GeneratingToast: React.FC<GeneratingToastProps> = ({
  visible,
  text,
  onClose,
  showProgress = false,
}) => {
  const styles = useStyles();

  return (
    <div
      className={`${styles.toastContainer} ${
        visible ? styles.toastVisible : styles.toastHidden
      }`}
    >
      <div className={styles.toast}>
        <div className={styles.toastHeader}>
          <div className={styles.toastContent}>
            <p className={styles.toastText}>{text}</p>
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
        {showProgress && (
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBarTrack} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratingToast;
