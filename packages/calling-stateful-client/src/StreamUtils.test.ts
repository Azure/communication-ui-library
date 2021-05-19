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
import { CallState, LocalVideoStream, RemoteParticipant, RemoteVideoStream } from './CallClientState';
import { CallContext } from './CallContext';
import { InternalCallContext } from './InternalCallContext';
import {
  MAX_UNPARENTED_VIEWS_LENGTH,
  createView,
  disposeView,
  disposeAllViewsFromCall,
  disposeAllViews
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
const mockParticipantKey = 'participantKey';
const mockParticipantKey2 = 'participantKey2';
const mockStreamId = 1;
const mockStreamId2 = 2;

interface TestData {
  context: CallContext;
  internalContext: InternalCallContext;
}

function createMockCall(mockCallId: string): CallState {
  const call: CallState = {
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
    screenShareRemoteParticipant: undefined,
    startTime: new Date(),
    endTime: undefined
  };
  return call;
}

function addMockRemoteStreamAndParticipant(call: CallState, key: string, id: number): RemoteVideoStream {
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
  const context = new CallContext('');
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

function addMockLocalStream(call: CallState): void {
  call.localVideoStreams.push({} as LocalVideoStream);
}

function addSdkLocalStream(internalContext: InternalCallContext, callId: string): void {
  internalContext.setLocalVideoStream(callId, new SdkLocalVideoStream({} as VideoDeviceInfo));
}

describe('stream utils', () => {
  test('stores the correct state and start rendering when createView is called on remote stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantKey, mockStreamId);
    context.setCall(call);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantKey, mockStreamId);

    await createView(context, internalContext, mockCallId, remoteVideoStream);

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

  test('cleans up state and stop rendering when disposeView is called on remote stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantKey, mockStreamId);
    context.setCall(call);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantKey, mockStreamId);

    await createView(context, internalContext, mockCallId, remoteVideoStream);

    disposeView(context, internalContext, mockCallId, remoteVideoStream);

    expect(internalContext.getRemoteVideoStreamRenderer(mockCallId, mockStreamId)).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(mockParticipantKey)
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).not.toBeDefined();
  });

  test('cleans up state and stop rendering when disposeAllViewsFromCall is called on multiple remote streams', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantKey, mockStreamId);
    const remoteVideoStream2 = addMockRemoteStreamAndParticipant(call, mockParticipantKey2, mockStreamId2);
    context.setCall(call);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantKey, mockStreamId);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantKey2, mockStreamId2);

    await createView(context, internalContext, mockCallId, remoteVideoStream);
    await createView(context, internalContext, mockCallId, remoteVideoStream2);

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

    disposeAllViewsFromCall(context, internalContext, mockCallId);

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

  test('cleans up state and stop rendering if disposeAllViews called on multiple remote streams', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantKey, mockStreamId);
    const call2 = createMockCall(mockCallId2);
    const remoteVideoStream2 = addMockRemoteStreamAndParticipant(call2, mockParticipantKey2, mockStreamId2);
    context.setCall(call);
    context.setCall(call2);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantKey, mockStreamId);
    addSdkRemoteStream(internalContext, mockCallId2, mockParticipantKey2, mockStreamId2);

    await createView(context, internalContext, mockCallId, remoteVideoStream);
    await createView(context, internalContext, mockCallId2, remoteVideoStream2);

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

    disposeAllViews(context, internalContext);

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

  test('stores the correct state and start rendering when createView is called on local stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    addMockLocalStream(call);
    context.setCall(call);
    addSdkLocalStream(internalContext, mockCallId);

    await createView(context, internalContext, mockCallId, {} as LocalVideoStream);

    expect(internalContext.getLocalVideoStream(mockCallId)).toBeDefined();
    expect(internalContext.getLocalVideoStreamRenderer(mockCallId)).toBeDefined();
    expect(context.getState().calls.get(mockCallId)?.localVideoStreams[0].videoStreamRendererView).toBeDefined();
  });

  test('cleans up state and stop rendering when disposeView is called on remote stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    addMockLocalStream(call);
    context.setCall(call);
    addSdkLocalStream(internalContext, mockCallId);

    await createView(context, internalContext, mockCallId, {} as LocalVideoStream);

    disposeView(context, internalContext, mockCallId, {} as LocalVideoStream);

    expect(internalContext.getLocalVideoStreamRenderer(mockCallId)).not.toBeDefined();
    expect(context.getState().calls.get(mockCallId)?.localVideoStreams[0].videoStreamRendererView).not.toBeDefined();
  });

  test('is able to render LocalVideoStream not tied to a call and store in unparented state', async () => {
    const { context, internalContext } = createContexts();
    await createView(context, internalContext, undefined, {
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

    await createView(context, internalContext, undefined, localVideoStream);
    disposeView(context, internalContext, undefined, localVideoStream);

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

    await createView(context, internalContext, undefined, differentReferenceLocalVideoStream);
    disposeView(context, internalContext, undefined, localVideoStream);

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

    await createView(context, internalContext, undefined, localVideoStream);
    let gotException = false;
    try {
      disposeView(context, internalContext, undefined, incorrectVideoStream);
    } catch (e) {
      gotException = true;
    }

    expect(gotException).toBeTruthy();
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
        await createView(context, internalContext, undefined, localVideoStream);
      } catch (e) {
        gotException = true;
      }
    }

    expect(gotException).toBeTruthy();
    expect(context.getState().deviceManager.unparentedViews.length).toBe(MAX_UNPARENTED_VIEWS_LENGTH);
  });
});
