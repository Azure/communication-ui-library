// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */

import {
  CallAdapterCallManagement,
  CallAdapterDeviceManagement,
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
  ChatAdapterThreadManagement,
  MessageReadListener,
  MessageReceivedListener,
  MessageSentListener
} from '../../ChatComposite';
import { MeetingAdapterState } from '../state/MeetingAdapterState';
import { MeetingCompositePage } from '../state/MeetingCompositePage';

import type { AdapterState, Disposable, AdapterPages } from '../../common/adapters';
import { Call } from '@azure/communication-calling';

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
      | 'fetchInitialData'
      | 'sendMessage'
      | 'sendReadReceipt'
      | 'sendTypingIndicator'
      | 'loadPreviousChatMessages'
      | 'updateMessage'
      | 'deleteMessage'
    > {
  /**
   * Join an existing Meeting
   * @returns The underlying Call object of the meeting.
   */
  joinMeeting(microphoneOn?: boolean): Call | undefined;

  /**
   * Leave the current Meeting
   */
  leaveMeeting(): Promise<void>;

  /**
   * Start a new Meeting
   * @param participants - Array of participant IDs. These represent the participants to initialize the meeting with.
   * @returns The underlying Call object of the meeting.
   */
  startMeeting(participants: string[]): Call | undefined;

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
  on(event: 'participantsJoined', listener: ParticipantsJoinedListener): void;
  on(event: 'participantsLeft', listener: ParticipantsLeftListener): void;
  on(event: 'meetingEnded', listener: CallEndedListener): void;
  on(event: 'error', listener: (e: Error) => void): void;

  off(event: 'participantsJoined', listener: ParticipantsJoinedListener): void;
  off(event: 'participantsLeft', listener: ParticipantsLeftListener): void;
  off(event: 'meetingEnded', listener: CallEndedListener): void;
  off(event: 'error', listener: (e: Error) => void): void;

  // Call subscriptions
  on(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  on(event: 'callIdChanged', listener: CallIdChangedListener): void;
  on(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  on(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  on(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;

  off(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  off(event: 'callIdChanged', listener: CallIdChangedListener): void;
  off(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
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
    Disposable,
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
