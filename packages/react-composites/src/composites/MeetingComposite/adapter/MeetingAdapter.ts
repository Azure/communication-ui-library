// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/adjacent-overload-signatures */

import {
  CallAdapterCallManagement,
  CallAdapterDeviceManagement,
  CallIdChangedListener,
  DisplayNameChangedListener,
  IsMuteChangedListener,
  IsScreenSharingOnChangedListener,
  IsSpeakingChangedListener,
  ParticipantJoinedListener,
  ParticipantLeftListener
} from '../../CallComposite';
import {
  ChatAdapterThreadManagement,
  MessageReadListener,
  MessageReceivedListener,
  MessageSentListener
} from '../../ChatComposite';
import { MeetingAdapterState } from '../state/MeetingAdapterState';
import { MeetingCompositePage } from '../state/MeetingCompositePage';

import type { AdapterState, AdapterDisposal, AdapterPages } from '../../common/adapters';

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
  extends AdapterState<MeetingAdapterState>,
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
