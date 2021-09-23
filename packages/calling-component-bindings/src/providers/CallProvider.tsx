// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useContext, createContext } from 'react';
import { Call } from '@azure/communication-calling';

/**
 * @private
 */
export type CallContextType = {
  call: Call | undefined;
};

/**
 * Arguments to initialize a {@link CallProvider}.
 *
 * @public
 */
export interface CallProviderProps {
  children: React.ReactNode;
  call?: Call;
}

/**
 * @private
 */
export const CallContext = createContext<CallContextType | undefined>(undefined);

/**
 * @private
 */
const CallProviderBase = (props: CallProviderProps): JSX.Element => {
  const { children, call } = props;

  const initialState: CallContextType = {
    call
  };

  return <CallContext.Provider value={initialState}>{children}</CallContext.Provider>;
};

/**
 * A {@link React.Context} that stores a {@link @azure/communication-calling#Call}.
 *
 * Calling components from this package must be wrapped with a {@link CallProvider}.
 *
 * @public
 */
export const CallProvider = (props: CallProviderProps): JSX.Element => <CallProviderBase {...props} />;

/**
 * Hook to obtain {@link @azure/communication-calling#Call} from the provider.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const useCall = (): Call | undefined => {
  return useContext(CallContext)?.call;
};
