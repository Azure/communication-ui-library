// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  Call,
  CallAgent,
  CallClient,
  DeviceManager,
  UserFacingDiagnosticsFeature,
  IncomingCall,
  LatestMediaDiagnostics,
  LatestNetworkDiagnostics,
  LocalVideoStream,
  PropertyChangedEvent,
  RecordingCallFeature,
  RemoteParticipant,
  RemoteVideoStream,
  TranscriptionCallFeature,
  CallFeatureFactory,
  CallFeature
} from '@azure/communication-calling';
import { RaiseHandCallFeature, RaisedHandListener, RaisedHand } from '@azure/communication-calling';
/* @conditional-compile-remove(media-access) */
import {
  MediaAccessCallFeature,
  MediaAccessChangedListener,
  MediaAccess,
  MeetingMediaAccessChangedListener,
  MeetingMediaAccess
} from '@azure/communication-calling';
import { CollectionUpdatedEvent, RecordingInfo } from '@azure/communication-calling';

import { VideoEffectsFeature } from '@azure/communication-calling';
import { CommunicationTokenCredential } from '@azure/communication-common';
import { AccessToken } from '@azure/core-auth';

import { EventEmitter } from 'events';
import { CallClientState } from './CallClientState';
import { CallContext } from './CallContext';
import { InternalCallContext } from './InternalCallContext';
import { createStatefulCallClientWithDeps, StatefulCallClient } from './StatefulCallClient';
/* @conditional-compile-remove(calling-beta-sdk) */
import { RemoteParticipantDiagnosticsData } from '@azure/communication-calling';

let backupFreezeFunction: typeof Object.freeze;

/**
 * @private
 */
export function mockoutObjectFreeze(): void {
  beforeEach(() => {
    backupFreezeFunction = Object.freeze;
    Object.freeze = function <T>(obj: T): T {
      return obj;
    };
  });

  afterEach(() => {
    Object.freeze = backupFreezeFunction;
  });
}

/**
 * @private
 */
export interface MockEmitter {
  emitter: EventEmitter;
  emit(eventName: string | symbol, ...args: any[]): boolean;
}

/**
 * @private
 */
export type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};

/**
 * @private
 */
export type MockRemoteVideoStream = Mutable<RemoteVideoStream> & MockEmitter;
/**
 * @private
 */
export type MockIncomingCall = Mutable<IncomingCall> & MockEmitter;

/**
 * @private
 */
export const stubCommunicationTokenCredential = (): CommunicationTokenCredential => {
  return {
    getToken: (): Promise<AccessToken> => {
      throw new Error('Not implemented');
    },
    dispose: (): void => {
      /* Nothing to dispose */
    }
  };
};

/**
 * @private
 */
export class MockRecordingCallFeatureImpl implements RecordingCallFeature {
  public name = 'Recording';
  public consentToBeingRecordedAndTranscribed(): Promise<void> {
    this.isRecordingActive = true;
    this.emitter.emit('isRecordingActiveChanged', this.isRecordingActive);
    return Promise.resolve();
  }
  public isConsentRequired = false;
  public isRecordingActive = false;
  public recordings: RecordingInfo[] = [];
  public emitter = new EventEmitter();
  /* @conditional-compile-remove(calling-beta-sdk) */
  public isTeamsConsentRequired = false;
  /* @conditional-compile-remove(calling-beta-sdk) */
  public grantTeamsConsent(): Promise<void> {
    return Promise.resolve();
  }
  on(event: 'isRecordingActiveChanged', listener: PropertyChangedEvent): void;
  on(event: 'recordingsUpdated', listener: CollectionUpdatedEvent<RecordingInfo>): void;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  on(event: any, listener: any): void {
    this.emitter.on(event, listener);
  }
  off(event: 'isRecordingActiveChanged', listener: PropertyChangedEvent): void;
  off(event: 'recordingsUpdated', listener: CollectionUpdatedEvent<RecordingInfo>): void;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  off(event: any, listener: any): void {
    this.emitter.on(event, listener);
  }
  dispose(): void {
    /* No state to clean up */
  }
}

/**
 * @private
 */
export class MockRaiseHandCallFeatureImpl implements RaiseHandCallFeature {
  private raisedHands: RaisedHand[] = [];

  // add a local user to the raised hands list
  raiseHand(): Promise<void> {
    const raisedHands = [{ identifier: { communicationUserId: 'localUserMRI' }, order: 1 } as RaisedHand];
    this.raisedHands = raisedHands;
    this.emitter.emit('raisedHandEvent');
    return Promise.resolve();
  }

  //remove a local user from the raised hands list
  lowerHand(): Promise<void> {
    this.raisedHands = [];
    this.emitter.emit('loweredHandEvent');
    return Promise.resolve();
  }

  lowerHands(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  //remove all users from the raised hands list
  lowerAllHands(): Promise<void> {
    this.raisedHands = [];
    this.emitter.emit('loweredHandEvent');
    return Promise.resolve();
  }
  getRaisedHands(): RaisedHand[] {
    return this.raisedHands;
  }
  public name = 'RaiseHand';
  public emitter = new EventEmitter();
  on(event: 'raisedHandEvent', listener: RaisedHandListener): void;
  on(event: 'loweredHandEvent', listener: RaisedHandListener): void;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  on(event: any, listener: any): void {
    this.emitter.on(event, listener);
  }
  off(event: 'raisedHandEvent', listener: RaisedHandListener): void;
  off(event: 'loweredHandEvent', listener: RaisedHandListener): void;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  off(event: any, listener: any): void {
    this.emitter.on(event, listener);
  }
  dispose(): void {
    /* No state to clean up */
  }
}
/* @conditional-compile-remove(media-access) */
/**
 * @private
 */
export class MockMediaAccessCallFeatureImpl implements MediaAccessCallFeature {
  private mediaAccesses: MediaAccess[] = [];
  public name = 'MediaAccess';
  public emitter = new EventEmitter();

  constructor() {
    this.mediaAccesses = [];
  }
  permitOthersAudio(): Promise<void> {
    return Promise.resolve();
  }
  forbidOthersAudio(): Promise<void> {
    return Promise.resolve();
  }
  forbidOthersVideo(): Promise<void> {
    return Promise.resolve();
  }
  permitOthersVideo(): Promise<void> {
    return Promise.resolve();
  }
  getAllOthersMediaAccess(): MediaAccess[] {
    return this.mediaAccesses;
  }
  getMeetingMediaAccess(): MeetingMediaAccess {
    return {
      isAudioPermitted: true,
      isVideoPermitted: true
    };
  }
  permitAudio(): Promise<void> {
    return Promise.resolve();
  }

  forbidAudio(): Promise<void> {
    return Promise.resolve();
  }

  permitVideo(): Promise<void> {
    return Promise.resolve();
  }

  forbidVideo(): Promise<void> {
    return Promise.resolve();
  }

  permitRemoteParticipantsAudio(): Promise<void> {
    return Promise.resolve();
  }

  forbidRemoteParticipantsAudio(): Promise<void> {
    return Promise.resolve();
  }

  permitRemoteParticipantsVideo(): Promise<void> {
    return Promise.resolve();
  }

  forbidRemoteParticipantsVideo(): Promise<void> {
    return Promise.resolve();
  }

  getRemoteParticipantsMediaAccess(): MediaAccess[] {
    return this.mediaAccesses;
  }

  on(event: 'meetingMediaAccessChanged', listener: MeetingMediaAccessChangedListener): void;
  on(event: 'mediaAccessChanged', listener: MediaAccessChangedListener): void;
  on(event: any, listener: any): void {
    this.emitter.on(event, listener);
  }

  off(event: 'mediaAccessChanged', listener: MediaAccessChangedListener): void;
  off(event: 'meetingMediaAccessChanged', listener: MeetingMediaAccessChangedListener): void;
  off(event: any, listener: any): void {
    this.emitter.off(event, listener);
  }

  dispose(): void {
    /* No state to clean up */
  }
}

/**
 * @private
 */
export class MockTranscriptionCallFeatureImpl implements TranscriptionCallFeature {
  public name = 'Transcription';
  public isTranscriptionActive = false;
  public emitter = new EventEmitter();
  public isConsentRequired = false;
  /* @conditional-compile-remove(calling-beta-sdk) */
  public isTeamsConsentRequired = false;
  /* @conditional-compile-remove(calling-beta-sdk) */
  public grantTeamsConsent(): Promise<void> {
    return Promise.resolve();
  }
  public consentToBeingRecordedAndTranscribed(): Promise<void> {
    this.isTranscriptionActive = true;
    this.emitter.emit('isTranscriptionActiveChanged', this.isTranscriptionActive);
    return Promise.resolve();
  }
  on(event: 'isTranscriptionActiveChanged', listener: PropertyChangedEvent): void {
    this.emitter.on(event, listener);
  }
  off(event: 'isTranscriptionActiveChanged', listener: PropertyChangedEvent): void {
    this.emitter.off(event, listener);
  }
  dispose(): void {
    /* No state to clean up */
  }
}

/**
 * @private
 */
export class StubDiagnosticsCallFeatureImpl implements UserFacingDiagnosticsFeature {
  public name = 'Diagnostics';
  public media = {
    getLatest(): LatestMediaDiagnostics {
      return {};
    },
    on(): void {
      /* Stub to appease types */
    },
    off(): void {
      /* Stub to appease types */
    }
  };
  public network = {
    getLatest(): LatestNetworkDiagnostics {
      return {};
    },
    on(): void {
      /* Stub to appease types */
    },
    off(): void {
      /* Stub to appease types */
    }
  };
  dispose(): void {
    /* No state to clean up */
  }
  /* @conditional-compile-remove(calling-beta-sdk) */
  public remote = {
    getLatest(): RemoteParticipantDiagnosticsData {
      return { diagnostics: [] };
    },
    on(): void {
      /* Stub to appease types */
    },
    off(): void {
      /* Stub to appease types */
    }
  };
}

/**
 * @private
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function addMockEmitter(object: any): any {
  object.emitter = new EventEmitter();
  object.on = (event: any, listener: any): void => {
    object.emitter.on(event, listener);
  };
  object.off = (event: any, listener: any): void => {
    object.emitter.off(event, listener);
  };
  object.emit = (event: any, payload?: any): void => {
    object.emitter.emit(event, payload);
  };
  return object;
}

/**
 * @private
 */
export interface MockCall extends Mutable<Call>, MockEmitter {
  testHelperPushRemoteParticipant(participant: RemoteParticipant): void;
  testHelperPopRemoteParticipant(): RemoteParticipant;
  testHelperPushLocalVideoStream(stream: LocalVideoStream): void;
  testHelperPopLocalVideoStream(): LocalVideoStream;
}

/**
 * @private
 */
export function createMockCall(mockCallId = 'defaultCallID'): MockCall {
  return addMockEmitter({
    id: mockCallId,

    kind: 'Call',
    info: {
      groupId: 'testGroupId'
    },
    remoteParticipants: [] as RemoteParticipant[],
    localVideoStreams: [] as ReadonlyArray<LocalVideoStream>,
    feature: createMockApiFeatures(new Map()),

    testHelperPushRemoteParticipant(participant: RemoteParticipant): void {
      this.remoteParticipants.push(participant);
      this.emit('remoteParticipantsUpdated', { added: [participant], removed: [] });
    },

    testHelperPopRemoteParticipant(): RemoteParticipant {
      const participant = this.remoteParticipants.pop();
      this.emit('remoteParticipantsUpdated', { added: [], removed: [participant] });
      return participant;
    },

    testHelperPushLocalVideoStream(stream: LocalVideoStream): void {
      this.localVideoStreams = [stream];
      this.emit('localVideoStreamsUpdated', { added: [stream], removed: [] });
    },

    testHelperPopLocalVideoStream(): LocalVideoStream {
      const stream = this.localVideoStreams.pop();
      this.emit('localVideoStreamsUpdated', { added: [], removed: [stream] });
      return stream;
    }
  }) as MockCall;
}

/**
 * @private
 */
export interface MockRemoteParticipant extends Mutable<RemoteParticipant> {
  emit(eventName: string | symbol, ...args: any[]): boolean;
  testHelperPushVideoStream(stream: RemoteVideoStream): void;
  testHelperPopVideoStream(): RemoteVideoStream;
}

/**
 * @private
 */
export function createMockRemoteParticipant(
  mockCommunicationUserId = 'defaulRemoteParticipantId'
): MockRemoteParticipant {
  return addMockEmitter({
    identifier: { kind: 'communicationUser', communicationUserId: mockCommunicationUserId },
    videoStreams: [] as ReadonlyArray<RemoteVideoStream>,

    testHelperPushVideoStream(stream: RemoteVideoStream): void {
      this.videoStreams.push(stream);
      this.emit('videoStreamsUpdated', { added: [stream], removed: [] });
    },

    testHelperPopVideoStream(): RemoteVideoStream {
      const stream = this.videoStreams.pop();
      this.emit('videoStreamsUpdated', { added: [], removed: [stream] });
      return stream;
    }
  }) as MockRemoteParticipant;
}

/**
 * @private
 */
export function createMockIncomingCall(mockCallId: string): MockIncomingCall {
  const mockIncomingCall = { id: mockCallId } as MockIncomingCall;
  return addMockEmitter(mockIncomingCall);
}

const createMockVideoEffectsAPI = (): VideoEffectsFeature =>
  addMockEmitter({
    activeEffects: ['MockVideoEffect'],
    startEffects: () => Promise.resolve(),
    stopEffects: () => Promise.resolve(),
    dispose: () => Promise.resolve()
  });

/** @private */
export const createMockLocalVideoStream = (): LocalVideoStream =>
  ({
    source: {
      id: 'mockVideoDeviceSourceId',
      name: 'mockVideoDeviceSourceName',
      deviceType: 'Unknown'
    },
    mediaStreamType: 'Video',
    switchSource: Promise.resolve,

    feature: () => createMockVideoEffectsAPI()
  }) as unknown as LocalVideoStream;

/**
 * @private
 */
export function createMockRemoteVideoStream(id = 42): MockRemoteVideoStream {
  return addMockEmitter({ id, mediaStreamType: 'Video' }) as MockRemoteVideoStream;
}

/**
 * @private
 */
export function createMockRemoteScreenshareStream(id = 42): MockRemoteVideoStream {
  return addMockEmitter({ id, mediaStreamType: 'ScreenSharing' }) as MockRemoteVideoStream;
}

/**
 *
 * @private
 *
 * Creates a function equivalent to Call.api. The api() generated will use the passed in cache to return the feature
 * objects as defined in the cache. For any undefined feature not in cache, it will return a generic object. Containing
 * properties of all features. Note that this generic object is instanciated every call whereas the cache objects are
 * reused on repeated calls.
 */
export function createMockApiFeatures(
  cache: Map<CallFeatureFactory<any>, CallFeature>
): <FeatureT extends CallFeature>(cls: CallFeatureFactory<FeatureT>) => FeatureT {
  return <FeatureT extends CallFeature>(cls: CallFeatureFactory<FeatureT>): FeatureT => {
    for (const [key, feature] of cache.entries()) {
      if (cls && key && key.callApiCtor === cls.callApiCtor) {
        return feature as FeatureT;
      }
    }

    // Default one if none provided
    const generic = addMockEmitter({
      ...new StubDiagnosticsCallFeatureImpl(),
      name: 'Default',
      isRecordingActive: false,
      isTranscriptionActive: false,
      /* @conditional-compile-remove(media-access) */
      getAllOthersMediaAccess: () => [],
      /* @conditional-compile-remove(media-access) */
      getMeetingMediaAccess: () => ({ isAudioPermitted: true, isVideoPermitted: true })
    });
    return generic;
  };
}

function waitMilliseconds(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const BREAK_CONDITION_TIMEOUT_MILLESEC = 4000;
/**
 *
 * @private
 * This will wait for up to 4 seconds and break when the given breakCondition is true. The reason for four seconds is
 * that by default the jest timeout for waiting for test is 5 seconds so ideally we want to break this and fail then
 * fail some expects check before the 5 seconds otherwise you'll just get a cryptic 'jest timeout error'.
 */
export async function waitWithBreakCondition(breakCondition: () => boolean): Promise<boolean> {
  const start = new Date();
  for (let now = new Date(); +now - +start < BREAK_CONDITION_TIMEOUT_MILLESEC; now = new Date()) {
    if (breakCondition()) {
      return true;
    }
    await waitMilliseconds(10);
  }
  return false;
}

/**
 * @private
 */
export const createMockCallClient = (callAgent?: CallAgent, deviceManager?: DeviceManager): CallClient => {
  return {
    getDeviceManager: (): Promise<DeviceManager> => {
      if (!deviceManager) {
        throw new Error('deviceManager not set');
      }
      return Promise.resolve(deviceManager);
    },
    createCallAgent: (): Promise<CallAgent> => {
      if (!callAgent) {
        throw new Error('callAgent not set');
      }
      return Promise.resolve(callAgent);
    },
    feature: () => ({
      getEnvironmentInfo: () =>
        Promise.resolve({
          environment: {
            platform: 'mockPlatform',
            browser: 'mockBrowser',
            browserVersion: 'mockBrowserVersion'
          },
          isSupportedPlatform: true,
          isSupportedBrowser: true,
          isSupportedBrowserVersion: true,
          isSupportedEnvironment: true
        })
    })
  } as unknown as CallClient;
};

/**
 * @private
 */
export interface MockCallAgent extends Mutable<CallAgent>, MockEmitter {
  /**
   * Add given call to calls and trigger an event to notify clients.
   */
  testHelperPushCall(call: Call): void;
  testHelperPopCall(): void;
}

/**
 * @private
 */
export const createMockCallAgent = (displayName = 'defaultDisplayName'): MockCallAgent => {
  return addMockEmitter({
    calls: [] as Call[],
    displayName: displayName,

    kind: 'CallAgent',

    testHelperPushCall(call: Call): void {
      this.calls.push(call);
      this.emit('callsUpdated', {
        added: [call],
        removed: []
      });
    },

    testHelperPopCall(): void {
      const call = this.calls.pop();
      this.emit('callsUpdated', {
        added: [],
        removed: [call]
      });
    }
  }) as MockCallAgent;
};

/**
 * @private
 */
export class StateChangeListener {
  state: CallClientState;
  onChangeCalledCount = 0;

  constructor(client: StatefulCallClient) {
    this.state = client.getState();
    client.onStateChange(this.onChange.bind(this));
  }

  private onChange(newState: CallClientState): void {
    this.onChangeCalledCount++;
    this.state = newState;
  }
}

/**
 * @private
 */
export const createStatefulCallClientWithAgent = (agent: CallAgent): StatefulCallClient => {
  return createStatefulCallClientWithBaseClient(createMockCallClient(agent));
};

/**
 * @private
 */
export const createStatefulCallClientWithBaseClient = (client: CallClient): StatefulCallClient => {
  return createStatefulCallClientWithDeps(
    client,
    new CallContext({ kind: 'communicationUser', communicationUserId: 'defaultUserId' }),
    new InternalCallContext()
  );
};
