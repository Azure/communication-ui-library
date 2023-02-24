// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AcsCaptionsCallFeature,
  CaptionsHandler,
  CaptionsInfo,
  TeamsCaptionsCallFeature
} from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';

/**
 * @private
 */
export class CaptionsSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _captions: AcsCaptionsCallFeature | TeamsCaptionsCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, captions: AcsCaptionsCallFeature | TeamsCaptionsCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._captions = captions;

    if (this._captions.isCaptionsActive) {
      this._context.setIsCaptionActive(this._callIdRef.callId, this._captions.isCaptionsActive);
    }

    this._context.setAvailableSpokenLanguages(this._callIdRef.callId, this._captions.availableSpokenLanguages);
    if ('availableSubtitleLanguages' in this._captions) {
      this._context.setAvailableSubtitleLanguages(this._callIdRef.callId, this._captions.availableSubtitleLanguages);
    }

    this.subscribe();
  }

  private subscribe = (): void => {
    this._captions.on('captionsReceived', this.onCaptionReceived);
  };

  public unsubscribe = (): void => {
    this._captions.off('captionsReceived', this.onCaptionReceived);
  };

  private onCaptionReceived: CaptionsHandler = (caption: CaptionsInfo): void => {
    this._context.addCaption(this._callIdRef.callId, caption);
  };
}
