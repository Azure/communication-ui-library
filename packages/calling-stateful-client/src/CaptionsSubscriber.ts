// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(close-captions) */
import { PropertyChangedEvent } from '@azure/communication-calling';
/* @conditional-compile-remove(close-captions) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(close-captions) */
import { CallIdRef } from './CallIdRef';
/* @conditional-compile-remove(close-captions) */
import { TeamsCaptionsHandler, TeamsCaptionsInfo, TeamsCaptionsCallFeature } from '@azure/communication-calling';

/* @conditional-compile-remove(close-captions) */
/**
 * @private
 */
export class CaptionsSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _captions: TeamsCaptionsCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, captions: TeamsCaptionsCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._captions = captions;
    if (this._captions.isCaptionsFeatureActive) {
      this._context.setIsCaptionActive(this._callIdRef.callId, this._captions.isCaptionsFeatureActive);
    }
    this._context.setAvailableSpokenLanguages(this._callIdRef.callId, this._captions.supportedSpokenLanguages);
    if ('availableSubtitleLanguages' in this._captions) {
      this._context.setAvailableCaptionLanguages(this._callIdRef.callId, this._captions.supportedCaptionLanguages);
    }

    this.subscribe();
  }

  private subscribe = (): void => {
    this._captions.on('isCaptionsActiveChanged', this.isCaptionsActiveChanged);
    this._captions.on('captionsReceived', this.onCaptionsReceived);
  };

  public unsubscribe = (): void => {
    this._captions.off('isCaptionsActiveChanged', this.isCaptionsActiveChanged);
    this._captions.off('captionsReceived', this.onCaptionsReceived);
  };

  private onCaptionsReceived: TeamsCaptionsHandler = (caption: TeamsCaptionsInfo): void => {
    this._context.addCaption(this._callIdRef.callId, caption);
  };

  private isCaptionsActiveChanged: PropertyChangedEvent = (): void => {
    this._context.setIsCaptionActive(this._callIdRef.callId, this._captions.isCaptionsFeatureActive);
  };
}

// This is a placeholder to bypass CC of "close-captions", remove when move the feature to stable
export {};
