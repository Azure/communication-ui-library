// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadItem, ChatClient, RestListChatThreadsOptions } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { createDecoratedIterator, createErrorHandlingIterator } from './createDecoratedIterator';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

/**
 * @private
 */
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

  return createDecoratedIterator(
    createErrorHandlingIterator(
      context.withErrorTeedToState(chatClient.listChatThreads.bind(chatClient), 'ChatClient.listChatThreads'),
      context,
      'ChatClient.listChatThreads'
    ),
    context,
    setThreadProperties
  );
};
