import type { DocumentSection } from "../components/content/document";
import type { MedicalContentBundle } from "../i18n/resources";
import enGBMedicalJson from "../locales/en-GB/medical-content.json";

/**
 * Standard order and structure for progress note sections in en-GB locale.
 * Defines the clinical documentation flow according to UK medical standards.
 * 
 * @constant
 */
export const EN_GB_PROGRESS_NOTE_SECTION_ORDER = [
  {
    id: "presentingComplaintsOrIssue",
    title: "Presenting complaints or issue",
  },
  {
    id: "socialContext",
    title: "Social context",
  },
  {
    id: "familyHistory",
    title: "Family history",
  },
  {
    id: "allergiesAndAdverseReactions",
    title: "Allergies and adverse reactions",
  },
  {
    id: "medicationsAndMedicalDevices",
    title: "Medications and medical devices",
  },
  {
    id: "vaccinations",
    title: "Vaccinations",
  },
  {
    id: "clinicalReviewOfSystems",
    title: "Clinical review of systems",
  },
  {
    id: "examinationFindings",
    title: "Examination findings",
  },
  {
    id: "investigationResults",
    title: "Investigation results",
  },
  {
    id: "procedure",
    title: "Procedure",
  },
  {
    id: "assessmentAndPlan",
    title: "Assessment and plan",
  },
] as const;

const DEFAULT_EN_GB_MEDICAL =
  enGBMedicalJson as unknown as MedicalContentBundle;

/**
 * Retrieves health check content for a specific section from the medical bundle.
 * 
 * @param medical - The medical content bundle
 * @param sectionId - The ID of the section to retrieve
 * @returns The health check content string, or empty string if not found
 * @internal
 */
function getEnGbHealthCheckValue(
  medical: MedicalContentBundle,
  sectionId: string
): string {
  const healthCheck =
    medical.medicalContent && typeof medical.medicalContent === "object"
      ? (medical.medicalContent as Record<string, unknown>)["healthCheck"]
      : undefined;

  if (!healthCheck || typeof healthCheck !== "object") {
    return "";
  }

  const value = (healthCheck as Record<string, unknown>)[sectionId];
  return typeof value === "string" ? value : "";
}

/**
 * Retrieves the localized title for a section, falling back to default if not found.
 * 
 * @param medical - The medical content bundle
 * @param sectionId - The ID of the section
 * @param fallbackTitle - The default title to use if localized version not found
 * @returns The section title (localized or fallback)
 * @internal
 */
function getEnGbSectionTitle(
  medical: MedicalContentBundle,
  sectionId: string,
  fallbackTitle: string
): string {
  const value = medical.sections?.[sectionId];
  return typeof value === "string" && value.trim() ? value : fallbackTitle;
}

/**
 * Creates a complete set of progress note sections for en-GB locale.
 * 
 * Generates document sections according to UK medical documentation standards,
 * with optional health check content and pre-checked states.
 * 
 * @param options - Configuration options
 * @param options.isEmpty - If true, sections will have empty content. Default: false
 * @param options.checked - If true, all sections will be pre-checked. Default: false
 * @param options.medical - Medical content bundle to use. Defaults to en-GB bundle
 * @returns Array of DocumentSection objects in standardized order
 * 
 * @example
 * ```ts
 * // Create empty sections
 * const sections = createEnGbProgressNoteSections({ isEmpty: true });
 * 
 * // Create pre-populated sections
 * const sections = createEnGbProgressNoteSections({ 
 *   isEmpty: false, 
 *   checked: true,
 *   medical: customMedicalBundle 
 * });
 * ```
 */
export function createEnGbProgressNoteSections(options?: {
  isEmpty?: boolean;
  checked?: boolean;
  medical?: MedicalContentBundle;
}): DocumentSection[] {
  const isEmpty = options?.isEmpty ?? false;
  const checked = options?.checked ?? false;
  const medical = options?.medical ?? DEFAULT_EN_GB_MEDICAL;

  return EN_GB_PROGRESS_NOTE_SECTION_ORDER.map((section) => ({
    id: section.id,
    title: getEnGbSectionTitle(medical, section.id, section.title),
    content: isEmpty ? "" : getEnGbHealthCheckValue(medical, section.id),
    checked,
  }));
}
