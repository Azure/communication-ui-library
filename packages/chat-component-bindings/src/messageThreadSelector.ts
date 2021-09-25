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
import {
  ChatMessage,
  Message,
  MessageAttachedStatus,
  CommunicationParticipant,
  SystemMessage
} from '@internal/react-components';
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
  ): Message => {
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
    messageType: 'chat',
    createdOn: message.createdOn,
    content: message.content?.message,
    contentType: sanitizedMessageContentType(message.type),
    status: !isLargeGroup && message.status === 'delivered' && isSeen ? 'seen' : message.status,
    senderDisplayName: message.senderDisplayName,
    senderId: message.sender !== undefined ? toFlatCommunicationIdentifier(message.sender) : userId,
    messageId: message.id,
    clientMessageId: message.clientMessageId,
    editedOn: message.editedOn,
    deletedOn: message.deletedOn
  };
};

const convertToUiSystemMessage = (message: ChatMessageWithStatus): SystemMessage => {
  const systemMessageType = message.type;
  if (systemMessageType === 'participantAdded' || systemMessageType === 'participantRemoved') {
    return {
      messageType: 'system',
      systemMessageType,
      createdOn: message.createdOn,
      participants:
        message.content?.participants
          // TODO: In our moderator logic, we use undefined name as our displayName for moderator, which should be filtered out
          // Once we have a better solution to identify the moderator, remove this line
          ?.filter((participant) => participant.displayName && participant.displayName !== '')
          .map(
            (participant): CommunicationParticipant => ({
              userId: toFlatCommunicationIdentifier(participant.id),
              displayName: participant.displayName
            })
          ) ?? [],
      messageId: message.id,
      iconName: systemMessageType === 'participantAdded' ? 'PeopleAdd' : 'PeopleBlock'
    };
  } else {
    // Only topic updated type left, according to ACSKnown type
    return {
      messageType: 'system',
      systemMessageType: 'topicUpdated',
      createdOn: message.createdOn,
      topic: message.content?.topic ?? '',
      messageId: message.id,
      iconName: 'Edit'
    };
  }
};

export const messageThreadSelector = createSelector(
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
        .filter((message) => message.content && message.content.message !== '') // TODO: deal with deleted message and remove
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

export const updateMessagesWithAttached = (chatMessagesWithStatus: Message[], userId: string): void => {
  chatMessagesWithStatus.sort(compareMessages);

  chatMessagesWithStatus.forEach((message, index, messages) => {
    if (message.messageType !== 'chat') {
      return;
    }
    const mine = message.senderId === userId;
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
        if (message.senderId === message.senderId) {
          attached = 'top';
        }
      }
    } else {
      const previousMessage = messages[index - 1];
      if (previousMessage.messageType === 'chat' && message.senderId === previousMessage.senderId) {
        //the previous message has the same sender
        if (index !== messages.length - 1 && nextMessage.messageType === 'chat') {
          if (message.senderId === nextMessage.senderId) {
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
        if (index !== messages.length - 1 && nextMessage.messageType === 'chat') {
          if (message.senderId === nextMessage.senderId) {
            //the next message has the same sender
            attached = 'top';
          }
        }
      }
    }

    message.attached = attached;
    message.mine = mine;
  });
};
