// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-unused-vars */ // REMOVE ONCE THIS FILE IS IMPLEMENTED
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */ // REMOVE ONCE THIS FILE IS IMPLEMENTED

import {
  AudioDeviceInfo,
  Call,
  CallAgent,
  GroupCallLocator,
  PermissionConstraints,
  TeamsMeetingLinkLocator,
  VideoDeviceInfo
} from '@azure/communication-calling';
import { VideoStreamOptions } from '@internal/react-components';
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
  createAzureCommunicationCallAdapter,
  CallEndedListener
} from '../../CallComposite';
import {
  MessageReceivedListener,
  MessageReadListener,
  ChatAdapter,
  ChatAdapterState,
  ParticipantsRemovedListener,
  ParticipantsAddedListener
} from '../../ChatComposite';
import { CallWithChatAdapter, CallWithChatEvent } from './CallWithChatAdapter';
import {
  callWithChatAdapterStateFromBackingStates,
  CallWithChatAdapterState,
  mergeCallAdapterStateIntoCallWithChatAdapterState,
  mergeChatAdapterStateIntoCallWithChatAdapterState
} from '../state/CallWithChatAdapterState';
import {
  createAzureCommunicationChatAdapter,
  createAzureCommunicationChatAdapterFromClient
} from '../../ChatComposite/adapter/AzureCommunicationChatAdapter';
import { EventEmitter } from 'events';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { getChatThreadFromTeamsLink } from './parseTeamsUrl';
import { AdapterError } from '../../common/adapters';

/* @conditional-compile-remove-from(stable) TEAMS_ADHOC_CALLING */
import { CallParticipantsLocator } from '../../CallComposite/adapter/AzureCommunicationCallAdapter';

import {
  CallAdapterLocator,
  createAzureCommunicationCallAdapterFromClient
} from '../../CallComposite/adapter/AzureCommunicationCallAdapter';
import { StatefulCallClient } from '@internal/calling-stateful-client';
import { StatefulChatClient } from '@internal/chat-stateful-client';
import { ChatThreadClient } from '@azure/communication-chat';

type CallWithChatAdapterStateChangedHandler = (newState: CallWithChatAdapterState) => void;

/** Context of Call with Chat, which is a centralized context for all state updates */
class CallWithChatContext {
  private emitter = new EventEmitter();
  private state: CallWithChatAdapterState;

  constructor(clientState: CallWithChatAdapterState) {
    this.state = clientState;
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
  private chatAdapter: ChatAdapter;
  private context: CallWithChatContext;
  private onChatStateChange: (newChatAdapterState: ChatAdapterState) => void;
  private onCallStateChange: (newChatAdapterState: CallAdapterState) => void;

  constructor(callAdapter: CallAdapter, chatAdapter: ChatAdapter) {
    this.bindPublicMethods();
    this.callAdapter = callAdapter;
    this.chatAdapter = chatAdapter;
    this.context = new CallWithChatContext(callWithChatAdapterStateFromBackingStates(callAdapter, chatAdapter));

    const onChatStateChange = (newChatAdapterState: ChatAdapterState): void => {
      this.context.updateClientStateWithChatState(newChatAdapterState);
    };
    this.chatAdapter.onStateChange(onChatStateChange);
    this.onChatStateChange = onChatStateChange;

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
    this.removeParticipant.bind(this);
    this.createStreamView.bind(this);
    this.disposeStreamView.bind(this);
    this.fetchInitialData.bind(this);
    this.sendMessage.bind(this);
    this.sendReadReceipt.bind(this);
    this.sendTypingIndicator.bind(this);
    this.loadPreviousChatMessages.bind(this);
    this.updateMessage.bind(this);
    this.deleteMessage.bind(this);
    this.on.bind(this);
    this.off.bind(this);
  }

  /** Join existing Call. */
  public joinCall(microphoneOn?: boolean): Call | undefined {
    return this.callAdapter.joinCall(microphoneOn);
  }
  /** Leave current Call. */
  public async leaveCall(): Promise<void> {
    // Only remove self from the GroupCall. Contoso must manage access to Chat.
    await this.callAdapter.leaveCall();
  }
  /** Start a new Call. */
  public startCall(participants: string[]): Call | undefined {
    return this.callAdapter.startCall(participants);
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
    this.chatAdapter.offStateChange(this.onChatStateChange);
    this.callAdapter.offStateChange(this.onCallStateChange);

    this.chatAdapter.dispose();
    this.callAdapter.dispose();
  }
  /** Remove a participant from the Call only. */
  public async removeParticipant(userId: string): Promise<void> {
    // Only remove the participant from the GroupCall. Contoso must manage access to Chat.
    await this.callAdapter.removeParticipant(userId);
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
  /** Create a stream view for a remote participants video feed. */
  public async createStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void> {
    await this.callAdapter.createStreamView(remoteUserId, options);
  }
  /** Dispose of a created stream view of a remote participants video feed. */
  public async disposeStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void> {
    await this.callAdapter.disposeStreamView(remoteUserId, options);
  }
  /** Fetch initial Call and Chat data such as chat messages. */
  public async fetchInitialData(): Promise<void> {
    await this.chatAdapter.fetchInitialData();
  }
  /** Send a chat message. */
  public async sendMessage(content: string): Promise<void> {
    await this.chatAdapter.sendMessage(content);
  }
  /** Send a chat read receipt. */
  public async sendReadReceipt(chatMessageId: string): Promise<void> {
    await this.chatAdapter.sendReadReceipt(chatMessageId);
  }
  /** Send an isTyping indicator. */
  public async sendTypingIndicator(): Promise<void> {
    await this.chatAdapter.sendTypingIndicator();
  }
  /** Load previous Chat messages. */
  public async loadPreviousChatMessages(messagesToLoad: number): Promise<boolean> {
    return await this.chatAdapter.loadPreviousChatMessages(messagesToLoad);
  }
  /** Update an existing message. */
  public async updateMessage(messageId: string, content: string): Promise<void> {
    return await this.chatAdapter.updateMessage(messageId, content);
  }
  /** Delete an existing message. */
  public async deleteMessage(messageId: string): Promise<void> {
    return await this.chatAdapter.deleteMessage(messageId);
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
  on(event: 'messageSent', listener: MessageReceivedListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;
  on(event: 'chatParticipantsAdded', listener: ParticipantsAddedListener): void;
  on(event: 'chatParticipantsRemoved', listener: ParticipantsRemovedListener): void;
  on(event: 'chatError', listener: (e: AdapterError) => void): void;

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
      case 'messageReceived':
        this.chatAdapter.on('messageReceived', listener);
        break;
      case 'messageSent':
        this.chatAdapter.on('messageSent', listener);
        break;
      case 'messageRead':
        this.chatAdapter.on('messageRead', listener);
        break;
      case 'chatParticipantsAdded':
        this.chatAdapter.on('participantsAdded', listener);
        break;
      case 'chatParticipantsRemoved':
        this.chatAdapter.on('participantsRemoved', listener);
        break;
      case 'callError':
        this.callAdapter.on('error', listener);
        break;
      case 'chatError':
        this.chatAdapter.on('error', listener);
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
  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageReceivedListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
  off(event: 'chatParticipantsAdded', listener: ParticipantsAddedListener): void;
  off(event: 'chatParticipantsRemoved', listener: ParticipantsRemovedListener): void;
  off(event: 'chatError', listener: (e: AdapterError) => void): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: CallWithChatEvent, listener: any): void {
    switch (event) {
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
      case 'messageReceived':
        this.chatAdapter.off('messageReceived', listener);
        break;
      case 'messageSent':
        this.chatAdapter.off('messageSent', listener);
        break;
      case 'messageRead':
        this.chatAdapter.off('messageRead', listener);
        break;
      case 'chatParticipantsAdded':
        this.chatAdapter.off('participantsAdded', listener);
        break;
      case 'chatParticipantsRemoved':
        this.chatAdapter.off('participantsRemoved', listener);
        break;
      case 'callError':
        this.callAdapter.off('error', listener);
        break;
      case 'chatError':
        this.chatAdapter.off('error', listener);
        break;
      default:
        throw `Unknown AzureCommunicationCallWithChatAdapter Event: ${event}`;
    }
  }
}

/**
 * Arguments for use in {@link createAzureCommunicationCallWithChatAdapter} to join a Call with an associated Chat thread.
 *
 * @beta
 */
export interface CallAndChatLocator {
  /** Locator used by {@link createAzureCommunicationCallWithChatAdapter} to locate the call to join */
  callLocator:
    | GroupCallLocator
    | /* @conditional-compile-remove-from(stable) TEAMS_ADHOC_CALLING */ CallParticipantsLocator;
  /** Chat thread ID used by {@link createAzureCommunicationCallWithChatAdapter} to locate the chat thread to join */
  chatThreadId: string;
}

/**
 * Arguments for {@link createAzureCommunicationCallWithChatAdapter}
 *
 * @beta
 */
export type AzureCommunicationCallWithChatAdapterArgs = {
  endpoint: string;
  userId: CommunicationUserIdentifier;
  displayName: string;
  credential: CommunicationTokenCredential;
  locator: CallAndChatLocator | TeamsMeetingLinkLocator;
};

/**
 * Create a CallWithChatAdapter backed by Azure Communication services
 * to plug into the {@link CallWithChatComposite}.
 *
 * @beta
 */
export const createAzureCommunicationCallWithChatAdapter = async ({
  userId,
  displayName,
  credential,
  endpoint,
  locator
}: AzureCommunicationCallWithChatAdapterArgs): Promise<CallWithChatAdapter> => {
  const callAdapterLocator = isTeamsMeetingLinkLocator(locator) ? locator : locator.callLocator;
  const createCallAdapterPromise = createAzureCommunicationCallAdapter({
    userId,
    displayName,
    credential,
    locator: callAdapterLocator
  });

  const threadId = isTeamsMeetingLinkLocator(locator)
    ? getChatThreadFromTeamsLink(locator.meetingLink)
    : locator.chatThreadId;
  const createChatAdapterPromise = createAzureCommunicationChatAdapter({
    endpoint,
    userId,
    displayName,
    credential,
    threadId
  });

  const [callAdapter, chatAdapter] = await Promise.all([createCallAdapterPromise, createChatAdapterPromise]);
  return new AzureCommunicationCallWithChatAdapter(callAdapter, chatAdapter);
};

/**
 * Arguments for {@link createAzureCommunicationCallWithChatAdapterFromClient}
 *
 * @beta
 */
export type AzureCommunicationCallWithChatAdapterFromClientArgs = {
  callLocator: CallAdapterLocator | TeamsMeetingLinkLocator;
  callAgent: CallAgent;
  callClient: StatefulCallClient;
  chatClient: StatefulChatClient;
  chatThreadClient: ChatThreadClient;
};

/**
 * Create a {@link CallWithChatAdapter} using the provided {@link StatefulChatClient} and {@link StatefulCallClient}.
 *
 * Useful if you want to keep a reference to {@link StatefulChatClient} and {@link StatefulCallClient}.
 * Consider using {@link createAzureCommunicationCallWithChatAdapter} for a simpler API.
 *
 * @beta
 */
export const createAzureCommunicationCallWithChatAdapterFromClients = async ({
  callClient,
  callAgent,
  callLocator,
  chatClient,
  chatThreadClient
}: AzureCommunicationCallWithChatAdapterFromClientArgs): Promise<CallWithChatAdapter> => {
  const createCallAdapterPromise = createAzureCommunicationCallAdapterFromClient(callClient, callAgent, callLocator);

  const createChatAdapterPromise = createAzureCommunicationChatAdapterFromClient(chatClient, chatThreadClient);
  const [callAdapter, chatAdapter] = await Promise.all([createCallAdapterPromise, createChatAdapterPromise]);
  return new AzureCommunicationCallWithChatAdapter(callAdapter, chatAdapter);
};

const isTeamsMeetingLinkLocator = (
  locator: CallAndChatLocator | TeamsMeetingLinkLocator
): locator is TeamsMeetingLinkLocator => {
  return 'meetingLink' in locator;
};
