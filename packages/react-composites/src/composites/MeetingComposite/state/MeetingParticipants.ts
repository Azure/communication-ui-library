// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { CommunicationIdentifier } from '@azure/communication-common';
import { MeetingEndReason } from './MeetingEndReason';

/**
 * Participants of a Meeting.
 * @alpha
 */
export interface MeetingParticipant
  // extends Pick<ChatParticipant, 'shareHistoryTime'>,
  extends Pick<RemoteParticipantState, 'displayName' | 'state' | 'videoStreams' | 'isMuted' | 'isSpeaking'> {
  /** ID of the meeting participant. */
  id: CommunicationIdentifier;
  /** Describes the reason the meeting ended for this participant. */
  meetingEndReason?: MeetingEndReason;
}

export type MeetingParticipants = { [keys: string]: MeetingParticipant };

function meetingParticipantFromCallParticipant(callParticipant: RemoteParticipantState): MeetingParticipant {
  const { displayName, state, videoStreams, isMuted, isSpeaking, identifier, callEndReason } = callParticipant;

  return { id: identifier, meetingEndReason: callEndReason, displayName, state, videoStreams, isMuted, isSpeaking };
}

export function meetingParticipantsFromCallParticipants(callParticipants: {
  [keys: string]: RemoteParticipantState;
}): MeetingParticipants {
  const meetingParticipants: MeetingParticipants = {};
  for (const [key, value] of Object.entries(callParticipants)) {
    meetingParticipants[key] = meetingParticipantFromCallParticipant(value);
  }
  return meetingParticipants;
}
