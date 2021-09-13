// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState } from '@internal/calling-stateful-client';
import { ChatThreadClientState } from '@internal/chat-stateful-client';
import { MeetingParticipant } from './MeetingParticipants';
import { MeetingEndReason } from './MeetingEndReason';
import { convertCallParticipantsToMeetingParticipants } from '../state/MeetingParticipants';

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
  meetingEndReason?: MeetingEndReason;
}

export function generateMeetingState(callState: CallState, chatState: ChatThreadClientState): MeetingState {
  const {
    callerInfo,
    state,
    isMuted,
    isScreenSharingOn,
    localVideoStreams,
    transcription,
    recording,
    transfer,
    screenShareRemoteParticipant,
    startTime,
    endTime,
    id,
    remoteParticipants,
    remoteParticipantsEnded,
    callEndReason
  } = callState;

  // Only use participants from the call in a meeting
  const participants = remoteParticipants;
  const participantsEnded = remoteParticipantsEnded;

  const { chatMessages, threadId, properties, readReceipts, typingIndicators, latestReadTime } = chatState;

  return {
    id,
    callerInfo,
    state,
    isMuted,
    isScreenSharingOn,
    localVideoStreams,
    transcription,
    recording,
    transfer,
    screenShareRemoteParticipant,
    startTime,
    endTime,
    chatMessages,
    threadId,
    properties,
    readReceipts,
    typingIndicators,
    latestReadTime,
    participants: convertCallParticipantsToMeetingParticipants(participants),
    participantsEnded: convertCallParticipantsToMeetingParticipants(participantsEnded),
    meetingEndReason: callEndReason
  };
}

export function mergeChatStateIntoMeetingState(
  chatState: ChatThreadClientState,
  meetingState: MeetingState
): MeetingState {
  const {
    callerInfo,
    state,
    isMuted,
    isScreenSharingOn,
    localVideoStreams,
    transcription,
    recording,
    transfer,
    screenShareRemoteParticipant,
    startTime,
    endTime,
    id,
    participants,
    participantsEnded,
    meetingEndReason
  } = meetingState;

  const { chatMessages, threadId, properties, readReceipts, typingIndicators, latestReadTime } = chatState;

  return {
    id,
    callerInfo,
    state,
    isMuted,
    isScreenSharingOn,
    localVideoStreams,
    transcription,
    recording,
    transfer,
    screenShareRemoteParticipant,
    startTime,
    endTime,
    chatMessages,
    threadId,
    properties,
    readReceipts,
    typingIndicators,
    latestReadTime,
    participants,
    participantsEnded,
    meetingEndReason
  };
}

export function mergeCallStateIntoMeetingState(callState: CallState, meetingState: MeetingState): MeetingState {
  const {
    callerInfo,
    state,
    isMuted,
    isScreenSharingOn,
    localVideoStreams,
    transcription,
    recording,
    transfer,
    screenShareRemoteParticipant,
    startTime,
    endTime,
    id,
    remoteParticipants,
    remoteParticipantsEnded,
    callEndReason
  } = callState;

  const participants = remoteParticipants;
  const participantsEnded = remoteParticipantsEnded;

  const { chatMessages, threadId, properties, readReceipts, typingIndicators, latestReadTime } = meetingState;

  return {
    id,
    callerInfo,
    state,
    isMuted,
    isScreenSharingOn,
    localVideoStreams,
    transcription,
    recording,
    transfer,
    screenShareRemoteParticipant,
    startTime,
    endTime,
    chatMessages,
    threadId,
    properties,
    readReceipts,
    typingIndicators,
    latestReadTime,
    participants: convertCallParticipantsToMeetingParticipants(participants),
    participantsEnded: convertCallParticipantsToMeetingParticipants(participantsEnded),
    meetingEndReason: callEndReason
  };
}
