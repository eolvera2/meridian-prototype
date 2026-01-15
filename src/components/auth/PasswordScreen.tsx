/**
 * PasswordScreen Component
 *
 * A login screen that requires password to access the app.
 */

import React, { useState, type FormEvent } from "react";
import {
  FluentProvider,
  webLightTheme,
  Input,
  Button,
  Card,
  Body1,
  tokens,
  makeStyles,
} from "@fluentui/react-components";
import { LockClosedRegular } from "@fluentui/react-icons";
import { useAuth } from "./useAuth";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { useI18n } from "../../i18n/I18nContext";

const useStyles = makeStyles({
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackgroundPressed} 100%)`,
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    textAlign: "center",
    boxShadow: tokens.shadow28,
  },
  headerContainer: {
    marginBottom: "var(--spacing-huge)",
  },
  heading: {
    color: tokens.colorNeutralForeground3,
    fontWeight: 600,
    lineHeight: 1.2,
  },
  inputContainer: {
    marginBottom: "16px",
  },
  fullWidth: {
    width: "100%",
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
    marginBottom: "16px",
    display: "block",
  },
  footerText: {
    color: tokens.colorNeutralForeground4,
    marginTop: "24px",
    fontSize: tokens.fontSizeBase200,
  },
});

export const PasswordScreen: React.FC = () => {
  const styles = useStyles();
  const { login } = useAuth();
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Store intended hash on mount
  const [intendedHash] = useState(() => window.location.hash);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Small delay for UX
    setTimeout(() => {
      const success = login(password);
      if (!success) {
        setError(t("auth.passwordScreen.errorIncorrectPassword"));
        setPassword("");
      } else {
        // Redirect to intended hash
        window.location.hash = intendedHash || `#/${DEFAULT_LOCALE}/home`;
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.headerContainer}>
            <h1 className={styles.heading}>
              {t("auth.passwordScreen.heading")}
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <Input
                type="password"
                placeholder={t("auth.passwordScreen.passwordPlaceholder")}
                value={password}
                onChange={(_, data) => setPassword(data.value)}
                contentBefore={<LockClosedRegular />}
                className={styles.fullWidth}
                size="large"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <Body1 className={styles.errorText}>
                {error}
              </Body1>
            )}

            <Button
              type="submit"
              appearance="primary"
              size="large"
              className={styles.fullWidth}
              disabled={isLoading || !password}
            >
              {isLoading
                ? t("auth.passwordScreen.verifying")
                : t("common.continue")}
            </Button>
          </form>

          <Body1 className={styles.footerText}>
            {t("auth.passwordScreen.sessionExpires")}
          </Body1>
        </Card>
      </div>
    </FluentProvider>
  );
};

export default PasswordScreen;
