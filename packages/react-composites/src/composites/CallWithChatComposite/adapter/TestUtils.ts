// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  Call,
  CallAgent,
  CallAgentOptions,
  CallAgentKind,
  CallFeature,
  CallFeatureFactory,
  CollectionUpdatedEvent,
  DeviceManager,
  GroupLocator,
  IncomingCallEvent,
  JoinCallOptions,
  StartCallOptions,
  TeamsMeetingLinkLocator,
  VideoDeviceInfo
} from '@azure/communication-calling';
/* @conditional-compile-remove(unsupported-browser) */
import { EnvironmentInfo } from '@azure/communication-calling';
import {
  CommunicationTokenCredential,
  CommunicationUserIdentifier,
  CommunicationUserKind,
  PhoneNumberIdentifier,
  PhoneNumberKind,
  MicrosoftTeamsUserKind,
  UnknownIdentifier,
  UnknownIdentifierKind
} from '@azure/communication-common';
/* @conditional-compile-remove(calling-beta-sdk) */
import { GroupChatCallLocator, MeetingLocator, RoomLocator, PushNotificationData } from '@azure/communication-calling';
import {
  CallState,
  CallClientState,
  StatefulCallClient,
  createStatefulCallClient,
  CallErrors,
  CreateViewResult
} from '@internal/calling-stateful-client';
import EventEmitter from 'events';
/**
 * @private
 */
export class MockCallClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getState(): any {
    return createMockCall('someCallId');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars , @typescript-eslint/no-explicit-any
  onStateChange(handler: (state: any) => void): void {
    return;
  }
  createView(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars , @typescript-eslint/no-explicit-any
    callId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars , @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    participantId: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars , @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    stream: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars , @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    options?: any
  ): Promise<CreateViewResult | undefined> {
    return Promise.resolve(undefined);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars , @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  disposeView(callId: string, participantId: any, stream: any): void {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createCallAgent(tokenCredential: CommunicationTokenCredential, options?: CallAgentOptions): Promise<CallAgent> {
    return Promise.resolve(new MockCallAgent());
  }
  getDeviceManager(): Promise<DeviceManager> {
    return Promise.resolve(createMockDeviceManagerWithCameras());
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  feature<TFeature extends CallFeature>(factory: CallFeatureFactory<TFeature>): TFeature {
    return {
      name: 'mockFeature',
      dispose: {},
      /* @conditional-compile-remove(unsupported-browser) */
      getEnvironmentInfo: mockEnvInfo
    } as unknown as TFeature;
  }
}
/* @conditional-compile-remove(unsupported-browser) */
const mockEnvInfo = (): Promise<EnvironmentInfo> => {
  return Promise.resolve({
    environment: {
      platform: 'mockPlatform',
      browser: 'mockBrowser',
      browserVersion: 'mockBrowserVersion'
    },
    isSupportedPlatform: true,
    isSupportedBrowser: true,
    isSupportedBrowserVersion: true,
    isSupportedEnvironment: true
  });
};

/**
 * @private
 */
export type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};

interface MockDeviceManager extends Mutable<DeviceManager> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: any, data?: any);
}

const createMockDeviceManagerWithCameras = (): MockDeviceManager => {
  return addMockEmitter({
    async getCameras(): Promise<VideoDeviceInfo[]> {
      return [];
    }
  }) as MockDeviceManager;
};

/**
 * @private
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types , , @typescript-eslint/no-explicit-any
export function addMockEmitter(object: any): any {
  object.emitter = new EventEmitter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object.on = (event: any, listener: any): void => {
    object.emitter.on(event, listener);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object.off = (event: any, listener: any): void => {
    object.emitter.off(event, listener);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object.emit = (event: any, payload?: any): void => {
    object.emitter.emit(event, payload);
  };
  return object;
}

/**
 *
 */
export const createStatefulCallClientMock = (): StatefulCallClient => {
  const userId: CommunicationUserKind = { kind: 'communicationUser', communicationUserId: 'someUser' };
  const statefulCallClient = createStatefulCallClient({ userId: userId });
  statefulCallClient.getState = jest.fn(
    (): CallClientState => ({
      calls: {},
      deviceManager: {
        isSpeakerSelectionAvailable: false,
        cameras: [],
        microphones: [],
        speakers: [],
        unparentedViews: []
      },
      callsEnded: {},
      incomingCalls: {},
      incomingCallsEnded: {},
      userId: userId,
      latestErrors: {} as CallErrors
    })
  );
  return statefulCallClient;
};
/**
 * The kind of call object.
 */
export declare enum CallKind {
  /**
   * ACS call object kind.
   */
  Call = 'Call',
  /**
   * Teams call object kind.
   */
  TeamsCall = 'TeamsCall'
}
/**
 * Caller Information.
 */
export declare interface MockCallerInfo {
  /**
   * Identifier of the caller.
   */
  readonly identifier:
    | CommunicationUserKind
    | PhoneNumberKind
    | MicrosoftTeamsUserKind
    | UnknownIdentifierKind
    | undefined;
  /**
   * Display name of caller ( optional )
   */
  readonly displayName?: string;
}

function createMockCall(mockCallId: string): CallState {
  const call: CallState = {
    /* @conditional-compile-remove(teams-identity-support) */
    kind: 'Call' as CallKind,
    id: mockCallId,
    callerInfo: {} as MockCallerInfo,
    state: 'None',
    diagnostics: {
      network: {
        latest: {}
      },
      media: {
        latest: {}
      }
    },
    direction: 'Incoming',
    isMuted: true,
    isScreenSharingOn: false,
    localVideoStreams: [],
    remoteParticipants: {},
    remoteParticipantsEnded: {},
    recording: { isRecordingActive: false },
    transcription: { isTranscriptionActive: false },
    screenShareRemoteParticipant: undefined,
    startTime: new Date(),
    endTime: undefined,
    dominantSpeakers: undefined,
    /* @conditional-compile-remove(close-captions) */
    captionsFeature: {
      captions: [],
      supportedSpokenLanguages: [],
      supportedCaptionLanguages: [],
      currentCaptionLanguage: '',
      currentSpokenLanguage: '',
      isCaptionsFeatureActive: false
    }
  };
  return call;
}

/**
 *
 */
export class MockCallAgent implements CallAgent {
  calls: Call[] = [];
  displayName = undefined;
  kind = 'CallAgent' as CallAgentKind;
  emitter = new EventEmitter();
  feature;
  startCall(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    participants: (CommunicationUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: StartCallOptions
  ): Call {
    throw Error('Method not implemented.');
  }
  /* @conditional-compile-remove(calling-beta-sdk) */
  handlePushNotification(data: PushNotificationData): Promise<void> {
    console.error('handlePushNotification not implemented, data: ', data);
    return Promise.resolve();
  }
  join(groupLocator: GroupLocator, options?: JoinCallOptions): Call;
  /* @conditional-compile-remove(calling-beta-sdk) */
  join(groupChatCallLoctor: GroupChatCallLocator, options?: JoinCallOptions): Call;
  join(meetingLocator: TeamsMeetingLinkLocator, options?: JoinCallOptions): Call;
  /* @conditional-compile-remove(calling-beta-sdk) */
  join(meetingLocator: MeetingLocator, options?: JoinCallOptions): Call;
  /* @conditional-compile-remove(calling-beta-sdk) */
  join(roomLocator: RoomLocator, options?: JoinCallOptions): Call;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars , @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  join(meetingLocator: any, options?: any): Call {
    throw Error('Method not implemented.');
  }
  dispose(): Promise<void> {
    return Promise.resolve();
  }
  on(event: 'incomingCall', listener: IncomingCallEvent): void;
  on(event: 'callsUpdated', listener: CollectionUpdatedEvent<Call>): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  on(event: any, listener: any): void {
    this.emitter.on(event, listener);
  }
  off(event: 'incomingCall', listener: IncomingCallEvent): void;
  off(event: 'callsUpdated', listener: CollectionUpdatedEvent<Call>): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  off(event: any, listener: any): void {
    this.emitter.off(event, listener);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  emit(event: string, data: any): void {
    this.emitter.emit(event, data);
  }
}
