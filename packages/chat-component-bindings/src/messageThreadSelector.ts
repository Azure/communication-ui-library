// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ChatBaseSelectorProps,
  getChatMessages,
  getIsLargeGroup,
  getLatestReadTime,
  getParticipants,
  getReadInformation,
  getUserId
} from './baseSelectors';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ChatClientState, ChatMessageWithStatus } from '@internal/chat-stateful-client';
import { memoizeFnAll } from '@internal/acs-ui-common';
import {
  ChatMessage,
  Message,
  CommunicationParticipant,
  SystemMessage,
  MessageContentType
} from '@internal/react-components';
import { createSelector } from 'reselect';
import { ACSKnownMessageType } from './utils/constants';
import { updateMessagesWithAttached } from './utils/updateMessagesWithAttached';
import { ChatMessageReadReceipt } from '@azure/communication-chat';

const memoizedAllConvertChatMessage = memoizeFnAll(
  (
    _key: string,
    chatMessage: ChatMessageWithStatus,
    userId: string,
    isSeen: boolean,
    isLargeGroup: boolean,
    readReceipts: ChatMessageReadReceipt[],
    numParticipants: number
  ): Message => {
    const messageType = chatMessage.type.toLowerCase();
    if (
      messageType === ACSKnownMessageType.text ||
      messageType === ACSKnownMessageType.richtextHtml ||
      messageType === ACSKnownMessageType.html
    ) {
      return convertToUiChatMessage(chatMessage, userId, isSeen, isLargeGroup, readReceipts, numParticipants);
    } else {
      return convertToUiSystemMessage(chatMessage);
    }
  }
);

const convertToUiChatMessage = (
  message: ChatMessageWithStatus,
  userId: string,
  isSeen: boolean,
  isLargeGroup: boolean,
  readReceipts: ChatMessageReadReceipt[],
  numParticipants: number
): ChatMessage => {
  const messageSenderId = message.sender !== undefined ? toFlatCommunicationIdentifier(message.sender) : userId;
  const convertedReadReceipts = readReceipts.map((receipt) => ({
    senderId: toFlatCommunicationIdentifier(receipt.sender),
    chatMessageId: receipt.chatMessageId,
    readOn: receipt.readOn
  }));
  return {
    messageType: 'chat',
    createdOn: message.createdOn,
    content: message.content?.message,
    contentType: sanitizedMessageContentType(message.type),
    status: !isLargeGroup && message.status === 'delivered' && isSeen ? 'seen' : message.status,
    senderDisplayName: message.senderDisplayName,
    senderId: messageSenderId,
    messageId: message.id,
    clientMessageId: message.clientMessageId,
    editedOn: message.editedOn,
    deletedOn: message.deletedOn,
    mine: messageSenderId === userId,
    metadata: message.metadata,
    readReceipts: convertedReadReceipts,
    numParticipants: numParticipants
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

/**
 * Selector type for {@link MessageThread} component.
 *
 * @public
 */
export type MessageThreadSelector = (
  state: ChatClientState,
  props: ChatBaseSelectorProps
) => {
  userId: string;
  showMessageStatus: boolean;
  messages: Message[];
};

/** Returns `true` if the message has participants and at least one participant has a display name. */
const hasValidParticipant = (chatMessage: ChatMessageWithStatus): boolean =>
  !!chatMessage.content?.participants && chatMessage.content.participants.some((p) => !!p.displayName);

/**
 * Selector for {@link MessageThread} component.
 *
 * @public
 */
export const messageThreadSelector: MessageThreadSelector = createSelector(
  [getUserId, getChatMessages, getLatestReadTime, getIsLargeGroup, getReadInformation, getParticipants],
  (userId, chatMessages, latestReadTime, isLargeGroup, readInformation, participants) => {
    // get number of participants
    const numParticipants = Object.values(participants).length - 1;
    // for each chat message, add read receipt information when readInformation.id === chatmessage.id
    const convertedChatMessages = Object.values(chatMessages).map(function (message) {
      const readReceipt = Object.values(readInformation).filter((info) => info.chatMessageId === message.id);
      // readReceipt is getting duplicate information, remove duplicate here
      const uniqueReadReceipt = readReceipt.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              toFlatCommunicationIdentifier(t.sender) === toFlatCommunicationIdentifier(value.sender) &&
              t.chatMessageId === value.chatMessageId
          )
      );
      const convertedMessage = { message, readReceipt: uniqueReadReceipt };
      return convertedMessage;
    });
    // A function takes parameter above and generate return value
    const convertedMessages = memoizedAllConvertChatMessage((memoizedFn) =>
      Object.values(convertedChatMessages)
        .filter(
          (message) =>
            message.message.type.toLowerCase() === ACSKnownMessageType.text ||
            message.message.type.toLowerCase() === ACSKnownMessageType.richtextHtml ||
            message.message.type.toLowerCase() === ACSKnownMessageType.html ||
            (message.message.type === ACSKnownMessageType.participantAdded && hasValidParticipant(message.message)) ||
            (message.message.type === ACSKnownMessageType.participantRemoved && hasValidParticipant(message.message)) ||
            // TODO: Add support for topicUpdated system messages in MessageThread component.
            // message.type === ACSKnownMessageType.topicUpdated ||
            message.message.clientMessageId !== undefined
        )
        .filter((message) => message.message.content && message.message.content.message !== '') // TODO: deal with deleted message and remove
        .map((message) =>
          memoizedFn(
            message.message.id ?? message.message.clientMessageId,
            message.message,
            userId,
            message.message.createdOn <= latestReadTime,
            isLargeGroup,
            message.readReceipt,
            numParticipants
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

const sanitizedMessageContentType = (type: string): MessageContentType => {
  const lowerCaseType = type.toLowerCase();
  return lowerCaseType === 'text' || lowerCaseType === 'html' || lowerCaseType === 'richtext/html'
    ? lowerCaseType
    : 'unknown';
};
