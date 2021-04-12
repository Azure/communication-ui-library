// © Microsoft Corporation. All rights reserved.
import { ChatMessage, ChatThreadClient, RestListMessagesOptions } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { convertChatMessage } from '../convertChatMessage';
import { createDecoratedIterator } from './createDecoratedIterator';
import { PagedAsyncIterableIterator } from '@azure/core-paging';

export const createDecoratedListMessages = (
  chatThreadClient: ChatThreadClient,
  context: ChatContext
): ((options?: RestListMessagesOptions) => PagedAsyncIterableIterator<ChatMessage>) => {
  const setMessage = (message: ChatMessage, context: ChatContext): void => {
    context.setChatMessage(chatThreadClient.threadId, convertChatMessage(message));
  };
  return createDecoratedIterator(chatThreadClient.listMessages.bind(chatThreadClient), context, setMessage);
};
