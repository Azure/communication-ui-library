// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TogetherModeCallFeature, TogetherModeVideoStream } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';
/**
 * @private
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
    for (const addedTogetherModeStream of args.added) {
      this._context.setTogetherModeVideoStream(this._callIdRef.callId, addedTogetherModeStream);
    }
    for (const removedTogetherModeStream of args.removed) {
      this._context.removeTogetherModeVideoStream(this._callIdRef.callId, removedTogetherModeStream);
    }
  };
}
