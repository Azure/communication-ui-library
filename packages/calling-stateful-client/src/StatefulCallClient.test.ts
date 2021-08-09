// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Call,
  CallFeatureFactoryType,
  CreateViewOptions,
  Features,
  LocalVideoStream,
  RecordingCallFeature,
  RemoteVideoStream,
  TranscriptionCallFeature,
  TransferCallFeature,
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
  createMockRemoteScreenshareStream,
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

  test('should update call in state when new call is added and removed', async () => {
    const agent = createMockCallAgent();
    const client = createStatefulCallClientWithAgent(agent);

    await client.createCallAgent(stubCommunicationTokenCredential());

    {
      const listener = new StateChangeListener(client);
      agent.testHelperPushCall(createMockCall());
      expect(await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 1)).toBe(true);
      expect(listener.onChangeCalledCount).toBe(1);
    }
    {
      const listener = new StateChangeListener(client);
      agent.testHelperPopCall();
      expect(await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 0)).toBe(true);
      expect(listener.onChangeCalledCount).toBe(1);
    }

    // [xkcd] Make sure that some other test verifies that further changes to the popped call are not reflected in the state.
  });

  test('should update state when simple call information changes', async () => {
    const { client, callId, call } = await prepareCall();

    {
      const listener = new StateChangeListener(client);
      call.state = 'InLobby';
      call.emit('stateChanged');
      expect(await waitWithBreakCondition(() => client.getState().calls[callId]?.state === 'InLobby')).toBe(true);
      expect(listener.onChangeCalledCount).toBe(1);
    }
    {
      const newValue = !call.isScreenSharingOn;
      const listener = new StateChangeListener(client);
      call.isScreenSharingOn = newValue;
      call.emit('isScreenSharingOnChanged');
      expect(await waitWithBreakCondition(() => client.getState().calls[callId]?.isScreenSharingOn === newValue)).toBe(
        true
      );
      expect(listener.onChangeCalledCount).toBe(1);
    }
    // Keep this test last because it messes with the call ID.
    {
      const listener = new StateChangeListener(client);
      call.id = 'aNewId';
      call.emit('idChanged');
      expect(await waitWithBreakCondition(() => !!client.getState().calls['aNewId'])).toBe(true);
      expect(client.getState().calls[callId]).toBeUndefined();
      expect(listener.onChangeCalledCount).toBe(1);
    }
  });

  test('should update state when new remote participant is added and removed', async () => {
    const { client, callId, call } = await prepareCall();

    {
      const listener = new StateChangeListener(client);
      call.testHelperPushRemoteParticipant(createMockRemoteParticipant());
      expect(
        await waitWithBreakCondition(
          () => Object.keys(client.getState().calls[callId]?.remoteParticipants ?? {}).length !== 0
        )
      ).toBe(true);
      // FIXME: There should be only one event triggered here.
      expect(listener.onChangeCalledCount).toBe(2);
    }
    {
      expect(Object.keys(client.getState().calls[callId]?.remoteParticipantsEnded ?? {}).length).toBe(0);
      const listener = new StateChangeListener(client);
      call.testHelperPopRemoteParticipant();
      expect(
        await waitWithBreakCondition(
          () => Object.keys(client.getState().calls[callId]?.remoteParticipants ?? {}).length === 0
        )
      ).toBe(true);
      expect(Object.keys(client.getState().calls[callId]?.remoteParticipantsEnded ?? {}).length).toBe(1);
      // FIXME: There should be only one event triggered here.
      expect(listener.onChangeCalledCount).toBe(2);
    }
  });

  test('should update state when remote participant simple information changes', async () => {
    const { client, callId, participant } = await prepareCallWithRemoteParticipant();
    const participantId = toFlatCommunicationIdentifier(participant.identifier);
    {
      const listener = new StateChangeListener(client);
      participant.displayName = 'aVeryNewName';
      participant.emit('displayNameChanged');
      expect(
        await waitWithBreakCondition(
          () => client.getState().calls[callId]?.remoteParticipants[participantId]?.displayName === 'aVeryNewName'
        )
      ).toBe(true);
      expect(listener.onChangeCalledCount).toBe(1);
    }
    {
      const listener = new StateChangeListener(client);
      participant.state = 'Idle';
      participant.emit('stateChanged');
      expect(
        await waitWithBreakCondition(
          () => client.getState().calls[callId]?.remoteParticipants[participantId]?.state === 'Idle'
        )
      ).toBe(true);
      expect(listener.onChangeCalledCount).toBe(1);
    }
    {
      const newValue = !participant.isMuted;
      const listener = new StateChangeListener(client);
      participant.isMuted = newValue;
      participant.emit('isMutedChanged');
      expect(
        await waitWithBreakCondition(
          () => client.getState().calls[callId]?.remoteParticipants[participantId]?.isMuted === newValue
        )
      ).toBe(true);
      expect(listener.onChangeCalledCount).toBe(1);
    }
    {
      const newValue = !participant.isSpeaking;
      const listener = new StateChangeListener(client);
      participant.isSpeaking = newValue;
      participant.emit('isSpeakingChanged');
      expect(
        await waitWithBreakCondition(
          () => client.getState().calls[callId]?.remoteParticipants[participantId]?.isSpeaking === newValue
        )
      ).toBe(true);
      expect(listener.onChangeCalledCount).toBe(1);
    }
  });

  test('should update state when local video stream is added and removed', async () => {
    const { client, callId, call } = await prepareCall();

    {
      const listener = new StateChangeListener(client);
      call.testHelperPushLocalVideoStream({} as LocalVideoStream);
      expect(await waitWithBreakCondition(() => client.getState().calls[callId]?.localVideoStreams.length !== 0)).toBe(
        true
      );
      expect(listener.onChangeCalledCount).toBe(1);
    }
    {
      const listener = new StateChangeListener(client);
      call.testHelperPopLocalVideoStream();
      expect(await waitWithBreakCondition(() => client.getState().calls[callId]?.localVideoStreams.length === 0)).toBe(
        true
      );
      // FIXME: Should generate only one event.
      expect(listener.onChangeCalledCount).toBe(2);
    }
  });

  test('should update state when remote stream is updated for participant', async () => {
    const { client, callId, participant } = await prepareCallWithRemoteParticipant();
    const participantKey = toFlatCommunicationIdentifier(participant.identifier);
    const streamId = 7;
    const stream = createMockRemoteVideoStream(streamId);
    {
      const listener = new StateChangeListener(client);
      participant.testHelperPushVideoStream(stream);
      expect(
        await waitWithBreakCondition(
          () =>
            Object.keys(client.getState().calls[callId]?.remoteParticipants[participantKey]?.videoStreams ?? {})
              .length !== 0
        )
      ).toBe(true);
      expect(listener.onChangeCalledCount).toBe(1);
    }
    {
      const listener = new StateChangeListener(client);
      stream.isAvailable = true;
      stream.emit('isAvailableChanged');
      expect(
        await waitWithBreakCondition(
          () =>
            client.getState().calls[callId]?.remoteParticipants[participantKey]?.videoStreams[streamId]?.isAvailable ===
            true
        )
      ).toBe(true);
      expect(listener.onChangeCalledCount).toBe(1);
    }
    {
      const listener = new StateChangeListener(client);
      participant.testHelperPopVideoStream();
      expect(
        await waitWithBreakCondition(
          () =>
            Object.keys(client.getState().calls[callId]?.remoteParticipants[participantKey]?.videoStreams ?? {})
              .length === 0
        )
      ).toBe(true);
      // FIXME: This should generate only one event.
      expect(listener.onChangeCalledCount).toBe(2);
    }
  });

  test('should update local video stream with createView and disposeView', async () => {
    const { client, callId } = await prepareCallWithLocalVideoStream();

    const localVideoStream = client.getState().calls[callId]?.localVideoStreams[0];
    expect(localVideoStream).toBeDefined();

    await client.createView(callId, undefined, localVideoStream);
    expect(
      await waitWithBreakCondition(() => client.getState().calls[callId]?.localVideoStreams[0].view !== undefined)
    ).toBe(true);

    client.disposeView(callId, undefined, localVideoStream);
    expect(
      await waitWithBreakCondition(() => client.getState().calls[callId]?.localVideoStreams[0].view === undefined)
    ).toBe(true);
  });

  test('should update remote video stream with createView and disposeView', async () => {
    const { client, callId, participant, streamId } = await prepareCallWithRemoteVideoStream();
    const participantKey = toFlatCommunicationIdentifier(participant.identifier);

    const remoteVideoStream =
      client.getState().calls[callId]?.remoteParticipants[participantKey]?.videoStreams[streamId];
    expect(remoteVideoStream).toBeDefined();

    await client.createView(callId, participant.identifier, remoteVideoStream);
    expect(
      await waitWithBreakCondition(
        () =>
          client.getState().calls[callId]?.remoteParticipants[participantKey]?.videoStreams[streamId]?.view !==
          undefined
      )
    ).toBe(true);

    client.disposeView(callId, participant.identifier, remoteVideoStream);
    expect(
      await waitWithBreakCondition(
        () =>
          client.getState().calls[callId]?.remoteParticipants[participantKey]?.videoStreams[streamId]?.view ===
          undefined
      )
    ).toBe(true);
  });

  test('should stop rendering streams when call ends', async () => {
    const { client, callId, agent, call, participant, streamId } = await prepareCallWithRemoteVideoStream();
    const participantKey = toFlatCommunicationIdentifier(participant.identifier);

    // Add a local video stream as well.
    call.testHelperPushLocalVideoStream({} as LocalVideoStream);
    expect(await waitWithBreakCondition(() => client.getState().calls[callId]?.localVideoStreams.length !== 0)).toBe(
      true
    );

    // End call.
    agent.calls = [];
    agent.emit('callsUpdated', {
      added: [],
      removed: [call]
    });

    // Expect all views to be removed.
    expect(
      await waitWithBreakCondition(() => client.getState().calls[callId]?.localVideoStreams[0].view === undefined)
    ).toBe(true);
    expect(
      await waitWithBreakCondition(
        () =>
          client.getState().calls[callId]?.remoteParticipants[participantKey]?.videoStreams[streamId]?.view ===
          undefined
      )
    ).toBe(true);
  });

  test('should update screen sharing participant when stream is available marked available or not', async () => {
    const { client, callId, participant } = await prepareCallWithRemoteParticipant();
    const participantKey = toFlatCommunicationIdentifier(participant.identifier);

    const stream = createMockRemoteScreenshareStream();
    participant.testHelperPushVideoStream(stream);
    expect(
      await waitWithBreakCondition(
        () =>
          Object.keys(client.getState().calls[callId]?.remoteParticipants[participantKey]?.videoStreams ?? {})
            .length !== 0
      )
    ).toBe(true);
    expect(client.getState().calls[callId]?.screenShareRemoteParticipant).not.toBeDefined();

    stream.isAvailable = true;
    stream.emit('isAvailableChanged');
    expect(
      await waitWithBreakCondition(() => client.getState().calls[callId]?.screenShareRemoteParticipant !== undefined)
    ).toBe(true);

    stream.isAvailable = false;
    stream.emit('isAvailableChanged');
    expect(
      await waitWithBreakCondition(() => client.getState().calls[callId]?.screenShareRemoteParticipant === undefined)
    ).toBe(true);
  });

  test('[xkcd] should not delete existing active screenshare screen when another stream is set unavailable', async () => {
    const { client, callId, call, participant: participant1 } = await prepareCallWithRemoteParticipant();

    // First participant has an active screenshare.
    const stream1 = createMockRemoteScreenshareStream(101);
    stream1.isAvailable = true;
    participant1.testHelperPushVideoStream(stream1);
    expect(
      await waitWithBreakCondition(
        () =>
          Object.keys(
            client.getState().calls[callId]?.remoteParticipants[toFlatCommunicationIdentifier(participant1.identifier)]
              ?.videoStreams ?? {}
          ).length !== 0
      )
    ).toBe(true);
    expect(
      await waitWithBreakCondition(() => client.getState().calls[callId]?.screenShareRemoteParticipant !== undefined)
    ).toBe(true);

    // Second participant joins.
    const participant2 = createMockRemoteParticipant('inactivePartner');
    call.testHelperPushRemoteParticipant(participant2);
    expect(
      await waitWithBreakCondition(
        () => Object.keys(client.getState().calls[callId]?.remoteParticipants ?? {}).length === 2
      )
    ).toBe(true);

    // Second participant adds an _inactive_ screenshare.
    const stream2 = createMockRemoteScreenshareStream(101);
    stream1.isAvailable = false;
    participant2.testHelperPushVideoStream(stream2);
    expect(
      await waitWithBreakCondition(
        () =>
          Object.keys(
            client.getState().calls[callId]?.remoteParticipants[toFlatCommunicationIdentifier(participant2.identifier)]
              ?.videoStreams ?? {}
          ).length !== 0
      )
    ).toBe(true);

    // Expect the first participant to remain the active screensharing participant.
    expect(client.getState().calls[callId]?.screenShareRemoteParticipant).toBeDefined();
    expect(client.getState().calls[callId]?.screenShareRemoteParticipant).toBe(
      toFlatCommunicationIdentifier(participant1.identifier)
    );
  });

  test('should not overwrite another stream of another participant if the stream ids are the same', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);

    // Participant with stream id 1
    const mockRemoteVideoStream = createMockRemoteVideoStream(1);
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

    const mockRemoteVideoStream2 = createMockRemoteVideoStream(1);
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
});

interface PreparedCall {
  client: StatefulCallClient;
  agent: MockCallAgent;
  callId: string;
  call: MockCall;
}

const prepareCall = async (): Promise<PreparedCall> => {
  const agent = createMockCallAgent();
  const client = createStatefulCallClientWithAgent(agent);

  await client.createCallAgent(stubCommunicationTokenCredential());

  const callId = 'preparedCallId';
  const call = createMockCall(callId);
  agent.testHelperPushCall(call);
  expect(await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 1)).toBe(true);
  return {
    client,
    agent,
    callId,
    call
  };
};

const prepareCallWithLocalVideoStream = async (): Promise<PreparedCall> => {
  const prepared = await prepareCall();
  const { client, callId, call } = prepared;
  call.testHelperPushLocalVideoStream({} as LocalVideoStream);
  expect(await waitWithBreakCondition(() => client.getState().calls[callId]?.localVideoStreams.length !== 0)).toBe(
    true
  );
  return prepared;
};

interface PreparedCallWithRemoteParticipant extends PreparedCall {
  participant: MockRemoteParticipant;
}

const prepareCallWithRemoteParticipant = async (): Promise<PreparedCallWithRemoteParticipant> => {
  const { agent, client, callId, call } = await prepareCall();

  const participant = createMockRemoteParticipant();
  call.testHelperPushRemoteParticipant(participant);
  expect(
    await waitWithBreakCondition(
      () => Object.keys(client.getState().calls[callId]?.remoteParticipants ?? {}).length !== 0
    )
  ).toBe(true);

  return {
    client,
    agent,
    callId,
    call,
    participant
  };
};

interface PreparedCallWithRemoteVideoStream extends PreparedCallWithRemoteParticipant {
  streamId: number;
}

const prepareCallWithRemoteVideoStream = async (): Promise<PreparedCallWithRemoteVideoStream> => {
  const prepared = await prepareCallWithRemoteParticipant();
  const { client, participant, callId } = prepared;
  const participantKey = toFlatCommunicationIdentifier(participant.identifier);

  const streamId = 7;
  const stream = createMockRemoteVideoStream(streamId);
  participant.testHelperPushVideoStream(stream);
  expect(
    await waitWithBreakCondition(
      () =>
        Object.keys(client.getState().calls[callId]?.remoteParticipants[participantKey]?.videoStreams ?? {}).length !==
        0
    )
  ).toBe(true);

  return { ...prepared, streamId };
};
