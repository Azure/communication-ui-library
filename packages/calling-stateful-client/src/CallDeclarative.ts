// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Call } from '@azure/communication-calling';
import { ProxyCallCommon } from './CallDeclarativeCommon';
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

class ProxyCall extends ProxyCallCommon implements ProxyHandler<Call> {
  public get<P extends keyof Call>(target: Call, prop: P): any {
    switch (prop) {
      case 'addParticipant': {
        return this.getContext().withAsyncErrorTeedToState(async function (
          ...args: Parameters<Call['addParticipant']>
        ) {
          return await target.addParticipant(...args);
        }, 'Call.addParticipant');
      }
      default:
        return super.get(target, prop as any);
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
