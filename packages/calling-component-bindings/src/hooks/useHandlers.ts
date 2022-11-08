// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ReactElement, useContext } from 'react';
import { StatefulCallClient } from '@internal/calling-stateful-client';
import { isACSCall, isACSCallAgent } from '@internal/acs-ui-common';
import { createDefaultCallingHandlersForComponent } from '../handlers/createHandlers';
import { CallAgentContext, CallClientContext, CallContext, useDeviceManager } from '../providers';

/**
 * Hook to obtain a handler for a specified component.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(component: (props: PropsT) => ReactElement | null) => {
  const callClient: StatefulCallClient = (useContext(CallClientContext) as any)?.callClient;
  const deviceManager = useDeviceManager();
  const call = useContext(CallContext)?.call;
  const callAgent = useContext(CallAgentContext)?.callAgent;
  if (!callClient) {
    return undefined;
  }

  // Handle edge case, validate if call and callAgent are the same type (ACS/Teams)
  if (callAgent && !isACSCallAgent(callAgent)) {
    if (call && isACSCall(call)) {
      throw new Error('A TeamsCall must be provided when callAgent is TeamsCallAgent');
    }
  }

  if (callAgent && isACSCallAgent(callAgent)) {
    if (call && !isACSCall(call)) {
      throw new Error('A regular ACS Call must be provided when callAgent is regular CallAgent');
    }
  }

  return createDefaultCallingHandlersForComponent(callClient, callAgent, deviceManager, call, component);
};
