/**
 * Worklist Types
 *
 * Type definitions for the Worklist component.
 */

export interface WorklistProps {
  isCollapsed?: boolean;
  onPatientSelect?: (patientId: string) => void;
  onAddPatient?: () => void;
  onMicButtonClick?: (patientId: string) => void;
}

export interface WorklistItem {
  id: string;
  name: string;
  reason: string;
  details: string;
  time?: string;
  status?: string;
  signed?: boolean;
  lastModified?: string;
  group?: string;
}

export type SortOrder = "none" | "asc" | "desc";
