// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
  AudioDeviceInfo,
  VideoDeviceInfo,
  PermissionConstraints,
  CallClientOptions,
  GroupCallLocator,
  TeamsMeetingLinkLocator
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
  createAzureCommunicationCallAdapter
} from '../../CallComposite';
import { MessageReceivedListener, MessageReadListener, ChatAdapter, ChatState } from '../../ChatComposite';
import { MeetingAdapter, MeetingEvent } from './MeetingAdapter';
import {
  generateMeetingAdapterState,
  MeetingAdapterClientState,
  MeetingAdapterState,
  mergeCallAdapterStateIntoMeetingAdapterState,
  mergeChatAdapterStateIntoMeetingAdapterState
} from '../state/MeetingAdapterState';
import { createAzureCommunicationChatAdapter } from '../../ChatComposite/adapter/AzureCommunicationChatAdapter';
import { MeetingCompositePage, meetingPageToCallPage } from '../state/MeetingCompositePage';
import { EventEmitter } from 'events';
import { CommunicationTokenCredential, CommunicationUserKind } from '@azure/communication-common';

type MeetingAdapterStateChangedHandler = (newState: MeetingAdapterState) => void;

class MeetingContext {
  private emitter = new EventEmitter();
  private state: MeetingAdapterState;
  // TODO: private meetingId: string | undefined;

  constructor(clientState: MeetingAdapterClientState) {
    this.state = {
      userId: clientState.userId,
      displayName: clientState.displayName,
      devices: clientState.devices,
      meeting: undefined,
      page: 'configuration'
    };
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

  public updateClientState(clientState: MeetingAdapterClientState): void {
    this.setState({
      userId: clientState.userId,
      displayName: clientState.displayName,
      meeting: clientState.meeting,
      devices: clientState.devices,
      page: this.state.page
    });
  }

  public updateClientStateWithChatState(chatAdapterState: ChatState): void {
    if (!this.state) {
      console.warn('Cannot update chat state with meeting state - no meeting state exists');
    }
    this.updateClientState(mergeChatAdapterStateIntoMeetingAdapterState(chatAdapterState, this.state));
  }

  public updateClientStateWithCallState(callAdapterState: CallAdapterState): void {
    this.updateClientState(mergeCallAdapterStateIntoMeetingAdapterState(callAdapterState, this.state));
  }
}

export class AzureCommunicationMeetingAdapter implements MeetingAdapter {
  private callAdapter: CallAdapter;
  private chatAdapter: ChatAdapter;
  private context: MeetingContext;
  private onChatStateChange: (newChatAdapterState: ChatState) => void;
  private onCallStateChange: (newChatAdapterState: CallAdapterState) => void;

  constructor(callAdapter: CallAdapter, chatAdapter: ChatAdapter) {
    this.bindPublicMethods();
    this.callAdapter = callAdapter;
    this.chatAdapter = chatAdapter;
    this.context = new MeetingContext(generateMeetingAdapterState(callAdapter, chatAdapter));

    const onChatStateChange = (newChatAdapterState: ChatState): void => {
      this.context.updateClientStateWithChatState(newChatAdapterState);
    };
    this.chatAdapter.onStateChange(onChatStateChange);
    this.onChatStateChange = onChatStateChange;

    const onCallStateChange = (newCallAdapterState: CallAdapterState): void => {
      this.context.updateClientStateWithCallState(newCallAdapterState);
    };
    this.callAdapter.onStateChange(onCallStateChange);
    this.onCallStateChange = onCallStateChange;

    this.subscribeMeetingEvents();
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

  public joinMeeting(microphoneOn?: boolean): void {
    this.callAdapter.joinCall(microphoneOn);
  }
  public async leaveMeeting(): Promise<void> {
    await this.chatAdapter.removeParticipant(this.chatAdapter.getState().userId);
    await this.callAdapter.leaveCall();
  }
  public startMeeting(participants: string[]): void {
    this.callAdapter.startCall(participants);
  }
  public onStateChange(handler: MeetingAdapterStateChangedHandler): void {
    throw new Error('Method not implemented.');
  }
  public offStateChange(handler: MeetingAdapterStateChangedHandler): void {
    throw new Error('Method not implemented.');
  }
  public getState(): MeetingAdapterState {
    return this.context.getState();
  }
  public dispose(): void {
    this.unsubscribeMeetingEvents();

    this.chatAdapter.offStateChange(this.onChatStateChange);
    this.callAdapter.offStateChange(this.onCallStateChange);

    this.chatAdapter.dispose();
    this.callAdapter.dispose();
  }
  public setPage(page: MeetingCompositePage): void {
    this.callAdapter.setPage(meetingPageToCallPage(page));
  }
  public async removeParticipant(userId: string): Promise<void> {
    await this.chatAdapter.removeParticipant(userId);
    await this.callAdapter.removeParticipant(userId);
  }
  public async setCamera(device: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void> {
    await this.callAdapter.setCamera(device, options);
  }
  public async setMicrophone(device: AudioDeviceInfo): Promise<void> {
    await this.callAdapter.setMicrophone(device);
  }
  public async setSpeaker(device: AudioDeviceInfo): Promise<void> {
    await this.callAdapter.setSpeaker(device);
  }
  public async askDevicePermission(constraints: PermissionConstraints): Promise<void> {
    await this.callAdapter.askDevicePermission(constraints);
  }
  public async queryCameras(): Promise<VideoDeviceInfo[]> {
    return await this.callAdapter.queryCameras();
  }
  public async queryMicrophones(): Promise<AudioDeviceInfo[]> {
    return await this.callAdapter.queryMicrophones();
  }
  public async querySpeakers(): Promise<AudioDeviceInfo[]> {
    return await this.callAdapter.querySpeakers();
  }
  public async startCamera(): Promise<void> {
    await this.callAdapter.startCamera();
  }
  public async stopCamera(): Promise<void> {
    await this.callAdapter.stopCamera();
  }
  public async onToggleCamera(options?: VideoStreamOptions): Promise<void> {
    await this.callAdapter.onToggleCamera(options);
  }
  public async mute(): Promise<void> {
    await this.callAdapter.mute();
  }
  public async unmute(): Promise<void> {
    await this.callAdapter.unmute();
  }
  public async startScreenShare(): Promise<void> {
    await this.callAdapter.startScreenShare();
  }
  public async stopScreenShare(): Promise<void> {
    await this.callAdapter.stopScreenShare();
  }
  public async createStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void> {
    await this.callAdapter.createStreamView(remoteUserId, options);
  }
  public async disposeStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void> {
    await this.callAdapter.disposeStreamView(remoteUserId, options);
  }
  public async fetchInitialData(): Promise<void> {
    await this.chatAdapter.fetchInitialData();
  }
  public async sendMessage(content: string): Promise<void> {
    await this.chatAdapter.sendMessage(content);
  }
  public async sendReadReceipt(chatMessageId: string): Promise<void> {
    await this.chatAdapter.sendReadReceipt(chatMessageId);
  }
  public async sendTypingIndicator(): Promise<void> {
    await this.chatAdapter.sendTypingIndicator();
  }
  public async loadPreviousChatMessages(messagesToLoad: number): Promise<boolean> {
    return await this.chatAdapter.loadPreviousChatMessages(messagesToLoad);
  }
  on(event: 'participantsJoined', listener: ParticipantJoinedListener): void;
  on(event: 'participantsLeft', listener: ParticipantLeftListener): void;
  on(event: 'meetingEnded', listener: ParticipantLeftListener): void;
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
    throw new Error('Method not implemented.');
  }
  off(event: 'participantsJoined', listener: ParticipantJoinedListener): void;
  off(event: 'participantsLeft', listener: ParticipantLeftListener): void;
  off(event: 'meetingEnded', listener: ParticipantLeftListener): void;
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
    throw new Error('Method not implemented.');
  }

  private subscribeMeetingEvents(): void {
    throw new Error('Method not implemented.');
  }

  private unsubscribeMeetingEvents(): void {
    throw new Error('Method not implemented.');
  }
}

export type AzureCommunicationMeetingAdapterArgs = {
  endpointUrl: string;
  userId: CommunicationUserKind;
  displayName: string;
  credential: CommunicationTokenCredential;
  chatThreadId: string;
  callLocator: TeamsMeetingLinkLocator | GroupCallLocator;
  callClientOptions?: CallClientOptions;
};

export const createAzureCommunicationMeetingAdapter = async ({
  userId,
  displayName,
  credential,
  endpointUrl,
  chatThreadId,
  callLocator,
  callClientOptions
}: AzureCommunicationMeetingAdapterArgs): Promise<MeetingAdapter> => {
  const callAdapter = await createAzureCommunicationCallAdapter({
    userId,
    displayName,
    credential,
    locator: callLocator,
    callClientOptions
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
