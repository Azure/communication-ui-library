// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StatefulCallClient, StatefulDeviceManager } from 'calling-stateful-client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type CallClientContextType = {
  callClient: StatefulCallClient;
  deviceManager: StatefulDeviceManager | undefined;
};

export const CallClientContext = createContext<CallClientContextType | undefined>(undefined);

export interface CallClientProviderProps {
  children: React.ReactNode;
  callClient: StatefulCallClient;
}

const CallClientProviderBase = (props: CallClientProviderProps): JSX.Element => {
  const { callClient } = props;

  const [deviceManager, setDeviceManager] = useState<StatefulDeviceManager | undefined>(undefined);

  /**
   * Initialize the DeviceManager inside CallClientState
   */
  useEffect(() => {
    callClient
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
  }, [callClient]);

  const initialState: CallClientContextType = {
    callClient,
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
  return context.callClient;
};

export const useDeviceManager = (): StatefulDeviceManager | undefined => {
  return useContext(CallClientContext)?.deviceManager;
};
