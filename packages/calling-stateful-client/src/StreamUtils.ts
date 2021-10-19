// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CreateViewOptions, LocalVideoStream, VideoStreamRenderer } from '@azure/communication-calling';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { LocalVideoStreamState, RemoteVideoStreamState } from './CallClientState';
import { CallContext } from './CallContext';
import {
  convertSdkLocalStreamToDeclarativeLocalStream,
  convertSdkRemoteStreamToDeclarativeRemoteStream,
  convertFromSDKToDeclarativeVideoStreamRendererView
} from './Converter';
import { InternalCallContext } from './InternalCallContext';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';

async function createViewRemoteVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  participantId: CommunicationIdentifierKind | string,
  stream: RemoteVideoStreamState,
  options?: CreateViewOptions
): Promise<void> {
  // Render RemoteVideoStream that is part of a Call
  const streamId = stream.id;
  let participantKey;
  if (typeof participantId === 'string') {
    participantKey = participantId;
  } else {
    participantKey = toFlatCommunicationIdentifier(participantId);
  }
  const renderInfo = internalContext.getRemoteRenderInfoForParticipant(callId, participantKey, streamId);

  if (!renderInfo) {
    console.warn('RemoteVideoStream not found in state');
    return;
  }

  if (renderInfo.status === 'Rendered') {
    console.warn('RemoteVideoStream is already rendered');
    return;
  }

  if (renderInfo.status === 'Rendering') {
    console.warn('RemoteVideoStream rendering is already in progress');
    return;
  }

  if (renderInfo.status === 'Stopping') {
    console.warn('RemoteVideoStream is in the middle of stopping');
    return;
  }

  const renderer = new VideoStreamRenderer(renderInfo.stream);

  internalContext.setRemoteRenderInfo(callId, participantKey, streamId, renderInfo.stream, 'Rendering', undefined);

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    internalContext.setRemoteRenderInfo(callId, participantKey, streamId, renderInfo.stream, 'NotRendered', undefined);
    throw e;
  }

  const refreshedRenderInfo = internalContext.getRemoteRenderInfoForParticipant(callId, participantKey, streamId);
  if (!refreshedRenderInfo) {
    // RenderInfo was removed. This should not happen unless stream was removed from the call so dispose the renderer
    // and clean up state.
    renderer.dispose();
    context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, undefined);
    return;
  }

  if (refreshedRenderInfo.status === 'Stopping') {
    // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
    // put the view into the state.
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
}

async function createViewLocalVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  options?: CreateViewOptions
): Promise<void> {
  // Render LocalVideoStream that is part of a Call
  const renderInfo = internalContext.getLocalRenderInfo(callId);

  if (!renderInfo) {
    console.warn('LocalVideoStream not found in state');
    return;
  }

  if (renderInfo.status === 'Rendered') {
    console.warn('LocalVideoStream is already rendered');
    return;
  }

  if (renderInfo.status === 'Rendering') {
    console.warn('LocalVideoStream rendering is already in progress');
    return;
  }

  if (renderInfo.status === 'Stopping') {
    console.warn('LocalVideoStream is in the middle of stopping');
    return;
  }

  const renderer = new VideoStreamRenderer(renderInfo.stream);

  internalContext.setLocalRenderInfo(callId, renderInfo.stream, 'Rendering', renderer);

  let view;
  try {
    view = await renderer.createView(options);
  } catch (e) {
    internalContext.setLocalRenderInfo(callId, renderInfo.stream, 'NotRendered', undefined);
    throw e;
  }

  // Since render could take some time, we need to check if the stream is still valid and if we received a signal to
  // stop rendering.
  const refreshedRenderInfo = internalContext.getLocalRenderInfo(callId);
  if (!refreshedRenderInfo) {
    // RenderInfo was removed. This should not happen unless stream was removed from the call so dispose the renderer
    // and clean up the state.
    renderer.dispose();
    context.setLocalVideoStreamRendererView(callId, undefined);
    return;
  }

  if (refreshedRenderInfo.status === 'Stopping') {
    // Stop render was called on this stream after we had started rendering. We will dispose this view and do not
    // put the view into the state.
    renderer.dispose();
    internalContext.setLocalRenderInfo(callId, refreshedRenderInfo.stream, 'NotRendered', undefined);
    context.setLocalVideoStreamRendererView(callId, undefined);
    return;
  }

  // Else The stream still exists and status is not telling us to stop rendering. Complete the render process by
  // updating the state.
  internalContext.setLocalRenderInfo(callId, refreshedRenderInfo.stream, 'Rendered', renderer);
  context.setLocalVideoStreamRendererView(callId, convertFromSDKToDeclarativeVideoStreamRendererView(view));
}

async function createViewUnparentedVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  stream: LocalVideoStreamState,
  options?: CreateViewOptions
): Promise<void> {
  const renderInfo = internalContext.getUnparentedRenderInfo(stream);

  if (renderInfo && renderInfo.status === 'Rendered') {
    console.warn('Unparented LocalVideoStream is already rendered');
    return;
  }

  if (renderInfo && renderInfo.status === 'Rendering') {
    console.warn('Unparented LocalVideoStream rendering is already in progress');
    return;
  }

  if (renderInfo && renderInfo.status === 'Stopping') {
    console.warn('Unparented LocalVideoStream is in the middle of stopping');
    return;
  }

  const localVideoStream = new LocalVideoStream(stream.source);
  const renderer = new VideoStreamRenderer(localVideoStream);

  internalContext.setUnparentedRenderInfo(stream, localVideoStream, 'Rendering', undefined);

  try {
    const view = await renderer.createView(options);
    stream.view = convertFromSDKToDeclarativeVideoStreamRendererView(view);
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
  context.setDeviceManagerUnparentedView(stream);
}

function disposeViewRemoteVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  participantId: CommunicationIdentifierKind | string,
  stream: RemoteVideoStreamState
): void {
  const streamId = stream.id;

  let participantKey;
  if (typeof participantId === 'string') {
    participantKey = participantId;
  } else {
    participantKey = toFlatCommunicationIdentifier(participantId);
  }

  context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, undefined);

  const renderInfo = internalContext.getRemoteRenderInfoForParticipant(callId, participantKey, streamId);
  if (!renderInfo) {
    return;
  }

  // Sets the status and also renderer. I think we need to always set renderer to undefined since in all status when
  // cleaned up should have renderer as undefined. If the status is 'Rendered' and renderer is not defined it should
  // be cleaned up below so we can set it to undefined here.
  if (renderInfo.status === 'Rendering') {
    internalContext.setRemoteRenderInfo(callId, participantKey, streamId, renderInfo.stream, 'Stopping', undefined);
  } else {
    internalContext.setRemoteRenderInfo(callId, participantKey, streamId, renderInfo.stream, 'NotRendered', undefined);
  }

  if (renderInfo.renderer) {
    renderInfo.renderer.dispose();
  }
}

function disposeViewLocalVideo(context: CallContext, internalContext: InternalCallContext, callId: string): void {
  context.setLocalVideoStreamRendererView(callId, undefined);

  const renderInfo = internalContext.getLocalRenderInfo(callId);
  if (!renderInfo) {
    return;
  }

  // Sets the status and also renderer. I think we need to always set renderer to undefined since in all status when
  // cleaned up should have renderer as undefined. If the status is 'Rendered' and renderer is not defined it should
  // be cleaned up below so we can set it to undefined here.
  if (renderInfo.status === 'Rendering') {
    internalContext.setLocalRenderInfo(callId, renderInfo.stream, 'Stopping', undefined);
  } else {
    internalContext.setLocalRenderInfo(callId, renderInfo.stream, 'NotRendered', undefined);
  }

  if (renderInfo.renderer) {
    renderInfo.renderer.dispose();
  }
}

function disposeViewUnparentedVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  stream: LocalVideoStreamState
): void {
  context.deleteDeviceManagerUnparentedView(stream);

  const renderInfo = internalContext.getUnparentedRenderInfo(stream);
  if (!renderInfo) {
    return;
  }

  if (renderInfo.status === 'Rendering') {
    internalContext.setUnparentedRenderInfo(stream, renderInfo.stream, 'Stopping', undefined);
  } else {
    internalContext.deleteUnparentedRenderInfo(stream);
  }

  if (renderInfo.renderer) {
    renderInfo.renderer.dispose();
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
): Promise<void> {
  if ('id' in stream && callId && participantId) {
    // Render RemoteVideoStream that is part of a Call
    return createViewRemoteVideo(context, internalContext, callId, participantId, stream, options);
  } else if (!('id' in stream) && callId) {
    // Render LocalVideoStream that is part of a Call
    return createViewLocalVideo(context, internalContext, callId, options);
  } else if (!('id' in stream) && !callId) {
    // Render LocalVideoStream that is not part of a Call
    return createViewUnparentedVideo(context, internalContext, stream, options);
  } else {
    console.warn('Invalid combination of parameters');
    return Promise.resolve();
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
  if ('id' in stream && callId && participantId) {
    // Stop rendering RemoteVideoStream that is part of a Call
    disposeViewRemoteVideo(context, internalContext, callId, participantId, stream);
  } else if (!('id' in stream) && callId) {
    // Stop rendering LocalVideoStream that is part of a Call
    disposeViewLocalVideo(context, internalContext, callId);
  } else if (!('id' in stream) && !callId) {
    // Stop rendering LocalVideoStream that is not part of a Call
    disposeViewUnparentedVideo(context, internalContext, stream);
  } else {
    console.warn('Invalid combination of parameters');
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
  const remoteStreamAndRenderers = internalContext.getRemoteRenderInfos();
  for (const [callId] of remoteStreamAndRenderers.entries()) {
    disposeAllViewsFromCall(context, internalContext, callId);
  }
}
