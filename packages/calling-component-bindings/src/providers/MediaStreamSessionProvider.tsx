// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useContext, createContext } from 'react';
import { MediaStreamSession } from '@skype/spool-sdk';

/** @private */
export type MediaStreamSessionContextType = {
  session: MediaStreamSession | undefined;
};

/**
 * Arguments to initialize a {@link MediaStreamSessionProvider}.
 *
 * @public
 */
export interface MediaStreamSessionProviderProps {
  children: React.ReactNode;
  session?: MediaStreamSession;
}

/**
 * @private
 */
export const MediaStreamSessionContext = createContext<MediaStreamSessionContextType | undefined>(undefined);

/**
 * @private
 */
const MediaStreamSessionProviderBase = (props: MediaStreamSessionProviderProps): JSX.Element => {
  const { children, session } = props;

  const initialState: MediaStreamSessionContextType = {
    session
  };

  return <MediaStreamSessionContext.Provider value={initialState}>{children}</MediaStreamSessionContext.Provider>;
};

/**
 * A {@link React.Context} that stores a {@link @azure/communication-calling#MediaStreamSession}.
 *
 * Calling components from this package must be wrapped with a {@link MediaStreamSessionProvider}.
 *
 * @public
 */
export const MediaStreamSessionProvider = (props: MediaStreamSessionProviderProps): JSX.Element => (
  <MediaStreamSessionProviderBase {...props} />
);

/**
 * Hook to obtain {@link @azure/communication-calling#MediaStreamSession} from the provider.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * you must have previously used the MediaStreamSessionProvider with a Session object to use this hook
 *
 * @public
 */
export const useMediaStreamSession = (): MediaStreamSession | undefined => {
  const session = useContext(MediaStreamSessionContext)?.session;
  return session;
};
