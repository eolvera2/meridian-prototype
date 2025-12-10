/**
 * MicrophoneInterface Types
 *
 * Type definitions for the MicrophoneInterface component.
 */

import type { DictationState, AmbientState } from "../../shared";

export type { DictationState, AmbientState };

export interface MicrophoneInterfaceProps {
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onCopilotClick?: () => void;
  onNotificationClick?: () => void;
  onMemoClick?: () => void;
  resetToggleButtons?: boolean;
  resetRecordingTime?: boolean;
  initialRecordingSeconds?: number; // Pre-populated recording time for patients with existing documents
  activeContent?:
    | "copilot"
    | "notifications"
    | "memos"
    | "transcription"
    | "extensions"
    | "library"
    | "settings"
    | null;
  worklistCollapsed?: boolean;
  documentVisible?: boolean;
  onDictationModeChange?: (isDictationActive: boolean) => void;
  onMicModeChange?: (mode: "dictation" | "ambient") => void;
  isDictationEnabled?: boolean;
  onDictationEnabledChange?: (enabled: boolean) => void;
  dictationState?: DictationState;
  ambientState?: AmbientState;
  onDictationStateChange?: (state: DictationState) => void;
  onAmbientStateChange?: (state: AmbientState) => void;
  disableNavigation?: boolean;
  onShowStopRecordingDialog?: () => void;
}
