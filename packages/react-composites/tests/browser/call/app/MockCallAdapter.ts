// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { VideoStreamOptions } from '@internal/react-components';
import {
  AudioDeviceInfo,
  PermissionConstraints,
  VideoDeviceInfo,
  Call,
  RemoteParticipant
} from '@azure/communication-calling';
import { CallAdapterState, CallAdapter } from '../../../..';

export class MockCallAdapter implements CallAdapter {
  state: CallAdapterState;

  constructor(state: CallAdapterState) {
    this.state = state;
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
    this.state.page = 'call';
    this.state.call = {
      id: 'call1',
      callerInfo: { displayName: 'caller', identifier: { kind: 'unknown', id: '1' } },
      direction: 'Incoming',
      transcription: { isTranscriptionActive: false },
      recording: { isRecordingActive: false },
      startTime: new Date(500000000000),
      endTime: new Date(500000000000),
      diagnostics: { network: { latest: {} }, media: { latest: {} } },
      state: 'Connected',
      localVideoStreams: [],
      isMuted: false,
      isScreenSharingOn: false,
      remoteParticipants: {
        '2': {
          identifier: { kind: 'unknown', id: '2' },
          state: 'Connected',
          videoStreams: [],
          isMuted: false,
          isSpeaking: true
        },
        '3': {
          identifier: { kind: 'unknown', id: '3' },
          state: 'Connected',
          videoStreams: [],
          isMuted: true,
          isSpeaking: false
        }
      },
      remoteParticipantsEnded: {}
    };
    return {
      id: 'call1',
      callerInfo: { displayName: 'caller', identifier: { kind: 'unknown', id: '1' } },
      direction: 'Incoming',
      state: 'Connected',
      localVideoStreams: [],
      isMuted: false,
      isScreenSharingOn: false,
      remoteParticipants: [
        {
          identifier: { kind: 'unknown', id: '2' },
          state: 'Connected',
          videoStreams: [],
          isMuted: false,
          isSpeaking: true,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
          on(event: string, listener: any): void {
            return;
          },

          // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
          off(event: string, listener: any): void {
            return;
          }
        },
        {
          identifier: { kind: 'unknown', id: '3' },
          state: 'Connected',
          videoStreams: [],
          isMuted: true,
          isSpeaking: false,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
          on(event: string, listener: any): void {
            return;
          },

          // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
          off(event: string, listener: any): void {
            return;
          }
        }
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      feature(): any {
        return;
      },
      async hangUp(): Promise<void> {
        return;
      },
      async mute(): Promise<void> {
        return;
      },
      async unmute(): Promise<void> {
        return;
      },
      async sendDtmf(): Promise<void> {
        return;
      },
      async startVideo(): Promise<void> {
        return;
      },
      async stopVideo(): Promise<void> {
        return;
      },
      async hold(): Promise<void> {
        return;
      },
      async resume(): Promise<void> {
        return;
      },
      async removeParticipant(): Promise<void> {
        return;
      },
      async startScreenSharing(): Promise<void> {
        return;
      },
      async stopScreenSharing(): Promise<void> {
        return;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      addParticipant(): RemoteParticipant {
        return {
          identifier: { kind: 'unknown', id: '3' },
          state: 'Connected',
          videoStreams: [],
          isMuted: true,
          isSpeaking: false,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
          on(event: string, listener: any): void {
            return;
          },

          // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
          off(event: string, listener: any): void {
            return;
          }
        };
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      on(event: string, listener: any): void {
        return;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      off(event: string, listener: any): void {
        return;
      }
    };
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
    this.state.page = 'call';
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
