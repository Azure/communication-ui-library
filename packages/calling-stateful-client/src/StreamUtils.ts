// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CreateViewOptions,
  LocalVideoStream,
  VideoStreamRenderer,
  VideoStreamRendererView
} from '@azure/communication-calling';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { LocalVideoStreamState, RemoteVideoStreamState } from './CallClientState';
import { CallContext } from './CallContext';
import {
  convertSdkLocalStreamToDeclarativeLocalStream,
  convertSdkRemoteStreamToDeclarativeRemoteStream,
  convertFromSDKToDeclarativeVideoStreamRendererView
} from './Converter';
import { InternalCallContext } from './InternalCallContext';
import { toFlatCommunicationIdentifier, _logEvent } from '@internal/acs-ui-common';
import { callingStatefulLogger, EventNames } from './Logger';

/**
 * Return result from {@link StatefulCallClient.createView}.
 *
 * @public
 */
export type CreateViewResult = {
  renderer: VideoStreamRenderer;
  view: VideoStreamRendererView;
};

async function createViewRemoteVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  participantId: CommunicationIdentifierKind | string,
  stream: RemoteVideoStreamState,
  options?: CreateViewOptions
): Promise<CreateViewResult | undefined> {
  // Render RemoteVideoStream that is part of a Call
  const streamId = stream.id;
  const streamType = stream.mediaStreamType;
  let participantKey;
  if (typeof participantId === 'string') {
    participantKey = participantId;
  } else {
    participantKey = toFlatCommunicationIdentifier(participantId);
  }
  const streamLogInfo = { callId, participantKey, streamId, streamType };

  _logEvent(callingStatefulLogger, {
    name: EventNames.CREATING_REMOTE_VIEW,
    level: 'info',
    message: 'Start creating view for remote video.',
    data: streamLogInfo
  });
  const renderInfo = internalContext.getRemoteRenderInfoForParticipant(callId, participantKey, streamId);

  if (!renderInfo) {
    _logEvent(callingStatefulLogger, {
      name: EventNames.REMOTE_STREAM_NOT_FOUND,
      level: 'error',
      message: 'RemoteVideoStream not found in state.',
      data: streamLogInfo
    });
    console.warn('RemoteVideoStream not found in state');
    return;
  }

  if (renderInfo.status === 'Rendered') {
    _logEvent(callingStatefulLogger, {
      name: EventNames.REMOTE_STREAM_ALREADY_RENDERED,
      level: 'warning',
      message: 'RemoteVideoStream is already rendered.',
      data: streamLogInfo
    });
    console.warn('RemoteVideoStream is already rendered');
    return;
  }

  if (renderInfo.status === 'Rendering') {
    // Do not log to console here as this is a very common situation due to UI rerenders while
    // the video rendering is in progress.
    _logEvent(callingStatefulLogger, {
      name: EventNames.REMOTE_STREAM_RENDERING,
      level: 'warning',
      message: 'RemoteVideoStream is rendering.',
      data: streamLogInfo
    });
    return;
  }

  // "Stopping" only happens if the stream was in "rendering" but `disposeView` was called.
  // Now that `createView` has been re-called, we can flip the state back to "rendering".
  if (renderInfo.status === 'Stopping') {
    _logEvent(callingStatefulLogger, {
      name: EventNames.REMOTE_STREAM_STOPPING,
      level: 'warning',
      message: 'RemoteVideoStream was marked as stopping by dispose view. Resetting state to "Rendering".',
      data: streamLogInfo
    });
    internalContext.setRemoteRenderInfo(
      callId,
      participantKey,
      streamId,
      renderInfo.stream,
      'Rendering',
      renderInfo.renderer
    );
    return;
  }

  const renderer = new VideoStreamRenderer(renderInfo.stream);

  internalContext.setRemoteRenderInfo(callId, participantKey, streamId, renderInfo.stream, 'Rendering', undefined);

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    _logEvent(callingStatefulLogger, {
      name: EventNames.CREATE_REMOTE_STREAM_FAIL,
      level: 'error',
      message: 'Failed to create remote view',
      data: streamLogInfo
    });
    internalContext.setRemoteRenderInfo(callId, participantKey, streamId, renderInfo.stream, 'NotRendered', undefined);
    throw e;
  }

  // Since render could take some time, we need to check if the stream is still valid and if we received a signal to
  // stop rendering.
  const refreshedRenderInfo = internalContext.getRemoteRenderInfoForParticipant(callId, participantKey, streamId);
  if (!refreshedRenderInfo) {
    // RenderInfo was removed. This should not happen unless stream was removed from the call so dispose the renderer
    // and clean up state.
    _logEvent(callingStatefulLogger, {
      name: EventNames.REMOTE_RENDER_INFO_NOT_FOUND,
      level: 'error',
      message: 'Cannot find remote render info after create the view.',
      data: streamLogInfo
    });
    renderer.dispose();
    context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, undefined);
    return;
  }

  if (refreshedRenderInfo.status === 'Stopping') {
    // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
    // put the view into the state.
    _logEvent(callingStatefulLogger, {
      name: EventNames.REMOTE_CREATED_STREAM_STOPPING,
      level: 'warning',
      message: 'Render info status is stopping, dispose renderer.',
      data: streamLogInfo
    });
    renderer.dispose();
    internalContext.setRemoteRenderInfo(
      callId,
      participantKey,
      streamId,
      refreshedRenderInfo.stream,
      'NotRendered',
      undefined
    );
    context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, undefined);
    return;
  }

  // Else the stream still exists and status is not telling us to stop rendering. Complete the render process by
  // updating the state.
  internalContext.setRemoteRenderInfo(
    callId,
    participantKey,
    streamId,
    refreshedRenderInfo.stream,
    'Rendered',
    renderer
  );
  context.setRemoteVideoStreamRendererView(
    callId,
    participantKey,
    streamId,
    convertFromSDKToDeclarativeVideoStreamRendererView(view)
  );
  _logEvent(callingStatefulLogger, {
    name: EventNames.REMOTE_VIEW_RENDER_SUCCEED,
    level: 'info',
    message: `Successfully render the remote view.`,
    data: {
      streamLogInfo
    }
  });

  return {
    renderer,
    view
  };
}

async function createViewLocalVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  options?: CreateViewOptions
): Promise<CreateViewResult | undefined> {
  // Render LocalVideoStream that is part of a Call
  const renderInfo = internalContext.getLocalRenderInfo(callId);

  const streamType = renderInfo?.stream.mediaStreamType;

  const streamLogInfo = { callId, streamType };

  _logEvent(callingStatefulLogger, {
    name: EventNames.START_LOCAL_STREAM_RENDERING,
    level: 'info',
    message: 'Start creating view for local video.',
    data: streamLogInfo
  });

  if (!renderInfo) {
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_STREAM_NOT_FOUND,
      level: 'error',
      message: 'LocalVideoStream not found in state.',
      data: { callId }
    });
    console.warn('LocalVideoStream not found in state');
    return;
  }

  if (renderInfo.status === 'Rendered') {
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_STREAM_ALREADY_RENDERED,
      level: 'warning',
      message: 'LocalVideoStream is already rendered.',
      data: streamLogInfo
    });
    console.warn('LocalVideoStream is already rendered');
    return;
  }

  if (renderInfo.status === 'Rendering') {
    // Do not log to console here as this is a very common situation due to UI rerenders while
    // the video rendering is in progress.
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_STREAM_RENDERING,
      level: 'warning',
      message: 'LocalVideoStream is rendering.',
      data: streamLogInfo
    });
    return;
  }

  // "Stopping" only happens if the stream was in "rendering" but `disposeView` was called.
  // Now that `createView` has been re-called, we can flip the state back to "rendering".
  if (renderInfo.status === 'Stopping') {
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_STREAM_STOPPING,
      level: 'warning',
      message: 'LocalVideoStream was marked as stopping by dispose view. Resetting state to "Rendering".',
      data: streamLogInfo
    });
    internalContext.setLocalRenderInfo(callId, renderInfo.stream, 'Rendering', renderInfo.renderer);
    return;
  }

  const renderer = new VideoStreamRenderer(renderInfo.stream);

  internalContext.setLocalRenderInfo(callId, renderInfo.stream, 'Rendering', renderer);

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    _logEvent(callingStatefulLogger, {
      name: EventNames.CREATE_LOCAL_STREAM_FAIL,
      level: 'error',
      message: 'Failed to create view.',
      data: {
        error: e,
        streamType,
        callId
      }
    });
    internalContext.setLocalRenderInfo(callId, renderInfo.stream, 'NotRendered', undefined);
    throw e;
  }

  // Since render could take some time, we need to check if the stream is still valid and if we received a signal to
  // stop rendering.
  const refreshedRenderInfo = internalContext.getLocalRenderInfo(callId);
  if (!refreshedRenderInfo) {
    // RenderInfo was removed. This should not happen unless stream was removed from the call so dispose the renderer
    // and clean up the state.
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_RENDER_INFO_NOT_FOUND,
      level: 'error',
      message: 'Cannot find local render info after create the view. ',
      data: streamLogInfo
    });
    renderer.dispose();
    context.setLocalVideoStreamRendererView(callId, undefined);
    return;
  }

  if (refreshedRenderInfo.status === 'Stopping') {
    // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
    // put the view into the state.
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_CREATED_STREAM_STOPPING,
      level: 'warning',
      message: 'Render info status is stopping, dispose renderer.',
      data: streamLogInfo
    });
    renderer.dispose();
    internalContext.setLocalRenderInfo(callId, refreshedRenderInfo.stream, 'NotRendered', undefined);
    context.setLocalVideoStreamRendererView(callId, undefined);
    return;
  }

  // Else The stream still exists and status is not telling us to stop rendering. Complete the render process by
  // updating the state.
  internalContext.setLocalRenderInfo(callId, refreshedRenderInfo.stream, 'Rendered', renderer);
  context.setLocalVideoStreamRendererView(callId, convertFromSDKToDeclarativeVideoStreamRendererView(view));
  _logEvent(callingStatefulLogger, {
    name: EventNames.LOCAL_VIEW_RENDER_SUCCEED,
    level: 'info',
    message: `Successfully render the local view.`,
    data: streamLogInfo
  });

  return {
    renderer,
    view
  };
}

async function createViewUnparentedVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  stream: LocalVideoStreamState,
  options?: CreateViewOptions
): Promise<CreateViewResult | undefined> {
  const renderInfo = internalContext.getUnparentedRenderInfo(stream);

  if (renderInfo && renderInfo.status === 'Rendered') {
    console.warn('Unparented LocalVideoStream is already rendered');
    return;
  }

  if (renderInfo && renderInfo.status === 'Rendering') {
    // Do not log to console here as this is a very common situation due to UI rerenders while
    // the video rendering is in progress.
    return;
  }

  if (renderInfo && renderInfo.status === 'Stopping') {
    console.warn('Unparented LocalVideoStream is in the middle of stopping');
    return;
  }

  const localVideoStream = new LocalVideoStream(stream.source);
  const renderer = new VideoStreamRenderer(localVideoStream);

  internalContext.setUnparentedRenderInfo(stream, localVideoStream, 'Rendering', undefined);

  let view: VideoStreamRendererView;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    // Special case for unparented views. Since they are not tied to anything and created by us based on the calls to
    // this function we'll delete it to clean up the data since keeping it around doesn't help us and if developer wants
    // to create a new view they can check that the view is not rendered and call this function again.
    internalContext.deleteUnparentedRenderInfo(stream);
    throw e;
  }

  // Since render could take some time, we need to check if the stream is still valid and if we received a signal to
  // stop rendering.
  const refreshedRenderInfo = internalContext.getUnparentedRenderInfo(stream);
  if (!refreshedRenderInfo) {
    // Unparented stream's RenderInfo was deleted. Currently this shouldn't happen but if it does we'll just dispose the
    // renderer and clean up state. If developer wanted the stream they could call this function again and that should
    // generate new working state via this function.
    renderer.dispose();
    context.deleteDeviceManagerUnparentedView(stream);
    return;
  }

  if (refreshedRenderInfo.status === 'Stopping') {
    // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
    // put the view into the state. Special case for unparented views, delete them from state when stopped to free up
    // the memory since we were the ones generating this and not tied to any Call state.
    internalContext.deleteUnparentedRenderInfo(stream);
    context.deleteDeviceManagerUnparentedView(stream);
    return;
  }
  // Else the stream still exists and status is not telling us to stop rendering. Complete the render process by
  // updating the state.
  internalContext.setUnparentedRenderInfo(stream, localVideoStream, 'Rendered', renderer);
  internalContext.subscribeToUnparentedViewVideoEffects(localVideoStream, context);
  context.setDeviceManagerUnparentedView(stream, convertFromSDKToDeclarativeVideoStreamRendererView(view));

  return {
    renderer,
    view
  };
}

function disposeViewRemoteVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  participantId: CommunicationIdentifierKind | string,
  stream: RemoteVideoStreamState
): void {
  const streamId = stream.id;
  const streamType = stream.mediaStreamType;
  let participantKey;
  if (typeof participantId === 'string') {
    participantKey = participantId;
  } else {
    participantKey = toFlatCommunicationIdentifier(participantId);
  }

  const streamLogInfo = { callId, participantKey, streamId, streamType };

  _logEvent(callingStatefulLogger, {
    name: EventNames.START_DISPOSE_REMOTE_STREAM,
    level: 'info',
    message: 'Start disposing remote stream.',
    data: streamLogInfo
  });

  context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, undefined);

  const renderInfo = internalContext.getRemoteRenderInfoForParticipant(callId, participantKey, streamId);
  if (!renderInfo) {
    _logEvent(callingStatefulLogger, {
      name: EventNames.REMOTE_DISPOSE_INFO_NOT_FOUND,
      level: 'error',
      message: 'Cannot find render info when disposing remote stream.',
      data: streamLogInfo
    });
    return;
  }

  // Nothing to dispose of or clean up -- we can safely exit early here.
  if (renderInfo.status === 'NotRendered') {
    _logEvent(callingStatefulLogger, {
      name: EventNames.REMOTE_STREAM_ALREADY_DISPOSED,
      level: 'info',
      message: 'RemoteVideoStream is already disposed.',
      data: streamLogInfo
    });
    return;
  }

  // Status is already marked as "stopping" so we can exit early here. This is because stopping only occurs
  // when the stream is being created in createView but hasn't been completed being created yet. The createView
  // method will see the "stopping" status and perform the cleanup
  if (renderInfo.status === 'Stopping') {
    _logEvent(callingStatefulLogger, {
      name: EventNames.REMOTE_STREAM_STOPPING,
      level: 'info',
      message: 'Remote stream is already stopping.',
      data: streamLogInfo
    });
    return;
  }

  // If the stream is in the middle of being rendered (i.e. has state "Rendering"), we need the status as
  // "stopping" without performing any cleanup. This will tell the `createView` method that it should stop
  // rendering and clean up the state once the view has finished being created.
  if (renderInfo.status === 'Rendering') {
    _logEvent(callingStatefulLogger, {
      name: EventNames.REMOTE_STREAM_STOPPING,
      level: 'info',
      message: 'Remote stream is still rendering. Changing status to stopping.',
      data: streamLogInfo
    });
    internalContext.setRemoteRenderInfo(callId, participantKey, streamId, renderInfo.stream, 'Stopping', undefined);
    return;
  }

  // Else the state must be in the "Rendered" state, so we can dispose the renderer and clean up the state.
  internalContext.setRemoteRenderInfo(callId, participantKey, streamId, renderInfo.stream, 'NotRendered', undefined);

  if (renderInfo.renderer) {
    _logEvent(callingStatefulLogger, {
      name: EventNames.DISPOSING_REMOTE_RENDERER,
      level: 'info',
      message: 'Disposing remote view renderer.',
      data: streamLogInfo
    });
    renderInfo.renderer.dispose();
  } else {
    _logEvent(callingStatefulLogger, {
      name: EventNames.REMOTE_RENDERER_NOT_FOUND,
      level: 'error',
      message: 'Cannot find remote view renderer.',
      data: streamLogInfo
    });
  }
}

function disposeViewLocalVideo(context: CallContext, internalContext: InternalCallContext, callId: string): void {
  const renderInfo = internalContext.getLocalRenderInfo(callId);
  const streamType = renderInfo?.stream.mediaStreamType;
  const streamLogInfo = { callId, streamType };

  _logEvent(callingStatefulLogger, {
    name: EventNames.START_DISPOSE_LOCAL_STREAM,
    level: 'info',
    message: 'Start disposing local stream.',
    data: streamLogInfo
  });

  if (!renderInfo) {
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_DISPOSE_INFO_NOT_FOUND,
      level: 'error',
      message: 'Cannot find render info when disposing local stream.',
      data: streamLogInfo
    });
    return;
  }

  // Nothing to dispose of or clean up -- we can safely exit early here.
  if (renderInfo.status === 'NotRendered') {
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_STREAM_ALREADY_DISPOSED,
      level: 'info',
      message: 'LocalVideoStream is already disposed.',
      data: streamLogInfo
    });
    return;
  }

  // Status is already marked as "stopping" so we can exit early here. This is because stopping only occurs
  // when the stream is being created in createView but hasn't been completed being created yet. The createView
  // method will see the "stopping" status and perform the cleanup
  if (renderInfo.status === 'Stopping') {
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_STREAM_STOPPING,
      level: 'info',
      message: 'Local stream is already stopping.',
      data: streamLogInfo
    });
    return;
  }

  // If the stream is in the middle of being rendered (i.e. has state "Rendering"), we need the status as
  // "stopping" without performing any cleanup. This will tell the `createView` method that it should stop
  // rendering and clean up the state once the view has finished being created.
  if (renderInfo.status === 'Rendering') {
    _logEvent(callingStatefulLogger, {
      name: EventNames.REMOTE_STREAM_STOPPING,
      level: 'info',
      message: 'Remote stream is still rendering. Changing status to stopping.',
      data: streamLogInfo
    });
    internalContext.setLocalRenderInfo(callId, renderInfo.stream, 'Stopping', renderInfo.renderer);
    return;
  }

  if (renderInfo.renderer) {
    _logEvent(callingStatefulLogger, {
      name: EventNames.DISPOSING_LOCAL_RENDERER,
      level: 'info',
      message: 'Disposing local view renderer.',
      data: streamLogInfo
    });
    renderInfo.renderer.dispose();

    // We will after disposing of the renderer tell the internal context and context that the
    // local view is gone so we need to update their states.
    internalContext.setLocalRenderInfo(callId, renderInfo.stream, 'NotRendered', undefined);
    context.setLocalVideoStreamRendererView(callId, undefined);
  } else {
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_RENDERER_NOT_FOUND,
      level: 'error',
      message: 'Cannot find renderer when disposing local stream.',
      data: streamLogInfo
    });
  }
}

function disposeViewUnparentedVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  stream: LocalVideoStreamState
): void {
  const streamType = stream.mediaStreamType;
  const streamLogInfo = { streamType };

  _logEvent(callingStatefulLogger, {
    name: EventNames.START_DISPOSE_LOCAL_STREAM,
    level: 'info',
    message: 'Start disposing unparented local stream.',
    data: streamLogInfo
  });

  context.deleteDeviceManagerUnparentedView(stream);

  const renderInfo = internalContext.getUnparentedRenderInfo(stream);
  if (!renderInfo) {
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_DISPOSE_INFO_NOT_FOUND,
      level: 'error',
      message: 'Cannot find render info when disposing unparented local stream.',
      data: streamLogInfo
    });
    return;
  }

  if (renderInfo.status === 'Rendering') {
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_STREAM_STOPPING,
      level: 'info',
      message: 'Unparented local stream is still rendering. Changing status to stopping.',
      data: streamLogInfo
    });
    internalContext.setUnparentedRenderInfo(stream, renderInfo.stream, 'Stopping', undefined);
  } else {
    internalContext.deleteUnparentedRenderInfo(stream);
  }

  if (renderInfo.renderer) {
    _logEvent(callingStatefulLogger, {
      name: EventNames.DISPOSING_LOCAL_RENDERER,
      level: 'info',
      message: 'Disposing unparented local view renderer.',
      data: streamLogInfo
    });
    renderInfo.renderer.dispose();
  } else {
    _logEvent(callingStatefulLogger, {
      name: EventNames.LOCAL_RENDERER_NOT_FOUND,
      level: 'error',
      message: 'Cannot find renderer when disposing unparented local stream.',
      data: streamLogInfo
    });
  }
}

/**
 * @private
 */
export function createView(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string | undefined,
  participantId: CommunicationIdentifierKind | string | undefined,
  stream: LocalVideoStreamState | RemoteVideoStreamState,
  options?: CreateViewOptions
): Promise<CreateViewResult | undefined> {
  const streamType = stream.mediaStreamType;

  if ('id' in stream && callId && participantId) {
    // Render RemoteVideoStream that is part of a Call
    return createViewRemoteVideo(context, internalContext, callId, participantId, stream, options);
  } else if (!('id' in stream) && callId) {
    // Render LocalVideoStream that is part of a Call
    return createViewLocalVideo(context, internalContext, callId, options);
  } else if (!('id' in stream) && !callId) {
    // Render LocalVideoStream that is not part of a Call
    // Because it is not part of the call we don't tee errors to state naturally (e.g. via a Call Client function such as startVideo).
    // We do not have a startLocalPreviewVideo function, so as a workaround we ensure any errors are propagated here.
    return context.withAsyncErrorTeedToState(
      async () => await createViewUnparentedVideo(context, internalContext, stream, options),
      'Call.startVideo'
    )();
  } else {
    _logEvent(callingStatefulLogger, {
      name: EventNames.CREATE_STREAM_INVALID_PARAMS,
      level: 'warning',
      message: 'Create View invalid combination of parameters.',
      data: { streamType }
    });
    return Promise.resolve(undefined);
  }
}

/**
 * @private
 */
export function disposeView(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string | undefined,
  participantId: CommunicationIdentifierKind | string | undefined,
  stream: LocalVideoStreamState | RemoteVideoStreamState
): void {
  const streamType = stream.mediaStreamType;
  if ('id' in stream && callId && participantId) {
    // Stop rendering RemoteVideoStream that is part of a Call
    disposeViewRemoteVideo(context, internalContext, callId, participantId, stream);
  } else if (!('id' in stream) && callId) {
    // Stop rendering LocalVideoStream that is part of a Call
    disposeViewLocalVideo(context, internalContext, callId);
  } else if (!('id' in stream) && !callId) {
    // Stop rendering LocalVideoStream that is not part of a Call
    // Because it is not part of the call we don't tee errors to state naturally (e.g. via a Call Client function such as startVideo).
    // We do not have a stopLocalPreviewVideo function, so as a workaround we ensure any errors are propagated here.
    context.withErrorTeedToState(
      () => disposeViewUnparentedVideo(context, internalContext, stream),
      'Call.stopVideo'
    )();
  } else {
    _logEvent(callingStatefulLogger, {
      name: EventNames.DISPOSE_STREAM_INVALID_PARAMS,
      level: 'warning',
      message: 'Dispose View invalid combination of parameters.',
      data: { streamType }
    });
    return;
  }
}

/**
 * @private
 * Only stops videos that are tied to a Call.
 */
export function disposeAllViewsFromCall(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string
): void {
  const callStreams = internalContext.getRemoteRenderInfoForCall(callId);
  if (callStreams) {
    for (const [participantKey, participantStreams] of callStreams.entries()) {
      for (const [_, remoteStreamAndRenderer] of participantStreams.entries()) {
        // We don't want to accept SDK stream as parameter but we also don't cache the declarative stream so we have to
        // convert the SDK stream to declarative stream which is not pretty so this could use some further refactoring.
        disposeView(
          context,
          internalContext,
          callId,
          participantKey,
          convertSdkRemoteStreamToDeclarativeRemoteStream(remoteStreamAndRenderer.stream)
        );
      }
    }
  }
  const localStreamAndRenderer = internalContext.getLocalRenderInfo(callId);
  if (localStreamAndRenderer && localStreamAndRenderer.renderer) {
    // We don't want to accept SDK stream as parameter but we also don't cache the declarative stream so we have to
    // convert the SDK stream to declarative stream which is not pretty so this could use some further refactoring.
    disposeView(
      context,
      internalContext,
      callId,
      undefined,
      convertSdkLocalStreamToDeclarativeLocalStream(localStreamAndRenderer.stream)
    );
  }
}

/**
 * @private
 */
export function disposeAllViews(context: CallContext, internalContext: InternalCallContext): void {
  const callIds = internalContext.getCallIds();
  for (const callId of callIds) {
    disposeAllViewsFromCall(context, internalContext, callId);
  }
}
