// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useState } from 'react';
import { ChatMessageComponentAsEditBox } from './ChatMessageComponentAsEditBox';
import { MessageThreadStrings } from '../MessageThread';
import { ChatMessage, OnRenderAvatarCallback, BlockedMessage } from '../../types';
import { ChatMessageComponentAsMessageBubble } from './ChatMessageComponentAsMessageBubble';
import { FileDownloadHandler, FileMetadata } from '../FileDownloadCards';

type ChatMessageComponentProps = {
  message: ChatMessage | BlockedMessage;
  userId: string;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  disableEditing?: boolean;
  onUpdateMessage?: (
    messageId: string,
    content: string,
    metadata?: Record<string, string>,
    options?: {
      attachedFilesMetadata?: FileMetadata[];
    }
  ) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  /**
   * Optional callback called when message is sent
   */
  onSendMessage?: (content: string) => Promise<void>;
  strings: MessageThreadStrings;
  messageStatus?: string;
  /**
   * Whether the status indicator for each message is displayed or not.
   */
  showMessageStatus?: boolean;
  /**
   * Inline the accept and reject edit buttons when editing a message.
   * Setting to false will mean they are on a new line inside the editable chat message.
   */
  inlineAcceptRejectEditButtons: boolean;
  /**
   * Optional callback to render uploaded files in the message component.
   */
  onRenderFileDownloads?: (userId: string, message: ChatMessage) => JSX.Element;
  /**
   * Optional function called when someone clicks on the file download icon.
   */
  fileDownloadHandler?: FileDownloadHandler;
  remoteParticipantsCount?: number;
  onActionButtonClick: (
    message: ChatMessage,
    setMessageReadBy: (readBy: { id: string; displayName: string }[]) => void
  ) => void;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;

  /**
   * Optional function to provide customized date format.
   * @beta
   */
  onDisplayDateTimeString?: (messageDate: Date) => string;
};

/**
 * @private
 */
export const ChatMessageComponent = (props: ChatMessageComponentProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);

  const onEditClick = useCallback(() => setIsEditing(true), [setIsEditing]);

  const { onDeleteMessage, onSendMessage, message } = props;
  const onRemoveClick = useCallback(() => {
    if (onDeleteMessage && message.messageId) {
      onDeleteMessage(message.messageId);
    }
    // when fail to send, message does not have message id, delete message using clientmessageid
    else if (onDeleteMessage && message.clientMessageId) {
      onDeleteMessage(message.clientMessageId);
    }
  }, [message.messageId, message.clientMessageId, onDeleteMessage]);
  const onResendClick = useCallback(() => {
    onDeleteMessage && message.clientMessageId && onDeleteMessage(message.clientMessageId);
    onSendMessage && onSendMessage(message.content !== undefined && message.content !== false ? message.content : '');
  }, [message.clientMessageId, message.content, onSendMessage, onDeleteMessage]);

  if (isEditing && props.message.messageType === 'chat') {
    return (
      <ChatMessageComponentAsEditBox
        message={message as ChatMessage}
        inlineEditButtons={props.inlineAcceptRejectEditButtons}
        strings={props.strings}
        onSubmit={async (text, metadata, options) => {
          props.onUpdateMessage &&
            props.message.messageId &&
            (await props.onUpdateMessage(props.message.messageId, text, metadata, options));
          setIsEditing(false);
        }}
        onCancel={() => {
          setIsEditing(false);
        }}
      />
    );
  } else {
    return (
      <ChatMessageComponentAsMessageBubble
        {...props}
        onRemoveClick={onRemoveClick}
        onEditClick={onEditClick}
        onResendClick={onResendClick}
        onRenderAvatar={props.onRenderAvatar}
        /* @conditional-compile-remove(date-time-customization) */
        onDisplayDateTimeString={props.onDisplayDateTimeString}
        strings={props.strings}
      />
    );
  }
};
