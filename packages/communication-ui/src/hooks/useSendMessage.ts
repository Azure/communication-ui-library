// © Microsoft Corporation. All rights reserved.

import {
  COOL_PERIOD_THRESHOLD,
  CREATED,
  MAXIMUM_INT64,
  MAXIMUM_RETRY_COUNT,
  PRECONDITION_FAILED_RETRY_INTERVAL,
  PRECONDITION_FAILED_STATUS_CODE,
  TOO_MANY_REQUESTS_STATUS_CODE
} from '../constants';
import { ChatMessage, ChatThreadClient } from '@azure/communication-chat';
import { Dispatch, SetStateAction } from 'react';
import {
  useChatThreadClient,
  useSetChatMessages,
  useSetCoolPeriod,
  useThreadId
} from '../providers/ChatThreadProvider';

import { compareMessages } from '../utils/chatUtils';
import { useFetchMessage } from './useFetchMessage';
import { useFailedMessageIds, useSetFailedMessageIds } from '../providers/ChatThreadProvider';
import { useCallback } from 'react';
import { getErrorFromAcsResponseCode } from '../utils/SDKUtils';
import {
  CommunicationUiErrorCode,
  CommunicationUiError,
  CommunicationUiErrorSeverity
} from '../types/CommunicationUiError';

export interface ChatMessageWithClientMessageId extends ChatMessage {
  clientMessageId?: string;
}

const updateMessagesArray = (
  newMessage: ChatMessageWithClientMessageId,
  setChatMessages: Dispatch<SetStateAction<ChatMessage[] | undefined>>
): void => {
  setChatMessages((prevMessages) => {
    let messages: ChatMessage[] = prevMessages ? [...prevMessages] : [];
    messages = messages.map((message: ChatMessageWithClientMessageId) => {
      if (message.clientMessageId === newMessage.clientMessageId) {
        return {
          ...message,
          ...newMessage
        };
      } else {
        return message;
      }
    });
    return messages.sort(compareMessages);
  });
};

const sendMessageWithClient = async (
  chatThreadClient: ChatThreadClient,
  messageContent: string,
  displayName: string,
  clientMessageId: string,
  retryCount: number,
  setChatMessages: Dispatch<SetStateAction<ChatMessage[] | undefined>>,
  getMessage: (messageId: string) => Promise<ChatMessage | undefined>,
  setCoolPeriod: (coolPeriod: Date) => void,
  failedMessageIds: string[],
  setFailedMessageIds: Dispatch<SetStateAction<string[]>>
): Promise<void> => {
  const sendMessageRequest = {
    content: messageContent,
    senderDisplayName: displayName
  };
  try {
    let sendMessageResponse;
    try {
      sendMessageResponse = await chatThreadClient.sendMessage(sendMessageRequest);
    } catch (error) {
      throw new CommunicationUiError({
        message: 'Error sending message',
        code: CommunicationUiErrorCode.SEND_MESSAGE_ERROR,
        error: error
      });
    }
    if (sendMessageResponse._response.status === CREATED) {
      if (sendMessageResponse.id) {
        let message;
        try {
          message = await getMessage(sendMessageResponse.id);
        } catch (error) {
          throw new CommunicationUiError({
            message: 'Error getting message',
            code: CommunicationUiErrorCode.GET_MESSAGE_ERROR,
            severity: CommunicationUiErrorSeverity.IGNORE,
            error: error
          });
        }
        if (message) {
          updateMessagesArray({ ...message, clientMessageId }, setChatMessages);
        } else {
          updateMessagesArray(
            {
              clientMessageId: clientMessageId,
              createdOn: new Date(),
              id: sendMessageResponse.id,
              type: 'text',
              sequenceId: '',
              version: ''
            },
            setChatMessages
          );
        }
      }
    } else if (sendMessageResponse._response.status === TOO_MANY_REQUESTS_STATUS_CODE) {
      setCoolPeriod(new Date());
      // retry after cool period

      // We are awaiting the setTimeout and then also the sendMessageWithClient so it doesn't execute in separate async
      // function and will execute inside the current async function so if sendMessageWithClient throws it can be caught
      // in the surrounding try catch.
      await new Promise<void>((resolve) => {
        setTimeout(resolve, COOL_PERIOD_THRESHOLD);
      });

      await sendMessageWithClient(
        chatThreadClient,
        messageContent,
        displayName,
        clientMessageId,
        retryCount,
        setChatMessages,
        getMessage,
        setCoolPeriod,
        failedMessageIds,
        setFailedMessageIds
      );
    } else if (sendMessageResponse._response.status === PRECONDITION_FAILED_STATUS_CODE) {
      if (retryCount >= MAXIMUM_RETRY_COUNT) {
        setFailedMessageIds((failedMessageIds) => {
          return [...failedMessageIds, clientMessageId];
        });
        throw new CommunicationUiError({
          message: 'Failed at sending message and reached max retry count',
          code: CommunicationUiErrorCode.MESSAGE_EXCEEDED_RETRY_ERROR
        });
      }
      // retry in 0.2s
      await new Promise<void>((resolve) => {
        setTimeout(resolve, PRECONDITION_FAILED_RETRY_INTERVAL);
      });

      await sendMessageWithClient(
        chatThreadClient,
        messageContent,
        displayName,
        clientMessageId,
        retryCount + 1,
        setChatMessages,
        getMessage,
        setCoolPeriod,
        failedMessageIds,
        setFailedMessageIds
      );
    } else {
      setFailedMessageIds((failedMessageIds) => {
        return [...failedMessageIds, clientMessageId];
      });
      const error = getErrorFromAcsResponseCode(
        'Error sending message, status code:',
        sendMessageResponse._response.status
      );
      if (error) {
        throw error;
      }
    }
  } catch (error) {
    setFailedMessageIds((failedMessageIds) => {
      return [...failedMessageIds, clientMessageId];
    });
    throw error;
  }
};

const processSendMessage = async (
  displayName: string,
  userId: string,
  chatThreadClient: ChatThreadClient,
  messageContent: string,
  threadId: string,
  setChatMessages: Dispatch<SetStateAction<ChatMessage[] | undefined>>,
  getMessage: (messageId: string) => Promise<ChatMessage | undefined>,
  setCoolPeriod: (coolPeriod: Date) => void,
  failedMessageIds: string[],
  setFailedMessageIds: Dispatch<SetStateAction<string[]>>
): Promise<void> => {
  const clientMessageId = (Math.floor(Math.random() * MAXIMUM_INT64) + 1).toString(); //generate a random unsigned Int64 number
  const newMessage = {
    content: { message: messageContent },
    clientMessageId: clientMessageId,
    sender: { communicationUserId: userId },
    senderDisplayName: displayName,
    threadId: threadId,
    createdOn: new Date(),
    type: '',
    id: '',
    version: '',
    sequenceId: ''
  };
  setChatMessages((prevMessages) => {
    const messages: ChatMessage[] = prevMessages ? [...prevMessages] : [];
    messages.push(newMessage);
    return messages;
  });

  await sendMessageWithClient(
    chatThreadClient,
    messageContent,
    displayName,
    clientMessageId,
    0,
    setChatMessages,
    getMessage,
    setCoolPeriod,
    failedMessageIds,
    setFailedMessageIds
  );
};

export const useSendMessage = (displayName: string, userId: string): ((messageContent: string) => Promise<void>) => {
  const threadId = useThreadId();
  const setCoolPeriod = useSetCoolPeriod();

  if (threadId === undefined) {
    throw new CommunicationUiError({
      message: 'ThreadId is undefined',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }

  const chatThreadClient = useChatThreadClient();
  if (!chatThreadClient) {
    throw new CommunicationUiError({
      message: 'ChatThreadClient is undefined',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }

  const setChatMessages: Dispatch<SetStateAction<ChatMessage[] | undefined>> = useSetChatMessages();
  const fetchMessage = useFetchMessage();

  const setFailedMessageIds: Dispatch<SetStateAction<string[]>> = useSetFailedMessageIds();
  const failedMessageIds = useFailedMessageIds();

  const sendMessage = useCallback(
    async (messageContent: string): Promise<void> => {
      await processSendMessage(
        displayName,
        userId,
        chatThreadClient,
        messageContent,
        threadId,
        setChatMessages,
        fetchMessage,
        setCoolPeriod,
        failedMessageIds,
        setFailedMessageIds
      );
    },
    [chatThreadClient, failedMessageIds, fetchMessage, setChatMessages, setCoolPeriod, setFailedMessageIds, threadId]
  );
  return sendMessage;
};
