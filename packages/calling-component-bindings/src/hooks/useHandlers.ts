// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ReactElement, useContext } from 'react';
import { StatefulCallClient } from '@internal/calling-stateful-client';
import { createDefaultCallingHandlersForComponent } from '../handlers/createHandlers';
import { CallClientContext, useCall, useCallAgent, useDeviceManager } from '../providers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(component: (props: PropsT) => ReactElement | null) => {
  const callClient: StatefulCallClient = (useContext(CallClientContext) as any)?.callClient;
  const callAgent = useCallAgent();
  const deviceManager = useDeviceManager();
  const call = useCall();
  if (!callClient) return undefined;

  return createDefaultCallingHandlersForComponent(callClient, callAgent, deviceManager, call, component);
};
