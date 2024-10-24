// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Text, mergeStyles } from '@fluentui/react';
import { ChatMessage as FluentChatMessage } from '@fluentui-contrib/react-chat';
import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useMemo } from 'react';
import {
  chatMessageDateStyle,
  chatMessageAuthorStyle,
  chatMessageDateFailedStyle
} from '../../styles/ChatMessageComponent.styles';
import { useIdentifiers } from '../../../identifiers/IdentifierProvider';
import { useTheme } from '../../../theming';
import { InlineImageOptions } from '../ChatMessageContent';
import { ChatMessage } from '../../../types/ChatMessage';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../../types/ChatMessage';
import { MessageThreadStrings } from '../../MessageThread';
import { ComponentSlotStyle } from '../../../types';
/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMenuAction } from '../../../types';
/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadata } from '@internal/acs-ui-common';
import { _AttachmentDownloadCards } from '../../Attachment/AttachmentDownloadCards';
import { useLocale } from '../../../localization';
/* @conditional-compile-remove(mention) */
import { MentionDisplayOptions } from '../../MentionPopover';
import { createStyleFromV8Style } from '../../styles/v8StyleShim';
import { mergeClasses } from '@fluentui/react-components';
import { useChatMessageStyles, useChatMessageCommonStyles } from '../../styles/MessageThread.styles';
import {
  generateCustomizedTimestamp,
  generateDefaultTimestamp,
  getMessageBubbleContent,
  getMessageEditedDetails
} from '../../utils/ChatMessageComponentUtils';
/* @conditional-compile-remove(file-sharing-acs) */
import { doesMessageContainMultipleAttachments } from '../../utils/ChatMessageComponentAsEditBoxUtils';

type ChatMessageComponentAsMessageBubbleProps = {
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  strings: MessageThreadStrings;
  userId: string;
  /**
   * Whether to overlap avatar and message when the view is width constrained.
   */
  shouldOverlapAvatarAndMessage: boolean;
  /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional callback to render message attachments in the message component.
   */
  onRenderAttachmentDownloads?: (message: ChatMessage) => JSX.Element;
  /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional callback to define custom actions for attachments.
   */
  actionsForAttachment?: (attachment: AttachmentMetadata, message?: ChatMessage) => AttachmentMenuAction[];
  /**
   * Optional function to provide customized date format.
   * @beta
   */
  onDisplayDateTimeString?: (messageDate: Date) => string;
  /* @conditional-compile-remove(mention) */
  /**
   * Optional props needed to display suggestions in the mention scenario.
   * @internal
   */
  mentionDisplayOptions?: MentionDisplayOptions;
  /**
   * Optional callback called when an inline image is clicked.
   * @beta
   */
  inlineImageOptions?: InlineImageOptions;
};

/** @private */
const MessageBubble = (props: ChatMessageComponentAsMessageBubbleProps): JSX.Element => {
  const ids = useIdentifiers();
  const theme = useTheme();
  const locale = useLocale();

  const {
    userId,
    message,
    showDate,
    messageContainerStyle,
    strings,
    /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
    onRenderAttachmentDownloads,
    inlineImageOptions,
    shouldOverlapAvatarAndMessage,
    /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
    actionsForAttachment,
    /* @conditional-compile-remove(mention) */
    mentionDisplayOptions,
    onDisplayDateTimeString
  } = props;

  const formattedTimestamp = useMemo(() => {
    const defaultTimeStamp = message.createdOn
      ? generateDefaultTimestamp(message.createdOn, showDate, strings)
      : undefined;

    const customTimestamp = message.createdOn
      ? generateCustomizedTimestamp(message.createdOn, locale, onDisplayDateTimeString)
      : '';

    return customTimestamp || defaultTimeStamp;
  }, [locale, message.createdOn, onDisplayDateTimeString, showDate, strings]);

  const getMessageDetails = useCallback(() => {
    return getMessageEditedDetails(message, theme, strings.editedTag);
  }, [strings.editedTag, theme, message]);

  const getContent = useCallback(() => {
    return getMessageBubbleContent(
      message,
      strings,
      userId,
      inlineImageOptions,
      /* @conditional-compile-remove(mention) */
      mentionDisplayOptions,
      /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
      onRenderAttachmentDownloads,
      /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
      actionsForAttachment
    );
  }, [
    /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */ actionsForAttachment,
    inlineImageOptions,
    /* @conditional-compile-remove(mention) */ mentionDisplayOptions,
    message,
    /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */ onRenderAttachmentDownloads,
    strings,
    userId
  ]);

  const isBlockedMessage =
    false || /* @conditional-compile-remove(data-loss-prevention) */ message.messageType === 'blocked';
  const chatMessageCommonStyles = useChatMessageCommonStyles();
  /* @conditional-compile-remove(file-sharing-acs) */
  const hasMultipleAttachments = useMemo(() => {
    return doesMessageContainMultipleAttachments(message as ChatMessage);
  }, [message]);
  const chatMessageStyles = useChatMessageStyles();
  const chatItemMessageContainerClassName = mergeClasses(
    chatMessageCommonStyles.body,
    chatMessageStyles.body,
    // disable placeholder functionality for GA releases as it might confuse users
    chatMessageCommonStyles.bodyWithPlaceholderImage,
    isBlockedMessage
      ? chatMessageCommonStyles.blocked
      : props.message.status === 'failed'
        ? chatMessageCommonStyles.failed
        : undefined,
    shouldOverlapAvatarAndMessage ? chatMessageStyles.avatarOverlap : chatMessageStyles.avatarNoOverlap,
    /* @conditional-compile-remove(file-sharing-acs) */
    hasMultipleAttachments ? chatMessageStyles.multipleAttachments : undefined,
    message.attached === 'top' || message.attached === false
      ? chatMessageStyles.bodyWithAvatar
      : chatMessageStyles.bodyWithoutAvatar,
    // messageContainerStyle used in className and style prop as style prop can't handle CSS selectors
    mergeStyles(messageContainerStyle)
  );

  const attached = message.attached === true ? 'center' : message.attached === 'bottom' ? 'bottom' : 'top';
  const chatMessage = (
    <>
      <div key={props.message.messageId}>
        <FluentChatMessage
          attached={attached}
          key={props.message.messageId}
          root={{
            className: chatMessageStyles.root
          }}
          author={<Text className={chatMessageAuthorStyle}>{message.senderDisplayName}</Text>}
          body={{
            className: chatItemMessageContainerClassName,
            style: { ...createStyleFromV8Style(messageContainerStyle) }
          }}
          data-testid="chat-composite-message"
          timestamp={
            <Text
              className={
                props.message.status === 'failed' ? chatMessageDateFailedStyle(theme) : chatMessageDateStyle(theme)
              }
              data-ui-id={ids.messageTimestamp}
            >
              {formattedTimestamp}
            </Text>
          }
          details={getMessageDetails()}
        >
          {getContent()}
        </FluentChatMessage>
      </div>
    </>
  );
  return chatMessage;
};

/** @private */
export const ChatMessageComponentAsMessageBubble = React.memo(MessageBubble);
