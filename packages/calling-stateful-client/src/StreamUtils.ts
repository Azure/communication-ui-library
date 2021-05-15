// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CreateViewOptions, LocalVideoStream, VideoStreamRenderer } from '@azure/communication-calling';
import {
  CommunicationUserKind,
  MicrosoftTeamsUserKind,
  PhoneNumberKind,
  UnknownIdentifierKind
} from '@azure/communication-common';
import { LocalVideoStream as StatefulLocalVideoStream, RemoteVideoStream } from './CallClientState';
import { CallContext } from './CallContext';
import {
  convertSdkLocalStreamToDeclarativeLocalStream,
  convertSdkRemoteStreamToDeclarativeRemoteStream,
  convertFromSDKToDeclarativeVideoStreamRendererView,
  getRemoteParticipantKey
} from './Converter';
import { InternalCallContext } from './InternalCallContext';

// TODO: How can we make this configurable?
export const MAX_UNPARENTED_VIEWS_LENGTH = 10;

export async function startRenderVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string | undefined,
  participantId:
    | CommunicationUserKind
    | PhoneNumberKind
    | MicrosoftTeamsUserKind
    | UnknownIdentifierKind
    | string
    | undefined,
  stream: StatefulLocalVideoStream | RemoteVideoStream,
  options?: CreateViewOptions
): Promise<void> {
  if ('id' in stream && callId && participantId) {
    // Render RemoteVideoStream that is part of a Call
    const streamId = stream.id;
    let participantKey;
    if (typeof participantId === 'string') {
      participantKey = participantId;
    } else {
      participantKey = getRemoteParticipantKey(participantId);
    }
    const remoteStreamAndRenderer = internalContext.getRemoteStreamAndRendererForParticipant(
      callId,
      participantKey,
      streamId
    );

    if (!remoteStreamAndRenderer || remoteStreamAndRenderer.renderer) {
      // TODO: How to standarize all errors
      throw new Error('RemoteVideoStream not found or Stream is already rendered');
    }

    const renderer = new VideoStreamRenderer(remoteStreamAndRenderer.stream);
    const view = await renderer.createView(options);

    context.setRemoteVideoStreamRendererView(
      callId,
      participantKey,
      streamId,
      convertFromSDKToDeclarativeVideoStreamRendererView(view)
    );
    internalContext.setRemoteStreamAndRenderer(
      callId,
      participantKey,
      streamId,
      remoteStreamAndRenderer.stream,
      renderer
    );
  } else if (!('id' in stream) && callId) {
    // Render LocalVideoStream that is part of a Call
    const localStreamAndRenderer = internalContext.getLocalStreamAndRenderer(callId);

    if (!localStreamAndRenderer || localStreamAndRenderer.renderer) {
      // TODO: How to standarize all errors
      // throw new Error('LocalVideoStream not found or Stream is already rendered');
      return;
    }

    const renderer = new VideoStreamRenderer(localStreamAndRenderer.stream);
    const view = await renderer.createView(options);

    context.setLocalVideoStreamRendererView(callId, convertFromSDKToDeclarativeVideoStreamRendererView(view));
    internalContext.setLocalStreamAndRenderer(callId, localStreamAndRenderer.stream, renderer);
  } else if (!('id' in stream) && !callId) {
    // Render LocalVideoStream that is not part of a Call
    if (context.getState().deviceManager.unparentedViews.length >= MAX_UNPARENTED_VIEWS_LENGTH) {
      // TODO: How to standarize all errors
      throw new Error('Max amount of unparented views reached ' + MAX_UNPARENTED_VIEWS_LENGTH.toString());
    }
    const localVideoStream = new LocalVideoStream(stream.source);
    const renderer = new VideoStreamRenderer(localVideoStream);
    const view = await renderer.createView(options);
    context.setDeviceManagerUnparentedView(convertFromSDKToDeclarativeVideoStreamRendererView(view));
    internalContext.setUnparentedStreamAndRenderer(stream, renderer);
  } else {
    // TODO: How to standarize all errors
    throw new Error('Invalid combination of parameters');
  }
}

export function stopRenderVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string | undefined,
  participantId:
    | CommunicationUserKind
    | PhoneNumberKind
    | MicrosoftTeamsUserKind
    | UnknownIdentifierKind
    | string
    | undefined,
  stream: StatefulLocalVideoStream | RemoteVideoStream
): void {
  if ('id' in stream && callId && participantId) {
    // Stop rendering RemoteVideoStream that is part of a Call
    const streamId = stream.id;
    let participantKey;
    if (typeof participantId === 'string') {
      participantKey = participantId;
    } else {
      participantKey = getRemoteParticipantKey(participantId);
    }
    const remoteStreamAndRenderer = internalContext.getRemoteStreamAndRendererForParticipant(
      callId,
      participantKey,
      streamId
    );

    if (!remoteStreamAndRenderer || !remoteStreamAndRenderer.renderer) {
      return;
    }

    remoteStreamAndRenderer.renderer.dispose();

    context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, undefined);
    internalContext.setRemoteStreamAndRenderer(
      callId,
      participantKey,
      streamId,
      remoteStreamAndRenderer.stream,
      undefined
    );
  } else if (!('id' in stream) && callId) {
    // Stop rendering LocalVideoStream that is part of a Call
    const localStreamAndRenderer = internalContext.getLocalStreamAndRenderer(callId);

    if (!localStreamAndRenderer || !localStreamAndRenderer.renderer) {
      return;
    }

    localStreamAndRenderer.renderer.dispose();
    context.setLocalVideoStreamRendererView(callId, undefined);
    internalContext.setLocalStreamAndRenderer(callId, localStreamAndRenderer.stream, undefined);
  } else if (!('id' in stream) && !callId) {
    // Stop rendering LocalVideoStream that is not part of a Call
    const index = internalContext.findInUnparentedStreamAndRenderers(stream);
    if (index === -1) {
      return;
    }

    const unparentedRenderer = internalContext.getUnparentedStreamAndRenderer(index);
    unparentedRenderer.renderer.dispose();
    context.removeDeviceManagerUnparentedView(index);
    internalContext.removeUnparentedStreamAndRenderer(index);
  } else {
    return;
  }
}

// Only stops videos that are tied to a Call.
export function stopRenderAllVideosForCall(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string
): void {
  const callStreams = internalContext.getRemoteStreamAndRenderersForCall(callId);
  if (callStreams) {
    for (const [participantKey, participantStreams] of callStreams.entries()) {
      for (const [_, remoteStreamAndRenderer] of participantStreams.entries()) {
        // We don't want to accept SDK stream as parameter but we also don't cache the declarative stream so we have to
        // convert the SDK stream to declarative stream which is not pretty so this could use some further refactoring.
        stopRenderVideo(
          context,
          internalContext,
          callId,
          participantKey,
          convertSdkRemoteStreamToDeclarativeRemoteStream(remoteStreamAndRenderer.stream)
        );
      }
    }
  }
  const localStreamAndRenderer = internalContext.getLocalStreamAndRenderer(callId);
  if (localStreamAndRenderer && localStreamAndRenderer.renderer) {
    // We don't want to accept SDK stream as parameter but we also don't cache the declarative stream so we have to
    // convert the SDK stream to declarative stream which is not pretty so this could use some further refactoring.
    stopRenderVideo(
      context,
      internalContext,
      callId,
      undefined,
      convertSdkLocalStreamToDeclarativeLocalStream(localStreamAndRenderer.stream)
    );
  }
}

export function stopRenderAllVideosForAllCalls(context: CallContext, internalContext: InternalCallContext): void {
  const remoteStreamAndRenderers = internalContext.getRemoteStreamAndRenderersAll();
  for (const [callId] of remoteStreamAndRenderers.entries()) {
    stopRenderAllVideosForCall(context, internalContext, callId);
  }
}
