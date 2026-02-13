/**
 * FloatingMemos Component
 *
 * Flat memo card for the FloatingMicBar (Task9)
 * Implements the provided Figma layout: title row with actions, textarea below,
 * and navigation arrows outside the card.
 */

import React, { useRef } from "react";
import { Tooltip } from "@fluentui/react-components";
import { makeStyles, tokens } from "@fluentui/react-components";
import {
  Add16Regular,
  Copy20Regular,
  Dismiss20Regular,
  ArrowExportUpRegular,
  ChevronLeft20Regular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";
import { navigateToSuccess } from "../../utils/navigation";
import { useI18n } from "../../i18n/I18nContext";

type FloatingMemosProps = {
  isRecording?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  memoText: string;
  setMemoText: (value: string) => void;
  onClose?: () => void;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    maxWidth: "100%",
    minHeight: "120px",
    background: "transparent",
    gap: 0,
    padding: "4px 0 8px 0", // Figma: pt-4 pb-8 px-0
  },
  navButton: {
    background: "none",
    border: "none",
    borderRadius: "50%",
    width: "var(--button-size-standard)",
    height: "var(--button-size-standard)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: tokens.fontSizeBase500,
    color: tokens.colorBrandForeground1,
    cursor: "pointer",
    transition: "var(--transition-background-fast)",
    "&:hover": {
      background: tokens.colorNeutralBackground3,
    },
  },
  cardHeader: {
    display: "flex",
    alignItems: "center", // vertically center
    justifyContent: "space-between",
    margin: "4px 6px",
    width: "calc(100% - 12px)",
    padding: 0,
  },
  card: {
    display: "flex",
    background: "var(--colorNeutralBackground1)",
    border: "none !important",
    boxShadow: "var(--shadow-none) !important",
    width: "100%",
    maxWidth: "100%",
    padding: "0",
    position: "relative",
    minWidth: 0,
    maxHeight: "60vh",
    overflow: "hidden",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-medium)",
  },
  actionButton: {
    background: "none",
    border: "none",
    borderRadius: "50%",
    width: "var(--icon-size-standard)",
    height: "var(--icon-size-standard)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    color: tokens.colorNeutralForeground2,
    cursor: "pointer",
    transition: "background 0.2s, border-radius 0.2s, color 0.2s",
    "&:hover": {
      background: tokens.colorNeutralBackground3,
      borderRadius: 0,
      color: tokens.colorBrandForeground1,
    },
  },
  title: {
    fontFamily: tokens.fontFamilyBase,
    fontWeight: 600,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground1,
    flex: 1,
  },
  textareaRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "var(--spacing-small-4)",
    marginBottom: "var(--spacing-large)",
  },
  chevronButton: {
    background: "none",
    border: "none",
    borderRadius: 0,
    width: "var(--button-size-standard)",
    height: "var(--button-size-standard)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: tokens.fontSizeBase500,
    color: tokens.colorNeutralForeground2,
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    "&:hover": {
      background: tokens.colorNeutralBackground3,
      borderRadius: 0,
      color: tokens.colorBrandForeground1,
    },
  },
  textarea: {
    width: "100%",
    minHeight: "132px",
    maxHeight: "132px",
    height: "132px",
    fontSize: tokens.fontSizeBase300,
    fontFamily: tokens.fontFamilyBase,
    lineHeight: tokens.lineHeightBase300,
    border: "none",
    outline: "none",
    resize: "none",
    backgroundColor: "var(--colorNeutralBackground1)", // Set background to white
    borderRadius: "var(--border-radius-large)",
    padding: "10px 12px",
    boxShadow: tokens.shadow2,
    "&:focus": {
      border: `2px solid ${tokens.colorBrandForeground1}`,
      outline: "none",
    },
  },
});

export const FloatingMemos: React.FC<FloatingMemosProps> = ({
  memoText,
  setMemoText,
  onClose,
}) => {
  const styles = useStyles();
  const { t } = useI18n();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [copied, setCopied] = React.useState(false);
  const [transferred, setTransferred] = React.useState(false);
  const [tooltipVisible, setTooltipVisible] = React.useState<string | null>(
    null
  );
  const [hovered, setHovered] = React.useState<string | null>(null);

  const handleAdd = () => {};
  const handleUpload = () => {
    setTransferred((prev) => !prev);
    setTooltipVisible("transfer");
    setTimeout(() => setTooltipVisible(null), 2000);
  };

  return (
    <div className={styles.root}>
      {/* Header row: title and actions (outside card) */}
      <div className={styles.cardHeader}>
        <span className={styles.title}>{t("task9.floatingMemos.title")}</span>
        <div className={styles.actions}>
          <Tooltip
            content={t("task9.floatingMemos.addMemo")}
            relationship="label"
            positioning={{ position: "below" }}
          >
            <button
              className={styles.actionButton}
              aria-label={t("task9.floatingMemos.addMemo")}
              onClick={handleAdd}
            >
              <Add16Regular />
            </button>
          </Tooltip>
          {/* Transfer toggle button */}
          <Tooltip
            content={
              transferred ? (
                <span className="darkTooltip">
                  {t("task9.floatingMemos.transferred")}
                </span>
              ) : (
                t("task9.floatingMemos.transfer")
              )
            }
            relationship="label"
            visible={
              transferred
                ? tooltipVisible === "transfer"
                : hovered === "transfer"
            }
            positioning={{ position: "below" }}
          >
            <button
              className={styles.actionButton}
              aria-label={t("task9.floatingMemos.exportMemo")}
              onClick={handleUpload}
              onMouseEnter={() => !transferred && setHovered("transfer")}
              onMouseLeave={() => {
                setHovered(null);
                setTooltipVisible(null);
              }}
              aria-checked={transferred}
              role="button"
            >
              <ArrowExportUpRegular />
            </button>
          </Tooltip>
          {/* Copy toggle button */}
          <Tooltip
            content={
              copied ? (
                <span className="darkTooltip">
                  {t("task9.floatingMemos.copied")}
                </span>
              ) : (
                t("common.copy")
              )
            }
            relationship="label"
            visible={copied ? tooltipVisible === "copy" : hovered === "copy"}
            positioning={{ position: "below" }}
          >
            <button
              className={styles.actionButton}
              aria-label={t("task9.floatingMemos.copyMemo")}
              onClick={() => {
                setCopied((prev) => !prev);
                setTooltipVisible("copy");
                setTimeout(() => setTooltipVisible(null), 2000);
                navigateToSuccess(); // Trigger navigation to success
              }}
              onMouseEnter={() => !copied && setHovered("copy")}
              onMouseLeave={() => {
                setHovered(null);
                setTooltipVisible(null);
              }}
              aria-checked={copied}
              role="button"
            >
              <Copy20Regular />
            </button>
          </Tooltip>
          <Tooltip
            content={t("common.close")}
            relationship="label"
            positioning={{ position: "below" }}
          >
            <button
              className={styles.actionButton}
              aria-label={t("task9.floatingMemos.closeMemo")}
              onClick={onClose}
            >
              <Dismiss20Regular />
            </button>
          </Tooltip>
        </div>
      </div>
      {/* Card with textarea and chevrons below header */}
      <div className={styles.card}>
        <div className={styles.textareaRow}>
          <button
            className={styles.chevronButton}
            aria-label={t("task9.floatingMemos.previousMemo")}
          >
            <ChevronLeft20Regular />
          </button>
          <textarea
            id="memo-textarea"
            ref={textareaRef}
            className={styles.textarea}
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
          <button
            className={styles.chevronButton}
            aria-label={t("task9.floatingMemos.nextMemo")}
          >
            <ChevronRight20Regular />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingMemos;
