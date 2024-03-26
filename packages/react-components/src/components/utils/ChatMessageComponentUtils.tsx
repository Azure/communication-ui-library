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
import { _AttachmentDownloadCards } from '../AttachmentDownloadCards';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { FileDownloadHandler } from '../../types/Attachment';
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
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  onRenderFileDownloads?: (userId: string, message: ChatMessage) => JSX.Element,
  /* @conditional-compile-remove(mention) */
  mentionDisplayOptions?: MentionDisplayOptions,
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  fileDownloadHandler?: FileDownloadHandler
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
    <div tabIndex={0} className="ui-chat__message__content">
      <ChatMessageContent
        message={message}
        strings={strings}
        /* @conditional-compile-remove(mention) */
        mentionDisplayOptions={mentionDisplayOptions}
        inlineImageOptions={inlineImageOptions}
      />
      {
        /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ onRenderFileDownloads
          ? onRenderFileDownloads(userId, message)
          : defaultOnRenderFileDownloads(
              userId,
              message,
              strings,
              /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ fileDownloadHandler
            )
      }
    </div>
  );
}

/**
 * Default component for rendering file downloads.
 */
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
const defaultOnRenderFileDownloads = (
  userId: string,
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage,
  strings: MessageThreadStrings,
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  fileDownloadHandler?: FileDownloadHandler
): JSX.Element | undefined => {
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  return (
    <_AttachmentDownloadCards
      userId={userId}
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      fileMetadata={(message as ChatMessage).files || []}
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      downloadHandler={fileDownloadHandler}
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      strings={{
        downloadAttachment: strings.downloadAttachment,
        attachmentCardGroupMessage: strings.attachmentCardGroupMessage
      }}
    />
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
