// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(raise-hand) */
import { RaiseHandCallFeature, RaisedHandChangedEvent } from '@azure/communication-calling';
/* @conditional-compile-remove(raise-hand) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(raise-hand) */
import { CallIdRef } from './CallIdRef';
/* @conditional-compile-remove(raise-hand) */
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
/* @conditional-compile-remove(raise-hand) */
/**
 * @private
 */
export class RaiseHandSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _raiseHand: RaiseHandCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, raiseHand: RaiseHandCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._raiseHand = raiseHand;

    this.subscribe();
  }

  private subscribe = (): void => {
    this._raiseHand.on('raisedHandEvent', this.raisedHand);
    this._raiseHand.on('loweredHandEvent', this.loweredHand);
  };

  public unsubscribe = (): void => {
    this._raiseHand.off('raisedHandEvent', this.raisedHand);
    this._raiseHand.off('loweredHandEvent', this.loweredHand);
  };

  private raisedHand = (): void => {
    this._context.setCallRaisedHands(this._callIdRef.callId, this._raiseHand.getRaisedHands());
    for (const raisedHand of this._raiseHand.getRaisedHands()) {
      this._context.setParticipantIsRaisedHand(
        this._callIdRef.callId,
        toFlatCommunicationIdentifier(raisedHand.identifier),
        raisedHand
      );
    }
  };

  private loweredHand = (event: RaisedHandChangedEvent): void => {
    this.raisedHand();

    this._context.setParticipantIsRaisedHand(
      this._callIdRef.callId,
      toFlatCommunicationIdentifier(event.identifier),
      undefined
    );
  };
}
