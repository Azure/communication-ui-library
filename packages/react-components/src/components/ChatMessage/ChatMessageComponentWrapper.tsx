// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageStatus } from '@internal/acs-ui-common';
import React, { useMemo } from 'react';
import { MessageProps, MessageRenderer, MessageThreadStyles, _ChatMessageProps } from '../MessageThread';
import { ChatMessage, OnRenderAvatarCallback } from '../../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../types';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { FileDownloadHandler, FileMetadata } from '../FileDownloadCards';
/* @conditional-compile-remove(mention) */
import { MentionOptions } from '../MentionPopover';
import { MessageStatusIndicatorProps } from '../MessageStatusIndicator';
import { FluentChatMessageComponentWrapper } from './FluentChatMessageComponentWrapper';
import { DefaultSystemMessage } from './DefaultSystemMessage';

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
  /* @conditional-compile-remove(file-sharing) */
  onRenderFileDownloads?: (userId: string, message: ChatMessage) => JSX.Element;
  onActionButtonClick: (
    message: ChatMessage,
    setMessageReadBy: (
      readBy: {
        id: string;
        displayName: string;
      }[]
    ) => void
  ) => void;
  /* @conditional-compile-remove(file-sharing) */
  fileDownloadHandler?: FileDownloadHandler;
  /* @conditional-compile-remove(date-time-customization) */
  onDisplayDateTimeString?: (messageDate: Date) => string;
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  onFetchInlineAttachment: (attachments: FileMetadata[], messageId: string) => Promise<void>;
  /* @conditional-compile-remove(image-gallery) */
  onInlineImageClicked?: (attachmentId: string, messageId: string) => Promise<void>;
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  inlineAttachments: Record<string, Record<string, string>>;
  /* @conditional-compile-remove(mention) */
  mentionOptions?: MentionOptions;
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
    return (
      <FluentChatMessageComponentWrapper {...props} message={message} messageContainerStyle={messageContainerStyle} />
    );
  }

  switch (message.messageType) {
    case 'chat': {
      const myChatMessageStyle =
        message.status === 'failed'
          ? styles?.failedMyChatMessageContainer ?? styles?.myChatMessageContainer
          : styles?.myChatMessageContainer;
      const chatMessageStyle = styles?.chatMessageContainer;
      const messageContainerStyle = message.mine ? myChatMessageStyle : chatMessageStyle;
      return (
        <FluentChatMessageComponentWrapper {...props} message={message} messageContainerStyle={messageContainerStyle} />
      );
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
