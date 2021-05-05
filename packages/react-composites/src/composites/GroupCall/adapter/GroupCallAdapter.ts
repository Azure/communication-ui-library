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
  accept: () => Promise<void>;
  reject: () => Promise<void>;
}) => Promise<void>;

export type ParticipantJoinedListener = (event: { participant: RemoteParticipant }) => Promise<void>;

export interface GroupCallAdapter {
  onStateChange: (handler: (state: GroupCallState) => void) => void;

  offStateChange: (handler: (state: GroupCallState) => void) => void;

  getState: () => GroupCallState;

  fetchAllParticipants: () => Promise<void>;

  setDisplayName(displayName: string): void;

  joinCall(groupCallId?: string): Promise<JoinCallResult>;

  leaveCall(forEveryone?: boolean): Promise<void>;

  setCamera(source: VideoDeviceInfo): Promise<void>;

  setMicrophone(source: AudioDeviceInfo): Promise<void>;

  queryCameras(): Promise<void>;

  queryMicrophones(): Promise<void>;

  startCamera(): Promise<void>;

  stopCamera(): Promise<void>;

  toggleCameraOnOff(): Promise<void>;

  mute(): Promise<void>;

  unmute(): Promise<void>;

  toggleMute(): Promise<void>;

  startScreenShare(): Promise<void>;

  stopScreenShare(): Promise<void>;

  toggleScreenShare(): Promise<void>;

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

  off(event: 'error', errorHandler: (e: Error) => void): void;
}
