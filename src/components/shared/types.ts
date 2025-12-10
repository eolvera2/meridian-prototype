export interface WorklistItem {
  id: string;
  name: string;
  reason?: string;
  details?: string;
  time?: string;
  group?: string;
  initialRecordingSeconds?: number; // Pre-populated recording time for patients with existing documents
  signed?: boolean; // Whether the patient record is signed
  status?: string; // Status text (e.g., "Active", "Pending")
  lastModified?: string; // Last modified timestamp
}

export type RightDrawerContent =
  | "copilot"
  | "notifications"
  | "memos"
  | "transcription"
  | "extensions"
  | "library"
  | "settings";

// Microphone state types for separated Dictation and Ambient modes
export type DictationState = "on" | "off";
export type AmbientState = "stop" | "recording" | "pause";

export interface MicrophoneState {
  dictationState: DictationState;
  ambientState: AmbientState;
}
