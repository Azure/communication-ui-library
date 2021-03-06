// © Microsoft Corporation. All rights reserved.
import EventEmitter from 'events';
import { Call, CallAgent, CallClient, RemoteParticipant } from '@azure/communication-calling';
import { callClientDeclaratify } from './CallClientDeclarative';
import { AzureCommunicationUserCredential } from '@azure/communication-common';

interface MockEmitter {
  emitter: EventEmitter;
  on(event: any, listener: any);
  off(event: any, listener: any);
  emit(event: any, data: any);
}

type MockCallAgent = CallAgent & MockEmitter;
type MockCall = Call & MockEmitter;
type MockRemoteParticipant = RemoteParticipant & MockEmitter;

function addMockEmitter(object: any): any {
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

function createMockCallAgent(): MockCallAgent {
  const mockCallAgent = {} as MockCallAgent;
  Object.defineProperty(mockCallAgent, 'calls', { value: [], configurable: true });
  return addMockEmitter(mockCallAgent);
}

function createMockCall(): MockCall {
  const mockCall = {} as MockCall;
  Object.defineProperty(mockCall, 'remoteParticipants', { value: [], configurable: true });
  return addMockEmitter(mockCall);
}

function createMockRemoteParticipant(): MockRemoteParticipant {
  const mockRemoteParticipant = {} as MockRemoteParticipant;
  return addMockEmitter(mockRemoteParticipant);
}

function waitMilliseconds(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

async function waitWithBreakCondition(breakCondition: () => boolean): Promise<void> {
  for (let i = 0; i < 100; i++) {
    await waitMilliseconds(100);
    if (breakCondition()) {
      break;
    }
  }
}

jest.mock('@azure/communication-common');
jest.mock('@azure/communication-calling');

describe('declarative call client', () => {
  test('declarative should correctly subscribe and unsubcribe to events and update state on events', async () => {
    // 1. Create mock objects and declarative call client
    const mockCallClient = new CallClient();
    const mockCallAgent = createMockCallAgent();
    mockCallClient.createCallAgent = (): Promise<CallAgent> => {
      return Promise.resolve(mockCallAgent);
    };
    const declarativeCallClient = callClientDeclaratify(mockCallClient);
    expect(declarativeCallClient.state.calls.length).toBe(0);

    // 2. Call createCallAgent, subscribe to callsUpdated event, create new call.
    await declarativeCallClient.createCallAgent(new AzureCommunicationUserCredential(''));
    const mockCall = createMockCall();
    mockCallAgent.calls.push(mockCall);

    // 3. Emit callsUpdated event from callAgent and check declarative client for updated state
    mockCallAgent.emit('callsUpdated', {
      added: [mockCall],
      removed: []
    });
    await waitWithBreakCondition(() => declarativeCallClient.state.calls.length !== 0);
    expect(declarativeCallClient.state.calls.length).toBe(1);

    // 4. Add remote participant, emit ParticipantsUpdated event, and check declarative client for updated state
    const mockRemoteParticipant = createMockRemoteParticipant();
    mockCall.remoteParticipants.push(mockRemoteParticipant);
    mockCall.emit('remoteParticipantsUpdated', {
      added: [mockRemoteParticipant],
      removed: []
    });
    await waitWithBreakCondition(() => declarativeCallClient.state.calls[0].remoteParticipants.length !== 0);
    expect(declarativeCallClient.state.calls[0].remoteParticipants.length).toBe(1);

    // 5. Remove call, check that all listeners are unsubscribed, and check declarative client for updated state
    Object.defineProperty(mockCallAgent, 'calls', { value: [], configurable: true });
    mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [mockCall]
    });
    await waitWithBreakCondition(() => declarativeCallClient.state.calls.length === 0);
    expect(mockCall.emitter.eventNames().length).toBe(0);
    expect(mockRemoteParticipant.emitter.eventNames().length).toBe(0);
    expect(declarativeCallClient.state.calls.length).toBe(0);
  });
});
