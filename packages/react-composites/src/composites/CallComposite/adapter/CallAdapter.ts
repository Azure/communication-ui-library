// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState, DeviceManagerState } from 'calling-stateful-client';
import type {
  AudioDeviceInfo,
  VideoDeviceInfo,
  Call,
  PermissionConstraints,
  RemoteParticipant
} from '@azure/communication-calling';

import { VideoStreamOptions } from 'react-components';
import type {
  CommunicationUserKind,
  PhoneNumberKind,
  MicrosoftTeamsUserKind,
  UnknownIdentifierKind
} from '@azure/communication-common';

export type CallCompositePage = 'configuration' | 'call' | 'error' | 'errorJoiningTeamsMeeting';

export type CallAdapterUiState = {
  // Self-contained state for composite
  error?: Error;
  isLocalPreviewMicrophoneEnabled: boolean;
  page: CallCompositePage;
  endedCall?: CallState | undefined;
};

export type CallAdapterClientState = {
  // Properties from backend services
  userId: string;
  displayName?: string;
  call?: CallState;
  devices: DeviceManagerState;
};

export type CallAdapterState = CallAdapterUiState & CallAdapterClientState;

export type IncomingCallListener = (event: {
  callId: string;
  callerId: string;
  callerDisplayName?: string;
  /**
   * Invoke to accept the call.
   */
  accept: () => Promise<void>;
  /**
   * Invoke to reject the call.
   */
  reject: () => Promise<void>;
}) => Promise<void>;

export type CallIdentifierKinds =
  | CommunicationUserKind
  | PhoneNumberKind
  | MicrosoftTeamsUserKind
  | UnknownIdentifierKind;

export type ParticipantJoinedListener = (event: { joined: RemoteParticipant[] }) => void;

export type ParticipantLeftListener = (event: { removed: RemoteParticipant[] }) => void;

export type IsMuteChangedListener = (event: { identifier: CallIdentifierKinds; isMuted: boolean }) => void;

export type CallIdChangedListener = (event: { callId: string }) => void;

export type IsScreenSharingOnChangedListener = (event: { isScreenSharingOn: boolean }) => void;

export type IsSpeakingChangedListener = (event: { identifier: CallIdentifierKinds; isSpeaking: boolean }) => void;

export type DisplayNameChangedListener = (event: { participantId: CallIdentifierKinds; displayName: string }) => void;

export type CallEndedListener = (event: { callId: string }) => void;

export interface CallAdapter {
  onStateChange(handler: (state: CallAdapterState) => void): void;

  offStateChange(handler: (state: CallAdapterState) => void): void;

  getState(): CallAdapterState;

  dispose(): void;

  joinCall(microphoneOn?: boolean): Promise<void>;

  leaveCall(forEveryone?: boolean): Promise<void>;

  setCamera(sourceId: VideoDeviceInfo): Promise<void>;

  setMicrophone(sourceId: AudioDeviceInfo): Promise<void>;

  setSpeaker(sourceId: AudioDeviceInfo): Promise<void>;

  askDevicePermission(constrain: PermissionConstraints): Promise<void>;

  queryCameras(): Promise<VideoDeviceInfo[]>;

  queryMicrophones(): Promise<AudioDeviceInfo[]>;

  querySpeakers(): Promise<AudioDeviceInfo[]>;

  startCamera(): Promise<void>;

  stopCamera(): Promise<void>;

  onToggleCamera(): Promise<void>;

  mute(): Promise<void>;

  unmute(): Promise<void>;

  startCall(participants: string[]): Call | undefined;

  startScreenShare(): Promise<void>;

  stopScreenShare(): Promise<void>;

  removeParticipant(userId: string): Promise<void>;

  setPage(page: CallCompositePage): void;

  createStreamView(userId?: string, options?: VideoStreamOptions | undefined): Promise<void>;

  on(event: 'participantsJoined', listener: ParticipantJoinedListener): void;
  on(event: 'participantsLeft', listener: ParticipantLeftListener): void;
  on(event: 'isMutedChanged', listener: IsMuteChangedListener): void;
  on(event: 'callIdChanged', listener: CallIdChangedListener): void;
  on(event: 'isLocalScreenSharingActiveChanged', listener: IsScreenSharingOnChangedListener): void;
  on(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  on(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  on(event: 'callEnded', listener: CallEndedListener): void;
  on(event: 'error', listener: (e: Error) => void): void;

  off(event: 'participantsJoined', listener: ParticipantJoinedListener): void;
  off(event: 'participantsLeft', listener: ParticipantLeftListener): void;
  off(event: 'isMutedChanged', listener: IsMuteChangedListener): void;
  off(event: 'callIdChanged', listener: CallIdChangedListener): void;
  off(event: 'isLocalScreenSharingActiveChanged', listener: IsScreenSharingOnChangedListener): void;
  off(event: 'displayNameChanged', listener: DisplayNameChangedListener): void;
  off(event: 'isSpeakingChanged', listener: IsSpeakingChangedListener): void;
  off(event: 'callEnded', listener: CallEndedListener): void;
  off(event: 'error', listener: (e: Error) => void): void;
}

export type CallEvent =
  | 'participantsJoined'
  | 'participantsLeft'
  | 'isMutedChanged'
  | 'callIdChanged'
  | 'isLocalScreenSharingActiveChanged'
  | 'displayNameChanged'
  | 'isSpeakingChanged'
  | 'callEnded'
  | 'error';
