// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationParticipant } from './CommunicationParticipant';

/**
 * `CommunicationCallingParticipant` represents a Calling participant's state
 */
export interface CommunicationCallingParticipant extends CommunicationParticipant {
  state: 'Idle' | 'Connecting' | 'Ringing' | 'Connected' | 'Hold' | 'InLobby' | 'EarlyMedia' | 'Disconnected';
  isScreenSharing?: boolean;
  isMuted?: boolean;
  isSpeaking?: boolean;
}
