// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RemoteParticipantState } from '@internal/calling-stateful-client';
import {
  CommunicationUserKind,
  PhoneNumberKind,
  MicrosoftTeamsUserKind,
  UnknownIdentifierKind
} from '@azure/communication-common';
import { MeetingEndReason } from './MeetingEndReason';

/**
 * Participants of a Meeting.
 * @alpha
 */
export interface MeetingParticipant
  // extends Pick<ChatParticipant, 'shareHistoryTime'>,
  extends Pick<RemoteParticipantState, 'displayName' | 'state' | 'videoStreams' | 'isMuted' | 'isSpeaking'> {
  /** ID of the meeting participant. */
  id: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind;
  /** Describes the reason the meeting ended for this participant. */
  meetingEndReason?: MeetingEndReason;
}

export type MeetingParticipants = { [keys: string]: MeetingParticipant };

function meetingParticipantFromCallParticipant(callParticipant: RemoteParticipantState): MeetingParticipant {
  return {
    id: callParticipant.identifier,
    meetingEndReason: callParticipant.callEndReason,
    displayName: callParticipant.displayName,
    state: callParticipant.state,
    videoStreams: callParticipant.videoStreams,
    isMuted: callParticipant.isMuted,
    isSpeaking: callParticipant.isSpeaking
  };
}

function callParticipantFromMeetingParticipant(meetingParticipant: MeetingParticipant): RemoteParticipantState {
  return {
    identifier: meetingParticipant.id,
    callEndReason: meetingParticipant.meetingEndReason,
    displayName: meetingParticipant.displayName,
    state: meetingParticipant.state,
    videoStreams: meetingParticipant.videoStreams,
    isMuted: meetingParticipant.isMuted,
    isSpeaking: meetingParticipant.isSpeaking
  };
}

type RemoteCallParticipants = {
  [keys: string]: RemoteParticipantState;
};

export function meetingParticipantsFromCallParticipants(callParticipants: RemoteCallParticipants): MeetingParticipants {
  const meetingParticipants: MeetingParticipants = {};
  for (const [key, value] of Object.entries(callParticipants)) {
    meetingParticipants[key] = meetingParticipantFromCallParticipant(value);
  }
  return meetingParticipants;
}

export function callParticipantsFromMeetingParticipants(
  meetingParticipants: MeetingParticipants
): RemoteCallParticipants {
  const callParticipants: RemoteCallParticipants = {};
  for (const [key, value] of Object.entries(meetingParticipants)) {
    callParticipants[key] = callParticipantFromMeetingParticipant(value);
  }
  return callParticipants;
}
