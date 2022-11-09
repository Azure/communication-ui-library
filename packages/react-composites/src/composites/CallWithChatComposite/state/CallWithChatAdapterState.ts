// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import { CallState, DeviceManagerState } from '@internal/calling-stateful-client';
import { ChatThreadClientState } from '@internal/chat-stateful-client';
import { CallAdapter, CallAdapterState, CallCompositePage } from '../../CallComposite';
import { ChatAdapter, ChatAdapterState } from '../../ChatComposite';
/* @conditional-compile-remove(file-sharing) */
import { FileUploadsUiState } from '../../ChatComposite';
import { AdapterErrors } from '../../common/adapters';

/**
 * UI state pertaining to the {@link CallWithChatComposite}.
 *
 * @public
 */
export interface CallWithChatAdapterUiState {
  /**
   * Microphone state before a call has joined.
   *
   * @public
   */
  isLocalPreviewMicrophoneEnabled: boolean;
  /**
   * Current page of the Composite.
   *
   * @public
   */
  page: CallCompositePage;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Files being uploaded by a user in the current thread.
   * Should be set to null once the upload is complete.
   * Array of type {@link FileUploadsUiState}
   *
   * @beta
   */
  fileUploads?: FileUploadsUiState;
  /** State of opt-in features */
  features?: {
    /**
     * (Example feature)
     */
    unsupportedBrowser?: boolean;
    /**
     * (Example feature)
     */
    captions?: boolean;
    /**
     * (Example feature) - this would be chat adapter but for the sake of brevity putting here
     */
    richTextChatSupport?: boolean;
  };
}

/**
 * State from the backend services that drives {@link CallWithChatComposite}.
 *
 * @public
 */
export interface CallWithChatClientState {
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
  /** State of available and currently selected devices */
  devices: DeviceManagerState;
  /** State of whether the active call is a Teams interop call */
  isTeamsCall: boolean;
  /* @conditional-compile-remove(PSTN-calls) */
  /** alternateCallerId for PSTN call */
  alternateCallerId?: string | undefined;
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
    fileUploads: chatAdapterState.fileUploads,
    /* @conditional-compile-remove(PSTN-calls) */
    alternateCallerId: callAdapterState.alternateCallerId
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
