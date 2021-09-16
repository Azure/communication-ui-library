// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */

import {
  CallAdapter,
  CallAdapterCallManagement,
  CallAdapterDeviceManagement,
  CallAdapterState,
  CallCompositePage,
  CallIdChangedListener,
  DisplayNameChangedListener,
  IsMuteChangedListener,
  IsScreenSharingOnChangedListener,
  IsSpeakingChangedListener,
  ParticipantJoinedListener,
  ParticipantLeftListener
} from '../../CallComposite';
import {
  ChatAdapter,
  ChatAdapterState,
  ChatAdapterThreadManagement,
  MessageReadListener,
  MessageReceivedListener,
  MessageSentListener
} from '../../ChatComposite';
import { MeetingAdapterState } from '../state/MeetingAdapterState';
import { MeetingCompositePage } from '../state/MeetingCompositePage';

import type { AdapterState, AdapterDisposal, AdapterPages } from '../../common/adapters';
import { ErrorBarStrings, VideoStreamOptions } from '@internal/react-components';
import type { AudioDeviceInfo, VideoDeviceInfo, Call, PermissionConstraints } from '@azure/communication-calling';

/**
 * Functionality for managing the current meeting.
 * @alpha
 */
export interface MeetingAdapterMeetingManagement
  extends Pick<
      CallAdapterCallManagement,
      | 'startCamera'
      | 'stopCamera'
      | 'onToggleCamera'
      | 'mute'
      | 'unmute'
      | 'startScreenShare'
      | 'stopScreenShare'
      | 'createStreamView'
      | 'disposeStreamView'
    >,
    Pick<
      CallAdapterDeviceManagement,
      | 'setCamera'
      | 'setMicrophone'
      | 'setSpeaker'
      | 'askDevicePermission'
      | 'queryCameras'
      | 'queryMicrophones'
      | 'querySpeakers'
    >,
    Pick<
      ChatAdapterThreadManagement,
      'fetchInitialData' | 'sendMessage' | 'sendReadReceipt' | 'sendTypingIndicator' | 'loadPreviousChatMessages'
    > {
  /** Join an existing Meeting */
  joinMeeting(microphoneOn?: boolean): void;
  /** Leave the current Meeting */
  leaveMeeting(): Promise<void>;
  /**
   * Start a new Meeting
   * @param participants - Array of participant IDs. These represent the participants to initialize the meeting with.
   */
  startMeeting(participants: string[]): void;
  /**
   * Remove a participant from a Meeting
   * @param userId - UserId of the participant to remove.
   */
  removeParticipant(userId: string): Promise<void>;
}

/**
 * Meeting events that can be subscribed to.
 * @alpha
 */
export interface MeetingAdapterSubscriptions {
  // Meeting specific subscriptions
  on(event: 'participantsJoined', listener: ParticipantJoinedListener): void;
  on(event: 'participantsLeft', listener: ParticipantLeftListener): void;
  on(event: 'meetingEnded', listener: ParticipantLeftListener): void;
  on(event: 'error', listener: (e: Error) => void): void;

  off(event: 'participantsJoined', listener: ParticipantJoinedListener): void;
  off(event: 'participantsLeft', listener: ParticipantLeftListener): void;
  off(event: 'meetingEnded', listener: ParticipantLeftListener): void;
  off(event: 'error', listener: (e: Error) => void): void;

  // Call subscriptions
  on(event: 'isMutedChanged', listener: IsMuteChangedListener): void;
  on(event: 'callIdChanged', listener: CallIdChangedListener): void;
  on(event: 'isLocalScreenSharingActiveChanged', listener: IsScreenSharingOnChangedListener): void;
  on(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  on(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;

  off(event: 'isMutedChanged', listener: IsMuteChangedListener): void;
  off(event: 'callIdChanged', listener: CallIdChangedListener): void;
  off(event: 'isLocalScreenSharingActiveChanged', listener: IsScreenSharingOnChangedListener): void;
  off(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  off(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;

  // Chat subscriptions
  on(event: 'messageReceived', listener: MessageReceivedListener): void;
  on(event: 'messageSent', listener: MessageSentListener): void;
  on(event: 'messageRead', listener: MessageReadListener): void;

  off(event: 'messageReceived', listener: MessageReceivedListener): void;
  off(event: 'messageSent', listener: MessageSentListener): void;
  off(event: 'messageRead', listener: MessageReadListener): void;
}

/**
 * Meeting Composite Adapter interface.
 * @alpha
 */
export interface MeetingAdapter
  extends MeetingAdapterMeetingManagement,
    AdapterState<MeetingAdapterState>,
    AdapterDisposal,
    AdapterPages<MeetingCompositePage>,
    MeetingAdapterSubscriptions {}

/**
 * Events fired off by the Meeting Adapter
 * @alpha
 */
export type MeetingEvent =
  | 'participantsJoined'
  | 'participantsLeft'
  | 'meetingEnded'
  | 'isMutedChanged'
  | 'callIdChanged'
  | 'isLocalScreenSharingActiveChanged'
  | 'displayNameChanged'
  | 'isSpeakingChanged'
  | 'messageReceived'
  | 'messageSent'
  | 'messageRead'
  | 'error';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * Facade around the MeetingAdapter to satisfy the call adapter interface.
 */
export class MeetingBackedCallAdapter implements CallAdapter {
  private meetingAdapter;
  constructor(meetingAdapter: MeetingAdapter) {
    this.meetingAdapter = meetingAdapter;
  }
  public on = (event: any, listener: any): void => this.meetingAdapter.on(event, listener);
  public off = (event: any, listener: any): void => this.meetingAdapter.off(event, listener);
  public onStateChange = (handler: (state: CallAdapterState) => void): void =>
    this.meetingAdapter.onStateChange(handler);
  public offStateChange = (handler: (state: CallAdapterState) => void): void =>
    this.meetingAdapter.offStateChange(handler);
  public getState = (): CallAdapterState => this.meetingAdapter.getState();
  public dispose = (): void => this.meetingAdapter.getState();
  public setPage = (page: CallCompositePage): void => this.meetingAdapter.setPage(page);
  public joinCall = (microphoneOn?: boolean): Call | undefined => this.meetingAdapter.joinMeeting(microphoneOn);
  public leaveCall = async (): Promise<void> => await this.meetingAdapter.leaveCall();
  public startCall = (participants: string[]): Call | undefined => this.meetingAdapter.startMeeting(participants);
  public setCamera = async (sourceId: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void> =>
    await this.meetingAdapter.setCamera(sourceId, options);
  public setMicrophone = async (sourceId: AudioDeviceInfo): Promise<void> =>
    await this.meetingAdapter.setMicrophone(sourceId);
  public setSpeaker = async (sourceId: AudioDeviceInfo): Promise<void> =>
    await this.meetingAdapter.setSpeaker(sourceId);
  public askDevicePermission = async (constraints: PermissionConstraints): Promise<void> =>
    await this.meetingAdapter.askDevicePermission(constraints);
  public queryCameras = async (): Promise<VideoDeviceInfo[]> => await this.meetingAdapter.queryCameras();
  public queryMicrophones = async (): Promise<AudioDeviceInfo[]> => await this.meetingAdapter.queryMicrophones();
  public querySpeakers = async (): Promise<AudioDeviceInfo[]> => await this.meetingAdapter.querySpeakers();
  public startCamera = async (): Promise<void> => await this.meetingAdapter.startCamera();
  public stopCamera = async (): Promise<void> => await this.meetingAdapter.stopCamera();
  public onToggleCamera = async (options?: VideoStreamOptions): Promise<void> =>
    await this.meetingAdapter.onToggleCamera(options);
  public mute = async (): Promise<void> => await this.meetingAdapter.mute();
  public unmute = async (): Promise<void> => await this.meetingAdapter.unmute();
  public startScreenShare = async (): Promise<void> => await this.meetingAdapter.startScreenShare();
  public stopScreenShare = async (): Promise<void> => await this.meetingAdapter.stopScreenShare();
  public removeParticipant = async (userId: string): Promise<void> =>
    await this.meetingAdapter.removeParticipant(userId);
  public createStreamView = async (remoteUserId?: string, options?: VideoStreamOptions): Promise<void> =>
    await this.meetingAdapter.createStreamView(remoteUserId, options);
  public disposeStreamView = async (remoteUserId?: string, options?: VideoStreamOptions): Promise<void> =>
    await this.meetingAdapter.disposeStreamView(remoteUserId, options);
}

/**
 * Facade around the MeetingAdapter to satisfy the chat adapter interface.
 */
export class MeetingBackedChatAdapter implements ChatAdapter {
  private meetingAdapter;
  constructor(meetingAdapter: MeetingAdapter) {
    this.meetingAdapter = meetingAdapter;
  }
  public fetchInitialData = async (): Promise<void> => await this.meetingAdapter.fetchInitialData();
  public sendMessage = async (content: string): Promise<void> => await this.meetingAdapter.sendMessage(content);
  public sendReadReceipt = async (chatMessageId: string): Promise<void> =>
    await this.meetingAdapter.sendReadReceipt(chatMessageId);
  public sendTypingIndicator = async (): Promise<void> => await this.meetingAdapter.sendTypingIndicator();
  public removeParticipant = async (userId: string): Promise<void> =>
    await this.meetingAdapter.removeParticipant(userId);
  public loadPreviousChatMessages = async (messagesToLoad: number): Promise<boolean> =>
    await this.meetingAdapter.loadPreviousChatMessages(messagesToLoad);
  public onStateChange = (handler: (state: ChatAdapterState) => void): void =>
    this.meetingAdapter.onStateChange(handler);
  public offStateChange = (handler: (state: ChatAdapterState) => void): void =>
    this.meetingAdapter.offStateChange(handler);
  public getState = (): ChatAdapterState => this.meetingAdapter.getState();
  public dispose = (): void => this.meetingAdapter.dispose();
  public on = (event: any, listener: any): void => this.meetingAdapter.on(event, listener);
  public off = (event: any, listener: any): void => this.meetingAdapter.off(event, listener);

  public updateMessage(messageId: string, content: string): Promise<void> {
    // TODO: support editing messages
    throw `Method not implemented. (${messageId}, ${content})`;
  }
  public deleteMessage(messageId: string): Promise<void> {
    // TODO: support editing messages
    throw `Method not implemented. (${messageId})`;
  }

  public clearErrors = (errorTypes: (keyof ErrorBarStrings)[]): void => {
    throw `Method not supported in meetings.`;
  };

  public setTopic = async (topicName: string): Promise<void> => {
    throw `Method not supported in meetings.`;
  };
}
