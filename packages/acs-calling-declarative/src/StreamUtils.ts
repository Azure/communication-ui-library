// © Microsoft Corporation. All rights reserved.

import { CreateViewOptions, VideoStreamRenderer } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { convertSdkVideoStreamRendererViewToDeclarativeVideoStreamRendererView } from './Converter';
import { InternalCallContext } from './InternalCallContext';

export async function startRenderVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  streamId?: number,
  options?: CreateViewOptions
): Promise<void> {
  if (streamId) {
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
      convertSdkVideoStreamRendererViewToDeclarativeVideoStreamRendererView(view)
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

    context.setLocalVideoStreamRendererView(
      callId,
      convertSdkVideoStreamRendererViewToDeclarativeVideoStreamRendererView(view)
    );
    internalContext.setLocalVideoStreamRenderer(callId, renderer);
  }
}

export function stopRenderVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  streamId?: number
): void {
  if (streamId) {
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
  const streamIds = internalContext.getRemoteVideoStreams(callId);
  if (streamIds) {
    for (const [streamId] of streamIds.entries()) {
      stopRenderVideo(context, internalContext, callId, streamId);
    }
  }
  stopRenderVideo(context, internalContext, callId);
}

export function stopRenderVideoAllCalls(context: CallContext, internalContext: InternalCallContext): void {
  const remoteVideoStreams = internalContext.getRemoteVideoStreamsAll();
  for (const [callId] of remoteVideoStreams) {
    stopRenderVideoAll(context, internalContext, callId);
  }
}
