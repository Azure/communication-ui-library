// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ReactElement, useContext } from 'react';
import {
  StatefulCallClient,
  _isACSCall,
  _isACSCallAgent,
  _isTeamsCall,
  _isTeamsCallAgent
} from '@internal/calling-stateful-client';
import { createDefaultCallingHandlersForComponent } from '../handlers/createDefaultCallingHandlersForComponent';
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
  if (callAgent && _isTeamsCallAgent(callAgent)) {
    if (call && !_isTeamsCall(call)) {
      throw new Error('A TeamsCall must be provided when callAgent is TeamsCallAgent');
    }
  }

  if (callAgent && _isACSCallAgent(callAgent)) {
    if (call && !_isACSCall(call)) {
      throw new Error('A regular ACS Call must be provided when callAgent is regular CallAgent');
    }
  }

  return createDefaultCallingHandlersForComponent(callClient, callAgent, deviceManager, call, component);
};
