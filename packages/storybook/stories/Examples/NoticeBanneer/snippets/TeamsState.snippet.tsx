export interface TeamsState {
  recordingEnabled: boolean;
  recordingPreviouslyEnabled: boolean;
  transcriptionEnabled: boolean;
  transcriptionPreviouslyEnabled: boolean;
}

export function toggleRecording(s: TeamsState): TeamsState {
  return {
    recordingEnabled: !s.recordingEnabled,
    recordingPreviouslyEnabled: s.recordingEnabled,
    transcriptionEnabled: s.transcriptionEnabled,
    transcriptionPreviouslyEnabled: s.transcriptionPreviouslyEnabled
  };
}

export function toggleTranscription(s: TeamsState): TeamsState {
  return {
    recordingEnabled: s.recordingEnabled,
    recordingPreviouslyEnabled: s.recordingPreviouslyEnabled,
    transcriptionEnabled: !s.transcriptionEnabled,
    transcriptionPreviouslyEnabled: s.transcriptionEnabled
  };
}
