// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState, CallState, RemoteParticipantState } from '@internal/calling-stateful-client';
import { ChatClientState, ChatThreadClientState } from '@internal/chat-stateful-client';
import { ChatParticipant } from '@azure/communication-chat';
import { CallEndReason } from '@azure/communication-calling';
import { CommunicationIdentifier } from '@azure/communication-common';

export type NonApplicableClientState =
  | 'participants'
  | 'userId'
  | 'calls'
  | 'callsEnded'
  | 'incomingCalls'
  | 'incomingCallsEnded';

/**
 * Meeting State is a combination of Stateful Chat and Stateful Calling clients.
 * Stateful items like Participants that apply to both calling and chat are intelligently
 * combined into one to suit the purpose of a Meeting.
 */
export interface MeetingAdapterState
  extends Omit<CallClientState, NonApplicableClientState>,
    Omit<ChatClientState, NonApplicableClientState> {
  meetings: { [key: string]: MeetingState };
  meetingsEnded: MeetingState[];
}

export type MeetingEndReason = CallEndReason;

export type NonApplicableParticipantProps = 'identifier' | 'id' | 'callEndReason';

export interface MeetingParticipant
  extends Omit<ChatParticipant, NonApplicableParticipantProps>,
    Omit<RemoteParticipantState, NonApplicableParticipantProps> {
  id: CommunicationIdentifier;
  meetingEndReason: MeetingEndReason;
}

export type NonApplicableState =
  | 'id'
  | 'userId'
  | 'participants'
  | 'remoteParticipants'
  | 'remoteParticipantsEnded'
  | 'callEndReason'
  | 'direction';

export interface MeetingState
  extends Omit<CallState, NonApplicableState>,
    Omit<ChatThreadClientState, NonApplicableState> {
  userId: CommunicationIdentifier;
  participants: { [key: string]: MeetingParticipant };
  participantsEnded: { [keys: string]: MeetingParticipant };
  meetingEndReason: MeetingEndReason;
}
