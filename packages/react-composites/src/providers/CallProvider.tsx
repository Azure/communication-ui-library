// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useContext, createContext, useState, Dispatch, SetStateAction } from 'react';
import { Call } from '@azure/communication-calling';
import { useValidContext } from '../utils';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { ErrorHandlingProps } from './ErrorProvider';

export type CallContextType = {
  call: Call | undefined;
  setCall: Dispatch<SetStateAction<Call | undefined>>;
};

export interface CallProvider {
  children: React.ReactNode;
}

export const CallContext = createContext<CallContextType | undefined>(undefined);

const CallProviderBase = (props: CallProvider): JSX.Element => {
  const { children } = props;

  const [call, setCall] = useState<Call | undefined>(undefined);

  const initialState: CallContextType = {
    call,
    setCall
  };

  return <CallContext.Provider value={initialState}>{children}</CallContext.Provider>;
};

export const CallProvider = (props: CallProvider & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(CallProviderBase, props);

export const useCallContext = (): CallContextType => useValidContext(CallContext);

export const useCall = (): Call | undefined => {
  return useContext(CallContext)?.call;
};
