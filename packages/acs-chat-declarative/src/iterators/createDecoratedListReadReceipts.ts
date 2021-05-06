//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadClient, ChatMessageReadReceipt, RestListReadReceiptsOptions } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { createDecoratedIterator } from './createDecoratedIterator';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

export const createDecoratedListReadReceipts = (
  chatThreadClient: ChatThreadClient,
  context: ChatContext
): ((options?: RestListReadReceiptsOptions | undefined) => PagedAsyncIterableIterator<ChatMessageReadReceipt>) => {
  const setReadReceipt = (readReceipt: ChatMessageReadReceipt, context: ChatContext): void => {
    context.addReadReceipt(chatThreadClient.threadId, {
      ...readReceipt
    });
  };
  return createDecoratedIterator(chatThreadClient.listReadReceipts.bind(chatThreadClient), context, setReadReceipt);
};
