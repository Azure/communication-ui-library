// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LocalVideoStream, RemoteVideoStream, VideoStreamRenderer } from '@azure/communication-calling';
import { LocalVideoStream as StatefulLocalVideoStream } from './CallClientState';

/**
 * Used internally in InternalCallContext to be able to hold both the stream and the renderer in the same array.
 */
export interface LocalStreamAndRenderer {
  stream: LocalVideoStream;
  renderer: VideoStreamRenderer | undefined;
}

/**
 * Used internally in InternalCallContext to be able to hold both the stream and the renderer in the same array.
 */
export interface RemoteStreamAndRenderer {
  stream: RemoteVideoStream;
  renderer: VideoStreamRenderer | undefined;
}

/**
 * Contains internal data used between different Declarative components to share data.
 */
export class InternalCallContext {
  // <CallId, <ParticipantKey, <StreamId, RemoteStreamAndRenderer>>
  private _remoteStreamAndRenderers: Map<string, Map<string, Map<number, RemoteStreamAndRenderer>>>;

  // <CallId, LocalStreamAndRenderer>.
  private _localStreamAndRenderers: Map<string, LocalStreamAndRenderer>;

  // Used for keeping track of rendered LocalVideoStreams that are not part of a Call.
  private _unparentedStreamAndRenderers: Map<StatefulLocalVideoStream, VideoStreamRenderer>;

  constructor() {
    this._remoteStreamAndRenderers = new Map<string, Map<string, Map<number, RemoteStreamAndRenderer>>>();
    this._localStreamAndRenderers = new Map<string, LocalStreamAndRenderer>();
    this._unparentedStreamAndRenderers = new Map<StatefulLocalVideoStream, VideoStreamRenderer>();
  }

  public setCallId(newCallId: string, oldCallId: string): void {
    const remoteStreamAndRenderers = this._remoteStreamAndRenderers.get(oldCallId);
    if (remoteStreamAndRenderers) {
      this._remoteStreamAndRenderers.delete(oldCallId);
      this._remoteStreamAndRenderers.set(newCallId, remoteStreamAndRenderers);
    }

    const localStreamAndRenderers = this._localStreamAndRenderers.get(oldCallId);
    if (localStreamAndRenderers) {
      this._localStreamAndRenderers.delete(oldCallId);
      this._localStreamAndRenderers.set(newCallId, localStreamAndRenderers);
    }
  }

  public getRemoteStreamAndRenderersAll(): Map<string, Map<string, Map<number, RemoteStreamAndRenderer>>> {
    return this._remoteStreamAndRenderers;
  }

  public getRemoteStreamAndRenderersForCall(
    callId: string
  ): Map<string, Map<number, RemoteStreamAndRenderer>> | undefined {
    return this._remoteStreamAndRenderers.get(callId);
  }

  public getRemoteStreamAndRendererForParticipant(
    callId: string,
    participantKey: string,
    streamId: number
  ): RemoteStreamAndRenderer | undefined {
    const callStreams = this._remoteStreamAndRenderers.get(callId);
    if (!callStreams) {
      return undefined;
    }
    const participantStreams = callStreams.get(participantKey);
    if (!participantStreams) {
      return undefined;
    }
    return participantStreams.get(streamId);
  }

  public setRemoteStreamAndRenderer(
    callId: string,
    participantKey: string,
    streamId: number,
    stream: RemoteVideoStream,
    renderer: VideoStreamRenderer | undefined
  ): void {
    let callStreams = this._remoteStreamAndRenderers.get(callId);
    if (!callStreams) {
      callStreams = new Map<string, Map<number, RemoteStreamAndRenderer>>();
      this._remoteStreamAndRenderers.set(callId, callStreams);
    }

    let participantStreams = callStreams.get(participantKey);
    if (!participantStreams) {
      participantStreams = new Map<number, RemoteStreamAndRenderer>();
      callStreams.set(participantKey, participantStreams);
    }

    participantStreams.set(streamId, { stream, renderer });
  }

  public removeRemoteStreamAndRenderer(callId: string, participantKey: string, streamId: number): void {
    const callStreams = this._remoteStreamAndRenderers.get(callId);
    if (!callStreams) {
      return;
    }

    const participantStreams = callStreams.get(participantKey);
    if (!participantStreams) {
      return;
    }

    participantStreams.delete(streamId);
  }

  public setLocalStreamAndRenderer(
    callId: string,
    stream: LocalVideoStream,
    renderer: VideoStreamRenderer | undefined
  ): void {
    this._localStreamAndRenderers.set(callId, { stream: stream, renderer: renderer });
  }

  public getLocalStreamAndRenderer(callId: string): LocalStreamAndRenderer | undefined {
    return this._localStreamAndRenderers.get(callId);
  }

  public removeLocalStreamAndRenderer(callId: string): void {
    this._localStreamAndRenderers.delete(callId);
  }

  public getUnparentedStreamAndRenderer(localVideoStream: StatefulLocalVideoStream): VideoStreamRenderer | undefined {
    return this._unparentedStreamAndRenderers.get(localVideoStream);
  }

  public setUnparentedStreamAndRenderer(
    localVideoStream: StatefulLocalVideoStream,
    videoStreamRenderer: VideoStreamRenderer
  ): void {
    this._unparentedStreamAndRenderers.set(localVideoStream, videoStreamRenderer);
  }

  public removeUnparentedStreamAndRenderer(localVideoStream: StatefulLocalVideoStream): void {
    this._unparentedStreamAndRenderers.delete(localVideoStream);
  }

  // UnparentedStreamAndRenderers are not cleared as they are not part of the Call state.
  public clearCallRelatedState(): void {
    this._remoteStreamAndRenderers.clear();
    this._localStreamAndRenderers.clear();
  }
}
