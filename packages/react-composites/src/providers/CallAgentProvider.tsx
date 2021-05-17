// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAgent } from '@azure/communication-calling';
import { AbortSignalLike } from '@azure/core-http';
import React, { createContext, Dispatch, SetStateAction, useEffect, useRef, useState, useContext } from 'react';
import { CommunicationUiError, CommunicationUiErrorCode } from '../types/CommunicationUiError';
import { createAzureCommunicationUserCredential, getIdFromToken, useValidContext } from '../utils';
import { useCallClient } from './CallClientProvider';

export type CallAgentContextType = {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>>;
  callAgent: CallAgent | undefined;
  setCallAgent: Dispatch<SetStateAction<CallAgent | undefined>>;
};

export const CallAgentContext = createContext<CallAgentContextType | undefined>(undefined);

interface CallAgentProviderProps {
  children: React.ReactNode;
  token: string;
  displayName: string;
  refreshTokenCallback?: (abortSignal?: AbortSignalLike) => Promise<string>;
}

const CallAgentProviderBase = (props: CallAgentProviderProps): JSX.Element => {
  const { token, displayName: initialDisplayName, refreshTokenCallback } = props;

  // if there is no valid token then there is no valid userId
  const userIdFromToken = token ? getIdFromToken(token) : '';
  const [callAgent, setCallAgent] = useState<CallAgent | undefined>(undefined);
  const [userId, setUserId] = useState<string>(userIdFromToken);
  const [displayName, setDisplayName] = useState<string>(initialDisplayName);
  const refreshTokenCallbackRefContainer = useRef(refreshTokenCallback);

  const callClient = useCallClient();

  // Update the state if the props change
  useEffect(() => {
    refreshTokenCallbackRefContainer.current = refreshTokenCallback;
  }, [refreshTokenCallback]);

  useEffect(() => {
    setUserId(userIdFromToken);
  }, [userIdFromToken]);

  /**
   * Initialize the Call Agent and clean it up when the Context unmounts.
   */
  useEffect(() => {
    if (token && !callAgent) {
      const userCredential = createAzureCommunicationUserCredential(token, refreshTokenCallbackRefContainer.current);
      callClient
        .createCallAgent(userCredential, { displayName: displayName })
        .then((agent) => {
          setCallAgent(agent);
        })
        .catch((error) => {
          throw new CommunicationUiError({
            message: 'Error creating call agent',
            code: CommunicationUiErrorCode.CREATE_CALL_AGENT_ERROR,
            error: error
          });
        });
    }

    // Clean up callAgent whenever the callAgent or userTokenCredential is changed.
    // This is required because callAgent itself is a singleton.
    // We need to clean it up before creating another one.
    return () => {
      callAgent?.dispose().catch((error) => {
        throw new CommunicationUiError({
          message: 'Error disposing call agent',
          code: CommunicationUiErrorCode.DISPOSE_CALL_AGENT_ERROR,
          error: error
        });
      });
    };
  }, [callAgent, callClient, displayName, token]);

  const initialState: CallAgentContextType = {
    callAgent,
    setCallAgent,
    userId,
    setUserId,
    displayName,
    setDisplayName
  };

  return <CallAgentContext.Provider value={initialState}>{props.children}</CallAgentContext.Provider>;
};

export const CallAgentProvider = (props: CallAgentProviderProps): JSX.Element => <CallAgentProviderBase {...props} />;

export const useCallAgentContext = (): CallAgentContextType => useValidContext(CallAgentContext);
export const useCallAgent = (): CallAgent | undefined => useContext(CallAgentContext)?.callAgent;
