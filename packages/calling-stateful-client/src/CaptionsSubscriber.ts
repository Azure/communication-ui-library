// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CaptionsCallFeature,
  PropertyChangedEvent,
  TeamsCaptions,
  TeamsCaptionsHandler,
  TeamsCaptionsInfo
} from '@azure/communication-calling';

import { Captions, CaptionsHandler, CaptionsInfo } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';

/**
 * @private
 */
export class TeamsCaptionsSubscriber {
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
    this._context.addTeamsCaption(this._callIdRef.callId, caption);
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

/**
 * @private
 */
export class CaptionsSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _captions: Captions;

  constructor(callIdRef: CallIdRef, context: CallContext, captions: Captions) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._captions = captions;
    if (this._captions.isCaptionsFeatureActive) {
      this._context.setIsCaptionActive(this._callIdRef.callId, this._captions.isCaptionsFeatureActive);
    }
    this._context.setAvailableSpokenLanguages(this._callIdRef.callId, this._captions.supportedSpokenLanguages);
    this._context.setSelectedSpokenLanguage(this._callIdRef.callId, this._captions.activeSpokenLanguage);
    this.subscribe();
  }

  private subscribe = (): void => {
    this._captions.on('CaptionsActiveChanged', this.isCaptionsActiveChanged);
    this._captions.on('SpokenLanguageChanged', this.isSpokenLanguageChanged);
    this._captions.on('CaptionsReceived', this.onCaptionsReceived);
  };

  public unsubscribe = (): void => {
    this._captions.off('CaptionsActiveChanged', this.isCaptionsActiveChanged);
    this._captions.off('SpokenLanguageChanged', this.isSpokenLanguageChanged);
    this._captions.off('CaptionsReceived', this.onCaptionsReceived);
  };

  private onCaptionsReceived: CaptionsHandler = (caption: CaptionsInfo): void => {
    this._context.addCaption(this._callIdRef.callId, caption);
  };

  private isCaptionsActiveChanged: PropertyChangedEvent = (): void => {
    this._context.setIsCaptionActive(this._callIdRef.callId, this._captions.isCaptionsFeatureActive);
  };
  private isSpokenLanguageChanged: PropertyChangedEvent = (): void => {
    this._context.setSelectedSpokenLanguage(this._callIdRef.callId, this._captions.activeSpokenLanguage);
  };
}

/**
 * @private
 */
export class CaptionsFeatureSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _captions: CaptionsCallFeature;
  private _TeamsCaptionsSubscriber?: TeamsCaptionsSubscriber;
  private _CaptionsSubscriber?: CaptionsSubscriber;

  constructor(callIdRef: CallIdRef, context: CallContext, captions: CaptionsCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._captions = captions;

    this._context.setCaptionsKind(this._callIdRef.callId, this._captions.captions.kind);
    if (this._captions.captions.kind === 'TeamsCaptions') {
      this._TeamsCaptionsSubscriber = new TeamsCaptionsSubscriber(
        this._callIdRef,
        this._context,
        this._captions.captions as TeamsCaptions
      );
    } else {
      this._CaptionsSubscriber = new CaptionsSubscriber(
        this._callIdRef,
        this._context,
        this._captions.captions as Captions
      );
    }
    this.subscribe();
  }

  private subscribe = (): void => {
    this._captions.on('CaptionsKindChanged', this.isCaptionsKindChanged);
  };

  public unsubscribe = (): void => {
    this._captions.off('CaptionsKindChanged', this.isCaptionsKindChanged);
    this._TeamsCaptionsSubscriber?.unsubscribe();
    this._CaptionsSubscriber?.unsubscribe();
  };

  private isCaptionsKindChanged: PropertyChangedEvent = (): void => {
    this._context.setCaptionsKind(this._callIdRef.callId, this._captions.captions.kind);
    // ACS call can turn into teams call but teams call will never turn into ACS call so we only need to handle the case when captions kind is TeamsCaptions
    if (this._captions.captions.kind === 'TeamsCaptions') {
      this._CaptionsSubscriber?.unsubscribe();
      this._TeamsCaptionsSubscriber = new TeamsCaptionsSubscriber(
        this._callIdRef,
        this._context,
        this._captions.captions as TeamsCaptions
      );
    }
  };
}
