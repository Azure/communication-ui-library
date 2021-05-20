// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useContext, createContext, useState, useEffect } from 'react';
import { Call } from '@azure/communication-calling';
import { useValidContext } from '../utils';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { ErrorHandlingProps } from './ErrorProvider';

export type CallContextType = {
  call: Call | undefined;
};

export interface CallProviderProps {
  children: React.ReactNode;
  call?: Call;
}

export const CallContext = createContext<CallContextType | undefined>(undefined);

const CallProviderBase = (props: CallProviderProps): JSX.Element => {
  const { children, call: defaultCall } = props;

  const [call, setCall] = useState<Call | undefined>(defaultCall);

  useEffect(() => {
    setCall(defaultCall);
  }, [defaultCall]);

  const initialState: CallContextType = {
    call
  };

  return <CallContext.Provider value={initialState}>{children}</CallContext.Provider>;
};

export const CallProvider = (props: CallProviderProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(CallProviderBase, props);

export const useCallContext = (): CallContextType => useValidContext(CallContext);

export const useCall = (): Call | undefined => {
  return useContext(CallContext)?.call;
};
