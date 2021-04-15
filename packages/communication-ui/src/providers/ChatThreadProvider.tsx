// © Microsoft Corporation. All rights reserved.

import {
  ChatMessage,
  ChatThread,
  ChatThreadClient,
  ChatParticipant,
  ChatMessageReadReceipt
} from '@azure/communication-chat';
import { Spinner } from '@fluentui/react';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import React, { Dispatch, SetStateAction, createContext, useContext, useState, useEffect } from 'react';
import { useChatClient } from './ChatProviderHelper';
import { ErrorHandlingProps } from './ErrorProvider';
import {
  CommunicationUiErrorCode,
  CommunicationUiErrorFromError,
  CommunicationUiError
} from '../types/CommunicationUiError';

export type ThreadProviderContextType = {
  chatThreadClient?: ChatThreadClient;
  setChatThreadClient: Dispatch<SetStateAction<ChatThreadClient | undefined>>;
  chatMessages?: ChatMessage[];
  setChatMessages: Dispatch<SetStateAction<ChatMessage[] | undefined>>;
  threadId: string;
  setThreadId: Dispatch<SetStateAction<string>>;
  thread: ChatThread | undefined;
  setThread: Dispatch<SetStateAction<ChatThread | undefined>>;
  receipts: ChatMessageReadReceipt[] | undefined;
  setReceipts: Dispatch<SetStateAction<ChatMessageReadReceipt[] | undefined>>;
  threadMembers: ChatParticipant[];
  setThreadMembers: Dispatch<SetStateAction<ChatParticipant[]>>;
  coolPeriod: Date | undefined;
  setCoolPeriod: Dispatch<SetStateAction<Date | undefined>>;
  getThreadMembersError: boolean | undefined;
  setGetThreadMembersError: Dispatch<SetStateAction<boolean | undefined>>;
  updateThreadMembersError: boolean | undefined;
  setUpdateThreadMembersError: Dispatch<SetStateAction<boolean | undefined>>;
  failedMessageIds: string[];
  setFailedMessageIds: Dispatch<SetStateAction<string[]>>;
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[] | undefined>(undefined);
  const [threadId, setThreadId] = useState<string>(props.threadId);
  const [thread, setThread] = useState<ChatThread | undefined>(undefined);
  const [receipts, setReceipts] = useState<ChatMessageReadReceipt[] | undefined>(undefined);
  const [threadMembers, setThreadMembers] = useState<ChatParticipant[]>([]);
  const [getThreadMembersError, setGetThreadMembersError] = useState<boolean | undefined>(undefined);
  const [updateThreadMembersError, setUpdateThreadMembersError] = useState<boolean | undefined>(undefined);
  const [coolPeriod, setCoolPeriod] = useState<Date>();
  const [failedMessageIds, setFailedMessageIds] = useState<string[]>([]);
  const [chatThreadProviderState, setChatThreadProviderState] = useState<number>(CHATTHREADPROVIDER_LOADING_STATE);

  contextState = {
    chatThreadClient,
    setChatThreadClient,
    receipts,
    setReceipts,
    threadId,
    setThreadId,
    thread,
    setThread,
    chatMessages,
    setChatMessages,
    threadMembers,
    setThreadMembers,
    coolPeriod,
    setCoolPeriod,
    getThreadMembersError,
    setGetThreadMembersError,
    updateThreadMembersError,
    setUpdateThreadMembersError,
    failedMessageIds,
    setFailedMessageIds
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

export const useSetChatThreadClient = (): ((threadClient: ChatThreadClient) => void) => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.setChatThreadClient;
};

export const useChatMessages = (): ChatMessage[] | undefined => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.chatMessages;
};

export const useSetChatMessages = (): Dispatch<SetStateAction<ChatMessage[] | undefined>> => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.setChatMessages;
};

export const useThreadId = (): string => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.threadId;
};

export const useSetThreadId = (): ((threadId: string) => void) => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.setThreadId;
};

export const useThread = (): ChatThread | undefined => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.thread;
};

export const useSetThread = (): ((thread: ChatThread) => void) => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.setThread;
};

export const useReceipts = (): ChatMessageReadReceipt[] | undefined => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.receipts;
};

export const useSetReceipts = (): ((receipts: ChatMessageReadReceipt[]) => void) => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.setReceipts;
};

export const useThreadMembers = (): ChatParticipant[] => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.threadMembers;
};

export const useSetThreadMembers = (): ((threadMembers: ChatParticipant[]) => void) => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.setThreadMembers;
};

export const useCoolPeriod = (): Date | undefined => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.coolPeriod;
};

export const useSetCoolPeriod = (): ((coolPeriod: Date | undefined) => void) => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.setCoolPeriod;
};

export const useGetThreadMembersError = (): boolean | undefined => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.getThreadMembersError;
};

export const useSetGetThreadMembersError = (): ((getThreadMembersError: boolean) => void) => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.setGetThreadMembersError;
};

export const useGetUpdateThreadMembersError = (): boolean | undefined => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.updateThreadMembersError;
};

export const useSetUpdateThreadMembersError = (): ((updateThreadMembersError?: boolean) => void) => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.setUpdateThreadMembersError;
};

export const useFailedMessageIds = (): string[] => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.failedMessageIds;
};

export const useSetFailedMessageIds = (): Dispatch<SetStateAction<string[]>> => {
  const threadContext = useValidateAndGetThreadContext();
  return threadContext.setFailedMessageIds;
};
