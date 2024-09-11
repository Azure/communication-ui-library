// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useState } from 'react';
import { MessageThreadStrings, UpdateMessageCallback } from '../../MessageThread';
import { ChatMessage, ComponentSlotStyle, OnRenderAvatarCallback } from '../../../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../../types';
/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMenuAction } from '../../../types/Attachment';
/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadata } from '@internal/acs-ui-common';
/* @conditional-compile-remove(file-sharing-acs) */
import { MessageOptions } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentMetadataInProgress } from '@internal/acs-ui-common';
/* @conditional-compile-remove(mention) */
import { MentionOptions } from '../../MentionPopover';
import { InlineImageOptions } from '../ChatMessageContent';
import { ChatMyMessageComponentAsMessageBubble } from './ChatMyMessageComponentAsMessageBubble';
import { ChatMessageComponentAsEditBoxPicker } from './ChatMessageComponentAsEditBoxPicker';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { removeBrokenImageContentAndClearImageSizeStyles } from '../../utils/SendBoxUtils';

type ChatMyMessageComponentProps = {
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage;
  userId: string;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  disableEditing?: boolean;
  onUpdateMessage?: UpdateMessageCallback;
  onCancelEditMessage?: (messageId: string) => void;
  /**
   * Callback to delete a message. Also called before resending a message that failed to send.
   * @param messageId ID of the message to delete
   */
  onDeleteMessage?: (messageId: string) => Promise<void>;
  /**
   * Callback to send a message
   * @param content The message content to send
   */
  onSendMessage?: (
    content: string,
    /* @conditional-compile-remove(file-sharing-acs) */
    options?: MessageOptions
  ) => Promise<void>;
  strings: MessageThreadStrings;
  messageStatus?: string;
  /**
   * Optional text to display when the message status is 'failed'.
   */
  failureReason?: string;
  /**
   * Whether the status indicator for each message is displayed or not.
   */
  showMessageStatus?: boolean;
  /**
   * Whether to overlap avatar and message when the view is width constrained.
   */
  shouldOverlapAvatarAndMessage: boolean;
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
  /* @conditional-compile-remove(date-time-customization) */
  /**
   * Optional function to provide customized date format.
   * @beta
   */
  onDisplayDateTimeString?: (messageDate: Date) => string;
  /* @conditional-compile-remove(mention) */
  /**
   * Optional props needed to lookup suggestions and display mentions in the mention scenario.
   * @beta
   */
  mentionOptions?: MentionOptions;
  /**
   * Optional callback called when an inline image is clicked.
   * @beta
   */
  inlineImageOptions?: InlineImageOptions;
  /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional callback to render message attachments in the message component.
   * @beta
   */
  onRenderAttachmentDownloads?: (message: ChatMessage) => JSX.Element;
  /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional callback to define custom actions for attachments.
   * @beta
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
 * @private
 */
export const ChatMyMessageComponent = (props: ChatMyMessageComponentProps): JSX.Element => {
  const { onDeleteMessage, onSendMessage, message } = props;
  const [isEditing, setIsEditing] = useState(false);

  const onEditClick = useCallback(() => setIsEditing(true), [setIsEditing]);

  const clientMessageId = 'clientMessageId' in message ? message.clientMessageId : undefined;
  const content = 'content' in message ? message.content : undefined;
  const onRemoveClick = useCallback(() => {
    if (onDeleteMessage && message.messageId) {
      onDeleteMessage(message.messageId);
    }
    // when fail to send, message does not have message id, delete message using clientMessageId
    else if (onDeleteMessage && message.messageType === 'chat' && clientMessageId) {
      onDeleteMessage(clientMessageId);
    }
  }, [onDeleteMessage, message.messageId, message.messageType, clientMessageId]);

  const onResendClick = useCallback(() => {
    onDeleteMessage && clientMessageId && onDeleteMessage(clientMessageId);
    let newContent = content ?? '';
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    newContent = removeBrokenImageContentAndClearImageSizeStyles(newContent);
    onSendMessage &&
      onSendMessage(
        newContent,
        /* @conditional-compile-remove(file-sharing-acs) */
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        {
          /* @conditional-compile-remove(file-sharing-acs) */ attachments:
            `attachments` in message ? message.attachments : undefined,
          /* @conditional-compile-remove(rich-text-editor) */
          type: props.isRichTextEditorEnabled ? 'html' : 'text'
        }
      );
  }, [
    message,
    onDeleteMessage,
    clientMessageId,
    onSendMessage,
    content,
    /* @conditional-compile-remove(rich-text-editor) */ props.isRichTextEditorEnabled
  ]);

  const onSubmitHandler = useCallback(
    // due to a bug in babel, we can't use arrow function here
    // affecting conditional-compile-remove(attachment-upload)
    async function (
      text: string,
      /* @conditional-compile-remove(file-sharing-acs) */
      attachments?: AttachmentMetadata[] | undefined
    ) {
      /* @conditional-compile-remove(file-sharing-acs) */
      if (`attachments` in message && attachments) {
        message.attachments = attachments;
      }
      props.onUpdateMessage &&
        message.messageId &&
        (await props.onUpdateMessage(
          message.messageId,
          text,
          /* @conditional-compile-remove(file-sharing-acs) */
          { attachments: attachments }
        ));
      setIsEditing(false);
    },
    [message, props]
  );
  if (isEditing && message.messageType === 'chat') {
    return (
      <ChatMessageComponentAsEditBoxPicker
        message={message}
        strings={props.strings}
        onSubmit={onSubmitHandler}
        onCancel={(messageId) => {
          props.onCancelEditMessage && props.onCancelEditMessage(messageId);
          setIsEditing(false);
        }}
        /* @conditional-compile-remove(mention) */
        mentionLookupOptions={props.mentionOptions?.lookupOptions}
        /* @conditional-compile-remove(rich-text-editor) */
        isRichTextEditorEnabled={props.isRichTextEditorEnabled}
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        onPaste={props.onPaste}
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        onInsertInlineImage={props.onInsertInlineImage}
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        inlineImagesWithProgress={props.inlineImagesWithProgress}
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        onRemoveInlineImage={props.onRemoveInlineImage}
      />
    );
  } else {
    return (
      <ChatMyMessageComponentAsMessageBubble
        {...props}
        onRemoveClick={onRemoveClick}
        onEditClick={onEditClick}
        onResendClick={onResendClick}
        onRenderAvatar={props.onRenderAvatar}
        /* @conditional-compile-remove(date-time-customization) */
        onDisplayDateTimeString={props.onDisplayDateTimeString}
        strings={props.strings}
        inlineImageOptions={props.inlineImageOptions}
        /* @conditional-compile-remove(mention) */
        mentionDisplayOptions={props.mentionOptions?.displayOptions}
      />
    );
  }
};
