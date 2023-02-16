// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CreateViewOptions,
  LocalVideoStream,
  RemoteVideoStream,
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
import { EventNames } from './Logger';
import { _logCreateLocalStreamEvent, _logCreateRemoteStreamEvent, _logDisposeStreamEvent } from './StreamUtilsLogging';

/**
 * Return result from {@link StatefulCallClient.createView}.
 *
 * @public
 */
export type CreateViewResult = {
  renderer: VideoStreamRenderer;
  view: VideoStreamRendererView;
};

async function createViewVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  stream?: RemoteVideoStreamState | LocalVideoStreamState,
  participantId?: CommunicationIdentifierKind | string,
  options?: CreateViewOptions
): Promise<CreateViewResult | undefined> {
  // we can only have 3 types of createView
  let createViewType: 'local' | 'remote' | 'unparented';

  // we will reuse these for local as well but we need to make sure the remote stream is passed in like before.
  let streamId;
  let streamType;

  if (participantId && stream) {
    createViewType = 'remote';
  } else if (callId) {
    createViewType = 'local';
  } else {
    // TODO update for when unparented view.
    createViewType = 'local';
  }

  if (stream) {
    streamType = stream.mediaStreamType;
    if (createViewType === 'remote') {
      streamId = (stream as RemoteVideoStream).id;
    }
  }

  // we want to check to see if there is a participantId this will tell us whether its a local stream or a remote one.
  let participantKey;
  if (createViewType === 'remote' && participantId) {
    if (typeof participantId === 'string') {
      participantKey = participantId;
    } else {
      participantKey = toFlatCommunicationIdentifier(participantId);
    }
  }

  const streamLogInfo = { callId, participantKey, streamId, streamType };

  // make different logging announcement based on whether or not we are starting a local or remote
  createViewType === 'remote'
    ? _logCreateRemoteStreamEvent(EventNames.CREATING_REMOTE_VIEW, streamLogInfo)
    : _logCreateLocalStreamEvent(EventNames.START_LOCAL_STREAM_RENDERING, streamLogInfo);

  // if we have a participant Id and a stream get the remote info, else get the local render info from state.
  const renderInfo =
    createViewType === 'remote'
      ? internalContext.getRemoteRenderInfoForParticipant(callId, participantKey, streamId)
      : internalContext.getLocalRenderInfo(callId);

  if (!renderInfo) {
    createViewType === 'remote'
      ? _logCreateRemoteStreamEvent(EventNames.REMOTE_STREAM_NOT_FOUND, streamLogInfo)
      : _logCreateLocalStreamEvent(EventNames.LOCAL_STREAM_NOT_FOUND, streamLogInfo);
    return;
  }

  if (renderInfo.status === 'Rendered') {
    createViewType === 'remote'
      ? _logCreateRemoteStreamEvent(EventNames.REMOTE_STREAM_ALREADY_RENDERED, streamLogInfo)
      : _logCreateLocalStreamEvent(EventNames.LOCAL_STREAM_ALREADY_RENDERED, streamLogInfo);
    return;
  }

  if (renderInfo.status === 'Rendering') {
    // Do not log to console here as this is a very common situation due to UI rerenders while
    // the video rendering is in progress.
    createViewType === 'remote'
      ? _logCreateRemoteStreamEvent(EventNames.REMOTE_STREAM_RENDERING, streamLogInfo)
      : _logCreateLocalStreamEvent(EventNames.LOCAL_STREAM_RENDERING, streamLogInfo);
    return;
  }

  // "Stopping" only happens if the stream was in "rendering" but `disposeView` was called.
  // Now that `createView` has been re-called, we can flip the state back to "rendering".
  if (renderInfo.status === 'Stopping') {
    if (createViewType === 'remote') {
      _logCreateRemoteStreamEvent(EventNames.REMOTE_STREAM_STOPPING, streamLogInfo);
      internalContext.setRemoteRenderInfo(
        callId,
        participantKey,
        streamId,
        renderInfo.stream as RemoteVideoStream,
        'Rendering',
        renderInfo.renderer
      );
    } else if (createViewType === 'local') {
      _logCreateLocalStreamEvent(EventNames.LOCAL_STREAM_STOPPING, streamLogInfo);
      internalContext.setLocalRenderInfo(
        callId,
        renderInfo.stream as LocalVideoStream,
        'Rendering',
        renderInfo.renderer
      );
    }
    return;
  }

  const renderer = new VideoStreamRenderer(renderInfo.stream);

  createViewType === 'remote'
    ? internalContext.setRemoteRenderInfo(
        callId,
        participantKey,
        streamId,
        renderInfo.stream as RemoteVideoStream,
        'Rendering',
        undefined
      )
    : internalContext.setLocalRenderInfo(callId, renderInfo.stream as LocalVideoStream, 'Rendering', renderer);

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    if (createViewType === 'remote') {
      _logCreateRemoteStreamEvent(EventNames.CREATE_REMOTE_STREAM_FAIL, streamLogInfo);
      internalContext.setRemoteRenderInfo(
        callId,
        participantKey,
        streamId,
        renderInfo.stream as RemoteVideoStream,
        'NotRendered',
        undefined
      );
    } else if (createViewType === 'local') {
      _logCreateLocalStreamEvent(EventNames.CREATE_LOCAL_STREAM_FAIL, streamLogInfo, e);
      internalContext.setLocalRenderInfo(callId, renderInfo.stream as LocalVideoStream, 'NotRendered', undefined);
    }
    throw e;
  }

  // Since render could take some time, we need to check if the stream is still valid and if we received a signal to
  // stop rendering.
  const refreshedRenderInfo =
    createViewType === 'remote'
      ? internalContext.getRemoteRenderInfoForParticipant(callId, participantKey, streamId)
      : internalContext.getLocalRenderInfo(callId);

  if (!refreshedRenderInfo) {
    // RenderInfo was removed. This should not happen unless stream was removed from the call so dispose the renderer
    // and clean up the state.
    createViewType === 'remote'
      ? _logCreateRemoteStreamEvent(EventNames.REMOTE_RENDER_INFO_NOT_FOUND, streamLogInfo)
      : _logCreateLocalStreamEvent(EventNames.LOCAL_RENDER_INFO_NOT_FOUND, streamLogInfo);
    renderer.dispose();
    createViewType === 'remote'
      ? context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, undefined)
      : context.setLocalVideoStreamRendererView(callId, undefined);
    return;
  }

  if (refreshedRenderInfo.status === 'Stopping') {
    // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
    // put the view into the state.
    createViewType === 'remote'
      ? _logCreateRemoteStreamEvent(EventNames.REMOTE_CREATED_STREAM_STOPPING, streamLogInfo)
      : _logCreateLocalStreamEvent(EventNames.LOCAL_CREATED_STREAM_STOPPING, streamLogInfo);
    renderer.dispose();
    if (createViewType === 'remote') {
      internalContext.setRemoteRenderInfo(
        callId,
        participantKey,
        streamId,
        refreshedRenderInfo.stream as RemoteVideoStream,
        'NotRendered',
        undefined
      );
      context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, undefined);
    } else if (createViewType === 'local') {
      internalContext.setLocalRenderInfo(
        callId,
        refreshedRenderInfo.stream as LocalVideoStream,
        'NotRendered',
        undefined
      );
      context.setLocalVideoStreamRendererView(callId, undefined);
    }
    return;
  }

  // Else the stream still exists and status is not telling us to stop rendering. Complete the render process by
  // updating the state.
  if (createViewType === 'remote') {
    internalContext.setRemoteRenderInfo(
      callId,
      participantKey,
      streamId,
      refreshedRenderInfo.stream as RemoteVideoStream,
      'Rendered',
      renderer
    );
    context.setRemoteVideoStreamRendererView(
      callId,
      participantKey,
      streamId,
      convertFromSDKToDeclarativeVideoStreamRendererView(view)
    );
    _logCreateRemoteStreamEvent(EventNames.REMOTE_VIEW_RENDER_SUCCEED, streamLogInfo);
  } else if (createViewType == 'local') {
    internalContext.setLocalRenderInfo(callId, refreshedRenderInfo.stream as LocalVideoStream, 'Rendered', renderer);
    context.setLocalVideoStreamRendererView(callId, convertFromSDKToDeclarativeVideoStreamRendererView(view));
    _logCreateLocalStreamEvent(EventNames.LOCAL_VIEW_RENDER_SUCCEED, streamLogInfo);
  }

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

  _logDisposeStreamEvent(EventNames.START_DISPOSE_REMOTE_STREAM, streamLogInfo);

  context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, undefined);

  const renderInfo = internalContext.getRemoteRenderInfoForParticipant(callId, participantKey, streamId);
  if (!renderInfo) {
    _logDisposeStreamEvent(EventNames.REMOTE_DISPOSE_INFO_NOT_FOUND, streamLogInfo);
    return;
  }

  // Nothing to dispose of or clean up -- we can safely exit early here.
  if (renderInfo.status === 'NotRendered') {
    _logDisposeStreamEvent(EventNames.REMOTE_STREAM_ALREADY_DISPOSED, streamLogInfo);
    return;
  }

  // Status is already marked as "stopping" so we can exit early here. This is because stopping only occurs
  // when the stream is being created in createView but hasn't been completed being created yet. The createView
  // method will see the "stopping" status and perform the cleanup
  if (renderInfo.status === 'Stopping') {
    _logDisposeStreamEvent(EventNames.REMOTE_STREAM_STOPPING, streamLogInfo);
    return;
  }

  // If the stream is in the middle of being rendered (i.e. has state "Rendering"), we need the status as
  // "stopping" without performing any cleanup. This will tell the `createView` method that it should stop
  // rendering and clean up the state once the view has finished being created.
  if (renderInfo.status === 'Rendering') {
    _logDisposeStreamEvent(EventNames.REMOTE_STREAM_STOPPING, streamLogInfo);
    internalContext.setRemoteRenderInfo(callId, participantKey, streamId, renderInfo.stream, 'Stopping', undefined);
    return;
  }

  if (renderInfo.renderer) {
    _logDisposeStreamEvent(EventNames.DISPOSING_REMOTE_RENDERER, streamLogInfo);
    renderInfo.renderer.dispose();
    // Else the state must be in the "Rendered" state, so we can dispose the renderer and clean up the state.
    internalContext.setRemoteRenderInfo(callId, participantKey, streamId, renderInfo.stream, 'NotRendered', undefined);
  } else {
    _logDisposeStreamEvent(EventNames.REMOTE_RENDERER_NOT_FOUND, streamLogInfo);
  }
}

function disposeViewLocalVideo(context: CallContext, internalContext: InternalCallContext, callId: string): void {
  const renderInfo = internalContext.getLocalRenderInfo(callId);
  const streamType = renderInfo?.stream.mediaStreamType;
  const streamLogInfo = { callId, streamType };

  _logDisposeStreamEvent(EventNames.START_DISPOSE_LOCAL_STREAM, streamLogInfo);

  if (!renderInfo) {
    _logDisposeStreamEvent(EventNames.LOCAL_DISPOSE_INFO_NOT_FOUND, streamLogInfo);
    return;
  }

  // Nothing to dispose of or clean up -- we can safely exit early here.
  if (renderInfo.status === 'NotRendered') {
    _logDisposeStreamEvent(EventNames.LOCAL_STREAM_ALREADY_DISPOSED, streamLogInfo);
    return;
  }

  // Status is already marked as "stopping" so we can exit early here. This is because stopping only occurs
  // when the stream is being created in createView but hasn't been completed being created yet. The createView
  // method will see the "stopping" status and perform the cleanup
  if (renderInfo.status === 'Stopping') {
    _logDisposeStreamEvent(EventNames.LOCAL_STREAM_STOPPING, streamLogInfo);
    return;
  }

  // If the stream is in the middle of being rendered (i.e. has state "Rendering"), we need the status as
  // "stopping" without performing any cleanup. This will tell the `createView` method that it should stop
  // rendering and clean up the state once the view has finished being created.
  if (renderInfo.status === 'Rendering') {
    _logDisposeStreamEvent(EventNames.LOCAL_STREAM_STOPPING, streamLogInfo);
    internalContext.setLocalRenderInfo(callId, renderInfo.stream, 'Stopping', renderInfo.renderer);
    return;
  }

  if (renderInfo.renderer) {
    _logDisposeStreamEvent(EventNames.DISPOSING_LOCAL_RENDERER, streamLogInfo);
    renderInfo.renderer.dispose();

    // We will after disposing of the renderer tell the internal context and context that the
    // local view is gone so we need to update their states.
    internalContext.setLocalRenderInfo(callId, renderInfo.stream, 'NotRendered', undefined);
    context.setLocalVideoStreamRendererView(callId, undefined);
  } else {
    _logDisposeStreamEvent(EventNames.LOCAL_RENDERER_NOT_FOUND, streamLogInfo);
  }
}

function disposeViewUnparentedVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  stream: LocalVideoStreamState
): void {
  const streamType = stream.mediaStreamType;
  const streamLogInfo = { streamType };

  _logDisposeStreamEvent(EventNames.START_DISPOSE_LOCAL_STREAM, streamLogInfo);

  context.deleteDeviceManagerUnparentedView(stream);

  const renderInfo = internalContext.getUnparentedRenderInfo(stream);
  if (!renderInfo) {
    _logDisposeStreamEvent(EventNames.LOCAL_DISPOSE_INFO_NOT_FOUND, streamLogInfo);
    return;
  }

  if (renderInfo.status === 'Rendering') {
    _logDisposeStreamEvent(EventNames.LOCAL_STREAM_STOPPING, streamLogInfo);
    internalContext.setUnparentedRenderInfo(stream, renderInfo.stream, 'Stopping', undefined);
  } else {
    internalContext.deleteUnparentedRenderInfo(stream);
  }

  if (renderInfo.renderer) {
    _logDisposeStreamEvent(EventNames.DISPOSING_LOCAL_RENDERER, streamLogInfo);
    renderInfo.renderer.dispose();
  } else {
    _logDisposeStreamEvent(EventNames.LOCAL_RENDERER_NOT_FOUND, streamLogInfo);
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

  if (callId) {
    return createViewVideo(context, internalContext, callId, stream, participantId, options);
  } else if (!('id' in stream) && !callId) {
    // Render LocalVideoStream that is not part of a Call
    // Because it is not part of the call we don't tee errors to state naturally (e.g. via a Call Client function such as startVideo).
    // We do not have a startLocalPreviewVideo function, so as a workaround we ensure any errors are propagated here.
    return context.withAsyncErrorTeedToState(
      async () => await createViewUnparentedVideo(context, internalContext, stream, options),
      'Call.startVideo'
    )();
  } else {
    _logCreateLocalStreamEvent(EventNames.CREATE_STREAM_INVALID_PARAMS, { streamType });
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
    _logDisposeStreamEvent(EventNames.DISPOSE_STREAM_INVALID_PARAMS, { streamType });
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
