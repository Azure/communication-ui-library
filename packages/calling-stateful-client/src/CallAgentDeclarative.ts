// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallAgent } from '@azure/communication-calling';
/* @conditional-compile-remove(one-to-n-calling) */
import { IncomingCall } from '@azure/communication-calling';
import { clearCallRelatedState, DeclarativeCallCommon, ProxyCallAgentCommon } from './CallAgentDeclarativeCommon';
import { CallContext } from './CallContext';
import { callDeclaratify } from './CallDeclarative';
import { InternalCallContext } from './InternalCallContext';
import { _isACSCall, _isACSCallAgent } from './TypeGuards';
import { CallAgentCommon, CallCommon } from './BetaToStableTypes';

/* @conditional-compile-remove(one-to-n-calling) */
/**
 * @public
 * This contains a readonly array that returns all the active `incomingCalls`.
 * An active incoming call is a call that has not been answered, declined or disconnected.
 */
export type IncomingCallManagement = {
  /**
   * @beta
   * @Remark This attribute doesn't exist on the {@link @azure/communication-calling#CallAgent} interface.
   * @returns readonly array of {@link IncomingCall}
   */
  incomingCalls: ReadonlyArray<IncomingCall>;
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
    if (_isACSCall(call)) {
      return callDeclaratify(call, context);
    }
    throw new Error('Not reachable code, DeclarativeCallAgent.callDeclaratify must be called with an ACS call.');
  }

  protected startCall(agent: CallAgentCommon, args: Parameters<CallAgent['startCall']>): CallCommon {
    if (_isACSCallAgent(agent)) {
      return agent.startCall(...args);
    }
    throw Error('Unreachable code, DeclarativeCallAgent.startCall must be called with an ACS callAgent.');
  }

  protected joinCall(agent: CallAgentCommon, args: Parameters<CallAgent['join']>): CallCommon {
    if (_isACSCallAgent(agent)) {
      return agent.join(...args);
    }
    throw Error('Unreachable code, DeclarativeCallAgent.joinCall must be called with an ACS callAgent.');
  }

  protected agentSubscribe(agent: CallAgentCommon, args: Parameters<CallAgent['on']>): void {
    if (_isACSCallAgent(agent)) {
      return agent.on(...args);
    }
    throw Error('Unreachable code, DeclarativeCallAgent.agentSubscribe must be called with an ACS callAgent.');
  }

  protected agentUnsubscribe(agent: CallAgentCommon, args: Parameters<CallAgent['off']>): void {
    if (_isACSCallAgent(agent)) {
      return agent.off(...args);
    }
    throw Error('Unreachable code, DeclarativeCallAgent.agentUnsubscribe must be called with an ACS callAgent.');
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
