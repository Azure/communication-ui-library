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

type CallWithChatAdapterManagementInternal = Omit<CallAdapterCallManagement, 'removeParticipant'> &
  CallAdapterDeviceManagement &
  Omit<ChatAdapterThreadManagement, 'removeParticipant' | 'setTopic'> &
  /* @conditional-compile-remove(file-sharing) */
  FileUploadAdapter;

const CallWithChatAdapterManagementTypeAssertion = (
  value: CallWithChatAdapterManagement
): CallWithChatAdapterManagementInternal => value;

const CallWithChatAdapterManagementRequiredTypeAssertion = (
  value: Required<CallWithChatAdapterManagement>
): Required<CallWithChatAdapterManagementInternal> => value;

CallWithChatAdapterManagementTypeAssertion;
CallWithChatAdapterManagementRequiredTypeAssertion;

/// CallWithChatControlOptions

type CallWithChatControlOptionsInternal = Omit<
  CallControlOptions,
  | 'endCallButton'
  | 'devicesButton'
  | /* @conditional-compile-remove(control-bar-button-injection) */ 'onFetchCustomButtonProps'
  | 'participantsButton'
  /* @conditional-compile-remove(new-call-control-bar) */
  | 'legacyControlBarExperience'
>;

const CallWithChatControlOptionsTypeAssertion = (
  value: CallWithChatControlOptions
): CallWithChatControlOptionsInternal => value;

const CallWithChatControlOptionsRequiredTypeAssertion = (
  value: Required<CallWithChatControlOptions>
): Required<CallWithChatControlOptionsInternal> => value;

CallWithChatControlOptionsTypeAssertion;
CallWithChatControlOptionsRequiredTypeAssertion;

/// CallWithChatAdapterUiState

type CallWithChatAdapterUiStateInternal = CallAdapterUiState & Omit<ChatAdapterUiState, 'error'>;

const CallWithChatAdapterUiStateTypeAssertion = (
  value: CallWithChatAdapterUiState
): CallWithChatAdapterUiStateInternal => value;

const CallWithChatAdapterUiStateRequiredTypeAssertion = (
  value: Required<CallWithChatAdapterUiState>
): Required<CallWithChatAdapterUiStateInternal> => value;

CallWithChatAdapterUiStateTypeAssertion;
CallWithChatAdapterUiStateRequiredTypeAssertion;

/// CallWithChatClientState

type CallWithChatClientStateInternal = Omit<
  CallAdapterClientState,
  | 'displayName'
  | 'endedCall'
  | 'latestErrors'
  | 'userId'
  | /* @conditional-compile-remove(PSTN-calls) */ 'alternateCallerId'
  | /* @conditional-compile-remove(unsupported-browser) */ 'features'
  | /* @conditional-compile-remove(rooms) */ 'roleHint'
  | 'cameraStatus'
>;

const CallWithChatClientStateTypeAssertion = (value: CallWithChatClientState): CallWithChatClientStateInternal => value;

const CallWithChatClientStateRequiredTypeAssertion = (
  value: Required<CallWithChatClientState>
): Required<CallWithChatClientStateInternal> => value;

CallWithChatClientStateTypeAssertion;
CallWithChatClientStateRequiredTypeAssertion;
