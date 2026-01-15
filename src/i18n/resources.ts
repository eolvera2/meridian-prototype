import enUSMedical from "../locales/en-US/medical-content.json";
import enCAMedical from "../locales/en-CA/medical-content.json";
import enGBMedical from "../locales/en-GB/medical-content.json";

// NOTE: These are initial scaffolding bundles.
import enUSMessages from "../locales/en-US/messages.json";
import enCAMessages from "../locales/en-CA/messages.json";
import enGBMessages from "../locales/en-GB/messages.json";

import enUSDocStack from "../locales/en-US/document-stack.json";
import enCADocStack from "../locales/en-CA/document-stack.json";
import enGBDocStack from "../locales/en-GB/document-stack.json";

import type { SupportedLocale } from "./locales";

export type Messages = Record<string, unknown>;

export type MedicalContentBundle = {
  sections: Record<string, string>;
  documentTypes: Record<string, string>;
  medicalContent: Record<string, unknown>;
};

export type DocumentStackBundle = Record<string, unknown>;

export type LocaleResources = {
  locale: SupportedLocale;
  messages: Messages;
  medical: MedicalContentBundle;
  documentStack: DocumentStackBundle;
};

export function getLocaleResources(locale: SupportedLocale): LocaleResources {
  switch (locale) {
    case "en-CA":
      return {
        locale,
        messages: enCAMessages as Messages,
        medical: enCAMedical as unknown as MedicalContentBundle,
        documentStack: enCADocStack as DocumentStackBundle,
      };
    case "en-GB":
      return {
        locale,
        messages: enGBMessages as Messages,
        medical: enGBMedical as unknown as MedicalContentBundle,
        documentStack: enGBDocStack as DocumentStackBundle,
      };
    case "en-US":
    default:
      return {
        locale: "en-US",
        messages: enUSMessages as Messages,
        medical: enUSMedical as unknown as MedicalContentBundle,
        documentStack: enUSDocStack as DocumentStackBundle,
      };
  }
}
