// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAgentCommon, CallCommon, Common, isACSCall, isACSCallAgent } from '@internal/acs-ui-common';
/* @conditional-compile-remove(teams-identity-support) */
import { isTeamsCall, isTeamsCallAgent } from '@internal/acs-ui-common';
import { StatefulCallClient, StatefulDeviceManager } from '@internal/calling-stateful-client';
import { ReactElement } from 'react';
/* @conditional-compile-remove(teams-identity-support) */
import { createDefaultTeamsCallingHandlers } from './createTeamsCallHandlers';
import { createDefaultCallingHandlers } from './createHandlers';
import { CommonCallingHandlers } from './createCommonHandlers';

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
export const createDefaultCallingHandlersForComponent = <Props>(
  callClient: StatefulCallClient,
  callAgent: CallAgentCommon | undefined,
  deviceManager: StatefulDeviceManager | undefined,
  call: CallCommon | undefined,
  _Component: (props: Props) => ReactElement | null
): Common<CommonCallingHandlers, Props> => {
  /* @conditional-compile-remove(teams-identity-support) */
  if (callAgent && isTeamsCallAgent(callAgent) && (!call || (call && isTeamsCall(call)))) {
    return createDefaultTeamsCallingHandlers(callClient, callAgent, deviceManager, call);
  }
  if (callAgent && isACSCallAgent(callAgent) && (!call || (call && isACSCall(call)))) {
    return createDefaultCallingHandlers(callClient, callAgent, deviceManager, call);
  }
  throw new Error('CallAgent type and Call type are not compatible!');
};
