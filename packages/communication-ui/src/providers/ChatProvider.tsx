// © Microsoft Corporation. All rights reserved.

import React, { useContext, useState, useEffect } from 'react';

import { ChatClient } from '@azure/communication-chat';
import { chatClientDeclaratify } from '@azure/acs-chat-declarative';
import { ChatThreadProvider } from './ChatThreadProvider';
import { AbortSignalLike } from '@azure/core-http';
import { createAzureCommunicationUserCredential } from '../utils';
import { Spinner } from '@fluentui/react';
import { getIdFromToken } from '../utils';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { ErrorHandlingProps } from './ErrorProvider';
import {
  CommunicationUiErrorCode,
  CommunicationUiErrorFromError,
  CommunicationUiError
} from '../types/CommunicationUiError';
import { ChatContext, ChatContextType } from './ChatProviderHelper';

let contextState: ChatContextType;

export const getChatContextState = (): ChatContextType => {
  return contextState;
};

const CHATPROVIDER_LOADING_STATE = 1;
const CHATPROVIDER_LOADED_STATE = 2;

type ChatProviderProps = {
  children: React.ReactNode;
  token: string;
  displayName: string;
  threadId: string;
  endpointUrl: string;
  refreshTokenCallback?: (abortSignal?: AbortSignalLike) => Promise<string>;
};

/**
 * ChatProvider requires valid token, userId (ACS communication userId), displayName, threadId, and endpointUrl. Its
 * expected that threadId is already created and user is already added to the thread.
 *
 * @param props
 */
const ChatProviderBase = (props: ChatProviderProps & ErrorHandlingProps): JSX.Element => {
  const { token } = props;
  const idFromToken = getIdFromToken(token);
  const [userId, setUserId] = useState<string>(idFromToken);
  const [displayName, setDisplayName] = useState<string>(props.displayName);
  const [chatClient, setChatClient] = useState<ChatClient>(
    chatClientDeclaratify(
      new ChatClient(props.endpointUrl, createAzureCommunicationUserCredential(token, props.refreshTokenCallback)),
      { userId, displayName }
    )
  );
  const [chatProviderState, setChatProviderState] = useState<number>(CHATPROVIDER_LOADING_STATE);

  useEffect(() => {
    const setupChatProvider = async (): Promise<void> => {
      try {
        await chatClient.startRealtimeNotifications();
        setChatProviderState(CHATPROVIDER_LOADED_STATE);
      } catch (error) {
        throw new CommunicationUiError({
          message: 'Error starting realtime notifications',
          code: CommunicationUiErrorCode.START_REALTIME_NOTIFICATIONS_ERROR,
          error: error
        });
      }
    };
    setupChatProvider().catch((error) => {
      if (props.onErrorCallback) {
        props.onErrorCallback(CommunicationUiErrorFromError(error));
      } else {
        throw error;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  contextState = {
    chatClient,
    setChatClient,
    userId,
    setUserId,
    displayName,
    setDisplayName
  };

  // We wait until realtime notifications are set up to avoid any potential bugs where code is relying on notifications
  if (chatProviderState === CHATPROVIDER_LOADING_STATE) {
    return <Spinner label={'Loading...'} ariaLive="assertive" labelPosition="top" />;
  } else if (chatProviderState === CHATPROVIDER_LOADED_STATE) {
    return (
      <ChatContext.Provider value={contextState}>
        <ChatThreadProvider threadId={props.threadId}>{props.children}</ChatThreadProvider>
      </ChatContext.Provider>
    );
  } else {
    throw new CommunicationUiError({
      message: 'ChatProviderState ' + chatProviderState.toString() + ' is invalid',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
};

export const ChatProvider = (props: ChatProviderProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(ChatProviderBase, props);

export const useSetChatClient = (): ((chatClient: ChatClient) => void) => {
  const chatContext = useContext<ChatContextType | undefined>(ChatContext);
  if (chatContext === undefined) {
    throw new CommunicationUiError({
      message: 'UseSetChatClient invoked when ChatContext not initialized',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  return chatContext.setChatClient;
};

export const useUserId = (): string => {
  const chatContext = useContext<ChatContextType | undefined>(ChatContext);
  if (chatContext === undefined) {
    throw new CommunicationUiError({
      message: 'UseUserId invoked when ChatContext not initialized',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  return chatContext.userId;
};

export const useDisplayName = (): string => {
  const chatContext = useContext<ChatContextType | undefined>(ChatContext);
  if (chatContext === undefined) {
    throw new CommunicationUiError({
      message: 'UseDisplayName invoked when ChatContext not initialized',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  return chatContext.displayName;
};
