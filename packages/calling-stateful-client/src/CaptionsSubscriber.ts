// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(close-captions) */
import {
  PropertyChangedEvent,
  TeamsCaptions,
  TeamsCaptionsHandler,
  TeamsCaptionsInfo
} from '@azure/communication-calling';
/* @conditional-compile-remove(close-captions) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(close-captions) */
import { CallIdRef } from './CallIdRef';

/* @conditional-compile-remove(close-captions) */
/**
 * @private
 */
export class CaptionsSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _captions: TeamsCaptions;

  constructor(callIdRef: CallIdRef, context: CallContext, captions: TeamsCaptions) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._captions = captions;
    if (this._captions.isCaptionsFeatureActive) {
      this._context.setIsCaptionActive(this._callIdRef.callId, this._captions.isCaptionsFeatureActive);
    }
    this._context.setAvailableSpokenLanguages(this._callIdRef.callId, this._captions.supportedSpokenLanguages);
    if ('supportedCaptionLanguages' in this._captions) {
      this._context.setAvailableCaptionLanguages(this._callIdRef.callId, this._captions.supportedCaptionLanguages);
    }
    this._context.setSelectedSpokenLanguage(this._callIdRef.callId, this._captions.activeSpokenLanguage);
    this._context.setSelectedCaptionLanguage(this._callIdRef.callId, this._captions.activeCaptionLanguage);
    this.subscribe();
  }

  private subscribe = (): void => {
    this._captions.on('CaptionsActiveChanged', this.isCaptionsActiveChanged);
    this._captions.on('CaptionsReceived', this.onCaptionsReceived);
    this._captions.on('CaptionLanguageChanged', this.isCaptionLanguageChanged);
    this._captions.on('SpokenLanguageChanged', this.isSpokenLanguageChanged);
  };

  public unsubscribe = (): void => {
    this._captions.off('CaptionsActiveChanged', this.isCaptionsActiveChanged);
    this._captions.off('CaptionsReceived', this.onCaptionsReceived);
    this._captions.off('CaptionLanguageChanged', this.isCaptionLanguageChanged);
    this._captions.off('SpokenLanguageChanged', this.isSpokenLanguageChanged);
  };

  private onCaptionsReceived: TeamsCaptionsHandler = (caption: TeamsCaptionsInfo): void => {
    this._context.addCaption(this._callIdRef.callId, caption);
  };

  private isCaptionsActiveChanged: PropertyChangedEvent = (): void => {
    this._context.setIsCaptionActive(this._callIdRef.callId, this._captions.isCaptionsFeatureActive);
  };
  private isCaptionLanguageChanged: PropertyChangedEvent = (): void => {
    this._context.setSelectedCaptionLanguage(this._callIdRef.callId, this._captions.activeCaptionLanguage);
  };
  private isSpokenLanguageChanged: PropertyChangedEvent = (): void => {
    this._context.setSelectedSpokenLanguage(this._callIdRef.callId, this._captions.activeSpokenLanguage);
  };
}

// This is a placeholder to bypass CC of "close-captions", remove when move the feature to stable
export {};
