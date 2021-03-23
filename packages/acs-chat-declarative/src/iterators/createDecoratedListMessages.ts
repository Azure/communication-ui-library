import { ChatMessage, ChatThreadClient } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { convertChatMessage } from '../ChatThreadClientDeclarative';
import { createDecoratedIterator } from './createDecoratedIterator';

export const createDecoratedListMessages = (chatThreadClient: ChatThreadClient, context: ChatContext) => {
  const setMessage = (message: ChatMessage, context: ChatContext) => {
    context.setChatMessage(chatThreadClient.threadId, convertChatMessage(message));
  };
  return createDecoratedIterator(chatThreadClient.listMessages, context, setMessage);
};
