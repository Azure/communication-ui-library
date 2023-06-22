// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(rooms) */
import { Role } from '../permissions';
import { CommunicationParticipant } from './CommunicationParticipant';

/**
 * Calling participant's state, as reflected in the UI components.
 *
 * @public
 */
export type CallParticipantListParticipant = ParticipantListParticipant & {
  /** State of calling participant */
  state: ParticipantState;
  /** Whether calling participant is screen sharing */
  isScreenSharing?: boolean;
  /** Whether calling participant is muted */
  isMuted?: boolean;
  /** Whether calling participant is speaking */
  isSpeaking?: boolean;
  /* @conditional-compile-remove(rooms) */
  /** Role of participant in Rooms call */
  role?: Role;
  /* @conditional-compile-remove(raise-hands) */
  /** Whether calling participant is raised hand */
  raisedHand?: RaisedHand;
};

/* @conditional-compile-remove(raise-hands) */
/**
 * Raised hand state with order
 *
 * @public
 */
export type RaisedHand = {
  order: number;
};

/**
 * Participants displayed in a {@link ParticipantList}.
 *
 * @public
 */
export type ParticipantListParticipant = CommunicationParticipant & {
  /**
   * If true, local participant can remove this participant from the roster.
   */
  isRemovable: boolean;
};

/**
 * @public
 * The connection state of a call participant.
 */
export type ParticipantState =
  | 'Idle'
  | 'Connecting'
  | 'Ringing'
  | 'Connected'
  | 'Hold'
  | 'InLobby'
  | 'EarlyMedia'
  | 'Disconnected';
