// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallerInfo,
  CreateViewOptions,
  VideoStreamRenderer,
  VideoStreamRendererView,
  LocalVideoStream as SdkLocalVideoStream,
  RemoteVideoStream as SdkRemoteVideoStream,
  VideoDeviceInfo
} from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import { CallKind } from '@azure/communication-calling';
import { CommunicationUserKind } from '@azure/communication-common';
import { CallState, LocalVideoStreamState, RemoteParticipantState, RemoteVideoStreamState } from './CallClientState';
import { CallContext } from './CallContext';
import { InternalCallContext } from './InternalCallContext';
import { createView, disposeView, disposeAllViewsFromCall, disposeAllViews } from './StreamUtils';
import { createMockLocalVideoStream, createMockRemoteVideoStream } from './TestUtils';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';

jest.mock('@azure/communication-calling', () => {
  return {
    CallClient: jest.fn().mockImplementation(() => {
      return {};
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    LocalVideoStream: jest.fn().mockImplementation((info: VideoDeviceInfo) => {
      return createMockLocalVideoStream();
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
    }),
    Features: {
      VideoEffects: undefined
    }
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
    /* @conditional-compile-remove(teams-identity-support) */
    kind: 'Call' as CallKind,
    id: mockCallId,
    callerInfo: {} as CallerInfo,
    state: 'None',
    diagnostics: {
      network: {
        latest: {}
      },
      media: {
        latest: {}
      }
    },
    direction: 'Incoming',
    isMuted: true,
    isScreenSharingOn: false,
    localVideoStreams: [],
    remoteParticipants: {},
    remoteParticipantsEnded: {},
    recording: { isRecordingActive: false },
    transcription: { isTranscriptionActive: false },
    screenShareRemoteParticipant: undefined,
    startTime: new Date(),
    endTime: undefined,
    dominantSpeakers: undefined,
    /* @conditional-compile-remove(close-captions) */
    captionsFeature: {
      captions: [],
      supportedSpokenLanguages: [],
      supportedCaptionLanguages: [],
      currentCaptionLanguage: '',
      currentSpokenLanguage: '',
      isCaptionsFeatureActive: false,
      startCaptionsClicked: false
    }
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
    videoStreams: {},
    isMuted: true,
    isSpeaking: false
  };
  const remoteVideoStream: RemoteVideoStreamState = {
    id: streamId,
    mediaStreamType: 'Video',
    isAvailable: true,
    /* @conditional-compile-remove(video-stream-is-receiving-flag) */
    isReceiving: true,
    view: undefined
  };
  participant.videoStreams[streamId] = remoteVideoStream;
  call.remoteParticipants[toFlatCommunicationIdentifier(identifier)] = participant;
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
  const sdkRemoteVideoStream = createMockRemoteVideoStream(streamId);
  sdkRemoteVideoStream.isAvailable = true;
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
      context.getState().calls[mockCallId]?.remoteParticipants[toFlatCommunicationIdentifier(mockParticipantIdentifier)]
        ?.videoStreams[mockStreamId]?.view
    ).toBeDefined();
  });

  test('stores the correct state and start rendering when createView is called on local stream', async () => {
    const { context, internalContext } = createContexts();
    const call = createMockCall(mockCallId);
    addMockLocalStream(call);
    context.setCall(call);
    addSdkLocalStream(internalContext, mockCallId);

    // participantId is undefined since when createView is invoked without a participant Id
    // it is supposed to be creating the view for the local participant.
    await createView(context, internalContext, mockCallId, undefined, {} as LocalVideoStreamState);

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
      context.getState().calls[mockCallId]?.remoteParticipants[toFlatCommunicationIdentifier(mockParticipantIdentifier)]
        ?.videoStreams[mockStreamId]?.view
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
      context.getState().calls[mockCallId]?.remoteParticipants[toFlatCommunicationIdentifier(mockParticipantIdentifier)]
        ?.videoStreams[mockStreamId]?.view
    ).toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.status
    ).toBe('Rendered');
    expect(
      context.getState().calls[mockCallId]?.remoteParticipants[
        toFlatCommunicationIdentifier(mockParticipantIdentifier2)
      ]?.videoStreams[mockStreamId2]?.view
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
      context.getState().calls[mockCallId]?.remoteParticipants[toFlatCommunicationIdentifier(mockParticipantIdentifier)]
        ?.videoStreams[mockStreamId]?.view
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.status
    ).toBe('NotRendered');
    expect(
      context.getState().calls[mockCallId]?.remoteParticipants[
        toFlatCommunicationIdentifier(mockParticipantIdentifier2)
      ]?.videoStreams[mockStreamId2]?.view
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
      context.getState().calls[mockCallId]?.remoteParticipants[toFlatCommunicationIdentifier(mockParticipantIdentifier)]
        ?.videoStreams[mockStreamId]?.view
    ).toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId2,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.status
    ).toBe('Rendered');
    expect(
      context.getState().calls[mockCallId2]?.remoteParticipants[
        toFlatCommunicationIdentifier(mockParticipantIdentifier2)
      ]?.videoStreams[mockStreamId2]?.view
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
      context.getState().calls[mockCallId]?.remoteParticipants[toFlatCommunicationIdentifier(mockParticipantIdentifier)]
        ?.videoStreams[mockStreamId]?.view
    ).not.toBeDefined();
    expect(
      internalContext.getRemoteRenderInfoForParticipant(
        mockCallId2,
        toFlatCommunicationIdentifier(mockParticipantIdentifier2),
        mockStreamId2
      )?.status
    ).toBe('NotRendered');
    expect(
      context.getState().calls[mockCallId2]?.remoteParticipants[
        toFlatCommunicationIdentifier(mockParticipantIdentifier2)
      ]?.videoStreams[mockStreamId2]?.view
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

  test('context state correctly has startVideo error when unparentedView throws an error creating a video stream', async () => {
    // Ensure that calling sdk's createView will throw an error for this test
    const mockedVideoStreamRenderer = VideoStreamRenderer as jest.Mock;
    mockedVideoStreamRenderer.mockImplementationOnce(() => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        createView: (_options?: CreateViewOptions) => {
          throw new Error('MOCK ERROR THROWN FOR TESTING');
        }
      };
    });
    // initialize variables for test
    const { context, internalContext } = createContexts();
    const localVideoStream = {
      source: { name: 'a', id: 'a', deviceType: 'Unknown' },
      mediaStreamType: 'Video'
    } as LocalVideoStreamState;

    // ensure no errors we are testing for exist already
    expect(context.getState().latestErrors['Call.startVideo']).toBeUndefined();

    // Act
    try {
      await createView(context, internalContext, undefined, undefined, localVideoStream);
    } catch (e) {
      expect(e).toBeDefined();
    }

    // Assert
    expect(context.getState().latestErrors['Call.startVideo']).toBeDefined();
  });
});
