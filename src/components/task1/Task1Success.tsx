/**
 * Task1Success Component
 *
 * Success page shown after completing Task 1 (stopping ambient recording).
 */

import {
  FluentProvider,
  webLightTheme,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { CheckmarkCircle48Filled } from "@fluentui/react-icons";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: tokens.colorNeutralBackground1,
    fontFamily: "'Segoe UI', sans-serif",
  },
  icon: {
    color: tokens.colorPaletteGreenForeground1,
    marginBottom: tokens.spacingVerticalL,
  },
  title: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalM,
  },
  message: {
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorNeutralForeground2,
    textAlign: "center",
    maxWidth: "400px",
  },
});

export const Task1Success = () => {
  const styles = useStyles();

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <CheckmarkCircle48Filled className={styles.icon} />
        <h1 className={styles.title}>Task 1 Complete!</h1>
        <p className={styles.message}>
          You have successfully completed the ambient recording task.
        </p>
      </div>
    </FluentProvider>
  );
};

export default Task1Success;
