// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Call,
  CallAgent,
  CallCommon,
  CallEndReason,
  CollectionUpdatedEvent,
  IncomingCall,
  TeamsCall,
  TeamsCallAgent,
  TeamsIncomingCall
} from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { callDeclaratify, DeclarativeCall } from './CallDeclarative';
import { CallSubscriber } from './CallSubscriber';
import {
  convertSdkCallToDeclarativeCall,
  convertSdkIncomingCallToDeclarativeIncomingCall,
  isTeamsCall
} from './Converter';
import { DeclarativeIncomingCall, incomingCallDeclaratify } from './IncomingCallDeclarative';
import { IncomingCallSubscriber } from './IncomingCallSubscriber';
import { InternalCallContext } from './InternalCallContext';
import { disposeAllViewsFromCall } from './StreamUtils';
import { teamsCallDeclaratify } from './TeamsCallDeclarative';

/**
 * TODO: This should likely be exported?
 *
 * @private
 */
export interface DeclarativeCallCommon extends CallCommon {
  /**
   * Stop any declarative specific subscriptions and remove declarative subscribers.
   */
  unsubscribe(): void;
}

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
  private _declarativeCalls: Map<CallCommon, DeclarativeCall>;
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

  protected abstract subscribe(): void;

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

  protected callsUpdated = (event: { added: (TeamsCall | Call)[]; removed: (TeamsCall | Call)[] }): void => {
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
        if (isTeamsCall(call)) {
          removedStatefulCall.push(teamsCallDeclaratify(call, this._context));
        } else {
          removedStatefulCall.push(callDeclaratify(call, this._context));
        }
      }
    }

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

  protected incomingCall = ({ incomingCall }: { incomingCall: TeamsIncomingCall | IncomingCall }): void => {
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

  protected addCall = (call: TeamsCall | Call): DeclarativeCallCommon => {
    this._callSubscribers.get(call)?.unsubscribe();

    // For API extentions we need to have the call in the state when we are subscribing as we may want to update the
    // state during the subscription process in the subscriber so we add the call to state before subscribing.
    this._context.setCall(convertSdkCallToDeclarativeCall(call));
    this._callSubscribers.set(call, new CallSubscriber(call, this._context, this._internalContext));
    return this.getOrCreateDeclarativeCall(call);
  };

  private getOrCreateDeclarativeCall = (call: TeamsCall | Call): DeclarativeCallCommon => {
    const declarativeCall = this._declarativeCalls.get(call);
    if (declarativeCall) {
      return declarativeCall;
    }

    const newDeclarativeCall = isTeamsCall(call)
      ? teamsCallDeclaratify(call, this._context)
      : callDeclaratify(call, this._context);
    this._declarativeCalls.set(call, newDeclarativeCall as DeclarativeCall);
    return newDeclarativeCall;
  };

  protected abstract getAgentType: () => 'TeamsCallAgent' | 'CallAgent';

  public getCommon<AgentType extends CallAgent | TeamsCallAgent, P extends keyof CallAgent>(
    target: AgentType,
    prop: P
  ): any {
    switch (prop) {
      case 'startCall': {
        return this._context.withErrorTeedToState((...args: Parameters<AgentType['startCall']>): CallCommon => {
          let call: TeamsCall | Call;
          if (this.getAgentType() === 'TeamsCallAgent') {
            call = (target as TeamsCallAgent).startCall(...(args as Parameters<TeamsCallAgent['startCall']>));
          } else {
            call = (target as CallAgent).startCall(...(args as Parameters<CallAgent['startCall']>));
          }

          this.addCall(call);
          return this.getOrCreateDeclarativeCall(call);
        }, 'CallAgent.startCall');
      }
      case 'join': {
        return this._context.withErrorTeedToState((...args: Parameters<AgentType['join']>): CallCommon => {
          let call: TeamsCall | Call;
          if (this.getAgentType() === 'TeamsCallAgent') {
            call = (target as TeamsCallAgent).join(...(args as Parameters<TeamsCallAgent['join']>));
          } else {
            call = (target as CallAgent).join(...(args as Parameters<CallAgent['join']>));
          }

          this.addCall(call);
          return this.getOrCreateDeclarativeCall(call);
        }, 'CallAgent.join');
      }
      case 'calls': {
        return Array.from(this._declarativeCalls.values());
      }
      case 'on': {
        return (...args: Parameters<CallAgent['on']> | Parameters<AgentType['on']>): void => {
          const isCallsUpdated = args[0] === 'callsUpdated';
          if (isCallsUpdated) {
            const listener = args[1];
            this._externalCallsUpdatedListeners.add(listener as CollectionUpdatedEvent<CallCommon>);
          } else {
            if (this.getAgentType() === 'TeamsCallAgent') {
              (target as TeamsCallAgent).on(...(args as Parameters<TeamsCallAgent['on']>));
            } else {
              (target as CallAgent).on(...(args as Parameters<CallAgent['on']>));
            }
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
            if (this.getAgentType() === 'TeamsCallAgent') {
              (target as TeamsCallAgent).off(...(args as Parameters<TeamsCallAgent['off']>));
            } else {
              (target as CallAgent).off(...(args as Parameters<CallAgent['off']>));
            }
          }
        };
      }
      case 'dispose': {
        return async (): Promise<void> => {
          target.dispose();
          this.unsubscribe();
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
