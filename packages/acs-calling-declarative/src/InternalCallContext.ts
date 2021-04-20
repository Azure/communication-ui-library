// © Microsoft Corporation. All rights reserved.
import { RemoteVideoStream, VideoStreamRenderer } from '@azure/communication-calling';

/**
 * Contains internal data used between different Declarative components to share data.
 */
export class InternalCallContext {
  // CallId -> <StreamId, RemoteVideoStream>
  private _remoteVideoStreams: Map<string, Map<number, RemoteVideoStream>>;
  // CallId -> <StreamId, ParticipantKey>
  private _remoteParticipantKeys: Map<string, Map<number, string>>;
  // CallId -> <StreamId, VideoStreamRenderer>
  private _videoStreamRenderers: Map<string, Map<number, VideoStreamRenderer>>;

  constructor() {
    this._remoteVideoStreams = new Map<string, Map<number, RemoteVideoStream>>();
    this._remoteParticipantKeys = new Map<string, Map<number, string>>();
    this._videoStreamRenderers = new Map<string, Map<number, VideoStreamRenderer>>();
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

  public getVideoStreamRenderer(callId: string, streamId: number): VideoStreamRenderer | undefined {
    const videoStreamRenderers = this._videoStreamRenderers.get(callId);
    if (videoStreamRenderers) {
      return videoStreamRenderers.get(streamId);
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

    const videoStreamRenderers = this._videoStreamRenderers.get(callId);
    if (videoStreamRenderers) {
      const videoStreamRenderer = videoStreamRenderers.get(streamId);
      if (videoStreamRenderer) {
        videoStreamRenderer.dispose();
        videoStreamRenderers.delete(streamId);
      }
    }
  }

  public setVideoStreamRenderer(callId: string, streamId: number, videoStreamRenderer: VideoStreamRenderer): void {
    let videoStreamRenderers = this._videoStreamRenderers.get(callId);
    if (!videoStreamRenderers) {
      videoStreamRenderers = new Map<number, VideoStreamRenderer>();
      this._videoStreamRenderers.set(callId, videoStreamRenderers);
    }
    videoStreamRenderers.set(streamId, videoStreamRenderer);
  }

  public removeVideoStreamRenderer(callId: string, streamId: number): void {
    const videoStreamRenderers = this._videoStreamRenderers.get(callId);
    if (videoStreamRenderers) {
      videoStreamRenderers.delete(streamId);
    }
  }

  public clearCallRelatedState(): void {
    this._remoteVideoStreams.clear();
    this._remoteParticipantKeys.clear();
    this._videoStreamRenderers.clear();
  }
}
