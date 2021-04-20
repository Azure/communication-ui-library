// © Microsoft Corporation. All rights reserved.

import { CreateViewOptions, VideoStreamRenderer } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { convertSdkVideoStreamRendererViewToDeclarativeVideoStreamRendererView } from './Converter';
import { InternalCallContext } from './InternalCallContext';

export async function startRenderVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  streamId: number,
  options?: CreateViewOptions
): Promise<void> {
  const remoteVideoStream = internalContext.getRemoteVideoStream(callId, streamId);
  const participantKey = internalContext.getRemoteParticipantKey(callId, streamId);
  const videoStreamRenderer = internalContext.getVideoStreamRenderer(callId, streamId);

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
  internalContext.setVideoStreamRenderer(callId, streamId, renderer);
}

export function stopRenderVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  streamId: number
): void {
  const videoStreamRenderer = internalContext.getVideoStreamRenderer(callId, streamId);

  if (!videoStreamRenderer) {
    return;
  }

  videoStreamRenderer.dispose();

  const participantKey = internalContext.getRemoteParticipantKey(callId, streamId);
  if (participantKey) {
    context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, undefined);
  }
  internalContext.removeVideoStreamRenderer(callId, streamId);
}

export function stopRenderVideoAll(context: CallContext, internalContext: InternalCallContext, callId: string): void {
  const streamIds = internalContext.getRemoteVideoStreams(callId);
  if (!streamIds) {
    return;
  }
  for (const [key] of streamIds.entries()) {
    stopRenderVideo(context, internalContext, callId, key);
  }
}

export function stopRenderVideoAllCalls(context: CallContext, internalContext: InternalCallContext): void {
  const remoteVideoStreams = internalContext.getRemoteVideoStreamsAll();
  for (const [callId, streams] of remoteVideoStreams) {
    for (const [streamId] of streams.entries()) {
      stopRenderVideo(context, internalContext, callId, streamId);
    }
  }
}
