// © Microsoft Corporation. All rights reserved.
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { VideoDeviceInfo, AudioDeviceInfo, ScalingMode } from '@azure/communication-calling';

export interface CallingActions {
  setDisplayName(displayName: string): void;
  joinCall(groupId: string): Promise<void>;
  setCamera(source: VideoDeviceInfo): Promise<void>;
  setMicrophone(source: AudioDeviceInfo): void;
  queryCameras(): void;
  queryMicrophones(): void;
  startCamera(): Promise<void>;
  stopCamera(): Promise<void>;
  toggleCameraOnOff(): Promise<void>;
  mute(): Promise<void>;
  unmute(): Promise<void>;
  toggleMute(): Promise<void>;
  renderLocalVideo(scalingMode?: ScalingMode, mirrored?: boolean): Promise<void>;
}

// = default handlers?
// or return values?
export const noopCallingActions: CallingActions = {
  setDisplayName: (displayName: string): void => {},
  joinCall: (groupId: string): Promise<void> => Promise.resolve(),
  setCamera: (source: VideoDeviceInfo): Promise<void> => Promise.resolve(),
  setMicrophone: (source: AudioDeviceInfo): Promise<void> => Promise.resolve(),
  queryCameras: (): void => {}, // deviceManager.listVideoDevices => onStateChange
  queryMicrophones: (): void => {},
  startCamera: (): Promise<void> => Promise.resolve(),
  stopCamera: (): Promise<void> => Promise.resolve(),
  toggleCameraOnOff: (): Promise<void> => Promise.resolve(),
  mute: (): Promise<void> => Promise.resolve(),
  unmute: (): Promise<void> => Promise.resolve(),
  toggleMute: (): Promise<void> => Promise.resolve(), // state.muted ? unmute() : mute()
  renderLocalVideo: (scalingMode?: ScalingMode, mirrored?: boolean): Promise<void> => Promise.resolve()
};
