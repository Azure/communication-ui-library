// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAgent } from '@azure/communication-calling';
import { CallingHandlers, createDefaultCallingHandlers } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(teams-identity-support)) */
import { createDefaultTeamsCallingHandlers, TeamsCallingHandlers } from '@internal/calling-component-bindings';
import {
  CallCommon,
  StatefulCallClient,
  StatefulDeviceManager,
  TeamsCallAgent,
  _isACSCall,
  _isACSCallAgent,
  _isTeamsCall,
  _isTeamsCallAgent
} from '@internal/calling-stateful-client';

/**
 * @private
 */
export type CallHandlersOf<AgentType extends CallAgent | TeamsCallAgent> = AgentType extends CallAgent
  ? CallingHandlers
  : never | /* @conditional-compile-remove(teams-identity-support) */ TeamsCallingHandlers;

/**
 * @private
 *
 * This is used to create correct handler for generic agent type
 */
export const createHandlers = <AgentType extends CallAgent | TeamsCallAgent>(
  callClient: StatefulCallClient,
  callAgent: AgentType,
  deviceManager: StatefulDeviceManager | undefined,
  call: CallCommon | undefined
): CallHandlersOf<AgentType> => {
  // Call can be either undefined or ACS Call
  if (_isACSCallAgent(callAgent) && (!call || (call && _isACSCall(call)))) {
    return createDefaultCallingHandlers(callClient, callAgent, deviceManager, call) as CallHandlersOf<AgentType>;
  }

  /* @conditional-compile-remove(teams-identity-support) */
  if (_isTeamsCallAgent(callAgent) && (!call || (call && _isTeamsCall(call)))) {
    return createDefaultTeamsCallingHandlers(callClient, callAgent, deviceManager, call) as CallHandlersOf<AgentType>;
  }
  throw new Error('Unhandled agent type');
};
