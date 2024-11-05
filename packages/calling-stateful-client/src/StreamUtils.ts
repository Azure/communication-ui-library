// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
import { _logStreamEvent } from './StreamUtilsLogging';

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
  let streamEventType: 'createViewLocal' | 'createViewRemote' | 'createViewUnparented';

  // we will reuse these for local as well but we need to make sure the remote stream is passed in like before.

  if (participantId) {
    streamEventType = 'createViewRemote';
  } else if (callId) {
    streamEventType = 'createViewLocal';
  } else {
    // TODO update for when unparented view.
    throw new Error('unparented createView not implemented yet here');
    streamEventType = 'createViewUnparented';
  }

  const streamType = stream?.mediaStreamType;
  const localStreamKey = (stream as LocalVideoStream).mediaStreamType;
  const remoteStreamId = (stream as RemoteVideoStream).id;

  // we want to check to see if there is a participantId this will tell us whether its a local stream or a remote one.
  const participantKey =
    streamEventType === 'createViewRemote' && participantId
      ? typeof participantId === 'string'
        ? participantId
        : toFlatCommunicationIdentifier(participantId)
      : undefined;

  const streamLogInfo = {
    callId,
    participantKey,
    streamId: remoteStreamId ?? localStreamKey,
    streamType,
    streamEventType
  };

  // make different logging announcement based on whether or not we are starting a local or remote
  _logStreamEvent(EventNames.CREATING_VIEW, streamLogInfo);

  // if we have a participant Id and a stream get the remote info, else get the local render info from state.
  const renderInfo =
    streamEventType === 'createViewRemote' && participantKey
      ? internalContext.getRemoteRenderInfoForParticipant(callId, participantKey, remoteStreamId)
      : internalContext.getLocalRenderInfo(callId, localStreamKey);

  if (!renderInfo) {
    _logStreamEvent(EventNames.STREAM_NOT_FOUND, streamLogInfo);
    return;
  }

  if (renderInfo.status === 'Rendered') {
    _logStreamEvent(EventNames.STREAM_ALREADY_RENDERED, streamLogInfo);
    return;
  }

  if (renderInfo.status === 'Rendering') {
    // Do not log to console here as this is a very common situation due to UI rerenders while
    // the video rendering is in progress.
    _logStreamEvent(EventNames.STREAM_RENDERING, streamLogInfo);
    return;
  }

  // "Stopping" only happens if the stream was in "rendering" but `disposeView` was called.
  // Now that `createView` has been re-called, we can flip the state back to "rendering".
  if (renderInfo.status === 'Stopping') {
    if (streamEventType === 'createViewRemote' && participantKey) {
      _logStreamEvent(EventNames.STREAM_STOPPING, streamLogInfo);
      internalContext.setRemoteRenderInfo(
        callId,
        participantKey,
        remoteStreamId,
        renderInfo.stream as RemoteVideoStream,
        'Rendering',
        renderInfo.renderer
      );
    } else if (streamEventType === 'createViewLocal') {
      _logStreamEvent(EventNames.STREAM_STOPPING, streamLogInfo);
      internalContext.setLocalRenderInfo(
        callId,
        localStreamKey,
        renderInfo.stream as LocalVideoStream,
        'Rendering',
        renderInfo.renderer
      );
    }
    return;
  }

  const renderer = new VideoStreamRenderer(renderInfo.stream);

  streamEventType === 'createViewRemote' && participantKey
    ? internalContext.setRemoteRenderInfo(
        callId,
        participantKey,
        remoteStreamId,
        renderInfo.stream as RemoteVideoStream,
        'Rendering',
        undefined
      )
    : internalContext.setLocalRenderInfo(
        callId,
        localStreamKey,
        renderInfo.stream as LocalVideoStream,
        'Rendering',
        renderer
      );

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    if (streamEventType === 'createViewRemote' && participantKey) {
      _logStreamEvent(EventNames.CREATE_STREAM_FAIL, streamLogInfo);
      internalContext.setRemoteRenderInfo(
        callId,
        participantKey,
        remoteStreamId,
        renderInfo.stream as RemoteVideoStream,
        'NotRendered',
        undefined
      );
    } else if (streamEventType === 'createViewLocal') {
      _logStreamEvent(EventNames.CREATE_STREAM_FAIL, streamLogInfo, e);
      internalContext.setLocalRenderInfo(
        callId,
        localStreamKey,
        renderInfo.stream as LocalVideoStream,
        'NotRendered',
        undefined
      );
    }
    throw e;
  }

  // Since render could take some time, we need to check if the stream is still valid and if we received a signal to
  // stop rendering.
  const refreshedRenderInfo =
    streamEventType === 'createViewRemote' && participantKey
      ? internalContext.getRemoteRenderInfoForParticipant(callId, participantKey, remoteStreamId)
      : internalContext.getLocalRenderInfo(callId, localStreamKey);

  if (!refreshedRenderInfo) {
    // RenderInfo was removed. This should not happen unless stream was removed from the call so dispose the renderer
    // and clean up the state.
    _logStreamEvent(EventNames.RENDER_INFO_NOT_FOUND, streamLogInfo);
    renderer.dispose();
    streamEventType === 'createViewRemote' && participantKey
      ? context.setRemoteVideoStreamRendererView(callId, participantKey, remoteStreamId, undefined)
      : context.setLocalVideoStreamRendererView(callId, localStreamKey, undefined);
    return;
  }

  if (refreshedRenderInfo.status === 'Stopping') {
    // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
    // put the view into the state.
    streamEventType === 'createViewRemote';
    _logStreamEvent(EventNames.CREATED_STREAM_STOPPING, streamLogInfo);
    renderer.dispose();
    if (streamEventType === 'createViewRemote' && participantKey) {
      internalContext.setRemoteRenderInfo(
        callId,
        participantKey,
        remoteStreamId,
        refreshedRenderInfo.stream as RemoteVideoStream,
        'NotRendered',
        undefined
      );
      context.setRemoteVideoStreamRendererView(callId, participantKey, remoteStreamId, undefined);
    } else if (streamEventType === 'createViewLocal') {
      internalContext.setLocalRenderInfo(
        callId,
        localStreamKey,
        refreshedRenderInfo.stream as LocalVideoStream,
        'NotRendered',
        undefined
      );
      context.setLocalVideoStreamRendererView(callId, localStreamKey, undefined);
    }
    return;
  }

  // Else the stream still exists and status is not telling us to stop rendering. Complete the render process by
  // updating the state.
  if (streamEventType === 'createViewRemote' && participantKey) {
    internalContext.setRemoteRenderInfo(
      callId,
      participantKey,
      remoteStreamId,
      refreshedRenderInfo.stream as RemoteVideoStream,
      'Rendered',
      renderer
    );
    context.setRemoteVideoStreamRendererView(
      callId,
      participantKey,
      remoteStreamId,
      convertFromSDKToDeclarativeVideoStreamRendererView(view)
    );
    _logStreamEvent(EventNames.VIEW_RENDER_SUCCEED, streamLogInfo);
  } else if (streamEventType === 'createViewLocal') {
    internalContext.setLocalRenderInfo(
      callId,
      localStreamKey,
      refreshedRenderInfo.stream as LocalVideoStream,
      'Rendered',
      renderer
    );
    context.setLocalVideoStreamRendererView(
      callId,
      localStreamKey,
      convertFromSDKToDeclarativeVideoStreamRendererView(view)
    );
    _logStreamEvent(EventNames.VIEW_RENDER_SUCCEED, streamLogInfo);
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
  internalContext.subscribeToUnparentedViewVideoEffects(localVideoStream, context);
  context.setDeviceManagerUnparentedView(stream, convertFromSDKToDeclarativeVideoStreamRendererView(view));

  return {
    renderer,
    view
  };
}

function disposeViewVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  stream: RemoteVideoStreamState | LocalVideoStreamState,
  participantId?: CommunicationIdentifierKind | string
): void {
  // we can only have 3 types of createView
  let streamEventType: 'disposeViewLocal' | 'disposeViewRemote' | 'disposeViewUnparented';

  // we will reuse these for local as well but we need to make sure the remote stream is passed in like before.

  if (participantId) {
    streamEventType = 'disposeViewRemote';
  } else if (callId) {
    streamEventType = 'disposeViewLocal';
  } else {
    // TODO update for when unparented view.
    streamEventType = 'disposeViewUnparented';
  }

  const streamType = stream.mediaStreamType;
  const localStreamKey = (stream as LocalVideoStream).mediaStreamType;
  const remoteStreamId = (stream as RemoteVideoStream).id;

  // we want to check to see if there is a participantId this will tell us whether its a local stream or a remote one.
  const participantKey =
    streamEventType === 'disposeViewRemote' && participantId
      ? typeof participantId === 'string'
        ? participantId
        : toFlatCommunicationIdentifier(participantId)
      : undefined;
  const streamLogInfo = { callId, participantKey, streamId: remoteStreamId ?? localStreamKey, streamType };

  _logStreamEvent(EventNames.START_DISPOSE_STREAM, streamLogInfo);

  if (streamEventType === 'disposeViewRemote' && participantKey) {
    context.setRemoteVideoStreamRendererView(callId, participantKey, remoteStreamId, undefined);
  }

  const renderInfo =
    streamEventType === 'disposeViewRemote' && participantKey
      ? internalContext.getRemoteRenderInfoForParticipant(callId, participantKey, remoteStreamId)
      : internalContext.getLocalRenderInfo(callId, localStreamKey);

  if (!renderInfo) {
    _logStreamEvent(EventNames.DISPOSE_INFO_NOT_FOUND, streamLogInfo);
    return;
  }

  // Nothing to dispose of or clean up -- we can safely exit early here.
  if (renderInfo.status === 'NotRendered') {
    _logStreamEvent(EventNames.STREAM_ALREADY_DISPOSED, streamLogInfo);
    return;
  }

  // Status is already marked as "stopping" so we can exit early here. This is because stopping only occurs
  // when the stream is being created in createView but hasn't been completed being created yet. The createView
  // method will see the "stopping" status and perform the cleanup
  if (renderInfo.status === 'Stopping') {
    _logStreamEvent(EventNames.STREAM_STOPPING, streamLogInfo);
    return;
  }

  // If the stream is in the middle of being rendered (i.e. has state "Rendering"), we need the status as
  // "stopping" without performing any cleanup. This will tell the `createView` method that it should stop
  // rendering and clean up the state once the view has finished being created.
  if (renderInfo.status === 'Rendering') {
    _logStreamEvent(EventNames.STREAM_STOPPING, streamLogInfo);
    streamEventType === 'disposeViewRemote' && participantKey
      ? internalContext.setRemoteRenderInfo(
          callId,
          participantKey,
          remoteStreamId,
          renderInfo.stream as RemoteVideoStream,
          'Stopping',
          undefined
        )
      : internalContext.setLocalRenderInfo(
          callId,
          localStreamKey,
          renderInfo.stream as LocalVideoStream,
          'Stopping',
          renderInfo.renderer
        );
    return;
  }

  if (renderInfo.renderer) {
    _logStreamEvent(EventNames.DISPOSING_RENDERER, streamLogInfo);
    renderInfo.renderer.dispose();
    // Else the state must be in the "Rendered" state, so we can dispose the renderer and clean up the state.
    if (streamEventType === 'disposeViewRemote' && participantKey) {
      internalContext.setRemoteRenderInfo(
        callId,
        participantKey,
        remoteStreamId,
        renderInfo.stream as RemoteVideoStream,
        'NotRendered',
        undefined
      );
    } else if (streamEventType === 'disposeViewLocal') {
      internalContext.setLocalRenderInfo(
        callId,
        localStreamKey,
        renderInfo.stream as LocalVideoStream,
        'NotRendered',
        undefined
      );
      context.setLocalVideoStreamRendererView(callId, localStreamKey, undefined);
    }
  } else {
    _logStreamEvent(EventNames.RENDERER_NOT_FOUND, streamLogInfo);
  }
}

function disposeViewUnparentedVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  stream: LocalVideoStreamState
): void {
  const streamType = stream.mediaStreamType;
  const streamLogInfo = { streamType, streamEventType: 'disposeViewUnparented' };

  _logStreamEvent(EventNames.START_DISPOSE_STREAM, streamLogInfo);

  context.deleteDeviceManagerUnparentedView(stream);

  const renderInfo = internalContext.getUnparentedRenderInfo(stream);
  if (!renderInfo) {
    _logStreamEvent(EventNames.DISPOSE_INFO_NOT_FOUND, streamLogInfo);
    return;
  }

  if (renderInfo.status === 'Rendering') {
    _logStreamEvent(EventNames.STREAM_STOPPING, streamLogInfo);
    internalContext.setUnparentedRenderInfo(stream, renderInfo.stream, 'Stopping', undefined);
  } else {
    internalContext.deleteUnparentedRenderInfo(stream);
  }

  if (renderInfo.renderer) {
    _logStreamEvent(EventNames.DISPOSING_RENDERER, streamLogInfo);
    renderInfo.renderer.dispose();
  } else {
    _logStreamEvent(EventNames.RENDERER_NOT_FOUND, streamLogInfo);
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
    _logStreamEvent(EventNames.CREATE_STREAM_INVALID_PARAMS, { streamType });
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
  if (callId) {
    disposeViewVideo(context, internalContext, callId, stream, participantId);
  } else if (!('id' in stream) && !callId) {
    // Stop rendering LocalVideoStream that is not part of a Call
    // Because it is not part of the call we don't tee errors to state naturally (e.g. via a Call Client function such as startVideo).
    // We do not have a stopLocalPreviewVideo function, so as a workaround we ensure any errors are propagated here.
    context.withErrorTeedToState(
      () => disposeViewUnparentedVideo(context, internalContext, stream),
      'Call.stopVideo'
    )();
  } else {
    _logStreamEvent(EventNames.DISPOSE_STREAM_INVALID_PARAMS, { streamType });
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
  const remoteStreams = internalContext.getRemoteRenderInfoForCall(callId);
  if (remoteStreams) {
    for (const [participantKey, participantStreams] of remoteStreams.entries()) {
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

  const localStreams = internalContext.getLocalRenderInfosForCall(callId);
  if (localStreams) {
    for (const localStreamAndRenderer of localStreams.values()) {
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
  }
  /* @conditional-compile-remove(together-mode) */
  const callFeatureStreams = internalContext.getCallFeatureRenderInfosForCall(callId);
  /* @conditional-compile-remove(together-mode) */
  if (callFeatureStreams) {
    for (const featureStreams of callFeatureStreams.values()) {
      for (const streamAndRenderer of featureStreams.values()) {
        disposeView(
          context,
          internalContext,
          callId,
          undefined,
          convertSdkRemoteStreamToDeclarativeRemoteStream(streamAndRenderer.stream as RemoteVideoStream)
        );
      }
    }
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
