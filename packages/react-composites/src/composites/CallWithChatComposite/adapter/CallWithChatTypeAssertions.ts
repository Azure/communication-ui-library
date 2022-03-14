// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallAdapterCallManagement,
  CallAdapterClientState,
  CallAdapterDeviceManagement,
  CallAdapterUiState,
  CallControlOptions
} from '../../CallComposite';
import { ChatAdapterThreadManagement, ChatAdapterUiState } from '../../ChatComposite';
import { CallWithChatControlOptions } from '../CallWithChatComposite';
import { CallWithChatAdapterUiState, CallWithChatClientState } from '../state/CallWithChatAdapterState';
import { CallWithChatAdapterManagement } from './CallWithChatAdapter';
/* @conditional-compile-remove(file-sharing) */
import { FileUploadAdapter } from '../../ChatComposite';

/// IMPORTANT
///
/// Each interface defined in here is the pick&omit version of the flattened interface we export.
/// We only export flattened apis for improved developer experience. However we need to ensure
/// that the signatures that callwithchat uses matches the underlying signatures in the call
/// and chat interfaces. Thus here we define interfaces pick and omit from the call and chat
/// apis and assert that the flattened apis extend the signature.
///
/// This file will need kept up to date when changes to the flattened interfaces are made.

/// CallWithChatAdapterManagement

interface CallWithChatAdapterManagementInternal
  extends Pick<
      CallAdapterCallManagement,
      | 'startCamera'
      | 'stopCamera'
      | 'mute'
      | 'unmute'
      | 'startScreenShare'
      | 'stopScreenShare'
      | 'createStreamView'
      | 'disposeStreamView'
      | 'joinCall'
      | 'leaveCall'
      | 'startCall'
    >,
    Pick<
      CallAdapterDeviceManagement,
      | 'setCamera'
      | 'setMicrophone'
      | 'setSpeaker'
      | 'askDevicePermission'
      | 'queryCameras'
      | 'queryMicrophones'
      | 'querySpeakers'
    >,
    Pick<
      ChatAdapterThreadManagement,
      | 'fetchInitialData'
      | 'sendMessage'
      | 'sendReadReceipt'
      | 'sendTypingIndicator'
      | 'loadPreviousChatMessages'
      | 'updateMessage'
      | 'deleteMessage'
    >,
    /* @conditional-compile-remove(file-sharing) */
    Pick<FileUploadAdapter, 'registerFileUploads' | 'clearFileUploads' | 'cancelFileUpload'> {}

const CallWithChatAdapterManagementTypeAssertion = (
  value: CallWithChatAdapterManagement
): CallWithChatAdapterManagementInternal => value;

const CallWithChatAdapterManagementRequiredTypeAssertion = (
  value: Required<CallWithChatAdapterManagement>
): Required<CallWithChatAdapterManagementInternal> => value;

CallWithChatAdapterManagementTypeAssertion;
CallWithChatAdapterManagementRequiredTypeAssertion;

/// CallWithChatControlOptions

interface CallWithChatControlOptionsInternal
  extends Pick<CallControlOptions, 'cameraButton' | 'microphoneButton' | 'screenShareButton' | 'displayType'> {}

const CallWithChatControlOptionsTypeAssertion = (
  value: CallWithChatControlOptions
): CallWithChatControlOptionsInternal => value;

const CallWithChatControlOptionsRequiredTypeAssertion = (
  value: Required<CallWithChatControlOptions>
): Required<CallWithChatControlOptionsInternal> => value;

CallWithChatControlOptionsTypeAssertion;
CallWithChatControlOptionsRequiredTypeAssertion;

/// CallWithChatAdapterUiState

interface CallWithChatAdapterUiStateInternal extends CallAdapterUiState, Omit<ChatAdapterUiState, 'error'> {}

const CallWithChatAdapterUiStateTypeAssertion = (
  value: CallWithChatAdapterUiState
): CallWithChatAdapterUiStateInternal => value;

const CallWithChatAdapterUiStateRequiredTypeAssertion = (
  value: Required<CallWithChatAdapterUiState>
): Required<CallWithChatAdapterUiStateInternal> => value;

CallWithChatAdapterUiStateTypeAssertion;
CallWithChatAdapterUiStateRequiredTypeAssertion;

/// CallWithChatClientState

interface CallWithChatClientStateInternal extends Pick<CallAdapterClientState, 'devices' | 'isTeamsCall'> {}

const CallWithChatClientStateTypeAssertion = (value: CallWithChatClientState): CallWithChatClientStateInternal => value;

const CallWithChatClientStateRequiredTypeAssertion = (
  value: Required<CallWithChatClientState>
): Required<CallWithChatClientStateInternal> => value;

CallWithChatClientStateTypeAssertion;
CallWithChatClientStateRequiredTypeAssertion;
