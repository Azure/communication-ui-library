// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * `CommunicationParticipant` type represents a Chat or Calling participant's state
 */
export type CommunicationParticipant = {
  userId: string;
  displayName?: string;
  state?: 'Idle' | 'Connecting' | 'Ringing' | 'Connected' | 'Hold' | 'InLobby' | 'EarlyMedia' | 'Disconnected';
  isScreenSharing?: boolean;
  isMuted?: boolean;
  isSpeaking?: boolean;
};
