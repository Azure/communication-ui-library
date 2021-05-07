// © Microsoft Corporation. All rights reserved.

import { TransferCallFeature, TransferRequestedEventArgs } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';
import { convertSdkTransferRequestedToDeclarativeTransferRequested } from './Converter';

/**
 * Subscribe to 'transferRequested' events. These are incoming or received requests.
 */
export class ReceivedTransferSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _transfer: TransferCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, transfer: TransferCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._transfer = transfer;
    this.subscribe();
  }

  private subscribe = (): void => {
    this._transfer.on('transferRequested', this.transferRequested);
  };

  public unsubscribe = (): void => {
    this._transfer.off('transferRequested', this.transferRequested);
  };

  private transferRequested = (transferRequested: TransferRequestedEventArgs): void => {
    this._context.setCallReceivedTransferRequest(
      this._callIdRef.callId,
      convertSdkTransferRequestedToDeclarativeTransferRequested(transferRequested)
    );
  };
}
