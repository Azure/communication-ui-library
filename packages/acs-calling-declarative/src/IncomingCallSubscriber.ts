// © Microsoft Corporation. All rights reserved.

import { CallEndReason, IncomingCall } from '@azure/communication-calling';
import { CallContext } from './CallContext';

/**
 * Keeps track of the listeners assigned to a particular incoming call because when we get an event from SDK, it doesn't
 * tell us which incoming call it is for. If we keep track of this then we know which incoming call in the state that
 * needs an update and also which property of that incoming call. Also we can use this when unregistering to a incoming
 * call.
 */
export class IncomingCallSubscriber {
  private _incomingCall: IncomingCall;
  private _context: CallContext;

  constructor(incomingCall: IncomingCall, context: CallContext) {
    this._incomingCall = incomingCall;
    this._context = context;
    this.subscribe();
  }

  private subscribe = (): void => {
    this._incomingCall.on('callEnded', this.callEnded);
  };

  private unsubscribe = (): void => {
    this._incomingCall.off('callEnded', this.callEnded);
  };

  private callEnded = (event: { callEndReason: CallEndReason }): void => {
    this._context.setIncomingCallEnded(this._incomingCall.id, event.callEndReason);
    this.unsubscribe();
  };
}
