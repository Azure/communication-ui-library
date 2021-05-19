// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LocalVideoStream, RemoteVideoStream, VideoStreamRenderer } from '@azure/communication-calling';
import { LocalVideoStream as StatefulLocalVideoStream } from './CallClientState';

/**
 * Used internally in InternalCallContext to be able to hold both the stream and the renderer in the same array.
 */
export interface StreamAndRenderer {
  stream: StatefulLocalVideoStream;
  renderer: VideoStreamRenderer;
}

/**
 * Contains internal data used between different Declarative components to share data.
 */
export class InternalCallContext {
  // CallId -> <StreamId, RemoteVideoStream>
  private _remoteVideoStreams: Map<string, Map<number, RemoteVideoStream>>;
  // CallId -> <StreamId, string>
  private _remoteParticipantKeys: Map<string, Map<number, string>>;
  // CallId -> <StreamId, VideoStreamRenderer>
  private _remoteVideoStreamRenderers: Map<string, Map<number, VideoStreamRenderer>>;

  // At the time of writing only one LocalVideoStream is supported by SDK.
  // CallId -> LocalVideoStream
  private _localVideoStreams: Map<string, LocalVideoStream>;
  // CallId -> VideoStreamRenderer
  private _localVideoStreamRenders: Map<string, VideoStreamRenderer>;

  // Stores the original LocalVideoStream used when creating the {@Link VideoStreamRendererView} along with the renderer
  // {@Link @azure/communication-calling#VideoStreamRenderer} used to create the {@Link VideoStreamRendererView}.
  private _unparentedStreamAndRenderers: StreamAndRenderer[];

  constructor() {
    this._remoteVideoStreams = new Map<string, Map<number, RemoteVideoStream>>();
    this._remoteParticipantKeys = new Map<string, Map<number, string>>();
    this._remoteVideoStreamRenderers = new Map<string, Map<number, VideoStreamRenderer>>();
    this._localVideoStreams = new Map<string, LocalVideoStream>();
    this._localVideoStreamRenders = new Map<string, VideoStreamRenderer>();
    this._unparentedStreamAndRenderers = [];
  }

  public setCallId(newCallId: string, oldCallId: string): void {
    const remoteVideoStreams = this._remoteVideoStreams.get(oldCallId);
    if (remoteVideoStreams) {
      this._remoteVideoStreams.delete(oldCallId);
      this._remoteVideoStreams.set(newCallId, remoteVideoStreams);
    }

    const remoteParticipants = this._remoteParticipantKeys.get(oldCallId);
    if (remoteParticipants) {
      this._remoteParticipantKeys.delete(oldCallId);
      this._remoteParticipantKeys.set(newCallId, remoteParticipants);
    }

    const localVideoStream = this._localVideoStreams.get(oldCallId);
    if (localVideoStream) {
      this._localVideoStreams.delete(oldCallId);
      this._localVideoStreams.set(newCallId, localVideoStream);
    }

    const localVideoStreamRenderer = this._localVideoStreamRenders.get(oldCallId);
    if (localVideoStreamRenderer) {
      this._localVideoStreamRenders.delete(oldCallId);
      this._localVideoStreamRenders.set(newCallId, localVideoStreamRenderer);
    }
  }

  public getRemoteVideoStreamsAll(): Map<string, Map<number, RemoteVideoStream>> {
    return this._remoteVideoStreams;
  }

  public getRemoteVideoStreams(callId: string): Map<number, RemoteVideoStream> | undefined {
    return this._remoteVideoStreams.get(callId);
  }

  public getRemoteVideoStream(callId: string, streamId: number): RemoteVideoStream | undefined {
    const remoteVideoStreams = this._remoteVideoStreams.get(callId);
    if (remoteVideoStreams) {
      return remoteVideoStreams.get(streamId);
    }
    return undefined;
  }

  public getRemoteParticipantKey(callId: string, streamId: number): string | undefined {
    const remoteParticipants = this._remoteParticipantKeys.get(callId);
    if (remoteParticipants) {
      return remoteParticipants.get(streamId);
    }
    return undefined;
  }

  public setRemoteVideoStream(callId: string, participantKey: string, remoteVideoStream: RemoteVideoStream): void {
    let remoteVideoStreams = this._remoteVideoStreams.get(callId);
    if (!remoteVideoStreams) {
      remoteVideoStreams = new Map<number, RemoteVideoStream>();
      this._remoteVideoStreams.set(callId, remoteVideoStreams);
    }
    remoteVideoStreams.set(remoteVideoStream.id, remoteVideoStream);

    let remoteParticipants = this._remoteParticipantKeys.get(callId);
    if (!remoteParticipants) {
      remoteParticipants = new Map<number, string>();
      this._remoteParticipantKeys.set(callId, remoteParticipants);
    }
    remoteParticipants.set(remoteVideoStream.id, participantKey);
  }

  public removeRemoteVideoStream(callId: string, streamId: number): void {
    const remoteVideoStreams = this._remoteVideoStreams.get(callId);
    if (remoteVideoStreams) {
      remoteVideoStreams.delete(streamId);
    }

    const remoteParticipants = this._remoteParticipantKeys.get(callId);
    if (remoteParticipants) {
      remoteParticipants.delete(streamId);
    }

    const videoStreamRenderers = this._remoteVideoStreamRenderers.get(callId);
    if (videoStreamRenderers) {
      const videoStreamRenderer = videoStreamRenderers.get(streamId);
      if (videoStreamRenderer) {
        videoStreamRenderer.dispose();
        videoStreamRenderers.delete(streamId);
      }
    }
  }

  public getRemoteVideoStreamRenderer(callId: string, streamId: number): VideoStreamRenderer | undefined {
    const videoStreamRenderers = this._remoteVideoStreamRenderers.get(callId);
    if (videoStreamRenderers) {
      return videoStreamRenderers.get(streamId);
    }
    return undefined;
  }

  public setRemoteVideoStreamRenderer(
    callId: string,
    streamId: number,
    videoStreamRenderer: VideoStreamRenderer
  ): void {
    let videoStreamRenderers = this._remoteVideoStreamRenderers.get(callId);
    if (!videoStreamRenderers) {
      videoStreamRenderers = new Map<number, VideoStreamRenderer>();
      this._remoteVideoStreamRenderers.set(callId, videoStreamRenderers);
    }
    videoStreamRenderers.set(streamId, videoStreamRenderer);
  }

  public removeRemoteVideoStreamRenderer(callId: string, streamId: number): void {
    const videoStreamRenderers = this._remoteVideoStreamRenderers.get(callId);
    if (videoStreamRenderers) {
      videoStreamRenderers.delete(streamId);
    }
  }

  public setLocalVideoStream(callId: string, localVideoStream: LocalVideoStream): void {
    this._localVideoStreams.set(callId, localVideoStream);
  }

  public removeLocalVideoStream(callId: string): void {
    this._localVideoStreams.delete(callId);
  }

  public getLocalVideoStream(callId: string): LocalVideoStream | undefined {
    return this._localVideoStreams.get(callId);
  }

  public getLocalVideoStreamRenderer(callId: string): VideoStreamRenderer | undefined {
    return this._localVideoStreamRenders.get(callId);
  }

  public setLocalVideoStreamRenderer(callId: string, renderer: VideoStreamRenderer): void {
    this._localVideoStreamRenders.set(callId, renderer);
  }

  public removeLocalVideoStreamRenderer(callId: string): void {
    this._localVideoStreamRenders.delete(callId);
  }

  // Returns the index in unparentedStreamAndRenderers or -1 if not found.
  public findInUnparentedStreamAndRenderers(localVideoStream: StatefulLocalVideoStream): number {
    // First try to find by referential equality.
    for (let i = 0; i < this._unparentedStreamAndRenderers.length; i++) {
      if (this._unparentedStreamAndRenderers[i].stream === localVideoStream) {
        return i;
      }
    }
    // If not yet found, try find by comparing properties.
    for (let i = 0; i < this._unparentedStreamAndRenderers.length; i++) {
      const candidate = this._unparentedStreamAndRenderers[i].stream;
      if (
        candidate.source.deviceType === localVideoStream.source.deviceType &&
        candidate.source.id === localVideoStream.source.id &&
        candidate.source.name === localVideoStream.source.name &&
        candidate.mediaStreamType === localVideoStream.mediaStreamType
      ) {
        return i;
      }
    }
    return -1;
  }

  public getUnparentedStreamAndRenderer(index: number): StreamAndRenderer {
    return this._unparentedStreamAndRenderers[index];
  }

  public setUnparentedStreamAndRenderer(
    localVideoStream: StatefulLocalVideoStream,
    videoStreamRenderer: VideoStreamRenderer
  ): void {
    this._unparentedStreamAndRenderers.push({ stream: localVideoStream, renderer: videoStreamRenderer });
  }

  public removeUnparentedStreamAndRenderer(index: number): void {
    this._unparentedStreamAndRenderers.splice(index, 1);
  }

  // UnparentedStreamAndRenderers are not cleared as they are not part of the Call state.
  public clearCallRelatedState(): void {
    this._remoteVideoStreams.clear();
    this._remoteParticipantKeys.clear();
    this._remoteVideoStreamRenderers.clear();
    this._localVideoStreams.clear();
    this._localVideoStreamRenders.clear();
  }
}
