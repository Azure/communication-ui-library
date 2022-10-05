// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IncomingCall, TeamsIncomingCall } from '@azure/communication-calling';
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

  constructor(context: CallContext) {
    this._context = context;
  }

  public get<P extends keyof IncomingCall>(target: IncomingCall, prop: P): any {
    switch (prop) {
      case 'accept': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<IncomingCall['accept']>) {
          return await target.accept(...args);
        }, 'IncomingCall.accept');
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
  incomingCall: IncomingCall | TeamsIncomingCall,
  context: CallContext
): DeclarativeIncomingCall => {
  const proxyIncomingCall = new ProxyIncomingCall(context);
  return new Proxy(incomingCall, proxyIncomingCall) as DeclarativeIncomingCall;
};
