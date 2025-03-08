// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatefulDeviceManager, StatefulMediaClient } from '@internal/calling-stateful-client';
import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * @private
 */
export type MediaClientContextType = {
  mediaClient: StatefulMediaClient;
  deviceManager: StatefulDeviceManager | undefined;
};

/**
 * @private
 */
export const MediaClientContext = createContext<MediaClientContextType | undefined>(undefined);

/**
 * Arguments to initialize a {@link MediaClientProvider}.
 *
 * @public
 */
export interface MediaClientProviderProps {
  children: React.ReactNode;
  mediaClient: StatefulMediaClient;
}

/**
 * @private
 */
const MediaClientProviderBase = (props: MediaClientProviderProps): JSX.Element => {
  const { mediaClient } = props;

  const [deviceManager, setDeviceManager] = useState<StatefulDeviceManager | undefined>(undefined);

  /**
   * Initialize the DeviceManager inside MediaClientState
   */
  useEffect(() => {
    mediaClient
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
  }, [mediaClient]);

  const initialState: MediaClientContextType = {
    mediaClient,
    deviceManager
  };

  return <MediaClientContext.Provider value={initialState}>{props.children}</MediaClientContext.Provider>;
};

/**
 * A {@link React.Context} that stores a {@link StatefulMediaClient}.
 *
 * Calling components from this package must be wrapped with a {@link MediaClientProvider}.
 *
 * @public
 */
export const MediaClientProvider = (props: MediaClientProviderProps): JSX.Element => (
  <MediaClientProviderBase {...props} />
);

/**
 * Hook to obtain {@link StatefulMediaClient} from the provider.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const useMediaClient = (): StatefulMediaClient => {
  const context = useContext(MediaClientContext);
  if (context === undefined) {
    throw new Error('MediaClient Context is undefined');
  }
  return context.mediaClient;
};
