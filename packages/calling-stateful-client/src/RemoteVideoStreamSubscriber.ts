// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RemoteVideoStream } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';

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
  };

  public unsubscribe = (): void => {
    this._remoteVideoStream.off('isAvailableChanged', this.isAvailableChanged);
  };

  private isAvailableChanged = (): void => {
    this._context.setRemoteVideoStreamIsAvailable(
      this._callIdRef.callId,
      this._participantKey,
      this._remoteVideoStream.id,
      this._remoteVideoStream.isAvailable
    );

    if (this._remoteVideoStream.mediaStreamType === 'ScreenSharing') {
      if (this._remoteVideoStream.isAvailable) {
        this._context.setCallScreenShareParticipant(this._callIdRef.callId, this._participantKey);
      } else {
        // Safety check if somehow we end up with an event where a RemoteParticipant's ScreenShare stream is set to
        // unavailable but there exists already another different particpant actively sharing, and they are still
        // sharing then this event shouldn't set the screenShareRemoteParticipant to undefined.
        const existingScreenShare = this._context.getState().calls.get(this._callIdRef.callId)
          ?.screenShareRemoteParticipant;

        // If there is an existing ScreenShare and it is not the current RemoteParticipant
        if (existingScreenShare && existingScreenShare !== this._participantKey) {
          const streams = this._context
            .getState()
            .calls.get(this._callIdRef.callId)
            ?.remoteParticipants.get(existingScreenShare)?.videoStreams;
          if (streams) {
            let existingScreenShareActive = false;
            for (const [_, stream] of streams.entries()) {
              if (stream.mediaStreamType === 'ScreenSharing' && stream.isAvailable) {
                existingScreenShareActive = true;
                break;
              }
            }

            // If the existing ScreenShare that is not owned by the current RemoteParticipant is still active, don't
            // overwrite it with undefined.
            if (!existingScreenShareActive) {
              this._context.setCallScreenShareParticipant(this._callIdRef.callId, undefined);
            }
          } else {
            this._context.setCallScreenShareParticipant(this._callIdRef.callId, undefined);
          }
        } else {
          this._context.setCallScreenShareParticipant(this._callIdRef.callId, undefined);
        }
      }
    }
  };
}
