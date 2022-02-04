// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadClient, ChatMessageReadReceipt, RestListReadReceiptsOptions } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { createDecoratedIterator, createErrorHandlingIterator } from './createDecoratedIterator';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

/**
 * @private
 */
export const createDecoratedListReadReceipts = (
  chatThreadClient: ChatThreadClient,
  context: ChatContext
): ((options?: RestListReadReceiptsOptions | undefined) => PagedAsyncIterableIterator<ChatMessageReadReceipt>) => {
  const setReadReceipt = (readReceipt: ChatMessageReadReceipt, context: ChatContext): void => {
    context.addReadReceipt(chatThreadClient.threadId, {
      ...readReceipt
    });
  };
  return createDecoratedIterator(
    createErrorHandlingIterator(
      context.withErrorTeedToState(
        chatThreadClient.listReadReceipts.bind(chatThreadClient),
        'ChatThreadClient.listReadReceipts'
      ),
      context,
      'ChatThreadClient.listReadReceipts'
    ),
    context,
    setReadReceipt
  );
};
