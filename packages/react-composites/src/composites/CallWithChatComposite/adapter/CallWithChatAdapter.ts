// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
  MessageDeletedListener,
  MessageEditedListener,
  MessageReadListener,
  MessageReceivedListener,
  MessageSentListener,
  ParticipantsAddedListener,
  ParticipantsRemovedListener
} from '../../ChatComposite';
import { ResourceDetails } from '../../ChatComposite';
import { CallWithChatAdapterState } from '../state/CallWithChatAdapterState';
import type { AdapterError, AdapterState } from '../../common/adapters';
import {
  AudioDeviceInfo,
  Call,
  DeviceAccess,
  PermissionConstraints,
  PropertyChangedEvent,
  StartCallOptions,
  VideoDeviceInfo
} from '@azure/communication-calling';
import { Reaction } from '@azure/communication-calling';
import { AddPhoneNumberOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(breakout-rooms) */
import { BreakoutRoomsUpdatedListener } from '@azure/communication-calling';
import { DtmfTone } from '@azure/communication-calling';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
import { SendMessageOptions } from '@azure/communication-chat';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { UploadChatImageResult } from '@internal/acs-ui-common';
import {
  JoinCallOptions,
  StartCaptionsAdapterOptions,
  StopCaptionsAdapterOptions
} from '../../CallComposite/adapter/CallAdapter';
/* @conditional-compile-remove(file-sharing-acs) */
import { MessageOptions } from '@internal/acs-ui-common';
import { PhoneNumberIdentifier } from '@azure/communication-common';
import { UnknownIdentifier, MicrosoftTeamsAppIdentifier } from '@azure/communication-common';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import { CommunicationIdentifier } from '@azure/communication-common';
import {
  CaptionsReceivedListener,
  IsCaptionsActiveChangedListener,
  IsCaptionLanguageChangedListener,
  IsSpokenLanguageChangedListener
} from '../../CallComposite/adapter/CallAdapter';

import { CapabilitiesChangedListener } from '../../CallComposite/adapter/CallAdapter';
import { SpotlightChangedListener } from '../../CallComposite/adapter/CallAdapter';

import { VideoBackgroundImage, VideoBackgroundEffect } from '../../CallComposite';

import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';

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
  /**
   * Remove a participant from the call.
   * @param participant - {@link @azure/communication-common#CommunicationIdentifier} of the participant to be removed
   * @public
   */
  removeParticipant(participant: CommunicationIdentifier): Promise<void>;

  // Call Interface Methods
  /**
   * Join the call with microphone initially on/off.
   * @deprecated Use joinCall(options?:JoinCallOptions) instead.
   * @param microphoneOn - Whether microphone is initially enabled
   *
   * @public
   */
  joinCall(microphoneOn?: boolean): Call | undefined;
  /**
   * Join the call with options bag to set microphone/camera initial state when joining call
   * true = turn on the device when joining call
   * false = turn off the device when joining call
   * 'keep'/undefined = retain devices' precall state
   *
   * @param options - param to set microphone/camera initially on/off/use precall state.
   *
   * @public
   */
  joinCall(options?: JoinCallOptions): Call | undefined;
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
  /**
   * Start the call.
   * @param participants - An array of {@link @azure/communication-common#CommunicationIdentifier} to be called
   * @public
   */
  startCall(
    participants: (
      | MicrosoftTeamsAppIdentifier
      | PhoneNumberIdentifier
      | CommunicationUserIdentifier
      | MicrosoftTeamsUserIdentifier
      | UnknownIdentifier
    )[],
    options?: StartCallOptions
  ): Call | undefined;
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
   * Raise hand for local user.
   *
   * @public
   */
  raiseHand(): Promise<void>;
  /**
   * Lower hand for local user.
   *
   * @public
   */
  lowerHand(): Promise<void>;
  /**
   * Send Reaction to ongoing meeting.
   * @param reaction - A value of type {@link @azure/communication-calling#Reaction}
   *
   * @public
   */
  onReactionClick(reaction: Reaction): Promise<void>;
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
   * Dispose the html view for a screen share stream
   *
   * @remarks
   * this method is implemented for composite
   *
   * @param remoteUserId - Id of the participant to dispose the screen share stream view for.
   *
   * @public
   */
  disposeScreenShareStreamView(remoteUserId: string): Promise<void>;
  /**
   * Dispose the html view for a remote video stream
   *
   * @param remoteUserId - Id of the participant to dispose
   *
   * @public
   */
  disposeRemoteVideoStreamView(remoteUserId: string): Promise<void>;
  /**
   * Dispose the html view for a local video stream
   *
   * @public
   */
  disposeLocalVideoStreamView(): Promise<void>;
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
  askDevicePermission(constrain: PermissionConstraints): Promise<DeviceAccess>;
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
  sendMessage(
    content: string,
    options?: SendMessageOptions | /* @conditional-compile-remove(file-sharing-acs) */ MessageOptions
  ): Promise<void>;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Upload an inline image for a message.
   *
   * @beta
   */
  uploadImage(image: Blob, imageFilename: string): Promise<UploadChatImageResult>;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Delete an inline image for a message.
   *
   * @beta
   */
  deleteImage(imageId: string): Promise<void>;
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
  updateMessage(
    messageId: string,
    content: string,
    options?: Record<string, string> | /* @conditional-compile-remove(file-sharing-acs) */ MessageOptions
  ): Promise<void>;
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
  /** @public */
  downloadResourceToCache(resourceDetails: ResourceDetails): Promise<void>;
  /** @public */
  removeResourceFromCache(resourceDetails: ResourceDetails): void;
  /**
   * Puts the Call in a Localhold.
   *
   * @public
   */
  holdCall(): Promise<void>;
  /**
   * Resumes the call from a LocalHold state.
   *
   * @public
   */
  resumeCall(): Promise<void>;
  /**
   * Adds a new Participant to the call.
   *
   * @public
   */
  addParticipant(participant: PhoneNumberIdentifier, options?: AddPhoneNumberOptions): Promise<void>;
  addParticipant(participant: CommunicationUserIdentifier): Promise<void>;
  /**
   * send dtmf tone to another participant in the call in 1:1 calls
   *
   * @public
   */
  sendDtmfTone: (dtmfTone: DtmfTone) => Promise<void>;
  /* @conditional-compile-remove(unsupported-browser) */
  /**
   * Continues into a call when the browser version is not supported.
   */
  allowUnsupportedBrowserVersion(): void;
  /**
   * Function to Start captions
   * @param options - options for start captions
   */
  startCaptions(options?: StartCaptionsAdapterOptions): Promise<void>;
  /**
   * Function to set caption language
   * @param language - language set for caption
   */
  setCaptionLanguage(language: string): Promise<void>;
  /**
   * Function to set spoken language
   * @param language - spoken language
   */
  setSpokenLanguage(language: string): Promise<void>;
  /**
   * Funtion to stop captions
   */
  stopCaptions(options?: StopCaptionsAdapterOptions): Promise<void>;

  /**
   * Start the video background effect.
   *
   * @public
   */
  startVideoBackgroundEffect(videoBackgroundEffect: VideoBackgroundEffect): Promise<void>;

  /**
   * Stop the video background effect.
   *
   * @public
   */
  stopVideoBackgroundEffects(): Promise<void>;

  /**
   * Override the background picker images for background replacement effect.
   *
   * @param backgroundImages - Array of custom background images.
   *
   * @public
   */
  updateBackgroundPickerImages(backgroundImages: VideoBackgroundImage[]): void;

  /**
   * Update the selected video background effect
   *
   * @public
   */
  updateSelectedVideoBackgroundEffect(selectedVideoBackground: VideoBackgroundEffect): void;
  /* @conditional-compile-remove(DNS) */
  /**
   * Start the noise suppression effect.
   */
  startNoiseSuppressionEffect(): Promise<void>;
  /* @conditional-compile-remove(DNS) */
  /**
   * Start the noise suppression effect.
   */
  stopNoiseSuppressionEffect(): Promise<void>;
  /**
   * Send the end of call survey result
   *
   * @public
   */
  submitSurvey(survey: CallSurvey): Promise<CallSurveyResponse | undefined>;
  /**
   * Start spotlight
   */
  startSpotlight(userIds?: string[]): Promise<void>;
  /**
   * Stop spotlight
   */
  stopSpotlight(userIds?: string[]): Promise<void>;
  /**
   * Stop all spotlights
   */
  stopAllSpotlight(): Promise<void>;
  /* @conditional-compile-remove(soft-mute) */
  /**
   * Mute a participant
   */
  muteParticipant(userId: string): Promise<void>;
  /* @conditional-compile-remove(soft-mute) */
  /**
   * Mute a participant
   */
  muteAllRemoteParticipants(): Promise<void>;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Return to origin call of breakout room
   */
  returnFromBreakoutRoom(): Promise<void>;
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
  on(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  on(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  on(event: 'isCaptionLanguageChanged', listener: IsCaptionLanguageChangedListener): void;
  on(event: 'isSpokenLanguageChanged', listener: IsSpokenLanguageChangedListener): void;
  on(event: 'capabilitiesChanged', listener: CapabilitiesChangedListener): void;
  on(event: 'spotlightChanged', listener: SpotlightChangedListener): void;
  /* @conditional-compile-remove(breakout-rooms) */
  on(event: 'breakoutRoomsUpdated', listener: BreakoutRoomsUpdatedListener): void;
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
  off(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  off(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  off(event: 'isCaptionLanguageChanged', listener: IsCaptionLanguageChangedListener): void;
  off(event: 'isSpokenLanguageChanged', listener: IsSpokenLanguageChangedListener): void;
  off(event: 'capabilitiesChanged', listener: CapabilitiesChangedListener): void;
  off(event: 'spotlightChanged', listener: SpotlightChangedListener): void;
  /* @conditional-compile-remove(breakout-rooms) */
  off(event: 'breakoutRoomsUpdated', listener: BreakoutRoomsUpdatedListener): void;

  // Chat subscriptions
  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageEdited', listener: MessageEditedListener): void;
  on(event: 'messageDeleted', listener: MessageDeletedListener): void;
  on(event: 'messageSent', listener: MessageSentListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;
  on(event: 'chatParticipantsAdded', listener: ParticipantsAddedListener): void;
  on(event: 'chatParticipantsRemoved', listener: ParticipantsRemovedListener): void;
  on(event: 'chatError', listener: (e: AdapterError) => void): void;

  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageEdited', listener: MessageEditedListener): void;
  off(event: 'messageDeleted', listener: MessageDeletedListener): void;
  off(event: 'messageSent', listener: MessageSentListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
  off(event: 'chatParticipantsAdded', listener: ParticipantsAddedListener): void;
  off(event: 'chatParticipantsRemoved', listener: ParticipantsRemovedListener): void;
  off(event: 'chatError', listener: (e: AdapterError) => void): void;

  // CallWithChat subscriptions
  on(event: 'chatInitialized', listener: ChatInitializedListener): void;
  off(event: 'chatInitialized', listener: ChatInitializedListener): void;
}

/**
 * Callback for {@link CallWithChatAdapterSubscribers} 'chatInitialized' event.
 *
 * @public
 */
export type ChatInitializedListener = (event: { adapter: CallWithChatAdapter }) => void;

/**
 * {@link CallWithChatComposite} Adapter interface.
 *
 * @public
 */
export interface CallWithChatAdapter
  extends CallWithChatAdapterManagement,
    AdapterState<CallWithChatAdapterState>,
    CallWithChatAdapterSubscriptions {
  /**
   * Dispose of the adapter. This performs cleanup of resources.
   */
  dispose(options?: { doNotDisposeCallAgent?: boolean }): Promise<void>;
}

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
  | 'isCaptionsActiveChanged'
  | 'captionsReceived'
  | 'isCaptionLanguageChanged'
  | 'isSpokenLanguageChanged'
  | 'capabilitiesChanged'
  | 'spotlightChanged'
  | /* @conditional-compile-remove(breakout-rooms) */ 'breakoutRoomsUpdated'
  | 'messageReceived'
  | 'messageEdited'
  | 'messageDeleted'
  | 'messageSent'
  | 'messageRead'
  | 'chatParticipantsAdded'
  | 'chatParticipantsRemoved'
  | 'chatInitialized';
