// © Microsoft Corporation. All rights reserved.
import { ChatThreadItem, ChatClient, RestListChatThreadsOptions } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { createDecoratedIterator } from './createDecoratedIterator';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

export const createDecoratedListThreads = (
  chatClient: ChatClient,
  context: ChatContext
): ((options?: RestListChatThreadsOptions) => PagedAsyncIterableIterator<ChatThreadItem>) => {
  const setThreadProperties = (chatThreadItem: ChatThreadItem, context: ChatContext): void => {
    const properties = {
      topic: chatThreadItem.topic
    };
    if (!context.createThreadIfNotExist(chatThreadItem.id, properties)) {
      context.updateThread(chatThreadItem.id, properties);
    }
  };
  return createDecoratedIterator(chatClient.listChatThreads.bind(chatClient), context, setThreadProperties);
};
