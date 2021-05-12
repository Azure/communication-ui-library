// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationParticipant } from './CommunicationParticipant';

/**
 * `CommunicationParticipant` type represents a Chat or Calling participant's state
 */
export type CommunicationCallingParticipant = CommunicationParticipant & {
  state: 'Idle' | 'Connecting' | 'Ringing' | 'Connected' | 'Hold' | 'InLobby' | 'EarlyMedia' | 'Disconnected';
  isScreenSharing?: boolean;
  isMuted?: boolean;
  isSpeaking?: boolean;
};
