// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState } from '@internal/calling-stateful-client';
import { ChatThreadClientState } from '@internal/chat-stateful-client';
import { MeetingParticipant } from './MeetingParticipants';
import { MeetingEndReason } from './MeetingEndReason';
import { meetingParticipantsFromCallParticipants } from '../state/MeetingParticipants';

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
  return {
    // Properties from call state
    id: callState.id,
    callerInfo: callState.callerInfo,
    state: callState.state,
    isMuted: callState.isMuted,
    isScreenSharingOn: callState.isScreenSharingOn,
    localVideoStreams: callState.localVideoStreams,
    transcription: callState.transcription,
    recording: callState.recording,
    transfer: callState.transfer,
    screenShareRemoteParticipant: callState.screenShareRemoteParticipant,
    startTime: callState.startTime,
    endTime: callState.endTime,
    meetingEndReason: callState.callEndReason,
    // For meetings we only use participants from the call in a meeting
    participants: meetingParticipantsFromCallParticipants(callState.remoteParticipants),
    participantsEnded: meetingParticipantsFromCallParticipants(callState.remoteParticipantsEnded),

    // Properties from chat state
    chatMessages: chatState.chatMessages,
    threadId: chatState.threadId,
    properties: chatState.properties,
    readReceipts: chatState.readReceipts,
    typingIndicators: chatState.typingIndicators,
    latestReadTime: chatState.latestReadTime
  };
}

export function mergeChatStateIntoMeetingState(
  chatState: ChatThreadClientState,
  meetingState: MeetingState
): MeetingState {
  return {
    // Properties from meeting state to retain
    id: meetingState.id,
    callerInfo: meetingState.callerInfo,
    state: meetingState.state,
    isMuted: meetingState.isMuted,
    isScreenSharingOn: meetingState.isScreenSharingOn,
    localVideoStreams: meetingState.localVideoStreams,
    transcription: meetingState.transcription,
    recording: meetingState.recording,
    transfer: meetingState.transfer,
    screenShareRemoteParticipant: meetingState.screenShareRemoteParticipant,
    startTime: meetingState.startTime,
    endTime: meetingState.endTime,
    participants: meetingState.participants,
    participantsEnded: meetingState.participantsEnded,
    meetingEndReason: meetingState.meetingEndReason,

    // New properties from chat state to be merged in
    chatMessages: chatState.chatMessages,
    threadId: chatState.threadId,
    properties: chatState.properties,
    readReceipts: chatState.readReceipts,
    typingIndicators: chatState.typingIndicators,
    latestReadTime: chatState.latestReadTime
  };
}

export function mergeCallStateIntoMeetingState(callState: CallState, meetingState: MeetingState): MeetingState {
  return {
    // Properties from meeting state to retain
    chatMessages: meetingState.chatMessages,
    threadId: meetingState.threadId,
    properties: meetingState.properties,
    readReceipts: meetingState.readReceipts,
    typingIndicators: meetingState.typingIndicators,
    latestReadTime: meetingState.latestReadTime,

    // New properties from call state to be merged in
    id: callState.id,
    callerInfo: callState.callerInfo,
    state: callState.state,
    isMuted: callState.isMuted,
    isScreenSharingOn: callState.isScreenSharingOn,
    localVideoStreams: callState.localVideoStreams,
    transcription: callState.transcription,
    recording: callState.recording,
    transfer: callState.transfer,
    screenShareRemoteParticipant: callState.screenShareRemoteParticipant,
    startTime: callState.startTime,
    endTime: callState.endTime,
    participants: meetingParticipantsFromCallParticipants(callState.remoteParticipants),
    participantsEnded: meetingParticipantsFromCallParticipants(callState.remoteParticipantsEnded),
    meetingEndReason: callState.callEndReason
  };
}
