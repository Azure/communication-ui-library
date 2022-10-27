// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAgent } from '@azure/communication-calling';
import { ProxyCallAgentCommon } from './CallAgentDeclarativeCommon';
import { CallContext } from './CallContext';
/* @conditional-compile-remove(teams-call) */
import { DeclarativeIncomingCall } from './IncomingCallDeclarative';
import { InternalCallContext } from './InternalCallContext';
import { disposeAllViews } from './StreamUtils';

/**
 * @public
 * `DeclarativeCallAgent` extends and proxies the {@link @azure/communication-calling#CallAgent}
 */
export type DeclarativeCallAgent = CallAgent & /* @conditional-compile-remove(one-to-n-calling) */ {
  /**
   * @beta
   * A readonly array that returns all the active `incomingCalls`.
   * An active incoming call is a call that has not been answered, declined or disconnected.
   *
   * @Remark This attribute doesn't exist on the {@link @azure/communication-calling#CallAgent} interface.
   * @returns readonly array of {@link DeclarativeIncomingCall}
   */
  incomingCalls: ReadonlyArray<DeclarativeIncomingCall>;
};

/**
 * ProxyCallAgent proxies CallAgent and saves any returned state in the given context. It will subscribe to all state
 * updates in the CallAgent and in the contained Calls and RemoteParticipants. When dispose is called it will
 * unsubscribe from all state updates.
 */
class ProxyCallAgent extends ProxyCallAgentCommon implements ProxyHandler<DeclarativeCallAgent> {
  private _callAgent: CallAgent;

  constructor(callAgent: CallAgent, context: CallContext, internalContext: InternalCallContext) {
    super(context, internalContext);
    this._callAgent = callAgent;
    this.subscribe();
  }

  protected subscribe = (): void => {
    this._callAgent.on('callsUpdated', this.callsUpdated);
    this._callAgent.on('incomingCall', this.incomingCall);

    // There could be scenario that when ProxyCallAgent is created that the given CallAgent already has Calls. In this
    // case we need to make sure to subscribe to those already existing Calls.
    for (const call of this._callAgent.calls) {
      this.addCall(call);
    }
  };

  protected unsubscribe = (): void => {
    this._callAgent.off('callsUpdated', this.callsUpdated);
    this._callAgent.off('incomingCall', this.incomingCall);

    this.unregisterSubscriber();
  };

  public get<P extends keyof CallAgent>(target: CallAgent, prop: P): any {
    return super.getCommon(target, prop);
  }
}

/**
 * Creates a declarative CallAgent by proxying CallAgent with ProxyCallAgent which will track state updates by updating
 * the given context.
 *
 * @param callAgent - CallAgent from SDK
 * @param context - CallContext from StatefulCallClient
 * @param internalContext- InternalCallContext from StatefulCallClient
 */
export const callAgentDeclaratify = (
  callAgent: CallAgent,
  context: CallContext,
  internalContext: InternalCallContext
): DeclarativeCallAgent => {
  // Make sure there are no existing call data if creating a new CallAgentDeclarative (if creating a new
  // CallAgentDeclarative after disposing of the hold one will mean context have old call state). TODO: should we stop
  // rendering when the previous callAgent is disposed?
  disposeAllViews(context, internalContext);

  context.clearCallRelatedState();
  internalContext.clearCallRelatedState();
  return new Proxy(callAgent, new ProxyCallAgent(callAgent, context, internalContext)) as DeclarativeCallAgent;
};
