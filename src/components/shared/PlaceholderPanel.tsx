import React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    padding: "16px",
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
  },
});

export interface PlaceholderPanelProps {
  message: string;
}

export const PlaceholderPanel: React.FC<PlaceholderPanelProps> = ({
  message,
}) => {
  const styles = useStyles();
  return <div className={styles.root}>{message}</div>;
};
