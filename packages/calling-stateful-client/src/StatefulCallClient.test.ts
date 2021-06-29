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
import { toFlatCommunicationIdentifier } from 'acs-ui-common';
import { convertSdkRemoteStreamToDeclarativeRemoteStream } from './Converter';
import { createStatefulCallClient, StatefulCallClient } from './StatefulCallClient';
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
  MockRemoteVideoStream,
  MockTranscriptionCallFeatureImpl,
  MockTransferCallFeatureImpl
} from './TestUtils';

mockoutObjectFreeze();

const mockCallId = 'a';
const mockCallId2 = 'b';
const mockParticipantCommunicationUserId = 'c';
const mockDisplayName = 'd';
const mockUserId = 'e';

let mockCallAgent: MockCallAgent;
jest.mock('@azure/communication-calling', () => {
  return {
    CallClient: jest.fn().mockImplementation(() => {
      return {
        createCallAgent: () => {
          return Promise.resolve(mockCallAgent);
        }
      };
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

interface TestData {
  mockCallAgent: MockCallAgent;
  mockCall: MockCall;
  mockRemoteParticipant: MockRemoteParticipant;
  mockStatefulCallClient: StatefulCallClient;
  mockRemoteVideoStream: MockRemoteVideoStream;
}

function createClientAndAgentMocks(testData: TestData): void {
  mockCallAgent = { calls: [] as ReadonlyArray<Call>, displayName: mockDisplayName } as MockCallAgent;
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

describe('Stateful call client', () => {
  test('should allow developer to specify userId and provide access to it in state', async () => {
    const StatefulCallClient = createStatefulCallClient({
      userId: { kind: 'communicationUser', communicationUserId: mockUserId }
    });
    expect(StatefulCallClient.getState().userId.communicationUserId).toBe(mockUserId);
  });

  test('should update callAgent state and have displayName when callAgent is created', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);

    expect(testData.mockStatefulCallClient.getState().callAgent).toBeDefined();
    expect(testData.mockStatefulCallClient.getState().callAgent?.displayName).toBe(mockDisplayName);
  });

  test('should update state when call added in `callUpdated` event and subscribe to call', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    expect(Object.keys(testData.mockStatefulCallClient.getState().calls).length).toBe(0);
    await createMockCallAndEmitCallsUpdated(testData);
    expect(Object.keys(testData.mockStatefulCallClient.getState().calls).length).toBe(1);
    expect(testData.mockCall.emitter.eventNames().length).not.toBe(0);
  });

  test('should update state when call removed in `callUpdated` event and unsubscribe to call', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);

    testData.mockCallAgent.calls = [];
    testData.mockCallAgent.emit('callsUpdated', {
      added: [],
      removed: [testData.mockCall]
    });

    await waitWithBreakCondition(() => Object.keys(testData.mockStatefulCallClient.getState().calls).length === 0);
    expect(testData.mockCall.emitter.eventNames().length).toBe(0);
  });

  test('should update state when call `stateChanged` event', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);

    testData.mockCall.state = 'InLobby';
    testData.mockCall.emit('stateChanged');

    await waitWithBreakCondition(
      () => testData.mockStatefulCallClient.getState().calls[mockCallId]?.state === 'InLobby'
    );
    expect(testData.mockStatefulCallClient.getState().calls[mockCallId]?.state === 'InLobby').toBe(true);
  });

  test('should update state when call `idChanged` event and update participantListeners', async () => {
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

  test('should update state when participant added in `remoteParticipantsUpdated` and subscribe to it', async () => {
    const testData = {} as TestData;
    createClientAndAgentMocks(testData);
    await createMockCallAndEmitCallsUpdated(testData);
    await createMockParticipantAndEmitParticipantUpdated(testData);
    expect(
      Object.keys(testData.mockStatefulCallClient.getState().calls[mockCallId]?.remoteParticipants ?? {}).length
    ).toBe(1);
    expect(testData.mockRemoteParticipant.emitter.eventNames().length).not.toBe(0);
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
