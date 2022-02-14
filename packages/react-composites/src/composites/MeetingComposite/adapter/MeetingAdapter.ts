// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */

import {
  CallAdapterCallManagement,
  CallAdapterDeviceManagement,
  CallIdChangedListener,
  DisplayNameChangedListener,
  IsMutedChangedListener,
  IsLocalScreenSharingActiveChangedListener,
  IsSpeakingChangedListener,
  ParticipantsJoinedListener,
  ParticipantsLeftListener,
  CallEndedListener
} from '../../CallComposite';
import {
  ChatAdapterThreadManagement,
  MessageReadListener,
  MessageReceivedListener,
  MessageSentListener,
  ParticipantsAddedListener,
  ParticipantsRemovedListener
} from '../../ChatComposite';
import { CallAndChatAdapterState } from '../state/MeetingAdapterState';
import type { AdapterError, AdapterState, Disposable } from '../../common/adapters';

/**
 * Functionality for managing the current call with chat.
 * @beta
 */
export interface CallAndChatAdapterManagement
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
    > {
  /**
   * Remove a participant from a Call
   * @param userId - UserId of the participant to remove.
   */
  removeParticipant(userId: string): Promise<void>;
}

/**
 * Call and Chat events that can be subscribed to in the {@link CallAndChatAdapter}.
 * @beta
 */
export interface CallAndChatAdapterSubscriptions {
  on(event: 'error', listener: (e: AdapterError) => void): void;
  off(event: 'error', listener: (e: AdapterError) => void): void;

  // Call subscriptions
  on(event: 'callEnded', listener: CallEndedListener): void;
  on(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  on(event: 'callIdChanged', listener: CallIdChangedListener): void;
  on(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  on(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  on(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  on(event: 'callParticipantsJoined', listener: ParticipantsJoinedListener): void;
  on(event: 'callParticipantsLeft', listener: ParticipantsLeftListener): void;

  off(event: 'callEnded', listener: CallEndedListener): void;
  off(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  off(event: 'callIdChanged', listener: CallIdChangedListener): void;
  off(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  off(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  off(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  off(event: 'callParticipantsJoined', listener: ParticipantsJoinedListener): void;
  off(event: 'callParticipantsLeft', listener: ParticipantsLeftListener): void;

  // Chat subscriptions
  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageSent', listener: MessageSentListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;
  on(event: 'chatParticipantsAdded', listener: ParticipantsAddedListener): void;
  on(event: 'chatParticipantsRemoved', listener: ParticipantsRemovedListener): void;

  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageSentListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
  off(event: 'chatParticipantsAdded', listener: ParticipantsAddedListener): void;
  off(event: 'chatParticipantsRemoved', listener: ParticipantsRemovedListener): void;
}

/**
 * {@link CallAndChatComposite} Adapter interface.
 * @beta
 */
export interface CallAndChatAdapter
  extends CallAndChatAdapterManagement,
    AdapterState<CallAndChatAdapterState>,
    Disposable,
    CallAndChatAdapterSubscriptions {}

/**
 * Events fired off by the {@link ChatAndCallAdapter}
 * @beta
 */
export type CallAndChatEvent =
  | 'error'
  | 'callEnded'
  | 'isMutedChanged'
  | 'callIdChanged'
  | 'isLocalScreenSharingActiveChanged'
  | 'displayNameChanged'
  | 'isSpeakingChanged'
  | 'callParticipantsJoined'
  | 'callParticipantsLeft'
  | 'messageReceived'
  | 'messageSent'
  | 'messageRead'
  | 'chatParticipantsAdded'
  | 'chatParticipantsRemoved';
