// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallAgent, TeamsCallAgent } from '@azure/communication-calling';
import { CallingHandlers, createDefaultCallingHandlers } from '@internal/calling-component-bindings';
import { createDefaultTeamsCallingHandlers, TeamsCallingHandlers } from '@internal/calling-component-bindings';
import {
  CallCommon,
  StatefulCallClient,
  StatefulDeviceManager,
  _isACSCall,
  _isACSCallAgent,
  _isTeamsCall,
  _isTeamsCallAgent
} from '@internal/calling-stateful-client';

import { VideoBackgroundEffectsDependency } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(DNS) */
import { DeepNoiseSuppressionEffectDependency } from '@internal/calling-component-bindings';

/**
 * @private
 */
export type CallHandlersOf<AgentType extends CallAgent | TeamsCallAgent> = AgentType extends CallAgent
  ? CallingHandlers
  : never | TeamsCallingHandlers;

/**
 * @private
 *
 * This is used to create correct handler for generic agent type
 */
export function createHandlers<AgentType extends CallAgent | TeamsCallAgent>(
  callClient: StatefulCallClient,
  callAgent: AgentType,
  deviceManager: StatefulDeviceManager | undefined,
  call: CallCommon | undefined,

  options?: {
    onResolveVideoBackgroundEffectsDependency?: () => Promise<VideoBackgroundEffectsDependency>;
    /* @conditional-compile-remove(DNS) */
    onResolveDeepNoiseSuppressionDependency?: () => Promise<DeepNoiseSuppressionEffectDependency>;
  }
): CallHandlersOf<AgentType> {
  // Call can be either undefined or ACS Call
  if (_isACSCallAgent(callAgent) && (!call || (call && _isACSCall(call)))) {
    return createDefaultCallingHandlers(
      callClient,
      callAgent,
      deviceManager,
      call,
      options
    ) as CallHandlersOf<AgentType>;
  }

  if (_isTeamsCallAgent(callAgent) && (!call || (call && _isTeamsCall(call)))) {
    return createDefaultTeamsCallingHandlers(
      callClient,
      callAgent,
      deviceManager,
      call,
      options
    ) as CallHandlersOf<AgentType>;
  }
  throw new Error('Unhandled agent type');
}
