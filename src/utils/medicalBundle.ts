import type { MedicalContentBundle } from "../i18n/resources";

/**
 * Safely retrieves a medical content string from a medical content bundle.
 * 
 * @param medical - The medical content bundle containing medical terminology
 * @param key - The key to look up in the medical content
 * @returns The medical content string if found and is a string type, undefined otherwise
 * 
 * @example
 * ```ts
 * const diagnosis = getMedicalContentString(medical, "diagnosis.hypertension");
 * ```
 */
export function getMedicalContentString(
  medical: MedicalContentBundle,
  key: string
): string | undefined {
  const medicalContent = medical.medicalContent;
  if (!medicalContent || typeof medicalContent !== "object") {
    return undefined;
  }

  const value = (medicalContent as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}
