// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import { CallState } from '@internal/calling-stateful-client';
import { ChatThreadClientState } from '@internal/chat-stateful-client';
import { CallAdapter, CallAdapterClientState, CallAdapterState, CallAdapterUiState } from '../../CallComposite';
import { ChatAdapter, ChatAdapterState, ChatAdapterUiState } from '../../ChatComposite';

/**
 * UI state pertaining to the {@link CallAndChatComposite}.
 *
 * @beta
 */
export interface CallAndChatAdapterUiState extends CallAdapterUiState, Omit<ChatAdapterUiState, 'error'> {}

/**
 * State from the backend services that drives {@link CallAndChatComposite}.
 *
 * @beta
 */
export interface CallAndChatClientState extends Pick<CallAdapterClientState, 'devices' | 'isTeamsCall'> {
  /** ID of the call participant using this CallAndChatAdapter. */
  userId: CommunicationIdentifierKind;
  /** Display name of the participant using this CallAndChatAdapter. */
  displayName: string | undefined;
  /** State of the current call. */
  call?: CallState;
  /** State of the current chat. */
  chat?: ChatThreadClientState;
}

/**
 * CallAndChat State is a combination of Stateful Chat and Stateful Calling clients with some
 * state specific to the CallAndChat Composite only.
 *
 * @beta
 */
export interface CallAndChatAdapterState extends CallAndChatAdapterUiState, CallAndChatClientState {}

/**
 * @private
 */
export function callAndChatAdapterStateFromBackingStates(
  callAdapter: CallAdapter,
  chatAdapter: ChatAdapter
): CallAndChatAdapterState {
  const callAdapterState = callAdapter.getState();
  const chatAdapterState = chatAdapter.getState();

  return {
    call: callAdapterState.call,
    userId: callAdapterState.userId,
    page: callAdapterState.page,
    displayName: callAdapterState.displayName,
    devices: callAdapterState.devices,
    isLocalPreviewMicrophoneEnabled: callAdapterState.isLocalPreviewMicrophoneEnabled,
    isTeamsCall: callAdapterState.isTeamsCall,
    chat: chatAdapterState.thread,
    /* @conditional-compile-remove-from(stable): FILE_SHARING */
    fileUploads: chatAdapterState.fileUploads
  };
}

/**
 * @private
 */
export function mergeChatAdapterStateIntoCallAndChatAdapterState(
  existingCallAndChatAdapterState: CallAndChatAdapterState,
  chatAdapterState: ChatAdapterState
): CallAndChatAdapterState {
  return {
    ...existingCallAndChatAdapterState,
    chat: chatAdapterState.thread,
    /* @conditional-compile-remove-from(stable): FILE_SHARING */
    fileUploads: chatAdapterState.fileUploads
  };
}

/**
 * @private
 */
export function mergeCallAdapterStateIntoCallAndChatAdapterState(
  existingCallAndChatAdapterState: CallAndChatAdapterState,
  callAdapterState: CallAdapterState
): CallAndChatAdapterState {
  return {
    ...existingCallAndChatAdapterState,
    userId: callAdapterState.userId,
    page: callAdapterState.page,
    displayName: callAdapterState.displayName,
    devices: callAdapterState.devices,
    call: callAdapterState.call,
    isLocalPreviewMicrophoneEnabled: callAdapterState.isLocalPreviewMicrophoneEnabled,
    isTeamsCall: callAdapterState.isTeamsCall
  };
}
