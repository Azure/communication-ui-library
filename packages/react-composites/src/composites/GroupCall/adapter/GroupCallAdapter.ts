// © Microsoft Corporation. All rights reserved.

import {
  Call,
  DeviceManager as Devices,
  LocalVideoStream,
  RemoteVideoStream,
  RemoteParticipant
} from '@azure/acs-calling-declarative';
import { AudioDeviceInfo, CreateViewOptions, VideoDeviceInfo } from '@azure/communication-calling';

export type GroupCallUIState = {
  // Self-contained state for composite
  error?: Error;
  page: 'configuration' | 'call';
};

export type GroupCallClientState = {
  // Properties from backend services
  userId: string;
  displayName: string;
  call: Call;
  devices: Devices;
};

export interface JoinCallResult {
  groupCallId: string;
}

export type GroupCallState = GroupCallUIState & GroupCallClientState;

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

export interface GroupCallAdapter {
  onStateChange(handler: (state: GroupCallState) => void): void;

  offStateChange(handler: (state: GroupCallState) => void): void;

  getState(): GroupCallState;

  dispose(): Promise<void>;

  setDisplayName(displayName: string): void;

  joinCall(groupCallId?: string): Promise<JoinCallResult>;

  leaveCall(forEveryone?: boolean): Promise<void>;

  setCamera(source: VideoDeviceInfo): Promise<void>;

  setMicrophone(source: AudioDeviceInfo): Promise<void>;

  queryCameras(): Promise<VideoDeviceInfo[]>;

  queryMicrophones(): Promise<AudioDeviceInfo[]>;

  startCamera(): Promise<void>;

  stopCamera(): Promise<void>;

  mute(): Promise<void>;

  unmute(): Promise<void>;

  startScreenShare(): Promise<void>;

  stopScreenShare(): Promise<void>;

  startRenderVideo(
    callId: string,
    stream: LocalVideoStream | RemoteVideoStream,
    options?: CreateViewOptions
  ): Promise<void>;

  stopRenderVideo(callId: string, stream: LocalVideoStream | RemoteVideoStream): void;

  on(event: 'incomingCall', listener: IncomingCallListener): void;

  on(event: 'participantJoined', listener: ParticipantJoinedListener): void;

  on(event: 'error', errorHandler: (e: Error) => void): void;

  off(event: 'incomingCall', listener: IncomingCallListener): void;

  off(event: 'participantJoined', listener: ParticipantJoinedListener): void;

  off(event: 'error', errorHandler: (e: Error) => void): void;
}
