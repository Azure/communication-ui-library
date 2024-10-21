// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { ChatMessage, MessageAttachedStatus } from '../../types/ChatMessage';
import { ChatMessageContent } from '../ChatMessage/ChatMessageContent';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../types/ChatMessage';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessageContent } from '../ChatMessage/ChatMessageContent';
import { InlineImageOptions } from '../ChatMessage/ChatMessageContent';
import { MessageThreadStrings } from '../MessageThread';
/* @conditional-compile-remove(mention) */
import { MentionDisplayOptions } from '../MentionPopover';
import { _AttachmentDownloadCards } from '../Attachment/AttachmentDownloadCards';
import { AttachmentMenuAction } from '../../types/Attachment';
import { AttachmentMetadata } from '@internal/acs-ui-common';
import { formatTimeForChatMessage, formatTimestampForChatMessage } from './Datetime';
import { ComponentLocale } from '../../localization/LocalizationProvider';
import { chatMessageEditedTagStyle } from '../styles/ChatMessageComponent.styles';
import { Theme } from '@fluentui/react';

/** @private
 * Return the string value for the FluentUI message attached prop based on the message's attached status.
 * @param attached - The message's attached status.
 */
export const getFluentUIAttachedValue = (
  messageAttachedStatus?: MessageAttachedStatus
): 'bottom' | 'top' | 'center' | undefined => {
  return messageAttachedStatus === 'top' || messageAttachedStatus === false ? 'top' : 'center';
};

/**
 * @private
 *  Get the message bubble content for the message.
 */
export function getMessageBubbleContent(
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage,
  strings: MessageThreadStrings,
  userId: string,
  inlineImageOptions: InlineImageOptions | undefined,
  /* @conditional-compile-remove(mention) */
  mentionDisplayOptions?: MentionDisplayOptions,
  /**
   * Optional callback to render message attachments in the message component.
   */
  onRenderAttachmentDownloads?: (message: ChatMessage) => JSX.Element,
  /**
   * Optional callback to define custom actions for attachments.
   */
  actionsForAttachment?: (attachment: AttachmentMetadata, message?: ChatMessage) => AttachmentMenuAction[]
): JSX.Element {
  /* @conditional-compile-remove(data-loss-prevention) */
  if (message.messageType === 'blocked') {
    return (
      <div tabIndex={0}>
        <BlockedMessageContent message={message} strings={strings} />
      </div>
    );
  }
  return (
    <div className="ui-chat__message__content">
      <ChatMessageContent
        message={message}
        strings={strings}
        /* @conditional-compile-remove(mention) */
        mentionDisplayOptions={mentionDisplayOptions}
        inlineImageOptions={inlineImageOptions}
      />
      {onRenderAttachmentDownloads
        ? onRenderAttachmentDownloads(message)
        : defaultOnRenderAttachmentDownloads(
            message,
            strings,

            actionsForAttachment
          )}
    </div>
  );
}

/**
 * Default component for rendering attachment downloads.
 */
const defaultOnRenderAttachmentDownloads = (
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage,
  strings: MessageThreadStrings,
  actionsForAttachment?: (attachment: AttachmentMetadata, message?: ChatMessage) => AttachmentMenuAction[]
): JSX.Element | undefined => {
  const attachments = 'attachments' in message ? message.attachments : undefined;
  return (attachments?.length ?? 0) > 0 ? (
    <_AttachmentDownloadCards
      message={message as ChatMessage}
      attachments={attachments}
      actionsForAttachment={actionsForAttachment}
      strings={{
        /* @conditional-compile-remove(file-sharing-acs) */
        downloadAttachment: strings.downloadAttachment,
        openAttachment: strings.openAttachment,
        attachmentCardGroupMessage: strings.attachmentCardGroupMessage
      }}
    />
  ) : (
    <></>
  );
  return undefined;
};

/** @private */
export const generateDefaultTimestamp = (
  createdOn: Date,
  showDate: boolean | undefined,
  strings: MessageThreadStrings
): string => {
  const formattedTimestamp = showDate
    ? formatTimestampForChatMessage(createdOn, new Date(), strings)
    : formatTimeForChatMessage(createdOn);

  return formattedTimestamp;
};

// onDisplayDateTimeString from props overwrite onDisplayDateTimeString from locale
/** @private */
export const generateCustomizedTimestamp = (
  createdOn: Date,
  locale: ComponentLocale,
  onDisplayDateTimeString?: (messageDate: Date) => string
): string => {
  /* @conditional-compile-remove(date-time-customization) */
  return onDisplayDateTimeString
    ? onDisplayDateTimeString(createdOn)
    : locale.onDisplayDateTimeString
      ? locale.onDisplayDateTimeString(createdOn)
      : '';

  return '';
};

/**
 * @private
 *  Get the edited tag for the message if it is edited.
 */
export const getMessageEditedDetails = (
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage,
  theme: Theme,
  editedTag: string
): JSX.Element | undefined => {
  const editedOn = 'editedOn' in message ? message.editedOn : undefined;
  if (message.messageType === 'chat' && editedOn) {
    return <div className={chatMessageEditedTagStyle(theme)}>{editedTag}</div>;
  }
  return undefined;
};
