// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAgent } from '@azure/communication-calling';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type CallAgentContextType = {
  callAgent: CallAgent | undefined;
};

export const CallAgentContext = createContext<CallAgentContextType | undefined>(undefined);

interface CallAgentProviderProps {
  children: React.ReactNode;
  callAgent?: CallAgent;
}

const CallAgentProviderBase = (props: CallAgentProviderProps): JSX.Element => {
  const { callAgent: defaultCallAgent } = props;

  const [callAgent, setCallAgent] = useState<CallAgent | undefined>(defaultCallAgent);

  useEffect(() => {
    setCallAgent(defaultCallAgent);
  }, [defaultCallAgent, setCallAgent]);

  const initialState: CallAgentContextType = {
    callAgent
  };

  return <CallAgentContext.Provider value={initialState}>{props.children}</CallAgentContext.Provider>;
};

export const CallAgentProvider = (props: CallAgentProviderProps): JSX.Element => <CallAgentProviderBase {...props} />;

export const useCallAgent = (): CallAgent | undefined => useContext(CallAgentContext)?.callAgent;
