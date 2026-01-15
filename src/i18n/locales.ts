export const DEFAULT_LOCALE = "en-US" as const;

export const SUPPORTED_LOCALES = ["en-US", "en-CA", "en-GB"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

export function normalizeLocale(input: string | undefined | null): string {
  const raw = (input ?? "").trim();
  if (!raw) return DEFAULT_LOCALE;

  const parts = raw.replace(/_/g, "-").split("-").filter(Boolean);
  if (parts.length === 1) {
    // e.g. "en" -> "en-US" (default region)
    return parts[0]!.toLowerCase() === "en" ? DEFAULT_LOCALE : parts[0]!;
  }

  const language = parts[0]!.toLowerCase();
  const region = parts[1]!.toUpperCase();
  return `${language}-${region}`;
}

export function coerceSupportedLocale(input: string | undefined | null): SupportedLocale {
  const normalized = normalizeLocale(input);
  if (isSupportedLocale(normalized)) return normalized;

  // Known alias support (optional)
  if (normalized.toLowerCase() === "en-uk") return "en-GB";

  return DEFAULT_LOCALE;
}

export function fallbackChain(locale: SupportedLocale): SupportedLocale[] {
  switch (locale) {
    case "en-CA":
      return ["en-CA", "en-US"];
    case "en-GB":
      return ["en-GB", "en-US"];
    case "en-US":
    default:
      return ["en-US"];
  }
}
