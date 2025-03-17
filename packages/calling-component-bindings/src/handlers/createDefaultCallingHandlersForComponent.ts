// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _isTeamsCall, _isTeamsCallAgent } from '@internal/calling-stateful-client';
import { Common } from '@internal/acs-ui-common';
import {
  StatefulCallClient,
  StatefulDeviceManager,
  CallAgentCommon,
  CallCommon,
  _isACSCall,
  _isACSCallAgent
} from '@internal/calling-stateful-client';
import { ReactElement } from 'react';

import { createDefaultTeamsCallingHandlers } from './createTeamsCallHandlers';
import { createDefaultCallingHandlers } from './createHandlers';
import { CommonCallingHandlers } from './createCommonHandlers';
import { MediaClient, MediaSessionAgent, MediaStreamSession } from '@skype/spool-sdk';

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
  mediaClient: MediaClient | undefined,
  mediaSessionAgent: MediaSessionAgent | undefined,
  mediaStreamSession: MediaStreamSession | undefined,
  _Component: (props: Props) => ReactElement | null
): Common<CommonCallingHandlers, Props> => {
  if (mediaClient || (!callAgent && !call && !deviceManager)) {
    return createDefaultCallingHandlers(
      callClient,
      callAgent,
      deviceManager,
      call,
      mediaClient,
      mediaSessionAgent,
      mediaStreamSession
    );
  }

  if (callAgent && _isTeamsCallAgent(callAgent) && (!call || (call && _isTeamsCall(call)))) {
    return createDefaultTeamsCallingHandlers(callClient, callAgent, deviceManager, call);
  }
  if (callAgent && _isACSCallAgent(callAgent) && (!call || (call && _isACSCall(call)))) {
    return createDefaultCallingHandlers(
      callClient,
      callAgent,
      deviceManager,
      call,
      mediaClient,
      mediaSessionAgent,
      mediaStreamSession
    );
  }
  throw new Error('CallAgent type and Call type are not compatible!');
};
