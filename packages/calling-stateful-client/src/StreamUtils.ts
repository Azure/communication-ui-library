// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CreateViewOptions, LocalVideoStream, VideoStreamRenderer } from '@azure/communication-calling';
import {
  CommunicationUserKind,
  MicrosoftTeamsUserKind,
  PhoneNumberKind,
  UnknownIdentifierKind
} from '@azure/communication-common';
import { LocalVideoStream as StatefulLocalVideoStream, RemoteVideoStream } from './CallClientState';
import { CallContext } from './CallContext';
import {
  convertSdkLocalStreamToDeclarativeLocalStream,
  convertSdkRemoteStreamToDeclarativeRemoteStream,
  convertFromSDKToDeclarativeVideoStreamRendererView
} from './Converter';
import { InternalCallContext } from './InternalCallContext';
import { toFlatCommunicationIdentifier } from 'acs-ui-common';

async function createViewRemoteVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  participantId: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind | string,
  stream: RemoteVideoStream,
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
  const remoteStreamAndRenderer = internalContext.getRemoteStreamAndRendererForParticipant(
    callId,
    participantKey,
    streamId
  );

  if (!remoteStreamAndRenderer) {
    console.warn('RemoteVideoStream not found in state');
    return;
  }

  if (remoteStreamAndRenderer.renderer) {
    console.warn('RemoteVideoStream rendering already started or completed');
    return;
  }

  const status = context
    .getState()
    .calls.get(callId)
    ?.remoteParticipants.get(participantKey)
    ?.videoStreams.get(streamId)?.viewStatus;

  if (!status) {
    console.warn('StreamId not found in state');
    return;
  }

  if (status === 'Rendered') {
    console.warn('RemoteVideoStream is already rendered');
    return;
  }

  if (status === 'Rendering') {
    console.warn('RemoteVideoStream rendering is already in progress');
    return;
  }

  if (status === 'Stopping') {
    console.warn('RemoteVideoStream is in the middle of stopping');
    return;
  }

  const renderer = new VideoStreamRenderer(remoteStreamAndRenderer.stream);

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
      renderer.dispose();
      internalContext.setRemoteStreamAndRenderer(
        callId,
        participantKey,
        streamId,
        remoteStreamAndRenderer.stream,
        undefined
      );
      context.setRemoteVideoStreamRendererView(callId, participantKey, streamId, 'NotRendered', undefined);
    } else {
      // The stream still exists and status is not telling us to stop rendering. Complete the render process by
      // updating the state.
      internalContext.setRemoteStreamAndRenderer(
        callId,
        participantKey,
        streamId,
        remoteStreamAndRenderer.stream,
        renderer
      );
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
    internalContext.removeRemoteStreamAndRenderer(callId, participantKey, streamId);
  }
}

async function createViewLocalVideo(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string,
  options?: CreateViewOptions
): Promise<void> {
  // Render LocalVideoStream that is part of a Call
  const localStreamAndRenderer = internalContext.getLocalStreamAndRenderer(callId);
  const status = context.getState().calls.get(callId)?.localVideoStreams[0]?.viewStatus;

  if (!localStreamAndRenderer || !status) {
    console.warn('LocalVideoStream not found in state');
    return;
  }

  if (localStreamAndRenderer.renderer) {
    console.warn('LocalVideoStream rendering started or completed');
    return;
  }

  if (status === 'Rendered') {
    console.warn('LocalVideoStream is already rendered');
    return;
  }

  if (status === 'Rendering') {
    console.warn('LocalVideoStream rendering is already in progress');
    return;
  }

  if (status === 'Stopping') {
    console.warn('LocalVideoStream is in the middle of stopping');
    return;
  }

  const renderer = new VideoStreamRenderer(localStreamAndRenderer.stream);

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
      internalContext.setLocalStreamAndRenderer(callId, localStreamAndRenderer.stream, undefined);
      context.setLocalVideoStreamRendererView(callId, 'NotRendered', undefined);
    } else {
      // The stream still exists and status is not telling us to stop rendering. Complete the render process by
      // updating the state.
      internalContext.setLocalStreamAndRenderer(callId, localStreamAndRenderer.stream, renderer);
      context.setLocalVideoStreamRendererView(
        callId,
        'Rendered',
        convertFromSDKToDeclarativeVideoStreamRendererView(view)
      );
    }
  } else {
    // Stream was deleted from state and we have no where to put the rendered view, so dispose it and return.
    renderer.dispose();
    internalContext.removeLocalStreamAndRenderer(callId);
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
    console.warn('Unparented LocalVideoStream is already rendered');
    return;
  }

  if (status && status === 'Rendering') {
    console.warn('Unparented LocalVideoStream rendering is already in progress');
    return;
  }

  if (status && status === 'Stopping') {
    console.warn('Unparented LocalVideoStream is in the middle of stopping');
    return;
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
  participantId: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind | string,
  stream: RemoteVideoStream
): void {
  const streamId = stream.id;

  // Cleanup internal renderer
  let participantKey;
  if (typeof participantId === 'string') {
    participantKey = participantId;
  } else {
    participantKey = toFlatCommunicationIdentifier(participantId);
  }
  const remoteStreamAndRenderer = internalContext.getRemoteStreamAndRendererForParticipant(
    callId,
    participantKey,
    streamId
  );
  if (remoteStreamAndRenderer && remoteStreamAndRenderer.renderer) {
    remoteStreamAndRenderer.renderer.dispose();
    internalContext.setRemoteStreamAndRenderer(
      callId,
      participantKey,
      streamId,
      remoteStreamAndRenderer.stream,
      undefined
    );
  }

  // Cleanup views in state
  if (participantKey) {
    // If the status is Rendering then set it to Stopping so eventually when the createView finishes awaiting it can
    // check the state and then dispose/stop the render.
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
  const localStreamAndRenderer = internalContext.getLocalStreamAndRenderer(callId);
  if (localStreamAndRenderer && localStreamAndRenderer.renderer) {
    localStreamAndRenderer.renderer.dispose();
    internalContext.setLocalStreamAndRenderer(callId, localStreamAndRenderer.stream, undefined);
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
    // If the status is Rendering then set it to Stopping so eventually when the createView finishes awaiting it can
    // check the state and then dispose/stop the render.
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
  participantId:
    | CommunicationUserKind
    | PhoneNumberKind
    | MicrosoftTeamsUserKind
    | UnknownIdentifierKind
    | string
    | undefined,
  stream: StatefulLocalVideoStream | RemoteVideoStream,
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

export function disposeView(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string | undefined,
  participantId:
    | CommunicationUserKind
    | PhoneNumberKind
    | MicrosoftTeamsUserKind
    | UnknownIdentifierKind
    | string
    | undefined,
  stream: StatefulLocalVideoStream | RemoteVideoStream
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

// Only stops videos that are tied to a Call.
export function disposeAllViewsFromCall(
  context: CallContext,
  internalContext: InternalCallContext,
  callId: string
): void {
  const callStreams = internalContext.getRemoteStreamAndRenderersForCall(callId);
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
  const localStreamAndRenderer = internalContext.getLocalStreamAndRenderer(callId);
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

export function disposeAllViews(context: CallContext, internalContext: InternalCallContext): void {
  const remoteStreamAndRenderers = internalContext.getRemoteStreamAndRenderersAll();
  for (const [callId] of remoteStreamAndRenderers.entries()) {
    disposeAllViewsFromCall(context, internalContext, callId);
  }
}
