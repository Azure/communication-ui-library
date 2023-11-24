// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
  MessageContentType,
  ReadReceiptsBySenderId
} from '@internal/react-components';
import { createSelector } from 'reselect';
import { ACSKnownMessageType } from './utils/constants';
import { updateMessagesWithAttached } from './utils/updateMessagesWithAttached';

/* @conditional-compile-remove(file-sharing) @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { FileMetadata, FileMetadataAttachmentType } from '@internal/react-components';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ChatAttachmentType, ChatAttachment } from '@azure/communication-chat';
const memoizedAllConvertChatMessage = memoizeFnAll(
  (
    _key: string,
    chatMessage: ChatMessageWithStatus,
    userId: string,
    isSeen: boolean,
    isLargeGroup: boolean
  ): Message => {
    const messageType = chatMessage.type.toLowerCase();
    if (
      messageType === ACSKnownMessageType.text ||
      messageType === ACSKnownMessageType.richtextHtml ||
      messageType === ACSKnownMessageType.html
    ) {
      return convertToUiChatMessage(chatMessage, userId, isSeen, isLargeGroup);
    } else {
      return convertToUiSystemMessage(chatMessage);
    }
  }
);
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
const extractTeamsAttachmentsMetadata = (attachments: ChatAttachment[]): FileMetadata[] => {
  const fileMetadata: FileMetadata[] = [];
  attachments.forEach((attachment) => {
    const attachmentType = mapAttachmentType(attachment.attachmentType);
    const contentType = extractAttachmentContentTypeFromName(attachment.name) ?? '';
    if (attachmentType === 'inlineImage') {
      fileMetadata.push({
        attachmentType: attachmentType,
        id: attachment.id,
        name: attachment.name ?? '',
        extension: contentType,
        url: extractAttachmentUrl(attachment),
        previewUrl: attachment.previewUrl
      });
    } else if (attachmentType === 'fileSharing') {
      fileMetadata.push({
        attachmentType: attachmentType,
        id: attachment.id,
        name: attachment.name ?? '',
        extension: contentType,
        url: extractAttachmentUrl(attachment),
        payload: {
          teamsFileAttachment: 'true'
        }
      });
    }
  });
  return fileMetadata;
};

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
const mapAttachmentType = (attachmentType: ChatAttachmentType): FileMetadataAttachmentType => {
  if (attachmentType === 'image') {
    return 'inlineImage';
  }
  return 'unknown';
};

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
const extractAttachmentUrl = (attachment: ChatAttachment): string => {
  return attachment.url || '';
};
const processChatMessageContent = (message: ChatMessageWithStatus): string | undefined => {
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  if (sanitizedMessageContentType(message.type).includes('html') && message.content?.attachments) {
    const attachments: ChatAttachment[] = message.content?.attachments;
    const teamsImageHtmlContent = attachments
      .filter((attachment) => attachment.attachmentType === 'image')
      .map((attachment) => generateImageAttachmentImgHtml(attachment))
      .join('');
    if (teamsImageHtmlContent) {
      return (message.content?.message ?? '') + teamsImageHtmlContent;
    }
  }
  return message.content?.message;
};

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
const generateImageAttachmentImgHtml = (attachment: ChatAttachment): string => {
  const contentType = extractAttachmentContentTypeFromName(attachment.name) ?? '';
  return `\r\n<p><img alt="image" src="" itemscope="${contentType}" id="${attachment.id}"></p>`;
};

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
const extractAttachmentContentTypeFromName = (name?: string): string | undefined => {
  if (name === undefined) {
    return undefined;
  }
  const indexOfLastDot = name.lastIndexOf('.');
  if (indexOfLastDot === undefined || indexOfLastDot < 0) {
    return undefined;
  }
  const contentType = name.substring(indexOfLastDot + 1);
  return contentType;
};

/* @conditional-compile-remove(file-sharing) @conditional-compile-remove(teams-inline-images-and-file-sharing) */
const extractFilesMetadata = (message: ChatMessageWithStatus): FileMetadata[] => {
  let fileMetadata: FileMetadata[] = [];
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  if (message.content?.attachments) {
    fileMetadata = fileMetadata.concat(extractTeamsAttachmentsMetadata(message.content?.attachments));
  }
  return fileMetadata;
};
const convertToUiChatMessage = (
  message: ChatMessageWithStatus,
  userId: string,
  isSeen: boolean,
  isLargeGroup: boolean
): ChatMessage => {
  const messageSenderId = message.sender !== undefined ? toFlatCommunicationIdentifier(message.sender) : userId;
  return {
    messageType: 'chat',
    createdOn: message.createdOn,
    content: processChatMessageContent(message),
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
    /* @conditional-compile-remove(file-sharing) @conditional-compile-remove(teams-inline-images-and-file-sharing) */
    attachedFilesMetadata: extractFilesMetadata(message)
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
 *
 * @private
 */
export const messageThreadSelectorWithThread: () => MessageThreadSelector = () =>
  createSelector(
    [getUserId, getChatMessages, getLatestReadTime, getIsLargeGroup, getReadReceipts, getParticipants],
    (userId, chatMessages, latestReadTime, isLargeGroup, readReceipts, participants) => {
      // We can't get displayName in teams meeting interop for now, disable rr feature when it is teams interop
      const isTeamsInterop = Object.values(participants).find((p) => 'microsoftTeamsUserId' in p.id) !== undefined;

      // get number of participants
      // filter out the non valid participants (no display name)
      // Read Receipt details will be disabled when participant count is 0
      const participantCount = isTeamsInterop
        ? undefined
        : Object.values(participants).filter((p) => p.displayName && p.displayName !== '').length;

      // creating key value pairs of senderID: last read message information

      const readReceiptsBySenderId: ReadReceiptsBySenderId = {};

      // readReceiptsBySenderId[senderID] gets updated every time a new message is read by this sender
      // in this way we can make sure that we are only saving the latest read message id and read on time for each sender
      readReceipts
        .filter((r) => r.sender && toFlatCommunicationIdentifier(r.sender) !== userId)
        .forEach((r) => {
          readReceiptsBySenderId[toFlatCommunicationIdentifier(r.sender)] = {
            lastReadMessage: r.chatMessageId,
            displayName: participants[toFlatCommunicationIdentifier(r.sender)]?.displayName ?? ''
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
          .filter(isMessageValidToRender)
          .map((message) => {
            return memoizedFn(
              message.id ?? message.clientMessageId,
              message,
              userId,
              message.createdOn <= latestReadTime,
              isLargeGroup
            );
          })
      );
      updateMessagesWithAttached(convertedMessages);
      return {
        userId,
        showMessageStatus: true,
        messages: convertedMessages,
        participantCount,
        readReceiptsBySenderId
      };
    }
  );
const sanitizedMessageContentType = (type: string): MessageContentType => {
  const lowerCaseType = type.toLowerCase();
  return lowerCaseType === 'text' || lowerCaseType === 'html' || lowerCaseType === 'richtext/html'
    ? lowerCaseType
    : 'unknown';
};
const isMessageValidToRender = (message: ChatMessageWithStatus): boolean => {
  if (message.deletedOn) {
    return false;
  }
  if (
    message.metadata?.['fileSharingMetadata'] ||
    /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */ message.content?.attachments
  ) {
    return true;
  }
  return !!(message.content && message.content?.message !== '');
};

/**
 * Selector for {@link MessageThread} component.
 *
 * @public
 */
export const messageThreadSelector: MessageThreadSelector = messageThreadSelectorWithThread();
