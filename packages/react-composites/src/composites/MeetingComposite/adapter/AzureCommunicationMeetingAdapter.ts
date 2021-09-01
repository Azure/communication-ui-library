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
  CallAdapter
} from '../../CallComposite';
import { MessageReceivedListener, MessageReadListener, ChatAdapter } from '../../ChatComposite';
import { MeetingAdapter, MeetingEvent } from './MeetingAdapter';
import { MeetingAdapterState, MeetingCompositePage } from '../state/MeetingAdapterState';

export class AzureCommunicationMeetingAdapter implements MeetingAdapter {
  private callAdapter: CallAdapter;
  private chatAdapter: ChatAdapter;

  constructor(callAdapter: CallAdapter, chatAdapter: ChatAdapter) {
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
    throw new Error('Method not implemented.');
  }
  public async leaveMeeting(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public startMeeting(participants: string[]): void {
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
  }
  public setPage(page: MeetingCompositePage): void {
    throw new Error('Method not implemented.');
  }
  public async removeParticipant(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async leaveCall(forEveryone?: boolean): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async setCamera(device: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async setMicrophone(device: AudioDeviceInfo): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async setSpeaker(device: AudioDeviceInfo): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async askDevicePermission(constrain: PermissionConstraints): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async queryCameras(): Promise<VideoDeviceInfo[]> {
    throw new Error('Method not implemented.');
  }
  public async queryMicrophones(): Promise<AudioDeviceInfo[]> {
    throw new Error('Method not implemented.');
  }
  public async querySpeakers(): Promise<AudioDeviceInfo[]> {
    throw new Error('Method not implemented.');
  }
  public async startCamera(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async stopCamera(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async onToggleCamera(options?: VideoStreamOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async mute(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async unmute(): Promise<void> {
    throw new Error('Method not implemented.');
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
