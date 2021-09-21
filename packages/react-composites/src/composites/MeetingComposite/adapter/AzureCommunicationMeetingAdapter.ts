// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-unused-vars */ // REMOVE ONCE THIS FILE IS IMPLEMENTED
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */ // REMOVE ONCE THIS FILE IS IMPLEMENTED

import {
  AudioDeviceInfo,
  VideoDeviceInfo,
  PermissionConstraints,
  GroupCallLocator,
  TeamsMeetingLinkLocator,
  Call
} from '@azure/communication-calling';
import { VideoStreamOptions } from '@internal/react-components';
import {
  ParticipantJoinedListener,
  ParticipantLeftListener,
  IsMuteChangedListener,
  CallIdChangedListener,
  IsScreenSharingOnChangedListener,
  DisplayNameChangedListener,
  IsSpeakingChangedListener,
  CallAdapter,
  CallAdapterState,
  createAzureCommunicationCallAdapter,
  CallEndedListener
} from '../../CallComposite';
import { MessageReceivedListener, MessageReadListener, ChatAdapter, ChatAdapterState } from '../../ChatComposite';
import { MeetingAdapter, MeetingEvent } from './MeetingAdapter';
import {
  meetingAdapterStateFromBackingStates,
  MeetingAdapterState,
  mergeCallAdapterStateIntoMeetingAdapterState,
  mergeChatAdapterStateIntoMeetingAdapterState
} from '../state/MeetingAdapterState';
import { createAzureCommunicationChatAdapter } from '../../ChatComposite/adapter/AzureCommunicationChatAdapter';
import { MeetingCompositePage, meetingPageToCallPage } from '../state/MeetingCompositePage';
import { EventEmitter } from 'events';
import { CommunicationTokenCredential, CommunicationUserKind } from '@azure/communication-common';
import { AzureCommunicationCallAdapter } from '../../CallComposite/adapter/AzureCommunicationCallAdapter';

type MeetingAdapterStateChangedHandler = (newState: MeetingAdapterState) => void;

/** Context of meeting, which is a centralized context for all state updates */
class MeetingContext {
  private emitter = new EventEmitter();
  private state: MeetingAdapterState;

  constructor(clientState: MeetingAdapterState) {
    this.state = clientState;
  }

  public onStateChange(handler: MeetingAdapterStateChangedHandler): void {
    this.emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: MeetingAdapterStateChangedHandler): void {
    this.emitter.off('stateChanged', handler);
  }

  public setState(state: MeetingAdapterState): void {
    this.state = state;
    this.emitter.emit('stateChanged', this.state);
  }

  public getState(): MeetingAdapterState {
    return this.state;
  }

  public updateClientState(clientState: MeetingAdapterState): void {
    this.setState(clientState);
  }

  public updateClientStateWithChatState(chatAdapterState: ChatAdapterState): void {
    this.updateClientState(mergeChatAdapterStateIntoMeetingAdapterState(this.state, chatAdapterState));
  }

  public updateClientStateWithCallState(callAdapterState: CallAdapterState): void {
    this.updateClientState(mergeCallAdapterStateIntoMeetingAdapterState(this.state, callAdapterState));
  }
}

/**
 * Meeting adapter backed by Azure Communication Services.
 * Created for easy use with the Meeting Composite.
 */
export class AzureCommunicationMeetingAdapter implements MeetingAdapter {
  private callAdapter: CallAdapter;
  private chatAdapter: ChatAdapter;
  private context: MeetingContext;
  private onChatStateChange: (newChatAdapterState: ChatAdapterState) => void;
  private onCallStateChange: (newChatAdapterState: CallAdapterState) => void;

  constructor(callAdapter: CallAdapter, chatAdapter: ChatAdapter) {
    this.bindPublicMethods();
    this.callAdapter = callAdapter;
    this.chatAdapter = chatAdapter;
    this.context = new MeetingContext(meetingAdapterStateFromBackingStates(callAdapter, chatAdapter));

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
    this.joinMeeting.bind(this);
    this.leaveMeeting.bind(this);
    this.startMeeting.bind(this);
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
    this.onToggleCamera.bind(this);
    this.mute.bind(this);
    this.unmute.bind(this);
    this.startScreenShare.bind(this);
    this.stopScreenShare.bind(this);
    this.removeParticipant.bind(this);
    this.setPage.bind(this);
    this.createStreamView.bind(this);
    this.disposeStreamView.bind(this);
    this.fetchInitialData.bind(this);
    this.sendMessage.bind(this);
    this.sendReadReceipt.bind(this);
    this.sendTypingIndicator.bind(this);
    this.loadPreviousChatMessages.bind(this);
    this.on.bind(this);
    this.off.bind(this);
  }

  /**
   * This reflects the isTeamsCall in AzureCommunicationCallAdapter
   * @TODO: THIS NEEDS MOVED TO BE PART OF THE API NOT HIDDEN HERE.
   */
  public isTeamsCall(): boolean {
    return 'isTeamsCall' in this.callAdapter
      ? (this.callAdapter as AzureCommunicationCallAdapter).isTeamsCall()
      : false;
  }

  /** Join existing Meeting. */
  public joinMeeting(microphoneOn?: boolean): Call | undefined {
    return this.callAdapter.joinCall(microphoneOn);
  }
  /** Leave current Meeting. */
  public async leaveMeeting(): Promise<void> {
    await this.chatAdapter.removeParticipant(this.chatAdapter.getState().userId);
    await this.callAdapter.leaveCall();
  }
  /** Start a new Meeting. */
  public startMeeting(participants: string[]): Call | undefined {
    return this.callAdapter.startCall(participants);
  }
  /**
   * Subscribe to state change events.
   * @param handler - handler to be called when the state changes. This is passed the new state.
   */
  public onStateChange(handler: (state: MeetingAdapterState) => void): void {
    this.context.onStateChange(handler);
  }
  /**
   * Unsubscribe to state change events.
   * @param handler - handler to be no longer called when state changes.
   */
  public offStateChange(handler: (state: MeetingAdapterState) => void): void {
    this.context.offStateChange(handler);
  }
  /** Get current Meeting state. */
  public getState(): MeetingAdapterState {
    return this.context.getState();
  }
  /** Dispose of the current Meeting Adapter. */
  public dispose(): void {
    this.chatAdapter.offStateChange(this.onChatStateChange);
    this.callAdapter.offStateChange(this.onCallStateChange);

    this.chatAdapter.dispose();
    this.callAdapter.dispose();
  }
  /** Set the page of the Meeting Composite. */
  public setPage(page: MeetingCompositePage): void {
    this.callAdapter.setPage(meetingPageToCallPage(page));
  }
  /** Remove a participant from the Meeting. */
  public async removeParticipant(userId: string): Promise<void> {
    await this.chatAdapter.removeParticipant(userId);
    await this.callAdapter.removeParticipant(userId);
  }
  public async setCamera(device: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void> {
    await this.callAdapter.setCamera(device, options);
  }
  /** Set the microphone to be used in the meeting. */
  public async setMicrophone(device: AudioDeviceInfo): Promise<void> {
    await this.callAdapter.setMicrophone(device);
  }
  /** Set the speaker to be used in the meeting. */
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
  /** Start the camera for the user in the Meeting. */
  public async startCamera(): Promise<void> {
    await this.callAdapter.startCamera();
  }
  /** Stop the camera for the user in the Meeting. */
  public async stopCamera(): Promise<void> {
    await this.callAdapter.stopCamera();
  }
  /** Toggle the camera for the user in the Meeting. */
  public async onToggleCamera(options?: VideoStreamOptions): Promise<void> {
    await this.callAdapter.onToggleCamera(options);
  }
  /** Mute the user in the Meeting. */
  public async mute(): Promise<void> {
    await this.callAdapter.mute();
  }
  /** Unmute the user in the Meeting. */
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
  /** Fetch initial Meeting data such as chat messages. */
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
  /** Load previous Meeting chat messages. */
  public async loadPreviousChatMessages(messagesToLoad: number): Promise<boolean> {
    return await this.chatAdapter.loadPreviousChatMessages(messagesToLoad);
  }
  on(event: 'participantsJoined', listener: ParticipantJoinedListener): void;
  on(event: 'participantsLeft', listener: ParticipantLeftListener): void;
  on(event: 'meetingEnded', listener: CallEndedListener): void;
  on(event: 'error', listener: (e: Error) => void): void;
  on(event: 'isMutedChanged', listener: IsMuteChangedListener): void;
  on(event: 'callIdChanged', listener: CallIdChangedListener): void;
  on(event: 'isLocalScreenSharingActiveChanged', listener: IsScreenSharingOnChangedListener): void;
  on(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  on(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageSent', listener: MessageReceivedListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: MeetingEvent, listener: any): void {
    switch (event) {
      case 'participantsJoined':
        this.callAdapter.on(event, listener);
        break;
      case 'participantsLeft':
        this.callAdapter.on('participantsLeft', listener);
        break;
      case 'meetingEnded':
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
      case 'error':
        throw 'on(Error) not implemented yet.';
      default:
        throw `Unknown MeetingEvent: ${event}`;
    }
  }

  off(event: 'participantsJoined', listener: ParticipantJoinedListener): void;
  off(event: 'participantsLeft', listener: ParticipantLeftListener): void;
  off(event: 'meetingEnded', listener: CallEndedListener): void;
  off(event: 'error', listener: (e: Error) => void): void;
  off(event: 'isMutedChanged', listener: IsMuteChangedListener): void;
  off(event: 'callIdChanged', listener: CallIdChangedListener): void;
  off(event: 'isLocalScreenSharingActiveChanged', listener: IsScreenSharingOnChangedListener): void;
  off(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  off(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageReceivedListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: MeetingEvent, listener: any): void {
    switch (event) {
      case 'participantsJoined':
        this.callAdapter.off(event, listener);
        break;
      case 'participantsLeft':
        this.callAdapter.off('participantsLeft', listener);
        break;
      case 'meetingEnded':
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
      case 'error':
        throw 'on(Error) not implemented yet.';
      default:
        throw `Unknown MeetingEvent: ${event}`;
    }
  }
}

/**
 * Arguments for {@link createAzureCommunicationMeetingAdapter}
 *
 * @alpha
 */
export type AzureCommunicationMeetingAdapterArgs = {
  endpointUrl: string;
  userId: CommunicationUserKind;
  displayName: string;
  credential: CommunicationTokenCredential;
  chatThreadId: string;
  callLocator: TeamsMeetingLinkLocator | GroupCallLocator;
};

/**
 * Create a meeting adapter backed by Azure Communication services
 * to plug into the Meeting Composite.
 *
 * @alpha
 */
export const createAzureCommunicationMeetingAdapter = async ({
  userId,
  displayName,
  credential,
  endpointUrl,
  chatThreadId,
  callLocator
}: AzureCommunicationMeetingAdapterArgs): Promise<MeetingAdapter> => {
  const callAdapter = await createAzureCommunicationCallAdapter({
    userId,
    displayName,
    credential,
    locator: callLocator
  });

  const chatAdapter = await createAzureCommunicationChatAdapter({
    endpointUrl,
    userId,
    displayName,
    credential,
    threadId: chatThreadId
  });

  return new AzureCommunicationMeetingAdapter(callAdapter, chatAdapter);
};
