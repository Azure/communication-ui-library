// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CreateViewOptions, LocalVideoStream, VideoStreamRenderer } from '@azure/communication-calling';
import { LocalVideoStream as StatefulLocalVideoStream, RemoteVideoStream } from './CallClientState';
import { CallContext } from './CallContext';
import {
  convertSdkLocalStreamToDeclarativeLocalStream,
  convertSdkRemoteStreamToDeclarativeRemoteStream,
  convertFromSDKToDeclarativeVideoStreamRendererView
} from './Converter';
import { InternalCallContext } from './InternalCallContext';

// TODO: How can we make this configurable?
export const MAX_UNPARENTED_VIEWS_LENGTH = 10;

export async function startRenderVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string | undefined,
  stream: StatefulLocalVideoStream | RemoteVideoStream,
  options?: CreateViewOptions
): Promise<void> {
  if ('id' in stream && callId) {
    // Render RemoteVideoStream that is part of a Call
    const streamId = stream.id;
    const remoteVideoStream = internalContext.getRemoteVideoStream(callId, streamId);
    const participantKey = internalContext.getRemoteParticipantKey(callId, streamId);
    const videoStreamRenderer = internalContext.getRemoteVideoStreamRenderer(callId, streamId);

    if (!remoteVideoStream || !participantKey || videoStreamRenderer) {
      // TODO: How to standarize all errors
      throw new Error('RemoteVideoStream not found, RemoteParticipant not found, or Stream is already rendered');
    }

    const renderer = new VideoStreamRenderer(remoteVideoStream);
    const view = await renderer.createView(options);

    context.setRemoteVideoStreamRendererView(
      callId,
      participantKey,
      streamId,
      convertFromSDKToDeclarativeVideoStreamRendererView(view)
    );
    internalContext.setRemoteVideoStreamRenderer(callId, streamId, renderer);
  } else if (!('id' in stream) && callId) {
    // Render LocalVideoStream that is part of a Call
    const localVideoStream = internalContext.getLocalVideoStream(callId);
    const localVideoStreamRenderer = internalContext.getLocalVideoStreamRenderer(callId);

    if (!localVideoStream || localVideoStreamRenderer) {
      // TODO: How to standarize all errors
      throw new Error('LocalVideoStream not found or Stream is already rendered');
    }

    const renderer = new VideoStreamRenderer(localVideoStream);
    const view = await renderer.createView(options);

    context.setLocalVideoStreamRendererView(callId, convertFromSDKToDeclarativeVideoStreamRendererView(view));
    internalContext.setLocalVideoStreamRenderer(callId, renderer);
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
  stream: StatefulLocalVideoStream | RemoteVideoStream
): void {
  if ('id' in stream && callId) {
    // Stop rendering RemoteVideoStream that is part of a Call
    const streamId = stream.id;
    const videoStreamRenderer = internalContext.getRemoteVideoStreamRenderer(callId, streamId);

    if (!videoStreamRenderer) {
      // TODO: How to standarize all errors
      throw new Error('VideoStreamRenderer not found');
    }

    videoStreamRenderer.dispose();

    const participantKey = internalContext.getRemoteParticipantKey(callId, streamId);
    if (participantKey) {
      context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, undefined);
    }
    internalContext.removeRemoteVideoStreamRenderer(callId, streamId);
  } else if (!('id' in stream) && callId) {
    // Stop rendering LocalVideoStream that is part of a Call
    const videoStreamRenderer = internalContext.getLocalVideoStreamRenderer(callId);

    if (!videoStreamRenderer) {
      // TODO: How to standarize all errors
      throw new Error('VideoStreamRenderer not found');
    }

    videoStreamRenderer.dispose();
    context.setLocalVideoStreamRendererView(callId, undefined);
    internalContext.removeLocalVideoStreamRenderer(callId);
  } else if (!('id' in stream) && !callId) {
    // Stop rendering LocalVideoStream that is not part of a Call
    const index = internalContext.findInUnparentedStreamAndRenderers(stream);
    if (index === -1) {
      // TODO: How to standarize all errors
      return;
      //throw new Error('UnparentedStream not found');
    }

    const unparentedRenderer = internalContext.getUnparentedStreamAndRenderer(index);
    unparentedRenderer.renderer.dispose();
    context.removeDeviceManagerUnparentedView(index);
    internalContext.removeUnparentedStreamAndRenderer(index);
  } else {
    // TODO: How to standarize all errors
    throw new Error('Invalid combination of parameters');
  }
}

// Only stops videos that are tied to a Call.
export function stopRenderVideoAll(context: CallContext, internalContext: InternalCallContext, callId: string): void {
  const streams = internalContext.getRemoteVideoStreams(callId);
  if (streams) {
    for (const [streamId] of streams.entries()) {
      const stream = internalContext.getRemoteVideoStream(callId, streamId);
      if (stream) {
        // We don't want to accept SDK stream as parameter but we also don't cache the declarative stream so we have to
        // convert the SDK stream to declarative stream which is not pretty so this could use some further refactoring.
        stopRenderVideo(context, internalContext, callId, convertSdkRemoteStreamToDeclarativeRemoteStream(stream));
      }
    }
  }
  // We don't want to accept SDK stream as parameter but we also don't cache the declarative stream so we have to
  // convert the SDK stream to declarative stream which is not pretty so this could use some further refactoring.
  const localVideoStream = internalContext.getLocalVideoStream(callId);
  if (localVideoStream) {
    stopRenderVideo(context, internalContext, callId, convertSdkLocalStreamToDeclarativeLocalStream(localVideoStream));
  }
}

export function stopRenderVideoAllCalls(context: CallContext, internalContext: InternalCallContext): void {
  const remoteVideoStreams = internalContext.getRemoteVideoStreamsAll();
  for (const [callId] of remoteVideoStreams) {
    stopRenderVideoAll(context, internalContext, callId);
  }
}
