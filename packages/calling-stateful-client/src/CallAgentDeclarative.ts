// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, CallAgent, CallEndReason, CollectionUpdatedEvent, IncomingCall } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { callDeclaratify, DeclarativeCall } from './CallDeclarative';
import { CallSubscriber } from './CallSubscriber';
import { convertSdkCallToDeclarativeCall, convertSdkIncomingCallToDeclarativeIncomingCall } from './Converter';
import { IncomingCallSubscriber } from './IncomingCallSubscriber';
import { InternalCallContext } from './InternalCallContext';
import { disposeAllViewsFromCall, disposeAllViews } from './StreamUtils';

/**
 * ProxyCallAgent proxies CallAgent and saves any returned state in the given context. It will subscribe to all state
 * updates in the CallAgent and in the contained Calls and RemoteParticipants. When dispose is called it will
 * unsubscribe from all state updates.
 */
class ProxyCallAgent implements ProxyHandler<CallAgent> {
  private _callAgent: CallAgent;
  private _context: CallContext;
  private _internalContext: InternalCallContext;
  private _callSubscribers: Map<Call, CallSubscriber>;
  private _incomingCallSubscribers: Map<string, IncomingCallSubscriber>;
  private _declarativeCalls: Map<Call, DeclarativeCall>;
  private _externalCallsUpdatedListeners: Set<CollectionUpdatedEvent<Call>>;

  constructor(callAgent: CallAgent, context: CallContext, internalContext: InternalCallContext) {
    this._callAgent = callAgent;
    this._context = context;
    this._internalContext = internalContext;
    this._callSubscribers = new Map<Call, CallSubscriber>();
    this._incomingCallSubscribers = new Map<string, IncomingCallSubscriber>();
    this._declarativeCalls = new Map<Call, DeclarativeCall>();
    this._externalCallsUpdatedListeners = new Set<CollectionUpdatedEvent<Call>>();
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

  private unsubscribe = (): void => {
    this._callAgent.off('callsUpdated', this.callsUpdated);
    this._callAgent.off('incomingCall', this.incomingCall);

    // Unsubscribe is called when CallAgent is disposed. This should mean no more updating of existing call but we don't
    // remove any existing state.
    for (const [_, callSubscriber] of this._callSubscribers.entries()) {
      callSubscriber.unsubscribe();
    }
    this._callSubscribers.clear();

    for (const [_, incomingCallSubscriber] of this._incomingCallSubscribers.entries()) {
      incomingCallSubscriber.unsubscribe();
    }
    this._incomingCallSubscribers.clear();

    for (const [_, declarativeCall] of this._declarativeCalls.entries()) {
      declarativeCall.unsubscribe();
    }
    this._declarativeCalls.clear();
  };

  private callsUpdated = (event: { added: Call[]; removed: Call[] }): void => {
    const addedStatefulCall: DeclarativeCall[] = [];
    for (const call of event.added) {
      const statefulCall = this.addCall(call);
      addedStatefulCall.push(statefulCall);
    }
    const removedStatefulCall: DeclarativeCall[] = [];
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
        removedStatefulCall.push(callDeclaratify(call, this._context));
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
    this._context.setIncomingCallEnded(incomingCallId, callEndReason);
  };

  private incomingCall = (event: { incomingCall: IncomingCall }): void => {
    // Make sure to not subscribe to the incoming call if we are already subscribed to it.
    if (!this._incomingCallSubscribers.has(event.incomingCall.id)) {
      this._incomingCallSubscribers.set(
        event.incomingCall.id,
        new IncomingCallSubscriber(event.incomingCall, this.setIncomingCallEnded)
      );
    }
    this._context.setIncomingCall(convertSdkIncomingCallToDeclarativeIncomingCall(event.incomingCall));
  };

  private addCall = (call: Call): DeclarativeCall => {
    this._callSubscribers.get(call)?.unsubscribe();

    // For API extentions we need to have the call in the state when we are subscribing as we may want to update the
    // state during the subscription process in the subscriber so we add the call to state before subscribing.
    this._context.setCall(convertSdkCallToDeclarativeCall(call));
    this._callSubscribers.set(call, new CallSubscriber(call, this._context, this._internalContext));
    return this.getOrCreateDeclarativeCall(call);
  };

  private getOrCreateDeclarativeCall = (call: Call): DeclarativeCall => {
    const declarativeCall = this._declarativeCalls.get(call);
    if (declarativeCall) {
      return declarativeCall;
    }

    const newDeclarativeCall = callDeclaratify(call, this._context);
    this._declarativeCalls.set(call, newDeclarativeCall as DeclarativeCall);
    return newDeclarativeCall;
  };

  public get<P extends keyof CallAgent>(target: CallAgent, prop: P): any {
    switch (prop) {
      case 'startCall': {
        return this._context.withErrorTeedToState((...args: Parameters<CallAgent['startCall']>): Call => {
          const call = target.startCall(...args);
          this.addCall(call);
          return this.getOrCreateDeclarativeCall(call);
        }, 'CallAgent.startCall');
      }
      case 'join': {
        return this._context.withErrorTeedToState((...args: Parameters<CallAgent['join']>): Call => {
          const call = target.join(...args);
          this.addCall(call);
          return this.getOrCreateDeclarativeCall(call);
        }, 'CallAgent.join');
      }
      case 'calls': {
        return Array.from(this._declarativeCalls.values());
      }
      case 'on': {
        return (...args: Parameters<CallAgent['on']>): void => {
          const isCallsUpdated = args[0] === 'callsUpdated';
          if (isCallsUpdated) {
            const listener = args[1];
            this._externalCallsUpdatedListeners.add(listener);
          } else {
            target.on(...args);
          }
        };
      }
      case 'off': {
        return (...args: Parameters<CallAgent['off']>): void => {
          const isCallsUpdated = args[0] === 'callsUpdated';
          if (isCallsUpdated) {
            const listener = args[1];
            this._externalCallsUpdatedListeners.delete(listener);
          } else {
            target.off(...args);
          }
        };
      }
      case 'dispose': {
        return (): Promise<void> => {
          return target.dispose().then(() => {
            this.unsubscribe();
          });
        };
      }
      default:
        return Reflect.get(target, prop);
    }
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
): CallAgent => {
  // Make sure there are no existing call data if creating a new CallAgentDeclarative (if creating a new
  // CallAgentDeclarative after disposing of the hold one will mean context have old call state). TODO: should we stop
  // rendering when the previous callAgent is disposed?
  disposeAllViews(context, internalContext);

  context.clearCallRelatedState();
  internalContext.clearCallRelatedState();
  return new Proxy(callAgent, new ProxyCallAgent(callAgent, context, internalContext)) as CallAgent;
};
