// © Microsoft Corporation. All rights reserved.

import { CreateViewOptions, VideoStreamRenderer } from '@azure/communication-calling';
import { LocalVideoStream, RemoteVideoStream } from './CallClientState';
import { CallContext } from './CallContext';
import {
  convertSdkLocalStreamToDeclarativeLocalStream,
  convertSdkRemoteStreamToDeclarativeRemoteStream,
  convertFromSDKToDeclarativeVideoStreamRendererView
} from './Converter';
import { InternalCallContext } from './InternalCallContext';

export async function startRenderVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  stream: LocalVideoStream | RemoteVideoStream,
  options?: CreateViewOptions
): Promise<void> {
  if ('id' in stream) {
    const streamId = stream.id;
    const remoteVideoStream = internalContext.getRemoteVideoStream(callId, streamId);
    const participantKey = internalContext.getRemoteParticipantKey(callId, streamId);
    const videoStreamRenderer = internalContext.getRemoteVideoStreamRenderer(callId, streamId);

    if (!remoteVideoStream || !participantKey || videoStreamRenderer) {
      return;
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
  } else {
    const localVideoStream = internalContext.getLocalVideoStream(callId);
    const localVideoStreamRenderer = internalContext.getLocalVideoStreamRenderer(callId);

    if (!localVideoStream || localVideoStreamRenderer) {
      return;
    }

    const renderer = new VideoStreamRenderer(localVideoStream);
    const view = await renderer.createView(options);

    context.setLocalVideoStreamRendererView(callId, convertFromSDKToDeclarativeVideoStreamRendererView(view));
    internalContext.setLocalVideoStreamRenderer(callId, renderer);
  }
}

export function stopRenderVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  stream: LocalVideoStream | RemoteVideoStream
): void {
  if ('id' in stream) {
    const streamId = stream.id;
    const videoStreamRenderer = internalContext.getRemoteVideoStreamRenderer(callId, streamId);

    if (!videoStreamRenderer) {
      return;
    }

    videoStreamRenderer.dispose();

    const participantKey = internalContext.getRemoteParticipantKey(callId, streamId);
    if (participantKey) {
      context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, undefined);
    }
    internalContext.removeRemoteVideoStreamRenderer(callId, streamId);
  } else {
    const videoStreamRenderer = internalContext.getLocalVideoStreamRenderer(callId);

    if (!videoStreamRenderer) {
      return;
    }

    videoStreamRenderer.dispose();
    context.setLocalVideoStreamRendererView(callId, undefined);
    internalContext.removeLocalVideoStreamRenderer(callId);
  }
}

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
