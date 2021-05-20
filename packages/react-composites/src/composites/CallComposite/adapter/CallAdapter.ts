// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState, DeviceManagerState, RemoteParticipantState } from 'calling-stateful-client';
import { AudioDeviceInfo, VideoDeviceInfo, Call } from '@azure/communication-calling';
import { VideoStreamOptions } from 'react-components';
import type {
  CommunicationUserKind,
  PhoneNumberKind,
  MicrosoftTeamsUserKind,
  UnknownIdentifierKind
} from '@azure/communication-common';

export type CallCompositePage = 'configuration' | 'call';

export type CallAdapterUiState = {
  // Self-contained state for composite
  error?: Error;
  isLocalPreviewMicrophoneEnabled: boolean;
  page: CallCompositePage;
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

export type ParticipantJoinedListener = (event: { joined: RemoteParticipantState[] }) => void;

export type ParticipantLeftListener = (event: { removed: RemoteParticipantState[] }) => void;

export type IsMuteChangedListener = (event: { identifier: CallIdentifierKinds; isMuted: boolean }) => void;

export type CallIdChangedListener = (event: { callId: string }) => void;

export type IsScreenSharingOnChangedListener = (event: { isScreenSharingOn: boolean }) => void;

export type IsSpeakingChangedListener = (event: { identifier: CallIdentifierKinds; isSpeaking: boolean }) => void;

export type DisplaynameChangedListener = (event: { participantId: CallIdentifierKinds; displayName: string }) => void;

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

  on(event: 'participantsJoined', participantsJoinedHandler: ParticipantJoinedListener): void;
  on(event: 'participantsLeft', participantsLeftHandler: ParticipantLeftListener): void;
  on(event: 'isMutedChanged', isMuteChanged: IsMuteChangedListener): void;
  on(event: 'callIdChanged', idChangedListner: CallIdChangedListener): void;
  on(event: 'isLocalScreenSharingActiveChanged', participantsJoinedHandler: IsScreenSharingOnChangedListener): void;
  on(event: 'displayNameChanged', participantsJoinedHandler: DisplaynameChangedListener): void;
  on(event: 'isSpeakingChanged', participantsJoinedHandler: IsSpeakingChangedListener): void;
  on(event: 'error', errorHandler: (e: Error) => void): void;

  off(event: 'participantsJoined', participantsJoinedHandler: ParticipantJoinedListener): void;
  off(event: 'participantsLeft', participantsLeftHandler: ParticipantLeftListener): void;
  off(event: 'isMutedChanged', isMuteChanged: IsMuteChangedListener): void;
  off(event: 'callIdChanged', idChangedListner: CallIdChangedListener): void;
  off(event: 'isLocalScreenSharingActiveChanged', participantsJoinedHandler: IsScreenSharingOnChangedListener): void;
  off(event: 'displayNameChanged', participantsJoinedHandler: DisplaynameChangedListener): void;
  off(event: 'isSpeakingChanged', participantsJoinedHandler: IsSpeakingChangedListener): void;
  off(event: 'error', errorHandler: (e: Error) => void): void;
}

export type CallEvent =
  | 'participantsJoined'
  | 'participantsLeft'
  | 'isMutedChanged'
  | 'callIdChanged'
  | 'isLocalScreenSharingActiveChanged'
  | 'displayNameChanged'
  | 'isSpeakingChanged'
  | 'error';
