// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAgent } from '@azure/communication-calling';
import React, { createContext, useContext } from 'react';

/**
 * @private
 */
export type CallAgentContextType = {
  callAgent: CallAgent | undefined;
};

/**
 * @private
 */
export const CallAgentContext = createContext<CallAgentContextType | undefined>(undefined);

/**
 * Arguments to initialize a {@link CallAgentProvider}.
 *
 * @public
 */
export interface CallAgentProviderProps {
  children: React.ReactNode;
  callAgent?: CallAgent;
}

const CallAgentProviderBase = (props: CallAgentProviderProps): JSX.Element => {
  const { callAgent } = props;

  const initialState: CallAgentContextType = {
    callAgent
  };

  return <CallAgentContext.Provider value={initialState}>{props.children}</CallAgentContext.Provider>;
};

/**
 * A {@link React.Context} that stores a {@link @azure/communication-calling#CallAgent}.
 *
 * Calling components from this package must be wrapped with a {@link CallAgentProvider}.
 *
 * @public
 */
export const CallAgentProvider = (props: CallAgentProviderProps): JSX.Element => <CallAgentProviderBase {...props} />;

/**
 * @private
 */
export const useCallAgent = (): CallAgent | undefined => useContext(CallAgentContext)?.callAgent;
