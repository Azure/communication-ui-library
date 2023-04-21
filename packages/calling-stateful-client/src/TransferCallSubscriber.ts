// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TransferCallFeature, TransferRequestedEventArgs } from '@azure/communication-calling';

/**
 * @private
 */
export class TransferCallSubscriber {
  private _transferCall: TransferCallFeature;

  constructor(transferCall: TransferCallFeature) {
    this._transferCall = transferCall;

    this.subscribe();
  }

  private subscribe = (): void => {
    this._transferCall.on('transferRequested', this.transferRequested);
  };

  public unsubscribe = (): void => {
    this._transferCall.off('transferRequested', this.transferRequested);
  };

  private transferRequested = (args: TransferRequestedEventArgs): void => {
    console.log('DEBUG BEFORE TRANSFER ACCEPT');
    const call = args.accept();
    if (call) {
      console.log('DEBUG TRANSFER CALL OBTAINED: ', call.id);
    }
  };
}
