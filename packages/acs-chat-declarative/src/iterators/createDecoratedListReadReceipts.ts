import { ChatThreadClient, ChatMessageReadReceipt } from '@azure/communication-chat';
import { ChatContext } from '../ChatContext';
import { createDecoratedIterator } from './createDecoratedIterator';

export const createDecoratedListReadReceipts = (chatThreadClient: ChatThreadClient, context: ChatContext) => {
  const setReadReceipt = (readReceipt: ChatMessageReadReceipt, context: ChatContext) => {
    context.addReadReceipt(chatThreadClient.threadId, {
      ...readReceipt,
      senderId: readReceipt.sender.communicationUserId
    });
  };
  return createDecoratedIterator(chatThreadClient.listReadReceipts, context, setReadReceipt);
};
