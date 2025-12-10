import React from "react";
import { Card, makeStyles, tokens } from "@fluentui/react-components";

export interface LibraryPanelProps {
  onPromptClick?: (prompt: string) => void;
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px",
  },
  card: {
    padding: "0",
    borderRadius: "4px",
    boxShadow:
      "0px 8px 16px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)",
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: "hidden",
  },
  sectionHeader: {
    padding: "12px 16px 8px 16px",
    color: tokens.colorNeutralForeground3,
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: "16px",
  },
  promptList: {
    display: "flex",
    flexDirection: "column",
  },
  promptItem: {
    padding: "10px 16px 10px 24px",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    color: tokens.colorNeutralForeground1,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

const prompts = [
  "Apply my note style",
  "Change pronouns to he him",
  "Change pronouns to she her",
  "Change pronouns to they them",
  "Draft after visit summary",
  "Draft referral letter",
  "Get coaching",
  "Summarize evidence",
  "Summarize note",
];

export const LibraryPanel: React.FC<LibraryPanelProps> = ({
  onPromptClick,
}) => {
  const styles = useStyles();

  const handlePromptClick = (prompt: string) => {
    console.log("Prompt clicked:", prompt);
    onPromptClick?.(prompt);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.sectionHeader}>Prompts</div>
        <div className={styles.promptList}>
          {prompts.map((prompt) => (
            <div
              key={prompt}
              className={styles.promptItem}
              onClick={() => handlePromptClick(prompt)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handlePromptClick(prompt);
                }
              }}
            >
              {prompt}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
