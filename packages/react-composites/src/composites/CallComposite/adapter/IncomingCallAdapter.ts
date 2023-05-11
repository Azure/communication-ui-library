// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IncomingCall, Call, AcceptCallOptions } from '@azure/communication-calling';
import { Disposable } from '../../common/adapters';

/**
 * CallBack for {@link CallAgent} 'incomingCall' event
 *
 * @beta
 */
export type IncomingCallListener = (event: { incomingCall: IncomingCall }) => void;

/**
 * Events that can be subscribed to on the IncomingCallAdapter
 *
 *  @beta
 */
export interface IncomingCallAdapterSubscribers {
  /**
   * Subscribe function for 'IncomingCall' event
   */
  on(event: 'incomingCall', listener: IncomingCallListener): void;
  /**
   * Unsubscribe function for 'IncomingCall' event
   */
  off(event: 'incomingCall', listener: IncomingCallListener): void;
}

/**
 * Functionality for handling the precall expierience including call switching
 *
 * @beta
 */
export interface IncomingCallAdapterIncomingCallOperations {
  /**
   * Handler for accepting a incoming call
   */
  accept(incomingCall: IncomingCall, options?: AcceptCallOptions): Promise<Call>;
  /**
   * Handler for rejecting a incoming call
   */
  reject(incomingCall: IncomingCall): Promise<void>;
}

/**
 * Adapter for handling incoming calls
 *
 * @beta
 */
export interface IncomingCallAdapter
  extends IncomingCallAdapterSubscribers,
    IncomingCallAdapterIncomingCallOperations,
    Disposable {}
