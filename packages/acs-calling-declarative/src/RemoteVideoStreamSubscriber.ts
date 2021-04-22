// © Microsoft Corporation. All rights reserved.

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
  };
}
