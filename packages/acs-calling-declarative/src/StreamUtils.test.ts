// © Microsoft Corporation. All rights reserved.

import {
  CallerInfo,
  CreateViewOptions,
  VideoStreamRendererView,
  LocalVideoStream as SdkLocalVideoStream,
  RemoteVideoStream as SdkRemoteVideoStream,
  VideoDeviceInfo
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
    LocalVideoStream: jest.fn().mockImplementation((info: VideoDeviceInfo) => {
      return {
        source: () => {
          return {} as VideoDeviceInfo;
        },
        mediaStreamType: () => {
          return 'Video';
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        switchSource: (videoDeviceInfo: VideoDeviceInfo) => {
          return Promise.resolve();
        }
      };
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

function createMockCall(mockCallId: string): Call {
  const call: Call = {
    id: mockCallId,
    callerInfo: {} as CallerInfo,
    state: 'None',
    direction: 'Incoming',
    isMuted: true,
    isScreenSharingOn: false,
    localVideoStreams: [],
    remoteParticipants: new Map<string, RemoteParticipant>(),
    remoteParticipantsEnded: new Map<string, RemoteParticipant>(),
    startTime: new Date(),
    endTime: undefined
  };
  return call;
}

function addMockRemoteStreamAndParticipant(call: Call, key: string, id: number): RemoteVideoStream {
  const participant: RemoteParticipant = {
    identifier: {} as CommunicationUserKind,
    state: 'Connected',
    videoStreams: new Map<number, RemoteVideoStream>(),
    isMuted: true,
    isSpeaking: false
  };
  const remoteVideoStream: RemoteVideoStream = {
    id: id,
    mediaStreamType: 'Video',
    isAvailable: true,
    videoStreamRendererView: undefined
  };
  participant.videoStreams.set(id, remoteVideoStream);
  call.remoteParticipants.set(key, participant);
  return remoteVideoStream;
}

function createContexts(): TestData {
  const context = new CallContext();
  const internalContext = new InternalCallContext();

  return {
    context: context,
    internalContext: internalContext
  };
}

function addSdkRemoteStream(internalContext: InternalCallContext, callId: string, key: string, id: number): void {
  const sdkRemoteVideoStream = createMockRemoteVideoStream(true);
  sdkRemoteVideoStream.id = id;
  internalContext.setRemoteVideoStream(callId, key, sdkRemoteVideoStream);
}

function addMockLocalStream(call: Call): void {
  call.localVideoStreams.push({} as LocalVideoStream);
}

function addSdkLocalStream(internalContext: InternalCallContext, callId: string): void {
  internalContext.setLocalVideoStream(callId, new SdkLocalVideoStream({} as VideoDeviceInfo));
}

describe('stream utils', () => {
  test('stores the correct state and start rendering when startRenderVideo is called on remote stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantKey, mockStreamId);
    context.setCall(call);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantKey, mockStreamId);

    await startRenderVideo(context, internalContext, mockCallId, remoteVideoStream);

    expect(internalContext.getRemoteParticipantKey(mockCallId, mockStreamId)).toBe(mockParticipantKey);
    expect(internalContext.getRemoteVideoStreamRenderer(mockCallId, mockStreamId)).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(mockParticipantKey)
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).toBeDefined();
  });

  test('cleans up state and stop rendering when stopRenderVideo is called on remote stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantKey, mockStreamId);
    context.setCall(call);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantKey, mockStreamId);

    await startRenderVideo(context, internalContext, mockCallId, remoteVideoStream);

    stopRenderVideo(context, internalContext, mockCallId, remoteVideoStream);

    expect(internalContext.getRemoteVideoStreamRenderer(mockCallId, mockStreamId)).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(mockParticipantKey)
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).not.toBeDefined();
  });

  test('cleans up state and stop rendering when stopRenderVideoAll is called on multiple remote streams', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantKey, mockStreamId);
    const remoteVideoStream2 = addMockRemoteStreamAndParticipant(call, mockParticipantKey2, mockStreamId2);
    context.setCall(call);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantKey, mockStreamId);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantKey2, mockStreamId2);

    await startRenderVideo(context, internalContext, mockCallId, remoteVideoStream);
    await startRenderVideo(context, internalContext, mockCallId, remoteVideoStream2);

    expect(internalContext.getRemoteParticipantKey(mockCallId, mockStreamId)).toBe(mockParticipantKey);
    expect(internalContext.getRemoteParticipantKey(mockCallId, mockStreamId2)).toBe(mockParticipantKey2);
    expect(internalContext.getRemoteVideoStreamRenderer(mockCallId, mockStreamId)).toBeDefined();
    expect(internalContext.getRemoteVideoStreamRenderer(mockCallId, mockStreamId2)).toBeDefined();
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

    expect(internalContext.getRemoteVideoStreamRenderer(mockCallId, mockStreamId)).not.toBeDefined();
    expect(internalContext.getRemoteVideoStreamRenderer(mockCallId, mockStreamId2)).not.toBeDefined();
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

  test('cleans up state and stop rendering if stopRenderVideoAllCalls called on multiple remote streams', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantKey, mockStreamId);
    const call2 = createMockCall(mockCallId2);
    const remoteVideoStream2 = addMockRemoteStreamAndParticipant(call2, mockParticipantKey2, mockStreamId2);
    context.setCall(call);
    context.setCall(call2);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantKey, mockStreamId);
    addSdkRemoteStream(internalContext, mockCallId2, mockParticipantKey2, mockStreamId2);

    await startRenderVideo(context, internalContext, mockCallId, remoteVideoStream);
    await startRenderVideo(context, internalContext, mockCallId2, remoteVideoStream2);

    expect(internalContext.getRemoteParticipantKey(mockCallId, mockStreamId)).toBe(mockParticipantKey);
    expect(internalContext.getRemoteParticipantKey(mockCallId2, mockStreamId2)).toBe(mockParticipantKey2);
    expect(internalContext.getRemoteVideoStreamRenderer(mockCallId, mockStreamId)).toBeDefined();
    expect(internalContext.getRemoteVideoStreamRenderer(mockCallId2, mockStreamId2)).toBeDefined();
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

    expect(internalContext.getRemoteVideoStreamRenderer(mockCallId, mockStreamId)).not.toBeDefined();
    expect(internalContext.getRemoteVideoStreamRenderer(mockCallId2, mockStreamId2)).not.toBeDefined();
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

  test('stores the correct state and start rendering when startRenderVideo is called on local stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    addMockLocalStream(call);
    context.setCall(call);
    addSdkLocalStream(internalContext, mockCallId);

    await startRenderVideo(context, internalContext, mockCallId, {} as LocalVideoStream);

    expect(internalContext.getLocalVideoStream(mockCallId)).toBeDefined();
    expect(internalContext.getLocalVideoStreamRenderer(mockCallId)).toBeDefined();
    expect(context.getState().calls.get(mockCallId)?.localVideoStreams[0].videoStreamRendererView).toBeDefined();
  });

  test('cleans up state and stop rendering when stopRenderVideo is called on remote stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    addMockLocalStream(call);
    context.setCall(call);
    addSdkLocalStream(internalContext, mockCallId);

    await startRenderVideo(context, internalContext, mockCallId, {} as LocalVideoStream);

    stopRenderVideo(context, internalContext, mockCallId, {} as LocalVideoStream);

    expect(internalContext.getLocalVideoStreamRenderer(mockCallId)).not.toBeDefined();
    expect(context.getState().calls.get(mockCallId)?.localVideoStreams[0].videoStreamRendererView).not.toBeDefined();
  });
});
