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
import { TeamsMeetingIdLocator } from '@azure/communication-calling';
import { Reaction } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(breakout-rooms) */
import type { BreakoutRoomsEventData, BreakoutRoomsUpdatedListener, TeamsCall } from '@azure/communication-calling';
import { DtmfTone } from '@azure/communication-calling';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '@internal/react-components';
/* @conditional-compile-remove(file-sharing-acs) */
import { MessageOptions } from '@internal/acs-ui-common';
/* @conditional-compile-remove(breakout-rooms) */
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
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
import { CallWithChatAdapter, CallWithChatEvent, ChatInitializedListener } from './CallWithChatAdapter';
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
import { getChatThreadFromTeamsLink } from './parseTeamsUrl';
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
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { UploadChatImageResult } from '@internal/acs-ui-common';
import { useEffect, useRef, useState } from 'react';
import { _toCommunicationIdentifier, _TelemetryImplementationHint } from '@internal/acs-ui-common';
import {
  JoinCallOptions,
  StartCallIdentifier,
  StartCaptionsAdapterOptions,
  StopCaptionsAdapterOptions
} from '../../CallComposite/adapter/CallAdapter';

import { AzureCommunicationCallAdapterOptions } from '../../CallComposite/adapter/AzureCommunicationCallAdapter';
import {
  IsCaptionsActiveChangedListener,
  CaptionsReceivedListener,
  IsCaptionLanguageChangedListener,
  IsSpokenLanguageChangedListener
} from '../../CallComposite/adapter/CallAdapter';

import { CapabilitiesChangedListener } from '../../CallComposite/adapter/CallAdapter';
import { SpotlightChangedListener } from '../../CallComposite/adapter/CallAdapter';
import { VideoBackgroundImage, VideoBackgroundEffect } from '../../CallComposite';
import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';
/* @conditional-compile-remove(breakout-rooms) */
import { busyWait } from '../../common/utils';

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

  /* @conditional-compile-remove(breakout-rooms) */
  public unsetChatState(): void {
    this.updateClientState({ ...this.state, chat: undefined });
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
  private chatAdapter: ChatAdapter | undefined;
  private context: CallWithChatContext;
  private emitter: EventEmitter = new EventEmitter();
  private onChatStateChange: (newChatAdapterState: ChatAdapterState) => void;
  private onCallStateChange: (newChatAdapterState: CallAdapterState) => void;
  private isAdapterDisposed: boolean = false;
  /* @conditional-compile-remove(breakout-rooms) */
  private createChatAdapterCallback: ((threadId: string) => Promise<ChatAdapter>) | undefined;
  /* @conditional-compile-remove(breakout-rooms) */
  private originCallChatAdapter: ChatAdapter | undefined;
  /* @conditional-compile-remove(breakout-rooms) */
  private breakoutRoomChatAdapter: ChatAdapter | undefined;

  constructor(callAdapter: CallAdapter, chatAdapter?: ChatAdapter) {
    this.bindPublicMethods();
    this.callAdapter = callAdapter;
    this.context = new CallWithChatContext(callWithChatAdapterStateFromBackingStates(callAdapter));

    const onChatStateChange = (newChatAdapterState: ChatAdapterState): void => {
      this.context.updateClientStateWithChatState(newChatAdapterState);
    };

    this.onChatStateChange = onChatStateChange;
    if (chatAdapter) {
      this.updateChatAdapter(chatAdapter);
      /* @conditional-compile-remove(breakout-rooms) */
      this.originCallChatAdapter = chatAdapter;
    }

    const onCallStateChange = (newCallAdapterState: CallAdapterState): void => {
      this.context.updateClientStateWithCallState(newCallAdapterState);
    };

    this.callAdapter.onStateChange(onCallStateChange);
    /* @conditional-compile-remove(breakout-rooms) */
    this.callAdapter.on('breakoutRoomsUpdated', async (eventData: BreakoutRoomsEventData) => {
      if (eventData.type === 'join') {
        await this.breakoutRoomJoined(eventData.data);
      } else if (eventData.type === 'assignedBreakoutRooms') {
        if (!eventData.data || eventData.data.state === 'closed') {
          await this.returnFromBreakoutRoom();
        }
      }
    });
    /* @conditional-compile-remove(breakout-rooms) */
    this.callAdapter.on('callEnded', () => {
      const originCallId = this.context.getState().call?.breakoutRooms?.breakoutRoomOriginCallId;

      // If the call ended is a breakout room call, return to the origin call chat adapter
      if (originCallId && this.originCallChatAdapter) {
        this.breakoutRoomChatAdapter?.dispose();
        this.updateChatAdapter(this.originCallChatAdapter);
      }
    });
    this.onCallStateChange = onCallStateChange;
  }

  /* @conditional-compile-remove(breakout-rooms) */
  private async breakoutRoomJoined(call: Call | TeamsCall): Promise<void> {
    const targetThreadId = call.info.threadId;

    // If the chat adapter is not on the target thread then we need to switch to the breakout room chat adapter
    if (targetThreadId && this.chatAdapter && this.chatAdapter.getState().thread.threadId !== targetThreadId) {
      // Unsubscribe from chat adapter state changes
      this.chatAdapter.offStateChange(this.onChatStateChange);
      // Set chat state to undefined to prevent showing chat thread of origin call
      this.context.unsetChatState();

      // Check if the breakout room chat adapter has been initialized
      this.breakoutRoomChatAdapter = await this.setBreakoutRoomChatAdapterToThread(targetThreadId);

      // Wait for the user to be added to the thread of chat adapter before updating the current chat adapter
      // to avoid chat errors of not having access to the chat thread. This delayed access to the chat thread
      // is also seen in Teams
      // Check up to 20 times every 500ms and then continue.
      await busyWait(() => {
        // If the call adapter's call id has been changed, then stop waiting and don't update the chat adapter
        if (this.context.getState().call?.id !== call.id) {
          return true;
        }

        const userAddedToThread =
          !!this.breakoutRoomChatAdapter?.getState().thread.participants[
            toFlatCommunicationIdentifier(this.context.getState().userId)
          ];
        return userAddedToThread;
      }, 20);

      // If the call adapter's call has been changed while for waiting for breakout room chat adapter to be ready
      // then don't update the chat adapter
      if (this.context.getState().call?.id !== call.id) {
        return;
      }

      this.updateChatAdapter(this.breakoutRoomChatAdapter);
    }
  }

  /* @conditional-compile-remove(breakout-rooms) */
  private async setBreakoutRoomChatAdapterToThread(targetThreadId: string): Promise<ChatAdapter> {
    if (this.breakoutRoomChatAdapter) {
      // If the breakout room chat adapter is not set on the target thread then unsubscribe, dispose, and
      // reinitialize the chat adapter for the target thread
      if (this.breakoutRoomChatAdapter.getState().thread.threadId !== targetThreadId) {
        this.breakoutRoomChatAdapter.offStateChange(this.onChatStateChange);
        this.breakoutRoomChatAdapter.dispose();
        const newBreakoutRoomChatAdapter = await this.createNewChatAdapterForThread(targetThreadId);
        return newBreakoutRoomChatAdapter;
      } else {
        return this.breakoutRoomChatAdapter;
      }
    } else {
      // Initiliaze the breakout room chat adapter for the target thread
      const newBreakoutRoomChatAdapter = await this.createNewChatAdapterForThread(targetThreadId);
      return newBreakoutRoomChatAdapter;
    }
  }

  public setChatAdapterPromise(chatAdapter: Promise<ChatAdapter>): void {
    chatAdapter.then((adapter) => {
      if (!this.isAdapterDisposed) {
        this.updateChatAdapter(adapter);
        /* @conditional-compile-remove(breakout-rooms) */
        this.originCallChatAdapter = adapter;
      }
    });
  }

  /* @conditional-compile-remove(breakout-rooms) */
  public setCreateChatAdapterCallback(chatThreadCallBack: (threadId: string) => Promise<ChatAdapter>): void {
    this.createChatAdapterCallback = chatThreadCallBack;
  }

  /* @conditional-compile-remove(breakout-rooms) */
  public createNewChatAdapterForThread(threadId: string): Promise<ChatAdapter> {
    if (this.createChatAdapterCallback) {
      return this.createChatAdapterCallback(threadId);
    }
    throw new Error('Unable to create chat adapter for thread because createChatAdapterCallback is not set');
  }

  private updateChatAdapter(chatAdapter: ChatAdapter): void {
    this.chatAdapter?.offStateChange(this.onChatStateChange);
    this.chatAdapter = chatAdapter;
    this.chatAdapter.onStateChange(this.onChatStateChange);
    this.context.updateClientStateWithChatState(chatAdapter.getState());
    this.emitter.emit('chatInitialized', this.chatAdapter);
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
    this.onReactionClick.bind(this);
    this.removeParticipant.bind(this);
    this.createStreamView.bind(this);
    this.disposeStreamView.bind(this);
    this.disposeScreenShareStreamView.bind(this);
    this.fetchInitialData.bind(this);
    this.sendMessage.bind(this);
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    this.uploadImage.bind(this);
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    this.deleteImage.bind(this);
    this.sendReadReceipt.bind(this);
    this.sendTypingIndicator.bind(this);
    this.loadPreviousChatMessages.bind(this);
    this.updateMessage.bind(this);
    this.deleteMessage.bind(this);
    this.on.bind(this);
    this.off.bind(this);
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
    this.startCaptions.bind(this);
    this.stopCaptions.bind(this);
    this.setSpokenLanguage.bind(this);
    this.setCaptionLanguage.bind(this);
    this.startVideoBackgroundEffect.bind(this);

    this.stopVideoBackgroundEffects.bind(this);

    this.updateBackgroundPickerImages.bind(this);
    /* @conditional-compile-remove(DNS) */
    this.startNoiseSuppressionEffect.bind(this);
    /* @conditional-compile-remove(DNS) */
    this.stopNoiseSuppressionEffect.bind(this);
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
  public dispose(): void {
    this.isAdapterDisposed = true;
    if (this.chatAdapter) {
      this.chatAdapter.offStateChange(this.onChatStateChange);
      this.chatAdapter.dispose();
    }
    this.callAdapter.offStateChange(this.onCallStateChange);
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
  /** Reaction clicked by the local user. */
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
    return await this.executeWithResolvedChatAdapter((adapter) => {
      return adapter.fetchInitialData();
    });
  }
  /** Send a chat message. */
  public async sendMessage(
    content: string,
    /* @conditional-compile-remove(file-sharing-acs) */
    options?: MessageOptions
  ): Promise<void> {
    return await this.executeWithResolvedChatAdapter((adapter) => {
      return adapter.sendMessage(content, /* @conditional-compile-remove(file-sharing-acs) */ options);
    });
  }
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /** Upload a chat image. */
  public async uploadImage(image: Blob, imageFileName: string): Promise<UploadChatImageResult> {
    return await this.executeWithResolvedChatAdapter((adapter) => {
      return adapter.uploadImage(image, imageFileName);
    });
  }
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /** Delete a chat image. */
  public async deleteImage(imageId: string): Promise<void> {
    return await this.executeWithResolvedChatAdapter((adapter) => {
      return adapter.deleteImage(imageId);
    });
  }
  /** Send a chat read receipt. */
  public async sendReadReceipt(chatMessageId: string): Promise<void> {
    return await this.executeWithResolvedChatAdapter((adapter) => {
      return adapter.sendReadReceipt(chatMessageId);
    });
  }
  /** Send an isTyping indicator. */
  public async sendTypingIndicator(): Promise<void> {
    return await this.executeWithResolvedChatAdapter((adapter) => {
      return adapter.sendTypingIndicator();
    });
  }
  /** Load previous Chat messages. */
  public async loadPreviousChatMessages(messagesToLoad: number): Promise<boolean> {
    return await this.executeWithResolvedChatAdapter((adapter) => {
      return adapter.loadPreviousChatMessages(messagesToLoad);
    });
  }
  /** Update an existing message. */
  public async updateMessage(
    messageId: string,
    content: string,
    options?: Record<string, string> | /* @conditional-compile-remove(file-sharing-acs) */ MessageOptions
  ): Promise<void> {
    return this.executeWithResolvedChatAdapter((adapter) => {
      return adapter.updateMessage(messageId, content, options);
    });
  }
  /** Delete an existing message. */
  public async deleteMessage(messageId: string): Promise<void> {
    return await this.executeWithResolvedChatAdapter((adapter) => {
      return adapter.deleteMessage(messageId);
    });
  }
  public async downloadResourceToCache(resourceDetails: ResourceDetails): Promise<void> {
    this.executeWithResolvedChatAdapter((adapter) => {
      adapter.downloadResourceToCache(resourceDetails);
    });
  }
  public removeResourceFromCache(resourceDetails: ResourceDetails): void {
    this.executeWithResolvedChatAdapter((adapter) => {
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

  public async startCaptions(options?: StartCaptionsAdapterOptions): Promise<void> {
    await this.callAdapter.startCaptions(options);
  }

  public async stopCaptions(options?: StopCaptionsAdapterOptions): Promise<void> {
    await this.callAdapter.stopCaptions(options);
  }

  public async setCaptionLanguage(language: string): Promise<void> {
    await this.callAdapter.setCaptionLanguage(language);
  }

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

  /* @conditional-compile-remove(DNS) */
  public async startNoiseSuppressionEffect(): Promise<void> {
    return await this.callAdapter.startNoiseSuppressionEffect();
  }

  /* @conditional-compile-remove(DNS) */
  public async stopNoiseSuppressionEffect(): Promise<void> {
    return await this.callAdapter.stopNoiseSuppressionEffect();
  }

  public async submitSurvey(survey: CallSurvey): Promise<CallSurveyResponse | undefined> {
    return this.callAdapter.submitSurvey(survey);
  }

  public async startSpotlight(userIds?: string[]): Promise<void> {
    return this.callAdapter.startSpotlight(userIds);
  }

  public async stopSpotlight(userIds?: string[]): Promise<void> {
    return this.callAdapter.stopSpotlight(userIds);
  }

  public async stopAllSpotlight(): Promise<void> {
    return this.callAdapter.stopAllSpotlight();
  }

  /* @conditional-compile-remove(soft-mute) */
  public async muteParticipant(userId: string): Promise<void> {
    return this.callAdapter.muteParticipant(userId);
  }

  /* @conditional-compile-remove(soft-mute) */
  public async muteAllRemoteParticipants(): Promise<void> {
    return this.callAdapter.muteAllRemoteParticipants();
  }

  /* @conditional-compile-remove(breakout-rooms) */
  public async returnFromBreakoutRoom(): Promise<void> {
    if (
      this.originCallChatAdapter &&
      this.context.getState().chat?.threadId !== this.originCallChatAdapter.getState().thread.threadId
    ) {
      this.breakoutRoomChatAdapter?.dispose();
      this.updateChatAdapter(this.originCallChatAdapter);
    }

    const originCallId = this.callAdapter.getState().call?.breakoutRooms?.breakoutRoomOriginCallId;
    if (originCallId) {
      await this.callAdapter.returnFromBreakoutRoom();
    }
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
  on(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  on(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  on(event: 'isCaptionLanguageChanged', listener: IsCaptionLanguageChangedListener): void;
  on(event: 'isSpokenLanguageChanged', listener: IsSpokenLanguageChangedListener): void;

  on(event: 'capabilitiesChanged', listener: CapabilitiesChangedListener): void;
  on(event: 'spotlightChanged', listener: SpotlightChangedListener): void;
  /* @conditional-compile-remove(breakout-rooms) */
  on(event: 'breakoutRoomsUpdated', listener: BreakoutRoomsUpdatedListener): void;
  on(event: 'chatInitialized', listener: ChatInitializedListener): void;

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
      case 'captionsReceived':
        this.callAdapter.on('captionsReceived', listener);
        break;
      case 'isCaptionsActiveChanged':
        this.callAdapter.on('isCaptionsActiveChanged', listener);
        break;
      case 'isCaptionLanguageChanged':
        this.callAdapter.on('isCaptionLanguageChanged', listener);
        break;
      case 'isSpokenLanguageChanged':
        this.callAdapter.on('isSpokenLanguageChanged', listener);
        break;
      case 'messageReceived':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.on('messageReceived', listener);
        });
        break;
      case 'messageEdited':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.on('messageEdited', listener);
        });
        break;
      case 'messageDeleted':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.on('messageDeleted', listener);
        });
        break;
      case 'messageSent':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.on('messageSent', listener);
        });
        break;
      case 'messageRead':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.on('messageRead', listener);
        });
        break;
      case 'chatParticipantsAdded':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.on('participantsAdded', listener);
        });
        break;
      case 'chatParticipantsRemoved':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.on('participantsRemoved', listener);
        });
        break;
      case 'callError':
        this.callAdapter.on('error', listener);
        break;
      case 'chatError':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.on('error', listener);
        });
        break;
      case 'chatInitialized':
        this.emitter.on(event, listener);
        break;
      case 'capabilitiesChanged':
        this.callAdapter.on('capabilitiesChanged', listener);
        break;
      case 'spotlightChanged':
        this.callAdapter.on('spotlightChanged', listener);
        break;
      /* @conditional-compile-remove(breakout-rooms) */
      case 'breakoutRoomsUpdated':
        this.callAdapter.on('breakoutRoomsUpdated', listener);
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
  off(event: 'captionsReceived', listener: CaptionsReceivedListener): void;
  off(event: 'isCaptionsActiveChanged', listener: IsCaptionsActiveChangedListener): void;
  off(event: 'isCaptionLanguageChanged', listener: IsCaptionLanguageChangedListener): void;
  off(event: 'isSpokenLanguageChanged', listener: IsSpokenLanguageChangedListener): void;
  off(event: 'capabilitiesChanged', listener: CapabilitiesChangedListener): void;
  off(event: 'spotlightChanged', listener: SpotlightChangedListener): void;
  off(event: 'chatInitialized', listener: ChatInitializedListener): void;
  /* @conditional-compile-remove(breakout-rooms) */
  off(event: 'breakoutRoomsUpdated', listener: BreakoutRoomsUpdatedListener): void;

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
      case 'captionsReceived':
        this.callAdapter.off('captionsReceived', listener);
        break;
      case 'isCaptionsActiveChanged':
        this.callAdapter.off('isCaptionsActiveChanged', listener);
        break;
      case 'isCaptionLanguageChanged':
        this.callAdapter.off('isCaptionLanguageChanged', listener);
        break;
      case 'isSpokenLanguageChanged':
        this.callAdapter.off('isSpokenLanguageChanged', listener);
        break;
      case 'messageReceived':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.off('messageReceived', listener);
        });
        break;
      case 'messageEdited':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.off('messageEdited', listener);
        });
        break;
      case 'messageDeleted':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.off('messageDeleted', listener);
        });
        break;
      case 'messageSent':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.off('messageSent', listener);
        });
        break;
      case 'messageRead':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.off('messageRead', listener);
        });
        break;
      case 'chatParticipantsAdded':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.off('participantsAdded', listener);
        });
        break;
      case 'chatParticipantsRemoved':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.off('participantsRemoved', listener);
        });
        break;
      case 'callError':
        this.callAdapter.off('error', listener);
        break;
      case 'chatError':
        this.executeWithResolvedChatAdapter((adapter) => {
          adapter.off('error', listener);
        });
        break;
      case 'chatInitialized':
        this.emitter.off(event, listener);
        break;
      case 'capabilitiesChanged':
        this.callAdapter.off('capabilitiesChanged', listener);
        break;
      case 'spotlightChanged':
        this.callAdapter.off('spotlightChanged', listener);
        break;
      /* @conditional-compile-remove(breakout-rooms) */
      case 'breakoutRoomsUpdated':
        this.callAdapter.off('breakoutRoomsUpdated', listener);
        break;
      default:
        throw `Unknown AzureCommunicationCallWithChatAdapter Event: ${event}`;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private executeWithResolvedChatAdapter(callback: (adapter: ChatAdapter) => any): any {
    if (!this.chatAdapter) {
      console.error('Chat is not initialized');
    } else {
      return callback(this.chatAdapter);
    }
  }
}

/**
 * Provides a way to get the chat thread ID for a given locator.
 *
 * @private
 */
export interface ChatThreadProvider {
  isCallInfoRequired(): boolean;
  getChatThreadPromise(): Promise<string>;
  getChatThread(): string;
}

/**
 * Arguments for use in {@link createAzureCommunicationCallWithChatAdapter} to join a Group Call with an associated Chat thread.
 * @private
 */
export class CallAndChatProvider implements ChatThreadProvider {
  public locator: CallAndChatLocator;

  constructor(locator: CallAndChatLocator) {
    this.locator = locator;
  }
  public isCallInfoRequired(): boolean {
    return false;
  }
  public async getChatThreadPromise(): Promise<string> {
    return this.getChatThread();
  }

  public getChatThread(): string {
    return this.locator.chatThreadId;
  }
}

/**
 * Arguments for use in {@link createAzureCommunicationCallWithChatAdapter} to join a Teams meeting with an associated Chat thread.
 *
 * @private
 */
export class TeamsMeetingLinkProvider implements ChatThreadProvider {
  public locator: TeamsMeetingLinkLocator;
  private callAdapterPromise: Promise<CallAdapter>;
  private callAdapterSubscription?: (state: CallAdapterState) => void;

  constructor(locator: TeamsMeetingLinkLocator, callAdapterPromise: Promise<CallAdapter>) {
    this.locator = locator;
    this.callAdapterPromise = callAdapterPromise;
  }

  public isCallInfoRequired(): boolean {
    return true;
  }

  public getChatThread(): string {
    throw new Error('Chat thread ID should be retrieved from call.callInfo using method getChatThreadPromise');
    return getChatThreadFromTeamsLink(this.locator.meetingLink);
  }

  public async getChatThreadPromise(): Promise<string> {
    {
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

    return getChatThreadFromTeamsLink(this.locator.meetingLink);
  }
}

/**
 * Arguments for use in {@link createAzureCommunicationCallWithChatAdapter} to join a Teams meeting using meeting id.
 *
 * @private
 */
export class TeamsMeetingIdProvider implements ChatThreadProvider {
  public locator: TeamsMeetingIdLocator;
  private callAdapter: Promise<CallAdapter>;

  constructor(locator: TeamsMeetingIdLocator, callAdapter: Promise<CallAdapter>) {
    this.locator = locator;
    this.callAdapter = callAdapter;
  }
  public isCallInfoRequired(): boolean {
    return true;
  }
  public getChatThread(): string {
    throw new Error('Chat thread ID is not available for Teams meeting ID');
  }

  /**
   * Wait call to be connected to get thread ID.
   * @returns the chat thread ID for the given meeting ID.
   */
  public async getChatThreadPromise(): Promise<string> {
    return new Promise<string>((resolve) => {
      const stateChangeListener = (state: CallAdapterState): void => {
        if (state.call?.state === 'Connected' && state.call.info?.threadId) {
          this.callAdapter.then((adapter) => {
            adapter.offStateChange(stateChangeListener);
          });
          resolve(state.call.info?.threadId);
        }
      };

      this.callAdapter.then((adapter) => {
        const callState = adapter.getState().call?.state;
        const threadId = adapter.getState().call?.info?.threadId;
        if (callState === 'Connected' && threadId) {
          resolve(threadId);
        } else {
          adapter.onStateChange(stateChangeListener);
        }
      });
    });
  }
}

/**
 * Combination of available adapters for use in {@link createAzureCommunicationCallWithChatAdapter}.
 * @public
 */
export type CommunicationAdapter = CallAndChatProvider | TeamsMeetingLinkProvider | TeamsMeetingIdProvider;

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
  locator: CallAndChatLocator | TeamsMeetingLinkLocator | TeamsMeetingIdLocator;
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
  if (chatThreadAdapter.isCallInfoRequired()) {
    const callWithChatAdapter = new AzureCommunicationCallWithChatAdapter(await callAdapter);
    const chatAdapterPromise = _createLazyAzureCommunicationChatAdapterInner(
      endpoint,
      userId,
      displayName,
      credential,
      chatThreadAdapter.getChatThreadPromise(),
      'CallWithChat' as _TelemetryImplementationHint
    );
    callWithChatAdapter.setChatAdapterPromise(chatAdapterPromise);
    /* @conditional-compile-remove(breakout-rooms) */
    callWithChatAdapter.setCreateChatAdapterCallback((threadId: string) =>
      _createAzureCommunicationChatAdapterInner(
        endpoint,
        userId,
        displayName,
        credential,
        threadId,
        'CallWithChat' as _TelemetryImplementationHint
      )
    );
    return callWithChatAdapter;
  } else {
    const chatAdapter = _createAzureCommunicationChatAdapterInner(
      endpoint,
      userId,
      displayName,
      credential,
      chatThreadAdapter.getChatThread(),
      'CallWithChat' as _TelemetryImplementationHint
    );

    const callWithChatAdapter = new AzureCommunicationCallWithChatAdapter(await callAdapter, await chatAdapter);
    /* @conditional-compile-remove(breakout-rooms) */
    callWithChatAdapter.setCreateChatAdapterCallback((threadId: string) =>
      _createAzureCommunicationChatAdapterInner(
        endpoint,
        userId,
        displayName,
        credential,
        threadId,
        'CallWithChat' as _TelemetryImplementationHint
      )
    );
    return callWithChatAdapter;
  }
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
        creatingAdapterRef.current = false;
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
  const chatAdapter = await createAzureCommunicationChatAdapterFromClient(chatClient, chatThreadClient);
  return new AzureCommunicationCallWithChatAdapter(callAdapter, chatAdapter);
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
): CallWithChatAdapter => new AzureCommunicationCallWithChatAdapter(callAdapter, chatAdapter);

const isTeamsMeetingLocator = (
  locator: CallAndChatLocator | TeamsMeetingLinkLocator | TeamsMeetingIdLocator
): locator is TeamsMeetingLinkLocator | TeamsMeetingIdLocator => {
  return 'meetingLink' in locator || 'meetingId' in locator;
};

const _createChatThreadAdapterInner = (
  locator: CallAndChatLocator | TeamsMeetingLinkLocator | TeamsMeetingIdLocator,
  adapter: Promise<CallAdapter>
): ChatThreadProvider => {
  if ('meetingLink' in locator) {
    return new TeamsMeetingLinkProvider(locator, adapter);
  }
  if ('meetingId' in locator) {
    return new TeamsMeetingIdProvider(locator, adapter);
  }
  return new CallAndChatProvider(locator);
};
