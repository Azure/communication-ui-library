// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ChatBaseSelectorProps,
  getChatMessages,
  getIsLargeGroup,
  getLatestReadTime,
  getParticipants,
  getReadReceipts,
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
import { getParticipantsWhoHaveReadMessage } from './utils/getParticipantsWhoHaveReadMessage';

const memoizedAllConvertChatMessage = memoizeFnAll(
  (
    _key: string,
    chatMessage: ChatMessageWithStatus,
    userId: string,
    isSeen: boolean,
    isLargeGroup: boolean,
    readNumber: number,
    readBy: { id: string; name: string }[]
  ): Message => {
    const messageType = chatMessage.type.toLowerCase();
    if (
      messageType === ACSKnownMessageType.text ||
      messageType === ACSKnownMessageType.richtextHtml ||
      messageType === ACSKnownMessageType.html
    ) {
      return convertToUiChatMessage(chatMessage, userId, isSeen, isLargeGroup, readNumber, readBy);
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
  readNumber: number,
  readBy: { id: string; name: string }[]
): ChatMessage => {
  const messageSenderId = message.sender !== undefined ? toFlatCommunicationIdentifier(message.sender) : userId;
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
    readNumber,
    readBy,
    metadata: message.metadata
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
  [getUserId, getChatMessages, getLatestReadTime, getIsLargeGroup, getReadReceipts, getParticipants],
  (userId, chatMessages, latestReadTime, isLargeGroup, readReceipts, participants) => {
    // get number of participants
    // filter out the non valid participants (no display name)
    const messageThreadParticipantCount = Object.values(participants).filter(
      (p) => p.displayName && p.displayName !== ''
    ).length;

    // creating key value pairs of senderID: last read message information

    const readReceiptForEachSender: { [key: string]: { lastReadMessage: string; readOn: Date; name: string } } = {};

    // readReceiptForEachSender[senderID] gets updated everytime a new message is read by this sender
    // in this way we can make sure that we are only saving the latest read message id and read on time for each sender
    readReceipts.forEach((r) => {
      readReceiptForEachSender[toFlatCommunicationIdentifier(r.sender)] = {
        lastReadMessage: r.chatMessageId,
        readOn: r.readOn,
        name: participants[toFlatCommunicationIdentifier(r.sender)].displayName ?? ''
      };
    });

    // A function takes parameter above and generate return value
    const convertedMessages = memoizedAllConvertChatMessage((memoizedFn) =>
      Object.values(chatMessages)
        .filter(
          (message) =>
            message.type.toLowerCase() === ACSKnownMessageType.text ||
            message.type.toLowerCase() === ACSKnownMessageType.richtextHtml ||
            message.type.toLowerCase() === ACSKnownMessageType.html ||
            (message.type === ACSKnownMessageType.participantAdded && hasValidParticipant(message)) ||
            (message.type === ACSKnownMessageType.participantRemoved && hasValidParticipant(message)) ||
            // TODO: Add support for topicUpdated system messages in MessageThread component.
            // message.type === ACSKnownMessageType.topicUpdated ||
            message.clientMessageId !== undefined
        )
        .filter((message) => message.content && message.content.message !== '') // TODO: deal with deleted message and remove
        .map((message) => {
          const readBy: { id: string; name: string }[] = getParticipantsWhoHaveReadMessage(
            message,
            readReceiptForEachSender
          );

          return memoizedFn(
            message.id ?? message.clientMessageId,
            message,
            userId,
            message.createdOn <= latestReadTime,
            isLargeGroup,
            readBy.length,
            readBy
          );
        })
    );

    updateMessagesWithAttached(convertedMessages, userId);
    return {
      userId,
      showMessageStatus: !isLargeGroup,
      messages: convertedMessages,
      messageThreadParticipantCount
    };
  }
);

const sanitizedMessageContentType = (type: string): MessageContentType => {
  const lowerCaseType = type.toLowerCase();
  return lowerCaseType === 'text' || lowerCaseType === 'html' || lowerCaseType === 'richtext/html'
    ? lowerCaseType
    : 'unknown';
};
