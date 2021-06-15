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
import { CallState, LocalVideoStreamState, RemoteParticipantState, RemoteVideoStreamState } from './CallClientState';
import { CallContext } from './CallContext';
import { InternalCallContext } from './InternalCallContext';
import { createView, disposeView, disposeAllViewsFromCall, disposeAllViews } from './StreamUtils';
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

function createMockCall(mockCallId: string): CallState {
  const call: CallState = {
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
  call: CallState,
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
    view: undefined
  };
  participant.videoStreams.set(streamId, remoteVideoStream);
  call.remoteParticipants.set(toFlatCommunicationIdentifier(identifier), participant);
  return remoteVideoStream;
}

function createContexts(): TestData {
  const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
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
  internalContext.setRemoteRenderInfo(
    callId,
    toFlatCommunicationIdentifier(identifier),
    streamId,
    sdkRemoteVideoStream,
    'NotRendered',
    undefined
  );
}

function addMockLocalStream(call: CallState): void {
  call.localVideoStreams.push({} as LocalVideoStreamState);
}

function addSdkLocalStream(internalContext: InternalCallContext, callId: string): void {
  internalContext.setLocalRenderInfo(callId, new SdkLocalVideoStream({} as VideoDeviceInfo), 'NotRendered', undefined);
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
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.status
    ).toBe('Rendered');
    expect(
      context
        .getState()
        .calls[mockCallId]?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.view
    ).toBeDefined();
  });

  test('stores the correct state and start rendering when createView is called on local stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    addMockLocalStream(call);
    context.setCall(call);
    addSdkLocalStream(internalContext, mockCallId);

    await createView(context, internalContext, mockCallId, mockParticipantIdentifier, {} as LocalVideoStreamState);

    expect(internalContext.getLocalRenderInfo(mockCallId)).toBeDefined();
    expect(internalContext.getLocalRenderInfo(mockCallId)?.stream).toBeDefined();
    expect(internalContext.getLocalRenderInfo(mockCallId)?.renderer).toBeDefined();
    expect(internalContext.getLocalRenderInfo(mockCallId)?.status).toBe('Rendered');
    expect(context.getState().calls[mockCallId]?.localVideoStreams[0].view).toBeDefined();
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
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.status
    ).toBe('NotRendered');
    expect(
      context
        .getState()
        .calls[mockCallId]?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.view
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
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.renderer
    ).toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.status
    ).toBe('Rendered');
    expect(
      context
        .getState()
        .calls[mockCallId]?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.view
    ).toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.status
    ).toBe('Rendered');
    expect(
      context
        .getState()
        .calls[mockCallId]?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier2))
        ?.videoStreams.get(mockStreamId2)?.view
    ).toBeDefined();

    disposeAllViewsFromCall(context, internalContext, mockCallId);

    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.renderer
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.status
    ).toBe('NotRendered');
    expect(
      context
        .getState()
        .calls[mockCallId]?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.view
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.status
    ).toBe('NotRendered');
    expect(
      context
        .getState()
        .calls[mockCallId]?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier2))
        ?.videoStreams.get(mockStreamId2)?.view
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
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId2,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.renderer
    ).toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.status
    ).toBe('Rendered');
    expect(
      context
        .getState()
        .calls[mockCallId]?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.view
    ).toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId2,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.status
    ).toBe('Rendered');
    expect(
      context
        .getState()
        .calls[mockCallId2]?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier2))
        ?.videoStreams.get(mockStreamId2)?.view
    ).toBeDefined();

    disposeAllViews(context, internalContext);

    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.renderer
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId2,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.renderer
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier),
        mockStreamId
      )?.status
    ).toBe('NotRendered');
    expect(
      context
        .getState()
        .calls[mockCallId]?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier))
        ?.videoStreams.get(mockStreamId)?.view
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId2,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.status
    ).toBe('NotRendered');
    expect(
      context
        .getState()
        .calls[mockCallId2]?.remoteParticipants.get(toFlatCommunicationIdentifier(mockParticipantIdentifier2))
        ?.videoStreams.get(mockStreamId2)?.view
    ).not.toBeDefined();
  });

  test('is able to render LocalVideoStream not tied to a call and store in unparented state', async () => {
    const { context, internalContext } = createContexts();
    const localVideoStream = {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' }
    } as LocalVideoStreamState;
    await createView(context, internalContext, undefined, undefined, localVideoStream);
    expect(internalContext.getUnparentedRenderInfo(localVideoStream)).toBeDefined();
    expect(internalContext.getUnparentedRenderInfo(localVideoStream)?.status).toBe('Rendered');

    const views = context.getState().deviceManager.unparentedViews;
    expect(views.length).toBe(1);
    expect(views[0].view).toBeDefined();
  });

  test('is able to render LocalVideoStream not tied to a call and stop rendering it by reference find', async () => {
    const { context, internalContext } = createContexts();
    const localVideoStream = {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' }
    } as LocalVideoStreamState;

    await createView(context, internalContext, undefined, undefined, localVideoStream);
    disposeView(context, internalContext, undefined, undefined, localVideoStream);

    expect(internalContext.getUnparentedRenderInfo(localVideoStream)).not.toBeDefined();
    expect(context.getState().deviceManager.unparentedViews.length).toBe(0);
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

    expect(internalContext.getUnparentedRenderInfo(localVideoStream)).toBeDefined();
    expect(internalContext.getUnparentedRenderInfo(localVideoStream)?.status).toBe('Rendered');

    const views = context.getState().deviceManager.unparentedViews;
    expect(views.length).toBe(1);
    expect(views[0].view).toBeDefined();
  });
});
