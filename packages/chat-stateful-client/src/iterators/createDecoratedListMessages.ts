// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage, ChatThreadClient, RestListMessagesOptions } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { convertChatMessage } from '../convertChatMessage';
import { createDecoratedIterator, createErrorHandlingIterator } from './createDecoratedIterator';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

/**
 * @private
 */
export const createDecoratedListMessages = (
  chatThreadClient: ChatThreadClient,
  context: ChatContext
): ((options?: RestListMessagesOptions) => PagedAsyncIterableIterator<ChatMessage>) => {
  const setMessage = (message: ChatMessage, context: ChatContext): void => {
    context.setChatMessage(chatThreadClient.threadId, convertChatMessage(message));
  };
  return createDecoratedIterator(
    createErrorHandlingIterator(
      context.withErrorTeedToState(
        chatThreadClient.listMessages.bind(chatThreadClient),
        'ChatThreadClient.listMessages'
      ),
      context,
      'ChatThreadClient.listMessages'
    ),
    context,
    setMessage
  );
};
