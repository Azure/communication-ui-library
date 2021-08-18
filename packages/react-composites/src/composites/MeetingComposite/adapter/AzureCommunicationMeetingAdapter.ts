// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AudioDeviceInfo, VideoDeviceInfo, PermissionConstraints } from '@azure/communication-calling';
import { VideoStreamOptions } from '@internal/react-components';
import {
  ParticipantJoinedListener,
  ParticipantLeftListener,
  IsMuteChangedListener,
  CallIdChangedListener,
  IsScreenSharingOnChangedListener,
  DisplayNameChangedListener,
  IsSpeakingChangedListener,
  AzureCommunicationCallAdapter,
  CallAdapter
} from '../../CallComposite';
import { MessageReceivedListener, MessageReadListener, ChatAdapter } from '../../ChatComposite';
import { MeetingAdapter, MeetingEvent } from './MeetingAdapter';
import { MeetingAdapterState, MeetingCompositePage } from '../state/MeetingAdapterState';
import { AzureCommunicationChatAdapter } from '../../ChatComposite/adapter/AzureCommunicationChatAdapter';

export class AzureCommunicationMeetingAdapter implements MeetingAdapter {
  private callAdapter: CallAdapter;
  private chatAdapter: ChatAdapter;

  constructor(callAdapter: AzureCommunicationCallAdapter, chatAdapter: AzureCommunicationChatAdapter) {
    this.bindPublicMethods();
    this.callAdapter = callAdapter;
    this.chatAdapter = chatAdapter;
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
    this.leaveCall.bind(this);
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
  public onStateChange(handler: (state: MeetingAdapterState) => void): void {
    throw new Error('Method not implemented.');
  }
  public offStateChange(handler: (state: MeetingAdapterState) => void): void {
    throw new Error('Method not implemented.');
  }
  public getState(): MeetingAdapterState {
    throw new Error('Method not implemented.');
  }
  public dispose(): void {
    this.unsubscribeMeetingEvents();
    this.callAdapter.dispose();
    this.chatAdapter.dispose();
  }
  public setPage(page: MeetingCompositePage): void {
    switch (page) {
      case 'configuration':
        this.callAdapter.setPage('configuration');
        break;
      case 'meeting':
        this.callAdapter.setPage('call');
        break;
      case 'error':
        this.callAdapter.setPage('error');
        break;
      case 'errorJoiningTeamsMeeting':
        this.callAdapter.setPage('errorJoiningTeamsMeeting');
        break;
      case 'removed':
        this.callAdapter.setPage('removed');
        break;
      default:
        throw `Page (${page}) not implemented`;
    }
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
    throw new Error('Method not implemented.');
  }
  public async stopScreenShare(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async createStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async disposeStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async fetchInitialData(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async sendMessage(content: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async sendReadReceipt(chatMessageId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async sendTypingIndicator(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async loadPreviousChatMessages(messagesToLoad: number): Promise<boolean> {
    throw new Error('Method not implemented.');
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
