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
import {
  AudioDeviceInfo,
  Call,
  PermissionConstraints,
  PropertyChangedEvent,
  StartCallOptions,
  VideoDeviceInfo
} from '@azure/communication-calling';
/* @conditional-compile-remove(incoming-call-composites) */
import { CollectionUpdatedEvent, IncomingCall } from '@azure/communication-calling';
/* @conditional-compile-remove(close-captions) */
import { StartCaptionsOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions, DtmfTone } from '@azure/communication-calling';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
import { SendMessageOptions } from '@azure/communication-chat';
/* @conditional-compile-remove(teams-inline-images) */
import { AttachmentDownloadResult } from '@internal/react-components';
/* @conditional-compile-remove(file-sharing) */ /* @conditional-compile-remove(teams-inline-images) */
import { FileMetadata } from '@internal/react-components';
/* @conditional-compile-remove(file-sharing) */
import { FileUploadManager } from '../../ChatComposite';
/* @conditional-compile-remove(PSTN-calls) */
import { CommunicationUserIdentifier, PhoneNumberIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(PSTN-calls) */
import { CommunicationIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(close-captions) */
import { CaptionsReceivedListener, IsCaptionsActiveChangedListener } from '../../CallComposite/adapter/CallAdapter';
/* @conditional-compile-remove(video-background-effects) */
import { BackgroundBlurConfig, BackgroundReplacementConfig } from '@azure/communication-calling-effects';
/* @conditional-compile-remove(video-background-effects) */
import { VideoBackgroundImage, SelectedVideoBackgroundEffect } from '../../CallComposite';
/* @conditional-compile-remove(incoming-call-composites) */
import { IncomingCallListener } from '../../CallComposite/adapter/IncomingCallAdapter';

/**
 * Functionality for managing the current call with chat.
 * @public
 */
export interface CallWithChatAdapterManagement {
  // CallWithChat-specific Interface methods
  /**
   * Remove a participant from a Call.
   *
   * @param userId - UserId of the participant to remove.
   *
   * @public
   */
  removeParticipant(userId: string): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Remove a participant from the call.
   * @param participant - {@link @azure/communication-common#CommunicationIdentifier} of the participant to be removed
   * @beta
   */
  removeParticipant(participant: CommunicationIdentifier): Promise<void>;

  // Call Interface Methods
  /**
   * Join the call with microphone initially on/off.
   *
   * @param microphoneOn - Whether microphone is initially enabled
   *
   * @public
   */
  joinCall(microphoneOn?: boolean): Call | undefined;
  /**
   * Leave the call.
   *
   * @param forEveryone - Whether to remove all participants when leaving
   *
   * @public
   */
  leaveCall(forEveryone?: boolean): Promise<void>;
  /**
   * Start the camera.
   *
   * This method will start rendering a local camera view when the call is not active.
   *
   * @param options - Options to control how video streams are rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @public
   */
  startCamera(options?: VideoStreamOptions): Promise<void>;
  /**
   * Stop the camera.
   *
   * This method will stop rendering a local camera view when the call is not active.
   *
   * @public
   */
  stopCamera(): Promise<void>;
  /**
   * Mute the current user during the call or disable microphone locally.
   *
   * @public
   */
  mute(): Promise<void>;
  /**
   * Unmute the current user during the call or enable microphone locally.
   *
   * @public
   */
  unmute(): Promise<void>;
  /**
   * Start the call.
   *
   * @param participants - An array of participant ids to join
   *
   * @public
   */
  startCall(participants: string[], options?: StartCallOptions): Call | undefined;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Start the call.
   * @param participants - An array of {@link @azure/communication-common#CommunicationIdentifier} to be called
   * @beta
   */
  startCall(participants: CommunicationIdentifier[], options?: StartCallOptions): Call | undefined;
  /**
   * Start sharing the screen during a call.
   *
   * @public
   */
  startScreenShare(): Promise<void>;
  /**
   * Stop sharing the screen.
   *
   * @public
   */
  stopScreenShare(): Promise<void>;
  /**
   * Create the html view for a stream.
   *
   * @remarks
   * This method is implemented for composite.
   *
   * @param remoteUserId - Id of the participant to render, leave it undefined to create the local camera view
   * @param options - Options to control how video streams are rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @public
   */
  createStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void | CreateVideoStreamViewResult>;
  /**
   * Dispose the html view for a stream.
   *
   * @remarks
   * This method is implemented for composite.
   *
   * @param remoteUserId - Id of the participant to render, leave it undefined to dispose the local camera view
   * @param options - Options to control how video streams are rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @public
   */
  disposeStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void>;
  /**
   * Ask for permissions of devices.
   *
   * @remarks
   * Browser permission window will pop up if permissions are not granted yet.
   *
   * @param constrain - Define constraints for accessing local devices {@link @azure/communication-calling#PermissionConstraints }
   *
   * @public
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
   * @public
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
   * @public
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
   * @public
   */
  querySpeakers(): Promise<AudioDeviceInfo[]>;
  /**
   * Set the camera to use in the call.
   *
   * @param sourceInfo - Camera device to choose, pick one returned by  {@link CallAdapterDeviceManagement#queryCameras }
   * @param options - Options to control how the camera stream is rendered {@link @azure/communication-calling#VideoStreamOptions }
   *
   * @public
   */
  setCamera(sourceInfo: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void>;
  /**
   * Set the microphone to use in the call.
   *
   * @param sourceInfo - Microphone device to choose, pick one returned by {@link CallAdapterDeviceManagement#queryMicrophones }
   *
   * @public
   */
  setMicrophone(sourceInfo: AudioDeviceInfo): Promise<void>;
  /**
   * Set the speaker to use in the call.
   *
   * @param sourceInfo - Speaker device to choose, pick one returned by {@link CallAdapterDeviceManagement#querySpeakers }
   *
   * @public
   */
  setSpeaker(sourceInfo: AudioDeviceInfo): Promise<void>;

  // Chat Interface Methods
  /**
   * Fetch initial state for the Chat adapter.
   *
   * Performs the minimal fetch necessary for ChatComposite and API methods.
   *
   * @public
   */
  fetchInitialData(): Promise<void>;
  /**
   * Send a message in the thread.
   *
   * @public
   */
  sendMessage(content: string, options?: SendMessageOptions): Promise<void>;
  /**
   * Send a read receipt for a message.
   *
   * @public
   */
  sendReadReceipt(chatMessageId: string): Promise<void>;
  /**
   * Send typing indicator in the thread.
   *
   * @public
   */
  sendTypingIndicator(): Promise<void>;
  /**
   * Update a message content.
   *
   * @public
   */
  updateMessage(messageId: string, content: string, metadata?: Record<string, string>): Promise<void>;
  /**
   * Delete a message in the thread.
   *
   * @public
   */
  deleteMessage(messageId: string): Promise<void>;
  /**
   * Load more previous messages in the chat thread history.
   *
   * @remarks
   * This method is usually used to control incremental fetch/infinite scroll.
   *
   * @public
   */
  loadPreviousChatMessages(messagesToLoad: number): Promise<boolean>;
  /* @conditional-compile-remove(file-sharing) */
  /** @beta */
  registerActiveFileUploads: (files: File[]) => FileUploadManager[];
  /* @conditional-compile-remove(file-sharing) */
  /** @beta */
  registerCompletedFileUploads: (metadata: FileMetadata[]) => FileUploadManager[];
  /* @conditional-compile-remove(file-sharing) */
  /** @beta */
  clearFileUploads: () => void;
  /* @conditional-compile-remove(file-sharing) */
  /** @beta */
  cancelFileUpload: (id: string) => void;
  /* @conditional-compile-remove(file-sharing) */
  /** @beta */
  updateFileUploadProgress: (id: string, progress: number) => void;
  /* @conditional-compile-remove(file-sharing) */
  /** @beta */
  updateFileUploadErrorMessage: (id: string, errorMessage: string) => void;
  /* @conditional-compile-remove(file-sharing) */
  /** @beta */
  updateFileUploadMetadata: (id: string, metadata: FileMetadata) => void;
  /* @conditional-compile-remove(teams-inline-images) */
  downloadAttachments: (options: { attachmentUrls: string[] }) => Promise<AttachmentDownloadResult[]>;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Puts the Call in a Localhold.
   *
   * @beta
   */
  holdCall: () => Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Resumes the call from a LocalHold state.
   *
   * @beta
   */
  resumeCall: () => Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Adds a new Participant to the call.
   *
   * @beta
   */
  addParticipant(participant: PhoneNumberIdentifier, options?: AddPhoneNumberOptions): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  addParticipant(participant: CommunicationUserIdentifier): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * send dtmf tone to another participant in the call in 1:1 calls
   *
   * @beta
   */
  sendDtmfTone: (dtmfTone: DtmfTone) => Promise<void>;
  /* @conditional-compile-remove(unsupported-browser) */
  /**
   * Continues into a call when the browser version is not supported.
   */
  allowUnsupportedBrowserVersion(): void;
  /* @conditional-compile-remove(close-captions) */
  /**
   * Function to Start captions
   * @param options - options for start captions
   */
  startCaptions(options?: StartCaptionsOptions): Promise<void>;
  /* @conditional-compile-remove(close-captions) */
  /**
   * Function to set caption language
   * @param language - language set for caption
   */
  setCaptionLanguage(language: string): Promise<void>;
  /* @conditional-compile-remove(close-captions) */
  /**
   * Function to set spoken language
   * @param language - spoken language
   */
  setSpokenLanguage(language: string): Promise<void>;
  /* @conditional-compile-remove(close-captions) */
  /**
   * Funtion to stop captions
   */
  stopCaptions(): Promise<void>;

  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Start the blur video background effect.
   *
   * @beta
   */
  blurVideoBackground(backgroundBlurConfig?: BackgroundBlurConfig): Promise<void>;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Start the video background replacement effect.
   *
   * @beta
   */
  replaceVideoBackground(backgroundReplacementConfig: BackgroundReplacementConfig): Promise<void>;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Stop the video background effect.
   *
   * @beta
   */
  stopVideoBackgroundEffect(): Promise<void>;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Override the background picker images for background replacement effect.
   *
   * @param backgroundImages - Array of custom background images.
   *
   * @beta
   */
  updateBackgroundPickerImages(backgroundImages: VideoBackgroundImage[]): void;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Update the selected video background effect
   *
   * @beta
   */
  updateSelectedVideoBackgroundEffect(selectedVideoBackground: SelectedVideoBackgroundEffect): void;
  /* @conditional-compile-remove(incoming-call-composites) */
  /**
   * Handler for accepting an incoming call.
   * @param incomingCall - incoming call object
   * @param video - whether to accept the call with video on.
   * @param audio - whether to accept the call with audio on.
   *
   * @beta
   */
  acceptCall(incomingCall: IncomingCall, video?: boolean, audio?: boolean): Promise<Call>;
  /* @conditional-compile-remove(incoming-call-composites) */
  /**
   * Handler for rejecting an incoming call.
   * @param incomingCall - incoming call object
   *
   * @beta
   */
  rejectCall(incomingCall: IncomingCall): Promise<void>;
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
  on(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
  on(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
  on(event: 'callError', listener: (e: AdapterError) => void): void;
  /* @conditional-compile-remove(close-captions) */
  on(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  /* @conditional-compile-remove(close-captions) */
  on(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  /* @conditional-compile-remove(incoming-call-composites) */
  on(event: 'incomingCall', listener: IncomingCallListener): void;
  /* @conditional-compile-remove(incoming-call-composites) */
  on(event: 'callsUpdated', listener: CollectionUpdatedEvent<Call>): void;

  off(event: 'callEnded', listener: CallEndedListener): void;
  off(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  off(event: 'callIdChanged', listener: CallIdChangedListener): void;
  off(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  off(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  off(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  off(event: 'callParticipantsJoined', listener: ParticipantsJoinedListener): void;
  off(event: 'callParticipantsLeft', listener: ParticipantsLeftListener): void;
  off(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
  off(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
  off(event: 'callError', listener: (e: AdapterError) => void): void;
  /* @conditional-compile-remove(close-captions) */
  off(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  /* @conditional-compile-remove(close-captions) */
  off(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  /* @conditional-compile-remove(incoming-call-composites) */
  off(event: 'incomingCall', listener: IncomingCallListener): void;
  /* @conditional-compile-remove(incoming-call-composites) */
  off(event: 'callsUpdated', listener: CollectionUpdatedEvent<Call>): void;

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
 *
 * @public
 */
export interface CallWithChatAdapter
  extends CallWithChatAdapterManagement,
    AdapterState<CallWithChatAdapterState>,
    Disposable,
    CallWithChatAdapterSubscriptions {}

/**
 * Events fired off by the {@link CallWithChatAdapter}.
 *
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
  | 'selectedMicrophoneChanged'
  | 'selectedSpeakerChanged'
  | /* @conditional-compile-remove(close-captions) */ 'isCaptionsActiveChanged'
  | /* @conditional-compile-remove(close-captions) */ 'captionsReceived'
  | /* @conditional-compile-remove(incoming-call-composites) */ 'incomingCall'
  | /* @conditional-compile-remove(incoming-call-composites) */ 'callsUpdated'
  | 'messageReceived'
  | 'messageSent'
  | 'messageRead'
  | 'chatParticipantsAdded'
  | 'chatParticipantsRemoved';
