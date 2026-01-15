/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import type { SupportedLocale } from "./locales";
import { DEFAULT_LOCALE } from "./locales";
import type { LocaleResources, Messages, MedicalContentBundle } from "./resources";

type I18nValue = {
  locale: SupportedLocale;
  messages: Messages;
  medical: MedicalContentBundle;
  t: (key: string) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
};

const I18nContext = React.createContext<I18nValue | null>(null);

function getByPath(obj: unknown, key: string): unknown {
  const parts = key.split(".").filter(Boolean);
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

export const I18nProvider: React.FC<{ resources: LocaleResources; children: React.ReactNode }> = ({
  resources,
  children,
}) => {
  const locale = resources.locale ?? DEFAULT_LOCALE;

  const value = React.useMemo<I18nValue>(() => {
    const t = (key: string) => {
      const found = getByPath(resources.messages, key);
      return typeof found === "string" ? found : key;
    };

    const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
      return new Intl.DateTimeFormat(locale, options).format(date);
    };

    const formatTime = (date: Date, options?: Intl.DateTimeFormatOptions) => {
      return new Intl.DateTimeFormat(locale, options).format(date);
    };

    return {
      locale,
      messages: resources.messages,
      medical: resources.medical,
      t,
      formatDate,
      formatTime,
    };
  }, [locale, resources]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
