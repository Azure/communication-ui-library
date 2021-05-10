// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call } from '@azure/communication-calling';

/**
 * ProxyCall proxies Call and updates the state with isMicrophoneMuted if muted or unmuted called. It doesn't subscribe
 * to events as that will be handled by CallSubscriber. There may be other methods we need to proxy but for now its mute
 * and unmute.
 */
class ProxyCall implements ProxyHandler<Call> {
  public get<P extends keyof Call>(target: Call, prop: P): any {
    switch (prop) {
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Creates a declarative Call by proxying Call with ProxyCall which proxy mute/unmute calls to update the state
 * properly. This should only be used with CallAgentDeclarative as CallAgentDeclarative will add that call to the
 * context properly (need to have the Call in context to update it - CallAgentDeclarative will add Call to context)
 *
 * @param callAgent - CallAgent from SDK
 * @param context - CallContext from CallClientDeclarative
 */
export const callDeclaratify = (call: Call): Call => {
  return new Proxy(call, new ProxyCall()) as Call;
};
