// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CallAgentCommon, CallCommon, TeamsCallAgent } from './BetaToStableTypes';
/* @conditional-compile-remove(one-to-n-calling) */
import { IncomingCallManagement } from './CallAgentDeclarative';
import { clearCallRelatedState, DeclarativeCallCommon, ProxyCallAgentCommon } from './CallAgentDeclarativeCommon';
import { CallContext } from './CallContext';
/* @conditional-compile-remove(teams-identity-support) */
import { isTeamsCall, isTeamsCallAgent } from './Converter';
import { InternalCallContext } from './InternalCallContext';
/* @conditional-compile-remove(teams-identity-support) */
import { teamsCallDeclaratify } from './TeamsCallDeclarative';

/**
 * @beta
 * `DeclarativeTeamsCallAgent` extends and proxies the {@link @azure/communication-calling#TeamsCallAgent}
 */
export type DeclarativeTeamsCallAgent = TeamsCallAgent &
  /* @conditional-compile-remove(one-to-n-calling) */ IncomingCallManagement;

/**
 * ProxyTeamsCallAgent proxies TeamsCallAgent and saves any returned state in the given context. It will subscribe to all state
 * updates in the TeamsCallAgent and in the contained TeamsCalls and RemoteParticipants. When dispose is called it will
 * unsubscribe from all state updates.
 */
class ProxyTeamsCallAgent extends ProxyCallAgentCommon implements ProxyHandler<DeclarativeTeamsCallAgent> {
  /* @conditional-compile-remove(teams-identity-support) */
  private _callAgent: TeamsCallAgent;

  constructor(callAgent: TeamsCallAgent, context: CallContext, internalContext: InternalCallContext) {
    super(context, internalContext);
    /* @conditional-compile-remove(teams-identity-support) */
    this._callAgent = callAgent;
    this.subscribe();
  }

  private subscribe = (): void => {
    /* @conditional-compile-remove(teams-identity-support) */
    this._callAgent.on('callsUpdated', this.callsUpdated);
    /* @conditional-compile-remove(teams-identity-support) */
    this._callAgent.on('incomingCall', this.incomingCall);

    /* @conditional-compile-remove(teams-identity-support) */
    // There could be scenario that when ProxyTeamsCallAgent is created that the given CallAgent already has TeamsCalls. In this
    // case we need to make sure to subscribe to those already existing Calls.
    for (const call of this._callAgent.calls) {
      this.addCall(call);
    }
  };

  protected unsubscribe = (): void => {
    /* @conditional-compile-remove(teams-identity-support) */
    this._callAgent.off('callsUpdated', this.callsUpdated);
    /* @conditional-compile-remove(teams-identity-support) */
    this._callAgent.off('incomingCall', this.incomingCall);

    this.unregisterSubscriber();
  };

  protected callDeclaratify(call: CallCommon, context: CallContext): DeclarativeCallCommon {
    /* @conditional-compile-remove(teams-identity-support) */
    if (isTeamsCall(call)) {
      return teamsCallDeclaratify(call, context);
    }
    throw new Error('Not reachable code for callDeclaratify.');
  }

  protected startCall(agent: CallAgentCommon, args: unknown[]): CallCommon {
    /* @conditional-compile-remove(teams-identity-support) */
    if (isTeamsCallAgent(agent)) {
      return agent.startCall(...(args as Parameters<TeamsCallAgent['startCall']>));
    }
    throw Error('Unreachable code for TeamsCallAgentDeclarative.startCall()');
  }

  protected joinCall(agent: CallAgentCommon, args: unknown[]): CallCommon {
    /* @conditional-compile-remove(teams-identity-support) */
    if (isTeamsCallAgent(agent)) {
      return agent.join(...(args as Parameters<TeamsCallAgent['join']>));
    }
    throw Error('Unreachable code for TeamsCallAgentDeclarative.joinCall()');
  }

  protected agentSubscribe(agent: CallAgentCommon, args: unknown[]): void {
    /* @conditional-compile-remove(teams-identity-support) */
    if (isTeamsCallAgent(agent)) {
      agent.on(...(args as Parameters<TeamsCallAgent['on']>));
    }
    throw Error('Unreachable code for TeamsCallAgentDeclarative.agentSubscribe()');
  }

  protected agentUnsubscribe(agent: CallAgentCommon, args: unknown[]): void {
    /* @conditional-compile-remove(teams-identity-support) */
    if (isTeamsCallAgent(agent)) {
      agent.off(...(args as Parameters<TeamsCallAgent['off']>));
    }
    throw Error('Unreachable code for TeamsCallAgentDeclarative.agentUnsubscribe()');
  }

  public get<P extends keyof TeamsCallAgent>(target: TeamsCallAgent, prop: P): any {
    /* @conditional-compile-remove(teams-identity-support) */
    return super.getCommon(target, prop);
  }
}

/**
 * Creates a declarative CallAgent by proxying TeamsCallAgent with ProxyTeamsCallAgent which will track state updates by updating
 * the given context.
 *
 * @param callAgent - TeamsCallAgent from SDK
 * @param context - CallContext from StatefulCallClient
 * @param internalContext- InternalCallContext from StatefulCallClient
 */
export const teamsCallAgentDeclaratify = (
  callAgent: TeamsCallAgent,
  context: CallContext,
  internalContext: InternalCallContext
): DeclarativeTeamsCallAgent => {
  clearCallRelatedState(context, internalContext);
  return new Proxy(
    callAgent,
    new ProxyTeamsCallAgent(callAgent, context, internalContext)
  ) as DeclarativeTeamsCallAgent;
};
