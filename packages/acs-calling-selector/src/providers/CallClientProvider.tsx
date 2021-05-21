// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StatefulCallClient, StatefulDeviceManager } from 'calling-stateful-client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type CallClientContextType = {
  statefulCallClient: StatefulCallClient;
  deviceManager: StatefulDeviceManager | undefined;
};

export const CallClientContext = createContext<CallClientContextType | undefined>(undefined);

export interface CallClientProviderProps {
  children: React.ReactNode;
  statefulCallClient: StatefulCallClient;
}

const CallClientProviderBase = (props: CallClientProviderProps): JSX.Element => {
  const { statefulCallClient } = props;

  const [deviceManager, setDeviceManager] = useState<StatefulDeviceManager | undefined>(undefined);

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
        throw new Error(error);
      });
  }, [statefulCallClient]);

  const initialState: CallClientContextType = {
    statefulCallClient,
    deviceManager
  };

  return <CallClientContext.Provider value={initialState}>{props.children}</CallClientContext.Provider>;
};

export const CallClientProvider = (props: CallClientProviderProps): JSX.Element => (
  <CallClientProviderBase {...props} />
);

export const useCallClient = (): StatefulCallClient => {
  const context = useContext(CallClientContext);
  if (context === undefined) {
    throw new Error('CallClient Context is undefined');
  }
  return context.statefulCallClient;
};

export const useDeviceManager = (): StatefulDeviceManager | undefined => {
  return useContext(CallClientContext)?.deviceManager;
};
