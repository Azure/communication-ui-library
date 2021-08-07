// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Call,
  CallAgent,
  CallApiFeature,
  CallClient,
  CallFeatureFactoryType,
  DeviceManager,
  IncomingCall,
  LocalVideoStream,
  PropertyChangedEvent,
  RecordingCallFeature,
  RemoteParticipant,
  RemoteVideoStream,
  TranscriptionCallFeature,
  Transfer,
  TransferCallFeature,
  TransferRequestedEvent,
  TransferToParticipant,
  TransferToParticipantOptions
} from '@azure/communication-calling';
import { CommunicationTokenCredential } from '@azure/communication-common';
import { AccessToken } from '@azure/core-auth';

import EventEmitter from 'events';
import { CallClientState } from './CallClientState';
import { CallContext } from './CallContext';
import { InternalCallContext } from './InternalCallContext';
import { createStatefulCallClientWithDeps, StatefulCallClient } from './StatefulCallClient';

let backupFreezeFunction;

export function mockoutObjectFreeze(): void {
  beforeEach(() => {
    backupFreezeFunction = Object.freeze;
    Object.freeze = function (obj) {
      return obj;
    };
  });

  afterEach(() => {
    Object.freeze = backupFreezeFunction;
  });
}

export interface MockEmitter {
  // [xkcd]: Remove
  emitter: EventEmitter;
  // [xkcd]: Remove
  on(event: any, listener: any);
  // [xkcd]: Remove
  off(event: any, listener: any);
  emit(event: any, data?: any);
}

type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};
export type MockCall = Mutable<Call> & MockEmitter;

export type MockRemoteParticipant = Mutable<RemoteParticipant> & MockEmitter;
export type MockRemoteVideoStream = Mutable<RemoteVideoStream> & MockEmitter;
export type MockIncomingCall = Mutable<IncomingCall> & MockEmitter;

// [xkcd]: Delete
export class MockCommunicationUserCredential {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public getToken(): any {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public dispose(): void {}
}

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

export class MockRecordingCallFeatureImpl implements RecordingCallFeature {
  public name = 'Recording';
  public isRecordingActive = false;
  public emitter = new EventEmitter();
  on(event: 'isRecordingActiveChanged', listener: PropertyChangedEvent): void {
    this.emitter.on(event, listener);
  }
  off(event: 'isRecordingActiveChanged', listener: PropertyChangedEvent): void {
    this.emitter.off(event, listener);
  }
}

export class MockTransferCallFeatureImpl implements TransferCallFeature {
  public name = 'Transfer';
  public emitter = new EventEmitter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transfer(target: TransferToParticipant, transferOptions?: TransferToParticipantOptions): Transfer {
    throw new Error('Method not implemented.');
  }
  on(event: 'transferRequested', listener: TransferRequestedEvent): void {
    this.emitter.on(event, listener);
  }
  off(event: 'transferRequested', listener: TransferRequestedEvent): void {
    this.emitter.off(event, listener);
  }
}

export class MockTranscriptionCallFeatureImpl implements TranscriptionCallFeature {
  public name = 'Transcription';
  public isTranscriptionActive = false;
  public emitter = new EventEmitter();
  on(event: 'isTranscriptionActiveChanged', listener: PropertyChangedEvent): void {
    this.emitter.on(event, listener);
  }
  off(event: 'isTranscriptionActiveChanged', listener: PropertyChangedEvent): void {
    this.emitter.off(event, listener);
  }
}

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

export function createMockCall(mockCallId: string = 'defaultCallID'): MockCall {
  const mockCall = {
    id: mockCallId,
    remoteParticipants: [] as ReadonlyArray<RemoteParticipant>,
    localVideoStreams: [] as ReadonlyArray<LocalVideoStream>,
    api: createMockApiFeatures(new Map())
  } as MockCall;
  return addMockEmitter(mockCall);
}

export function createMockRemoteParticipant(mockCommunicationUserId: string): MockRemoteParticipant {
  const mockRemoteParticipant = {
    identifier: { kind: 'communicationUser', communicationUserId: mockCommunicationUserId },
    videoStreams: [] as ReadonlyArray<RemoteVideoStream>
  } as MockRemoteParticipant;
  return addMockEmitter(mockRemoteParticipant);
}

export function createMockIncomingCall(mockCallId: string): MockIncomingCall {
  const mockIncomingCall = { id: mockCallId } as MockIncomingCall;
  return addMockEmitter(mockIncomingCall);
}

export function createMockRemoteVideoStream(mockIsAvailable: boolean): MockRemoteVideoStream {
  const mockRemoteVideoStream = { isAvailable: mockIsAvailable } as MockRemoteVideoStream;
  return addMockEmitter(mockRemoteVideoStream);
}

/**
 * Creates a function equivalent to Call.api. The api() generated will use the passed in cache to return the feature
 * objects as defined in the cache. For any undefined feature not in cache, it will return a generic object. Containing
 * properties of all features. Note that this generic object is instanciated every call whereas the cache objects are
 * reused on repeated calls.
 *
 * @param cache
 * @returns
 */
export function createMockApiFeatures(
  cache: Map<CallFeatureFactoryType<any>, CallApiFeature>
): <FeatureT extends CallApiFeature>(cls: CallFeatureFactoryType<FeatureT>) => FeatureT {
  return <FeatureT extends CallApiFeature>(cls: CallFeatureFactoryType<FeatureT>): FeatureT => {
    const feature = cache.get(cls);
    if (feature) {
      return feature as FeatureT;
    } else {
      // Default one if none provided
      const generic = addMockEmitter({
        name: 'Default',
        isRecordingActive: false,
        isTranscriptionActive: false,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        transfer(target: TransferToParticipant, transferOptions?: TransferToParticipantOptions): Transfer {
          return addMockEmitter({ state: 'None' });
        }
      });
      return generic;
    }
  };
}

function waitMilliseconds(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

/**
 * This will wait for up to 4 seconds and break when the given breakCondition is true. The reason for four seconds is
 * that by default the jest timeout for waiting for test is 5 seconds so ideally we want to break this and fail then
 * fail some expects check before the 5 seconds otherwise you'll just get a cryptic 'jest timeout error'.
 *
 * @param breakCondition
 */
export async function waitWithBreakCondition(breakCondition: () => boolean): Promise<boolean> {
  for (let i = 0; i < 40; i++) {
    await waitMilliseconds(100);
    if (breakCondition()) {
      return true;
    }
  }
  return false;
}

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
    }
  } as unknown as CallClient;
};

// [xkcd] drop Mutable?
export interface MockCallAgent extends Mutable<CallAgent> {
  // [xkcd] drop
  emit(event: any, data?: any);

  /**
   * Add given call to calls and trigger an event to notify clients.
   */
  testHelperPushCall(call: Call): void;
  testHelperPopCall(): void;
}

export const createMockCallAgent = (displayName: string = 'defaultDisplayName'): MockCallAgent => {
  return addMockEmitter({
    calls: [] as Call[],
    displayName: displayName,
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

export const createStatefulCallClientWithAgent = (agent: CallAgent): StatefulCallClient => {
  return createStatefulCallClientWithDeps(
    createMockCallClient(agent),
    new CallContext({ kind: 'communicationUser', communicationUserId: 'defaultUserId' }),
    new InternalCallContext()
  );
};
