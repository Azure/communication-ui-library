// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState, RemoteParticipantState } from '@internal/calling-stateful-client';
import { ChatThreadClientState } from '@internal/chat-stateful-client';
import { ChatParticipant } from '@azure/communication-chat';
import { CallEndReason } from '@azure/communication-calling';
import { CommunicationIdentifier } from '@azure/communication-common';
import { CallAdapterClientState } from '../../CallComposite';

/**
 * Page state the Meeting composite could be in.
 * @alpha
 */
export type MeetingCompositePage = 'configuration' | 'meeting' | 'error' | 'errorJoiningTeamsMeeting' | 'removed';

/**
 * Reason meeting was ended.
 * @alpha
 */
export type MeetingEndReason = CallEndReason;

export type MeetingErrors = unknown;

/**
 * Participants of a Meeting.
 * @alpha
 */
export interface MeetingParticipant
  extends Pick<ChatParticipant, 'shareHistoryTime'>,
    Pick<RemoteParticipantState, 'displayName' | 'state' | 'videoStreams' | 'isMuted' | 'isSpeaking'> {
  id: CommunicationIdentifier;
  meetingEndReason: MeetingEndReason;
}

/**
 * State of a single Meeting.
 * @alpha
 */
export interface MeetingState
  extends Pick<
      CallState,
      | 'callerInfo'
      | 'state'
      | 'isMuted'
      | 'isScreenSharingOn'
      | 'localVideoStreams'
      | 'transcription'
      | 'recording'
      | 'transfer'
      | 'screenShareRemoteParticipant'
      | 'startTime'
      | 'endTime'
    >,
    Pick<
      ChatThreadClientState,
      'chatMessages' | 'threadId' | 'properties' | 'readReceipts' | 'typingIndicators' | 'latestReadTime'
    > {
  userId: CommunicationIdentifier;
  displayName: string;
  participants: { [key: string]: MeetingParticipant };
  participantsEnded: { [keys: string]: MeetingParticipant };
  meetingEndReason: MeetingEndReason;
}

/**
 * UI state pertaining to the Meeting Composite.
 * @alpha
 */
export interface MeetingAdapterUiState {
  page: MeetingCompositePage;
}

/**
 * State from the backend services that drives Meeting Composite.
 * @alpha
 */
export interface MeetingAdapterClientState extends Pick<CallAdapterClientState, 'devices'> {
  userId: CommunicationIdentifier;
  displayName: string;
  latestErrors: MeetingErrors;
  meeting: MeetingState;
}

/**
 * Meeting State is a combination of Stateful Chat and Stateful Calling clients with some
 * state specific to meetings only.
 * Stateful items like Participants that apply to both calling and chat are intelligently
 * combined into one to suit the purpose of a Meeting.
 *
 * @alpha
 */
export interface MeetingAdapterState extends MeetingAdapterUiState, MeetingAdapterClientState {}
