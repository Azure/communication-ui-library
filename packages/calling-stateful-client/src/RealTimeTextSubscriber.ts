// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RealTimeTextFeature, RealTimeTextInfo, RealTimeTextReceivedEventHandler } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';

/**
 * @private
 */
export class RealTimeTextSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _realTimeTextFeature: RealTimeTextFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, realTimeText: RealTimeTextFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._realTimeTextFeature = realTimeText;
    this.subscribe();
  }

  private subscribe = (): void => {
    this._realTimeTextFeature.on('realTimeTextReceived', this.realTimeTextReceived);
  };

  public unsubscribe = (): void => {
    this._realTimeTextFeature.off('realTimeTextReceived', this.realTimeTextReceived);
  };

  private realTimeTextReceived: RealTimeTextReceivedEventHandler = (data: RealTimeTextInfo): void => {
    this._context.setIsRealTimeTextActive(this._callIdRef.callId, true);
    if (data.text !== ' ') {
      this._context.addRealTimeText(this._callIdRef.callId, data);
    }
  };
}
