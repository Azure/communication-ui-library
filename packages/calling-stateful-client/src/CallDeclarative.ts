// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call } from '@azure/communication-calling';
import { CallContext } from './CallContext';

/**
 * TODO: This should likely be exported?
 *
 * @private
 */
export interface DeclarativeCall extends Call {
  /**
   * Stop any declarative specific subscriptions and remove declarative subscribers.
   */
  unsubscribe(): void;
}

class ProxyCall implements ProxyHandler<Call> {
  private _context: CallContext;

  constructor(context: CallContext) {
    this._context = context;
  }

  public unsubscribe(): void {
    /** No subscriptions yet. But there will be one for transfer feature soon. */
  }

  public get<P extends keyof Call>(target: Call, prop: P): any {
    switch (prop) {
      case 'mute': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<Call['mute']>) {
          return await target.mute(...args);
        }, 'Call.mute');
      }
      case 'unmute': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<Call['unmute']>) {
          return await target.unmute(...args);
        }, 'Call.unmute');
      }
      case 'startVideo': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<Call['startVideo']>) {
          return await target.startVideo(...args);
        }, 'Call.startVideo');
      }
      case 'stopVideo': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<Call['stopVideo']>) {
          return await target.stopVideo(...args);
        }, 'Call.stopVideo');
      }
      case 'startScreenSharing': {
        return this._context.withAsyncErrorTeedToState(async function (
          ...args: Parameters<Call['startScreenSharing']>
        ) {
          return await target.startScreenSharing(...args);
        },
        'Call.startScreenSharing');
      }
      case 'stopScreenSharing': {
        return this._context.withAsyncErrorTeedToState(async function (...args: Parameters<Call['stopScreenSharing']>) {
          return await target.stopScreenSharing(...args);
        }, 'Call.stopScreenSharing');
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Creates a declarative Call by proxying Call with ProxyCall.
 * This should only be used with CallAgentDeclarative as CallAgentDeclarative will add that
 * call to the context properly (need to have the Call in context to update it - CallAgentDeclarative will add Call to
 * context)
 *
 * @param call - Call from SDK
 * @param context - CallContext from StatefulCallClient
 */
export const callDeclaratify = (call: Call, context: CallContext): DeclarativeCall => {
  const proxyCall = new ProxyCall(context);
  Object.defineProperty(call, 'unsubscribe', {
    configurable: false,
    value: () => proxyCall.unsubscribe()
  });

  return new Proxy(call, proxyCall) as DeclarativeCall;
};
function CallFeatureFactory<T>(): any {
  throw new Error('Function not implemented.');
}
