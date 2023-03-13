// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useState } from 'react';
import { ChatMessageComponentAsEditBox } from './ChatMessageComponentAsEditBox';
import { MessageThreadStrings } from '../MessageThread';
import { ChatMessage, OnRenderAvatarCallback } from '../../types';
import { ChatMessageComponentAsMessageBubble } from './ChatMessageComponentAsMessageBubble';
import { FileDownloadHandler, FileMetadata } from '../FileDownloadCards';

type ChatMessageComponentProps = {
  message: ChatMessage;
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
  /**
   * Callback to delete a message. Also called before resending a message that failed to send.
   * @param messageId ID of the message to delete
   */
  onDeleteMessage?: (messageId: string) => Promise<void>;
  /**
   * Callback to send a message
   * @param content The message content to send
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
    onSendMessage && onSendMessage(message.content ?? '');
  }, [message.clientMessageId, message.content, onSendMessage, onDeleteMessage]);

  if (props.message.messageType !== 'chat') {
    return <></>;
  } else if (isEditing) {
    return (
      <ChatMessageComponentAsEditBox
        message={message}
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
