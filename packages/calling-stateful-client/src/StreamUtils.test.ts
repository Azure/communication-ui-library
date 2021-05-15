// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
import { getRemoteParticipantKey } from './Converter';
import { InternalCallContext } from './InternalCallContext';
import {
  MAX_UNPARENTED_VIEWS_LENGTH,
  startRenderVideo,
  stopRenderVideo,
  stopRenderAllVideosForAllCalls,
  stopRenderAllVideosForCall
} from './StreamUtils';
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
const mockParticipantIdentifier = {
  kind: 'communicationUser',
  communicationUserId: 'participantKey'
} as CommunicationUserKind;
const mockParticipantIdentifier2 = {
  kind: 'communicationUser',
  communicationUserId: 'participantKey2'
} as CommunicationUserKind;
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
    recording: { isRecordingActive: false },
    transcription: { isTranscriptionActive: false },
    transfer: { receivedTransferRequests: [], requestedTransfers: [] },
    startTime: new Date(),
    endTime: undefined
  };
  return call;
}

function addMockRemoteStreamAndParticipant(
  call: Call,
  identifier: CommunicationUserKind,
  streamId: number
): RemoteVideoStream {
  const participant: RemoteParticipant = {
    identifier: identifier,
    state: 'Connected',
    videoStreams: new Map<number, RemoteVideoStream>(),
    isMuted: true,
    isSpeaking: false
  };
  const remoteVideoStream: RemoteVideoStream = {
    id: streamId,
    mediaStreamType: 'Video',
    isAvailable: true,
    videoStreamRendererView: undefined
  };
  participant.videoStreams.set(streamId, remoteVideoStream);
  call.remoteParticipants.set(getRemoteParticipantKey(identifier), participant);
  return remoteVideoStream;
}

function createContexts(): TestData {
  const context = new CallContext('');
  const internalContext = new InternalCallContext();

  return {
    context: context,
    internalContext: internalContext
  };
}

function addSdkRemoteStream(
  internalContext: InternalCallContext,
  callId: string,
  identifier: CommunicationUserKind,
  streamId: number
): void {
  const sdkRemoteVideoStream = createMockRemoteVideoStream(true);
  sdkRemoteVideoStream.id = streamId;
  internalContext.setRemoteStreamAndRenderer(
    callId,
    getRemoteParticipantKey(identifier),
    streamId,
    sdkRemoteVideoStream,
    undefined
  );
}

function addMockLocalStream(call: Call): void {
  call.localVideoStreams.push({} as LocalVideoStream);
}

function addSdkLocalStream(internalContext: InternalCallContext, callId: string): void {
  internalContext.setLocalStreamAndRenderer(callId, new SdkLocalVideoStream({} as VideoDeviceInfo), undefined);
}

describe('stream utils', () => {
  test('stores the correct state and start rendering when startRenderVideo is called on remote stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantIdentifier, mockStreamId);
    context.setCall(call);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantIdentifier, mockStreamId);

    await startRenderVideo(context, internalContext, mockCallId, mockParticipantIdentifier, remoteVideoStream);

    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        getRemoteParticipantKey(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(getRemoteParticipantKey(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).toBeDefined();
  });

  test('cleans up state and stop rendering when stopRenderVideo is called on remote stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantIdentifier, mockStreamId);
    context.setCall(call);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantIdentifier, mockStreamId);

    await startRenderVideo(context, internalContext, mockCallId, mockParticipantIdentifier, remoteVideoStream);

    stopRenderVideo(context, internalContext, mockCallId, mockParticipantIdentifier, remoteVideoStream);

    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        getRemoteParticipantKey(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(getRemoteParticipantKey(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).not.toBeDefined();
  });

  test('cleans up state and stop rendering when stopRenderVideoAll is called on multiple remote streams', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantIdentifier, mockStreamId);
    const remoteVideoStream2 = addMockRemoteStreamAndParticipant(call, mockParticipantIdentifier2, mockStreamId2);
    context.setCall(call);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantIdentifier, mockStreamId);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantIdentifier2, mockStreamId2);

    await startRenderVideo(context, internalContext, mockCallId, mockParticipantIdentifier, remoteVideoStream);
    await startRenderVideo(context, internalContext, mockCallId, mockParticipantIdentifier2, remoteVideoStream2);

    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        getRemoteParticipantKey(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).toBeDefined();
    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        getRemoteParticipantKey(mockParticipantIdentifier2),
        mockStreamId2
      )?.renderer
    ).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(getRemoteParticipantKey(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(getRemoteParticipantKey(mockParticipantIdentifier2))
        ?.videoStreams.get(mockStreamId2)?.videoStreamRendererView
    ).toBeDefined();

    stopRenderAllVideosForCall(context, internalContext, mockCallId);

    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        getRemoteParticipantKey(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        getRemoteParticipantKey(mockParticipantIdentifier2),
        mockStreamId2
      )?.renderer
    ).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(getRemoteParticipantKey(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(getRemoteParticipantKey(mockParticipantIdentifier2))
        ?.videoStreams.get(mockStreamId2)?.videoStreamRendererView
    ).not.toBeDefined();
  });

  test('cleans up state and stop rendering if stopRenderVideoAllCalls called on multiple remote streams', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantIdentifier, mockStreamId);
    const call2 = createMockCall(mockCallId2);
    const remoteVideoStream2 = addMockRemoteStreamAndParticipant(call2, mockParticipantIdentifier2, mockStreamId2);
    context.setCall(call);
    context.setCall(call2);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantIdentifier, mockStreamId);
    addSdkRemoteStream(internalContext, mockCallId2, mockParticipantIdentifier2, mockStreamId2);

    await startRenderVideo(context, internalContext, mockCallId, mockParticipantIdentifier, remoteVideoStream);
    await startRenderVideo(context, internalContext, mockCallId2, mockParticipantIdentifier2, remoteVideoStream2);

    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        getRemoteParticipantKey(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).toBeDefined();
    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId2,
        getRemoteParticipantKey(mockParticipantIdentifier2),
        mockStreamId2
      )?.renderer
    ).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(getRemoteParticipantKey(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId2)
        ?.remoteParticipants.get(getRemoteParticipantKey(mockParticipantIdentifier2))
        ?.videoStreams.get(mockStreamId2)?.videoStreamRendererView
    ).toBeDefined();

    stopRenderAllVideosForAllCalls(context, internalContext);

    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        getRemoteParticipantKey(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId2,
        getRemoteParticipantKey(mockParticipantIdentifier2),
        mockStreamId2
      )?.renderer
    ).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(getRemoteParticipantKey(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId2)
        ?.remoteParticipants.get(getRemoteParticipantKey(mockParticipantIdentifier2))
        ?.videoStreams.get(mockStreamId2)?.videoStreamRendererView
    ).not.toBeDefined();
  });

  test('stores the correct state and start rendering when startRenderVideo is called on local stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    addMockLocalStream(call);
    context.setCall(call);
    addSdkLocalStream(internalContext, mockCallId);

    await startRenderVideo(context, internalContext, mockCallId, undefined, {} as LocalVideoStream);

    expect(internalContext.getLocalStreamAndRenderer(mockCallId)?.renderer).toBeDefined();
    expect(context.getState().calls.get(mockCallId)?.localVideoStreams[0].videoStreamRendererView).toBeDefined();
  });

  test('cleans up state and stop rendering when stopRenderVideo is called on remote stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    addMockLocalStream(call);
    context.setCall(call);
    addSdkLocalStream(internalContext, mockCallId);

    await startRenderVideo(context, internalContext, mockCallId, undefined, {} as LocalVideoStream);

    stopRenderVideo(context, internalContext, mockCallId, undefined, {} as LocalVideoStream);

    expect(internalContext.getLocalStreamAndRenderer(mockCallId)?.renderer).not.toBeDefined();
    expect(context.getState().calls.get(mockCallId)?.localVideoStreams[0].videoStreamRendererView).not.toBeDefined();
  });

  test('is able to render LocalVideoStream not tied to a call and store in unparented state', async () => {
    const { context, internalContext } = createContexts();
    await startRenderVideo(context, internalContext, undefined, undefined, {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' }
    } as LocalVideoStream);
    expect(internalContext.getUnparentedStreamAndRenderer(0)).toBeDefined();
    expect(context.getState().deviceManager.unparentedViews[0]).toBeDefined();
  });

  test('is able to render LocalVideoStream not tied to a call and stop rendering it by reference find', async () => {
    const { context, internalContext } = createContexts();
    const localVideoStream = {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' }
    } as LocalVideoStream;

    await startRenderVideo(context, internalContext, undefined, undefined, localVideoStream);
    stopRenderVideo(context, internalContext, undefined, undefined, localVideoStream);

    expect(internalContext.getUnparentedStreamAndRenderer(0)).not.toBeDefined();
    expect(context.getState().deviceManager.unparentedViews[0]).not.toBeDefined();
  });

  test('is able to render LocalVideoStream not tied to a call and stop rendering it by property find', async () => {
    const { context, internalContext } = createContexts();
    const localVideoStream = {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' },
      mediaStreamType: 'Video'
    } as LocalVideoStream;
    const differentReferenceLocalVideoStream = {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' },
      mediaStreamType: 'Video'
    } as LocalVideoStream;

    await startRenderVideo(context, internalContext, undefined, undefined, differentReferenceLocalVideoStream);
    stopRenderVideo(context, internalContext, undefined, undefined, localVideoStream);

    expect(internalContext.getUnparentedStreamAndRenderer(0)).not.toBeDefined();
    expect(context.getState().deviceManager.unparentedViews[0]).not.toBeDefined();
  });

  test('is able to render LocalVideoStream not tied to a call and not stop when incorrect stream used', async () => {
    const { context, internalContext } = createContexts();
    const localVideoStream = {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' },
      mediaStreamType: 'Video'
    } as LocalVideoStream;
    const incorrectVideoStream = {
      source: { name: 'b', id: 'b', deviceType: 'Unknown' },
      mediaStreamType: 'Video'
    } as LocalVideoStream;

    await startRenderVideo(context, internalContext, undefined, undefined, localVideoStream);
    stopRenderVideo(context, internalContext, undefined, undefined, incorrectVideoStream);

    expect(internalContext.getUnparentedStreamAndRenderer(0)).toBeDefined();
    expect(context.getState().deviceManager.unparentedViews[0]).toBeDefined();
  });

  test('is able to render LocalVideoStream not tied to a call but not exceed MAX_UNPARENTED_VIEWS_LENGTH', async () => {
    const { context, internalContext } = createContexts();

    let gotException = false;
    for (let i = 0; i < MAX_UNPARENTED_VIEWS_LENGTH * 2; i++) {
      const localVideoStream = {
        source: { name: i.toString(), id: i.toString(), deviceType: 'Unknown' },
        mediaStreamType: 'Video'
      } as LocalVideoStream;
      try {
        await startRenderVideo(context, internalContext, undefined, undefined, localVideoStream);
      } catch (e) {
        gotException = true;
      }
    }

    expect(gotException).toBeTruthy();
    expect(context.getState().deviceManager.unparentedViews.length).toBe(MAX_UNPARENTED_VIEWS_LENGTH);
  });
});
