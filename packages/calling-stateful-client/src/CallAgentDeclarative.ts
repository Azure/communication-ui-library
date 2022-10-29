// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAgent } from '@azure/communication-calling';
import { CallAgentCommon, CallCommon } from './BetaToStableTypes';
import { clearCallRelatedState, DeclarativeCallCommon, ProxyCallAgentCommon } from './CallAgentDeclarativeCommon';
import { CallContext } from './CallContext';
import { callDeclaratify } from './CallDeclarative';
import { isACSCall, isACSCallAgent } from './Converter';
/* @conditional-compile-remove(one-to-n-calling) */
import { DeclarativeIncomingCall } from './IncomingCallDeclarative';
import { InternalCallContext } from './InternalCallContext';

/* @conditional-compile-remove(one-to-n-calling) */
/**
 * @beta
 * This contains a readonly array that returns all the active `incomingCalls`.
 * An active incoming call is a call that has not been answered, declined or disconnected.
 */
export type IncomingCallManagement = {
  /**
   * @beta
   * @Remark This attribute doesn't exist on the {@link @azure/communication-calling#CallAgent} interface.
   * @returns readonly array of {@link DeclarativeIncomingCall}
   */
  incomingCalls: ReadonlyArray<DeclarativeIncomingCall>;
};

/**
 * @public
 * `DeclarativeCallAgent` extends and proxies the {@link @azure/communication-calling#CallAgent}
 */
export type DeclarativeCallAgent = CallAgent &
  /* @conditional-compile-remove(one-to-n-calling) */ IncomingCallManagement;

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

  private subscribe = (): void => {
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

  protected callDeclaratify(call: CallCommon, context: CallContext): DeclarativeCallCommon {
    if (isACSCall(call)) {
      return callDeclaratify(call, context);
    }
    throw new Error('Not reachable code for callDeclaratify.');
  }

  protected startCall(agent: CallAgentCommon, args: unknown[]): CallCommon {
    if (isACSCallAgent(agent)) {
      return agent.startCall(...(args as Parameters<CallAgent['startCall']>));
    }
    throw Error('Unreachable code for callAgentDeclarative.startCall()');
  }

  protected joinCall(agent: CallAgentCommon, args: unknown[]): CallCommon {
    if (isACSCallAgent(agent)) {
      return agent.join(...(args as Parameters<CallAgent['join']>));
    }
    throw Error('Unreachable code for callAgentDeclarative.joinCall()');
  }

  protected agentSubscribe(agent: CallAgentCommon, args: unknown[]): void {
    if (isACSCallAgent(agent)) {
      return agent.on(...(args as Parameters<CallAgent['on']>));
    }
    throw Error('Unreachable code for callAgentDeclarative.agentSubscribe()');
  }

  protected agentUnsubscribe(agent: CallAgentCommon, args: unknown[]): void {
    if (isACSCallAgent(agent)) {
      return agent.off(...(args as Parameters<CallAgent['off']>));
    }
    throw Error('Unreachable code for callAgentDeclarative.agentUnsubscribe()');
  }

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
  clearCallRelatedState(context, internalContext);
  return new Proxy(callAgent, new ProxyCallAgent(callAgent, context, internalContext)) as DeclarativeCallAgent;
};
