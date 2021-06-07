// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useContext, createContext } from 'react';
import { Call } from '@azure/communication-calling';

export type CallContextType = {
  call: Call | undefined;
};

export interface CallProviderProps {
  children: React.ReactNode;
  call?: Call;
}

export const CallContext = createContext<CallContextType | undefined>(undefined);

const CallProviderBase = (props: CallProviderProps): JSX.Element => {
  const { children, call } = props;

  const initialState: CallContextType = {
    call
  };

  return <CallContext.Provider value={initialState}>{children}</CallContext.Provider>;
};

export const CallProvider = (props: CallProviderProps): JSX.Element => <CallProviderBase {...props} />;

export const useCall = (): Call | undefined => {
  return useContext(CallContext)?.call;
};
