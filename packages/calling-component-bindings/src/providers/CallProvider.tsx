// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useContext, createContext } from 'react';
import { Call } from '@azure/communication-calling';
import { TeamsCall } from '@azure/communication-calling';
import { _isACSCall, _isTeamsCall } from '@internal/calling-stateful-client';

/**
 * @private
 */
export type CallContextType = {
  call: Call | TeamsCall | undefined;
};

/**
 * Arguments to initialize a {@link CallProvider}.
 *
 * @public
 */
export interface CallProviderProps {
  children: React.ReactNode;
  call?: Call | TeamsCall;
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
 * you must have previously used the CallProvider with a Call object to use this hook
 *
 * @public
 */
export const useCall = (): Call | undefined => {
  const call = useContext(CallContext)?.call;
  if (call && !_isACSCall(call)) {
    throw new Error('Incorrect call type: Must provide a Regular Call object.');
  }
  return call;
};

/**
 * Hook to obtain {@link @azure/communication-calling#TeamsCall} from the provider.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * you must have previously used the CallProvider with a TeamsCall object to use this hook
 *
 * @public
 */
export const useTeamsCall = (): undefined | TeamsCall => {
  const call = useContext(CallContext)?.call;
  if (call && !_isTeamsCall(call)) {
    throw new Error('Incorrect call type: Must provide a TeamsCall object.');
  }
  return call;
};
