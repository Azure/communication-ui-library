// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCall, TeamsIncomingCall } from '@azure/communication-calling';
import { IncomingCallCommon } from './BetaToStableTypes';
import { CallContext } from './CallContext';

/**
 * @beta
 * Proxies the {@link @azure/communication-calling#IncomingCall} interface.
 */
export type DeclarativeIncomingCall = IncomingCall;

/**
 * @beta
 * Proxies the {@link @azure/communication-calling#IncomingCall} interface.
 */
export type DeclarativeTeamsIncomingCall = TeamsIncomingCall;

/**
 * @private
 */
export class ProxyIncomingCall implements ProxyHandler<IncomingCall | TeamsIncomingCall> {
  private _context: CallContext;

  constructor(context: CallContext) {
    this._context = context;
  }

  public get<P extends keyof IncomingCall>(target: IncomingCall, prop: P): any {
    switch (prop) {
      case 'accept': {
        return this._context.withAsyncErrorTeedToState(async function (
          ...args: Parameters<(IncomingCall | TeamsIncomingCall)['accept']>
        ) {
          return await target.accept(...args);
        }, 'IncomingCall.accept');
      }
      case 'reject': {
        return this._context.withAsyncErrorTeedToState(async function (
          ...args: Parameters<(IncomingCall | TeamsIncomingCall)['reject']>
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
 * Creates a declarative Incoming Call by proxying IncomingCall using ProxyIncomingCall.
 * @param incomingCall - IncomingCall from SDK
 * @returns proxied IncomingCall
 */
export const incomingCallDeclaratify = (
  incomingCall: IncomingCallCommon,
  context: CallContext
): DeclarativeIncomingCall => {
  const proxyIncomingCall = new ProxyIncomingCall(context);
  return new Proxy(incomingCall, proxyIncomingCall) as DeclarativeIncomingCall;
};

/**
 * Creates a declarative TeamsIncomingCall by proxying TeamsIncomingCall using ProxyIncomingCall.
 * @param incomingCall - TeamsIncomingCall from SDK
 * @returns proxied TeamsIncomingCall
 */
export const teamsIncomingCallDeclaratify = (
  incomingCall: TeamsIncomingCall,
  context: CallContext
): DeclarativeTeamsIncomingCall => {
  const proxyIncomingCall = new ProxyIncomingCall(context);
  return new Proxy(incomingCall, proxyIncomingCall) as DeclarativeTeamsIncomingCall;
};
