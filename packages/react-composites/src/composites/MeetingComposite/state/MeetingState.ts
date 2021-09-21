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
      | 'diagnostics'
      | 'dominantSpeakers'
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

/**
 * Return properties from call state that are used in meeting state.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const meetingPropsFromCallState = (callState: CallState) => ({
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
  diagnostics: callState.diagnostics,
  dominantSpeakers: callState.dominantSpeakers,
  // For meetings we only use participants from the call in a meeting
  participants: meetingParticipantsFromCallParticipants(callState.remoteParticipants),
  participantsEnded: meetingParticipantsFromCallParticipants(callState.remoteParticipantsEnded)
});

/**
 * Return properties from chat state that are used in meeting state.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const meetingPropsFromChatState = (chatState: ChatThreadClientState) => ({
  chatMessages: chatState.chatMessages,
  threadId: chatState.threadId,
  properties: chatState.properties,
  readReceipts: chatState.readReceipts,
  typingIndicators: chatState.typingIndicators,
  latestReadTime: chatState.latestReadTime
});

/**
 * Helper function to return meeting state created from call and chat states
 */
export function meetingStateFromBackingStates(callState: CallState, chatState: ChatThreadClientState): MeetingState {
  return {
    ...meetingPropsFromCallState(callState),
    ...meetingPropsFromChatState(chatState)
  };
}

/**
 * Helper function to return an updated meeting state with new chat state applied
 */
export function mergeChatStateIntoMeetingState(
  meetingState: MeetingState,
  chatState: ChatThreadClientState
): MeetingState {
  return {
    ...meetingState,
    ...meetingPropsFromChatState(chatState)
  };
}

/**
 * Helper function to return an updated meeting state with new call state applied
 */
export function mergeCallStateIntoMeetingState(
  meetingState: MeetingState | undefined,
  callState: CallState
): MeetingState {
  // If we have no existing meeting state, populate chat fields with defaults to merge and make a new state.
  // This is because calls are constructed before chat state is created.
  if (!meetingState) {
    return {
      chatMessages: {},
      threadId: '',
      properties: {},
      readReceipts: [],
      typingIndicators: [],
      latestReadTime: new Date(0),
      ...meetingPropsFromCallState(callState)
    };
  }

  return {
    ...meetingState,
    ...meetingPropsFromCallState(callState)
  };
}
