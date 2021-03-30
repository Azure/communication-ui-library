// © Microsoft Corporation. All rights reserved.
import { BaseChatConfigProps, getChatMessages, getSelectorProps } from './baseSelectors';
import { ChatMessageWithStatus } from '@azure/acs-chat-declarative';
import { createSelector } from 'reselect';

// The following need explicitly imported to avoid api-extractor issues.
// These can be removed once https://github.com/microsoft/rushstack/pull/1916 is fixed.
// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { ChatMessageContent } from '@azure/communication-chat';
// @ts-ignore
import { ChatClientState, MessageStatus } from '@azure/acs-chat-declarative';

export const chatThreadSelector = createSelector(
  [getSelectorProps, getChatMessages],
  ({ userId }: BaseChatConfigProps, chatMessages) => ({
    // A function takes parameter above and generate return value
    userId: userId,
    disableReadReceipt: false,
    chatMessages: Array.from(chatMessages.values()).map((chatMessage: ChatMessageWithStatus) => ({
      createdOn: chatMessage.createdOn,
      content: chatMessage.content?.message,
      status: chatMessage.status,
      senderDisplayName: chatMessage.senderDisplayName,
      senderId: chatMessage.sender?.communicationUserId || userId,
      messageId: chatMessage.id || chatMessage.clientMessageId
    }))
  })
);
