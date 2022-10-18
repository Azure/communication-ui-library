// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, CallAgent } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-call) */
import { TeamsCall, TeamsCallAgent } from '@azure/communication-calling';
/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
/* @conditional-compile-remove(PSTN-calls) */
/* @conditional-compile-remove(PSTN-calls) */
import { Common } from '@internal/acs-ui-common';
import { StatefulCallClient, StatefulDeviceManager } from '@internal/calling-stateful-client';
import memoizeOne from 'memoize-one';
import { ReactElement } from 'react';
/* @conditional-compile-remove(teams-call) */
import { createDefaultTeamsCallingHandlers, TeamsCallingHandlers } from './createTeamsCallHandlers';
import { CallingHandlers, createDefaultACSCallingHandlers } from './createACSCallHandlers';

/**
 * @internal
 */
export type CallTypeOf<AgentType extends TeamsCallAgent | CallAgent> = AgentType extends CallAgent
  ? Call
  : never | /* @conditional-compile-remove(teams-call) */ TeamsCall; // remove "never" type when move to stable

/**
 * @internal
 */
export type CallHandlersOf<AgentType extends TeamsCallAgent | CallAgent> = AgentType extends CallAgent
  ? CallingHandlers
  : never | /* @conditional-compile-remove(teams-call) */ TeamsCallingHandlers; // remove "never" type when move to stable

/**
 * @private
 */
export const isACSCallAgent = (
  callAgent: CallAgent | /* @conditional-compile-remove(teams-call) */ TeamsCallAgent
): callAgent is CallAgent => {
  return callAgent.kind === 'CallAgent';
};

/**
 * @private
 */
export const isACSCall = (call: Call | /* @conditional-compile-remove(teams-call) */ TeamsCall): call is Call => {
  return call.kind === 'TeamsCall';
};

/**
 * @public
 */
export const createDefaultCallingHandlers = memoizeOne(
  <AgentType extends /* @conditional-compile-remove(teams-call) */ TeamsCallAgent | CallAgent = CallAgent>(
    callClient: StatefulCallClient,
    callAgent: AgentType | undefined,
    deviceManager: StatefulDeviceManager | undefined,
    call: CallTypeOf<AgentType> | undefined
  ): CallHandlersOf<AgentType> => {
    /* @conditional-compile-remove(teams-call) */
    if (callAgent && !isACSCallAgent(callAgent) && (!call || (call && !isACSCall(call)))) {
      return createDefaultTeamsCallingHandlers(callClient, callAgent, deviceManager, call) as any;
    }
    if (callAgent && isACSCallAgent(callAgent) && (!call || (call && isACSCall(call)))) {
      return createDefaultACSCallingHandlers(callClient, callAgent, deviceManager, call) as any;
    }
    throw new Error('CallAgent type and Call type are not compatible!');
  }
);

/**
 * Create a set of default handlers for given component. Memoization is applied to the result. Multiple invocations with
 * the same arguments will return the same handler instances. DeclarativeCallAgent, DeclarativeDeviceManager, and
 * DeclarativeCall may be undefined. If undefined, their associated handlers will not be created and returned.
 *
 * @param callClient - StatefulCallClient returned from
 *   {@link @azure/communication-react#createStatefulCallClient}.
 * @param callAgent - Instance of {@link @azure/communication-calling#CallClient}.
 * @param deviceManager - Instance of {@link @azure/communication-calling#DeviceManager}.
 * @param call - Instance of {@link @azure/communication-calling#Call}.
 * @param _ - React component that you want to generate handlers for.
 *
 * @public
 */
export const createDefaultCallingHandlersForComponent = <
  Props,
  AgentType extends CallAgent | /* @conditional-compile-remove(teams-call) */ TeamsCallAgent = CallAgent
>(
  callClient: StatefulCallClient,
  callAgent: AgentType | undefined,
  deviceManager: StatefulDeviceManager | undefined,
  call: CallTypeOf<AgentType> | undefined,
  _Component: (props: Props) => ReactElement | null
): Common<CallHandlersOf<AgentType>, Props> => {
  return createDefaultCallingHandlers(callClient, callAgent, deviceManager, call);
};
