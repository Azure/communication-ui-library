// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useContext, createContext } from 'react';
import { Call } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import { TeamsCall } from '@azure/communication-calling';
import { isACSCall } from '@internal/acs-ui-common';

/**
 * @private
 */
export type CallContextType = {
  call: Call | /* @conditional-compile-remove(teams-identity-support) */ TeamsCall | undefined;
};

/**
 * Arguments to initialize a {@link CallProvider}.
 *
 * @public
 */
export interface CallProviderProps {
  children: React.ReactNode;
  call?: Call | /* @conditional-compile-remove(teams-identity-support) */ TeamsCall;
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
  const call = useContext(CallContext)?.call;
  if (call && !isACSCall(call)) {
    throw new Error('TeamsCall object was provided, try useTeamsCall() instead');
  }
  return call;
};

/* @conditional-compile-remove(teams-identity-support) */
/**
 * Hook to obtain {@link @azure/communication-calling#TeamsCall} from the provider.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @beta
 */
export const useTeamsCall = (): undefined | /* @conditional-compile-remove(teams-identity-support) */ TeamsCall => {
  const call = useContext(CallContext)?.call;
  if (call && isACSCall(call)) {
    throw new Error('Regular ACS Call object was provided, try useCall() instead');
  }
  return call;
};
