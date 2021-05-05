// © Microsoft Corporation. All rights reserved.

import { DeclarativeCallClient } from '@azure/acs-calling-declarative';
import { createDefaultHandlersForComponent } from '@azure/acs-calling-selector';

import { useCallClient, useCallingContext, useDeviceManager, useCall } from '@azure/communication-ui';

import { ReactElement } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(component: (props: PropsT) => ReactElement | null) => {
  const callClient: DeclarativeCallClient = useCallClient() as any;
  const callAgent = useCallingContext().callAgent;
  const videoDeviceInfo = useCallingContext().videoDeviceInfo;
  const deviceManager = useDeviceManager();
  const call = useCall();

  return createDefaultHandlersForComponent(callClient, callAgent, deviceManager, call, videoDeviceInfo, component);
};
