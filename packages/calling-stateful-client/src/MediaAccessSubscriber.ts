// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(media-access) */
import { MediaAccessCallFeature, MediaAccessChangedEvent } from '@azure/communication-calling';
/* @conditional-compile-remove(media-access) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(media-access) */
import { CallIdRef } from './CallIdRef';

/* @conditional-compile-remove(media-access) */
/**
 * @private
 */
export class MediaAccessSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _mediaAccessCallFeature: MediaAccessCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, mediaAccessCallFeature: MediaAccessCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._mediaAccessCallFeature = mediaAccessCallFeature;

    const mediaAccesses = this._mediaAccessCallFeature.getAllOthersMediaAccess();
    this._context.setMediaAccesses(this._callIdRef.callId, mediaAccesses);
    this.subscribe();
  }

  private subscribe = (): void => {
    this._mediaAccessCallFeature.on('mediaAccessChanged', this.mediaAccessChanged);
  };

  public unsubscribe = (): void => {
    this._mediaAccessCallFeature.off('mediaAccessChanged', this.mediaAccessChanged);
  };

  private mediaAccessChanged = (data: MediaAccessChangedEvent): void => {
    this._context.setMediaAccesses(this._callIdRef.callId, data.mediaAccesses);
  };
}
