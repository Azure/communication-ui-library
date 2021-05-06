// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadInfo, ChatClient, RestListChatThreadsOptions } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { createDecoratedIterator } from './createDecoratedIterator';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

export const createDecoratedListThreads = (
  chatClient: ChatClient,
  context: ChatContext
): ((options?: RestListChatThreadsOptions) => PagedAsyncIterableIterator<ChatThreadInfo>) => {
  const setThreadInfo = (chatThreadInfo: ChatThreadInfo, context: ChatContext): void => {
    if (!context.createThreadIfNotExist(chatThreadInfo.id, chatThreadInfo)) {
      context.updateThread(chatThreadInfo.id, chatThreadInfo);
    }
  };
  return createDecoratedIterator(chatClient.listChatThreads.bind(chatClient), context, setThreadInfo);
};
