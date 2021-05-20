// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StatefulCallClient, StatefulDeviceManager } from 'calling-stateful-client';
import React, { createContext, useEffect, useState } from 'react';
import { CommunicationUiError, CommunicationUiErrorCode } from '../types/CommunicationUiError';
import { useValidContext } from '../utils';

export type CallClientContextType = {
  statefulCallClient: StatefulCallClient;
  deviceManager: StatefulDeviceManager | undefined;
};

export const CallClientContext = createContext<CallClientContextType | undefined>(undefined);

interface CallClientProvider {
  children: React.ReactNode;
  statefulCallClient: StatefulCallClient;
}

const CallClientProviderBase = (props: CallClientProvider): JSX.Element => {
  const { statefulCallClient: defaultStatefulCallClient } = props;

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>(defaultStatefulCallClient);
  const [deviceManager, setDeviceManager] = useState<StatefulDeviceManager | undefined>(undefined);

  /**
   * Update the statefulCallClient based on the new defaultStatefulCallClient
   */
  useEffect(() => {
    setStatefulCallClient(defaultStatefulCallClient);
  }, [defaultStatefulCallClient]);

  /**
   * Initialize the DeviceManager inside CallClientState
   */
  useEffect(() => {
    statefulCallClient
      .getDeviceManager()
      .then((manager) => {
        manager.getCameras();
        manager.getMicrophones();
        manager.getSpeakers();
        setDeviceManager(manager as StatefulDeviceManager);
      })
      .catch((error) => {
        throw new CommunicationUiError({
          message: 'Error creating device manager',
          code: CommunicationUiErrorCode.CREATE_DEVICE_MANAGER_ERROR,
          error: error
        });
      });
  }, [statefulCallClient]);

  const initialState: CallClientContextType = {
    statefulCallClient,
    deviceManager
  };

  return <CallClientContext.Provider value={initialState}>{props.children}</CallClientContext.Provider>;
};

export const CallClientProvider = (props: CallClientProvider): JSX.Element => <CallClientProviderBase {...props} />;

export const useCallClient = (): StatefulCallClient => {
  return useValidContext(CallClientContext).statefulCallClient;
};

export const useDeviceManager = (): StatefulDeviceManager | undefined => {
  return useValidContext(CallClientContext).deviceManager;
};
