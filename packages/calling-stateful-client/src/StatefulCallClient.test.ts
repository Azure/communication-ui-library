// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Call,
  CallFeatureFactoryType,
  CreateViewOptions,
  Features,
  LocalVideoStream,
  MediaStreamType,
  RecordingCallFeature,
  RemoteVideoStream,
  TranscriptionCallFeature,
  TransferCallFeature,
  VideoDeviceInfo,
  VideoStreamRendererView
} from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallContext } from './CallContext';
import { convertSdkRemoteStreamToDeclarativeRemoteStream } from './Converter';
import { InternalCallContext } from './InternalCallContext';
import { createStatefulCallClient, createStatefulCallClientWithDeps, StatefulCallClient } from './StatefulCallClient';
import {
  addMockEmitter,
  createMockApiFeatures,
  createMockCall,
  createMockCallAgent,
  createMockCallClient,
  createMockRemoteParticipant,
  createMockRemoteVideoStream,
  createStatefulCallClientWithAgent,
  MockCall,
  MockCallAgent,
  MockCommunicationUserCredential,
  MockRecordingCallFeatureImpl,
  MockRemoteParticipant,
  MockRemoteVideoStream,
  MockTranscriptionCallFeatureImpl,
  MockTransferCallFeatureImpl,
  StateChangeListener,
  stubCommunicationTokenCredential,
  waitWithBreakCondition
} from './TestUtils';

const mockCallId = 'a';
const mockCallId2 = 'b';
const mockParticipantCommunicationUserId = 'c';
const mockDisplayName = 'd';
const mockUserId = 'e';

jest.mock('@azure/communication-calling', () => {
  return {
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

interface TestData {
  mockCallAgent: MockCallAgent;
  mockCall: MockCall;
  mockRemoteParticipant: MockRemoteParticipant;
  mockStatefulCallClient: StatefulCallClient;
  mockRemoteVideoStream: MockRemoteVideoStream;
}

function createClientAndAgentMocks(testData: TestData): void {
  const mockCallAgent = { calls: [] as ReadonlyArray<Call>, displayName: mockDisplayName } as MockCallAgent;
  addMockEmitter(mockCallAgent);
  testData.mockCallAgent = mockCallAgent;
  testData.mockStatefulCallClient = createStatefulCallClient({
    userId: { kind: 'communicationUser', communicationUserId: mockUserId }
  });
}

async function createMockCallAndEmitCallsUpdated(
  testData: TestData,
  waitCondition?: () => boolean,
  mockCall?: MockCall
): Promise<void> {
  await testData.mockStatefulCallClient.createCallAgent(new MockCommunicationUserCredential());
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
    waitCondition ? waitCondition : () => Object.keys(testData.mockStatefulCallClient.getState().calls).length !== 0
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
      : () =>
          Object.keys(testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants ?? {}).length !==
          0
  );
}

async function createMockRemoteVideoStreamAndEmitVideoStreamsUpdated(
  isAvailable: boolean,
  type: MediaStreamType,
  id: number,
  testData: TestData
): Promise<void> {
  const mockRemoteVideoStream = createMockRemoteVideoStream(isAvailable);
  mockRemoteVideoStream.mediaStreamType = type;
  mockRemoteVideoStream.isAvailable = isAvailable;
  mockRemoteVideoStream.id = id;
  testData.mockRemoteVideoStream = mockRemoteVideoStream;
  testData.mockRemoteParticipant.videoStreams = [mockRemoteVideoStream];
  testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
    added: [mockRemoteVideoStream],
    removed: []
  });

  await waitWithBreakCondition(
    () =>
      Object.keys(
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
          toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
        ]?.videoStreams ?? {}
      ).length !== 0
  );
}

describe('Stateful call client', () => {
  test('should allow developer to specify userId and provide access to it in state', async () => {
    const client = createStatefulCallClientWithDeps(
      createMockCallClient(),
      new CallContext({ kind: 'communicationUser', communicationUserId: mockUserId }),
      new InternalCallContext()
    );
    expect(client.getState().userId.communicationUserId).toBe(mockUserId);
  });

  test('should update callAgent state and have displayName when callAgent is created', async () => {
    const displayName = 'booyaa';
    const agent = createMockCallAgent(displayName);
    const client = createStatefulCallClientWithAgent(agent);

    await client.createCallAgent(stubCommunicationTokenCredential());
    expect(client.getState().callAgent).toBeDefined();
    expect(client.getState().callAgent?.displayName).toBe(displayName);
  });

  test('should update call in state when new call is added', async () => {
    const agent = createMockCallAgent();
    const client = createStatefulCallClientWithAgent(agent);

    await client.createCallAgent(stubCommunicationTokenCredential());

    const listener = new StateChangeListener(client);
    agent.testHelperPushCall(createMockCall());
    expect(await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 1)).toBe(true);
    expect(listener.onChangeCalledCount).toBe(1);
  });

  test('should update call in state when a call is removed', async () => {
    const agent = createMockCallAgent();
    const client = createStatefulCallClientWithAgent(agent);

    await client.createCallAgent(stubCommunicationTokenCredential());

    agent.testHelperPushCall(createMockCall());
    expect(await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 1)).toBe(true);

    const listener = new StateChangeListener(client);
    agent.testHelperPopCall();
    expect(await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 0)).toBe(true);
    expect(listener.onChangeCalledCount).toBe(1);

    // [xkcd] Make sure that some other test verifies that further changes to the popped call are not reflected in the state.
  });

  test('should update state when call changes state', async () => {
    const agent = createMockCallAgent();
    const client = createStatefulCallClientWithAgent(agent);

    await client.createCallAgent(stubCommunicationTokenCredential());

    const call = createMockCall('myVeryFirstCall');
    agent.testHelperPushCall(call);
    await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 1);

    const listener = new StateChangeListener(client);
    call.state = 'InLobby';
    call.emit('stateChanged');
    expect(await waitWithBreakCondition(() => client.getState().calls['myVeryFirstCall']?.state === 'InLobby')).toBe(
      true
    );
    expect(listener.onChangeCalledCount).toBe(1);
  });

  test('should update state when call changes id', async () => {
    const agent = createMockCallAgent();
    const client = createStatefulCallClientWithAgent(agent);

    await client.createCallAgent(stubCommunicationTokenCredential());

    const call = createMockCall('myVeryFirstCall');
    agent.testHelperPushCall(call);
    await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 1);

    const listener = new StateChangeListener(client);
    call.id = 'aNewId';
    call.emit('idChanged');
    expect(await waitWithBreakCondition(() => !!client.getState().calls['aNewId'])).toBe(true);
    expect(client.getState().calls['myVeryFirstCall']).toBeUndefined();
    expect(listener.onChangeCalledCount).toBe(1);
  });

  test('[xkcd] should update state when new remote participant is added', async () => {
    const agent = createMockCallAgent();
    const client = createStatefulCallClientWithAgent(agent);

    await client.createCallAgent(stubCommunicationTokenCredential());

    const call = createMockCall('myVeryFirstCall');
    agent.testHelperPushCall(call);
    expect(await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 1)).toBe(true);

    const listener = new StateChangeListener(client);
    call.testHelperPushRemoteParticipant(createMockRemoteParticipant());
    expect(
      await waitWithBreakCondition(
        () => Object.keys(client.getState().calls['myVeryFirstCall']?.remoteParticipants ?? {}).length !== 0
      )
    ).toBe(true);
    // FIXME: There should be only one event triggered here.
    expect(listener.onChangeCalledCount).toBe(2);
  });

  test('should update state when remote participant display name changes', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    testData.mockCall.id = mockCallId2;
    testData.mockCall.emit('idChanged');

    await waitWithBreakCondition(() => {
      return testData.mockStatefulCallClient.getState().calls[mockCallId2] !== undefined;
    });
    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]).toBe(undefined);
    expect(testData.mockStatefulCallClient.getState().calls[mockCallId2]).not.toBe(undefined);

    testData.mockRemoteParticipant.displayName = 'a';
    testData.mockRemoteParticipant.emit('displayNameChanged');

    await waitWithBreakCondition(
      () =>
        testData.mockStatefulCallClient.getState().calls[mockCallId2]?.remoteParticipants[
          toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
        ]?.displayName !== undefined
    );
    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId2]?.remoteParticipants[
        toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
      ]?.displayName
    ).toBe('a');
  });

  test('should update state when call `isScreenSharingOnChanged` event', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);

    const oldIsScreenSharingOn = testData.mockCall.isScreenSharingOn;
    testData.mockCall.isScreenSharingOn = !oldIsScreenSharingOn;
    testData.mockCall.emit('isScreenSharingOnChanged');

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.isScreenSharingOn === !oldIsScreenSharingOn
    );
    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.isScreenSharingOn).toBe(!oldIsScreenSharingOn);
  });

  test('should update state when call added local video `localVideoStreamsUpdated` event', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);

    testData.mockCall.localVideoStreams = [{} as LocalVideoStream];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [{} as LocalVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams.length !== 0
    );
    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams.length).toBe(1);
  });

  test('should update state when call remove local video `localVideoStreamsUpdated` event', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);

    testData.mockCall.localVideoStreams = [
      { source: {} as VideoDeviceInfo, mediaStreamType: 'Video' } as LocalVideoStream
    ];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [{ source: {} as VideoDeviceInfo, mediaStreamType: 'Video' } as LocalVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams.length !== 0
    );

    testData.mockCall.localVideoStreams = [];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [],
      removed: [{ source: {} as VideoDeviceInfo, mediaStreamType: 'Video' } as LocalVideoStream]
    });
    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams.length).toBe(0);
  });

  test('should update state when participant removed in `remoteParticipantsUpdated` and unsubscribe toit', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    testData.mockCall.remoteParticipants = [];
    testData.mockCall.emit('remoteParticipantsUpdated', {
      added: [],
      removed: [testData.mockRemoteParticipant]
    });

    await waitWithBreakCondition(
      () =>
        Object.keys(testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants ?? {}).length === 0
    );
    expect(
      Object.keys(testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants ?? {}).length
    ).toBe(0);
    expect(testData.mockRemoteParticipant.emitter.eventNames().length).toBe(0);
  });

  test('should update state when participant `stateChanged`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    testData.mockRemoteParticipant.state = 'Idle';
    testData.mockRemoteParticipant.emit('stateChanged');

    const participantKey = toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]?.state ===
        'Idle'
    );
    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]?.state
    ).toBe('Idle');
  });

  test('should update state when participant `isMutedChanged`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    const oldIsMuted = testData.mockRemoteParticipant.isMuted;
    testData.mockRemoteParticipant.isMuted = !oldIsMuted;
    testData.mockRemoteParticipant.emit('isMutedChanged');

    const participantKey = toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]?.isMuted ===
        !oldIsMuted
    );
    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]?.isMuted
    ).toBe(!oldIsMuted);
  });

  test('should update state when participant `displayNameChanged`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    testData.mockRemoteParticipant.displayName = 'z';
    testData.mockRemoteParticipant.emit('displayNameChanged');

    const participantKey = toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]
          ?.displayName === 'z'
    );
    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]?.displayName
    ).toBe('z');
  });

  test('should update state when participant `isSpeakingChanged`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    const oldIsSpeaking = testData.mockRemoteParticipant.isSpeaking;
    testData.mockRemoteParticipant.isSpeaking = !oldIsSpeaking;
    testData.mockRemoteParticipant.emit('isSpeakingChanged');

    const participantKey = toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]?.isSpeaking ===
        !oldIsSpeaking
    );
    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]?.isSpeaking
    ).toBe(!oldIsSpeaking);
  });

  test('should update state when participant added remote video `videoStreamsUpdated`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);
    await createMockRemoteVideoStreamAndEmitVideoStreamsUpdated(false, 'Video', 1, testData);

    const participantKey = toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]
            ?.videoStreams ?? {}
        ).length !== 0
    );
    expect(
      Object.keys(
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]
          ?.videoStreams ?? {}
      ).length
    ).toBe(1);
  });

  test('should update state when participant removed remote video `videoStreamsUpdated`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);
    await createMockRemoteVideoStreamAndEmitVideoStreamsUpdated(false, 'Video', 1, testData);

    const participantKey = toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]
            ?.videoStreams ?? {}
        ).length !== 0
    );

    testData.mockRemoteParticipant.videoStreams = [];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [],
      removed: [testData.mockRemoteVideoStream]
    });

    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]
            ?.videoStreams ?? {}
        ).length === 0
    );
    expect(
      Object.keys(
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]
          ?.videoStreams ?? {}
      ).length
    ).toBe(0);
  });

  test('should update state when remote video stream emits `isAvailableChanged`', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);
    await createMockRemoteVideoStreamAndEmitVideoStreamsUpdated(false, 'Video', 1, testData);

    const participantKey = toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier);
    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]
            ?.videoStreams ?? {}
        ).length !== 0
    );

    testData.mockRemoteVideoStream.isAvailable = true;
    testData.mockRemoteVideoStream.emit('isAvailableChanged');

    await waitWithBreakCondition(
      () =>
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]
          ?.videoStreams[1]?.isAvailable === true
    );
    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[participantKey]?.videoStreams[1]
        ?.isAvailable
    ).toBe(true);
  });

  test('should move participant to ended when participant is removed', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    await waitWithBreakCondition(
      () =>
        Object.keys(testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants ?? {}).length !== 0
    );

    expect(
      Object.keys(testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants ?? {}).length
    ).toBe(1);

    testData.mockCall.remoteParticipants = [];
    testData.mockRemoteParticipant.callEndReason = { code: 1 };
    testData.mockCall.emit('remoteParticipantsUpdated', { added: [], removed: [testData.mockRemoteParticipant] });

    await waitWithBreakCondition(
      () =>
        Object.keys(testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants ?? {}).length === 0
    );

    const participantKey = toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier);
    expect(
      Object.keys(testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants ?? {}).length
    ).toBe(0);
    expect(
      Object.keys(testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipantsEnded ?? {}).length
    ).toBe(1);
    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipantsEnded[participantKey]
        ?.callEndReason?.code
    ).toBe(1);
  });

  test('should render the stream and add to state when createView is called', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);
    await createMockRemoteVideoStreamAndEmitVideoStreamsUpdated(false, 'Video', 1, testData);

    testData.mockCall.localVideoStreams = [{} as LocalVideoStream];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [{} as LocalVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
            toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
          ]?.videoStreams ?? {}
        ).length !== 0
    );

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams.length !== 0
    );

    const remoteVideoStream =
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
        toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
      ]?.videoStreams[1];
    if (!remoteVideoStream) {
      expect(remoteVideoStream).toBeDefined();
    } else {
      testData.mockStatefulCallClient.createView(
        mockCallId,
        { kind: 'communicationUser', communicationUserId: mockParticipantCommunicationUserId },
        remoteVideoStream
      );
    }

    const localVideoStream = testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams[0];
    if (!localVideoStream) {
      expect(localVideoStream).toBeDefined();
    } else {
      testData.mockStatefulCallClient.createView(mockCallId, undefined, localVideoStream);
    }

    await waitWithBreakCondition(
      () =>
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
          toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
        ]?.videoStreams[1]?.view !== undefined
    );

    await waitWithBreakCondition(
      () =>
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
          toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
        ]?.videoStreams[1]?.view !== undefined
    );

    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
        toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
      ]?.videoStreams[1]?.view
    ).toBeDefined();

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams[0].view).toBeDefined();
  });

  test('should stop rendering the stream and remove from state when disposeView is called', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);
    await createMockRemoteVideoStreamAndEmitVideoStreamsUpdated(false, 'Video', 1, testData);

    testData.mockCall.localVideoStreams = [{} as LocalVideoStream];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [{} as LocalVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
            toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
          ]?.videoStreams ?? {}
        ).length !== 0
    );

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams.length !== 0
    );

    const remoteVideoStream =
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
        toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
      ]?.videoStreams[1];
    if (!remoteVideoStream) {
      expect(remoteVideoStream).toBeDefined();
      return;
    } else {
      testData.mockStatefulCallClient.createView(
        mockCallId,
        { kind: 'communicationUser', communicationUserId: mockParticipantCommunicationUserId },
        remoteVideoStream
      );
    }

    const localVideoStream = testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams[0];
    if (!localVideoStream) {
      expect(localVideoStream).toBeDefined();
      return;
    } else {
      testData.mockStatefulCallClient.createView(mockCallId, undefined, localVideoStream);
    }

    await waitWithBreakCondition(
      () =>
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
          toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
        ]?.videoStreams[1]?.view !== undefined
    );

    await waitWithBreakCondition(
      () =>
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
          toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
        ]?.videoStreams[1]?.view !== undefined
    );

    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
        toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
      ]?.videoStreams[1]?.view
    ).toBeDefined();

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams[0]?.view).toBeDefined();

    testData.mockStatefulCallClient.disposeView(
      mockCallId,
      { kind: 'communicationUser', communicationUserId: mockParticipantCommunicationUserId },
      remoteVideoStream
    );
    testData.mockStatefulCallClient.disposeView(mockCallId, undefined, localVideoStream);

    await waitWithBreakCondition(
      () =>
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
          toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
        ]?.videoStreams[1]?.view === undefined
    );

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams[0]?.view === undefined
    );

    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
        toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
      ]?.videoStreams[1]?.view
    ).not.toBeDefined();

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams[0].view).not.toBeDefined();
  });

  test('should stop rendering the stream and remove from state when call ends', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);
    await createMockRemoteVideoStreamAndEmitVideoStreamsUpdated(false, 'Video', 1, testData);

    testData.mockCall.localVideoStreams = [{} as LocalVideoStream];
    testData.mockCall.emit('localVideoStreamsUpdated', {
      added: [{} as LocalVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
            toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
          ]?.videoStreams ?? {}
        ).length !== 0
    );

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams.length !== 0
    );

    const remoteVideoStream =
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
        toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
      ]?.videoStreams[1];
    if (!remoteVideoStream) {
      expect(remoteVideoStream).toBeDefined();
      return;
    } else {
      testData.mockStatefulCallClient.createView(
        mockCallId,
        { kind: 'communicationUser', communicationUserId: mockParticipantCommunicationUserId },
        remoteVideoStream
      );
    }

    const localVideoStream = testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams[0];
    if (!localVideoStream) {
      expect(localVideoStream).toBeDefined();
      return;
    } else {
      testData.mockStatefulCallClient.createView(mockCallId, undefined, localVideoStream);
    }

    await waitWithBreakCondition(
      () =>
        testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
          toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
        ]?.videoStreams[1]?.view !== undefined
    );

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams[0]?.view !== undefined
    );

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams[0]?.view).toBeDefined();

    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
        toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
      ]?.videoStreams[1]?.view
    ).toBeDefined();

    testData.mockCallAgent.calls = [];
    testData.mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [testData.mockCall]
    });

    await waitWithBreakCondition(() => Object.keys(testData.mockStatefulCallClient.getState().calls).length === 0);

    expect(
      testData.mockStatefulCallClient.getState().callsEnded[0]?.remoteParticipants[
        toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
      ]?.videoStreams[1]?.view
    ).not.toBeDefined();

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.localVideoStreams[0]?.view).not.toBeDefined();
  });

  test('should detect if call already has recording active', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Recording, addMockEmitter({ name: 'Default', isRecordingActive: true }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.recording.isRecordingActive === true
    );

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.recording.isRecordingActive).toBe(true);
  });

  test('should detect if call already has transcription active', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Transcription, addMockEmitter({ name: 'Default', isTranscriptionActive: true }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.transcription.isTranscriptionActive === true
    );

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.transcription.isTranscriptionActive).toBe(
      true
    );
  });

  test('should detect recording changes in call', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Recording, addMockEmitter({ name: 'Default', isRecordingActive: true }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.recording.isRecordingActive === true
    );

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.recording.isRecordingActive).toBe(true);

    const recording = featureCache.get(Features.Recording);
    recording.isRecordingActive = false;
    recording.emitter.emit('isRecordingActiveChanged');

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.recording.isRecordingActive === false
    );

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.recording.isRecordingActive).toBe(false);
  });

  test('should detect transcription changes in call', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Transcription, addMockEmitter({ name: 'Default', isTranscriptionActive: true }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.transcription.isTranscriptionActive === true
    );

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.transcription.isTranscriptionActive).toBe(
      true
    );

    const transcription = featureCache.get(Features.Transcription);
    transcription.isTranscriptionActive = false;
    transcription.emitter.emit('isTranscriptionActiveChanged');

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.transcription.isTranscriptionActive === false
    );

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.transcription.isTranscriptionActive).toBe(
      false
    );
  });

  test('should unsubscribe to recording changes when call ended', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Recording, addMockEmitter({ name: 'Default', isRecordingActive: true }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.recording.isRecordingActive === true
    );

    expect(() => testData.mockStatefulCallClient.getState().calls[mockCallId]?.recording.isRecordingActive === true);

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.recording.isRecordingActive).toBe(true);

    testData.mockCallAgent.calls = [];
    testData.mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [testData.mockCall]
    });

    await waitWithBreakCondition(() => Object.keys(testData.mockStatefulCallClient.getState().calls).length === 0);

    const recording = featureCache.get(Features.Recording);
    expect(recording.emitter.eventNames().length).toBe(0);
  });

  test('should unsubscribe to transcription changes when call ended', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Transcription, addMockEmitter({ name: 'Default', isTranscriptionActive: true }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.transcription.isTranscriptionActive === true
    );

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.transcription.isTranscriptionActive).toBe(
      true
    );

    testData.mockCallAgent.calls = [];
    testData.mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [testData.mockCall]
    });

    await waitWithBreakCondition(() => Object.keys(testData.mockStatefulCallClient.getState().calls).length === 0);

    const transcription = featureCache.get(Features.Transcription);
    expect(transcription.emitter.eventNames().length).toBe(0);
  });

  test('should detect transfer requests in call', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    const mockCall = createMockCall(mockCallId);
    const transfer = addMockEmitter({ name: 'Default' });
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Transfer, transfer);
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(() => testData.mockStatefulCallClient.getState().calls[mockCallId] !== undefined);

    transfer.emit('transferRequested', { targetParticipant: { communicationUserId: 'a', kind: 'communicationUser' } });
    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.transfer.receivedTransferRequests.length !== 0
    );

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.transfer.receivedTransferRequests.length).toBe(
      1
    );
  });

  test('should unsubscribe to transfer requests when call ended', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    const mockCall = createMockCall(mockCallId);
    const featureCache = new Map<any, any>();
    featureCache.set(Features.Transfer, addMockEmitter({ name: 'Default' }));
    mockCall.api = createMockApiFeatures(featureCache);
    await createMockCallAndEmitCallsUpdated(testData, undefined, mockCall);

    await waitWithBreakCondition(() => testData.mockStatefulCallClient.getState().calls[mockCallId] !== undefined);

    testData.mockCallAgent.calls = [];
    testData.mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [testData.mockCall]
    });

    await waitWithBreakCondition(() => Object.keys(testData.mockStatefulCallClient.getState().calls).length === 0);

    const transfer = featureCache.get(Features.Transfer);
    expect(transfer.emitter.eventNames().length).toBe(0);
  });

  test('should surface screenshare screen when available in state', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);
    await createMockRemoteVideoStreamAndEmitVideoStreamsUpdated(true, 'ScreenSharing', 1, testData);

    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
            toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
          ]?.videoStreams ?? {}
        ).length !== 0
    );

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.screenShareRemoteParticipant).toBeDefined();
  });

  test('should stop surfacing screenshare screen when not available in state', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);
    await createMockRemoteVideoStreamAndEmitVideoStreamsUpdated(true, 'ScreenSharing', 1, testData);

    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
            toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
          ]?.videoStreams ?? {}
        ).length !== 0
    );

    testData.mockRemoteVideoStream.isAvailable = false;
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [testData.mockRemoteVideoStream],
      removed: []
    });

    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.screenShareRemoteParticipant
    ).not.toBeDefined();
  });

  test('should not delete existing active screenshare screen when another stream is set unavailable', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);
    await createMockRemoteVideoStreamAndEmitVideoStreamsUpdated(true, 'ScreenSharing', 1, testData);

    const secondMockParticipantId = 'aaaaaaaaaaaaaa';
    const participant2 = createMockRemoteParticipant(secondMockParticipantId);
    testData.mockCall.emit('remoteParticipantsUpdated', {
      added: [participant2],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        Object.keys(testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants ?? {}).length === 2
    );

    // Add a second inactive screenshare and ensure it doesn't overwrite the first one
    const mockRemoteVideoStream2 = createMockRemoteVideoStream(false);
    mockRemoteVideoStream2.mediaStreamType = 'ScreenSharing';
    mockRemoteVideoStream2.isAvailable = false;
    mockRemoteVideoStream2.id = 1;
    participant2.videoStreams = [mockRemoteVideoStream2];
    participant2.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream2],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
            toFlatCommunicationIdentifier({ communicationUserId: secondMockParticipantId })
          ]?.videoStreams ?? {}
        ).length !== 0
    );

    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.screenShareRemoteParticipant).toBeDefined();
    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.screenShareRemoteParticipant).toBe(
      toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
    );
  });

  test('should not overwrite another stream of another participant if the stream ids are the same', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    // Participant with stream id 1
    const mockRemoteVideoStream = createMockRemoteVideoStream(false);
    mockRemoteVideoStream.id = 1;
    testData.mockRemoteParticipant.videoStreams = [mockRemoteVideoStream];
    testData.mockRemoteParticipant.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
            toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
          ]?.videoStreams ?? {}
        ).length !== 0
    );

    // Second participant with stream id 1
    const mockRemoteParticipant2 = createMockRemoteParticipant('aaaaaaaaaaaa');
    testData.mockCall.remoteParticipants = [testData.mockRemoteParticipant, mockRemoteParticipant2];
    testData.mockCall.emit('remoteParticipantsUpdated', {
      added: [mockRemoteParticipant2],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        Object.keys(testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants ?? {}).length !== 0
    );

    const mockRemoteVideoStream2 = createMockRemoteVideoStream(false);
    mockRemoteVideoStream2.id = 1;
    mockRemoteParticipant2.videoStreams = [mockRemoteVideoStream2];
    mockRemoteParticipant2.emit('videoStreamsUpdated', {
      added: [mockRemoteVideoStream2],
      removed: []
    });

    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
            toFlatCommunicationIdentifier(mockRemoteParticipant2.identifier)
          ]?.videoStreams ?? {}
        ).length !== 0
    );

    // Remove second participant's stream with id 1, this should not affect participant 1
    mockRemoteParticipant2.videoStreams = [];
    mockRemoteParticipant2.emit('videoStreamsUpdated', {
      added: [],
      removed: [mockRemoteVideoStream2]
    });

    await waitWithBreakCondition(
      () =>
        Object.keys(
          testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
            toFlatCommunicationIdentifier(mockRemoteParticipant2.identifier)
          ]?.videoStreams ?? {}
        ).length === 0
    );

    // Participant 1 should still be able to start video as their stream was not removed
    await testData.mockStatefulCallClient.createView(
      mockCallId,
      { kind: 'communicationUser', communicationUserId: mockParticipantCommunicationUserId },
      convertSdkRemoteStreamToDeclarativeRemoteStream(mockRemoteVideoStream)
    );

    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
        toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
      ]?.videoStreams[1]
    ).toBeDefined();
    expect(
      testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants[
        toFlatCommunicationIdentifier(testData.mockRemoteParticipant.identifier)
      ]?.videoStreams[1]?.view
    ).toBeDefined();
  });
});
