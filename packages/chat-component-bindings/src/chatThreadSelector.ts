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
import { ChatMessage, Message, MessageAttachedStatus, CommunicationParticipant } from '@internal/react-components';
import { createSelector } from 'reselect';
import { compareMessages } from './utils/compareMessages';
import { ACSKnownMessageType } from './utils/constants';

const memoizedAllConvertChatMessage = memoizeFnAll(
  (
    _key: string,
    chatMessage: ChatMessageWithStatus,
    userId: string,
    isSeen: boolean,
    isLargeGroup: boolean
  ): Message<'chat'> | Message<'system'> | Message<'custom'> => {
    const messageType = chatMessage.type.toLowerCase();
    if (messageType === 'text' || messageType === 'richtext/html') {
      return convertToUiChatMessage(chatMessage, userId, isSeen, isLargeGroup);
    } else {
      return convertToUiSystemMessage(chatMessage);
    }
  }
);

const convertToUiChatMessage = (
  message: ChatMessageWithStatus,
  userId: string,
  isSeen: boolean,
  isLargeGroup: boolean
): ChatMessage => {
  return {
    type: 'chat',
    payload: {
      createdOn: message.createdOn,
      content: message.content?.message,
      type: sanitizedMessageContentType(message.type),
      status: !isLargeGroup && message.status === 'delivered' && isSeen ? 'seen' : message.status,
      senderDisplayName: message.senderDisplayName,
      senderId: message.sender !== undefined ? toFlatCommunicationIdentifier(message.sender) : userId,
      messageId: message.id,
      clientMessageId: message.clientMessageId
    }
  };
};

const convertToUiSystemMessage = (message: ChatMessageWithStatus): Message<'system'> => {
  const systemMessageType = message.type;
  if (systemMessageType === 'participantAdded' || systemMessageType === 'participantRemoved') {
    return {
      type: 'system',
      payload: {
        createdOn: message.createdOn,
        participants:
          message.content?.participants?.map(
            (participant): CommunicationParticipant => ({
              userId: toFlatCommunicationIdentifier(participant.id),
              displayName: participant.displayName
            })
          ) ?? [],
        type: systemMessageType,
        messageId: message.id,
        iconName: systemMessageType === 'participantAdded' ? 'PeopleAdd' : 'PeopleBlock'
      }
    };
  } else {
    // Only topic updated type left, according to ACSKnown type
    return {
      type: 'system',
      payload: {
        createdOn: message.createdOn,
        topic: message.content?.topic ?? '',
        type: 'topicUpdated',
        messageId: message.id,
        iconName: 'Edit'
      }
    };
  }
};

export const chatThreadSelector = createSelector(
  [getUserId, getChatMessages, getLatestReadTime, getIsLargeGroup],
  (userId, chatMessages, latestReadTime, isLargeGroup) => {
    // A function takes parameter above and generate return value
    const convertedMessages = memoizedAllConvertChatMessage((memoizedFn) =>
      Object.values(chatMessages)
        .filter(
          (message) =>
            message.type.toLowerCase() === ACSKnownMessageType.text ||
            message.type.toLowerCase() === ACSKnownMessageType.richtextHtml ||
            message.type.toLowerCase() === ACSKnownMessageType.html ||
            message.type === ACSKnownMessageType.participantAdded ||
            message.type === ACSKnownMessageType.participantRemoved ||
            message.type === ACSKnownMessageType.topicUpdated ||
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

export const updateMessagesWithAttached = (
  chatMessagesWithStatus: (Message<'chat'> | Message<'system'> | Message<'custom'>)[],
  userId: string
): void => {
  chatMessagesWithStatus.sort(compareMessages);

  chatMessagesWithStatus.forEach((message, index, messages) => {
    if (message.type !== 'chat') {
      return;
    }
    const mine = message.payload.senderId === userId;
    /**
     * A block of messages: continuous messages that belong to the same sender and not intercepted by other senders.
     *
     * Attacthed is the index of the last message in the previous block of messages which mine===true.
     * This message's statusToRender will be reset when there's a new block of messages which mine===true. (Because
     * in this case, we only want to show the read statusToRender of last message of the new messages block)
     */
    let attached: boolean | MessageAttachedStatus = false;
    const nextMessage = messages[index + 1];
    if (index === 0) {
      if (index !== messages.length - 1) {
        //the next message has the same sender
        if (message.payload.senderId === message.payload.senderId) {
          attached = 'top';
        }
      }
    } else {
      const previousMessage = messages[index - 1];
      if (previousMessage.type === 'chat' && message.payload.senderId === previousMessage.payload.senderId) {
        //the previous message has the same sender
        if (index !== messages.length - 1 && nextMessage.type === 'chat') {
          if (message.payload.senderId === nextMessage.payload.senderId) {
            //the next message has the same sender
            attached = true;
          } else {
            //the next message has a different sender
            attached = 'bottom';
          }
        } else {
          // this is the last message of the whole messages list or the next message is not a chat message
          attached = 'bottom';
        }
      } else {
        //the previous message has a different sender or is not a chat message
        if (index !== messages.length - 1 && nextMessage.type === 'chat') {
          if (message.payload.senderId === nextMessage.payload.senderId) {
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
