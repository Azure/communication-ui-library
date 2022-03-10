// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */

import {
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
  MessageReadListener,
  MessageReceivedListener,
  MessageSentListener,
  ParticipantsAddedListener,
  ParticipantsRemovedListener
} from '../../ChatComposite';
import { CallWithChatAdapterState } from '../state/CallWithChatAdapterState';
import type { AdapterError, AdapterState, Disposable } from '../../common/adapters';
import { AudioDeviceInfo, Call, PermissionConstraints, VideoDeviceInfo } from '@azure/communication-calling';
import { VideoStreamOptions } from '@internal/react-components';
import { SendMessageOptions } from '@azure/communication-chat';
/* @conditional-compile-remove(file-sharing) */
import { ObservableFileUpload } from '../../ChatComposite';

/**
 * Functionality for managing the current call with chat.
 * @public
 */
export interface CallWithChatAdapterManagement {
  // CallWithChat-specific Interface methods
  /**
   * Remove a participant from a Call
   * @param userId - UserId of the participant to remove.
   *
   * @beta
   */
  removeParticipant(userId: string): Promise<void>;

  // Call Interface Methods
  /**
   * Join the call with microphone initially on/off.
   *
   * @param microphoneOn - Whether microphone is initially enabled
   *
   * @beta
   */
  joinCall(microphoneOn?: boolean): Call | undefined;
  /**
   * Leave the call
   *
   * @param forEveryone - Whether to remove all participants when leaving
   *
   * @beta
   */
  leaveCall(forEveryone?: boolean): Promise<void>;
  /**
   * Start the camera
   * This method will start rendering a local camera view when the call is not active
   *
   * @param options - Options to control how video streams are rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @beta
   */
  startCamera(options?: VideoStreamOptions): Promise<void>;
  /**
   * Stop the camera
   * This method will stop rendering a local camera view when the call is not active
   *
   * @beta
   */
  stopCamera(): Promise<void>;
  /**
   * Mute the current user during the call or disable microphone locally
   *
   * @beta
   */
  mute(): Promise<void>;
  /**
   * Unmute the current user during the call or enable microphone locally
   *
   * @beta
   */
  unmute(): Promise<void>;
  /**
   * Start the call.
   *
   * @param participants - An array of participant ids to join
   *
   * @beta
   */
  startCall(participants: string[]): Call | undefined;
  /**
   * Start sharing the screen during a call.
   *
   * @beta
   */
  startScreenShare(): Promise<void>;
  /**
   * Stop sharing the screen
   *
   * @beta
   */
  stopScreenShare(): Promise<void>;
  /**
   * Create the html view for a stream.
   *
   * @remarks
   * This method is implemented for composite
   *
   * @param remoteUserId - Id of the participant to render, leave it undefined to create the local camera view
   * @param options - Options to control how video streams are rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @beta
   */
  createStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void>;
  /**
   * Dispose the html view for a stream.
   *
   * @remarks
   * This method is implemented for composite
   *
   * @param remoteUserId - Id of the participant to render, leave it undefined to dispose the local camera view
   * @param options - Options to control how video streams are rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @beta
   */
  disposeStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void>;
  /**
   * Ask for permissions of devices.
   *
   * @remarks
   * Browser permission window will pop up if permissions are not granted yet
   *
   * @param constrain - Define constraints for accessing local devices {@link @azure/communication-calling#PermissionConstraints }
   *
   * @beta
   */
  askDevicePermission(constrain: PermissionConstraints): Promise<void>;
  /**
   * Query for available camera devices.
   *
   * @remarks
   * This method should be called after askDevicePermission()
   *
   * @return An array of video device information entities {@link @azure/communication-calling#VideoDeviceInfo }
   *
   * @beta
   */
  queryCameras(): Promise<VideoDeviceInfo[]>;
  /**
   * Query for available microphone devices.
   *
   * @remarks
   * This method should be called after askDevicePermission()
   *
   * @return An array of audio device information entities {@link @azure/communication-calling#AudioDeviceInfo }
   *
   * @beta
   */
  queryMicrophones(): Promise<AudioDeviceInfo[]>;
  /**
   * Query for available microphone devices.
   *
   * @remarks
   * This method should be called after askDevicePermission()
   *
   * @return An array of audio device information entities {@link @azure/communication-calling#AudioDeviceInfo }
   *
   * @beta
   */
  querySpeakers(): Promise<AudioDeviceInfo[]>;
  /**
   * Set the camera to use in the call.
   *
   * @param sourceInfo - Camera device to choose, pick one returned by  {@link CallAdapterDeviceManagement#queryCameras }
   * @param options - Options to control how the camera stream is rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @beta
   */
  setCamera(sourceInfo: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void>;
  /**
   * Set the microphone to use in the call.
   *
   * @param sourceInfo - Microphone device to choose, pick one returned by {@link CallAdapterDeviceManagement#queryMicrophones }
   *
   * @beta
   */
  setMicrophone(sourceInfo: AudioDeviceInfo): Promise<void>;
  /**
   * Set the speaker to use in the call.
   *
   * @param sourceInfo - Speaker device to choose, pick one returned by {@link CallAdapterDeviceManagement#querySpeakers }
   *
   * @beta
   */
  setSpeaker(sourceInfo: AudioDeviceInfo): Promise<void>;

  // Chat Interface Methods
  /**
   * Fetch initial state for the Chat adapter.
   *
   * Performs the minimal fetch necessary for ChatComposite and API methods.
   *
   * @beta
   */
  fetchInitialData(): Promise<void>;
  /**
   * Send a message in the thread.
   *
   * @beta
   */
  sendMessage(content: string, options?: SendMessageOptions): Promise<void>;
  /**
   * Send a read receipt for a message.
   *
   * @beta
   */
  sendReadReceipt(chatMessageId: string): Promise<void>;
  /**
   * Send typing indicator in the thread.
   *
   * @beta
   */
  sendTypingIndicator(): Promise<void>;
  /**
   * Update a message content.
   *
   * @beta
   */
  updateMessage(messageId: string, content: string): Promise<void>;
  /**
   * Delete a message in the thread.
   *
   * @beta
   */
  deleteMessage(messageId: string): Promise<void>;
  /**
   * Load more previous messages in the chat thread history.
   *
   * @remarks
   * This method is usually used to control incremental fetch/infinite scroll
   *
   * @beta
   */
  loadPreviousChatMessages(messagesToLoad: number): Promise<boolean>;

  /* @conditional-compile-remove(file-sharing) */
  registerFileUploads: (fileUploads: ObservableFileUpload[]) => void;
  /* @conditional-compile-remove(file-sharing) */
  clearFileUploads: () => void;
  /* @conditional-compile-remove(file-sharing) */
  cancelFileUpload: (id: string) => void;
}

/**
 * Call and Chat events that can be subscribed to in the {@link CallWithChatAdapter}.
 * @public
 */
export interface CallWithChatAdapterSubscriptions {
  // Call subscriptions
  on(event: 'callEnded', listener: CallEndedListener): void;
  on(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  on(event: 'callIdChanged', listener: CallIdChangedListener): void;
  on(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  on(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  on(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  on(event: 'callParticipantsJoined', listener: ParticipantsJoinedListener): void;
  on(event: 'callParticipantsLeft', listener: ParticipantsLeftListener): void;
  on(event: 'callError', listener: (e: AdapterError) => void): void;

  off(event: 'callEnded', listener: CallEndedListener): void;
  off(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  off(event: 'callIdChanged', listener: CallIdChangedListener): void;
  off(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  off(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  off(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  off(event: 'callParticipantsJoined', listener: ParticipantsJoinedListener): void;
  off(event: 'callParticipantsLeft', listener: ParticipantsLeftListener): void;
  off(event: 'callError', listener: (e: AdapterError) => void): void;

  // Chat subscriptions
  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageSent', listener: MessageSentListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;
  on(event: 'chatParticipantsAdded', listener: ParticipantsAddedListener): void;
  on(event: 'chatParticipantsRemoved', listener: ParticipantsRemovedListener): void;
  on(event: 'chatError', listener: (e: AdapterError) => void): void;

  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageSentListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
  off(event: 'chatParticipantsAdded', listener: ParticipantsAddedListener): void;
  off(event: 'chatParticipantsRemoved', listener: ParticipantsRemovedListener): void;
  off(event: 'chatError', listener: (e: AdapterError) => void): void;
}

/**
 * {@link CallWithChatComposite} Adapter interface.
 * @public
 */
export interface CallWithChatAdapter
  extends CallWithChatAdapterManagement,
    AdapterState<CallWithChatAdapterState>,
    Disposable,
    CallWithChatAdapterSubscriptions {}

/**
 * Events fired off by the {@link CallWithChatAdapter}
 * @public
 */
export type CallWithChatEvent =
  | 'callError'
  | 'chatError'
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
