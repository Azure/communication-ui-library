// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TeamsIncomingCall } from '@azure/communication-calling';
import { CallContext } from './CallContext';

/**
 * @private
 */
export class ProxyTeamsIncomingCall implements ProxyHandler<TeamsIncomingCall> {
  private _context: CallContext;

  constructor(context: CallContext) {
    this._context = context;
  }

  public get<P extends keyof TeamsIncomingCall>(target: TeamsIncomingCall, prop: P): any {
    switch (prop) {
      case 'accept': {
        return this._context.withAsyncErrorTeedToState(async function (
          ...args: Parameters<TeamsIncomingCall['accept']>
        ) {
          return await target.accept(...args);
        }, 'IncomingCall.accept');
      }
      case 'reject': {
        return this._context.withAsyncErrorTeedToState(async function (
          ...args: Parameters<TeamsIncomingCall['reject']>
        ) {
          return await target.reject(...args);
        }, 'IncomingCall.reject');
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Creates a declarative TeamsIncomingCall by proxying TeamsIncomingCall using ProxyIncomingCall.
 * @param incomingCall - TeamsIncomingCall from SDK
 * @returns proxied TeamsIncomingCall
 */
export const teamsIncomingCallDeclaratify = (
  incomingCall: TeamsIncomingCall,
  context: CallContext
): TeamsIncomingCall => {
  const proxyIncomingCall = new ProxyTeamsIncomingCall(context);
  return new Proxy(incomingCall, proxyIncomingCall);
};
