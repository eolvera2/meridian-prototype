import React from "react";
import {
  makeStyles,
  tokens,
  Button,
  mergeClasses,
} from "@fluentui/react-components";
import { ArrowUndoRegular, DismissRegular } from "@fluentui/react-icons";
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
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-small)",
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

  highlightedText: {
    color: tokens.colorBrandForeground1,
  },

  toastActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "var(--gap-small)",
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
    minWidth: "var(--icon-size-standard)",
    width: "var(--icon-size-standard)",
    height: "var(--icon-size-standard)",
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
  const { t } = useI18n();

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
              aria-label={t("common.undo")}
            />
            <Button
              className={styles.iconButton}
              icon={<DismissRegular />}
              appearance="subtle"
              size="small"
              onClick={onClose}
              aria-label={t("common.close")}
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
