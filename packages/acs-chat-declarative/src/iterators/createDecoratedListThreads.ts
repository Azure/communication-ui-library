// © Microsoft Corporation. All rights reserved.
import { ChatThreadInfo, ChatClient } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { createDecoratedIterator } from './createDecoratedIterator';

export const createDecoratedListThreads = (chatClient: ChatClient, context: ChatContext) => {
  const setThreadInfo = (chatThreadInfo: ChatThreadInfo, context: ChatContext) => {
    if (!context.createThreadIfNotExist(chatThreadInfo.id, chatThreadInfo)) {
      context.updateThread(chatThreadInfo.id, chatThreadInfo);
    }
  };
  return createDecoratedIterator(chatClient.listChatThreads.bind(chatClient), context, setThreadInfo);
};
