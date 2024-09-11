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
import { ChatClientState, ChatMessageWithStatus, ResourceFetchResult } from '@internal/chat-stateful-client';
import { memoizeFnAll } from '@internal/acs-ui-common';
import {
  ChatMessage,
  Message,
  CommunicationParticipant,
  SystemMessage,
  MessageContentType,
  ReadReceiptsBySenderId
} from '@internal/react-components';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '@internal/react-components';
import { createSelector } from 'reselect';
/* @conditional-compile-remove(data-loss-prevention) */
import { DEFAULT_DATA_LOSS_PREVENTION_POLICY_URL } from './utils/constants';
import { ACSKnownMessageType } from './utils/constants';
import { updateMessagesWithAttached } from './utils/updateMessagesWithAttached';
/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadata } from '@internal/acs-ui-common';
import { ChatAttachment } from '@azure/communication-chat';
import type { ChatParticipant } from '@azure/communication-chat';
/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
import { ChatAttachmentType } from '@internal/react-components';

const memoizedAllConvertChatMessage = memoizeFnAll(
  (
    _key: string,
    chatMessage: ChatMessageWithStatus,
    userId: string,
    isSeen: boolean,
    isLargeGroup: boolean
  ): Message => {
    const messageType = chatMessage.type.toLowerCase();
    /* @conditional-compile-remove(data-loss-prevention) */
    if (chatMessage.policyViolation?.result === 'contentBlocked') {
      return convertToUiBlockedMessage(chatMessage, userId, isSeen, isLargeGroup);
    }
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

/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
const extractAttachmentMetadata = (metadata: Record<string, string>): AttachmentMetadata[] => {
  const attachmentMetadata = metadata.fileSharingMetadata;
  if (!attachmentMetadata) {
    return [];
  }
  try {
    return JSON.parse(attachmentMetadata);
  } catch (e) {
    console.error(e);
    return [];
  }
};
/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
const extractTeamsAttachmentsMetadata = (
  rawAttachments: ChatAttachment[]
): {
  attachments: AttachmentMetadata[];
} => {
  const attachments: AttachmentMetadata[] = [];
  rawAttachments.forEach((rawAttachment) => {
    const attachmentType = rawAttachment.attachmentType as ChatAttachmentType;
    if (attachmentType === 'file') {
      attachments.push({
        id: rawAttachment.id,
        name: rawAttachment.name ?? '',
        url: extractAttachmentUrl(rawAttachment)
      });
    }
  });
  return {
    attachments
  };
};

/* @conditional-compile-remove(data-loss-prevention) */
const convertToUiBlockedMessage = (
  message: ChatMessageWithStatus,
  userId: string,
  isSeen: boolean,
  isLargeGroup: boolean
): BlockedMessage => {
  const messageSenderId = message.sender !== undefined ? toFlatCommunicationIdentifier(message.sender) : userId;
  return {
    messageType: 'blocked',
    createdOn: message.createdOn,
    warningText: undefined,
    status: !isLargeGroup && message.status === 'delivered' && isSeen ? 'seen' : message.status,
    senderDisplayName: message.senderDisplayName,
    senderId: messageSenderId,
    messageId: message.id,
    deletedOn: message.deletedOn,
    mine: messageSenderId === userId,
    link: DEFAULT_DATA_LOSS_PREVENTION_POLICY_URL
  };
};

/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
const extractAttachmentUrl = (attachment: ChatAttachment): string => {
  return attachment.previewUrl ? attachment.previewUrl : attachment.url || '';
};
const processChatMessageContent = (message: ChatMessageWithStatus): string | undefined => {
  let content = message.content?.message;
  if (
    message.content?.attachments &&
    message.content?.attachments.length > 0 &&
    sanitizedMessageContentType(message.type).includes('html')
  ) {
    const attachments: ChatAttachment[] = message.content?.attachments;
    // Fill in the src here
    if (content) {
      const document = new DOMParser().parseFromString(content ?? '', 'text/html');
      document.querySelectorAll('img').forEach((img) => {
        const attachmentPreviewUrl = attachments.find((attachment) => attachment.id === img.id)?.previewUrl;
        if (attachmentPreviewUrl) {
          const resourceCache = message.resourceCache?.[attachmentPreviewUrl];
          const src = getResourceSourceUrl(resourceCache);
          // if in error state
          if (src === undefined) {
            const brokenImageView = getBrokenImageViewNode(img);
            img.parentElement?.replaceChild(brokenImageView, img);
          } else {
            // else in loading or success state
            img.setAttribute('src', src);
          }
          setImageWidthAndHeight(img);
        }
      });
      content = document.body.innerHTML;
    }

    const teamsImageHtmlContent = attachments
      .filter(
        (attachment) =>
          attachment.attachmentType === 'image' &&
          attachment.previewUrl !== undefined &&
          !message.content?.message?.includes(attachment.id)
      )
      .map((attachment) => generateImageAttachmentImgHtml(message, attachment))
      .join('');
    if (teamsImageHtmlContent) {
      return (content ?? '') + teamsImageHtmlContent;
    }
  }
  return content;
};

const generateImageAttachmentImgHtml = (message: ChatMessageWithStatus, attachment: ChatAttachment): string => {
  if (attachment.previewUrl !== undefined) {
    const contentType = extractAttachmentContentTypeFromName(attachment.name);
    const resourceCache = message.resourceCache?.[attachment.previewUrl];
    const src = getResourceSourceUrl(resourceCache);
    // if in error state
    if (src === undefined) {
      return `\r\n<p>${getBrokenImageViewNode()}</p>`;
    }
    // else in loading or success state
    return `\r\n<p><img alt="image" src="${src}" itemscope="${contentType}" id="${attachment.id}"></p>`;
  }

  return '';
};

const getResourceSourceUrl = (result?: ResourceFetchResult): string | undefined => {
  if (result) {
    if (!result.error && result.sourceUrl) {
      // return sourceUrl for success state
      return result.sourceUrl;
    } else {
      // return undefined for error state
      return undefined;
    }
  }
  // return empty string for loading state
  return '';
};

const extractAttachmentContentTypeFromName = (name?: string): string => {
  if (name === undefined) {
    return '';
  }
  const indexOfLastDot = name.lastIndexOf('.');
  if (indexOfLastDot === undefined || indexOfLastDot < 0) {
    return '';
  }
  const contentType = name.substring(indexOfLastDot + 1);
  return contentType;
};

const setImageWidthAndHeight = (img?: HTMLImageElement): void => {
  if (img) {
    // define aspect ratio explicitly to prevent image not being displayed correctly
    // in safari, this includes image placeholder for loading state
    const width = img.width;
    const height = img.height;
    img.style.aspectRatio = `${width}/${height}`;
  }
};

/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
const extractAttachmentsMetadata = (message: ChatMessageWithStatus): { attachments?: AttachmentMetadata[] } => {
  let attachments: AttachmentMetadata[] = [];
  if (message.metadata) {
    attachments = attachments.concat(extractAttachmentMetadata(message.metadata));
  }
  if (message.content?.attachments) {
    const teamsAttachments = extractTeamsAttachmentsMetadata(message.content?.attachments);
    attachments = attachments.concat(teamsAttachments.attachments);
  }
  return { attachments: attachments.length > 0 ? attachments : undefined };
};
const convertToUiChatMessage = (
  message: ChatMessageWithStatus,
  userId: string,
  isSeen: boolean,
  isLargeGroup: boolean
): ChatMessage => {
  const messageSenderId = message.sender !== undefined ? toFlatCommunicationIdentifier(message.sender) : userId;
  /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
  const { attachments } = extractAttachmentsMetadata(message);
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
    /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
    attachments
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
          ?.filter((participant: ChatParticipant) => participant.displayName && participant.displayName !== '')
          .map(
            (participant: ChatParticipant): CommunicationParticipant => ({
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
  !!chatMessage.content?.participants && chatMessage.content.participants.some((p: ChatParticipant) => !!p.displayName);

/**
 *
 * @private
 */
export const messageThreadSelectorWithThread: () => MessageThreadSelector = () =>
  createSelector(
    [getUserId, getChatMessages, getLatestReadTime, getIsLargeGroup, getReadReceipts, getParticipants],
    (userId, chatMessages, latestReadTime, isLargeGroup, readReceipts = [], participants) => {
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

const getBrokenImageViewNode = (img?: HTMLDivElement): HTMLDivElement => {
  const wrapper = document.createElement('div');
  Array.from(img?.attributes ?? []).forEach((attr) => {
    wrapper.setAttribute(attr.nodeName, attr.nodeValue ?? '');
  });
  wrapper.setAttribute('class', 'broken-image-wrapper');
  wrapper.setAttribute('data-ui-id', 'broken-image-icon');
  return wrapper;
};

const isMessageValidToRender = (message: ChatMessageWithStatus): boolean => {
  if (message.deletedOn) {
    return false;
  }
  if (message.metadata?.fileSharingMetadata || message.content?.attachments?.length) {
    return true;
  }
  /* @conditional-compile-remove(data-loss-prevention) */
  if (message.policyViolation?.result === 'contentBlocked') {
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
