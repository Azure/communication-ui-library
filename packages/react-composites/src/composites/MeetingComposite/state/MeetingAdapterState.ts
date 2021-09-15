// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifier } from '@azure/communication-common';
import { CallAdapterClientState } from '../../CallComposite';
import { MeetingCompositePage } from './MeetingCompositePage';
import { MeetingState } from './MeetingState';

/**
 * UI state pertaining to the Meeting Composite.
 * @alpha
 */
export interface MeetingAdapterUiState {
  /** Current page in the meeting composite. */
  page: MeetingCompositePage;
}

/**
 * State from the backend services that drives Meeting Composite.
 * @alpha
 */
export interface MeetingAdapterClientState extends Pick<CallAdapterClientState, 'devices'> {
  /** ID of the meeting participant using this Meeting Adapter. */
  userId: CommunicationIdentifier;
  /** Display name of the meeting participant using this Meeting Adapter. */
  displayName: string | undefined;
  /** State of the current Meeting. */
  meeting: MeetingState | undefined;
}

/**
 * Meeting State is a combination of Stateful Chat and Stateful Calling clients with some
 * state specific to meetings only.
 * Stateful items like Participants that apply to both calling and chat are intelligently
 * combined into one to suit the purpose of a Meeting.
 *
 * @alpha
 */
export interface MeetingAdapterState extends MeetingAdapterUiState, MeetingAdapterClientState {}
