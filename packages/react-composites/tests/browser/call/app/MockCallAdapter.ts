// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { VideoStreamOptions } from '@internal/react-components';
import { AudioDeviceInfo, PermissionConstraints, VideoDeviceInfo, Call } from '@azure/communication-calling';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { CallAdapterState, CallAdapter } from '../../../..';

export class MockCallAdapter implements CallAdapter {
  state: CallAdapterState;

  constructor(state: CallAdapterState) {
    this.state = state;

    for (const [participantKey, participant] of Object.entries(state.call?.remoteParticipants)) {
      for (const [videoStreamKey, videoStream] of Object.entries(participant.videoStreams)) {
        if (videoStream.isAvailable) {
          const mockVideoElement = document.createElement('div');
          mockVideoElement.innerHTML = '<span />';
          mockVideoElement.style.width = decodeURIComponent('100%25');
          mockVideoElement.style.height = decodeURIComponent('100%25');
          mockVideoElement.style.background = stringToHexColor(participant.displayName);
          mockVideoElement.style.backgroundPosition = 'center';
          mockVideoElement.style.backgroundRepeat = 'no-repeat';
          videoStream.view = { scalingMode: 'Crop', isMirrored: false, target: mockVideoElement };
        }
      }
    }
  }

  addParticipant(participantKey: string, participantState: RemoteParticipantState): void {
    if (!this.state.call) {
      return;
    }
    this.state.call.remoteParticipants[participantKey] = participantState;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  onStateChange(handler: (state: any) => void): void {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  offStateChange(handler: (state: any) => void): void {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getState(): any {
    return this.state;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  dispose(): void {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  joinCall(microphoneOn?: boolean): Call | undefined {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async leaveCall(forEveryone?: boolean): Promise<void> {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async startCamera(options?: VideoStreamOptions): Promise<void> {
    return;
  }
  async stopCamera(): Promise<void> {
    return;
  }
  async mute(): Promise<void> {
    return;
  }
  async unmute(): Promise<void> {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startCall(participants: string[]): Call | undefined {
    return;
  }
  async startScreenShare(): Promise<void> {
    return;
  }
  async stopScreenShare(): Promise<void> {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async removeParticipant(userId: string): Promise<void> {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void> {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async disposeStreamView(remoteUserId?: string, options?: VideoStreamOptions): Promise<void> {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async askDevicePermission(constrain: PermissionConstraints): Promise<void> {
    return;
  }

  public async queryCameras(): Promise<VideoDeviceInfo[]> {
    return;
  }

  public async queryMicrophones(): Promise<AudioDeviceInfo[]> {
    return;
  }

  public async querySpeakers(): Promise<AudioDeviceInfo[]> {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setCamera(sourceInfo: VideoDeviceInfo, options?: VideoStreamOptions): Promise<void> {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setMicrophone(sourceInfo: AudioDeviceInfo): Promise<void> {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setSpeaker(sourceInfo: AudioDeviceInfo): Promise<void> {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  on(event: string): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  off(event: string): void {
    return;
  }
}

const stringToHexColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};
