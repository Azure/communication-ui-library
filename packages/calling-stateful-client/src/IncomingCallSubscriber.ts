// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallEndReason, IncomingCallCommon } from '@azure/communication-calling';

/**
 * Keeps track of the listeners assigned to a particular incoming call because when we get an event from SDK, it doesn't
 * tell us which incoming call it is for. If we keep track of this then we know which incoming call in the state that
 * needs an update and also which property of that incoming call. Also we can use this when unregistering to a incoming
 * call.
 */
export class IncomingCallSubscriber {
  private _incomingCall: IncomingCallCommon;
  private _setIncomingCallEnded: (incomingCallId: string, callEndReason: CallEndReason) => void;

  constructor(
    incomingCall: IncomingCallCommon,
    // setIncomingCallEnded callback is used so parent can clean up IncomingCallSubscriber.
    setIncomingCallEnded: (incomingCallId: string, callEndReason: CallEndReason) => void
  ) {
    this._incomingCall = incomingCall;
    this._setIncomingCallEnded = setIncomingCallEnded;
    this.subscribe();
  }

  private subscribe = (): void => {
    this._incomingCall.on('callEnded', this.callEnded);
  };

  public unsubscribe = (): void => {
    this._incomingCall.off('callEnded', this.callEnded);
  };

  private callEnded = (event: { callEndReason: CallEndReason }): void => {
    this._setIncomingCallEnded(this._incomingCall.id, event.callEndReason);
  };
}
