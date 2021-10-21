// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LocalVideoStream, RemoteVideoStream, VideoStreamRenderer } from '@azure/communication-calling';
import { LocalVideoStreamState } from './CallClientState';

/**
 * Internally tracked render status. Stores the status of a video render of a stream as rendering could take a long
 * time.
 *
 * 'NotRendered' - the stream has not yet been rendered
 * 'Rendering' - the stream is currently rendering
 * 'Rendered' - the stream has been rendered
 * 'Stopping' - the stream is currently rendering but has been signaled to stop
 */
export type RenderStatus = 'NotRendered' | 'Rendering' | 'Rendered' | 'Stopping';

/**
 * Internal container to hold common state needed to keep track of renders.
 */
export interface RenderInfo {
  status: RenderStatus;
  renderer: VideoStreamRenderer | undefined;
}

/**
 * Internally used to keep track of the status, renderer, and awaiting promise, associated with a LocalVideoStream.
 */
export interface LocalRenderInfo extends RenderInfo {
  stream: LocalVideoStream;
}

/**
 * Internally used to keep track of the status, renderer, and awaiting promise, associated with a RemoteVideoStream.
 */
export interface RemoteRenderInfo extends RenderInfo {
  stream: RemoteVideoStream;
}

/**
 * Contains internal data used between different Declarative components to share data.
 */
export class InternalCallContext {
  // <CallId, <ParticipantKey, <StreamId, RemoteRenderInfo>>
  private _remoteRenderInfos = new Map<string, Map<string, Map<number, RemoteRenderInfo>>>();

  // <CallId, LocalRenderInfo>.
  private _localRenderInfos = new Map<string, LocalRenderInfo>();

  // Used for keeping track of rendered LocalVideoStreams that are not part of a Call.
  // The key is the stream ID. We assume each stream ID to only have one owning render info
  private _unparentedRenderInfos = new Map<string, LocalRenderInfo>();

  public setCallId(newCallId: string, oldCallId: string): void {
    const remoteRenderInfos = this._remoteRenderInfos.get(oldCallId);
    if (remoteRenderInfos) {
      this._remoteRenderInfos.delete(oldCallId);
      this._remoteRenderInfos.set(newCallId, remoteRenderInfos);
    }

    const localRenderInfos = this._localRenderInfos.get(oldCallId);
    if (localRenderInfos) {
      this._localRenderInfos.delete(oldCallId);
      this._localRenderInfos.set(newCallId, localRenderInfos);
    }
  }

  public getRemoteRenderInfos(): Map<string, Map<string, Map<number, RemoteRenderInfo>>> {
    return this._remoteRenderInfos;
  }

  public getRemoteRenderInfoForCall(callId: string): Map<string, Map<number, RemoteRenderInfo>> | undefined {
    return this._remoteRenderInfos.get(callId);
  }

  public getRemoteRenderInfoForParticipant(
    callId: string,
    participantKey: string,
    streamId: number
  ): RemoteRenderInfo | undefined {
    const callRenderInfos = this._remoteRenderInfos.get(callId);
    if (!callRenderInfos) {
      return undefined;
    }
    const participantRenderInfos = callRenderInfos.get(participantKey);
    if (!participantRenderInfos) {
      return undefined;
    }
    return participantRenderInfos.get(streamId);
  }

  public setRemoteRenderInfo(
    callId: string,
    participantKey: string,
    streamId: number,
    stream: RemoteVideoStream,
    status: RenderStatus,
    renderer: VideoStreamRenderer | undefined
  ): void {
    let callRenderInfos = this._remoteRenderInfos.get(callId);
    if (!callRenderInfos) {
      callRenderInfos = new Map<string, Map<number, RemoteRenderInfo>>();
      this._remoteRenderInfos.set(callId, callRenderInfos);
    }

    let participantRenderInfos = callRenderInfos.get(participantKey);
    if (!participantRenderInfos) {
      participantRenderInfos = new Map<number, RemoteRenderInfo>();
      callRenderInfos.set(participantKey, participantRenderInfos);
    }

    participantRenderInfos.set(streamId, { stream, status, renderer });
  }

  public deleteRemoteRenderInfo(callId: string, participantKey: string, streamId: number): void {
    const callRenderInfos = this._remoteRenderInfos.get(callId);
    if (!callRenderInfos) {
      return;
    }

    const participantRenderInfos = callRenderInfos.get(participantKey);
    if (!participantRenderInfos) {
      return;
    }

    participantRenderInfos.delete(streamId);
  }

  public setLocalRenderInfo(
    callId: string,
    stream: LocalVideoStream,
    status: RenderStatus,
    renderer: VideoStreamRenderer | undefined
  ): void {
    this._localRenderInfos.set(callId, { stream, status, renderer });
  }

  public getLocalRenderInfo(callId: string): LocalRenderInfo | undefined {
    return this._localRenderInfos.get(callId);
  }

  public deleteLocalRenderInfo(callId: string): void {
    this._localRenderInfos.delete(callId);
  }

  public getUnparentedRenderInfo(localVideoStream: LocalVideoStreamState): LocalRenderInfo | undefined {
    return this._unparentedRenderInfos.get(localVideoStream.source.id);
  }

  public setUnparentedRenderInfo(
    statefulStream: LocalVideoStreamState,
    stream: LocalVideoStream,
    status: RenderStatus,
    renderer: VideoStreamRenderer | undefined
  ): void {
    this._unparentedRenderInfos.set(statefulStream.source.id, { stream, status, renderer });
  }

  public deleteUnparentedRenderInfo(localVideoStream: LocalVideoStreamState): void {
    this._unparentedRenderInfos.delete(localVideoStream.source.id);
  }

  // UnparentedRenderInfos are not cleared as they are not part of the Call state.
  public clearCallRelatedState(): void {
    this._remoteRenderInfos.clear();
    this._localRenderInfos.clear();
  }
}
