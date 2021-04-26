// © Microsoft Corporation. All rights reserved.

import { ChatThreadClient } from '@azure/communication-chat';
import { Spinner } from '@fluentui/react';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import React, { Dispatch, SetStateAction, createContext, useContext, useState, useEffect } from 'react';
import { ErrorHandlingProps } from './ErrorProvider';
import {
  CommunicationUiErrorCode,
  CommunicationUiErrorFromError,
  CommunicationUiError
} from '../types/CommunicationUiError';
import { useChatClient } from './ChatProviderHelper';

export type ThreadProviderContextType = {
  chatThreadClient?: ChatThreadClient;
  setChatThreadClient: Dispatch<SetStateAction<ChatThreadClient | undefined>>;
  threadId: string;
  setThreadId: Dispatch<SetStateAction<string>>;
};

let contextState: ThreadProviderContextType;

export const getThreadContextState = (): ThreadProviderContextType => {
  return contextState;
};

export const ThreadContext = createContext<ThreadProviderContextType | undefined>(undefined);

const CHATTHREADPROVIDER_LOADING_STATE = 1;
const CHATTHREADPROVIDER_LOADED_STATE = 2;

type ChatThreadProviderProps = {
  children: React.ReactNode;
  threadId: string;
};

const ChatThreadProviderBase = (props: ChatThreadProviderProps & ErrorHandlingProps): JSX.Element => {
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient | undefined>();
  const [threadId, setThreadId] = useState<string>(props.threadId);
  const [chatThreadProviderState, setChatThreadProviderState] = useState<number>(CHATTHREADPROVIDER_LOADING_STATE);

  contextState = {
    chatThreadClient,
    setChatThreadClient,
    threadId,
    setThreadId
  };

  const chatClient = useChatClient();
  useEffect(() => {
    const setupChatThreadProvider = async (): Promise<void> => {
      try {
        const newChatThreadClient = await chatClient.getChatThreadClient(threadId);
        setChatThreadClient(newChatThreadClient);
        setChatThreadProviderState(CHATTHREADPROVIDER_LOADED_STATE);
      } catch (error) {
        throw new CommunicationUiError({
          message: 'Error creating chat thread client',
          code: CommunicationUiErrorCode.CREATE_CHAT_THREAD_CLIENT_ERROR,
          error: error
        });
      }
    };
    setupChatThreadProvider().catch((error) => {
      if (props.onErrorCallback) {
        props.onErrorCallback(CommunicationUiErrorFromError(error));
      } else {
        throw error;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Note its important to wait until chatThreadClient is set up before allowing children to render else we'll get
  // errors from children trying to use an undefined chatThreadClient
  if (chatThreadProviderState === CHATTHREADPROVIDER_LOADING_STATE) {
    return <Spinner label={'Loading...'} ariaLive="assertive" labelPosition="top" />;
  } else if (chatThreadProviderState === CHATTHREADPROVIDER_LOADED_STATE) {
    return <ThreadContext.Provider value={contextState}>{props.children}</ThreadContext.Provider>;
  } else {
    throw new CommunicationUiError({
      message: 'ChatThreadProviderState ' + chatThreadProviderState.toString() + ' is invalid',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
};

export const ChatThreadProvider = (props: ChatThreadProviderProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(ChatThreadProviderBase, props);

const useValidateAndGetThreadContext = (): ThreadProviderContextType => {
  const threadContext = useContext<ThreadProviderContextType | undefined>(ThreadContext);
  if (!threadContext) {
    throw new CommunicationUiError({
      message: 'ChatThreadProvider context not initialized',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  return threadContext;
};

export const useChatThreadClient = (): ChatThreadClient | undefined => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.chatThreadClient;
};

export const useThreadId = (): string => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.threadId;
};

export const useSetThreadId = (): ((threadId: string) => void) => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.setThreadId;
};
