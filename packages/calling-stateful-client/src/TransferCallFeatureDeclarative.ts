// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Call,
  Transfer,
  TransferCallFeature,
  TransferToParticipant,
  TransferToParticipantOptions
} from '@azure/communication-calling';
import { CallContext, MAX_TRANSFER_REQUEST_LENGTH } from './CallContext';
import { convertSdkTransferToDeclarativeTransfer } from './Converter';
import { RequestedTransferSubscriber } from './RequestedTransferSubscriber';

/**
 * @private
 */
export interface DeclarativeTransferCallFeature extends TransferCallFeature {
  /**
   * Stop any declarative specific subscriptions and remove declarative subscribers.
   */
  unsubscribe(): void;
}

/**
 * ProxyTransfer proxies transfer so that the return value from transfer can be subscribed to and its state surfaced.
 */
class ProxyTransferCallFeature implements ProxyHandler<TransferCallFeature> {
  private _call: Call;
  private _context: CallContext;
  private _requestedTransferSubscribers: RequestedTransferSubscriber[];

  constructor(call: Call, context: CallContext) {
    this._call = call;
    this._context = context;
    this._requestedTransferSubscribers = [];
  }

  public unsubscribe(): void {
    for (const requestedTransfer of this._requestedTransferSubscribers) {
      requestedTransfer.unsubscribe();
    }
    this._requestedTransferSubscribers = [];
  }

  public get<P extends keyof TransferCallFeature>(target: TransferCallFeature, prop: P): any {
    switch (prop) {
      case 'transfer': {
        return (targetParticipant: TransferToParticipant, transferOptions?: TransferToParticipantOptions): Transfer => {
          const transfer = target.transfer(targetParticipant, transferOptions);
          const transferId = this._context.getAndIncrementAtomicId();
          this._context.setCallRequestedTransfer(
            this._call.id,
            convertSdkTransferToDeclarativeTransfer(transfer, targetParticipant.targetParticipant, transferId)
          );

          if (this._requestedTransferSubscribers.length >= MAX_TRANSFER_REQUEST_LENGTH) {
            const subscriber = this._requestedTransferSubscribers.shift();
            subscriber?.unsubscribe();
          }
          this._requestedTransferSubscribers.push(
            new RequestedTransferSubscriber(this._call, this._context, transfer, transferId)
          );
          return transfer;
        };
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Creates a declarative TransferCallFeature by proxying TransferCallFeature with ProxyTransferCallFeature which proxy
 * transfer calls to update the state properly.
 *
 * @param transfer - TransferCallFeature from SDK
 * @param context - CallContext from StatefulCallClient
 */
export const transferCallFeatureDeclaratify = (
  call: Call,
  transfer: TransferCallFeature,
  context: CallContext
): TransferCallFeature => {
  const proxyTransferCallFeature = new ProxyTransferCallFeature(call, context);
  Object.defineProperty(transfer, 'unsubscribe', {
    configurable: false,
    value: () => proxyTransferCallFeature.unsubscribe()
  });
  return new Proxy(transfer, proxyTransferCallFeature) as TransferCallFeature;
};
