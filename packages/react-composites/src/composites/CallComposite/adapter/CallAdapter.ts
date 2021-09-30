// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState, DeviceManagerState } from '@internal/calling-stateful-client';
import type {
  AudioDeviceInfo,
  VideoDeviceInfo,
  Call,
  PermissionConstraints,
  RemoteParticipant
} from '@azure/communication-calling';

import { VideoStreamOptions } from '@internal/react-components';
import type { CommunicationUserKind, CommunicationIdentifierKind } from '@azure/communication-common';
import type { AdapterState, Disposal, AdapterPages, AdapterError, AdapterErrors } from '../../common/adapters';

/**
 * Major UI screens shown in the {@link CallComposite}.
 *
 * @public
 */
export type CallCompositePage = 'configuration' | 'call' | 'error' | 'errorJoiningTeamsMeeting' | 'removed';

/**
 * {@link CallAdapter} state for pure UI purposes.
 *
 * @public
 */
export type CallAdapterUiState = {
  isLocalPreviewMicrophoneEnabled: boolean;
  page: CallCompositePage;
};

/**
 * {@link CallAdapter} state inferred from Azure Communication Services backend.
 *
 * @public
 */
export type CallAdapterClientState = {
  userId: CommunicationUserKind;
  displayName?: string;
  call?: CallState;
  devices: DeviceManagerState;
  endedCall?: CallState;
  isTeamsCall: boolean;
  /**
   * Latest error encountered for each operation performed via the adapter.
   */
  latestErrors: AdapterErrors;
};

/**
 * {@link CallAdapter} state.
 *
 * @public
 */
export type CallAdapterState = CallAdapterUiState & CallAdapterClientState;

/**
 * Callback for {@link CallAdapterSubscribers} 'participantsJoined' event.
 *
 * @public
 */
export type ParticipantsJoinedListener = (event: { joined: RemoteParticipant[] }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'participantsLeft' event.
 *
 * @public
 */
export type ParticipantsLeftListener = (event: { removed: RemoteParticipant[] }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'isMuted' event.
 *
 * @public
 */
export type IsMutedChangedListener = (event: { identifier: CommunicationIdentifierKind; isMuted: boolean }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'callIdChanged' event.
 *
 * @public
 */
export type CallIdChangedListener = (event: { callId: string }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'isLocalScreenSharingActiveChanged' event.
 *
 * @public
 */
export type IsLocalScreenSharingActiveChangedListener = (event: { isScreenSharingOn: boolean }) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'isSpeakingChanged' event.
 *
 * @public
 */
export type IsSpeakingChangedListener = (event: {
  identifier: CommunicationIdentifierKind;
  isSpeaking: boolean;
}) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'displayNameChanged' event.
 *
 * @public
 */
export type DisplayNameChangedListener = (event: {
  participantId: CommunicationIdentifierKind;
  displayName: string;
}) => void;

/**
 * Callback for {@link CallAdapterSubscribers} 'callEnded' event.
 *
 * @public
 */
export type CallEndedListener = (event: { callId: string }) => void;

/**
 * Functionality for managing the current call.
 *
 * @public
 */
export interface CallAdapterCallManagement {
  joinCall(microphoneOn?: boolean): Call | undefined;
  leaveCall(forEveryone?: boolean): Promise<void>;
  startCamera(): Promise<void>;
  stopCamera(): Promise<void>;
  onToggleCamera(options?: VideoStreamOptions): Promise<void>;
  mute(): Promise<void>;
  unmute(): Promise<void>;
  startCall(participants: string[]): Call | undefined;
  startScreenShare(): Promise<void>;
  stopScreenShare(): Promise<void>;
  removeParticipant(userId: string): Promise<void>;
  createStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void>;
  disposeStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void>;
}

/**
 * Functionality for managing devices within a call.
 *
 * @public
 */
export interface CallAdapterDeviceManagement {
  askDevicePermission(constrain: PermissionConstraints): Promise<void>;
  queryCameras(): Promise<VideoDeviceInfo[]>;
  queryMicrophones(): Promise<AudioDeviceInfo[]>;
  querySpeakers(): Promise<AudioDeviceInfo[]>;
  setCamera(sourceId: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void>;
  setMicrophone(sourceId: AudioDeviceInfo): Promise<void>;
  setSpeaker(sourceId: AudioDeviceInfo): Promise<void>;
}

/**
 * Call composite events that can be subscribed to.
 *
 * @public
 */
export interface CallAdapterSubscribers {
  on(event: 'participantsJoined', listener: ParticipantsJoinedListener): void;
  on(event: 'participantsLeft', listener: ParticipantsLeftListener): void;
  on(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  on(event: 'callIdChanged', listener: CallIdChangedListener): void;
  on(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  on(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  on(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  on(event: 'callEnded', listener: CallEndedListener): void;
  on(event: 'error', listener: (e: AdapterError) => void): void;

  off(event: 'participantsJoined', listener: ParticipantsJoinedListener): void;
  off(event: 'participantsLeft', listener: ParticipantsLeftListener): void;
  off(event: 'isMutedChanged', listener: IsMutedChangedListener): void;
  off(event: 'callIdChanged', listener: CallIdChangedListener): void;
  off(event: 'isLocalScreenSharingActiveChanged', listener: IsLocalScreenSharingActiveChangedListener): void;
  off(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  off(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  off(event: 'callEnded', listener: CallEndedListener): void;
  off(event: 'error', listener: (e: AdapterError) => void): void;
}

/**
 * {@link CallComposite} Adapter interface.
 *
 * @public
 */
export interface CallAdapter
  extends AdapterState<CallAdapterState>,
    Disposal,
    AdapterPages<CallCompositePage>,
    CallAdapterCallManagement,
    CallAdapterDeviceManagement,
    CallAdapterSubscribers {}
