// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(together-mode) */
import { CreateViewOptions, VideoStreamRenderer } from '@azure/communication-calling';
/* @conditional-compile-remove(together-mode) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(together-mode) */
import {
  CallFeatureStreamName,
  CallFeatureStreamState,
  CreateViewResult,
  VideoStreamRendererViewState
} from './index-public';
/* @conditional-compile-remove(together-mode) */
import { InternalCallContext } from './InternalCallContext';
/* @conditional-compile-remove(together-mode) */
import { _logStreamEvent } from './StreamUtilsLogging';
/* @conditional-compile-remove(together-mode) */
import { EventNames } from './Logger';
/* @conditional-compile-remove(together-mode) */
import { convertFromSDKToDeclarativeVideoStreamRendererView } from './Converter';

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 *
 */
export function createCallFeatureView(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string | undefined,
  stream: CallFeatureStreamState,
  options?: CreateViewOptions
): Promise<CreateViewResult | undefined> {
  const streamType = stream.mediaStreamType;

  if (callId && isCallFeatureStream(stream)) {
    return createCallFeatureViewVideo(context, internalContext, callId, stream, options);
  } else {
    _logStreamEvent(EventNames.CREATE_STREAM_INVALID_PARAMS, { streamType });
    return Promise.resolve(undefined);
  }
}

/* @conditional-compile-remove(together-mode) */
// This function is used to create a view for a stream that is part of a call feature.
async function createCallFeatureViewVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  stream: CallFeatureStreamState,
  options?: CreateViewOptions
): Promise<CreateViewResult | undefined> {
  const streamEventType = 'createViewCallFeature';

  const streamType = stream?.mediaStreamType;
  const callFeatureStreamId = stream && stream.id;
  const streamLogInfo = {
    callId,
    undefined,
    streamId: callFeatureStreamId,
    streamType,
    streamEventType
  };

  // make different logging announcement based on whether or not we are starting a local or remote
  _logStreamEvent(EventNames.CREATING_VIEW, streamLogInfo);

  const featureName = getStreamFeatureName(stream);
  // if we have a participant Id and a stream get the remote info, else get the local render info from state.
  const renderInfo = internalContext.getCallFeatureRenderInfo(callId, featureName, stream.mediaStreamType);
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
    _logStreamEvent(EventNames.STREAM_STOPPING, streamLogInfo);
    internalContext.setCallFeatureRenderInfo(
      callId,
      featureName,
      stream.mediaStreamType,
      renderInfo.stream,
      'Rendering',
      renderInfo.renderer
    );
    return;
  }

  const renderer = new VideoStreamRenderer(renderInfo.stream);
  internalContext.setCallFeatureRenderInfo(
    callId,
    featureName,
    stream.mediaStreamType,
    renderInfo.stream,
    'Rendering',
    undefined
  );

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    _logStreamEvent(EventNames.CREATE_STREAM_FAIL, streamLogInfo, e);
    internalContext.setCallFeatureRenderInfo(
      callId,
      featureName,
      stream.mediaStreamType,
      renderInfo.stream,
      'NotRendered',
      undefined
    );
    throw e;
  }

  // Since render could take some time, we need to check if the stream is still valid and if we received a signal to
  // stop rendering.
  const refreshedRenderInfo = internalContext.getCallFeatureRenderInfo(callId, featureName, stream.mediaStreamType);

  if (!refreshedRenderInfo) {
    // RenderInfo was removed. This should not happen unless stream was removed from the call so dispose the renderer
    // and clean up the state.
    _logStreamEvent(EventNames.RENDER_INFO_NOT_FOUND, streamLogInfo);
    renderer.dispose();
    setCallFeatureVideoRendererView(callId, featureName, context, stream.mediaStreamType, undefined);
    return;
  }

  if (refreshedRenderInfo.status === 'Stopping') {
    // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
    // put the view into the state.
    _logStreamEvent(EventNames.CREATED_STREAM_STOPPING, streamLogInfo);
    renderer.dispose();
    internalContext.setCallFeatureRenderInfo(
      callId,
      featureName,
      stream.mediaStreamType,
      refreshedRenderInfo.stream,
      'NotRendered',
      undefined
    );
    setCallFeatureVideoRendererView(callId, featureName, context, stream.mediaStreamType, undefined);
    return;
  }

  // Else the stream still exists and status is not telling us to stop rendering. Complete the render process by
  // updating the state.
  internalContext.setCallFeatureRenderInfo(
    callId,
    featureName,
    stream.mediaStreamType,
    refreshedRenderInfo.stream,
    'Rendered',
    renderer
  );
  setCallFeatureVideoRendererView(
    callId,
    featureName,
    context,
    stream.mediaStreamType,
    convertFromSDKToDeclarativeVideoStreamRendererView(view)
  );
  _logStreamEvent(EventNames.VIEW_RENDER_SUCCEED, streamLogInfo);

  return {
    renderer,
    view
  };
}

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 */
export function disposeCallFeatureView(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string | undefined,
  stream: CallFeatureStreamState
): void {
  const streamType = stream.mediaStreamType;
  if (callId && isCallFeatureStream(stream)) {
    return disposeCallFeatureViewVideo(context, internalContext, callId, stream);
  } else {
    _logStreamEvent(EventNames.DISPOSE_STREAM_INVALID_PARAMS, { streamType });
    return;
  }
}

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 */
function disposeCallFeatureViewVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  stream: CallFeatureStreamState
): void {
  const streamEventType = 'disposeViewCallFeature';

  const streamType = stream.mediaStreamType;
  const callFeatureStreamId = stream && stream.id;

  const streamLogInfo = { callId, undefined, streamId: callFeatureStreamId, streamType };

  _logStreamEvent(EventNames.START_DISPOSE_STREAM, streamLogInfo);

  const featureName: CallFeatureStreamName = getStreamFeatureName(stream);

  if (streamEventType === 'disposeViewCallFeature') {
    setCallFeatureVideoRendererView(callId, featureName, context, streamType, undefined);
  }

  const renderInfo = internalContext.getCallFeatureRenderInfo(callId, featureName, stream.mediaStreamType);
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
    internalContext.setCallFeatureRenderInfo(
      callId,
      featureName,
      streamType,
      renderInfo.stream,
      'Stopping',
      renderInfo.renderer
    );
    return;
  }

  if (renderInfo.renderer) {
    _logStreamEvent(EventNames.DISPOSING_RENDERER, streamLogInfo);
    renderInfo.renderer.dispose();
    // Else the state must be in the "Rendered" state, so we can dispose the renderer and clean up the state.
    internalContext.setCallFeatureRenderInfo(
      callId,
      featureName,
      streamType,
      renderInfo.stream,
      'NotRendered',
      undefined
    );
    setCallFeatureVideoRendererView(callId, featureName, context, streamType, undefined);
  } else {
    _logStreamEvent(EventNames.RENDERER_NOT_FOUND, streamLogInfo);
  }
}

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 */
const setCallFeatureVideoRendererView = (
  callId: string,
  featureName: CallFeatureStreamName,
  context: CallContext,
  streamType: string,
  view: VideoStreamRendererViewState | undefined
): void => {
  if (featureName === 'togetherMode') {
    context.setTogetherModeVideoStreamRendererView(callId, streamType, view);
  }
};

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 */
const getStreamFeatureName = (stream: CallFeatureStreamState): CallFeatureStreamName => {
  if (stream.feature) {
    return stream.feature;
  }
  throw new Error('Feature name not found');
};

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 */
function isCallFeatureStream(stream: CallFeatureStreamState): boolean {
  return 'feature' in stream || false;
}
