// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IncomingCall, Call, CallAgent, AcceptCallOptions } from '@azure/communication-calling';
import { IncomingCallAdapter, IncomingCallListener } from './IncomingCallAdapter';
import { CallAgentCommon } from '@internal/calling-stateful-client';
import { EventEmitter } from 'events';

/**
 * Implementation of {@link IncomingCallAdapter} for Azure Communication Services calling UI library
 *
 * @beta
 */
export class AzureCommunicationIncomingCallAdapter implements IncomingCallAdapter {
  private callAgent: CallAgentCommon;
  private emitter: EventEmitter = new EventEmitter();

  constructor(callAgent: CallAgentCommon) {
    this.callAgent = callAgent;
    this.subscribeToIncomingCalls();
    this.bindAllPublicMethods();
  }

  /**
   * dispose the incoming call adapter
   * @beta
   */
  public dispose(): void {
    this.unsubscribeToIncomingCalls();
    this.dispose();
  }

  private subscribeToIncomingCalls(): void {
    (this.callAgent as CallAgent).on('incomingCall', (event) => {
      this.emitter.emit('incomingCall', event);
    });
  }

  private unsubscribeToIncomingCalls(): void {
    (this.callAgent as CallAgent).off('incomingCall', (event) => {
      this.emitter.emit('incomingCall', event);
    });
  }

  private bindAllPublicMethods(): void {
    this.accept.bind(this);
    this.reject.bind(this);
  }

  /**
   * Handler for accepting a incoming call
   * @param incomingCall - call being accepted
   * @param options - accept call options
   * @returns call object for new call
   */
  public accept(incomingCall: IncomingCall, options?: AcceptCallOptions | undefined): Promise<Call> {
    return incomingCall.accept(options);
  }
  /**
   * Handler for rejecting a incoming call
   * @param incomingCall - call being rejected
   * @returns void
   */
  public reject(incomingCall: IncomingCall): Promise<void> {
    return incomingCall.reject();
  }

  on(event: 'incomingCall', listener: IncomingCallListener): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public on(event: string, listener: (e: any) => void): void {
    this.emitter.on(event, listener);
  }

  off(event: 'incomingCall', listener: IncomingCallListener): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public off(event: string, listener: (e: any) => void): void {
    this.emitter.off(event, listener);
  }
}
