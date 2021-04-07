// © Microsoft Corporation. All rights reserved.
import { Call, CallAgent, CallClient, LocalVideoStream } from '@azure/communication-calling';
import { callClientDeclaratify, DeclarativeCallClient } from './CallClientDeclarative';
import { getRemoteParticipantKey } from './Converter';
import {
  addMockEmitter,
  createMockCall,
  createMockRemoteParticipant,
  createMockRemoteVideoStream,
  MockCall,
  MockCallAgent,
  MockCommunicationUserCredential,
  mockoutObjectFreeze,
  MockRemoteParticipant
} from './TestUtils';

mockoutObjectFreeze();

jest.mock('@azure/communication-calling');

const mockCallId = 'a';
const mockCallId2 = 'b';
const mockParticipantCommunicationUserId = 'c';

interface TestData {
  mockCallClient: any;
  mockCallAgent: MockCallAgent;
  mockCall: MockCall;
  mockRemoteParticipant: MockRemoteParticipant;
  declarativeCallClient: DeclarativeCallClient;
}

function createClientAndAgentMocks(testData: TestData): void {
  const mockCallClient = new CallClient();
  const mockCallAgent = { calls: [] as ReadonlyArray<Call> } as MockCallAgent;
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
  testData.mockCall = createMockCall(mockCallId);
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
  testData.mockRemoteParticipant = createMockRemoteParticipant(mockParticipantCommunicationUserId);
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

/**
 * This will wait for up to 4 seconds and break when the given breakCondition is true. The reason for four seconds is
 * that by default the jest timeout for waiting for test is 5 seconds so ideally we want to break this and fail then
 * fail some expects check before the 5 seconds otherwise you'll just get a cryptic 'jest timeout error'.
 *
 * @param breakCondition
 */
async function waitWithBreakCondition(breakCondition: () => boolean): Promise<void> {
  for (let i = 0; i < 40; i++) {
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

    const mockRemoteVideoStream = createMockRemoteVideoStream(false);
    testData.mockRemoteParticipant.videoStreams = [mockRemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
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

    const mockRemoteVideoStream = createMockRemoteVideoStream(false);
    testData.mockRemoteParticipant.videoStreams = [mockRemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
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
      removed: [mockRemoteVideoStream]
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

  test('should update state when remote video stream emits `isAvailableChanged`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    const mockRemoteVideoStream = createMockRemoteVideoStream(false);
    testData.mockRemoteParticipant.videoStreams = [mockRemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
      removed: []
    });

    const participantKey = getRemoteParticipantKey(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.videoStreams
          .length !== 0
    );

    mockRemoteVideoStream.isAvailable = true;
    mockRemoteVideoStream.emit('isAvailableChanged');

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)
          ?.videoStreams[0].isAvailable === true
    );
    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)
        ?.videoStreams[0].isAvailable
    ).toBe(true);
  });
});
