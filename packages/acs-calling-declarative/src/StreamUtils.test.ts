// © Microsoft Corporation. All rights reserved.

import {
  CallerInfo,
  CreateViewOptions,
  VideoStreamRendererView,
  LocalVideoStream as SdkLocalVideoStream,
  RemoteVideoStream as SdkRemoteVideoStream
} from '@azure/communication-calling';
import { CommunicationUserKind } from '@azure/communication-common';
import { Call, LocalVideoStream, RemoteParticipant, RemoteVideoStream } from './CallClientState';
import { CallContext } from './CallContext';
import { InternalCallContext } from './InternalCallContext';
import { startRenderVideo, stopRenderVideo, stopRenderVideoAll, stopRenderVideoAllCalls } from './StreamUtils';
import { createMockRemoteVideoStream } from './TestUtils';

jest.mock('@azure/communication-calling', () => {
  return {
    CallClient: jest.fn().mockImplementation(() => {
      return {};
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    VideoStreamRenderer: jest.fn().mockImplementation((videoStream: SdkLocalVideoStream | SdkRemoteVideoStream) => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        createView: (options?: CreateViewOptions) => {
          return Promise.resolve<VideoStreamRendererView>({} as VideoStreamRendererView);
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        dispose: () => {}
      };
    })
  };
});

const mockCallId = 'callId';
const mockCallId2 = 'callId2';
const mockParticipantKey = 'participantKey';
const mockParticipantKey2 = 'participantKey2';
const mockStreamId = 1;
const mockStreamId2 = 2;

interface TestData {
  context: CallContext;
  internalContext: InternalCallContext;
}

function setupDefaultTestData(): TestData {
  const call: Call = {
    id: mockCallId,
    callerInfo: {} as CallerInfo,
    state: 'None',
    direction: 'Incoming',
    isMuted: true,
    isScreenSharingOn: false,
    localVideoStreams: [] as ReadonlyArray<LocalVideoStream>,
    remoteParticipants: new Map<string, RemoteParticipant>(),
    remoteParticipantsEnded: new Map<string, RemoteParticipant>(),
    startTime: new Date(),
    endTime: undefined
  };
  const participant: RemoteParticipant = {
    identifier: {} as CommunicationUserKind,
    state: 'Connected',
    videoStreams: new Map<number, RemoteVideoStream>(),
    isMuted: true,
    isSpeaking: false
  };
  call.remoteParticipants.set(mockParticipantKey, participant);
  const remoteVideoStream: RemoteVideoStream = {
    id: mockStreamId,
    mediaStreamType: 'Video',
    isAvailable: true,
    videoStreamRendererView: undefined
  };
  participant.videoStreams.set(mockStreamId, remoteVideoStream);

  const context = new CallContext();
  context.setCall(call);

  const sdkRemoteVideoStream = createMockRemoteVideoStream(true);
  sdkRemoteVideoStream.id = mockStreamId;

  const internalContext = new InternalCallContext();
  internalContext.setRemoteVideoStream(mockCallId, mockParticipantKey, sdkRemoteVideoStream);

  return {
    context: context,
    internalContext: internalContext
  };
}

function setupDefaultTestDataWithMultipleStreams(): TestData {
  const call: Call = {
    id: mockCallId,
    callerInfo: {} as CallerInfo,
    state: 'None',
    direction: 'Incoming',
    isMuted: true,
    isScreenSharingOn: false,
    localVideoStreams: [] as ReadonlyArray<LocalVideoStream>,
    remoteParticipants: new Map<string, RemoteParticipant>(),
    remoteParticipantsEnded: new Map<string, RemoteParticipant>(),
    startTime: new Date(),
    endTime: undefined
  };
  const participant: RemoteParticipant = {
    identifier: {} as CommunicationUserKind,
    state: 'Connected',
    videoStreams: new Map<number, RemoteVideoStream>(),
    isMuted: true,
    isSpeaking: false
  };
  call.remoteParticipants.set(mockParticipantKey, participant);
  const remoteVideoStream: RemoteVideoStream = {
    id: mockStreamId,
    mediaStreamType: 'Video',
    isAvailable: true,
    videoStreamRendererView: undefined
  };
  participant.videoStreams.set(mockStreamId, remoteVideoStream);

  const participant2: RemoteParticipant = {
    identifier: {} as CommunicationUserKind,
    state: 'Connected',
    videoStreams: new Map<number, RemoteVideoStream>(),
    isMuted: true,
    isSpeaking: false
  };
  call.remoteParticipants.set(mockParticipantKey2, participant2);
  const remoteVideoStream2: RemoteVideoStream = {
    id: mockStreamId,
    mediaStreamType: 'Video',
    isAvailable: true,
    videoStreamRendererView: undefined
  };
  participant2.videoStreams.set(mockStreamId2, remoteVideoStream2);

  const context = new CallContext();
  context.setCall(call);

  const sdkRemoteVideoStream = createMockRemoteVideoStream(true);
  sdkRemoteVideoStream.id = mockStreamId;

  const sdkRemoteVideoStream2 = createMockRemoteVideoStream(true);
  sdkRemoteVideoStream2.id = mockStreamId2;

  const internalContext = new InternalCallContext();
  internalContext.setRemoteVideoStream(mockCallId, mockParticipantKey, sdkRemoteVideoStream);
  internalContext.setRemoteVideoStream(mockCallId, mockParticipantKey2, sdkRemoteVideoStream2);

  return {
    context: context,
    internalContext: internalContext
  };
}

function setupDefaultTestDataMultipleCalls(): TestData {
  const call: Call = {
    id: mockCallId,
    callerInfo: {} as CallerInfo,
    state: 'None',
    direction: 'Incoming',
    isMuted: true,
    isScreenSharingOn: false,
    localVideoStreams: [] as ReadonlyArray<LocalVideoStream>,
    remoteParticipants: new Map<string, RemoteParticipant>(),
    remoteParticipantsEnded: new Map<string, RemoteParticipant>(),
    startTime: new Date(),
    endTime: undefined
  };
  const participant: RemoteParticipant = {
    identifier: {} as CommunicationUserKind,
    state: 'Connected',
    videoStreams: new Map<number, RemoteVideoStream>(),
    isMuted: true,
    isSpeaking: false
  };
  call.remoteParticipants.set(mockParticipantKey, participant);
  const remoteVideoStream: RemoteVideoStream = {
    id: mockStreamId,
    mediaStreamType: 'Video',
    isAvailable: true,
    videoStreamRendererView: undefined
  };
  participant.videoStreams.set(mockStreamId, remoteVideoStream);

  const context = new CallContext();
  context.setCall(call);

  const call2: Call = {
    id: mockCallId2,
    callerInfo: {} as CallerInfo,
    state: 'None',
    direction: 'Incoming',
    isMuted: true,
    isScreenSharingOn: false,
    localVideoStreams: [] as ReadonlyArray<LocalVideoStream>,
    remoteParticipants: new Map<string, RemoteParticipant>(),
    remoteParticipantsEnded: new Map<string, RemoteParticipant>(),
    startTime: new Date(),
    endTime: undefined
  };
  const participant2: RemoteParticipant = {
    identifier: {} as CommunicationUserKind,
    state: 'Connected',
    videoStreams: new Map<number, RemoteVideoStream>(),
    isMuted: true,
    isSpeaking: false
  };
  call2.remoteParticipants.set(mockParticipantKey2, participant2);
  const remoteVideoStream2: RemoteVideoStream = {
    id: mockStreamId2,
    mediaStreamType: 'Video',
    isAvailable: true,
    videoStreamRendererView: undefined
  };
  participant2.videoStreams.set(mockStreamId2, remoteVideoStream2);

  context.setCall(call2);

  const sdkRemoteVideoStream = createMockRemoteVideoStream(true);
  sdkRemoteVideoStream.id = mockStreamId;

  const sdkRemoteVideoStream2 = createMockRemoteVideoStream(true);
  sdkRemoteVideoStream2.id = mockStreamId2;

  const internalContext = new InternalCallContext();
  internalContext.setRemoteVideoStream(mockCallId, mockParticipantKey, sdkRemoteVideoStream);
  internalContext.setRemoteVideoStream(mockCallId2, mockParticipantKey2, sdkRemoteVideoStream2);

  return {
    context: context,
    internalContext: internalContext
  };
}

describe('stream utils', () => {
  test('should store the correct state and start rendering when startRenderVideo is called', async () => {
    const { context, internalContext } = setupDefaultTestData();

    await startRenderVideo(context, internalContext, mockCallId, mockStreamId);

    expect(internalContext.getRemoteParticipantKey(mockCallId, mockStreamId)).toBe(mockParticipantKey);
    expect(internalContext.getVideoStreamRenderer(mockCallId, mockStreamId)).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(mockParticipantKey)
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).toBeDefined();
  });

  test('should clean up state and stop rendering when stopRenderVideo is called', async () => {
    const { context, internalContext } = setupDefaultTestData();

    await startRenderVideo(context, internalContext, mockCallId, mockStreamId);

    stopRenderVideo(context, internalContext, mockCallId, mockStreamId);

    expect(internalContext.getVideoStreamRenderer(mockCallId, mockStreamId)).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(mockParticipantKey)
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).not.toBeDefined();
  });

  test('should clean up multiple state and stop rendering when stopRenderVideoAll is called', async () => {
    const { context, internalContext } = setupDefaultTestDataWithMultipleStreams();

    await startRenderVideo(context, internalContext, mockCallId, mockStreamId);
    await startRenderVideo(context, internalContext, mockCallId, mockStreamId2);

    expect(internalContext.getRemoteParticipantKey(mockCallId, mockStreamId)).toBe(mockParticipantKey);
    expect(internalContext.getRemoteParticipantKey(mockCallId, mockStreamId2)).toBe(mockParticipantKey2);
    expect(internalContext.getVideoStreamRenderer(mockCallId, mockStreamId)).toBeDefined();
    expect(internalContext.getVideoStreamRenderer(mockCallId, mockStreamId2)).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(mockParticipantKey)
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(mockParticipantKey2)
        ?.videoStreams.get(mockStreamId2)?.videoStreamRendererView
    ).toBeDefined();

    stopRenderVideoAll(context, internalContext, mockCallId);

    expect(internalContext.getVideoStreamRenderer(mockCallId, mockStreamId)).not.toBeDefined();
    expect(internalContext.getVideoStreamRenderer(mockCallId, mockStreamId2)).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(mockParticipantKey)
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(mockParticipantKey2)
        ?.videoStreams.get(mockStreamId2)?.videoStreamRendererView
    ).not.toBeDefined();
  });

  test('should clean up multiple state and stop rendering when stopRenderVideoAllCalls is called', async () => {
    const { context, internalContext } = setupDefaultTestDataMultipleCalls();

    await startRenderVideo(context, internalContext, mockCallId, mockStreamId);
    await startRenderVideo(context, internalContext, mockCallId2, mockStreamId2);

    expect(internalContext.getRemoteParticipantKey(mockCallId, mockStreamId)).toBe(mockParticipantKey);
    expect(internalContext.getRemoteParticipantKey(mockCallId2, mockStreamId2)).toBe(mockParticipantKey2);
    expect(internalContext.getVideoStreamRenderer(mockCallId, mockStreamId)).toBeDefined();
    expect(internalContext.getVideoStreamRenderer(mockCallId2, mockStreamId2)).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(mockParticipantKey)
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId2)
        ?.remoteParticipants.get(mockParticipantKey2)
        ?.videoStreams.get(mockStreamId2)?.videoStreamRendererView
    ).toBeDefined();

    stopRenderVideoAllCalls(context, internalContext);

    expect(internalContext.getVideoStreamRenderer(mockCallId, mockStreamId)).not.toBeDefined();
    expect(internalContext.getVideoStreamRenderer(mockCallId2, mockStreamId2)).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(mockParticipantKey)
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId2)
        ?.remoteParticipants.get(mockParticipantKey2)
        ?.videoStreams.get(mockStreamId2)?.videoStreamRendererView
    ).not.toBeDefined();
  });
});
