// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DeclarativeCallClient } from '@azure/acs-calling-declarative';
import { createDefaultCallingHandlersForComponent } from '@azure/acs-calling-selector';

import { useCallClient, useCallingContext, useDeviceManager, useCall } from 'react-composites';

import { ReactElement } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(component: (props: PropsT) => ReactElement | null) => {
  const callClient: DeclarativeCallClient = useCallClient() as any;
  const callAgent = useCallingContext().callAgent;
  const deviceManager = useDeviceManager();
  const call = useCall();

  return createDefaultCallingHandlersForComponent(callClient, callAgent, deviceManager, call, component);
};
