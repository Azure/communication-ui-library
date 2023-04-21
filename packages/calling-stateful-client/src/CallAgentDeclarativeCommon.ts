// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, CallAgent, CallEndReason, CollectionUpdatedEvent } from '@azure/communication-calling';

import { IncomingCallCommon, CallAgentCommon, CallCommon } from './BetaToStableTypes';

/* @conditional-compile-remove(teams-identity-support) */
import { TeamsCallAgent } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { DeclarativeCall } from './CallDeclarative';
import { CallSubscriber } from './CallSubscriber';
import { convertSdkCallToDeclarativeCall, convertSdkIncomingCallToDeclarativeIncomingCall } from './Converter';
import { DeclarativeIncomingCall, incomingCallDeclaratify } from './IncomingCallDeclarative';
import { IncomingCallSubscriber } from './IncomingCallSubscriber';
import { InternalCallContext } from './InternalCallContext';
import { disposeAllViews, disposeAllViewsFromCall } from './StreamUtils';

/**
 *
 * @private
 */
export type DeclarativeCallCommon = CallCommon & {
  /**
   * Stop any declarative specific subscriptions and remove declarative subscribers.
   */
  unsubscribe(): void;
};

/**
 * ProxyCallAgent proxies CallAgent and saves any returned state in the given context. It will subscribe to all state
 * updates in the CallAgent and in the contained Calls and RemoteParticipants. When dispose is called it will
 * unsubscribe from all state updates.
 */
export abstract class ProxyCallAgentCommon {
  private _context: CallContext;
  private _internalContext: InternalCallContext;
  private _callSubscribers: Map<CallCommon, CallSubscriber>;
  private _incomingCallSubscribers: Map<string, IncomingCallSubscriber>;
  private _declarativeIncomingCalls: Map<string, DeclarativeIncomingCall>;
  private _declarativeCalls: Map<CallCommon, DeclarativeCallCommon>;
  private _externalCallsUpdatedListeners: Set<CollectionUpdatedEvent<CallCommon>>;

  constructor(context: CallContext, internalContext: InternalCallContext) {
    this._context = context;
    this._internalContext = internalContext;
    this._callSubscribers = new Map<Call, CallSubscriber>();
    this._incomingCallSubscribers = new Map<string, IncomingCallSubscriber>();
    this._declarativeIncomingCalls = new Map<string, DeclarativeIncomingCall>();
    this._declarativeCalls = new Map<Call, DeclarativeCall>();
    this._externalCallsUpdatedListeners = new Set<CollectionUpdatedEvent<CallCommon>>();
  }

  // Unsubscribe is called when CallAgent is disposed. This should mean no more updating of existing call but we don't
  // remove any existing state.
  protected unregisterSubscriber = (): void => {
    for (const [_, callSubscriber] of this._callSubscribers.entries()) {
      callSubscriber.unsubscribe();
    }
    this._callSubscribers.clear();

    for (const [_, incomingCallSubscriber] of this._incomingCallSubscribers.entries()) {
      incomingCallSubscriber.unsubscribe();
    }
    this._incomingCallSubscribers.clear();
    this._declarativeIncomingCalls.clear();

    for (const [_, declarativeCall] of this._declarativeCalls.entries()) {
      declarativeCall.unsubscribe();
    }
    this._declarativeCalls.clear();
  };

  protected abstract unsubscribe(): void;

  protected abstract callDeclaratify(call: CallCommon, context: CallContext): DeclarativeCallCommon;

  protected callsUpdated = (event: { added: CallCommon[]; removed: CallCommon[] }): void => {
    console.log('DEBUG added: ', event.added.map((c) => c.id).join(', '));
    console.log('DEBUG');
    console.log('DEBUG removed: ', event.removed.map((c) => c.id).join(', '));
    const addedStatefulCall: DeclarativeCallCommon[] = [];
    for (const call of event.added) {
      const statefulCall = this.addCall(call);
      addedStatefulCall.push(statefulCall);
    }
    const removedStatefulCall: DeclarativeCallCommon[] = [];
    for (const call of event.removed) {
      disposeAllViewsFromCall(this._context, this._internalContext, call.id);
      const callSubscriber = this._callSubscribers.get(call);
      if (callSubscriber) {
        callSubscriber.unsubscribe();
        this._callSubscribers.delete(call);
      }
      this._context.setCallEnded(call.id, call.callEndReason);
      const declarativeCall = this._declarativeCalls.get(call);
      if (declarativeCall) {
        declarativeCall.unsubscribe();
        removedStatefulCall.push(declarativeCall);
        this._declarativeCalls.delete(call);
      } else {
        removedStatefulCall.push(this.callDeclaratify(call, this._context));
      }
    }
    console.log('DEBUG callsUpdated:', this._context.getState());

    for (const externalCallsUpdatedListener of this._externalCallsUpdatedListeners) {
      externalCallsUpdatedListener({ added: addedStatefulCall, removed: removedStatefulCall });
    }
  };

  private setIncomingCallEnded = (incomingCallId: string, callEndReason: CallEndReason): void => {
    const incomingCallSubscriber = this._incomingCallSubscribers.get(incomingCallId);
    if (incomingCallSubscriber) {
      incomingCallSubscriber.unsubscribe();
      this._incomingCallSubscribers.delete(incomingCallId);
    }
    this._declarativeIncomingCalls.delete(incomingCallId);
    this._context.setIncomingCallEnded(incomingCallId, callEndReason);
  };

  protected incomingCall = ({ incomingCall }: { incomingCall: IncomingCallCommon }): void => {
    // Make sure to not subscribe to the incoming call if we are already subscribed to it.
    if (!this._incomingCallSubscribers.has(incomingCall.id)) {
      this._incomingCallSubscribers.set(
        incomingCall.id,
        new IncomingCallSubscriber(incomingCall, this.setIncomingCallEnded)
      );
    }
    this._declarativeIncomingCalls.set(incomingCall.id, incomingCallDeclaratify(incomingCall, this._context));
    this._context.setIncomingCall(convertSdkIncomingCallToDeclarativeIncomingCall(incomingCall));
  };

  protected addCall = (call: CallCommon): DeclarativeCallCommon => {
    this._callSubscribers.get(call)?.unsubscribe();

    // For API extentions we need to have the call in the state when we are subscribing as we may want to update the
    // state during the subscription process in the subscriber so we add the call to state before subscribing.
    console.log('DEBUG before setCall: ', this._context.getState());
    this._context.setCall(convertSdkCallToDeclarativeCall(call));
    console.log('DEBUG after setCall: ', this._context.getState());
    this._callSubscribers.set(call, new CallSubscriber(call, this._context, this._internalContext));
    return this.getOrCreateDeclarativeCall(call);
  };

  private getOrCreateDeclarativeCall = (call: CallCommon): DeclarativeCallCommon => {
    const declarativeCall = this._declarativeCalls.get(call);
    if (declarativeCall) {
      return declarativeCall;
    }

    const newDeclarativeCall = this.callDeclaratify(call, this._context);
    this._declarativeCalls.set(call, newDeclarativeCall);
    return newDeclarativeCall;
  };

  // args could be either from teamsCall or Call, set it as unknown and cast it in child class later
  protected abstract startCall(agent: CallAgentCommon, args: unknown[]): CallCommon;
  protected abstract joinCall(agent: CallAgentCommon, args: unknown[]): CallCommon;
  protected abstract agentSubscribe(agent: CallAgentCommon, args: unknown[]): void;
  protected abstract agentUnsubscribe(agent: CallAgentCommon, args: unknown[]): void;

  // We can't directly override get function because it is proxied,
  // Add a getCommon function and call it in child class
  protected getCommon<
    AgentType extends CallAgent | /* @conditional-compile-remove(teams-identity-support) */ TeamsCallAgent,
    P extends keyof CallAgent
  >(target: AgentType, prop: P): any {
    switch (prop) {
      case 'startCall': {
        return this._context.withErrorTeedToState((...args: Parameters<AgentType['startCall']>): CallCommon => {
          const call = this.startCall(target, args);
          this.addCall(call);
          return this.getOrCreateDeclarativeCall(call);
        }, 'CallAgent.startCall');
      }
      case 'join': {
        return this._context.withErrorTeedToState((...args: Parameters<AgentType['join']>): CallCommon => {
          const call = this.joinCall(target, args);
          this.addCall(call);
          return this.getOrCreateDeclarativeCall(call);
        }, 'CallAgent.join');
      }
      case 'calls': {
        return Array.from(this._declarativeCalls.values());
      }
      case 'on': {
        return (...args: Parameters<AgentType['on']>): void => {
          const isCallsUpdated = args[0] === 'callsUpdated';
          if (isCallsUpdated) {
            const listener = args[1];
            this._externalCallsUpdatedListeners.add(listener as CollectionUpdatedEvent<CallCommon>);
          } else {
            this.agentSubscribe(target, args);
          }
        };
      }
      case 'off': {
        return (...args: Parameters<AgentType['off']>): void => {
          const isCallsUpdated = args[0] === 'callsUpdated';
          if (isCallsUpdated) {
            const listener = args[1];
            this._externalCallsUpdatedListeners.delete(listener as CollectionUpdatedEvent<CallCommon>);
          } else {
            this.agentUnsubscribe(target, args);
          }
        };
      }
      case 'dispose': {
        /* @conditional-compile-remove(calling-beta-sdk) */
        return (): void => {
          target.dispose();
          this.unsubscribe();
        };
        // Wrapping CallAgent.dispose in a callback type (): Promise<void> to accomodate the change of CallAgent.dispose
        // in calling beta version 1.8.0-beta.1 from callback type (): Promise<void> to (): void
        const callAgentDisposeAsyncCallbackWrapper = async (): Promise<void> => {
          await target.dispose();
          return Promise.resolve();
        };
        return (): Promise<void> => {
          return callAgentDisposeAsyncCallbackWrapper().then(() => {
            this.unsubscribe();
          });
        };
      }
      /**
       * This attribute is a special case and doesn't exist on the CallAgent interface.
       * We need this to be able to return a declarative incoming call object using the call agent.
       * In a standard headless SDK usage, the right way to get an incoming call is to use the `incomingCall` event.
       * However, using the declarative layer, the ideal usage would be to:
       * 1. subscribe to the `onStateChange` event
       * 2. Get the incoming call from the new state and it's ID
       * 3. Use `callAgent.incomingCalls` and filter an incoming call ID to get a declarative incoming call object
       */
      case 'incomingCalls': {
        return Array.from(this._declarativeIncomingCalls.values());
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * @private
 */
export const clearCallRelatedState = (context: CallContext, internalContext: InternalCallContext): void => {
  // Make sure there are no existing call data if creating a new CallAgentDeclarative (if creating a new
  // CallAgentDeclarative after disposing of the hold one will mean context have old call state). TODO: should we stop
  // rendering when the previous callAgent is disposed?
  disposeAllViews(context, internalContext);

  context.clearCallRelatedState();
  internalContext.clearCallRelatedState();
};
