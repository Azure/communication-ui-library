// © Microsoft Corporation. All rights reserved.
import { createSelector } from 'reselect';
import { BaseChatConfigProps, getChatMessages, getSelectorProps } from './baseSelectors';
import { ChatMessageWithStatus } from '@azure/acs-chat-declarative';

export const chatThreadSelector = createSelector(
  [getSelectorProps, getChatMessages],
  ({ userId }: BaseChatConfigProps, chatMessages) => ({
    // A function takes parameter above and generate return value
    userId: userId,
    disableReadReceipt: false,
    chatMessages: Array.from(chatMessages.values()).map((chatMessage: ChatMessageWithStatus) => ({
      createdOn: chatMessage.createdOn,
      content: chatMessage.content,
      status: chatMessage.status,
      senderDisplayName: chatMessage.senderDisplayName,
      senderId: chatMessage.sender?.communicationUserId || userId,
      messageId: chatMessage.id || chatMessage.clientMessageId
    }))
  })
);
