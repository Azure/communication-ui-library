// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-unused-vars */ // REMOVE ONCE THIS FILE IS IMPLEMENTED
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */ // REMOVE ONCE THIS FILE IS IMPLEMENTED

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

/**
 * Meeting adapter backed by Azure Communication Services.
 * Created for easy use with the Meeting Composite.
 */
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

  /** Join existing Meeting. */
  public joinMeeting(microphoneOn?: boolean): void {
    this.callAdapter.joinCall(microphoneOn);
  }
  /** Leave current Meeting. */
  public async leaveMeeting(): Promise<void> {
    await this.chatAdapter.removeParticipant(this.chatAdapter.getState().userId);
    await this.callAdapter.leaveCall();
  }
  /** Start a new Meeting. */
  public startMeeting(participants: string[]): void {
    this.callAdapter.startCall(participants);
  }
  /**
   * Subscribe to state change events.
   * @param handler - handler to be called when the state changes. This is passed the new state.
   */
  public onStateChange(handler: (state: MeetingAdapterState) => void): void {
    throw new Error('Method not implemented.');
  }
  /**
   * Unsubscribe to state change events.
   * @param handler - handler to be no longer called when state changes.
   */
  public offStateChange(handler: (state: MeetingAdapterState) => void): void {
    throw new Error('Method not implemented.');
  }
  /** Get current Meeting state. */
  public getState(): MeetingAdapterState {
    throw new Error('Method not implemented.');
  }
  /** Dispose of the current Meeting Adapter. */
  public dispose(): void {
    this.unsubscribeMeetingEvents();
    this.callAdapter.dispose();
    this.chatAdapter.dispose();
  }
  /** Set the page of the Meeting Composite. */
  public setPage(page: MeetingCompositePage): void {
    this.callAdapter.setPage(page === 'meeting' ? 'call' : page);
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
    throw new Error('Method not implemented.');
  }
  /** Stop the current active screen share. */
  public async stopScreenShare(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /** Create a stream view for a remote participants video feed. */
  public async createStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /** Dispose of a created stream view of a remote participants video feed. */
  public async disposeStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /** Fetch initial Meeting data such as chat messages. */
  public async fetchInitialData(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /** Send a chat message. */
  public async sendMessage(content: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /** Send a chat read receipt. */
  public async sendReadReceipt(chatMessageId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /** Send an isTyping indicator. */
  public async sendTypingIndicator(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /** Load previous Meeting chat messages. */
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
