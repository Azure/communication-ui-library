// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RemoteVideoStream } from '@azure/communication-calling';
import { RemoteVideoStreamState } from './CallClientState';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';

/**
 * @private
 */
export class RemoteVideoStreamSubscriber {
  private _callIdRef: CallIdRef;
  private _participantKey: string;
  private _remoteVideoStream: RemoteVideoStream;
  private _context: CallContext;

  constructor(
    callIdRef: CallIdRef,
    participantKey: string,
    remoteVideoStream: RemoteVideoStream,
    context: CallContext
  ) {
    this._callIdRef = callIdRef;
    this._participantKey = participantKey;
    this._remoteVideoStream = remoteVideoStream;
    this._context = context;
    this.subscribe();
  }

  private subscribe = (): void => {
    this._remoteVideoStream.on('isAvailableChanged', this.isAvailableChanged);
    this._remoteVideoStream.on('isReceivingChanged', this.isReceivingChanged);
    this._remoteVideoStream.on('sizeChanged', this.isSizeChanged);
    this.checkAndUpdateScreenShareState();
  };

  public unsubscribe = (): void => {
    this._remoteVideoStream.off('isAvailableChanged', this.isAvailableChanged);
    this._remoteVideoStream.off('isReceivingChanged', this.isReceivingChanged);
    this._remoteVideoStream.off('sizeChanged', this.isSizeChanged);
  };

  private includesActiveScreenShareStream = (streams: { [key: number]: RemoteVideoStreamState }): boolean => {
    for (const stream of Object.values(streams)) {
      if (stream.mediaStreamType === 'ScreenSharing' && stream.isAvailable) {
        return true;
      }
    }
    return false;
  };

  /**
   * Update the state with the active screen share stream. If there is an existing stream will overwrite it if this one
   * is active (newer stream takes priority). If there is an existing stream and this one is set to unavailable, and the
   * existing stream is different participant, then don't set the active screen share stream to undefined, else set it
   * to undefined.
   */
  private checkAndUpdateScreenShareState = (): void => {
    if (this._remoteVideoStream.mediaStreamType !== 'ScreenSharing') {
      return;
    }

    if (this._remoteVideoStream.isAvailable) {
      this._context.setCallScreenShareParticipant(this._callIdRef.callId, this._participantKey);
      return;
    }

    const existingScreenShare = this._context.getState().calls[this._callIdRef.callId]?.screenShareRemoteParticipant;

    // If somehow we end up with an event where a RemoteParticipant's ScreenShare stream is set to
    // unavailable but there exists already another different participant actively sharing, and they are still
    // sharing then this event shouldn't set the screenShareRemoteParticipant to undefined.
    if (!existingScreenShare || existingScreenShare === this._participantKey) {
      this._context.setCallScreenShareParticipant(this._callIdRef.callId, undefined);
      return;
    }

    const streams =
      this._context.getState().calls[this._callIdRef.callId]?.remoteParticipants[existingScreenShare]?.videoStreams;

    if (!streams) {
      this._context.setCallScreenShareParticipant(this._callIdRef.callId, undefined);
      return;
    }

    // If the existing ScreenShare that is not owned by the current RemoteParticipant is still active, don't
    // overwrite it with undefined. So only overwrite if it is not active.
    if (!this.includesActiveScreenShareStream(streams)) {
      this._context.setCallScreenShareParticipant(this._callIdRef.callId, undefined);
      return;
    }
  };

  private isAvailableChanged = (): void => {
    this._context.setRemoteVideoStreamIsAvailable(
      this._callIdRef.callId,
      this._participantKey,
      this._remoteVideoStream.id,
      this._remoteVideoStream.isAvailable
    );

    this.checkAndUpdateScreenShareState();
  };

  private isReceivingChanged = (): void => {
    this._context.setRemoteVideoStreamIsReceiving(
      this._callIdRef.callId,
      this._participantKey,
      this._remoteVideoStream.id,
      this._remoteVideoStream.isReceiving
    );
  };

  private isSizeChanged = (): void => {
    if (this._remoteVideoStream?.size.width === 0 && this._remoteVideoStream?.size.height === 0) {
      return;
    }
    const streamSize =
      this._context.getState().calls[this._callIdRef.callId]?.remoteParticipants[this._participantKey]?.videoStreams[
        this._remoteVideoStream.id
      ]?.streamSize;

    const existingAspectRatio = streamSize ? streamSize.width / streamSize.height : undefined;
    const newAspectRatio = this._remoteVideoStream?.size.width / this._remoteVideoStream?.size.height;

    if (!streamSize || existingAspectRatio !== newAspectRatio) {
      this._context.setRemoteVideoStreamSize(
        this._callIdRef.callId,
        this._participantKey,
        this._remoteVideoStream.id,
        this._remoteVideoStream.size
      );
    }
  };
}
