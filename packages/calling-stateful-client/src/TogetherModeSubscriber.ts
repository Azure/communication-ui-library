// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import { TogetherModeCallFeature, TogetherModeVideoStream } from '@azure/communication-calling';
/* @conditional-compile-remove(together-mode) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(together-mode) */
import { CallIdRef } from './CallIdRef';
/**
 * @private
 */

/* @conditional-compile-remove(together-mode) */
/**
 * TogetherModeSubscriber is responsible for subscribing to together mode events and updating the call context accordingly.
 */
export class TogetherModeSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _togetherMode: TogetherModeCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, togetherMode: TogetherModeCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._togetherMode = togetherMode;

    this.subscribe();
  }

  private subscribe = (): void => {
    this._togetherMode.on('togetherModeStreamsUpdated', this.onTogetherModeStreamUpdated);
  };

  public unsubscribe = (): void => {
    this._togetherMode.off('togetherModeStreamsUpdated', this.onTogetherModeStreamUpdated);
  };

  private onTogetherModeStreamUpdated = (args: {
    added: TogetherModeVideoStream[];
    removed: TogetherModeVideoStream[];
  }): void => {
    if (args.added) {
      this._context.setTogetherModeVideoStream(this._callIdRef.callId, args.added);
    }
    if (args.removed) {
      this._context.removeTogetherModeVideoStream(this._callIdRef.callId, args.removed);
    }
  };
}
