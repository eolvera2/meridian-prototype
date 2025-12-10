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
} from "@fluentui/react-components";
import { LockClosedRegular } from "@fluentui/react-icons";
import { useAuth } from "./useAuth";

export const PasswordScreen: React.FC = () => {
  const { login } = useAuth();
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
        setError("Incorrect password. Please try again.");
        setPassword("");
      } else {
        // Redirect to intended hash
        window.location.hash = intendedHash || "#/home";
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackgroundPressed} 100%)`,
          padding: "20px",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "40px",
            textAlign: "center",
            boxShadow: tokens.shadow28,
          }}
        >
          <div
            style={{
              marginBottom: "24px",
            }}
          >
            <Body1
              style={{
                color: tokens.colorNeutralForeground3,
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              Enter the provided password to continue
            </Body1>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(_, data) => setPassword(data.value)}
                contentBefore={<LockClosedRegular />}
                style={{ width: "100%" }}
                size="large"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <Body1
                style={{
                  color: tokens.colorPaletteRedForeground1,
                  marginBottom: "16px",
                  display: "block",
                }}
              >
                {error}
              </Body1>
            )}

            <Button
              type="submit"
              appearance="primary"
              size="large"
              style={{ width: "100%" }}
              disabled={isLoading || !password}
            >
              {isLoading ? "Verifying..." : "Continue"}
            </Button>
          </form>

          <Body1
            style={{
              color: tokens.colorNeutralForeground4,
              marginTop: "24px",
              fontSize: "12px",
            }}
          >
            Session expires after 2 hours of inactivity
          </Body1>
        </Card>
      </div>
    </FluentProvider>
  );
};

export default PasswordScreen;
