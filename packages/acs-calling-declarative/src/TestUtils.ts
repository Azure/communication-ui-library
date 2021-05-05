// © Microsoft Corporation. All rights reserved.
import {
  Call,
  CallAgent,
  CallApiFeature,
  CallFeatureFactoryType,
  Features,
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
import EventEmitter from 'events';

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
  emitter: EventEmitter;
  on(event: any, listener: any);
  off(event: any, listener: any);
  emit(event: any, data?: any);
}

type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};
export type MockCall = Mutable<Call> & MockEmitter;
export type MockCallAgent = Mutable<CallAgent> & MockEmitter;
export type MockRemoteParticipant = Mutable<RemoteParticipant> & MockEmitter;
export type MockRemoteVideoStream = Mutable<RemoteVideoStream> & MockEmitter;
export type MockIncomingCall = Mutable<IncomingCall> & MockEmitter;

export class MockCommunicationUserCredential {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public getToken(): any {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public dispose(): void {}
}

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

export function createMockCall(mockCallId: string): MockCall {
  const mockCall = {
    id: mockCallId,
    remoteParticipants: [] as ReadonlyArray<RemoteParticipant>,
    localVideoStreams: [] as ReadonlyArray<LocalVideoStream>,
    api: createMockApiFeatures(false, new Map<string, any>())
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

export const MOCK_RECORDING_NAME = 'Recording';

/**
 * Create a mockApiFeatures function see {@Link @azure/communication-calling#Call.api}. If cache is passed in, will try
 * to return existing cached TFeatures else create new TFeature, cache it, and then return it.
 *
 * @param isRecording
 * @param cache
 * @returns
 */
export function createMockApiFeatures(
  isRecording: boolean,
  cache: Map<string, any>
): <FeatureT extends CallApiFeature>(cls: CallFeatureFactoryType<FeatureT>) => FeatureT {
  return <FeatureT extends CallApiFeature>(cls: CallFeatureFactoryType<FeatureT>): FeatureT => {
    if (typeof cls === typeof Features.Recording) {
      if (cache.has(MOCK_RECORDING_NAME)) {
        return cache.get(MOCK_RECORDING_NAME);
      }
      const recording = addMockEmitter({
        isRecordingActive: isRecording
      });
      cache.set(MOCK_RECORDING_NAME, recording);
      return recording;
    } else {
      throw new Error('Not implemented');
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
export async function waitWithBreakCondition(breakCondition: () => boolean): Promise<void> {
  for (let i = 0; i < 40; i++) {
    await waitMilliseconds(100);
    if (breakCondition()) {
      break;
    }
  }
}
