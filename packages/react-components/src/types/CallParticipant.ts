// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationParticipant } from './CommunicationParticipant';

/**
 * Calling participant's state, as reflected in the UI components.
 *
 * @public
 */
export type CallParticipant = CommunicationParticipant & {
  /** State of calling participant */
  state: 'Idle' | 'Connecting' | 'Ringing' | 'Connected' | 'Hold' | 'InLobby' | 'EarlyMedia' | 'Disconnected';
  /** Whether calling participant is screen sharing */
  isScreenSharing?: boolean;
  /** Whether calling participant is muted */
  isMuted?: boolean;
  /** Whether calling participant is speaking */
  isSpeaking?: boolean;
};
