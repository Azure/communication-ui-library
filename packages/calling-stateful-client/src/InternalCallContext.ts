// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LocalVideoStream, RemoteVideoStream, VideoStreamRenderer } from '@azure/communication-calling';
import { LocalVideoStreamState } from './CallClientState';
import type { CallContext } from './CallContext';
import { CallIdHistory } from './CallIdHistory';

/* @conditional-compile-remove(video-background-effects) */
import { LocalVideoStreamVideoEffectsSubscriber } from './LocalVideoStreamVideoEffectsSubscriber';
/* @conditional-compile-remove(video-background-effects) */
import { Features } from '@azure/communication-calling';

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
  private _callIdHistory = new CallIdHistory();

  // Used for keeping track of video effects subscribers that are not part of a Call.
  // The key is the stream ID. We assume each stream ID
  /* @conditional-compile-remove(video-background-effects) */
  private _unparentedViewVideoEffectsSubscriber = new Map<string, LocalVideoStreamVideoEffectsSubscriber | undefined>();

  public setCallId(newCallId: string, oldCallId: string): void {
    this._callIdHistory.updateCallIdHistory(newCallId, oldCallId);
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

  public getCallIds(): IterableIterator<string> {
    return this._remoteRenderInfos.keys();
  }

  public getRemoteRenderInfoForCall(callId: string): Map<string, Map<number, RemoteRenderInfo>> | undefined {
    return this._remoteRenderInfos.get(this._callIdHistory.latestCallId(callId));
  }

  public getRemoteRenderInfoForParticipant(
    callId: string,
    participantKey: string,
    streamId: number
  ): RemoteRenderInfo | undefined {
    const callRenderInfos = this._remoteRenderInfos.get(this._callIdHistory.latestCallId(callId));
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
    let callRenderInfos = this._remoteRenderInfos.get(this._callIdHistory.latestCallId(callId));
    if (!callRenderInfos) {
      callRenderInfos = new Map<string, Map<number, RemoteRenderInfo>>();
      this._remoteRenderInfos.set(this._callIdHistory.latestCallId(callId), callRenderInfos);
    }

    let participantRenderInfos = callRenderInfos.get(participantKey);
    if (!participantRenderInfos) {
      participantRenderInfos = new Map<number, RemoteRenderInfo>();
      callRenderInfos.set(participantKey, participantRenderInfos);
    }

    participantRenderInfos.set(streamId, { stream, status, renderer });
  }

  public deleteRemoteRenderInfo(callId: string, participantKey: string, streamId: number): void {
    const callRenderInfos = this._remoteRenderInfos.get(this._callIdHistory.latestCallId(callId));
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
    this._localRenderInfos.set(this._callIdHistory.latestCallId(callId), { stream, status, renderer });
  }

  public getLocalRenderInfo(callId: string): LocalRenderInfo | undefined {
    return this._localRenderInfos.get(this._callIdHistory.latestCallId(callId));
  }

  public deleteLocalRenderInfo(callId: string): void {
    this._localRenderInfos.delete(this._callIdHistory.latestCallId(callId));
  }

  public getUnparentedRenderInfo(localVideoStream: LocalVideoStreamState): LocalRenderInfo | undefined {
    return this._unparentedRenderInfos.get(localVideoStream.source.id);
  }

  public getUnparentedRenderInfos(): LocalVideoStream[] {
    return [...this._unparentedRenderInfos].map(([, renderInfo]) => renderInfo.stream);
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
    /* @conditional-compile-remove(video-background-effects) */
    this._unparentedViewVideoEffectsSubscriber.get(localVideoStream.source.id)?.unsubscribe();

    this._unparentedRenderInfos.delete(localVideoStream.source.id);
  }

  public subscribeToUnparentedViewVideoEffects(localVideoStream: LocalVideoStream, callContext: CallContext): void {
    /* @conditional-compile-remove(video-background-effects) */
    {
      // Ensure we aren't setting multiple subscriptions
      this._unparentedViewVideoEffectsSubscriber.get(localVideoStream.source.id)?.unsubscribe();
      this._unparentedViewVideoEffectsSubscriber.set(
        localVideoStream.source.id,
        new LocalVideoStreamVideoEffectsSubscriber({
          parent: 'unparented',
          context: callContext,
          localVideoStream: localVideoStream,
          localVideoStreamEffectsAPI: localVideoStream.feature(Features.VideoEffects)
        })
      );
    }
  }

  // UnparentedRenderInfos are not cleared as they are not part of the Call state.
  public clearCallRelatedState(): void {
    this._remoteRenderInfos.clear();
    this._localRenderInfos.clear();
  }
}
