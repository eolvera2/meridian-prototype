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
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    color: tokens.colorBrandForeground1,
    cursor: "pointer",
    transition: "background 0.2s",
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
    background: "#fff",
    border: "none !important",
    boxShadow: "none !important",
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
    gap: "6px",
  },
  actionButton: {
    background: "none",
    border: "none",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
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
    fontSize: "14px",
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
    marginTop: "4px",
    marginBottom: "8px",
  },
  chevronButton: {
    background: "none",
    border: "none",
    borderRadius: 0,
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
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
    backgroundColor: "#fff", // Set background to white
    borderRadius: "6px",
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
        <span className={styles.title}>Dictation 0001</span>
        <div className={styles.actions}>
          <Tooltip
            content="Add memo"
            relationship="label"
            positioning={{ position: "below" }}
          >
            <button
              className={styles.actionButton}
              aria-label="Add memo"
              onClick={handleAdd}
            >
              <Add16Regular />
            </button>
          </Tooltip>
          {/* Transfer toggle button */}
          <Tooltip
            content={
              transferred ? (
                <span className="darkTooltip">Transferred</span>
              ) : (
                "Transfer"
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
              aria-label="Export memo"
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
              copied ? <span className="darkTooltip">Copied</span> : "Copy"
            }
            relationship="label"
            visible={copied ? tooltipVisible === "copy" : hovered === "copy"}
            positioning={{ position: "below" }}
          >
            <button
              className={styles.actionButton}
              aria-label="Copy memo"
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
            content="Close"
            relationship="label"
            positioning={{ position: "below" }}
          >
            <button
              className={styles.actionButton}
              aria-label="Close memo"
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
          <button className={styles.chevronButton} aria-label="Previous memo">
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
          <button className={styles.chevronButton} aria-label="Next memo">
            <ChevronRight20Regular />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingMemos;
