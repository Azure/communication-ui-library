// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import { CallState } from '@internal/calling-stateful-client';
import { ChatThreadClientState } from '@internal/chat-stateful-client';
import {
  CallAdapterCallManagement,
  CallAdapterClientState,
  CallAdapterDeviceManagement,
  CallAdapterUiState,
  CallControlOptions
} from '../../CallComposite';
import { ChatAdapterThreadManagement, ChatAdapterUiState, FileUploadAdapter } from '../../ChatComposite';
import { AdapterErrors } from '../../common/adapters';
import { CallWithChatControlOptions } from '../CallWithChatComposite';
import { CallWithChatAdapterUiState, CallWithChatClientState } from '../state/CallWithChatAdapterState';
import { CallWithChatAdapterManagement } from './CallWithChatAdapter';

/// IMPORTANT
///
/// EACH INTERFACE DEFINED IN HERE IS THE PICK&OMIT VERSION OF THE FLATTENED INTERFACE WE EXPORT.
/// WE ONLY EXPORT FLATTENED APIS FOR IMPROVED DEVELOPER EXPERIENCE. HOWEVER WE NEED TO ENSURE
/// THAT THE SIGNATURES THAT CALLWITHCHAT USES MATCHES THE UNDERLYING SIGNATURES IN THE CALL
/// AND CHAT INTERFACES. THUS HERE WE DEFINE INTERFACES PICK AND OMIT FROM THE CALL AND CHAT
/// APIS AND ASSERT THAT THE FLATTENED APIS MATCH THE SIGNATURE.
///
/// THIS FILE WILL NEED KEPT UP TO DATE WHEN CHANGES TO THE FLATTENED INTERFACES ARE MADE.

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
  extends Pick<CallControlOptions, 'cameraButton' | 'microphoneButton' | 'screenShareButton' | 'displayType'> {
  chatButton?: boolean;
  peopleButton?: boolean;
}

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

interface CallWithChatClientStateInternal extends Pick<CallAdapterClientState, 'devices' | 'isTeamsCall'> {
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

const CallWithChatClientStateTypeAssertion = (value: CallWithChatClientState): CallWithChatClientStateInternal => value;

const CallWithChatClientStateRequiredTypeAssertion = (
  value: Required<CallWithChatClientState>
): Required<CallWithChatClientStateInternal> => value;

CallWithChatClientStateTypeAssertion;
CallWithChatClientStateRequiredTypeAssertion;
