// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { CommunicationIdentifier } from '@azure/communication-common';
import { MeetingEndReason } from './MeetingEndReason';

export interface MeetingParticipant
  extends Pick<RemoteParticipantState, 'displayName' | 'state' | 'videoStreams' | 'isMuted' | 'isSpeaking'> {
  id: CommunicationIdentifier;
  meetingEndReason?: MeetingEndReason;
}

export function createMeetingParticipant(callParticipant: RemoteParticipantState): MeetingParticipant {
  const { displayName, state, videoStreams, isMuted, isSpeaking, identifier, callEndReason } = callParticipant;

  return { id: identifier, meetingEndReason: callEndReason, displayName, state, videoStreams, isMuted, isSpeaking };
}

export function convertCallParticipantsToMeetingParticipants(callParticipants: {
  [keys: string]: RemoteParticipantState;
}): { [keys: string]: MeetingParticipant } {
  const meetingParticipants: { [keys: string]: MeetingParticipant } = {};
  for (const [key, value] of Object.entries(callParticipants)) {
    meetingParticipants[key] = createMeetingParticipant(value);
  }
  return meetingParticipants;
}
