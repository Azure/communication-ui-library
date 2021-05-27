// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ReactElement } from 'react';
import { StatefulCallClient } from 'calling-stateful-client';
import { createDefaultCallingHandlersForComponent } from '../handlers/createHandlers';
import { useCall, useCallAgent, useCallClient, useDeviceManager } from '../providers';
// @ts-ignore
import { CommonProperties } from 'acs-ui-common';
// @ts-ignore
import { DefaultCallingHandlers } from '../handlers/createHandlers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(component: (props: PropsT) => ReactElement | null) => {
  const callClient: StatefulCallClient = useCallClient() as any;
  const callAgent = useCallAgent();
  const deviceManager = useDeviceManager();
  const call = useCall();

  return createDefaultCallingHandlersForComponent(callClient, callAgent, deviceManager, call, component);
};
