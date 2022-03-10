// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import { CallState } from '@internal/calling-stateful-client';
import { ChatThreadClientState } from '@internal/chat-stateful-client';
import { CallAdapter, CallAdapterClientState, CallAdapterState, CallAdapterUiState } from '../../CallComposite';
import { ChatAdapter, ChatAdapterState, ChatAdapterUiState } from '../../ChatComposite';
import { AdapterErrors } from '../../common/adapters';

/**
 * UI state pertaining to the {@link CallWithChatComposite}.
 *
 * @public
 */
export interface CallWithChatAdapterUiState extends CallAdapterUiState, Omit<ChatAdapterUiState, 'error'> {}

/**
 * State from the backend services that drives {@link CallWithChatComposite}.
 *
 * @public
 */
export interface CallWithChatClientState extends Pick<CallAdapterClientState, 'devices' | 'isTeamsCall'> {
  /** ID of the call participant using this CallWithChatAdapter. */
  userId: CommunicationIdentifierKind;
  /** Display name of the participant using this CallWithChatAdapter. */
  displayName: string | undefined;
  /** State of the current call. */
  call?: CallState;
  /** State of the current chat. */
  chat?: ChatThreadClientState;
  /** Latest call error encountered for each operation performed via the adapter. */
  latestCallErrors: AdapterErrors;
  /** Latest chat error encountered for each operation performed via the adapter. */
  latestChatErrors: AdapterErrors;
}

/**
 * CallWithChat State is a combination of Stateful Chat and Stateful Calling clients with some
 * state specific to the CallWithChat Composite only.
 *
 * @public
 */
export interface CallWithChatAdapterState extends CallWithChatAdapterUiState, CallWithChatClientState {}

/**
 * @private
 */
export function callWithChatAdapterStateFromBackingStates(
  callAdapter: CallAdapter,
  chatAdapter: ChatAdapter
): CallWithChatAdapterState {
  const callAdapterState = callAdapter.getState();
  const chatAdapterState = chatAdapter.getState();

  return {
    call: callAdapterState.call,
    chat: chatAdapterState.thread,
    userId: callAdapterState.userId,
    page: callAdapterState.page,
    displayName: callAdapterState.displayName,
    devices: callAdapterState.devices,
    isLocalPreviewMicrophoneEnabled: callAdapterState.isLocalPreviewMicrophoneEnabled,
    isTeamsCall: callAdapterState.isTeamsCall,
    latestCallErrors: callAdapterState.latestErrors,
    latestChatErrors: chatAdapterState.latestErrors,
    /* @conditional-compile-remove(file-sharing) */
    fileUploads: chatAdapterState.fileUploads
  };
}

/**
 * @private
 */
export function mergeChatAdapterStateIntoCallWithChatAdapterState(
  existingCallWithChatAdapterState: CallWithChatAdapterState,
  chatAdapterState: ChatAdapterState
): CallWithChatAdapterState {
  return {
    ...existingCallWithChatAdapterState,
    chat: chatAdapterState.thread,
    latestChatErrors: chatAdapterState.latestErrors,
    /* @conditional-compile-remove(file-sharing) */
    fileUploads: chatAdapterState.fileUploads
  };
}

/**
 * @private
 */
export function mergeCallAdapterStateIntoCallWithChatAdapterState(
  existingCallWithChatAdapterState: CallWithChatAdapterState,
  callAdapterState: CallAdapterState
): CallWithChatAdapterState {
  return {
    ...existingCallWithChatAdapterState,
    userId: callAdapterState.userId,
    page: callAdapterState.page,
    displayName: callAdapterState.displayName,
    devices: callAdapterState.devices,
    call: callAdapterState.call,
    isLocalPreviewMicrophoneEnabled: callAdapterState.isLocalPreviewMicrophoneEnabled,
    isTeamsCall: callAdapterState.isTeamsCall,
    latestCallErrors: callAdapterState.latestErrors
  };
}
