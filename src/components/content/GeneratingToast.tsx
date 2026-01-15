import React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import { useI18n } from "../../i18n/I18nContext";

const useStyles = makeStyles({
  toastContainer: {
    position: "fixed",
    bottom: "72px", // Sits right on top of the 72px mic interface
    left: 0,
    right: 0,
    width: "100%",
    zIndex: "var(--z-index-toast)", // Just above mic interface (200)
    transition: "var(--transition-fade), transform 0.3s ease-in-out",
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
    gap: "var(--gap-small)",
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
    gap: "var(--gap-small)",
    flex: 1,
  },

  toastText: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
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
    padding: "var(--spacing-small-4)",
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
    background: "var(--gradient-rainbow-progress)",
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
  const { t } = useI18n();

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
              aria-label={t("common.close")}
            >
              <Dismiss24Regular className="icon-size-20" />
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
