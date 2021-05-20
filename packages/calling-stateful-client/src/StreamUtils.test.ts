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
import { Call, LocalVideoStreamState, RemoteParticipantState, RemoteVideoStreamState } from './CallClientState';
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
import { toFlatCommunicationIdentifier } from 'acs-ui-common';

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
    remoteParticipants: new Map<string, RemoteParticipantState>(),
    remoteParticipantsEnded: new Map<string, RemoteParticipantState>(),
    recording: { isRecordingActive: false },
    transcription: { isTranscriptionActive: false },
    transfer: { receivedTransferRequests: [], requestedTransfers: [] },
    screenShareRemoteParticipant: undefined,
    startTime: new Date(),
    endTime: undefined
  };
  return call;
}

function addMockRemoteStreamAndParticipant(
  call: Call,
  identifier: CommunicationUserKind,
  streamId: number
): RemoteVideoStreamState {
  const participant: RemoteParticipantState = {
    identifier: identifier,
    state: 'Connected',
    videoStreams: new Map<number, RemoteVideoStreamState>(),
    isMuted: true,
    isSpeaking: false
  };
  const remoteVideoStream: RemoteVideoStreamState = {
    id: streamId,
    mediaStreamType: 'Video',
    isAvailable: true,
    videoStreamRendererView: undefined
  };
  participant.videoStreams.set(streamId, remoteVideoStream);
  call.remoteParticipants.set(toFlatCommunicationIdentifier(identifier), participant);
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
    toFlatCommunicationIdentifier(identifier),
    streamId,
    sdkRemoteVideoStream,
    undefined
  );
}

function addMockLocalStream(call: Call): void {
  call.localVideoStreams.push({} as LocalVideoStreamState);
}

function addSdkLocalStream(internalContext: InternalCallContext, callId: string): void {
  internalContext.setLocalStreamAndRenderer(callId, new SdkLocalVideoStream({} as VideoDeviceInfo), undefined);
}

describe('stream utils', () => {
  test('stores the correct state and start rendering when createView is called on remote stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantIdentifier, mockStreamId);
    context.setCall(call);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantIdentifier, mockStreamId);

    await createView(context, internalContext, mockCallId, mockParticipantIdentifier, remoteVideoStream);

    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).toBeDefined();
  });

  test('cleans up state and stop rendering when disposeView is called on remote stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantIdentifier, mockStreamId);
    context.setCall(call);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantIdentifier, mockStreamId);

    await createView(context, internalContext, mockCallId, mockParticipantIdentifier, remoteVideoStream);

    disposeView(context, internalContext, mockCallId, mockParticipantIdentifier, remoteVideoStream);

    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).not.toBeDefined();
  });

  test('cleans up state and stop rendering when disposeAllViewsFromCall is called on multiple remote streams', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantIdentifier, mockStreamId);
    const remoteVideoStream2 = addMockRemoteStreamAndParticipant(call, mockParticipantIdentifier2, mockStreamId2);
    context.setCall(call);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantIdentifier, mockStreamId);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantIdentifier2, mockStreamId2);

    await createView(context, internalContext, mockCallId, mockParticipantIdentifier, remoteVideoStream);
    await createView(context, internalContext, mockCallId, mockParticipantIdentifier2, remoteVideoStream2);

    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).toBeDefined();
    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.renderer
    ).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier2))
        ?.videoStreams.get(mockStreamId2)?.videoStreamRendererView
    ).toBeDefined();

    disposeAllViewsFromCall(context, internalContext, mockCallId);

    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.renderer
    ).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier2))
        ?.videoStreams.get(mockStreamId2)?.videoStreamRendererView
    ).not.toBeDefined();
  });

  test('cleans up state and stop rendering if disposeAllViews called on multiple remote streams', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    const remoteVideoStream = addMockRemoteStreamAndParticipant(call, mockParticipantIdentifier, mockStreamId);
    const call2 = createMockCall(mockCallId2);
    const remoteVideoStream2 = addMockRemoteStreamAndParticipant(call2, mockParticipantIdentifier2, mockStreamId2);
    context.setCall(call);
    context.setCall(call2);
    addSdkRemoteStream(internalContext, mockCallId, mockParticipantIdentifier, mockStreamId);
    addSdkRemoteStream(internalContext, mockCallId2, mockParticipantIdentifier2, mockStreamId2);

    await createView(context, internalContext, mockCallId, mockParticipantIdentifier, remoteVideoStream);
    await createView(context, internalContext, mockCallId2, mockParticipantIdentifier2, remoteVideoStream2);

    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).toBeDefined();
    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId2,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.renderer
    ).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId2)
        ?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier2))
        ?.videoStreams.get(mockStreamId2)?.videoStreamRendererView
    ).toBeDefined();

    disposeAllViews(context, internalContext);

    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteStreamAndRendererForParticipant(
        mockCallId2,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.renderer
    ).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId)
        ?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.videoStreamRendererView
    ).not.toBeDefined();
    expect(
      context
        .getState()
        .calls.get(mockCallId2)
        ?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier2))
        ?.videoStreams.get(mockStreamId2)?.videoStreamRendererView
    ).not.toBeDefined();
  });

  test('stores the correct state and start rendering when createView is called on local stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    addMockLocalStream(call);
    context.setCall(call);
    addSdkLocalStream(internalContext, mockCallId);

    await createView(context, internalContext, mockCallId, undefined, {} as LocalVideoStreamState);

    expect(internalContext.getLocalStreamAndRenderer(mockCallId)?.renderer).toBeDefined();
    expect(context.getState().calls.get(mockCallId)?.localVideoStreams[0].videoStreamRendererView).toBeDefined();
  });

  test('cleans up state and stop rendering when disposeView is called on remote stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    addMockLocalStream(call);
    context.setCall(call);
    addSdkLocalStream(internalContext, mockCallId);

    await createView(context, internalContext, mockCallId, undefined, {} as LocalVideoStreamState);

    disposeView(context, internalContext, mockCallId, undefined, {} as LocalVideoStreamState);

    expect(internalContext.getLocalStreamAndRenderer(mockCallId)?.renderer).not.toBeDefined();
    expect(context.getState().calls.get(mockCallId)?.localVideoStreams[0].videoStreamRendererView).not.toBeDefined();
  });

  test('is able to render LocalVideoStream not tied to a call and store in unparented state', async () => {
    const { context, internalContext } = createContexts();
    await createView(context, internalContext, undefined, undefined, {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' }
    } as LocalVideoStreamState);
    expect(internalContext.getUnparentedStreamAndRenderer(0)).toBeDefined();
    expect(context.getState().deviceManager.unparentedViews[0]).toBeDefined();
  });

  test('is able to render LocalVideoStream not tied to a call and stop rendering it by reference find', async () => {
    const { context, internalContext } = createContexts();
    const localVideoStream = {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' }
    } as LocalVideoStreamState;

    await createView(context, internalContext, undefined, undefined, localVideoStream);
    disposeView(context, internalContext, undefined, undefined, localVideoStream);

    expect(internalContext.getUnparentedStreamAndRenderer(0)).not.toBeDefined();
    expect(context.getState().deviceManager.unparentedViews[0]).not.toBeDefined();
  });

  test('is able to render LocalVideoStream not tied to a call and stop rendering it by property find', async () => {
    const { context, internalContext } = createContexts();
    const localVideoStream = {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' },
      mediaStreamType: 'Video'
    } as LocalVideoStreamState;
    const differentReferenceLocalVideoStream = {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' },
      mediaStreamType: 'Video'
    } as LocalVideoStreamState;

    await createView(context, internalContext, undefined, undefined, differentReferenceLocalVideoStream);
    disposeView(context, internalContext, undefined, undefined, localVideoStream);

    expect(internalContext.getUnparentedStreamAndRenderer(0)).not.toBeDefined();
    expect(context.getState().deviceManager.unparentedViews[0]).not.toBeDefined();
  });

  test('is able to render LocalVideoStream not tied to a call and not stop when incorrect stream used', async () => {
    const { context, internalContext } = createContexts();
    const localVideoStream = {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' },
      mediaStreamType: 'Video'
    } as LocalVideoStreamState;
    const incorrectVideoStream = {
      source: { name: 'b', id: 'b', deviceType: 'Unknown' },
      mediaStreamType: 'Video'
    } as LocalVideoStreamState;

    await createView(context, internalContext, undefined, undefined, localVideoStream);
    disposeView(context, internalContext, undefined, undefined, incorrectVideoStream);

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
      } as LocalVideoStreamState;
      try {
        await createView(context, internalContext, undefined, undefined, localVideoStream);
      } catch (e) {
        gotException = true;
      }
    }

    expect(gotException).toBeTruthy();
    expect(context.getState().deviceManager.unparentedViews.length).toBe(MAX_UNPARENTED_VIEWS_LENGTH);
  });
});
