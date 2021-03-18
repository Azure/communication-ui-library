// © Microsoft Corporation. All rights reserved.
import EventEmitter from 'events';
import {
  Call,
  CallAgent,
  CallClient,
  LocalVideoStream,
  RemoteParticipant,
  RemoteVideoStream
} from '@azure/communication-calling';
import { callClientDeclaratify, DeclarativeCallClient } from './CallClientDeclarative';
import { getRemoteParticipantKey } from './Converter';

let backupFreezeFunction;
beforeEach(() => {
  backupFreezeFunction = Object.freeze;
  Object.freeze = function (obj) {
    return obj;
  };
});

afterEach(() => {
  Object.freeze = backupFreezeFunction;
});

jest.mock('@azure/communication-calling');

interface MockEmitter {
  emitter: EventEmitter;
  on(event: any, listener: any);
  off(event: any, listener: any);
  emit(event: any, data?: any);
}

type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};
type MockCall = Mutable<Call> & MockEmitter;
type MockCallAgent = Mutable<CallAgent> & MockEmitter;
type MockRemoteParticipant = Mutable<RemoteParticipant> & MockEmitter;

class MockCommunicationUserCredential {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public getToken(): any {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public dispose(): void {}
}

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

interface TestData {
  mockCallClient: any;
  mockCallAgent: MockCallAgent;
  mockCall: MockCall;
  mockRemoteParticipant: MockRemoteParticipant;
  declarativeCallClient: DeclarativeCallClient;
}

const mockCallId = 'a';
const mockCallId2 = 'b';

function createMockCall(testData: TestData): void {
  const mockCall = {
    id: mockCallId,
    remoteParticipants: [] as ReadonlyArray<RemoteParticipant>,
    localVideoStreams: [] as ReadonlyArray<LocalVideoStream>
  } as MockCall;
  testData.mockCall = addMockEmitter(mockCall);
}

function createMockRemoteParticipant(testData: TestData): void {
  const mockRemoteParticipant = {
    identifier: { kind: 'communicationUser', communicationUserId: 'a' },
    videoStreams: [] as ReadonlyArray<RemoteVideoStream>
  } as MockRemoteParticipant;
  testData.mockRemoteParticipant = addMockEmitter(mockRemoteParticipant);
}

function createClientAndAgentMocks(testData: TestData): void {
  const mockCallClient = new CallClient();
  const mockCallAgent = {} as MockCallAgent;
  addMockEmitter(mockCallAgent);
  mockCallClient.createCallAgent = (): Promise<CallAgent> => {
    return Promise.resolve(mockCallAgent);
  };
  testData.mockCallClient = mockCallClient;
  testData.mockCallAgent = mockCallAgent;
}

function createDeclarativeClient(testData: TestData): void {
  testData.declarativeCallClient = callClientDeclaratify(testData.mockCallClient);
}

async function createMockCallAndEmitCallsUpdated(testData: TestData, waitCondition?: () => boolean): Promise<void> {
  await testData.declarativeCallClient.createCallAgent(new MockCommunicationUserCredential());
  createMockCall(testData);
  testData.mockCallAgent.calls = [testData.mockCall];
  testData.mockCallAgent.emit('callsUpdated', {
    added: [testData.mockCall],
    removed: []
  });
  await waitWithBreakCondition(
    waitCondition ? waitCondition : () => testData.declarativeCallClient.state.calls.size !== 0
  );
}

async function createMockParticipantAndEmitParticipantUpdated(
  testData: TestData,
  waitCondition?: () => boolean
): Promise<void> {
  createMockRemoteParticipant(testData);
  testData.mockCall.remoteParticipants = [testData.mockRemoteParticipant];
  testData.mockCall.emit('remoteParticipantsUpdated', {
    added: [testData.mockRemoteParticipant],
    removed: []
  });

  await waitWithBreakCondition(
    waitCondition
      ? waitCondition
      : () => testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.size !== 0
  );
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

describe('declarative call client', () => {
  test('should update state when call added in `callUpdated` event and subscribe to call', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    expect(testData.declarativeCallClient.state.calls.size).toBe(0);
    await createMockCallAndEmitCallsUpdated(testData);
    expect(testData.declarativeCallClient.state.calls.size).toBe(1);
    expect(testData.mockCall.emitter.eventNames().length).not.toBe(0);
  });

  test('should update state when call removed in `callUpdated` event and unsubscribe to call', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);

    testData.mockCallAgent.calls = [];
    testData.mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [testData.mockCall]
    });

    await waitWithBreakCondition(() => testData.declarativeCallClient.state.calls.size === 0);
    expect(testData.mockCall.emitter.eventNames().length).toBe(0);
  });

  test('should update state when call `stateChanged` event', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);

    testData.mockCall.state = 'InLobby';
    testData.mockCall.emit('stateChanged');

    await waitWithBreakCondition(() => testData.declarativeCallClient.state.calls.get(mockCallId)?.state === 'InLobby');
    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.state === 'InLobby').toBe(true);
  });

  test('should update state when call `idChanged` event and update participantListeners', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    testData.mockCall.id = mockCallId2;
    testData.mockCall.emit('idChanged');

    await waitWithBreakCondition(() => {
      return testData.declarativeCallClient.state.calls.get(mockCallId2) !== undefined;
    });
    expect(testData.declarativeCallClient.state.calls.get(mockCallId)).toBe(undefined);
    expect(testData.declarativeCallClient.state.calls.get(mockCallId2)).not.toBe(undefined);

    testData.mockRemoteParticipant.displayName = 'a';
    testData.mockRemoteParticipant.emit('displayNameChanged');

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId2)
          ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))?.displayName !==
        undefined
    );
    expect(
      testData.declarativeCallClient.state.calls
        .get(mockCallId2)
        ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))?.displayName
    ).toBe('a');
  });

  test('should update state when call `isScreenSharingOnChanged` event', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);

    const oldIsScreenSharingOn = testData.mockCall.isScreenSharingOn;
    testData.mockCall.isScreenSharingOn = !oldIsScreenSharingOn;
    testData.mockCall.emit('isScreenSharingOnChanged');

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.isScreenSharingOn === !oldIsScreenSharingOn
    );
    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.isScreenSharingOn).toBe(!oldIsScreenSharingOn);
  });

  test('should update state when call added local video `localVideoStreamsUpdated` event', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);

    testData.mockCall.localVideoStreams = [{} as LocalVideoStream];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [{} as LocalVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams.length !== 0
    );
    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams.length).toBe(1);
  });

  test('should update state when call remove local video `localVideoStreamsUpdated` event', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);

    testData.mockCall.localVideoStreams = [{} as LocalVideoStream];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [{} as LocalVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams.length !== 0
    );

    testData.mockCall.localVideoStreams = [];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [],
      removed: [{} as LocalVideoStream]
    });
    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams.length).toBe(0);
  });

  test('should update state when participant added in `remoteParticipantsUpdated` and subscribe to it', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);
    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.size).toBe(1);
    expect(testData.mockRemoteParticipant.emitter.eventNames().length).not.toBe(0);
  });

  test('should update state when participant removed in `remoteParticipantsUpdated` and unsubscribe toit', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    testData.mockCall.remoteParticipants = [];
    testData.mockCall.emit('remoteParticipantsUpdated', {
      added: [],
      removed: [testData.mockRemoteParticipant]
    });

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.size === 0
    );
    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.size).toBe(0);
    expect(testData.mockRemoteParticipant.emitter.eventNames().length).toBe(0);
  });

  test('should update state when participant `stateChanged`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    testData.mockRemoteParticipant.state = 'Idle';
    testData.mockRemoteParticipant.emit('stateChanged');

    const participantKey = getRemoteParticipantKey(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.state ===
        'Idle'
    );
    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.state
    ).toBe('Idle');
  });

  test('should update state when participant `isMutedChanged`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    const oldIsMuted = testData.mockRemoteParticipant.isMuted;
    testData.mockRemoteParticipant.isMuted = !oldIsMuted;
    testData.mockRemoteParticipant.emit('isMutedChanged');

    const participantKey = getRemoteParticipantKey(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.isMuted ===
        !oldIsMuted
    );
    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.isMuted
    ).toBe(!oldIsMuted);
  });

  test('should update state when participant `displayNameChanged`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    testData.mockRemoteParticipant.displayName = 'z';
    testData.mockRemoteParticipant.emit('displayNameChanged');

    const participantKey = getRemoteParticipantKey(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)
          ?.displayName === 'z'
    );
    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.displayName
    ).toBe('z');
  });

  test('should update state when participant `isSpeakingChanged`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    const oldIsSpeaking = testData.mockRemoteParticipant.isSpeaking;
    testData.mockRemoteParticipant.isSpeaking = !oldIsSpeaking;
    testData.mockRemoteParticipant.emit('isSpeakingChanged');

    const participantKey = getRemoteParticipantKey(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)
          ?.isSpeaking === !oldIsSpeaking
    );
    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.isSpeaking
    ).toBe(!oldIsSpeaking);
  });

  test('should update state when participant added remote video `videoStreamsUpdated`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    testData.mockRemoteParticipant.videoStreams = [{} as RemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [{} as RemoteVideoStream],
      removed: []
    });

    const participantKey = getRemoteParticipantKey(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.videoStreams
          .length !== 0
    );
    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.videoStreams
        .length
    ).toBe(1);
  });

  test('should update state when participant removed remote video `videoStreamsUpdated`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    testData.mockRemoteParticipant.videoStreams = [{} as RemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [{} as RemoteVideoStream],
      removed: []
    });

    const participantKey = getRemoteParticipantKey(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.videoStreams
          .length !== 0
    );

    testData.mockRemoteParticipant.videoStreams = [];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [],
      removed: [{} as RemoteVideoStream]
    });

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.videoStreams
          .length === 0
    );
    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.videoStreams
        .length
    ).toBe(0);
  });

  /*
  test('declarative should correctly subscribe and unsubcribe to events and update state on events', async () => {
    // 1. Create mock objects and declarative call client
    const { mockCallClient, mockCallAgent } = createClientAndAgentMocks();
    const declarativeCallClient = callClientDeclaratify(mockCallClient);
    expect(declarativeCallClient.state.calls.size).toBe(0);

    // 2. Call createCallAgent, subscribe to callsUpdated event, create new call.
    await declarativeCallClient.createCallAgent(new MockCommunicationUserCredential());
    let mockCall: MockCall = createMockCall();
    mockCallAgent.calls = [mockCall];

    // 3. Emit callsUpdated event from callAgent and check declarative client for updated state
    mockCallAgent.emit('callsUpdated', {
      added: [mockCall],
      removed: []
    });
    await waitWithBreakCondition(() => declarativeCallClient.state.calls.size !== 0);
    expect(declarativeCallClient.state.calls.size).toBe(1);

    // 4. Add remote participant, emit ParticipantsUpdated event, and check declarative client for updated state
    const mockRemoteParticipant = createMockRemoteParticipant();
    // Note the reason to re-create mock call and reset it in mockCallAgent is that after it is set in callAgent the
    // first time, it somehow makes mockCall readonly and cannot then it cannot be mutated afterwards so we'll have to
    // remove the previous call, re-create mock call, add the participant, then re-trigger the events.
    mockCallAgent.calls = [];
    mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [mockCall]
    });
    await waitWithBreakCondition(() => declarativeCallClient.state.calls.size === 0);
    mockCall = createMockCall();
    mockCall.remoteParticipants = [mockRemoteParticipant];
    mockCallAgent.calls = [mockCall];
    mockCallAgent.emit('callsUpdated', {
      added: [mockCall],
      removed: []
    });
    await waitWithBreakCondition(() => declarativeCallClient.state.calls.size !== 0);
    mockCall.emit('remoteParticipantsUpdated', {
      added: [mockRemoteParticipant],
      removed: []
    });
    await waitWithBreakCondition(
      () => declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.size !== 0
    );
    expect(declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.size).toBe(1);

    // 5. Remove call, check that all listeners are unsubscribed, and check declarative client for updated state
    mockCallAgent.calls = [];
    mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [mockCall]
    });
    await waitWithBreakCondition(() => declarativeCallClient.state.calls.size === 0);
    expect(mockCall.emitter.eventNames().length).toBe(0);
    expect(mockRemoteParticipant.emitter.eventNames().length).toBe(0);
    expect(declarativeCallClient.state.calls.size).toBe(0);
  });
  */
});
