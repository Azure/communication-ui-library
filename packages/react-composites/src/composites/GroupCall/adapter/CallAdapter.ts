// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, DeviceManagerState, RemoteParticipant } from 'calling-stateful-client';
import { AudioDeviceInfo, VideoDeviceInfo, Call as SDKCall } from '@azure/communication-calling';
import { VideoStreamOptions } from 'react-components';

export type CallingUIState = {
  // Self-contained state for composite
  error?: Error;
  isMicrophoneEnabled: boolean;
  page: 'configuration' | 'call';
};

export type CallingClientState = {
  // Properties from backend services
  userId: string;
  displayName?: string;
  call?: Call;
  devices: DeviceManagerState;
};

export type CallState = CallingUIState & CallingClientState;

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

export type ParticipantJoinedListener = (event: { participant: RemoteParticipant }) => Promise<void>;

export interface CallAdapter {
  onStateChange(handler: (state: CallState) => void): void;

  offStateChange(handler: (state: CallState) => void): void;

  getState(): CallState;

  dispose(): void;

  joinCall(): Promise<void>;

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

  startCall(participants: string[]): SDKCall | undefined;

  startScreenShare(): Promise<void>;

  stopScreenShare(): Promise<void>;

  removeParticipant(userId: string): Promise<void>;

  createStreamView(userId?: string, options?: VideoStreamOptions | undefined): Promise<void>;

  on(event: 'incomingCall', listener: IncomingCallListener): void;

  on(event: 'participantJoined', listener: ParticipantJoinedListener): void;

  on(event: 'error', errorHandler: (e: Error) => void): void;

  off(event: 'incomingCall', listener: IncomingCallListener): void;

  off(event: 'participantJoined', listener: ParticipantJoinedListener): void;

  off(event: 'error', errorHandler: (e: Error) => void): void;
}

export type CallEvent = 'incomingCall' | 'participantJoined' | 'error';
