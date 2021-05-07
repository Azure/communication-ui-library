// © Microsoft Corporation. All rights reserved.

export type WebUIParticipant = {
  userId: string;
  displayName?: string;
  state?: string;
  isScreenSharing?: boolean;
  isMuted?: boolean;
  isSpeaking?: boolean;
};
