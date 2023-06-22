// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(raise-hands) */
import { RaiseHandCallFeature, RaisedHandChangedEvent } from '@azure/communication-calling';
/* @conditional-compile-remove(raise-hands) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(raise-hands) */
import { CallIdRef } from './CallIdRef';
/* @conditional-compile-remove(raise-hands) */
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
/* @conditional-compile-remove(raise-hands) */
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
    this._raiseHand.on('raisedHandEvent', this.stateChanged);
    this._raiseHand.on('loweredHandEvent', this.stateChanged);
  };

  public unsubscribe = (): void => {
    this._raiseHand.off('raisedHandEvent', this.stateChanged);
    this._raiseHand.off('loweredHandEvent', this.stateChanged);
  };

  private stateChanged = (event: RaisedHandChangedEvent): void => {
    this._context.setCallRaisedHands(this._callIdRef.callId, this._raiseHand.getRaisedHands());
    const raisedHand = this._raiseHand
      .getRaisedHands()
      .find(
        (raisedHand) =>
          toFlatCommunicationIdentifier(raisedHand.identifier) === toFlatCommunicationIdentifier(event.identifier)
      );
    this._context.setParticipantIsRaisedHand(
      this._callIdRef.callId,
      toFlatCommunicationIdentifier(event.identifier),
      raisedHand
    );
  };
}
