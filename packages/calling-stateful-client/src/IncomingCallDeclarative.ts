// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IncomingCall } from '@azure/communication-calling';
import { IncomingCallCommon } from './BetaToStableTypes';
import { CallContext } from './CallContext';

/**
 * @beta
 * Proxies the {@link @azure/communication-calling#IncomingCall} interface.
 */
export type DeclarativeIncomingCall = IncomingCall;

/**
 * @private
 */
export class ProxyIncomingCall implements ProxyHandler<DeclarativeIncomingCall> {
  private _context: CallContext;
  private _onAccept: () => void;

  constructor(context: CallContext, onAccept: () => void) {
    this._context = context;
    this._onAccept = onAccept;
  }

  public get<P extends keyof IncomingCall>(target: IncomingCall, prop: P): any {
    switch (prop) {
      case 'accept': {
        return this._context
          .withAsyncErrorTeedToState(async (...args: Parameters<IncomingCall['accept']>) => {
            const result = await target.accept(...args);
            this._onAccept();
            return result;
          }, 'IncomingCall.accept')
          .bind(this);
      }
      case 'reject': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<IncomingCall['reject']>) {
          return await target.reject(...args);
        }, 'IncomingCall.reject');
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Creates a declarative Incoming Call by proxying IncomingCall using ProxyIncomingCall.
 * @param incomingCall - IncomingCall from SDK
 * @returns proxied IncomingCall
 */
export const incomingCallDeclaratify = (
  incomingCall: IncomingCallCommon,
  context: CallContext,
  onAccept: () => void
): DeclarativeIncomingCall => {
  const proxyIncomingCall = new ProxyIncomingCall(context, onAccept);
  return new Proxy(incomingCall, proxyIncomingCall) as DeclarativeIncomingCall;
};
