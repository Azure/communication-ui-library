// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(teams-call) */
import { TeamsCallAgent as TeamsCallAgentBeta } from '@azure/communication-calling';
import { ProxyCallAgentCommon } from './CallAgentDeclarativeCommon';
import { CallContext } from './CallContext';
/* @conditional-compile-remove(teams-call) */
import { DeclarativeIncomingCall } from './IncomingCallDeclarative';
import { InternalCallContext } from './InternalCallContext';
import { disposeAllViews } from './StreamUtils';

type TeamsCallAgent = never | /* @conditional-compile-remove(teams-call) */ TeamsCallAgentBeta;

/**
 * @public
 * `DeclarativeTeamsCallAgent` extends and proxies the {@link @azure/communication-calling#TeamsCallAgent}
 */
export type DeclarativeTeamsCallAgent = TeamsCallAgent & /* @conditional-compile-remove(one-to-n-calling) */ {
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
 * ProxyTeamsCallAgent proxies TeamsCallAgent and saves any returned state in the given context. It will subscribe to all state
 * updates in the TeamsCallAgent and in the contained TeamsCalls and RemoteParticipants. When dispose is called it will
 * unsubscribe from all state updates.
 */
class ProxyTeamsCallAgent extends ProxyCallAgentCommon implements ProxyHandler<DeclarativeTeamsCallAgent> {
  /* @conditional-compile-remove(teams-call) */
  private _callAgent: TeamsCallAgent;

  constructor(callAgent: TeamsCallAgent, context: CallContext, internalContext: InternalCallContext) {
    super(context, internalContext);
    /* @conditional-compile-remove(teams-call) */
    this._callAgent = callAgent;
    this.subscribe();
  }

  protected subscribe = (): void => {
    /* @conditional-compile-remove(teams-call) */
    this._callAgent.on('callsUpdated', this.callsUpdated);
    /* @conditional-compile-remove(teams-call) */
    this._callAgent.on('incomingCall', this.incomingCall);

    /* @conditional-compile-remove(teams-call) */
    // There could be scenario that when ProxyTeamsCallAgent is created that the given CallAgent already has TeamsCalls. In this
    // case we need to make sure to subscribe to those already existing Calls.
    for (const call of this._callAgent.calls) {
      this.addCall(call);
    }
  };

  protected unsubscribe = (): void => {
    /* @conditional-compile-remove(teams-call) */
    this._callAgent.off('callsUpdated', this.callsUpdated);
    /* @conditional-compile-remove(teams-call) */
    this._callAgent.off('incomingCall', this.incomingCall);

    this.unregisterSubscriber();
  };

  public get<P extends keyof TeamsCallAgent>(target: TeamsCallAgent, prop: P): any {
    /* @conditional-compile-remove(teams-call) */
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
  // Make sure there are no existing call data if creating a new TeamsCallAgentDeclarative (if creating a new
  // TeamsCallAgentDeclarative after disposing of the hold one will mean context have old call state).
  disposeAllViews(context, internalContext);

  context.clearCallRelatedState();
  internalContext.clearCallRelatedState();
  return new Proxy(
    callAgent,
    new ProxyTeamsCallAgent(callAgent, context, internalContext)
  ) as DeclarativeTeamsCallAgent;
};
