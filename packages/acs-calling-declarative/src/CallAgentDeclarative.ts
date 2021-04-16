// © Microsoft Corporation. All rights reserved.

import { Call, CallAgent, CallEndReason, IncomingCall } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { callDeclaratify } from './CallDeclarative';
import { CallSubscriber } from './CallSubscriber';
import { convertSdkCallToDeclarativeCall, convertSdkIncomingCallToDeclarativeIncomingCall } from './Converter';
import { IncomingCallSubscriber } from './IncomingCallSubscriber';

/**
 * ProxyCallAgent proxies CallAgent and saves any returned state in the given context. It will subscribe to all state
 * updates in the CallAgent and in the contained Calls and RemoteParticipants. When dispose is called it will
 * unsubscribe from all state updates.
 */
class ProxyCallAgent implements ProxyHandler<CallAgent> {
  private _callAgent: CallAgent;
  private _context: CallContext;
  private _callSubscribers: Map<Call, CallSubscriber>;
  private _incomingCallSubscribers: Map<string, IncomingCallSubscriber>;

  constructor(callAgent: CallAgent, context: CallContext) {
    this._callAgent = callAgent;
    this._context = context;
    this._callSubscribers = new Map<Call, CallSubscriber>();
    this._incomingCallSubscribers = new Map<string, IncomingCallSubscriber>();
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
  };

  private callsUpdated = (event: { added: Call[]; removed: Call[] }): void => {
    for (const call of event.added) {
      this.addCall(call);
    }
    for (const call of event.removed) {
      const callSubscriber = this._callSubscribers.get(call);
      if (callSubscriber) {
        callSubscriber.unsubscribe();
        this._callSubscribers.delete(call);
      }
      this._context.setCallEnded(call.id, call.callEndReason);
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

  private addCall = (call: Call): void => {
    // Make sure to not subscribe to the call if we are already subscribed to it.
    if (!this._callSubscribers.has(call)) {
      this._callSubscribers.set(call, new CallSubscriber(call, this._context));
    }
    this._context.setCall(convertSdkCallToDeclarativeCall(call));
  };

  public get<P extends keyof CallAgent>(target: CallAgent, prop: P): any {
    switch (prop) {
      case 'startCall': {
        return (...args: Parameters<CallAgent['startCall']>): Call => {
          const call = target.startCall(...args);
          this.addCall(call);
          return callDeclaratify(call, this._context);
        };
      }
      case 'join': {
        return (...args: Parameters<CallAgent['join']>): Call => {
          const call = target.join(...args);
          this.addCall(call);
          return callDeclaratify(call, this._context);
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
 * @param context - CallContext from CallClientDeclarative
 */
export const callAgentDeclaratify = (callAgent: CallAgent, context: CallContext): CallAgent => {
  // Make sure there are no existing call data if creating a new CallAgentDeclarative (if creating a new
  // CallAgentDeclarative after disposing of the hold one will mean context have old call state).
  context.clearCallRelatedState();
  return new Proxy(callAgent, new ProxyCallAgent(callAgent, context)) as CallAgent;
};
