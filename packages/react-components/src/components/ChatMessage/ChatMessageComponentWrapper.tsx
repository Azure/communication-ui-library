// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageStatus } from '@internal/acs-ui-common';
import React, { useMemo } from 'react';
import { MessageProps, MessageRenderer, MessageThreadStyles, _ChatMessageProps } from '../MessageThread';
import { ChatMessage, OnRenderAvatarCallback } from '../../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../types';
/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMenuAction } from '../../types/Attachment';
/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadata } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentMetadataInProgress } from '@internal/acs-ui-common';
/* @conditional-compile-remove(mention) */
import { MentionOptions } from '../MentionPopover';
import { MessageStatusIndicatorProps } from '../MessageStatusIndicator';
import { FluentChatMessageComponentWrapperProps } from './MessageComponents/FluentChatMessageComponent';
import { DefaultSystemMessage } from './DefaultSystemMessage';
import { InlineImageOptions } from './ChatMessageContent';
import { FluentChatMyMessageComponent } from './MyMessageComponents/FluentChatMyMessageComponent';
import { FluentChatMessageComponent } from './MessageComponents/FluentChatMessageComponent';

/**
 * Props for {@link ChatMessageComponentWrapper}
 *
 * @private
 */
export type ChatMessageComponentWrapperProps = _ChatMessageProps & {
  /**
   * UserId of the current user.
   */
  userId: string;
  styles: MessageThreadStyles | undefined;
  shouldOverlapAvatarAndMessage: boolean;
  onRenderMessageStatus: ((messageStatusIndicatorProps: MessageStatusIndicatorProps) => JSX.Element | null) | undefined;
  defaultStatusRenderer: (
    message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage,
    participantCount: number,
    readCount: number,
    status?: MessageStatus
  ) => JSX.Element;
  onRenderMessage?: (messageProps: MessageProps, messageRenderer?: MessageRenderer) => JSX.Element;
  onRenderAvatar?: OnRenderAvatarCallback;
  showMessageStatus?: boolean;
  participantCount?: number;
  readCount?: number;
  onActionButtonClick: (
    message: ChatMessage,
    setMessageReadBy: (
      readBy: {
        id: string;
        displayName: string;
      }[]
    ) => void
  ) => void;
  /* @conditional-compile-remove(date-time-customization) */
  onDisplayDateTimeString?: (messageDate: Date) => string;
  inlineImageOptions?: InlineImageOptions;
  /* @conditional-compile-remove(mention) */
  mentionOptions?: MentionOptions;
  /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
  onRenderAttachmentDownloads?: (message: ChatMessage) => JSX.Element;
  /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional callback to define custom actions for attachments.
   */
  actionsForAttachment?: (attachment: AttachmentMetadata, message?: ChatMessage) => AttachmentMenuAction[];
  /* @conditional-compile-remove(rich-text-editor) */
  isRichTextEditorEnabled?: boolean;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onPaste?: (event: { content: DocumentFragment }) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onRemoveInlineImage?: (imageAttributes: Record<string, string>, messageId: string) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onInsertInlineImage?: (imageAttributes: Record<string, string>, messageId: string) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  inlineImagesWithProgress?: AttachmentMetadataInProgress[];
};

/**
 * The wrapper component to display different types of chat message.
 *
 * @private
 */
export const ChatMessageComponentWrapper = (props: ChatMessageComponentWrapperProps): JSX.Element => {
  const { message, styles, onRenderMessage, key: messageKey } = props;

  const systemMessageStyle = useMemo(() => {
    return {
      paddingTop: '0.5rem'
    };
  }, []);

  const customMessageStyle = useMemo(() => {
    return { paddingTop: '1rem', paddingBottom: '0.25rem' };
  }, []);

  /* @conditional-compile-remove(data-loss-prevention) */
  // Similar logic as switch statement case 'chat', if statement for conditional compile (merge logic to switch case when stabilize)
  if (message.messageType === 'blocked') {
    const myChatMessageStyle =
      message.status === 'failed'
        ? styles?.failedMyChatMessageContainer ?? styles?.myChatMessageContainer
        : styles?.myChatMessageContainer;
    const blockedMessageStyle = styles?.blockedMessageContainer;
    const messageContainerStyle = message.mine ? myChatMessageStyle : blockedMessageStyle;
    return fluentChatComponent({ ...props, message: message, messageContainerStyle: messageContainerStyle });
  }

  switch (message.messageType) {
    case 'chat': {
      const myChatMessageStyle =
        message.status === 'failed'
          ? styles?.failedMyChatMessageContainer ?? styles?.myChatMessageContainer
          : styles?.myChatMessageContainer;
      const chatMessageStyle = styles?.chatMessageContainer;
      const messageContainerStyle = message.mine ? myChatMessageStyle : chatMessageStyle;
      return fluentChatComponent({ ...props, message: message, messageContainerStyle: messageContainerStyle });
    }

    case 'system': {
      const messageContainerStyle = styles?.systemMessageContainer;
      const systemMessageComponent =
        onRenderMessage === undefined ? (
          <DefaultSystemMessage {...props} />
        ) : (
          onRenderMessage({ ...props, messageContainerStyle }, (props) => <DefaultSystemMessage {...props} />)
        );
      return (
        <div key={messageKey} style={systemMessageStyle}>
          {systemMessageComponent}
        </div>
      );
    }

    default: {
      // We do not handle custom type message by default, users can handle custom type by using onRenderMessage function.
      const customMessageComponent = onRenderMessage === undefined ? <></> : onRenderMessage({ ...props });
      return (
        <div key={messageKey} style={customMessageStyle}>
          {customMessageComponent}
        </div>
      );
    }
  }
};

const fluentChatComponent = (props: FluentChatMessageComponentWrapperProps): JSX.Element => {
  if (props.message.mine === true) {
    return <FluentChatMyMessageComponent {...props} />;
  } else {
    return <FluentChatMessageComponent {...props} />;
  }
};
