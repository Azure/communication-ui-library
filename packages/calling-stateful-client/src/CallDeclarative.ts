// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, CallApiFeature, CallFeatureFactoryType } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { transferCallFeatureDeclaratify } from './TransferCallFeatureDeclarative';

export interface DeclarativeCall extends Call {
  /**
   * Stop any declarative specific subscriptions and remove declarative subscribers.
   */
  unsubscribe(): void;
}

/**
 * ProxyCall proxies Call in order to intercept the Call.api function to return a DeclarativeTransferCallFeature.
 */
class ProxyCall implements ProxyHandler<Call> {
  private _call: Call;
  private _context: CallContext;
  private _transfer: any | undefined;

  constructor(call: Call, context: CallContext) {
    this._call = call;
    this._context = context;
  }

  public unsubscribe(): void {
    if (this._transfer) {
      this._transfer.unsubscribe();
    }
  }

  public get<P extends keyof Call>(target: Call, prop: P): any {
    switch (prop) {
      case 'api': {
        return <TFeature extends CallApiFeature>(cls: CallFeatureFactoryType<TFeature>): TFeature => {
          const feature = target.api(cls) as any;
          if (feature.transfer) {
            if (this._transfer) {
              return this._transfer as TFeature;
            } else {
              this._transfer = transferCallFeatureDeclaratify(this._call, feature, this._context);
              return this._transfer as TFeature;
            }
          } else {
            return feature as TFeature;
          }
        };
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Creates a declarative Call by proxying Call with ProxyCall in order to intercept the Call.api function to return a
 * DeclarativeTransferCall. This should only be used with CallAgentDeclarative as CallAgentDeclarative will add that
 * call to the context properly (need to have the Call in context to update it - CallAgentDeclarative will add Call to
 * context)
 *
 * @param call - Call from SDK
 * @param context - CallContext from StatefulCallClient
 */
export const callDeclaratify = (call: Call, context: CallContext): DeclarativeCall => {
  const proxyCall = new ProxyCall(call, context);
  Object.defineProperty(call, 'unsubscribe', {
    configurable: false,
    value: () => proxyCall.unsubscribe()
  });

  return new Proxy(call, proxyCall) as DeclarativeCall;
};
