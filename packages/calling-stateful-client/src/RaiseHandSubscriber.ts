// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RaiseHandCallFeature, RaisedHandChangedEvent, DiagnosticQuality } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';

import {
  DiagnosticChangedEventArgs,
  LatestDiagnosticValue,
  NetworkDiagnosticChangedEventArgs
} from '@azure/communication-calling';
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

    this.networkDiagnosticsChanged({
      value: DiagnosticQuality.Bad,
      valueType: 'DiagnosticQuality',
      diagnostic: 'networkReceiveQuality'
    });
  };

  private loweredHand = (event: RaisedHandChangedEvent): void => {
    this.raisedHand();

    this._context.setParticipantIsRaisedHand(
      this._callIdRef.callId,
      toFlatCommunicationIdentifier(event.identifier),
      undefined
    );

    this.networkDiagnosticsChanged({
      value: DiagnosticQuality.Good,
      valueType: 'DiagnosticQuality',
      diagnostic: 'networkReceiveQuality'
    });
  };

  private networkDiagnosticsChanged(args: NetworkDiagnosticChangedEventArgs): void {
    this._context.modifyState((state) => {
      const call = state.calls[this._callIdRef.callId];
      if (call === undefined) {
        return;
      }
      const network = call.diagnostics?.network.latest;
      if (network) {
        network[args.diagnostic] = this.latestFromEvent(args);
      }
    });
  }

  private latestFromEvent = (args: DiagnosticChangedEventArgs): LatestDiagnosticValue => ({
    value: args.value,
    valueType: args.valueType
  });
}
