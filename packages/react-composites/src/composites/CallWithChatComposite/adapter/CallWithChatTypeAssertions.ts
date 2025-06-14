// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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

type CallWithChatAdapterManagementInternal = Omit<CallAdapterCallManagement, 'removeParticipant' | 'onReactionClick'> &
  CallAdapterDeviceManagement &
  Omit<ChatAdapterThreadManagement, 'removeParticipant' | 'setTopic'>;

const CallWithChatAdapterManagementTypeAssertion = (
  value: CallWithChatAdapterManagement
): CallWithChatAdapterManagementInternal => value;

const CallWithChatAdapterManagementRequiredTypeAssertion = (
  value: Required<CallWithChatAdapterManagement>
): Required<CallWithChatAdapterManagementInternal> => value;

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
CallWithChatAdapterManagementTypeAssertion;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
CallWithChatAdapterManagementRequiredTypeAssertion;

/// CallWithChatControlOptions

type CallWithChatControlOptionsInternal = Omit<
  CallControlOptions,
  'endCallButton' | 'devicesButton' | 'onFetchCustomButtonProps' | 'participantsButton' | 'legacyControlBarExperience'
>;

const CallWithChatControlOptionsTypeAssertion = (
  value: CallWithChatControlOptions
): CallWithChatControlOptionsInternal => value;

const CallWithChatControlOptionsRequiredTypeAssertion = (
  value: Required<CallWithChatControlOptions>
): Required<CallWithChatControlOptionsInternal> => value;

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
CallWithChatControlOptionsTypeAssertion;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
CallWithChatControlOptionsRequiredTypeAssertion;

/// CallWithChatAdapterUiState

type CallWithChatAdapterUiStateInternal = CallAdapterUiState & Omit<ChatAdapterUiState, 'error'>;

const CallWithChatAdapterUiStateTypeAssertion = (
  value: CallWithChatAdapterUiState
): CallWithChatAdapterUiStateInternal => value;

const CallWithChatAdapterUiStateRequiredTypeAssertion = (
  value: Required<CallWithChatAdapterUiState>
): Required<CallWithChatAdapterUiStateInternal> => value;

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
CallWithChatAdapterUiStateTypeAssertion;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
CallWithChatAdapterUiStateRequiredTypeAssertion;

/// CallWithChatClientState

type CallWithChatClientStateInternal = Omit<
  CallAdapterClientState,
  | 'displayName'
  | 'endedCall'
  | 'latestErrors'
  | 'latestNotifications'
  | 'userId'
  | 'alternateCallerId'
  | /* @conditional-compile-remove(unsupported-browser) */ 'features'
  | 'videoBackgroundImages'
  | 'selectedVideoBackgroundEffect'
  | 'acceptedTransferCallState'
  | 'cameraStatus'
  | 'sounds'
  | 'isRoomsCall'
  | 'targetCallees'
  | 'mediaAccess'
>;

const CallWithChatClientStateTypeAssertion = (value: CallWithChatClientState): CallWithChatClientStateInternal => value;

const CallWithChatClientStateRequiredTypeAssertion = (
  value: Required<CallWithChatClientState>
): Required<CallWithChatClientStateInternal> => value;

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
CallWithChatClientStateTypeAssertion;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
CallWithChatClientStateRequiredTypeAssertion;
