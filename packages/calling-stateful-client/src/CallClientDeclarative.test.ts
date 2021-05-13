// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Call,
  CallAgent,
  CallClient,
  CallFeatureFactoryType,
  CreateViewOptions,
  Features,
  LocalVideoStream,
  RecordingCallFeature,
  RemoteVideoStream,
  TranscriptionCallFeature,
  TransferCallFeature,
  VideoDeviceInfo,
  VideoStreamRendererView
} from '@azure/communication-calling';
import { callClientDeclaratify, DeclarativeCallClient } from './CallClientDeclarative';
import { getRemoteParticipantKey } from './Converter';
import {
  addMockEmitter,
  createMockApiFeatures,
  createMockCall,
  createMockRemoteParticipant,
  createMockRemoteVideoStream,
  MockCall,
  MockCallAgent,
  MockCommunicationUserCredential,
  mockoutObjectFreeze,
  MockRecordingCallFeatureImpl,
  MockRemoteParticipant,
  MockTranscriptionCallFeatureImpl,
  MockTransferCallFeatureImpl
} from './TestUtils';

mockoutObjectFreeze();

jest.mock('@azure/communication-calling', () => {
  return {
    CallClient: jest.fn().mockImplementation(() => {
      return {};
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    VideoStreamRenderer: jest.fn().mockImplementation((videoStream: LocalVideoStream | RemoteVideoStream) => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        createView: (options?: CreateViewOptions) => {
          return Promise.resolve<VideoStreamRendererView>({} as VideoStreamRendererView);
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        dispose: () => {}
      };
    }),
    Features: {
      get Recording(): CallFeatureFactoryType<RecordingCallFeature> {
        return MockRecordingCallFeatureImpl;
      },
      get Transfer(): CallFeatureFactoryType<TransferCallFeature> {
        return MockTransferCallFeatureImpl;
      },
      get Transcription(): CallFeatureFactoryType<TranscriptionCallFeature> {
        return MockTranscriptionCallFeatureImpl;
      }
    }
  };
});

const mockCallId = 'a';
const mockCallId2 = 'b';
const mockParticipantCommunicationUserId = 'c';
const mockDisplayName = 'd';
const mockUserId = 'e';

interface TestData {
  mockCallClient: any;
  mockCallAgent: MockCallAgent;
  mockCall: MockCall;
  mockRemoteParticipant: MockRemoteParticipant;
  declarativeCallClient: DeclarativeCallClient;
}

function createClientAndAgentMocks(testData: TestData): void {
  const mockCallClient = new CallClient();
  const mockCallAgent = { calls: [] as ReadonlyArray<Call>, displayName: mockDisplayName } as MockCallAgent;
  addMockEmitter(mockCallAgent);
  mockCallClient.createCallAgent = (): Promise<CallAgent> => {
    return Promise.resolve(mockCallAgent);
  };
  testData.mockCallClient = mockCallClient;
  testData.mockCallAgent = mockCallAgent;
}

function createDeclarativeClient(testData: TestData): void {
  testData.declarativeCallClient = callClientDeclaratify(testData.mockCallClient, '');
}

async function createMockCallAndEmitCallsUpdated(
  testData: TestData,
  waitCondition?: () => boolean,
  mockCall?: MockCall
): Promise<void> {
  await testData.declarativeCallClient.createCallAgent(new MockCommunicationUserCredential());
  if (mockCall) {
    testData.mockCall = mockCall;
  } else {
    testData.mockCall = createMockCall(mockCallId);
  }
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
  test('should allow developer to specify userId and provide access to it in state', async () => {
    const callClient = new CallClient();
    const declarativeCallClient = callClientDeclaratify(callClient, mockUserId);
    expect(declarativeCallClient.state.userId).toBe(mockUserId);
  });

  test('should update callAgent state and have displayName when callAgent is created', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);

    expect(testData.declarativeCallClient.state.callAgent).toBeDefined();
    expect(testData.declarativeCallClient.state.callAgent?.displayName).toBe(mockDisplayName);
  });

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

    testData.mockCall.localVideoStreams = [
      { source: {} as VideoDeviceInfo, mediaStreamType: 'Video' } as LocalVideoStream
    ];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [{ source: {} as VideoDeviceInfo, mediaStreamType: 'Video' } as LocalVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams.length !== 0
    );

    testData.mockCall.localVideoStreams = [];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [],
      removed: [{ source: {} as VideoDeviceInfo, mediaStreamType: 'Video' } as LocalVideoStream]
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
          .size !== 0
    );
    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.videoStreams
        .size
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
          .size !== 0
    );

    testData.mockRemoteParticipant.videoStreams = [];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [],
      removed: [mockRemoteVideoStream]
    });

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.videoStreams
          .size === 0
    );
    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.videoStreams
        .size
    ).toBe(0);
  });

  test('should update state when remote video stream emits `isAvailableChanged`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    const mockRemoteVideoStream = createMockRemoteVideoStream(false);
    mockRemoteVideoStream.id = 1;
    testData.mockRemoteParticipant.videoStreams = [mockRemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
      removed: []
    });

    const participantKey = getRemoteParticipantKey(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.get(participantKey)?.videoStreams
          .size !== 0
    );

    mockRemoteVideoStream.isAvailable = true;
    mockRemoteVideoStream.emit('isAvailableChanged');

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(participantKey)
          ?.videoStreams.get(1)?.isAvailable === true
    );
    expect(
      testData.declarativeCallClient.state.calls
        .get(mockCallId)
        ?.remoteParticipants.get(participantKey)
        ?.videoStreams.get(1)?.isAvailable
    ).toBe(true);
  });

  test('should move participant to ended when participant is removed', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.size !== 0
    );

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.size).toBe(1);

    testData.mockCall.remoteParticipants = [];
    testData.mockRemoteParticipant.callEndReason = { code: 1 };
    testData.mockCall.emit('remoteParticipantsUpdated', { added: [], removed: [testData.mockRemoteParticipant] });

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.size === 0
    );

    const participantKey = getRemoteParticipantKey(testData.mockRemoteParticipant.identifier);
    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.size).toBe(0);
    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipantsEnded.size).toBe(1);
    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipantsEnded.get(participantKey)
        ?.callEndReason?.code
    ).toBe(1);
  });

  test('should render the stream and add to state when startRenderVideo is called', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    const mockRemoteVideoStream = createMockRemoteVideoStream(false);
    mockRemoteVideoStream.id = 1;
    testData.mockRemoteParticipant.videoStreams = [mockRemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
      removed: []
    });

    testData.mockCall.localVideoStreams = [{} as LocalVideoStream];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [{} as LocalVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))?.videoStreams
          .size !== 0
    );

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams.length !== 0
    );

    const remoteVideoStream = testData.declarativeCallClient.state.calls
      .get(mockCallId)
      ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
      ?.videoStreams.get(1);
    if (!remoteVideoStream) {
      expect(remoteVideoStream).toBeDefined();
    } else {
      testData.declarativeCallClient.startRenderVideo(mockCallId, remoteVideoStream);
    }

    const localVideoStream = testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams[0];
    if (!localVideoStream) {
      expect(localVideoStream).toBeDefined();
    } else {
      testData.declarativeCallClient.startRenderVideo(mockCallId, localVideoStream);
    }

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
          ?.videoStreams.get(1)?.videoStreamRendererView !== undefined
    );

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
          ?.videoStreams.get(1)?.videoStreamRendererView !== undefined
    );

    expect(
      testData.declarativeCallClient.state.calls
        .get(mockCallId)
        ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
        ?.videoStreams.get(1)?.videoStreamRendererView
    ).toBeDefined();

    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams[0].videoStreamRendererView
    ).toBeDefined();
  });

  test('should stop rendering the stream and remove from state when stopRenderVideo is called', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    const mockRemoteVideoStream = createMockRemoteVideoStream(false);
    mockRemoteVideoStream.id = 1;
    testData.mockRemoteParticipant.videoStreams = [mockRemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
      removed: []
    });

    testData.mockCall.localVideoStreams = [{} as LocalVideoStream];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [{} as LocalVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))?.videoStreams
          .size !== 0
    );

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams.length !== 0
    );

    const remoteVideoStream = testData.declarativeCallClient.state.calls
      .get(mockCallId)
      ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
      ?.videoStreams.get(1);
    if (!remoteVideoStream) {
      expect(remoteVideoStream).toBeDefined();
      return;
    } else {
      testData.declarativeCallClient.startRenderVideo(mockCallId, remoteVideoStream);
    }

    const localVideoStream = testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams[0];
    if (!localVideoStream) {
      expect(localVideoStream).toBeDefined();
      return;
    } else {
      testData.declarativeCallClient.startRenderVideo(mockCallId, localVideoStream);
    }

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
          ?.videoStreams.get(1)?.videoStreamRendererView !== undefined
    );

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
          ?.videoStreams.get(1)?.videoStreamRendererView !== undefined
    );

    expect(
      testData.declarativeCallClient.state.calls
        .get(mockCallId)
        ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
        ?.videoStreams.get(1)?.videoStreamRendererView
    ).toBeDefined();

    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams[0]?.videoStreamRendererView
    ).toBeDefined();

    testData.declarativeCallClient.stopRenderVideo(mockCallId, remoteVideoStream);
    testData.declarativeCallClient.stopRenderVideo(mockCallId, localVideoStream);

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
          ?.videoStreams.get(1)?.videoStreamRendererView === undefined
    );

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams[0]?.videoStreamRendererView ===
        undefined
    );

    expect(
      testData.declarativeCallClient.state.calls
        .get(mockCallId)
        ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
        ?.videoStreams.get(1)?.videoStreamRendererView
    ).not.toBeDefined();

    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams[0].videoStreamRendererView
    ).not.toBeDefined();
  });

  test('should stop rendering the stream and remove from state when call ends', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    const mockRemoteVideoStream = createMockRemoteVideoStream(false);
    mockRemoteVideoStream.id = 1;
    testData.mockRemoteParticipant.videoStreams = [mockRemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
      removed: []
    });

    testData.mockCall.localVideoStreams = [{} as LocalVideoStream];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [{} as LocalVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))?.videoStreams
          .size !== 0
    );

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams.length !== 0
    );

    const remoteVideoStream = testData.declarativeCallClient.state.calls
      .get(mockCallId)
      ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
      ?.videoStreams.get(1);
    if (!remoteVideoStream) {
      expect(remoteVideoStream).toBeDefined();
      return;
    } else {
      testData.declarativeCallClient.startRenderVideo(mockCallId, remoteVideoStream);
    }

    const localVideoStream = testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams[0];
    if (!localVideoStream) {
      expect(localVideoStream).toBeDefined();
      return;
    } else {
      testData.declarativeCallClient.startRenderVideo(mockCallId, localVideoStream);
    }

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
          ?.videoStreams.get(1)?.videoStreamRendererView !== undefined
    );

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams[0]?.videoStreamRendererView !==
        undefined
    );

    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams[0]?.videoStreamRendererView
    ).toBeDefined();

    expect(
      testData.declarativeCallClient.state.calls
        .get(mockCallId)
        ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
        ?.videoStreams.get(1)?.videoStreamRendererView
    ).toBeDefined();

    testData.mockCallAgent.calls = [];
    testData.mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [testData.mockCall]
    });

    await waitWithBreakCondition(() => testData.declarativeCallClient.state.calls.size === 0);

    expect(
      testData.declarativeCallClient.state.callsEnded[0]?.remoteParticipants
        .get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))
        ?.videoStreams.get(1)?.videoStreamRendererView
    ).not.toBeDefined();

    expect(
      testData.declarativeCallClient.state.calls.get(mockCallId)?.localVideoStreams[0]?.videoStreamRendererView
    ).not.toBeDefined();
  });

  test('should detect if call already has recording active', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Recording, addMockEmitter({ name: 'Default', isRecordingActive: true }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.recording.isRecordingActive === true
    );

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.recording.isRecordingActive).toBe(true);
  });

  test('should detect if call already has transcription active', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Transcription, addMockEmitter({ name: 'Default', isTranscriptionActive: true }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.transcription.isTranscriptionActive === true
    );

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.transcription.isTranscriptionActive).toBe(true);
  });

  test('should detect recording changes in call', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Recording, addMockEmitter({ name: 'Default', isRecordingActive: true }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.recording.isRecordingActive === true
    );

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.recording.isRecordingActive).toBe(true);

    const recording = featureCache.get(Features.Recording);
    recording.isRecordingActive = false;
    recording.emitter.emit('isRecordingActiveChanged');

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.recording.isRecordingActive === false
    );

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.recording.isRecordingActive).toBe(false);
  });

  test('should detect transcription changes in call', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Transcription, addMockEmitter({ name: 'Default', isTranscriptionActive: true }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.transcription.isTranscriptionActive === true
    );

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.transcription.isTranscriptionActive).toBe(true);

    const transcription = featureCache.get(Features.Transcription);
    transcription.isTranscriptionActive = false;
    transcription.emitter.emit('isTranscriptionActiveChanged');

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.transcription.isTranscriptionActive === false
    );

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.transcription.isTranscriptionActive).toBe(false);
  });

  test('should unsubscribe to recording changes when call ended', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Recording, addMockEmitter({ name: 'Default', isRecordingActive: true }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.recording.isRecordingActive === true
    );

    expect(() => testData.declarativeCallClient.state.calls.get(mockCallId)?.recording.isRecordingActive === true);

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.recording.isRecordingActive).toBe(true);

    testData.mockCallAgent.calls = [];
    testData.mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [testData.mockCall]
    });

    await waitWithBreakCondition(() => testData.declarativeCallClient.state.calls.size === 0);

    const recording = featureCache.get(Features.Recording);
    expect(recording.emitter.eventNames().length).toBe(0);
  });

  test('should unsubscribe to transcription changes when call ended', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Transcription, addMockEmitter({ name: 'Default', isTranscriptionActive: true }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.transcription.isTranscriptionActive === true
    );

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.transcription.isTranscriptionActive).toBe(true);

    testData.mockCallAgent.calls = [];
    testData.mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [testData.mockCall]
    });

    await waitWithBreakCondition(() => testData.declarativeCallClient.state.calls.size === 0);

    const transcription = featureCache.get(Features.Transcription);
    expect(transcription.emitter.eventNames().length).toBe(0);
  });

  test('should detect transfer requests in call', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    const mockCall = createMockCall(mockCallId);
    const transfer = addMockEmitter({ name: 'Default' });
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Transfer, transfer);
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(() => testData.declarativeCallClient.state.calls.get(mockCallId) !== undefined);

    transfer.emit('transferRequested', { targetParticipant: { communicationUserId: 'a', kind: 'communicationUser' } });
    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.transfer.receivedTransferRequests.length !== 0
    );

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.transfer.receivedTransferRequests.length).toBe(
      1
    );
  });

  test('should unsubscribe to transfer requests when call ended', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Transfer, addMockEmitter({ name: 'Default' }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(() => testData.declarativeCallClient.state.calls.get(mockCallId) !== undefined);

    testData.mockCallAgent.calls = [];
    testData.mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [testData.mockCall]
    });

    await waitWithBreakCondition(() => testData.declarativeCallClient.state.calls.size === 0);

    const transfer = featureCache.get(Features.Transfer);
    expect(transfer.emitter.eventNames().length).toBe(0);
  });

  test('should surface screenshare screen when available in state', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    const mockRemoteVideoStream = createMockRemoteVideoStream(false);
    mockRemoteVideoStream.mediaStreamType = 'ScreenSharing';
    mockRemoteVideoStream.isAvailable = true;
    mockRemoteVideoStream.id = 1;
    testData.mockRemoteParticipant.videoStreams = [mockRemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))?.videoStreams
          .size !== 0
    );

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.screenShareRemoteParticipant).toBeDefined();
  });

  test('should stop surfacing screenshare screen when not available in state', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    const mockRemoteVideoStream = createMockRemoteVideoStream(false);
    mockRemoteVideoStream.mediaStreamType = 'ScreenSharing';
    mockRemoteVideoStream.isAvailable = true;
    mockRemoteVideoStream.id = 1;
    testData.mockRemoteParticipant.videoStreams = [mockRemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(getRemoteParticipantKey(testData.mockRemoteParticipant.identifier))?.videoStreams
          .size !== 0
    );

    mockRemoteVideoStream.isAvailable = false;
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
      removed: []
    });

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.screenShareRemoteParticipant).not.toBeDefined();
  });

  test('should not accidently existing active screenshare screen when another stream is set unavailable', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    createDeclarativeClient(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    // Have an active screenshare
    const mockRemoteVideoStream = createMockRemoteVideoStream(false);
    mockRemoteVideoStream.mediaStreamType = 'ScreenSharing';
    mockRemoteVideoStream.isAvailable = true;
    mockRemoteVideoStream.id = 1;
    testData.mockRemoteParticipant.videoStreams = [mockRemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
      removed: []
    });

    const secondMockParticipantId = 'aaaaaaaaaaaaaa';
    const participant2 = createMockRemoteParticipant(secondMockParticipantId);
    testData.mockCall.emit('remoteParticipantsUpdated', {
      added: [participant2],
      removed: []
    });

    await waitWithBreakCondition(
      () => testData.declarativeCallClient.state.calls.get(mockCallId)?.remoteParticipants.size === 2
    );

    // Add a second inactive screenshare and ensure it doesn't overwrite the first one
    const mockRemoteVideoStream2 = createMockRemoteVideoStream(false);
    mockRemoteVideoStream2.mediaStreamType = 'ScreenSharing';
    mockRemoteVideoStream2.isAvailable = false;
    mockRemoteVideoStream2.id = 1;
    participant2.videoStreams = [mockRemoteVideoStream2];
    participant2.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        testData.declarativeCallClient.state.calls
          .get(mockCallId)
          ?.remoteParticipants.get(
            getRemoteParticipantKey({ kind: 'communicationUser', communicationUserId: secondMockParticipantId })
          )?.videoStreams.size !== 0
    );

    expect(testData.declarativeCallClient.state.calls.get(mockCallId)?.screenShareRemoteParticipant).toBeDefined();
  });
});
