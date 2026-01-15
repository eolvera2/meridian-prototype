import React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { Settings } from "./settings";

const useStyles = makeStyles({
  settingsPanel: {
    flex: 1,
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground2,
    boxShadow:
      "0px 1px 2px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: "var(--z-index-content)",
    height: "100%",
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    minHeight: 0,

    "@media (max-width: 768px)": {
      width: "100%",
      zIndex: "var(--z-index-navigation-secondary)",
      position: "relative",
    },
  },

  header: {
    height: "64px",
    minHeight: "64px",
    padding: "0 16px 0 24px",
    display: "flex",
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0,
  },

  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },

  body: {
    flex: 1,
    overflow: "auto",
    minHeight: 0,
  },
});

interface SettingsPanelProps {
  activeSubPage?: string | null;
  onSubPageChange?: (page: string | null) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  activeSubPage,
  onSubPageChange,
}) => {
  const styles = useStyles();
  const [title, setTitle] = React.useState("Settings");
  const showHeader = Boolean(title);

  return (
    <div className={styles.settingsPanel}>
      {showHeader && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}
      <div className={styles.body}>
        <Settings
          onTitleChange={setTitle}
          activeSubPage={activeSubPage}
          onSubPageChange={onSubPageChange}
        />
      </div>
    </div>
  );
};
