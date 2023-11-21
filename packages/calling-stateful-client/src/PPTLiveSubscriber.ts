// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(ppt-live) */
import { Features, PPTLiveCallFeature } from '@azure/communication-calling';
import { CallCommon } from './BetaToStableTypes';
/* @conditional-compile-remove(ppt-live) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(ppt-live) */
import { CallIdRef } from './CallIdRef';

/* @conditional-compile-remove(ppt-live) */
/**
 * @private
 */
export class PPTLiveSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _call: CallCommon;
  private _pptLive: PPTLiveCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, call: CallCommon) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._pptLive = call.feature(Features.PPTLive);
    this._call = call;

    // If pptlive as already started when we joined the call, make sure it is reflected in state as there may not
    // be an event for it.
    if (this._pptLive) {
      this._context.setCallPPTLiveActive(this._callIdRef.callId, this._pptLive.isActive);
    }

    this.subscribe();
  }

  private subscribe = (): void => {
    this._pptLive.on('isActiveChanged', this.isAvailableChanged);
  };

  public unsubscribe = (): void => {
    this._pptLive.off('isActiveChanged', this.isAvailableChanged);
  };

  private isAvailableChanged = (): void => {
    this._context.setCallPPTLiveActive(this._callIdRef.callId, this._pptLive.isActive);
    this.checkAndUpdatePPTLiveParticipant();
  };

  private checkAndUpdatePPTLiveParticipant = async (): Promise<void> => {
    if (this._pptLive.isActive) {
      if (this._call.isScreenSharingOn) {
        await this._call.stopScreenSharing();
      }
      this._context.setCallParticipantPPTLive(this._callIdRef.callId, this._pptLive.target);
    } else {
      this._context.setCallParticipantPPTLive(this._callIdRef.callId, undefined);
    }
  };
}
