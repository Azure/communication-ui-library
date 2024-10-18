// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ProxyCallCommon } from './CallDeclarativeCommon';
import { CallContext } from './CallContext';
import { TeamsCall } from './BetaToStableTypes';

/**
 *
 * @public
 */
export type DeclarativeTeamsCall = TeamsCall & {
  /**
   * Stop any declarative specific subscriptions and remove declarative subscribers.
   */
  unsubscribe(): void;
};

class ProxyTeamsCall extends ProxyCallCommon implements ProxyHandler<TeamsCall> {
  public get<P extends keyof TeamsCall>(target: TeamsCall, prop: P): any {
    switch (prop) {
      /* @conditional-compile-remove(teams-identity-support-beta) */
      case 'addParticipant': {
        return this.getContext().withAsyncErrorTeedToState(async function (
          ...args: Parameters<TeamsCall['addParticipant']>
        ) {
          return await target.addParticipant(...args);
        }, 'TeamsCall.addParticipant');
      }
      default:
        return super.get(target, prop as any);
    }
    return super.get(target, prop as any);
  }
}

/**
 * Creates a declarative Call by proxying Call with ProxyCall.
 * This should only be used with CallAgentDeclarative as CallAgentDeclarative will add that
 * call to the context properly (need to have the Call in context to update it - CallAgentDeclarative will add Call to
 * context)
 *
 * @param call - TeamsCall from SDK
 * @param context - CallContext from StatefulCallClient
 */
export const teamsCallDeclaratify = (call: TeamsCall, context: CallContext): DeclarativeTeamsCall => {
  const proxyCall = new ProxyTeamsCall(context);
  proxyCall.unsubscribe();
  Object.defineProperty(call, 'unsubscribe', {
    configurable: false,
    value: () => proxyCall.unsubscribe()
  });

  return new Proxy(call, proxyCall) as DeclarativeTeamsCall;
};
