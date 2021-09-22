// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CallAdapter, CallAdapterClientState, CallAdapterState, CallAdapterUiState } from '../../CallComposite';
import { ChatAdapter, ChatAdapterState } from '../../ChatComposite';
import { callPageToMeetingPage, MeetingCompositePage } from './MeetingCompositePage';
import {
  meetingStateFromBackingStates,
  MeetingState,
  mergeCallStateIntoMeetingState,
  mergeChatStateIntoMeetingState
} from './MeetingState';

/**
 * UI state pertaining to the Meeting Composite.
 * @alpha
 */
export interface MeetingAdapterUiState extends Pick<CallAdapterUiState, 'isLocalPreviewMicrophoneEnabled'> {
  /** Current page in the meeting composite. */
  page: MeetingCompositePage;
}

/**
 * State from the backend services that drives Meeting Composite.
 * @alpha
 */
export interface MeetingAdapterClientState extends Pick<CallAdapterClientState, 'devices' | 'isTeamsCall'> {
  /** ID of the meeting participant using this Meeting Adapter. */
  userId: CommunicationUserIdentifier;
  /** Display name of the meeting participant using this Meeting Adapter. */
  displayName: string | undefined;
  /** State of the current Meeting. */
  meeting: MeetingState | undefined;
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

export function meetingAdapterStateFromBackingStates(
  callAdapter: CallAdapter,
  chatAdapter: ChatAdapter
): MeetingAdapterState {
  const callAdapterState = callAdapter.getState();
  const chatAdapterState = chatAdapter.getState();

  const meeting = callAdapterState.call
    ? meetingStateFromBackingStates(callAdapterState.call, chatAdapterState.thread)
    : undefined;

  return {
    meeting,
    userId: callAdapterState.userId,
    page: callPageToMeetingPage(callAdapterState.page),
    displayName: callAdapterState.displayName,
    devices: callAdapterState.devices,
    isLocalPreviewMicrophoneEnabled: callAdapterState.isLocalPreviewMicrophoneEnabled,
    isTeamsCall: callAdapterState.isTeamsCall
  };
}

export function mergeChatAdapterStateIntoMeetingAdapterState(
  meetingAdapterState: MeetingAdapterState,
  chatAdapterState: ChatAdapterState
): MeetingAdapterState {
  const newMeetingState = meetingAdapterState.meeting
    ? mergeChatStateIntoMeetingState(meetingAdapterState.meeting, chatAdapterState.thread)
    : undefined;

  return {
    ...meetingAdapterState,
    meeting: newMeetingState
  };
}

export function mergeCallAdapterStateIntoMeetingAdapterState(
  meetingAdapterState: MeetingAdapterState,
  callAdapterState: CallAdapterState
): MeetingAdapterState {
  const newMeetingState = callAdapterState.call
    ? mergeCallStateIntoMeetingState(meetingAdapterState.meeting, callAdapterState.call)
    : undefined;

  return {
    userId: callAdapterState.userId,
    page: callPageToMeetingPage(callAdapterState.page),
    displayName: callAdapterState.displayName,
    devices: callAdapterState.devices,
    meeting: newMeetingState,
    isLocalPreviewMicrophoneEnabled: callAdapterState.isLocalPreviewMicrophoneEnabled,
    isTeamsCall: callAdapterState.isTeamsCall
  };
}
