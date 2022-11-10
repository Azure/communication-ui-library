// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CallAgentCommon, CallCommon, TeamsCallAgent } from '@internal/acs-ui-common';
/* @conditional-compile-remove(one-to-n-calling) */
import { IncomingCallManagement } from './CallAgentDeclarative';
import { clearCallRelatedState, DeclarativeCallCommon, ProxyCallAgentCommon } from './CallAgentDeclarativeCommon';
import { CallContext } from './CallContext';
/* @conditional-compile-remove(teams-identity-support) */
import { _isTeamsCall, _isTeamsCallAgent } from '@internal/acs-ui-common';
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
    if (_isTeamsCall(call)) {
      return teamsCallDeclaratify(call, context);
    }
    throw new Error('Not reachable code, DeclarativeTeamsCallAgent.callDeclaratify must be called with an TeamsCall.');
  }

  protected startCall(agent: CallAgentCommon, args: Parameters<TeamsCallAgent['startCall']>): CallCommon {
    /* @conditional-compile-remove(teams-identity-support) */
    if (_isTeamsCallAgent(agent)) {
      return agent.startCall(...args);
    }
    throw new Error('Not reachable code, DeclarativeTeamsCallAgent.startCall must be called with an TeamsCallAgent.');
  }

  protected joinCall(agent: CallAgentCommon, args: Parameters<TeamsCallAgent['join']>): CallCommon {
    /* @conditional-compile-remove(teams-identity-support) */
    if (_isTeamsCallAgent(agent)) {
      return agent.join(...args);
    }
    throw new Error('Not reachable code, DeclarativeTeamsCallAgent.joinCall must be called with an TeamsCallAgent.');
  }

  protected agentSubscribe(agent: CallAgentCommon, args: Parameters<TeamsCallAgent['on']>): void {
    /* @conditional-compile-remove(teams-identity-support) */
    if (_isTeamsCallAgent(agent)) {
      agent.on(...args);
    }
    throw new Error(
      'Not reachable code, DeclarativeTeamsCallAgent.agentSubscribe must be called with an TeamsCallAgent.'
    );
  }

  protected agentUnsubscribe(agent: CallAgentCommon, args: Parameters<TeamsCallAgent['off']>): void {
    /* @conditional-compile-remove(teams-identity-support) */
    if (_isTeamsCallAgent(agent)) {
      agent.off(...args);
    }
    throw new Error(
      'Not reachable code, DeclarativeTeamsCallAgent.agentUnsubscribe must be called with an TeamsCallAgent.'
    );
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
