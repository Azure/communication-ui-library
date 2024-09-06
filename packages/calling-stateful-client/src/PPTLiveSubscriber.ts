// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Features, PPTLiveCallFeature } from '@azure/communication-calling';

import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';
import { CallCommon } from './BetaToStableTypes';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';

/**
 * @private
 */
export class PPTLiveSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _pptLive: PPTLiveCallFeature;
  private _call: CallCommon;

  constructor(callIdRef: CallIdRef, context: CallContext, call: CallCommon) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._pptLive = call.feature(Features.PPTLive);
    this._call = call;

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
    if (!this._pptLive.activePresenterId) {
      return;
    }
    if (this._pptLive.isActive) {
      // TODO： need to refactor if Web Calling SDK has this logic ready
      if (this._call.isScreenSharingOn) {
        await this._call.stopScreenSharing();
      }
      this._context.setCallParticipantPPTLive(
        this._callIdRef.callId,
        toFlatCommunicationIdentifier(this._pptLive.activePresenterId),
        this._pptLive.target
      );
    } else {
      this._context.setCallParticipantPPTLive(
        this._callIdRef.callId,
        toFlatCommunicationIdentifier(this._pptLive.activePresenterId),
        undefined
      );
    }
  };
}
