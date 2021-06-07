// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AddPhoneNumberOptions,
  AudioDeviceInfo,
  Call,
  CallAgent,
  CallAgentOptions,
  CallApiFeature,
  CallClient,
  CallDirection,
  CallerInfo,
  CallFeatureFactoryType,
  CallState,
  CollectionUpdatedEvent,
  CreateViewOptions,
  DeviceAccess,
  DeviceManager,
  DtmfTone,
  GroupChatCallLocator,
  GroupLocator,
  HangUpOptions,
  IncomingCallEvent,
  JoinCallOptions,
  LocalVideoStream,
  MediaStreamType,
  MeetingLocator,
  PermissionConstraints,
  PropertyChangedEvent,
  RemoteParticipant,
  RemoteParticipantState as RemoteParticipantStatus,
  StartCallOptions,
  VideoDeviceInfo
} from '@azure/communication-calling';
import {
  CommunicationIdentifierKind,
  CommunicationTokenCredential,
  CommunicationUserIdentifier,
  MicrosoftTeamsUserIdentifier,
  PhoneNumberIdentifier,
  UnknownIdentifier
} from '@azure/communication-common';
import {
  CallClientState,
  LocalVideoStreamState,
  RemoteVideoStreamState,
  StatefulCallClient
} from 'calling-stateful-client';
import { MockCall, MockCallAgent, MockRemoteVideoStream } from './CallingTypeMocks';

type MockCallProps = {
  muteExecutedCallback: jest.Mock<any, any>;
  unmuteExecutedCallback: jest.Mock<any, any>;
  isMicrophoneMuted: boolean;
  isStartScreenSharingExecuted: jest.Mock<any, any>;
  isStopScreenSharingExecuted: jest.Mock<any, any>;
  isScreenSharingOn: boolean;
  acceptExecutedCallback: jest.Mock<any, any>;
  rejectExecutedCallback: jest.Mock<any, any>;
  hangUpExecutedCallback: jest.Mock<any, any>;
  outgoingCallExecutedCallback: jest.Mock<any, any>;
  joinExecutedCallback: jest.Mock<any, any>;
  startVideo?: jest.Mock<any, any>;
  stopVideo?: jest.Mock<any, any>;
  localVideoStreams?: Array<LocalVideoStream>;
  isIncoming: boolean;
};

export const defaultMockCallProps = {
  muteExecutedCallback: jest.fn(),
  unmuteExecutedCallback: jest.fn(),
  isMicrophoneMuted: false,
  isStartScreenSharingExecuted: jest.fn(),
  isStopScreenSharingExecuted: jest.fn(),
  isScreenSharingOn: false,
  outgoingCallExecutedCallback: jest.fn(),
  acceptExecutedCallback: jest.fn(),
  rejectExecutedCallback: jest.fn(),
  hangUpExecutedCallback: jest.fn(),
  joinExecutedCallback: jest.fn(),
  startVideo: jest.fn(),
  stopVideo: jest.fn(),
  localVideoStreams: [],
  isIncoming: false
};

export function mockCall(mockProps?: MockCallProps): MockCall {
  const props = { ...defaultMockCallProps, ...mockProps };

  return {
    id: 'call id',
    callerInfo: { identifier: undefined },
    info: {
      groupId: undefined,
      getServerCallId: async () => {
        return '';
      }
    },
    state: 'None',
    direction: props.isIncoming ? 'Incoming' : 'Outgoing',
    isMuted: props.isMicrophoneMuted,
    isScreenSharingOn: props.isScreenSharingOn,
    localVideoStreams: props.localVideoStreams,
    remoteParticipants: [],
    mute: async () => {
      return await new Promise<void>((resolve) => resolve()).then(() => {
        props.muteExecutedCallback(true);
      });
    },
    unmute: async () => {
      return await new Promise<void>((resolve) => resolve()).then(() => {
        props.unmuteExecutedCallback(true);
      });
    },
    api: <TFeature extends CallApiFeature>(): TFeature => {
      throw new Error('not implemented');
    },
    hangUp: async () => {
      return await new Promise<void>((resolve) => resolve()).then(() => {
        props.hangUpExecutedCallback();
      });
    },
    sendDtmf: async () => {
      return await new Promise((resolve) => resolve());
    },
    startVideo: async () => {
      props.startVideo(true);
      return await new Promise((resolve) => resolve());
    },
    stopVideo: async () => {
      props.stopVideo(true);
      return await new Promise((resolve) => resolve());
    },
    addParticipant: () => {
      const a: RemoteParticipant = {
        identifier: { phoneNumber: 'phoneNumber', kind: 'phoneNumber' },
        state: 'Connecting',
        videoStreams: [],
        isMuted: false,
        isSpeaking: false,
        on: () => {
          return;
        },
        off: () => {
          return;
        }
      };
      return a;
    },
    removeParticipant: async () => {
      return await new Promise((resolve) => resolve());
    },
    hold: async () => {
      return await new Promise((resolve) => resolve());
    },
    resume: async () => {
      return await new Promise((resolve) => resolve());
    },
    startScreenSharing: async () => {
      return await new Promise<void>((resolve) => resolve()).then(() => {
        props.isStartScreenSharingExecuted(true);
      });
    },
    stopScreenSharing: async () => {
      return await new Promise<void>((resolve) => resolve()).then(() => {
        props.isStopScreenSharingExecuted(true);
      });
    },
    on: () => {
      return;
    },
    off: () => {
      return;
    }
  };
}

export function mockCallAgent(props?: MockCallProps): MockCallAgent {
  const call = mockCall(props);
  return {
    calls: [call],
    startCall: () => {
      props?.outgoingCallExecutedCallback();
      return call;
    },
    join: () => {
      props?.joinExecutedCallback();
      return call;
    },
    on: () => {
      return;
    },
    off: () => {
      return;
    },
    dispose: async () => {
      return await new Promise((resolve) => resolve());
    }
  };
}

export function mockRemoteParticipant(
  videoStreams?: MockRemoteVideoStream[],
  displayName?: string,
  state?: RemoteParticipantStatus,
  isMuted?: boolean
): RemoteParticipant {
  return {
    identifier: { communicationUserId: 'id', kind: 'communicationUser' },
    displayName: displayName ?? 'displayName',
    state: state ?? 'Connected',
    videoStreams: videoStreams ?? [],
    isMuted: isMuted ?? false,
    isSpeaking: true,
    on: () => {
      return;
    },
    off: () => {
      return;
    }
  };
}

export function mockRemoteVideoStream(type?: MediaStreamType, isAvailable?: boolean): MockRemoteVideoStream {
  return {
    id: 1,
    mediaStreamType: type ?? 'Video',
    isAvailable: isAvailable ?? false,
    on: () => {
      return;
    },
    off: () => {
      return;
    }
  };
}

export type CallOverrides = Partial<Call>;

export function createMockCall(callOverrides?: CallOverrides): Call {
  class MockCall implements Call {
    public id = '';
    public info = {
      groupId: undefined,
      getServerCallId: async () => {
        return '';
      }
    };
    public callerInfo: CallerInfo = { identifier: undefined };
    public state: CallState = 'None';
    public direction: CallDirection = 'Incoming';
    public isMuted = true;
    public isScreenSharingOn = false;
    public localVideoStreams: LocalVideoStream[] = [];
    public remoteParticipants: RemoteParticipant[] = [];

    public api<TFeature extends CallApiFeature>(cls: CallFeatureFactoryType<TFeature>): TFeature {
      if (callOverrides?.api) {
        return callOverrides.api(cls);
      }
      return {} as TFeature;
    }

    public hangUp(options?: HangUpOptions): Promise<void> {
      if (callOverrides?.hangUp) {
        return callOverrides.hangUp(options);
      }
      return Promise.resolve();
    }

    public mute(): Promise<void> {
      if (callOverrides?.mute) {
        return callOverrides.mute();
      }
      return Promise.resolve();
    }

    public unmute(): Promise<void> {
      if (callOverrides?.unmute) {
        return callOverrides.unmute();
      }
      return Promise.resolve();
    }

    public sendDtmf(dtmfTone: DtmfTone): Promise<void> {
      if (callOverrides?.sendDtmf) {
        return callOverrides.sendDtmf(dtmfTone);
      }
      return Promise.resolve();
    }

    public startVideo(localVideoStream: LocalVideoStream): Promise<void> {
      if (callOverrides?.startVideo) {
        return callOverrides.startVideo(localVideoStream);
      }
      return Promise.resolve();
    }

    public stopVideo(localVideoStream: LocalVideoStream): Promise<void> {
      if (callOverrides?.stopVideo) {
        return callOverrides.stopVideo(localVideoStream);
      }
      return Promise.resolve();
    }

    public addParticipant(identifier: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier): RemoteParticipant;
    public addParticipant(identifier: PhoneNumberIdentifier, options?: AddPhoneNumberOptions): RemoteParticipant;
    public addParticipant(identifier: any, options?: any): RemoteParticipant {
      if (callOverrides?.addParticipant) {
        return callOverrides.addParticipant(identifier, options);
      }
      return {} as RemoteParticipant;
    }

    public removeParticipant(
      identifier: CommunicationUserIdentifier | PhoneNumberIdentifier | MicrosoftTeamsUserIdentifier | UnknownIdentifier
    ): Promise<void> {
      if (callOverrides?.removeParticipant) {
        return callOverrides.removeParticipant(identifier);
      }
      return Promise.resolve();
    }

    public hold(): Promise<void> {
      if (callOverrides?.hold) {
        return callOverrides.hold();
      }
      return Promise.resolve();
    }

    public resume(): Promise<void> {
      if (callOverrides?.resume) {
        return callOverrides.resume();
      }
      return Promise.resolve();
    }

    public startScreenSharing(): Promise<void> {
      if (callOverrides?.startScreenSharing) {
        return callOverrides.startScreenSharing();
      }
      return Promise.resolve();
    }

    public stopScreenSharing(): Promise<void> {
      if (callOverrides?.stopScreenSharing) {
        return callOverrides.stopScreenSharing();
      }
      return Promise.resolve();
    }

    public on(event: 'stateChanged', listener: PropertyChangedEvent): void;
    public on(event: 'idChanged', listener: PropertyChangedEvent): void;
    public on(event: 'isMutedChanged', listener: PropertyChangedEvent): void;
    public on(event: 'isScreenSharingOnChanged', listener: PropertyChangedEvent): void;
    public on(event: 'remoteParticipantsUpdated', listener: CollectionUpdatedEvent<RemoteParticipant>): void;
    public on(event: 'localVideoStreamsUpdated', listener: CollectionUpdatedEvent<LocalVideoStream>): void;
    public on(event: any, listener: any): void {
      if (callOverrides?.on) {
        callOverrides.on(event, listener);
      }
    }

    public off(event: 'stateChanged', listener: PropertyChangedEvent): void;
    public off(event: 'idChanged', listener: PropertyChangedEvent): void;
    public off(event: 'isMutedChanged', listener: PropertyChangedEvent): void;
    public off(event: 'isScreenSharingOnChanged', listener: PropertyChangedEvent): void;
    public off(event: 'remoteParticipantsUpdated', listener: CollectionUpdatedEvent<RemoteParticipant>): void;
    public off(event: 'localVideoStreamsUpdated', listener: CollectionUpdatedEvent<LocalVideoStream>): void;
    public off(event: any, listener: any): void {
      if (callOverrides?.off) {
        callOverrides.off(event, listener);
      }
    }
  }

  return new MockCall();
}

export type AgentOverrides = Partial<CallAgent>;

export function createMockCallAgent(agentOverrides?: AgentOverrides, callOverrides?: CallOverrides): CallAgent {
  class MockCallAgent implements CallAgent {
    public calls: Call[] = [];

    public startCall(
      participants: (CommunicationUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[],
      options?: StartCallOptions
    ): Call {
      if (agentOverrides?.startCall) {
        return agentOverrides.startCall(participants, options);
      }
      return createMockCall(callOverrides);
    }

    public join(groupLocator: GroupLocator, options?: JoinCallOptions): Call;
    public join(groupChatCallLocator: GroupChatCallLocator, options?: JoinCallOptions): Call;
    public join(meetingLocator: MeetingLocator, options?: JoinCallOptions): Call;
    public join(locator: any, options?: JoinCallOptions): Call {
      if (agentOverrides?.join) {
        return agentOverrides.join(locator, options);
      }
      return createMockCall(callOverrides);
    }

    public dispose(): Promise<void> {
      if (agentOverrides?.dispose) {
        return agentOverrides.dispose();
      }
      return Promise.resolve();
    }

    public on(event: string, listener: IncomingCallEvent): void;
    public on(event: 'callsUpdated', listener: CollectionUpdatedEvent<Call>): void;
    public on(event: any, listener: any): void {
      if (agentOverrides?.on) {
        return agentOverrides.on(event, listener);
      }
    }

    public off(event: 'incomingCall', listener: IncomingCallEvent): void;
    public off(event: 'callsUpdated', listener: CollectionUpdatedEvent<Call>): void;
    public off(event: any, listener: any): void {
      if (agentOverrides?.off) {
        return agentOverrides.off(event, listener);
      }
    }
  }

  return new MockCallAgent();
}

export type DeviceManagerOverrides = Partial<DeviceManager>;

export function createMockDeviceManager(deviceManagerOverrides?: DeviceManagerOverrides): DeviceManager {
  class MockDeviceManager implements DeviceManager {
    public isSpeakerSelectionAvailable = false;

    public getCameras(): Promise<VideoDeviceInfo[]> {
      if (deviceManagerOverrides?.getCameras) {
        return deviceManagerOverrides.getCameras();
      }
      return Promise.resolve([] as VideoDeviceInfo[]);
    }

    public getMicrophones(): Promise<AudioDeviceInfo[]> {
      if (deviceManagerOverrides?.getMicrophones) {
        return deviceManagerOverrides.getMicrophones();
      }
      return Promise.resolve([] as AudioDeviceInfo[]);
    }

    public getSpeakers(): Promise<AudioDeviceInfo[]> {
      if (deviceManagerOverrides?.getSpeakers) {
        return deviceManagerOverrides.getSpeakers();
      }
      return Promise.resolve([] as AudioDeviceInfo[]);
    }

    public selectMicrophone(microphoneDevice: AudioDeviceInfo): Promise<void> {
      if (deviceManagerOverrides?.selectMicrophone) {
        return deviceManagerOverrides.selectMicrophone(microphoneDevice);
      }
      return Promise.resolve();
    }

    public selectSpeaker(speakerDevice: AudioDeviceInfo): Promise<void> {
      if (deviceManagerOverrides?.selectSpeaker) {
        return deviceManagerOverrides.selectSpeaker(speakerDevice);
      }
      return Promise.resolve();
    }

    public askDevicePermission(permissionConstraints: PermissionConstraints): Promise<DeviceAccess> {
      if (deviceManagerOverrides?.askDevicePermission) {
        return deviceManagerOverrides.askDevicePermission(permissionConstraints);
      }
      return Promise.resolve({} as DeviceAccess);
    }

    public on(event: 'videoDevicesUpdated', listener: CollectionUpdatedEvent<VideoDeviceInfo>): void;
    public on(event: 'audioDevicesUpdated', listener: CollectionUpdatedEvent<AudioDeviceInfo>): void;
    public on(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
    public on(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
    public on(event: any, listener: any): void {
      if (deviceManagerOverrides?.on) {
        deviceManagerOverrides.on(event, listener);
      }
    }

    public off(event: 'videoDevicesUpdated', listener: CollectionUpdatedEvent<VideoDeviceInfo>): void;
    public off(event: 'audioDevicesUpdated', listener: CollectionUpdatedEvent<AudioDeviceInfo>): void;
    public off(event: 'selectedMicrophoneChanged', listener: PropertyChangedEvent): void;
    public off(event: 'selectedSpeakerChanged', listener: PropertyChangedEvent): void;
    public off(event: any, listener: any): void {
      if (deviceManagerOverrides?.off) {
        deviceManagerOverrides.off(event, listener);
      }
    }
  }

  return new MockDeviceManager();
}

export type StatefulOverrides = Partial<StatefulCallClient>;

export function createMockStatefulCallClient(
  statefulOverrides?: StatefulOverrides,
  agentOverrides?: AgentOverrides,
  deviceManagerOverrides?: DeviceManagerOverrides,
  callOverrides?: CallOverrides
): StatefulCallClient {
  class MockStatefulCallClient extends CallClient implements StatefulCallClient {
    public getState(): CallClientState {
      if (statefulOverrides?.getState) {
        return statefulOverrides.getState();
      }
      return {} as CallClientState;
    }

    public onStateChange(handler: (state: CallClientState) => void): void {
      if (statefulOverrides?.onStateChange) {
        statefulOverrides.onStateChange(handler);
      }
    }

    public offStateChange(handler: (state: CallClientState) => void): void {
      if (statefulOverrides?.offStateChange) {
        statefulOverrides.offStateChange(handler);
      }
    }

    public createView(
      callId: string | undefined,
      participantId: CommunicationIdentifierKind | undefined,
      stream: LocalVideoStreamState | RemoteVideoStreamState,
      options?: CreateViewOptions
    ): Promise<void> {
      if (statefulOverrides?.createView) {
        return statefulOverrides.createView(callId, participantId, stream, options);
      }
      return Promise.resolve();
    }

    public disposeView(
      callId: string | undefined,
      participantId: CommunicationIdentifierKind | undefined,
      stream: LocalVideoStreamState | RemoteVideoStreamState
    ): void {
      if (statefulOverrides?.disposeView) {
        statefulOverrides.disposeView(callId, participantId, stream);
      }
    }

    public createCallAgent(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tokenCredential: CommunicationTokenCredential,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      options?: CallAgentOptions
    ): Promise<CallAgent> {
      return Promise.resolve(createMockCallAgent(agentOverrides, callOverrides));
    }

    public getDeviceManager(): Promise<DeviceManager> {
      const deviceManager = createMockDeviceManager(deviceManagerOverrides);
      Object.defineProperty(deviceManager, 'selectCamera', {
        configurable: false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
        value: (videoDeviceInfo: VideoDeviceInfo) => {}
      });
      return Promise.resolve(deviceManager);
    }
  }
  return new MockStatefulCallClient();
}
