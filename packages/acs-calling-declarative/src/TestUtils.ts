// © Microsoft Corporation. All rights reserved.
import {
  Call,
  CallAgent,
  IncomingCall,
  LocalVideoStream,
  RemoteParticipant,
  RemoteVideoStream
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

export function addMockEmitter(
  object: MockCall | MockCallAgent | MockRemoteParticipant | MockRemoteVideoStream | MockIncomingCall
): any {
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
    localVideoStreams: [] as ReadonlyArray<LocalVideoStream>
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
