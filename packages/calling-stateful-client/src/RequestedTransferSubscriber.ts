// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, Transfer } from '@azure/communication-calling';
import { CallContext } from './CallContext';

/**
 * Subscribe to 'stateChanged' events in {@link @azure/communication-calling#Transfer}. These are outgoing or sent
 * requests.
 */
export class RequestedTransferSubscriber {
  private _call: Call;
  private _context: CallContext;
  private _transfer: Transfer;
  private _transferId: number;

  constructor(call: Call, context: CallContext, transfer: Transfer, transferId: number) {
    this._call = call;
    this._context = context;
    this._transfer = transfer;
    this._transferId = transferId;
    this.subscribe();
  }

  private subscribe = (): void => {
    this._transfer.on('stateChanged', this.stateChanged);
  };

  public unsubscribe = (): void => {
    this._transfer.off('stateChanged', this.stateChanged);
  };

  private stateChanged = (): void => {
    this._context.setCallRequestedTransferState(
      this._call.id,
      this._transferId,
      this._transfer.state,
      this._transfer.error
    );
  };
}
