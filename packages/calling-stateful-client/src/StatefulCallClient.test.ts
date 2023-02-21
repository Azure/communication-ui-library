// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallAgent,
  DeviceManager,
  UserFacingDiagnosticsFeature,
  Features,
  RecordingCallFeature,
  TranscriptionCallFeature,
  VideoStreamRendererView,
  CallFeatureFactory,
  CallFeature
} from '@azure/communication-calling';
import { CommunicationUserKind } from '@azure/communication-common';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallError } from './CallClientState';
import { CallContext } from './CallContext';
import { InternalCallContext } from './InternalCallContext';
import { createStatefulCallClientWithDeps, StatefulCallClient } from './StatefulCallClient';
import {
  addMockEmitter,
  createMockApiFeatures,
  createMockCall,
  createMockCallAgent,
  createMockCallClient,
  createMockLocalVideoStream,
  createMockRemoteParticipant,
  createMockRemoteScreenshareStream,
  createMockRemoteVideoStream,
  createStatefulCallClientWithAgent,
  createStatefulCallClientWithBaseClient,
  MockCall,
  MockCallAgent,
  MockRecordingCallFeatureImpl,
  MockRemoteParticipant,
  MockRemoteVideoStream,
  MockTranscriptionCallFeatureImpl,
  StateChangeListener,
  stubCommunicationTokenCredential,
  StubDiagnosticsCallFeatureImpl,
  waitWithBreakCondition
} from './TestUtils';

jest.mock('@azure/communication-calling', () => {
  return {
    VideoStreamRenderer: jest.fn().mockImplementation(() => {
      return {
        createView: () => {
          return Promise.resolve<VideoStreamRendererView>({} as VideoStreamRendererView);
        },
        dispose: () => {
          // Nothing to dipose is fake implementation.
        }
      };
    }),
    Features: {
      get Recording(): CallFeatureFactory<RecordingCallFeature> {
        return { callApiCtor: MockRecordingCallFeatureImpl };
      },
      get Transcription(): CallFeatureFactory<TranscriptionCallFeature> {
        return { callApiCtor: MockTranscriptionCallFeatureImpl };
      },
      get Diagnostics(): CallFeatureFactory<UserFacingDiagnosticsFeature> {
        return { callApiCtor: StubDiagnosticsCallFeatureImpl };
      }
    }
  };
});

describe('Stateful call client', () => {
  test('should allow developer to specify userId and provide access to it in state', async () => {
    const userId: CommunicationUserKind = { kind: 'communicationUser', communicationUserId: 'someUser' };
    const client = createStatefulCallClientWithDeps(
      createMockCallClient(),
      new CallContext(userId),
      new InternalCallContext()
    );
    expect(client.getState().userId).toEqual(userId);
  });

  test('should update callAgent state and have displayName when callAgent is created', async () => {
    const displayName = 'booyaa';
    const agent = createMockCallAgent(displayName);
    const client = createStatefulCallClientWithAgent(agent);

    await client.createCallAgent(stubCommunicationTokenCredential());
    expect(client.getState().callAgent).toBeDefined();
    expect(client.getState().callAgent?.displayName).toBe(displayName);
  });

  /* @conditional-compile-remove(PSTN-calls) */
  test('should update CallClient state and have alternateCallerId set when callAgent is created', async () => {
    const phoneNumber = '+15555555';
    const userId: CommunicationUserKind = { kind: 'communicationUser', communicationUserId: 'someUser' };
    const client = createStatefulCallClientWithDeps(
      createMockCallClient(),
      new CallContext(userId, undefined, phoneNumber),
      new InternalCallContext()
    );
    expect(client.getState().alternateCallerId).toEqual(phoneNumber);
  });

  test('should update call in state when new call is added and removed', async () => {
    const agent = createMockCallAgent();
    const client = createStatefulCallClientWithAgent(agent);

    await client.createCallAgent(stubCommunicationTokenCredential());

    {
      const listener = new StateChangeListener(client);
      agent.testHelperPushCall(createMockCall());
      expect(await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 1)).toBe(true);
      expect(await waitWithBreakCondition(() => Object.keys(client.getState().callsEnded).length === 0)).toBe(true);
      expect(listener.onChangeCalledCount).toBe(1);
    }
    {
      const listener = new StateChangeListener(client);
      agent.testHelperPopCall();
      expect(await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 0)).toBe(true);
      expect(await waitWithBreakCondition(() => Object.keys(client.getState().callsEnded).length === 1)).toBe(true);
      expect(listener.onChangeCalledCount).toBe(1);
    }
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
      expect(listener.onChangeCalledCount).toBe(1);
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
      call.testHelperPushLocalVideoStream(createMockLocalVideoStream());
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
      expect(listener.onChangeCalledCount).toBe(1);
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
      expect(listener.onChangeCalledCount).toBe(1);
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
    call.testHelperPushLocalVideoStream(createMockLocalVideoStream());
    expect(await waitWithBreakCondition(() => client.getState().calls[callId]?.localVideoStreams.length !== 0)).toBe(
      true
    );

    agent.testHelperPopCall();

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

  test('should not delete existing active screenshare screen when another stream is set unavailable', async () => {
    const { client, callId, call, participant: participant1 } = await prepareCallWithRemoteParticipant();

    // First participant has an active screenshare.
    const stream1 = createMockRemoteScreenshareStream(1);
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
    const stream2 = createMockRemoteScreenshareStream(2);
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
    const {
      client,
      callId,
      call,
      participant: participant1,
      streamId,
      stream: stream1
    } = await prepareCallWithRemoteVideoStream();

    // Second participant joins.
    const participant2 = createMockRemoteParticipant('flakyPartner');
    call.testHelperPushRemoteParticipant(participant2);
    expect(
      await waitWithBreakCondition(
        () => Object.keys(client.getState().calls[callId]?.remoteParticipants ?? {}).length === 2
      )
    ).toBe(true);

    // Second participant adds video stream with the same streamId as the first participant.
    const stream2 = createMockRemoteVideoStream(streamId);
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

    // Second participant removes their video stream.
    participant2.videoStreams = [];
    participant2.emit('videoStreamsUpdated', {
      added: [],
      removed: [stream2]
    });
    expect(
      await waitWithBreakCondition(
        () =>
          Object.keys(
            client.getState().calls[callId]?.remoteParticipants[toFlatCommunicationIdentifier(participant2.identifier)]
              ?.videoStreams ?? {}
          ).length === 0
      )
    ).toBe(true);

    // Expect first participant to still be able to render video because their stream is untouched.
    await client.createView(callId, participant1.identifier, stream1);
    expect(
      await waitWithBreakCondition(
        () =>
          client.getState().calls[callId]?.remoteParticipants[toFlatCommunicationIdentifier(participant1.identifier)]
            ?.videoStreams[streamId]?.view !== undefined
      )
    ).toBe(true);
  });

  test('should detect recording state of call', async () => {
    const recording = addMockEmitter({ name: 'Default', isRecordingActive: true });

    const { client, callId } = await prepareCallWithFeatures(
      createMockApiFeatures(new Map([[Features.Recording, recording]]))
    );
    expect(await waitWithBreakCondition(() => client.getState().calls[callId]?.recording.isRecordingActive)).toBe(true);

    recording.isRecordingActive = false;
    recording.emitter.emit('isRecordingActiveChanged');
    expect(await waitWithBreakCondition(() => !client.getState().calls[callId]?.recording.isRecordingActive)).toBe(
      true
    );
  });

  test('should detect transcription state of call', async () => {
    const transcription = addMockEmitter({ name: 'Default', isTranscriptionActive: true });
    const { client, callId } = await prepareCallWithFeatures(
      createMockApiFeatures(new Map([[Features.Transcription, transcription]]))
    );
    expect(
      await waitWithBreakCondition(() => client.getState().calls[callId]?.transcription.isTranscriptionActive)
    ).toBe(true);

    transcription.isTranscriptionActive = false;
    transcription.emitter.emit('isTranscriptionActiveChanged');
    expect(
      await waitWithBreakCondition(() => !client.getState().calls[callId]?.transcription.isTranscriptionActive)
    ).toBe(true);
  });

  test('should not update state for an ended call', async () => {
    const recording = addMockEmitter({ name: 'Default', isRecordingActive: true });
    const transcription = addMockEmitter({ name: 'Default', isTranscriptionActive: true });
    const { client, agent, callId } = await prepareCallWithFeatures(
      createMockApiFeatures(
        new Map<any, any>([
          [Features.Recording, recording],
          [Features.Transcription, transcription]
        ])
      )
    );
    expect(client.getState().calls[callId]?.recording.isRecordingActive).toBe(true);
    expect(client.getState().calls[callId]?.transcription.isTranscriptionActive).toBe(true);

    agent.testHelperPopCall();
    expect(await waitWithBreakCondition(() => Object.keys(client.getState().callsEnded).length === 1)).toBe(true);
    const callEnded = client.getState().callsEnded[callId];

    // Once the call ends, expect that call state is no longer updated.
    recording.isRecordingActive = false;
    recording.emitter.emit('isRecordingActiveChanged');
    expect(callEnded.recording.isRecordingActive).toBe(true);

    transcription.isTranscriptionActive = false;
    transcription.emitter.emit('isTranscriptionActiveChanged');
    expect(callEnded.transcription.isTranscriptionActive).toBe(true);
  });
});

describe('errors should be reported correctly from StatefulCallClient when', () => {
  test('createCallAgent fails', async () => {
    const baseClient = createMockCallClient();
    baseClient.createCallAgent = (): Promise<CallAgent> => {
      throw new Error('injected error');
    };

    const client = createStatefulCallClientWithBaseClient(baseClient);
    const listener = new StateChangeListener(client);

    await expect(client.createCallAgent(stubCommunicationTokenCredential())).rejects.toThrow(
      new CallError('CallClient.createCallAgent', new Error('injected error'))
    );
    expect(listener.onChangeCalledCount).toBe(1);
    expect(client.getState().latestErrors['CallClient.createCallAgent']).toBeDefined();
  });

  test('getDeviceManager fails', async () => {
    const baseClient = createMockCallClient();
    baseClient.getDeviceManager = (): Promise<DeviceManager> => {
      throw new Error('injected error');
    };

    const client = createStatefulCallClientWithBaseClient(baseClient);
    const listener = new StateChangeListener(client);

    await expect(client.getDeviceManager()).rejects.toThrow(
      new CallError('CallClient.getDeviceManager', new Error('injected error'))
    );
    expect(listener.onChangeCalledCount).toBe(1);
    expect(client.getState().latestErrors['CallClient.getDeviceManager']).toBeDefined();
  });
});

describe('errors should be reported correctly from Call when', () => {
  test('mute or unmute fails', async () => {
    const { client, call: baseCall, statefulCallAgent: agent } = await prepareCall();
    baseCall.mute = async (): Promise<void> => {
      throw new Error('mute: injected error');
    };
    baseCall.unmute = async (): Promise<void> => {
      throw new Error('unmute: injected error');
    };

    const call = agent.calls[0];
    expect(call).toBeDefined();

    {
      const listener = new StateChangeListener(client);
      await expect(call.mute()).rejects.toThrow(new CallError('Call.mute', new Error('mute: injected error')));
      expect(listener.onChangeCalledCount).toBe(1);
      expect(client.getState().latestErrors['Call.mute']).toBeDefined();
    }
    {
      const listener = new StateChangeListener(client);
      await expect(call.unmute()).rejects.toThrow(new CallError('Call.unmute', new Error('unmute: injected error')));
      expect(listener.onChangeCalledCount).toBe(1);
      expect(client.getState().latestErrors['Call.unmute']).toBeDefined();
    }
  });

  test('startVideo or stopVideo fails', async () => {
    const { client, call: baseCall, statefulCallAgent: agent } = await prepareCall();
    baseCall.startVideo = async (): Promise<void> => {
      throw new Error('startVideo: injected error');
    };
    baseCall.stopVideo = async (): Promise<void> => {
      throw new Error('stopVideo: injected error');
    };

    const call = agent.calls[0];
    expect(call).toBeDefined();

    {
      const listener = new StateChangeListener(client);
      await expect(call.startVideo(createMockLocalVideoStream())).rejects.toThrow(
        new CallError('Call.startVideo', new Error('startVideo: injected error'))
      );
      expect(listener.onChangeCalledCount).toBe(1);
      expect(client.getState().latestErrors['Call.startVideo']).toBeDefined();
    }
    {
      const listener = new StateChangeListener(client);
      await expect(call.stopVideo(createMockLocalVideoStream())).rejects.toThrow(
        new CallError('Call.stopVideo', new Error('stopVideo: injected error'))
      );
      expect(listener.onChangeCalledCount).toBe(1);
      expect(client.getState().latestErrors['Call.stopVideo']).toBeDefined();
    }
  });

  test('startScreenSharing or stopScreenSharing fails', async () => {
    const { client, call: baseCall, statefulCallAgent: agent } = await prepareCall();
    baseCall.startScreenSharing = async (): Promise<void> => {
      throw new Error('startScreenSharing: injected error');
    };
    baseCall.stopScreenSharing = async (): Promise<void> => {
      throw new Error('stopScreenSharing: injected error');
    };

    const call = agent.calls[0];
    expect(call).toBeDefined();

    {
      const listener = new StateChangeListener(client);
      await expect(call.startScreenSharing()).rejects.toThrow(
        new CallError('Call.startScreenSharing', new Error('startScreenSharing: injected error'))
      );
      expect(listener.onChangeCalledCount).toBe(1);
      expect(client.getState().latestErrors['Call.startScreenSharing']).toBeDefined();
    }
    {
      const listener = new StateChangeListener(client);
      await expect(call.stopScreenSharing()).rejects.toThrow(
        new CallError('Call.stopScreenSharing', new Error('stopScreenSharing: injected error'))
      );
      expect(listener.onChangeCalledCount).toBe(1);
      expect(client.getState().latestErrors['Call.stopScreenSharing']).toBeDefined();
    }
  });
});

interface PreparedCall {
  client: StatefulCallClient;
  agent: MockCallAgent;
  callId: string;
  call: MockCall;
  statefulCallAgent: CallAgent;
}

const prepareCall = async (): Promise<PreparedCall> => {
  const agent = createMockCallAgent();
  const client = createStatefulCallClientWithAgent(agent);

  const statefulCallAgent = await client.createCallAgent(stubCommunicationTokenCredential());

  const callId = 'preparedCallId';
  const call = createMockCall(callId);
  agent.testHelperPushCall(call);
  expect(await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 1)).toBe(true);
  return {
    client,
    agent,
    callId,
    call,
    statefulCallAgent
  };
};

const prepareCallWithLocalVideoStream = async (): Promise<PreparedCall> => {
  const prepared = await prepareCall();
  const { client, callId, call } = prepared;
  call.testHelperPushLocalVideoStream(createMockLocalVideoStream());
  expect(await waitWithBreakCondition(() => client.getState().calls[callId]?.localVideoStreams.length !== 0)).toBe(
    true
  );
  return prepared;
};

interface PreparedCallWithRemoteParticipant extends PreparedCall {
  participant: MockRemoteParticipant;
}

const prepareCallWithRemoteParticipant = async (): Promise<PreparedCallWithRemoteParticipant> => {
  const preparedCall = await prepareCall();
  const { client, callId, call } = preparedCall;

  const participant = createMockRemoteParticipant();
  call.testHelperPushRemoteParticipant(participant);
  expect(
    await waitWithBreakCondition(
      () => Object.keys(client.getState().calls[callId]?.remoteParticipants ?? {}).length !== 0
    )
  ).toBe(true);

  return { ...preparedCall, participant };
};

interface PreparedCallWithRemoteVideoStream extends PreparedCallWithRemoteParticipant {
  streamId: number;
  stream: MockRemoteVideoStream;
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

  return { ...prepared, streamId, stream };
};

const prepareCallWithFeatures = async (
  feature: <TFeature extends CallFeature>(cls: CallFeatureFactory<TFeature>) => TFeature
): Promise<PreparedCall> => {
  const agent = createMockCallAgent();
  const client = createStatefulCallClientWithAgent(agent);

  const statefulCallAgent = await client.createCallAgent(stubCommunicationTokenCredential());

  const callId = 'preparedCallId';
  const call = createMockCall(callId);
  call.feature = feature;
  agent.testHelperPushCall(call);
  expect(await waitWithBreakCondition(() => Object.keys(client.getState().calls).length === 1)).toBe(true);
  return {
    client,
    agent,
    callId,
    call,
    statefulCallAgent
  };
};
