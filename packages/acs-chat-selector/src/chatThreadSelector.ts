// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  getChatMessages,
  getIsLargeGroup,
  getLatestReadTime,
  getUserId,
  sanitizedMessageContentType
} from './baseSelectors';
import { FlatCommunicationIdentifier, flattenedCommunicationIdentifier } from 'acs-ui-common';
import { ChatMessageWithStatus } from 'chat-stateful-client';
// The following need explicitly imported to avoid api-extractor issues.
// These can be removed once https://github.com/microsoft/rushstack/pull/1916 is fixed.
// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { ChatMessageContent, ChatParticipant } from '@azure/communication-chat';
// @ts-ignore
import { ChatClientState } from 'chat-stateful-client';
// @ts-ignore
import { ChatBaseSelectorProps } from './baseSelectors';
// @ts-ignore
import { memoizeFnAll } from './utils/memoizeFnAll';
// @ts-ignore
import { ChatMessage, MessageAttachedStatus, Message, MessageTypes } from 'react-components';
// @ts-ignore
import { createSelector } from 'reselect';
// @ts-ignore
import { compareMessages } from './utils/compareMessages';

const memoizedAllConvertChatMessage = memoizeFnAll(
  (
    _key: string,
    chatMessage: ChatMessageWithStatus,
    userId: FlatCommunicationIdentifier,
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
      senderId: chatMessage.sender !== undefined ? flattenedCommunicationIdentifier(chatMessage.sender) : userId,
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
      Array.from(chatMessages.values())
        .filter(
          (message) =>
            message.type.toLowerCase() === 'text' ||
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
      disableReadReceipt: isLargeGroup,
      messages: convertedMessages
    };
  }
);

export const updateMessagesWithAttached = (
  chatMessagesWithStatus: ChatMessage[],
  userId: FlatCommunicationIdentifier
): void => {
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
