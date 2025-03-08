// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MediaSessionAgent } from '@skype/spool-sdk';
import React, { createContext, useContext } from 'react';

/**
 * @private
 */
export type MediaSessionAgentContextType = {
  mediaSessionAgent: MediaSessionAgent | undefined;
};

/**
 * @private
 */
export const MediaSessionAgentContext = createContext<MediaSessionAgentContextType | undefined>(undefined);

/**
 * Arguments to initialize a {@link MediaSessionAgentProvider}.
 *
 * @public
 */
export interface MediaSessionAgentProviderProps {
  children: React.ReactNode;
  mediaSessionAgent?: MediaSessionAgent;
}

const MediaSessionAgentProviderBase = (props: MediaSessionAgentProviderProps): JSX.Element => {
  const { mediaSessionAgent } = props;

  const initialState: MediaSessionAgentContextType = {
    mediaSessionAgent
  };

  return <MediaSessionAgentContext.Provider value={initialState}>{props.children}</MediaSessionAgentContext.Provider>;
};

/**
 * A {@link React.Context} that stores a {@link @azure/communication-calling#MediaSessionAgent}.
 *
 * Calling components from this package must be wrapped with a {@link MediaSessionAgentProvider}.
 *
 * @public
 */
export const MediaSessionAgentProvider = (props: MediaSessionAgentProviderProps): JSX.Element => (
  <MediaSessionAgentProviderBase {...props} />
);

/**
 * Hook to obtain {@link @azure/communication-calling#MediaSessionAgent} from the provider.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const useMediaSessionAgent = (): MediaSessionAgent | undefined => {
  return useContext(MediaSessionAgentContext)?.mediaSessionAgent;
};
