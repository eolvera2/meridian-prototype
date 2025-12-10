/**
 * TranscriptPanel Types
 *
 * Type definitions for the TranscriptPanel component.
 */

/**
 * Highlighted medication in a transcript message.
 */
export interface HighlightedMedication {
  name: string;
  dosage: string;
}

/**
 * A single message in a transcript recording.
 */
export interface TranscriptMessage {
  id: string;
  speaker: string;
  speakerInitials: string;
  timestamp: string;
  content: string;
  ordersDetected?: string;
  highlightedMedication?: HighlightedMedication;
}

/**
 * A recording containing multiple transcript messages.
 */
export interface Recording {
  id: string;
  name: string;
  date: string;
  time: string;
  messages: TranscriptMessage[];
  isExpanded: boolean;
}
