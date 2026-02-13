import React, { useState, useCallback } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { SendFilled, SendRegular } from "@fluentui/react-icons";
import { useOptionalTooltipContext } from "./tooltip";
import { useI18n } from "../../i18n/I18nContext";

const useStyles = makeStyles({
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  messagesArea: {
    flex: 1,
    padding: "var(--spacing-xxxlarge)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    minHeight: 0,
  },
  messageUser: {
    backgroundColor: tokens.colorBrandBackground2Hover,
    color: tokens.colorNeutralForeground1,
    padding: "12px 16px",
    borderRadius: tokens.borderRadiusXLarge,
    maxWidth: "80%",
    alignSelf: "flex-end",
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
  },
  messageAgent: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    padding: "12px 16px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    maxWidth: "80%",
    alignSelf: "flex-start",
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
  },
  inputArea: {
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground3,
    flexShrink: 0,
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStrokeAccessible}`,
    borderRadius: "var(--border-radius-large)",
    padding: "4px 6px 4px 16px",
    ":focus-within": {
      border: `1px solid ${tokens.colorBrandStroke1}`,
      boxShadow: `0 0 0 1px ${tokens.colorBrandStroke1}`,
    },
  },
  textInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground4,
    padding: "8px 0",
    "&::placeholder": {
      color: tokens.colorNeutralForeground3,
    },
  },
  sendButton: {
    minWidth: "var(--button-size-standard)",
    minHeight: "var(--button-size-standard)",
    borderRadius: tokens.borderRadiusMedium,
    border: "none",
    backgroundColor: "transparent",
    color: tokens.colorNeutralForeground3,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "var(--transition-ease-fast)",
    "&:hover:not(:disabled)": {
      backgroundColor: tokens.colorNeutralBackground3,
      color: tokens.colorNeutralForeground1,
    },
    "&:enabled": {
      color: tokens.colorNeutralForeground1,
      cursor: "pointer",
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
  },
});

export type CopilotThreadProps = Record<string, never>;

export const CopilotThread: React.FC<CopilotThreadProps> = () => {
  const styles = useStyles();
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  // Get optional tooltip context for mic cursor tooltip support
  const tooltipContext = useOptionalTooltipContext();
  const cursorTooltipHandlers = tooltipContext?.cursorTooltipHandlers;

  const handleSend = useCallback(() => {
    if (inputValue.trim()) {
      setInputValue("");
    }
  }, [inputValue]);

  // Combined keydown handler for both send and tooltip
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSend();
      }
      cursorTooltipHandlers?.onKeyDown(e);
    },
    [cursorTooltipHandlers, handleSend]
  );

  return (
    <div className={styles.chatContainer}>
      <div className={`${styles.messagesArea} right-drawer-scroll-container`}>
        <div className={styles.messageAgent}>
          {t("copilotThread.sample.agentIntro")}
        </div>
        <div className={styles.messageUser}>
          {t("copilotThread.sample.userQuestion")}
        </div>
        <div className={styles.messageAgent}>
          {t("copilotThread.sample.agentFollowUp")}
        </div>
      </div>

      <div className={styles.inputArea}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder={t("copilotThread.inputPlaceholder")}
            className={styles.textInput}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={cursorTooltipHandlers?.onKeyUp}
            onFocus={cursorTooltipHandlers?.onFocus}
            onBlur={cursorTooltipHandlers?.onBlur}
            onClick={cursorTooltipHandlers?.onClick}
            onMouseEnter={cursorTooltipHandlers?.onMouseEnter}
            onMouseMove={cursorTooltipHandlers?.onMouseMove}
            onMouseLeave={cursorTooltipHandlers?.onMouseLeave}
          />
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={!inputValue.trim()}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {isHovering && inputValue.trim() ? (
              <SendFilled style={{ fontSize: tokens.fontSizeBase500 }} />
            ) : (
              <SendRegular style={{ fontSize: tokens.fontSizeBase500 }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
