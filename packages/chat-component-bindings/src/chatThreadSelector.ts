// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  getChatMessages,
  getIsLargeGroup,
  getLatestReadTime,
  getUserId,
  sanitizedMessageContentType
} from './baseSelectors';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ChatMessageWithStatus } from '@internal/chat-stateful-client';
import { memoizeFnAll } from '@internal/acs-ui-common';
import { ChatMessage, MessageAttachedStatus } from '@internal/react-components';
import { createSelector } from 'reselect';
import { compareMessages } from './utils/compareMessages';

const memoizedAllConvertChatMessage = memoizeFnAll(
  (
    _key: string,
    chatMessage: ChatMessageWithStatus,
    userId: string,
    isSeen: boolean,
    isLargeGroup: boolean
  ): ChatMessage => ({
    type: 'chat',
    payload: {
      createdOn: chatMessage.createdOn,
      content: chatMessage.content?.message,
      type: sanitizedMessageContentType(chatMessage.type),
      status: !isLargeGroup && chatMessage.status === 'delivered' && isSeen ? 'seen' : chatMessage.status,
      senderDisplayName: chatMessage.senderDisplayName,
      senderId: chatMessage.sender !== undefined ? toFlatCommunicationIdentifier(chatMessage.sender) : userId,
      messageId: chatMessage.id,
      clientMessageId: chatMessage.clientMessageId
    }
  })
);

export const chatThreadSelector = createSelector(
  [getUserId, getChatMessages, getLatestReadTime, getIsLargeGroup],
  (userId, chatMessages, latestReadTime, isLargeGroup) => {
    // A function takes parameter above and generate return value
    const convertedMessages = memoizedAllConvertChatMessage((memoizedFn) =>
      Object.values(chatMessages)
        .filter(
          (message) =>
            message.type.toLowerCase() === 'text' ||
            message.type.toLowerCase() === 'html' ||
            message.type.toLowerCase() === 'richtext/html' ||
            message.clientMessageId !== undefined
        )
        .map((message) =>
          memoizedFn(
            message.id ?? message.clientMessageId,
            message,
            userId,
            message.createdOn <= latestReadTime,
            isLargeGroup
          )
        )
    );

    updateMessagesWithAttached(convertedMessages, userId);
    return {
      userId,
      showMessageStatus: !isLargeGroup,
      messages: convertedMessages
    };
  }
);

export const updateMessagesWithAttached = (chatMessagesWithStatus: ChatMessage[], userId: string): void => {
  chatMessagesWithStatus.sort(compareMessages);

  chatMessagesWithStatus.forEach((message, index, messages) => {
    const mine = message.payload.senderId === userId;
    /**
     * A block of messages: continuous messages that belong to the same sender and not intercepted by other senders.
     *
     * Attacthed is the index of the last message in the previous block of messages which mine===true.
     * This message's statusToRender will be reset when there's a new block of messages which mine===true. (Because
     * in this case, we only want to show the read statusToRender of last message of the new messages block)
     */
    let attached: boolean | MessageAttachedStatus = false;
    if (index === 0) {
      if (index !== messages.length - 1) {
        //the next message has the same sender
        if (messages[index].payload.senderId === messages[index + 1].payload.senderId) {
          attached = 'top';
        }
      }
    } else {
      if (messages[index].payload.senderId === messages[index - 1].payload.senderId) {
        //the previous message has the same sender
        if (index !== messages.length - 1) {
          if (messages[index].payload.senderId === messages[index + 1].payload.senderId) {
            //the next message has the same sender
            attached = true;
          } else {
            //the next message has a different sender
            attached = 'bottom';
          }
        } else {
          // this is the last message of the whole messages list
          attached = 'bottom';
        }
      } else {
        //the previous message has a different sender
        if (index !== messages.length - 1) {
          if (messages[index].payload.senderId === messages[index + 1].payload.senderId) {
            //the next message has the same sender
            attached = 'top';
          }
        }
      }
    }
    message.payload.attached = attached;
    message.payload.mine = mine;
  });
};
