// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StatefulCallClient, StatefulDeviceManager } from '@internal/calling-stateful-client';
import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * @private
 */
export type CallClientContextType = {
  callClient: StatefulCallClient;
  deviceManager: StatefulDeviceManager | undefined;
};

/**
 * @private
 */
export const CallClientContext = createContext<CallClientContextType | undefined>(undefined);

/**
 * Arguments to initialize a {@link CallClientProvider}.
 *
 * @public
 */
export interface CallClientProviderProps {
  children: React.ReactNode;
  callClient: StatefulCallClient;
}

/**
 * @private
 */
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

/**
 * A {@link React.Context} that stores a {@link StatefulCallClient}.
 *
 * Calling components from this package must be wrapped with a {@link CallClientProvider}.
 *
 * @public
 */
export const CallClientProvider = (props: CallClientProviderProps): JSX.Element => (
  <CallClientProviderBase {...props} />
);

/**
 * @private
 */
export const useCallClient = (): StatefulCallClient => {
  const context = useContext(CallClientContext);
  if (context === undefined) {
    throw new Error('CallClient Context is undefined');
  }
  return context.callClient;
};

/**
 * @private
 */
export const useDeviceManager = (): StatefulDeviceManager | undefined => {
  return useContext(CallClientContext)?.deviceManager;
};
