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
 * Describes the reason the meeting ended.
 * @alpha
 */
export type MeetingEndReason = CallEndReason;

/**
 * @alpha
 */
export type MeetingErrors = unknown;

/**
 * Participants of a Meeting.
 * @alpha
 */
export interface MeetingParticipant
  extends Pick<ChatParticipant, 'shareHistoryTime'>,
    Pick<RemoteParticipantState, 'displayName' | 'state' | 'videoStreams' | 'isMuted' | 'isSpeaking'> {
  /** ID of the meeting participant. */
  id: CommunicationIdentifier;
  /** Describes the reason the meeting ended for this participant. */
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
  /** Current Meeting ID. */
  id: string;
  /** Active participants in the current meeting. */
  participants: { [key: string]: MeetingParticipant };
  /** Participants who have left the current meeting. */
  participantsEnded: { [keys: string]: MeetingParticipant };
  /** Reason the current meeting has ended. */
  meetingEndReason: MeetingEndReason;
}

/**
 * UI state pertaining to the Meeting Composite.
 * @alpha
 */
export interface MeetingAdapterUiState {
  /** Current page in the meeting composite. */
  page: MeetingCompositePage;
}

/**
 * State from the backend services that drives Meeting Composite.
 * @alpha
 */
export interface MeetingAdapterClientState extends Pick<CallAdapterClientState, 'devices'> {
  /** ID of the meeting participant using this Meeting Adapter. */
  userId: CommunicationIdentifier;
  /** Display name of the meeting participant using this Meeting Adapter. */
  displayName: string;
  /** Latest Errors that have occurred. */
  latestErrors: MeetingErrors;
  /** State of the current Meeting. */
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
