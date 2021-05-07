// © Microsoft Corporation. All rights reserved.

export type WebUIParticipant = {
  userId: string;
  displayName?: string;
  state?: 'Idle' | 'Connecting' | 'Ringing' | 'Connected' | 'Hold' | 'InLobby' | 'EarlyMedia' | 'Disconnected';
  isScreenSharing?: boolean;
  isMuted?: boolean;
  isSpeaking?: boolean;
};
