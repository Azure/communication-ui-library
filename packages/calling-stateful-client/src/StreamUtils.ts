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

async function startRenderRemoteVideo(
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
    ?.videoStreams.get(streamId)?.viewAndStatus.status;

  if (!status) {
    throw new Error('StreamId not found in state');
  }

  if (videoStreamRenderer || status === 'Completed') {
    throw new Error('RemoteVideoStream is already rendered');
  }

  if (status === 'InProgress') {
    throw new Error('RemoteVideoStream rendering is already in progress');
  }

  if (status === 'Stopping') {
    throw new Error('RemoteVideoStream is in the middle of stopping');
  }

  context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, {
    status: 'InProgress',
    view: undefined
  });

  const renderer = new VideoStreamRenderer(remoteVideoStream);

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, {
      status: 'NotRendered',
      view: undefined
    });
    throw e;
  }

  const refreshStatus = context
    .getState()
    .calls.get(callId)
    ?.remoteParticipants.get(participantKey)
    ?.videoStreams.get(streamId)?.viewAndStatus.status;
  if (refreshStatus) {
    if (refreshStatus === 'Stopping') {
      // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
      // put the view into the state.
      context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, {
        status: 'NotRendered',
        view: undefined
      });
      internalContext.removeRemoteVideoStreamRenderer(callId, streamId);
    } else {
      // The stream still exists and status is not telling us to stop rendering. Complete the render process by
      // updating the state.
      context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, {
        status: 'Completed',
        view: convertFromSDKToDeclarativeVideoStreamRendererView(view)
      });
      internalContext.setRemoteVideoStreamRenderer(callId, streamId, renderer);
    }
  } else {
    // Stream was deleted from state and we have no where to put the rendered view, so dispose it and return.
    renderer.dispose();
    internalContext.removeRemoteVideoStreamRenderer(callId, streamId);
  }
}

async function startRenderLocalVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  stream: StatefulLocalVideoStream,
  options?: CreateViewOptions
): Promise<void> {
  const localVideoStream = internalContext.getLocalVideoStream(callId);
  const localVideoStreamRenderer = internalContext.getLocalVideoStreamRenderer(callId);

  const status = context.getState().calls.get(callId)?.localVideoStreams[0]?.viewAndStatus.status;

  if (!localVideoStream || !status) {
    throw new Error('LocalVideoStream not found in state');
  }

  if (localVideoStreamRenderer || status === 'Completed') {
    throw new Error('LocalVideoStream is already rendered');
  }

  if (status === 'InProgress') {
    throw new Error('LocalVideoStream rendering is already in progress');
  }

  if (status === 'Stopping') {
    throw new Error('LocalVideoStream is in the middle of stopping');
  }

  context.setLocalVideoStreamRendererView(callId, {
    status: 'InProgress',
    view: undefined
  });

  const renderer = new VideoStreamRenderer(localVideoStream);

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    context.setLocalVideoStreamRendererView(callId, {
      status: 'NotRendered',
      view: undefined
    });
    throw e;
  }

  // Since render could take some time, we need to check if the stream is still valid and if we received a signal to
  // stop rendering.
  const refreshStatus = context.getState().calls.get(callId)?.localVideoStreams[0]?.viewAndStatus.status;
  if (refreshStatus) {
    if (refreshStatus === 'Stopping') {
      // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
      // put the view into the state.
      renderer.dispose();
      context.setLocalVideoStreamRendererView(callId, {
        status: 'NotRendered',
        view: undefined
      });
      internalContext.removeLocalVideoStreamRenderer(callId);
    } else {
      // The stream still exists and status is not telling us to stop rendering. Complete the render process by
      // updating the state.
      context.setLocalVideoStreamRendererView(callId, {
        status: 'Completed',
        view: convertFromSDKToDeclarativeVideoStreamRendererView(view)
      });
      internalContext.setLocalVideoStreamRenderer(callId, renderer);
    }
  } else {
    // Stream was deleted from state and we have no where to put the rendered view, so dispose it and return.
    renderer.dispose();
    internalContext.removeLocalVideoStreamRenderer(callId);
  }
}

async function startRenderUnparentedVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  stream: StatefulLocalVideoStream,
  options?: CreateViewOptions
): Promise<void> {
  const status = context.getState().deviceManager.unparentedViews.get(stream)?.status;

  if (status && status === 'Completed') {
    throw new Error('Unparented LocalVideoStream is already rendered');
  }

  if (status && status === 'InProgress') {
    throw new Error('Unparented LocalVideoStream rendering is already in progress');
  }

  if (status && status === 'Stopping') {
    throw new Error('Unparented LocalVideoStream is in the middle of stopping');
  }

  const localVideoStream = new LocalVideoStream(stream.source);
  const renderer = new VideoStreamRenderer(localVideoStream);

  context.setDeviceManagerUnparentedView(stream, {
    status: 'InProgress',
    view: undefined
  });

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    context.setDeviceManagerUnparentedView(stream, {
      status: 'NotRendered',
      view: undefined
    });
    throw e;
  }

  // Since render could take some time, we need to check if the stream is still valid and if we received a signal to
  // stop rendering.
  const refreshStatus = context.getState().deviceManager.unparentedViews.get(stream)?.status;
  if (refreshStatus) {
    if (refreshStatus === 'Stopping') {
      // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
      // put the view into the state. Special case for unparented views, delete them from state when stopped to free up
      // the memory since we were the ones generating this and not tied to any Call state.
      context.removeDeviceManagerUnparentedView(stream);
      internalContext.removeUnparentedStreamAndRenderer(stream);
    } else {
      // The stream still exists and status is not telling us to stop rendering. Complete the render process by
      // updating the state.
      context.setDeviceManagerUnparentedView(stream, {
        status: 'Completed',
        view: convertFromSDKToDeclarativeVideoStreamRendererView(view)
      });
      internalContext.setUnparentedStreamAndRenderer(stream, renderer);
    }
  } else {
    // Stream was deleted from state and we have no where to put the rendered view, so dispose it and return.
    renderer.dispose();
    internalContext.removeUnparentedStreamAndRenderer(stream);
  }
}

function stopRenderRemoteVideo(
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
  }
  internalContext.removeRemoteVideoStreamRenderer(callId, streamId);

  // Cleanup views in state
  const participantKey = internalContext.getRemoteParticipantKey(callId, streamId);
  if (participantKey) {
    // If the status is InProgress then set it to Stopping so eventually when the startRenderVideo finishes awaiting
    // it can check the state and then dispose/stop the render.
    const status = context
      .getState()
      .calls.get(callId)
      ?.remoteParticipants.get(participantKey)
      ?.videoStreams.get(streamId)?.viewAndStatus.status;
    if (status) {
      if (status === 'InProgress') {
        context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, {
          status: 'Stopping',
          view: undefined
        });
      } else {
        context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, {
          status: 'NotRendered',
          view: undefined
        });
      }
    } else {
      // No existing stream in state, so nothing we can do here.
    }
  }
}

function stopRenderLocalVideo(context: CallContext, internalContext: InternalCallContext, callId: string): void {
  // Cleanup internal renderer
  const videoStreamRenderer = internalContext.getLocalVideoStreamRenderer(callId);
  if (videoStreamRenderer) {
    videoStreamRenderer.dispose();
  }
  internalContext.removeLocalVideoStreamRenderer(callId);

  // Cleanup views in state
  const state = context.getState().calls.get(callId)?.localVideoStreams[0].viewAndStatus.status;
  if (state) {
    // If the status is InProgress then set it to Stopping so eventually when the startRenderVideo finishes awaiting
    // it can check the state and then dispose/stop the render.
    if (state === 'InProgress') {
      context.setLocalVideoStreamRendererView(callId, { status: 'Stopping', view: undefined });
    } else {
      context.setLocalVideoStreamRendererView(callId, { status: 'NotRendered', view: undefined });
    }
  } else {
    // No existing stream in state, so nothing we can do here.
  }
}

function stopRenderUnparentedVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  stream: StatefulLocalVideoStream
): void {
  const unparentedRenderer = internalContext.getUnparentedStreamAndRenderer(stream);
  if (unparentedRenderer) {
    unparentedRenderer.dispose();
  }
  internalContext.removeUnparentedStreamAndRenderer(stream);

  // Cleanup views in state
  const state = context.getState().deviceManager.unparentedViews.get(stream)?.status;
  if (state) {
    // If the status is InProgress then set it to Stopping so eventually when the startRenderVideo finishes awaiting
    // it can check the state and then dispose/stop the render.
    if (state === 'InProgress') {
      context.setDeviceManagerUnparentedView(stream, { status: 'Stopping', view: undefined });
    } else {
      // Special case for unparented views, delete them from state when stopped to free up the memory since we were
      // the ones generating this and not tied to any Call state.
      context.removeDeviceManagerUnparentedView(stream);
    }
  }
}

export function startRenderVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string | undefined,
  stream: StatefulLocalVideoStream | RemoteVideoStream,
  options?: CreateViewOptions
): Promise<void> {
  if ('id' in stream && callId) {
    // Render RemoteVideoStream that is part of a Call
    return startRenderRemoteVideo(context, internalContext, callId, stream, options);
  } else if (!('id' in stream) && callId) {
    // Render LocalVideoStream that is part of a Call
    return startRenderLocalVideo(context, internalContext, callId, stream, options);
  } else if (!('id' in stream) && !callId) {
    // Render LocalVideoStream that is not part of a Call
    return startRenderUnparentedVideo(context, internalContext, stream, options);
  } else {
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
    stopRenderRemoteVideo(context, internalContext, callId, stream);
  } else if (!('id' in stream) && callId) {
    // Stop rendering LocalVideoStream that is part of a Call
    stopRenderLocalVideo(context, internalContext, callId);
  } else if (!('id' in stream) && !callId) {
    // Stop rendering LocalVideoStream that is not part of a Call
    stopRenderUnparentedVideo(context, internalContext, stream);
  } else {
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
