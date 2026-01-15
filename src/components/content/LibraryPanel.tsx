import React from "react";
import { Card, makeStyles, tokens } from "@fluentui/react-components";
import { useI18n } from "../../i18n/I18nContext";

export interface LibraryPanelProps {
  onPromptClick?: (prompt: string) => void;
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-xxxlarge)",
    padding: "var(--spacing-xxxlarge)",
  },
  card: {
    padding: "0",
    borderRadius: "var(--border-radius-medium)",
    boxShadow:
      "0px 8px 16px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)",
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: "hidden",
  },
  sectionHeader: {
    padding: "12px 16px 8px 16px",
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600,
    lineHeight: "16px",
  },
  promptList: {
    display: "flex",
    flexDirection: "column",
  },
  promptItem: {
    padding: "10px 16px 10px 24px",
    fontSize: tokens.fontSizeBase300,
    fontWeight: 400,
    lineHeight: "20px",
    color: tokens.colorNeutralForeground1,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

const promptKeys = [
  "library.prompts.applyMyNoteStyle",
  "library.prompts.changePronounsToHeHim",
  "library.prompts.changePronounsToSheHer",
  "library.prompts.changePronounsToTheyThem",
  "library.prompts.draftAfterVisitSummary",
  "library.prompts.draftReferralLetter",
  "library.prompts.getCoaching",
  "library.prompts.summarizeEvidence",
  "library.prompts.summarizeNote",
] as const;

export const LibraryPanel: React.FC<LibraryPanelProps> = ({
  onPromptClick,
}) => {
  const styles = useStyles();
  const { t } = useI18n();

  const handlePromptClick = (promptKey: (typeof promptKeys)[number]) => {
    onPromptClick?.(t(promptKey));
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.sectionHeader}>{t("library.promptsHeader")}</div>
        <div className={styles.promptList}>
          {promptKeys.map((promptKey) => (
            <div
              key={promptKey}
              className={styles.promptItem}
              onClick={() => handlePromptClick(promptKey)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handlePromptClick(promptKey);
                }
              }}
            >
              {t(promptKey)}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
