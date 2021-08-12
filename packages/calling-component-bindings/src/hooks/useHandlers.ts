// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ReactElement, useContext } from 'react';
import { StatefulCallClient } from '@internal/calling-stateful-client';
import {
  createDefaultCallingHandlersForComponent,
  createDefaultCallingHandlersForParticipantButton
} from '../handlers/createHandlers';
import { CallClientContext, useCall, useCallAgent, useDeviceManager } from '../providers';
import { ParticipantsButton, ParticipantsButtonProps } from '@internal/react-components';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(component: (props: PropsT | ParticipantsButtonProps) => ReactElement | null) => {
  const callClient: StatefulCallClient = (useContext(CallClientContext) as any)?.callClient;
  const callAgent = useCallAgent();
  const deviceManager = useDeviceManager();
  const call = useCall();
  if (!callClient) return undefined;

  switch (component) {
    case ParticipantsButton:
      return createDefaultCallingHandlersForParticipantButton(callClient, callAgent, deviceManager, call, component);
    default:
      return createDefaultCallingHandlersForComponent(callClient, callAgent, deviceManager, call, component);
  }
};
