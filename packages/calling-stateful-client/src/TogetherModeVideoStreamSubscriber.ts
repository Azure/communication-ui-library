// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import { TogetherModeVideoStream } from '@azure/communication-calling';
/* @conditional-compile-remove(together-mode) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(together-mode) */
import { CallIdRef } from './CallIdRef';

/* @conditional-compile-remove(together-mode) */
/**
 * @private
 */
export class TogetherModeVideoStreamSubscriber {
  private _callIdRef: CallIdRef;
  private _togetherModeStream: TogetherModeVideoStream;
  private _context: CallContext;

  constructor(callIdRef: CallIdRef, stream: TogetherModeVideoStream, context: CallContext) {
    this._callIdRef = callIdRef;
    this._togetherModeStream = stream;
    this._context = context;
    this.subscribe();
  }

  private subscribe = (): void => {
    this._togetherModeStream.on('isAvailableChanged', this.isAvailableChanged);
    this._togetherModeStream.on('isReceivingChanged', this.isReceivingChanged);
    this._togetherModeStream.on('sizeChanged', this.isSizeChanged);
  };

  public unsubscribe = (): void => {
    this._togetherModeStream.off('isAvailableChanged', this.isAvailableChanged);
    this._togetherModeStream.off('isReceivingChanged', this.isReceivingChanged);
    this._togetherModeStream.off('sizeChanged', this.isSizeChanged);
  };

  private isAvailableChanged = (): void => {
    this._context.setTogetherModeVideoStreamIsAvailable(
      this._callIdRef.callId,
      this._togetherModeStream.id,
      this._togetherModeStream.isAvailable
    );
  };

  private isReceivingChanged = (): void => {
    this._context.setTogetherModeVideoStreamIsReceiving(
      this._callIdRef.callId,
      this._togetherModeStream.id,
      this._togetherModeStream.isReceiving
    );
  };

  private isSizeChanged = (): void => {
    this._context.setTogetherModeVideoStreamSize(
      this._callIdRef.callId,
      this._togetherModeStream.id,
      this._togetherModeStream.size
    );
  };
}
