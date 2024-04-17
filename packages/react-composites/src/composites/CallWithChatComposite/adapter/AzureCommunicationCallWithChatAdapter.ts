// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/no-unused-vars */ // REMOVE ONCE THIS FILE IS IMPLEMENTED
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */ // REMOVE ONCE THIS FILE IS IMPLEMENTED

import {
  AudioDeviceInfo,
  Call,
  CallAgent,
  GroupCallLocator,
  PermissionConstraints,
  PropertyChangedEvent,
  TeamsMeetingLinkLocator,
  StartCallOptions,
  VideoDeviceInfo
} from '@azure/communication-calling';
/* @conditional-compile-remove(meeting-id) */
import { TeamsMeetingIdLocator } from '@azure/communication-calling';
/* @conditional-compile-remove(reaction) */
import { Reaction } from '@azure/communication-calling';
/* @conditional-compile-remove(close-captions) */
import { StartCaptionsOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
import { DtmfTone } from '@azure/communication-calling';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
/* @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadata, AttachmentUploadManager } from '@internal/react-components';
import {
  ParticipantsJoinedListener,
  ParticipantsLeftListener,
  IsMutedChangedListener,
  CallIdChangedListener,
  IsLocalScreenSharingActiveChangedListener,
  DisplayNameChangedListener,
  IsSpeakingChangedListener,
  CallAdapter,
  CallAdapterState,
  CallEndedListener
} from '../../CallComposite';
import {
  MessageReceivedListener,
  MessageReadListener,
  ChatAdapter,
  ChatAdapterState,
  ParticipantsRemovedListener,
  ParticipantsAddedListener,
  MessageEditedListener,
  MessageDeletedListener
} from '../../ChatComposite';
import { ResourceDetails } from '../../ChatComposite';
import { CallWithChatAdapter, CallWithChatEvent } from './CallWithChatAdapter';
import {
  callWithChatAdapterStateFromBackingStates,
  CallWithChatAdapterState,
  mergeCallAdapterStateIntoCallWithChatAdapterState,
  mergeChatAdapterStateIntoCallWithChatAdapterState
} from '../state/CallWithChatAdapterState';
import {
  _createAzureCommunicationChatAdapterInner,
  _createLazyAzureCommunicationChatAdapterInner,
  createAzureCommunicationChatAdapterFromClient
} from '../../ChatComposite/adapter/AzureCommunicationChatAdapter';
import { EventEmitter } from 'events';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(PSTN-calls) */
import {
  CommunicationIdentifier,
  isCommunicationUserIdentifier,
  PhoneNumberIdentifier
} from '@azure/communication-common';
import { AdapterError } from '../../common/adapters';

/* @conditional-compile-remove(teams-adhoc-call) */
import { CallParticipantsLocator } from '../../CallComposite/adapter/AzureCommunicationCallAdapter';

import { _createAzureCommunicationCallAdapterInner } from '../../CallComposite/adapter/AzureCommunicationCallAdapter';

import {
  CallAdapterLocator,
  createAzureCommunicationCallAdapterFromClient
} from '../../CallComposite/adapter/AzureCommunicationCallAdapter';
import { StatefulCallClient } from '@internal/calling-stateful-client';
import { StatefulChatClient } from '@internal/chat-stateful-client';
import { ChatThreadClient } from '@azure/communication-chat';
import { useEffect, useRef, useState } from 'react';
import { _toCommunicationIdentifier, _TelemetryImplementationHint } from '@internal/acs-ui-common';
import { JoinCallOptions, StartCallIdentifier } from '../../CallComposite/adapter/CallAdapter';

import { AzureCommunicationCallAdapterOptions } from '../../CallComposite/adapter/AzureCommunicationCallAdapter';
/* @conditional-compile-remove(close-captions) */
import {
  IsCaptionsActiveChangedListener,
  CaptionsReceivedListener,
  IsCaptionLanguageChangedListener,
  IsSpokenLanguageChangedListener
} from '../../CallComposite/adapter/CallAdapter';

import { CapabilitiesChangedListener } from '../../CallComposite/adapter/CallAdapter';
/* @conditional-compile-remove(spotlight) */
import { SpotlightChangedListener } from '../../CallComposite/adapter/CallAdapter';

import { VideoBackgroundImage, VideoBackgroundEffect } from '../../CallComposite';
/* @conditional-compile-remove(end-of-call-survey) */
import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';

type CallWithChatAdapterStateChangedHandler = (newState: CallWithChatAdapterState) => void;

/** Context of Call with Chat, which is a centralized context for all state updates */
class CallWithChatContext {
  private emitter = new EventEmitter();
  private state: CallWithChatAdapterState;

  constructor(clientState: CallWithChatAdapterState, maxListeners = 50) {
    this.state = clientState;
    this.emitter.setMaxListeners(maxListeners);
  }

  public onStateChange(handler: CallWithChatAdapterStateChangedHandler): void {
    this.emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: CallWithChatAdapterStateChangedHandler): void {
    this.emitter.off('stateChanged', handler);
  }

  public setState(state: CallWithChatAdapterState): void {
    this.state = state;
    this.emitter.emit('stateChanged', this.state);
  }

  public getState(): CallWithChatAdapterState {
    return this.state;
  }

  public updateClientState(clientState: CallWithChatAdapterState): void {
    this.setState(clientState);
  }

  public updateClientStateWithChatState(chatAdapterState: ChatAdapterState): void {
    this.updateClientState(mergeChatAdapterStateIntoCallWithChatAdapterState(this.state, chatAdapterState));
  }

  public updateClientStateWithCallState(callAdapterState: CallAdapterState): void {
    this.updateClientState(mergeCallAdapterStateIntoCallWithChatAdapterState(this.state, callAdapterState));
  }
}

/**
 * CallWithChat adapter backed by Azure Communication Services.
 * Created for easy use with the {@link CallWithChatComposite}.
 */
export class AzureCommunicationCallWithChatAdapter implements CallWithChatAdapter {
  private callAdapter: CallAdapter;
  private chatAdapterPromise: Promise<ChatAdapter>;
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  private chatAdapter: ChatAdapter | undefined;
  private context: CallWithChatContext;
  private onChatStateChange: (newChatAdapterState: ChatAdapterState) => void;
  private onCallStateChange: (newChatAdapterState: CallAdapterState) => void;

  constructor(callAdapter: CallAdapter, chatAdapterPromise: Promise<ChatAdapter>) {
    this.bindPublicMethods();
    this.callAdapter = callAdapter;
    this.context = new CallWithChatContext(callWithChatAdapterStateFromBackingStates(callAdapter));

    const onChatStateChange = (newChatAdapterState: ChatAdapterState): void => {
      this.context.updateClientStateWithChatState(newChatAdapterState);
    };
    this.onChatStateChange = onChatStateChange;

    this.chatAdapterPromise = chatAdapterPromise;
    this.chatAdapterPromise.then((chatAdapter) => {
      chatAdapter.onStateChange(this.onChatStateChange);
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      this.chatAdapter = chatAdapter;
      this.context.updateClientStateWithChatState(chatAdapter.getState());
    });

    const onCallStateChange = (newCallAdapterState: CallAdapterState): void => {
      this.context.updateClientStateWithCallState(newCallAdapterState);
    };
    this.callAdapter.onStateChange(onCallStateChange);
    this.onCallStateChange = onCallStateChange;
  }

  private bindPublicMethods(): void {
    this.joinCall.bind(this);
    this.leaveCall.bind(this);
    this.startCall.bind(this);
    this.onStateChange.bind(this);
    this.offStateChange.bind(this);
    this.getState.bind(this);
    this.dispose.bind(this);
    this.setCamera.bind(this);
    this.setMicrophone.bind(this);
    this.setSpeaker.bind(this);
    this.askDevicePermission.bind(this);
    this.queryCameras.bind(this);
    this.queryMicrophones.bind(this);
    this.querySpeakers.bind(this);
    this.startCamera.bind(this);
    this.stopCamera.bind(this);
    this.mute.bind(this);
    this.unmute.bind(this);
    this.startScreenShare.bind(this);
    this.stopScreenShare.bind(this);
    this.raiseHand.bind(this);
    this.lowerHand.bind(this);
    /* @conditional-compile-remove(reaction) */
    this.onReactionClick.bind(this);
    this.removeParticipant.bind(this);
    this.createStreamView.bind(this);
    this.disposeStreamView.bind(this);
    this.disposeScreenShareStreamView.bind(this);
    this.fetchInitialData.bind(this);
    this.sendMessage.bind(this);
    this.sendReadReceipt.bind(this);
    this.sendTypingIndicator.bind(this);
    this.loadPreviousChatMessages.bind(this);
    this.updateMessage.bind(this);
    this.deleteMessage.bind(this);
    this.on.bind(this);
    this.off.bind(this);
    /* @conditional-compile-remove(attachment-upload) */
    this.registerActiveUploads = this.registerActiveUploads.bind(this);
    /* @conditional-compile-remove(attachment-upload) */
    this.registerCompletedUploads = this.registerCompletedUploads.bind(this);
    /* @conditional-compile-remove(attachment-upload) */
    this.clearUploads = this.clearUploads.bind(this);
    /* @conditional-compile-remove(attachment-upload) */
    this.cancelUpload = this.cancelUpload.bind(this);
    /* @conditional-compile-remove(attachment-upload) */
    this.updateUploadProgress = this.updateUploadProgress.bind(this);
    /* @conditional-compile-remove(attachment-upload) */
    this.updateUploadStatusMessage = this.updateUploadStatusMessage.bind(this);
    /* @conditional-compile-remove(attachment-upload) */
    this.updateUploadMetadata = this.updateUploadMetadata.bind(this);
    this.downloadResourceToCache = this.downloadResourceToCache.bind(this);
    this.removeResourceFromCache = this.removeResourceFromCache.bind(this);
    /* @conditional-compile-remove(PSTN-calls) */
    this.holdCall.bind(this);
    /* @conditional-compile-remove(PSTN-calls) */
    this.resumeCall.bind(this);
    /* @conditional-compile-remove(PSTN-calls) */
    this.addParticipant.bind(this);
    this.sendDtmfTone.bind(this);
    /* @conditional-compile-remove(unsupported-browser) */
    this.allowUnsupportedBrowserVersion.bind(this);
    /* @conditional-compile-remove(close-captions) */ {
      this.startCaptions.bind(this);
      this.stopCaptions.bind(this);
      this.setSpokenLanguage.bind(this);
      this.setCaptionLanguage.bind(this);
    }

    this.startVideoBackgroundEffect.bind(this);

    this.stopVideoBackgroundEffects.bind(this);

    this.updateBackgroundPickerImages.bind(this);
  }

  /** Join existing Call. */
  public joinCall(options?: boolean | JoinCallOptions): Call | undefined {
    if (typeof options === 'boolean') {
      return this.callAdapter.joinCall(options);
    } else {
      return this.callAdapter.joinCall(options);
    }
  }
  /** Leave current Call. */
  public async leaveCall(forEveryone?: boolean): Promise<void> {
    // Only remove self from the GroupCall. Contoso must manage access to Chat.
    await this.callAdapter.leaveCall(forEveryone);
  }

  /** Start a new Call. */
  public startCall(participants: string[], options?: StartCallOptions): Call | undefined;
  /** Start a new Call. */
  public startCall(participants: StartCallIdentifier[], options?: StartCallOptions): Call | undefined;
  /** Start a new Call. */
  public startCall(participants: string[] | StartCallIdentifier[], options?: StartCallOptions): Call | undefined {
    if (participants.length === 0) {
      throw new Error('At least one participant is required to start a call');
    }
    if (typeof participants[0] === 'string') {
      return this.callAdapter.startCall(participants as string[], options);
    } else {
      return this.callAdapter.startCall(participants as StartCallIdentifier[], options);
    }
  }
  /**
   * Subscribe to state change events.
   * @param handler - handler to be called when the state changes. This is passed the new state.
   */
  public onStateChange(handler: (state: CallWithChatAdapterState) => void): void {
    this.context.onStateChange(handler);
  }
  /**
   * Unsubscribe to state change events.
   * @param handler - handler to be no longer called when state changes.
   */
  public offStateChange(handler: (state: CallWithChatAdapterState) => void): void {
    this.context.offStateChange(handler);
  }
  /** Get current Call and Chat state. */
  public getState(): CallWithChatAdapterState {
    return this.context.getState();
  }
  /** Dispose of the current CallWithChatAdapter. */
  public async dispose(): Promise<void> {
    this.chatAdapterPromise.then((adapter) => {
      adapter.offStateChange(this.onChatStateChange);
    });
    this.callAdapter.offStateChange(this.onCallStateChange);

    await this.chatAdapterPromise.then((adapter) => {
      adapter.dispose();
    });
    this.callAdapter.dispose();
  }
  /** Remove a participant from the Call only. */
  public async removeParticipant(
    userId: string | /* @conditional-compile-remove(PSTN-calls) */ CommunicationIdentifier
  ): Promise<void> {
    let participant = userId;
    /* @conditional-compile-remove(PSTN-calls) */
    participant = _toCommunicationIdentifier(userId);
    await this.callAdapter.removeParticipant(participant);
  }
  public async setCamera(device: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void> {
    await this.callAdapter.setCamera(device, options);
  }
  /** Set the microphone to be used in the Call. */
  public async setMicrophone(device: AudioDeviceInfo): Promise<void> {
    await this.callAdapter.setMicrophone(device);
  }
  /** Set the speaker to be used in the Call. */
  public async setSpeaker(device: AudioDeviceInfo): Promise<void> {
    await this.callAdapter.setSpeaker(device);
  }
  public async askDevicePermission(constraints: PermissionConstraints): Promise<void> {
    await this.callAdapter.askDevicePermission(constraints);
  }
  /** Query for available cameras. */
  public async queryCameras(): Promise<VideoDeviceInfo[]> {
    return await this.callAdapter.queryCameras();
  }
  /** Query for available microphones. */
  public async queryMicrophones(): Promise<AudioDeviceInfo[]> {
    return await this.callAdapter.queryMicrophones();
  }
  /** Query for available speakers. */
  public async querySpeakers(): Promise<AudioDeviceInfo[]> {
    return await this.callAdapter.querySpeakers();
  }
  /** Start the camera for the user in the Call. */
  public async startCamera(options?: VideoStreamOptions): Promise<void> {
    await this.callAdapter.startCamera(options);
  }
  /** Stop the camera for the user in the Call. */
  public async stopCamera(): Promise<void> {
    await this.callAdapter.stopCamera();
  }
  /** Mute the user in the Call. */
  public async mute(): Promise<void> {
    await this.callAdapter.mute();
  }
  /** Unmute the user in the Call. */
  public async unmute(): Promise<void> {
    await this.callAdapter.unmute();
  }
  /** Trigger the user to start screen share. */
  public async startScreenShare(): Promise<void> {
    await this.callAdapter.startScreenShare();
  }
  /** Stop the current active screen share. */
  public async stopScreenShare(): Promise<void> {
    await this.callAdapter.stopScreenShare();
  }
  /** Raise hand for local user. */
  public async raiseHand(): Promise<void> {
    await this.callAdapter.raiseHand();
  }
  /** Lower hand for local user. */
  public async lowerHand(): Promise<void> {
    await this.callAdapter.lowerHand();
  }
  /* @conditional-compile-remove(reaction) */
  public async onReactionClick(reaction: Reaction): Promise<void> {
    await this.callAdapter.onReactionClick(reaction);
  }
  /** Create a stream view for a remote participants video feed. */
  public async createStreamView(
    remoteUserId?: string,
    options?: VideoStreamOptions
  ): Promise<void | CreateVideoStreamViewResult> {
    return await this.callAdapter.createStreamView(remoteUserId, options);
  }
  /** Dispose of a created stream view of a remote participants video feed. */
  public async disposeStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void> {
    await this.callAdapter.disposeStreamView(remoteUserId, options);
  }
  /** Dispose of a remote screen share */
  public async disposeScreenShareStreamView(remoteUserId: string): Promise<void> {
    await this.callAdapter.disposeScreenShareStreamView(remoteUserId);
  }
  /** Dispose of a remote video stream */
  public async disposeRemoteVideoStreamView(remoteUserId: string): Promise<void> {
    await this.callAdapter.disposeRemoteVideoStreamView(remoteUserId);
  }
  /** Dispose of the local video stream */
  public async disposeLocalVideoStreamView(): Promise<void> {
    await this.callAdapter.disposeLocalVideoStreamView();
  }
  /** Fetch initial Call and Chat data such as chat messages. */
  public async fetchInitialData(): Promise<void> {
    return await this.chatAdapterPromise.then((adapter) => {
      return adapter.fetchInitialData();
    });
  }
  /** Send a chat message. */
  public async sendMessage(content: string): Promise<void> {
    return await this.chatAdapterPromise.then((adapter) => {
      return adapter.sendMessage(content);
    });
  }
  /** Send a chat read receipt. */
  public async sendReadReceipt(chatMessageId: string): Promise<void> {
    return await this.chatAdapterPromise.then((adapter) => {
      return adapter.sendReadReceipt(chatMessageId);
    });
  }
  /** Send an isTyping indicator. */
  public async sendTypingIndicator(): Promise<void> {
    return await this.chatAdapterPromise.then((adapter) => {
      return adapter.sendTypingIndicator();
    });
  }
  /** Load previous Chat messages. */
  public async loadPreviousChatMessages(messagesToLoad: number): Promise<boolean> {
    return await this.chatAdapterPromise.then((adapter) => {
      return adapter.loadPreviousChatMessages(messagesToLoad);
    });
  }
  /** Update an existing message. */
  public async updateMessage(
    messageId: string,
    content: string,
    metadata?: Record<string, string>,
    options?: {
      /* @conditional-compile-remove(attachment-upload) */
      attachmentMetadata?: AttachmentMetadata[];
    }
  ): Promise<void> {
    return this.chatAdapterPromise.then((adapter) => {
      return adapter.updateMessage(
        messageId,
        content,
        metadata,
        /* @conditional-compile-remove(attachment-upload) */ options
      );
    });
  }
  /** Delete an existing message. */
  public async deleteMessage(messageId: string): Promise<void> {
    return await this.chatAdapterPromise.then((adapter) => {
      return adapter.deleteMessage(messageId);
    });
  }
  /* @conditional-compile-remove(attachment-upload) */
  public registerActiveUploads = (files: File[]): AttachmentUploadManager[] => {
    return this.chatAdapter?.registerActiveUploads(files) ?? [];
  };
  /* @conditional-compile-remove(attachment-upload) */
  public registerCompletedUploads = (metadata: AttachmentMetadata[]): AttachmentUploadManager[] => {
    return this.chatAdapter?.registerCompletedUploads(metadata) ?? [];
  };
  /* @conditional-compile-remove(attachment-upload) */
  public clearUploads = (): void => {
    this.chatAdapterPromise.then((adapter) => {
      adapter.clearUploads();
    });
  };
  /* @conditional-compile-remove(attachment-upload) */
  public cancelUpload = (id: string): void => {
    this.chatAdapterPromise.then((adapter) => {
      adapter.cancelUpload(id);
    });
  };
  /* @conditional-compile-remove(attachment-upload) */
  public updateUploadProgress = (id: string, progress: number): void => {
    this.chatAdapterPromise.then((adapter) => {
      adapter.updateUploadProgress(id, progress);
    });
  };
  /* @conditional-compile-remove(attachment-upload) */
  public updateUploadStatusMessage = (id: string, errorMessage: string): void => {
    this.chatAdapterPromise.then((adapter) => {
      adapter.updateUploadStatusMessage(id, errorMessage);
    });
  };
  /* @conditional-compile-remove(attachment-upload) */
  public updateUploadMetadata = (id: string, metadata: AttachmentMetadata): void => {
    this.chatAdapterPromise.then((adapter) => {
      adapter.updateUploadMetadata(id, metadata);
    });
  };
  public async downloadResourceToCache(resourceDetails: ResourceDetails): Promise<void> {
    this.chatAdapterPromise.then((adapter) => {
      adapter.downloadResourceToCache(resourceDetails);
    });
  }
  public removeResourceFromCache(resourceDetails: ResourceDetails): void {
    this.chatAdapterPromise.then((adapter) => {
      adapter.removeResourceFromCache(resourceDetails);
    });
  }
  /* @conditional-compile-remove(PSTN-calls) */
  public async holdCall(): Promise<void> {
    return await this.callAdapter.holdCall();
  }
  /* @conditional-compile-remove(PSTN-calls) */
  public async resumeCall(): Promise<void> {
    return await this.callAdapter.resumeCall();
  }
  /* @conditional-compile-remove(PSTN-calls) */
  public async addParticipant(participant: PhoneNumberIdentifier, options?: AddPhoneNumberOptions): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  public async addParticipant(participant: CommunicationUserIdentifier): Promise<void>;
  /* @conditional-compile-remove(PSTN-calls) */
  public async addParticipant(
    participant: PhoneNumberIdentifier | CommunicationUserIdentifier,
    options?: AddPhoneNumberOptions
  ): Promise<void> {
    if (isCommunicationUserIdentifier(participant)) {
      return await this.callAdapter.addParticipant(participant);
    } else {
      return await this.callAdapter.addParticipant(participant, options);
    }
  }

  public async sendDtmfTone(dtmfTone: DtmfTone): Promise<void> {
    return await this.callAdapter.sendDtmfTone(dtmfTone);
  }

  /* @conditional-compile-remove(unsupported-browser) */
  public allowUnsupportedBrowserVersion(): void {
    return this.callAdapter.allowUnsupportedBrowserVersion();
  }

  /* @conditional-compile-remove(close-captions) */
  public async startCaptions(options?: StartCaptionsOptions): Promise<void> {
    await this.callAdapter.startCaptions(options);
  }

  /* @conditional-compile-remove(close-captions) */
  public async stopCaptions(): Promise<void> {
    await this.callAdapter.stopCaptions();
  }

  /* @conditional-compile-remove(close-captions) */
  public async setCaptionLanguage(language: string): Promise<void> {
    await this.callAdapter.setCaptionLanguage(language);
  }

  /* @conditional-compile-remove(close-captions) */
  public async setSpokenLanguage(language: string): Promise<void> {
    await this.callAdapter.setSpokenLanguage(language);
  }

  public async startVideoBackgroundEffect(videoBackgroundEffect: VideoBackgroundEffect): Promise<void> {
    await this.callAdapter.startVideoBackgroundEffect(videoBackgroundEffect);
  }

  public async stopVideoBackgroundEffects(): Promise<void> {
    return await this.callAdapter.stopVideoBackgroundEffects();
  }

  public updateBackgroundPickerImages(backgroundImages: VideoBackgroundImage[]): void {
    return this.callAdapter.updateBackgroundPickerImages(backgroundImages);
  }

  public updateSelectedVideoBackgroundEffect(selectedVideoBackground: VideoBackgroundEffect): void {
    return this.callAdapter.updateSelectedVideoBackgroundEffect(selectedVideoBackground);
  }
  /* @conditional-compile-remove(end-of-call-survey) */
  public async submitSurvey(survey: CallSurvey): Promise<CallSurveyResponse | undefined> {
    return this.callAdapter.submitSurvey(survey);
  }

  /* @conditional-compile-remove(spotlight) */
  public async startSpotlight(userIds?: string[]): Promise<void> {
    return this.callAdapter.startSpotlight(userIds);
  }

  /* @conditional-compile-remove(spotlight) */
  public async stopSpotlight(userIds?: string[]): Promise<void> {
    return this.callAdapter.stopSpotlight(userIds);
  }

  /* @conditional-compile-remove(spotlight) */
  public async stopAllSpotlight(): Promise<void> {
    return this.callAdapter.stopAllSpotlight();
  }

  on(event: 'callParticipantsJoined', listener: ParticipantsJoinedListener): void;
  on(event: 'callParticipantsLeft', listener: ParticipantsLeftListener): void;
  on(event: 'callEnded', listener: CallEndedListener): void;
  on(event: 'callError', listener: (e: AdapterError) => void): void;
  on(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  on(event: 'callIdChanged', listener: CallIdChangedListener): void;
  on(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  on(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  on(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageEdited', listener: MessageEditedListener): void;
  on(event: 'messageDeleted', listener: MessageDeletedListener): void;
  on(event: 'messageSent', listener: MessageReceivedListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;
  on(event: 'chatParticipantsAdded', listener: ParticipantsAddedListener): void;
  on(event: 'chatParticipantsRemoved', listener: ParticipantsRemovedListener): void;
  on(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
  on(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
  on(event: 'chatError', listener: (e: AdapterError) => void): void;
  /* @conditional-compile-remove(close-captions) */
  on(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  /* @conditional-compile-remove(close-captions) */
  on(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  /* @conditional-compile-remove(close-captions) */
  on(event: 'isCaptionLanguageChanged', listener: IsCaptionLanguageChangedListener): void;
  /* @conditional-compile-remove(close-captions) */
  on(event: 'isSpokenLanguageChanged', listener: IsSpokenLanguageChangedListener): void;

  on(event: 'capabilitiesChanged', listener: CapabilitiesChangedListener): void;
  /* @conditional-compile-remove(spotlight) */
  on(event: 'spotlightChanged', listener: SpotlightChangedListener): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: CallWithChatEvent, listener: any): void {
    switch (event) {
      case 'callParticipantsJoined':
        this.callAdapter.on('participantsJoined', listener);
        break;
      case 'callParticipantsLeft':
        this.callAdapter.on('participantsLeft', listener);
        break;
      case 'callEnded':
        this.callAdapter.on('callEnded', listener);
        break;
      case 'isMutedChanged':
        this.callAdapter.on('isMutedChanged', listener);
        break;
      case 'callIdChanged':
        this.callAdapter.on('callIdChanged', listener);
        break;
      case 'isLocalScreenSharingActiveChanged':
        this.callAdapter.on('isLocalScreenSharingActiveChanged', listener);
        break;
      case 'displayNameChanged':
        this.callAdapter.on('displayNameChanged', listener);
        break;
      case 'isSpeakingChanged':
        this.callAdapter.on('isSpeakingChanged', listener);
        break;
      case 'selectedMicrophoneChanged':
        this.callAdapter.on('selectedMicrophoneChanged', listener);
        break;
      case 'selectedSpeakerChanged':
        this.callAdapter.on('selectedSpeakerChanged', listener);
        break;
      /* @conditional-compile-remove(close-captions) */
      case 'captionsReceived':
        this.callAdapter.on('captionsReceived', listener);
        break;
      /* @conditional-compile-remove(close-captions) */
      case 'isCaptionsActiveChanged':
        this.callAdapter.on('isCaptionsActiveChanged', listener);
        break;
      /* @conditional-compile-remove(close-captions) */
      case 'isCaptionLanguageChanged':
        this.callAdapter.on('isCaptionLanguageChanged', listener);
        break;
      /* @conditional-compile-remove(close-captions) */
      case 'isSpokenLanguageChanged':
        this.callAdapter.on('isSpokenLanguageChanged', listener);
        break;
      case 'messageReceived':
        this.chatAdapterPromise.then((adapter) => {
          adapter.on('messageReceived', listener);
        });
        break;
      case 'messageEdited':
        this.chatAdapterPromise.then((adapter) => {
          adapter.on('messageEdited', listener);
        });
        break;
      case 'messageDeleted':
        this.chatAdapterPromise.then((adapter) => {
          adapter.on('messageDeleted', listener);
        });
        break;
      case 'messageSent':
        this.chatAdapterPromise.then((adapter) => {
          adapter.on('messageSent', listener);
        });
        break;
      case 'messageRead':
        this.chatAdapterPromise.then((adapter) => {
          adapter.on('messageRead', listener);
        });
        break;
      case 'chatParticipantsAdded':
        this.chatAdapterPromise.then((adapter) => {
          adapter.on('participantsAdded', listener);
        });
        break;
      case 'chatParticipantsRemoved':
        this.chatAdapterPromise.then((adapter) => {
          adapter.on('participantsRemoved', listener);
        });
        break;
      case 'callError':
        this.callAdapter.on('error', listener);
        break;
      case 'chatError':
        this.chatAdapterPromise.then((adapter) => {
          adapter.on('error', listener);
        });
        break;

      default:
        throw `Unknown AzureCommunicationCallWithChatAdapter Event: ${event}`;
    }
  }

  off(event: 'callParticipantsJoined', listener: ParticipantsJoinedListener): void;
  off(event: 'callParticipantsLeft', listener: ParticipantsLeftListener): void;
  off(event: 'callEnded', listener: CallEndedListener): void;
  off(event: 'callError', listener: (e: AdapterError) => void): void;
  off(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  off(event: 'callIdChanged', listener: CallIdChangedListener): void;
  off(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  off(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  off(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  off(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
  off(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageEdited', listener: MessageEditedListener): void;
  off(event: 'messageDeleted', listener: MessageDeletedListener): void;
  off(event: 'messageSent', listener: MessageReceivedListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
  off(event: 'chatParticipantsAdded', listener: ParticipantsAddedListener): void;
  off(event: 'chatParticipantsRemoved', listener: ParticipantsRemovedListener): void;
  off(event: 'chatError', listener: (e: AdapterError) => void): void;
  /* @conditional-compile-remove(close-captions) */
  off(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  /* @conditional-compile-remove(close-captions) */
  off(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  /* @conditional-compile-remove(close-captions) */
  off(event: 'isCaptionLanguageChanged', listener: IsCaptionLanguageChangedListener): void;
  /* @conditional-compile-remove(close-captions) */
  off(event: 'isSpokenLanguageChanged', listener: IsSpokenLanguageChangedListener): void;

  off(event: 'capabilitiesChanged', listener: CapabilitiesChangedListener): void;
  /* @conditional-compile-remove(spotlight) */
  off(event: 'spotlightChanged', listener: SpotlightChangedListener): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: CallWithChatEvent, listener: any): void {
    switch (event as unknown) {
      case 'callParticipantsJoined':
        this.callAdapter.off('participantsJoined', listener);
        break;
      case 'callParticipantsLeft':
        this.callAdapter.off('participantsLeft', listener);
        break;
      case 'callEnded':
        this.callAdapter.off('callEnded', listener);
        break;
      case 'isMutedChanged':
        this.callAdapter.off('isMutedChanged', listener);
        break;
      case 'callIdChanged':
        this.callAdapter.off('callIdChanged', listener);
        break;
      case 'isLocalScreenSharingActiveChanged':
        this.callAdapter.off('isLocalScreenSharingActiveChanged', listener);
        break;
      case 'displayNameChanged':
        this.callAdapter.off('displayNameChanged', listener);
        break;
      case 'isSpeakingChanged':
        this.callAdapter.off('isSpeakingChanged', listener);
        break;
      case 'selectedMicrophoneChanged':
        this.callAdapter.off('selectedMicrophoneChanged', listener);
        break;
      case 'selectedSpeakerChanged':
        this.callAdapter.off('selectedSpeakerChanged', listener);
        break;
      /* @conditional-compile-remove(close-captions) */
      case 'captionsReceived':
        this.callAdapter.off('captionsReceived', listener);
        break;
      /* @conditional-compile-remove(close-captions) */
      case 'isCaptionsActiveChanged':
        this.callAdapter.off('isCaptionsActiveChanged', listener);
        break;
      /* @conditional-compile-remove(close-captions) */
      case 'isCaptionLanguageChanged':
        this.callAdapter.off('isCaptionLanguageChanged', listener);
        break;
      /* @conditional-compile-remove(close-captions) */
      case 'isSpokenLanguageChanged':
        this.callAdapter.off('isSpokenLanguageChanged', listener);
        break;
      case 'messageReceived':
        this.chatAdapterPromise.then((adapter) => {
          adapter.off('messageReceived', listener);
        });
        break;
      case 'messageEdited':
        this.chatAdapterPromise.then((adapter) => {
          adapter.off('messageEdited', listener);
        });
        break;
      case 'messageDeleted':
        this.chatAdapterPromise.then((adapter) => {
          adapter.off('messageDeleted', listener);
        });
        break;
      case 'messageSent':
        this.chatAdapterPromise.then((adapter) => {
          adapter.off('messageSent', listener);
        });
        break;
      case 'messageRead':
        this.chatAdapterPromise.then((adapter) => {
          adapter.off('messageRead', listener);
        });
        break;
      case 'chatParticipantsAdded':
        this.chatAdapterPromise.then((adapter) => {
          adapter.off('participantsAdded', listener);
        });
        break;
      case 'chatParticipantsRemoved':
        this.chatAdapterPromise.then((adapter) => {
          adapter.off('participantsRemoved', listener);
        });
        break;
      case 'callError':
        this.callAdapter.off('error', listener);
        break;
      case 'chatError':
        this.chatAdapterPromise.then((adapter) => {
          adapter.off('error', listener);
        });
        break;
      default:
        throw `Unknown AzureCommunicationCallWithChatAdapter Event: ${event}`;
    }
  }
}

/**
 * Provides a way to get the chat thread ID for a given locator.
 *
 * @public
 */
export interface ChatThreadProvider {
  getChatThread(): Promise<string>;
}

/**
 * Arguments for use in {@link createAzureCommunicationCallWithChatAdapter} to join a Group Call with an associated Chat thread.
 * @public
 */
export class CallAndChatProvider implements ChatThreadProvider {
  public locator: CallAndChatLocator;

  constructor(locator: CallAndChatLocator) {
    this.locator = locator;
  }

  public async getChatThread(): Promise<string> {
    return this.locator.chatThreadId;
  }
}

/**
 * Arguments for use in {@link createAzureCommunicationCallWithChatAdapter} to join a Teams meeting with an associated Chat thread.
 *
 * @public
 */
export class TeamsMeetingLinkProvider implements ChatThreadProvider {
  public locator: TeamsMeetingLinkLocator;
  private callAdapterPromise: Promise<CallAdapter>;
  private callAdapterSubscription?: (state: CallAdapterState) => void;

  constructor(locator: TeamsMeetingLinkLocator, callAdapterPromise: Promise<CallAdapter>) {
    this.locator = locator;
    this.callAdapterPromise = callAdapterPromise;
  }

  public async getChatThread(): Promise<string> {
    // Wait for the call to be connected and get the chat thread ID from `call.callInfo`.
    const chatThreadPromise = new Promise<string>((resolve) => {
      this.callAdapterPromise.then((callAdapter) => {
        // Ensure function is idempotent by removing any existing subscription.
        this.callAdapterSubscription && callAdapter.offStateChange(this.callAdapterSubscription);

        this.callAdapterSubscription = (state: CallAdapterState): void => {
          if (state.call?.state === 'Connected' && state.call.info?.threadId) {
            this.callAdapterSubscription && callAdapter.offStateChange(this.callAdapterSubscription);
            this.callAdapterSubscription = undefined;

            resolve(state.call.info?.threadId);
          }
        };
        callAdapter.onStateChange(this.callAdapterSubscription);
      });
    });

    return chatThreadPromise;
  }
}

/** @conditional-compile-remove(meeting-id) */
/**
 * Arguments for use in {@link createAzureCommunicationCallWithChatAdapter} to join a Teams meeting using meeting id.
 *
 * @public
 */
export class TeamsMeetingIdProvider implements ChatThreadProvider {
  public locator: TeamsMeetingIdLocator;
  private callAdapter: Promise<CallAdapter>;

  constructor(locator: TeamsMeetingIdLocator, callAdapter: Promise<CallAdapter>) {
    this.locator = locator;
    this.callAdapter = callAdapter;
  }

  /**
   * Wait call to be connected to get thread ID.
   * @returns the chat thread ID for the given meeting ID.
   */
  public async getChatThread(): Promise<string> {
    return new Promise<string>((resolve) => {
      const stateChangeListener = (state: CallAdapterState): void => {
        if (state.call?.state === 'Connected' && state.call.info?.threadId) {
          resolve(state.call.info?.threadId);
        }
      };
      this.callAdapter.then((adapter) => {
        adapter.onStateChange(stateChangeListener);
      });
    });
  }
}

/**
 * Combination of available adapters for use in {@link createAzureCommunicationCallWithChatAdapter}.
 * @public
 */
export type CommunicationAdapter =
  | CallAndChatProvider
  | TeamsMeetingLinkProvider
  | /** @conditional-compile-remove(meeting-id) */ TeamsMeetingIdProvider;

/**
 * Arguments for use in {@link createAzureCommunicationCallWithChatAdapter} to join a Call with an associated Chat thread.
 *
 * @public
 */
export interface CallAndChatLocator {
  /** Locator used by {@link createAzureCommunicationCallWithChatAdapter} to locate the call to join */
  callLocator: GroupCallLocator | /* @conditional-compile-remove(teams-adhoc-call) */ CallParticipantsLocator;
  /** Chat thread ID used by {@link createAzureCommunicationCallWithChatAdapter} to locate the chat thread to join */
  chatThreadId: string;
}

/**
 * Arguments for {@link createAzureCommunicationCallWithChatAdapter}
 *
 * @public
 */
export type AzureCommunicationCallWithChatAdapterArgs = {
  endpoint: string;
  userId: CommunicationUserIdentifier;
  displayName: string;
  credential: CommunicationTokenCredential;
  locator:
    | CallAndChatLocator
    | TeamsMeetingLinkLocator
    | /** @conditional-compile-remove(meeting-id) */ TeamsMeetingIdLocator;
  /* @conditional-compile-remove(PSTN-calls) */
  alternateCallerId?: string;

  callAdapterOptions?: AzureCommunicationCallAdapterOptions;
};

/**
 * Create a CallWithChatAdapter backed by Azure Communication services
 * to plug into the {@link CallWithChatComposite}.
 *
 * @public
 */
export const createAzureCommunicationCallWithChatAdapter = async ({
  userId,
  displayName,
  credential,
  endpoint,
  locator,
  /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId,
  callAdapterOptions
}: AzureCommunicationCallWithChatAdapterArgs): Promise<CallWithChatAdapter> => {
  const callAdapterLocator = isTeamsMeetingLocator(locator) ? locator : locator.callLocator;
  const callAdapter = _createAzureCommunicationCallAdapterInner({
    userId,
    displayName,
    credential,
    locator: callAdapterLocator,
    /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId,
    options: callAdapterOptions,
    telemetryImplementationHint: 'CallWithChat' as _TelemetryImplementationHint
  });

  const chatThreadAdapter = _createChatThreadAdapterInner(locator, callAdapter);
  const chatAdapter = _createLazyAzureCommunicationChatAdapterInner(
    endpoint,
    userId,
    displayName,
    credential,
    chatThreadAdapter.getChatThread(),
    'CallWithChat' as _TelemetryImplementationHint
  );

  return new AzureCommunicationCallWithChatAdapter(await callAdapter, chatAdapter);
};

/**
 * A custom React hook to simplify the creation of {@link CallWithChatAdapter}.
 *
 * Similar to {@link createAzureCommunicationCallWithChatAdapter}, but takes care of asynchronous
 * creation of the adapter internally.
 *
 * Allows arguments to be undefined so that you can respect the rule-of-hooks and pass in arguments
 * as they are created. The adapter is only created when all arguments are defined.
 *
 * Note that you must memoize the arguments to avoid recreating adapter on each render.
 * See storybook for typical usage examples.
 *
 * @public
 */
export const useAzureCommunicationCallWithChatAdapter = (
  /**
   * Arguments to be passed to {@link createAzureCommunicationCallWithChatAdapter}.
   *
   * Allows arguments to be undefined so that you can respect the rule-of-hooks and pass in arguments
   * as they are created. The adapter is only created when all arguments are defined.
   */
  args: Partial<AzureCommunicationCallWithChatAdapterArgs>,
  /**
   * Optional callback to modify the adapter once it is created.
   *
   * If set, must return the modified adapter.
   */
  afterCreate?: (adapter: CallWithChatAdapter) => Promise<CallWithChatAdapter>,
  /**
   * Optional callback called before the adapter is disposed.
   *
   * This is useful for clean up tasks, e.g., leaving any ongoing calls.
   */
  beforeDispose?: (adapter: CallWithChatAdapter) => Promise<void>
): CallWithChatAdapter | undefined => {
  const {
    credential,
    displayName,
    endpoint,
    locator,
    userId,
    /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId,
    callAdapterOptions
  } = args;

  // State update needed to rerender the parent component when a new adapter is created.
  const [adapter, setAdapter] = useState<CallWithChatAdapter | undefined>(undefined);
  // Ref needed for cleanup to access the old adapter created asynchronously.
  const adapterRef = useRef<CallWithChatAdapter | undefined>(undefined);
  const creatingAdapterRef = useRef<boolean>(false);

  const afterCreateRef = useRef<((adapter: CallWithChatAdapter) => Promise<CallWithChatAdapter>) | undefined>(
    undefined
  );
  const beforeDisposeRef = useRef<((adapter: CallWithChatAdapter) => Promise<void>) | undefined>(undefined);
  // These refs are updated on *each* render, so that the latest values
  // are used in the `useEffect` closures below.
  // Using a Ref ensures that new values for the callbacks do not trigger the
  // useEffect blocks, and a new adapter creation / distruction is not triggered.
  afterCreateRef.current = afterCreate;
  beforeDisposeRef.current = beforeDispose;

  useEffect(
    () => {
      if (!credential || !displayName || !endpoint || !locator || !userId) {
        return;
      }
      (async () => {
        if (adapterRef.current) {
          // Dispose the old adapter when a new one is created.
          //
          // This clean up function uses `adapterRef` because `adapter` can not be added to the dependency array of
          // this `useEffect` -- we do not want to trigger a new adapter creation because of the first adapter
          // creation.
          if (beforeDisposeRef.current) {
            await beforeDisposeRef.current(adapterRef.current);
          }
          adapterRef.current.dispose();
          adapterRef.current = undefined;
        }
        if (creatingAdapterRef.current) {
          console.warn(
            'Adapter is already being created, please see storybook for more information: https://azure.github.io/communication-ui-library/?path=/story/troubleshooting--page'
          );
          return;
        }
        creatingAdapterRef.current = true;
        let newAdapter = await createAzureCommunicationCallWithChatAdapter({
          credential,
          displayName,
          endpoint,
          locator,
          userId,
          /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId,
          callAdapterOptions
        });
        if (afterCreateRef.current) {
          newAdapter = await afterCreateRef.current(newAdapter);
        }
        adapterRef.current = newAdapter;
        setAdapter(newAdapter);
      })();
    },
    // Explicitly list all arguments so that caller doesn't have to memoize the `args` object.
    [
      adapterRef,
      afterCreateRef,
      /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId,
      beforeDisposeRef,
      credential,
      displayName,
      endpoint,
      locator,
      userId,
      callAdapterOptions
    ]
  );

  // Dispose any existing adapter when the component unmounts.
  useEffect(() => {
    return () => {
      (async () => {
        if (adapterRef.current) {
          if (beforeDisposeRef.current) {
            await beforeDisposeRef.current(adapterRef.current);
          }
          adapterRef.current.dispose();
          adapterRef.current = undefined;
        }
      })();
    };
  }, []);

  return adapter;
};

/**
 * Arguments for {@link createAzureCommunicationCallWithChatAdapterFromClient}
 *
 * @public
 */
export type AzureCommunicationCallWithChatAdapterFromClientArgs = {
  callLocator: CallAdapterLocator | TeamsMeetingLinkLocator;
  callAgent: CallAgent;
  callClient: StatefulCallClient;
  chatClient: StatefulChatClient;
  chatThreadClient: ChatThreadClient;

  callAdapterOptions?: AzureCommunicationCallAdapterOptions;
};

/**
 * Create a {@link CallWithChatAdapter} using the provided {@link StatefulChatClient} and {@link StatefulCallClient}.
 *
 * Useful if you want to keep a reference to {@link StatefulChatClient} and {@link StatefulCallClient}.
 * Please note that chatThreadClient has to be created by StatefulChatClient via chatClient.getChatThreadClient(chatThreadId) API.
 * Consider using {@link createAzureCommunicationCallWithChatAdapter} for a simpler API.
 *
 * @public
 */
export const createAzureCommunicationCallWithChatAdapterFromClients = async ({
  callClient,
  callAgent,
  callLocator,
  chatClient,
  chatThreadClient,
  callAdapterOptions
}: AzureCommunicationCallWithChatAdapterFromClientArgs): Promise<CallWithChatAdapter> => {
  const callAdapter = await createAzureCommunicationCallAdapterFromClient(
    callClient,
    callAgent,
    callLocator,

    callAdapterOptions
  );
  const chatAdapterPromise = createAzureCommunicationChatAdapterFromClient(chatClient, chatThreadClient);
  return new AzureCommunicationCallWithChatAdapter(callAdapter, chatAdapterPromise);
};

/**
 * Create a {@link CallWithChatAdapter} from the underlying adapters.
 *
 * This is an internal factory function used by browser tests to inject fake adapters for call and chat.
 *
 * @internal
 */
export const _createAzureCommunicationCallWithChatAdapterFromAdapters = (
  callAdapter: CallAdapter,
  chatAdapter: ChatAdapter
): CallWithChatAdapter =>
  new AzureCommunicationCallWithChatAdapter(callAdapter, new Promise((resolve) => resolve(chatAdapter)));

const isTeamsMeetingLocator = (
  locator:
    | CallAndChatLocator
    | TeamsMeetingLinkLocator
    | /** @conditional-compile-remove(meeting-id) */ TeamsMeetingIdLocator
): locator is TeamsMeetingLinkLocator | /** @conditional-compile-remove(meeting-id) */ TeamsMeetingIdLocator => {
  return 'meetingLink' in locator || 'meetingId' in locator;
};

const _createChatThreadAdapterInner = (
  locator:
    | CallAndChatLocator
    | TeamsMeetingLinkLocator
    | /** @conditional-compile-remove(meeting-id) */ TeamsMeetingIdLocator,
  adapter: Promise<CallAdapter>
): ChatThreadProvider => {
  if ('meetingLink' in locator) {
    return new TeamsMeetingLinkProvider(locator, adapter);
  }
  /** @conditional-compile-remove(meeting-id) */
  if ('meetingId' in locator) {
    return new TeamsMeetingIdProvider(locator, adapter);
  }
  return new CallAndChatProvider(locator);
};
