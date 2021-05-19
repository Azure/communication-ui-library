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

async function createViewRemoteVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  stream: RemoteVideoStream,
  options?: CreateViewOptions
): Promise<void> {
  const streamId = stream.id;
  const remoteVideoStream = internalContext.getRemoteVideoStream(callId, streamId);
  const participantKey = internalContext.getRemoteParticipantKey(callId, streamId);
  const videoStreamRenderer = internalContext.getRemoteVideoStreamRenderer(callId, streamId);

  if (!remoteVideoStream) {
    throw new Error('RemoteVideoStream not found in state');
  }

  if (!participantKey) {
    throw new Error('RemoteParticipant not found in state');
  }

  const status = context
    .getState()
    .calls.get(callId)
    ?.remoteParticipants.get(participantKey)
    ?.videoStreams.get(streamId)?.viewStatus;

  if (!status) {
    throw new Error('StreamId not found in state');
  }

  if (videoStreamRenderer || status === 'Rendered') {
    throw new Error('RemoteVideoStream is already rendered');
  }

  if (status === 'Rendering') {
    throw new Error('RemoteVideoStream rendering is already in progress');
  }

  if (status === 'Stopping') {
    throw new Error('RemoteVideoStream is in the middle of stopping');
  }

  const renderer = new VideoStreamRenderer(remoteVideoStream);

  context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, 'Rendering', undefined);

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, 'NotRendered', undefined);
    throw e;
  }

  const refreshStatus = context
    .getState()
    .calls.get(callId)
    ?.remoteParticipants.get(participantKey)
    ?.videoStreams.get(streamId)?.viewStatus;
  if (refreshStatus) {
    if (refreshStatus === 'Stopping') {
      // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
      // put the view into the state.
      internalContext.removeRemoteVideoStreamRenderer(callId, streamId);
      context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, 'NotRendered', undefined);
    } else {
      // The stream still exists and status is not telling us to stop rendering. Complete the render process by
      // updating the state.
      internalContext.setRemoteVideoStreamRenderer(callId, streamId, renderer);
      context.setRemoteVideoStreamRendererView(
        callId,
        participantKey,
        streamId,
        'Rendered',
        convertFromSDKToDeclarativeVideoStreamRendererView(view)
      );
    }
  } else {
    // Stream was deleted from state and we have no where to put the rendered view, so dispose it and return.
    renderer.dispose();
    internalContext.removeRemoteVideoStreamRenderer(callId, streamId);
  }
}

async function createViewLocalVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  stream: StatefulLocalVideoStream,
  options?: CreateViewOptions
): Promise<void> {
  const localVideoStream = internalContext.getLocalVideoStream(callId);
  const localVideoStreamRenderer = internalContext.getLocalVideoStreamRenderer(callId);
  const status = context.getState().calls.get(callId)?.localVideoStreams[0]?.viewStatus;

  if (!localVideoStream || !status) {
    throw new Error('LocalVideoStream not found in state');
  }

  if (localVideoStreamRenderer || status === 'Rendered') {
    throw new Error('LocalVideoStream is already rendered');
  }

  if (status === 'Rendering') {
    throw new Error('LocalVideoStream rendering is already in progress');
  }

  if (status === 'Stopping') {
    throw new Error('LocalVideoStream is in the middle of stopping');
  }

  const renderer = new VideoStreamRenderer(localVideoStream);

  context.setLocalVideoStreamRendererView(callId, 'Rendering', undefined);

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    context.setLocalVideoStreamRendererView(callId, 'NotRendered', undefined);
    throw e;
  }

  // Since render could take some time, we need to check if the stream is still valid and if we received a signal to
  // stop rendering.
  const refreshStatus = context.getState().calls.get(callId)?.localVideoStreams[0]?.viewStatus;
  if (refreshStatus) {
    if (refreshStatus === 'Stopping') {
      // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
      // put the view into the state.
      renderer.dispose();
      internalContext.removeLocalVideoStreamRenderer(callId);
      context.setLocalVideoStreamRendererView(callId, 'NotRendered', undefined);
    } else {
      // The stream still exists and status is not telling us to stop rendering. Complete the render process by
      // updating the state.
      internalContext.setLocalVideoStreamRenderer(callId, renderer);
      context.setLocalVideoStreamRendererView(
        callId,
        'Rendered',
        convertFromSDKToDeclarativeVideoStreamRendererView(view)
      );
    }
  } else {
    // Stream was deleted from state and we have no where to put the rendered view, so dispose it and return.
    renderer.dispose();
    internalContext.removeLocalVideoStreamRenderer(callId);
  }
}

async function createViewUnparentedVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  stream: StatefulLocalVideoStream,
  options?: CreateViewOptions
): Promise<void> {
  const status = context.getState().deviceManager.unparentedViews.get(stream)?.viewStatus;

  if (status && status === 'Rendered') {
    throw new Error('Unparented LocalVideoStream is already rendered');
  }

  if (status && status === 'Rendering') {
    throw new Error('Unparented LocalVideoStream rendering is already in progress');
  }

  if (status && status === 'Stopping') {
    throw new Error('Unparented LocalVideoStream is in the middle of stopping');
  }

  const localVideoStream = new LocalVideoStream(stream.source);
  const renderer = new VideoStreamRenderer(localVideoStream);

  context.setDeviceManagerUnparentedView(stream, 'Rendering', undefined);

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    context.setDeviceManagerUnparentedView(stream, 'NotRendered', undefined);
    throw e;
  }

  // Since render could take some time, we need to check if the stream is still valid and if we received a signal to
  // stop rendering.
  const refreshStatus = context.getState().deviceManager.unparentedViews.get(stream)?.viewStatus;
  if (refreshStatus) {
    if (refreshStatus === 'Stopping') {
      // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
      // put the view into the state. Special case for unparented views, delete them from state when stopped to free up
      // the memory since we were the ones generating this and not tied to any Call state.
      internalContext.removeUnparentedStreamAndRenderer(stream);
      context.setDeviceManagerUnparentedView(stream, 'NotRendered', undefined);
    } else {
      // The stream still exists and status is not telling us to stop rendering. Complete the render process by
      // updating the state.
      internalContext.setUnparentedStreamAndRenderer(stream, renderer);
      context.setDeviceManagerUnparentedView(
        stream,
        'Rendered',
        convertFromSDKToDeclarativeVideoStreamRendererView(view)
      );
    }
  } else {
    // Stream was deleted from state and we have no where to put the rendered view, so dispose it and return.
    renderer.dispose();
    internalContext.removeUnparentedStreamAndRenderer(stream);
  }
}

function disposeViewRemoteVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  stream: RemoteVideoStream
): void {
  const streamId = stream.id;

  // Cleanup internal renderer
  const videoStreamRenderer = internalContext.getRemoteVideoStreamRenderer(callId, streamId);
  if (videoStreamRenderer) {
    videoStreamRenderer.dispose();
    internalContext.removeRemoteVideoStreamRenderer(callId, streamId);
  }

  // Cleanup views in state
  const participantKey = internalContext.getRemoteParticipantKey(callId, streamId);
  if (participantKey) {
    // If the status is Rendering then set it to Stopping so eventually when the startRenderVideo finishes awaiting
    // it can check the state and then dispose/stop the render.
    const status = context
      .getState()
      .calls.get(callId)
      ?.remoteParticipants.get(participantKey)
      ?.videoStreams.get(streamId)?.viewStatus;
    if (status) {
      if (status === 'Rendering') {
        context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, 'Stopping', undefined);
      } else {
        context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, 'NotRendered', undefined);
      }
    } else {
      // No existing stream in state, so nothing we can do here.
    }
  }
}

function disposeViewLocalVideo(context: CallContext, internalContext: InternalCallContext, callId: string): void {
  // Cleanup internal renderer
  const videoStreamRenderer = internalContext.getLocalVideoStreamRenderer(callId);
  if (videoStreamRenderer) {
    videoStreamRenderer.dispose();
    internalContext.removeLocalVideoStreamRenderer(callId);
  }

  // Cleanup views in state
  const state = context.getState().calls.get(callId)?.localVideoStreams[0].viewStatus;
  if (state) {
    // If the status is Rendering then set it to Stopping so eventually when the startRenderVideo finishes awaiting
    // it can check the state and then dispose/stop the render.
    if (state === 'Rendering') {
      context.setLocalVideoStreamRendererView(callId, 'Stopping', undefined);
    } else {
      context.setLocalVideoStreamRendererView(callId, 'NotRendered', undefined);
    }
  } else {
    // No existing stream in state, so nothing we can do here.
  }
}

function disposeViewUnparentedVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  stream: StatefulLocalVideoStream
): void {
  const unparentedRenderer = internalContext.getUnparentedStreamAndRenderer(stream);
  if (unparentedRenderer) {
    unparentedRenderer.dispose();
    internalContext.removeUnparentedStreamAndRenderer(stream);
  }

  // Cleanup views in state
  const state = context.getState().deviceManager.unparentedViews.get(stream)?.viewStatus;
  if (state) {
    // If the status is Rendering then set it to Stopping so eventually when the startRenderVideo finishes awaiting
    // it can check the state and then dispose/stop the render.
    if (state === 'Rendering') {
      context.setDeviceManagerUnparentedView(stream, 'Stopping', undefined);
    } else {
      context.setDeviceManagerUnparentedView(stream, 'NotRendered', undefined);
    }
  } else {
    // Not existing stream in state, so nothing we can do here.
  }
}

export function createView(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string | undefined,
  stream: StatefulLocalVideoStream | RemoteVideoStream,
  options?: CreateViewOptions
): Promise<void> {
  if ('id' in stream && callId) {
    // Render RemoteVideoStream that is part of a Call
    return createViewRemoteVideo(context, internalContext, callId, stream, options);
  } else if (!('id' in stream) && callId) {
    // Render LocalVideoStream that is part of a Call
    return createViewLocalVideo(context, internalContext, callId, stream, options);
  } else if (!('id' in stream) && !callId) {
    // Render LocalVideoStream that is not part of a Call
    return createViewUnparentedVideo(context, internalContext, stream, options);
  } else {
    throw new Error('Invalid combination of parameters');
  }
}

export function disposeView(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string | undefined,
  stream: StatefulLocalVideoStream | RemoteVideoStream
): void {
  if ('id' in stream && callId) {
    // Stop rendering RemoteVideoStream that is part of a Call
    disposeViewRemoteVideo(context, internalContext, callId, stream);
  } else if (!('id' in stream) && callId) {
    // Stop rendering LocalVideoStream that is part of a Call
    disposeViewLocalVideo(context, internalContext, callId);
  } else if (!('id' in stream) && !callId) {
    // Stop rendering LocalVideoStream that is not part of a Call
    disposeViewUnparentedVideo(context, internalContext, stream);
  } else {
    throw new Error('Invalid combination of parameters');
  }
}

// Only stops videos that are tied to a Call.
export function disposeAllViewsFromCall(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string
): void {
  const streams = internalContext.getRemoteVideoStreams(callId);
  if (streams) {
    for (const [streamId] of streams.entries()) {
      const stream = internalContext.getRemoteVideoStream(callId, streamId);
      if (stream) {
        // We don't want to accept SDK stream as parameter but we also don't cache the declarative stream so we have to
        // convert the SDK stream to declarative stream which is not pretty so this could use some further refactoring.
        disposeView(context, internalContext, callId, convertSdkRemoteStreamToDeclarativeRemoteStream(stream));
      }
    }
  }
  // We don't want to accept SDK stream as parameter but we also don't cache the declarative stream so we have to
  // convert the SDK stream to declarative stream which is not pretty so this could use some further refactoring.
  const localVideoStream = internalContext.getLocalVideoStream(callId);
  if (localVideoStream) {
    disposeView(context, internalContext, callId, convertSdkLocalStreamToDeclarativeLocalStream(localVideoStream));
  }
}

// stops all videos from all calls
export function disposeAllViews(context: CallContext, internalContext: InternalCallContext): void {
  const remoteVideoStreams = internalContext.getRemoteVideoStreamsAll();
  for (const [callId] of remoteVideoStreams) {
    disposeAllViewsFromCall(context, internalContext, callId);
  }
}
