// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useState } from 'react';
import { ChatMessageComponentAsEditBox } from './ChatMessageComponentAsEditBox';
import { MessageThreadStrings } from '../MessageThread';
import { ChatMessage } from '../../types';
import { ChatMessageComponentAsMessageBubble } from './ChatMessageComponentAsMessageBubble';
import { Stack } from '@fluentui/react';
import { chatMessageWrapperStyle } from '../styles/ChatMessageComponent.styles';

type ChatMessageComponentProps = {
  message: ChatMessage;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  disableEditing?: boolean;
  onUpdateMessage?: (messageId: string, content: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  strings: MessageThreadStrings;
  /**
   * Inline the accept and reject edit buttons when editing a message.
   * Setting to false will mean they are on a new line inside the editable chat message.
   */
  inlineAcceptRejectEditButtons: boolean;
  /**
   * Optional callback to render uploaded files in the message component.
   * @beta
   */
  onRenderAttachedFiles?: (userID, message) => JSX.Element;
  userId?: string;
};

/**
 * @private
 */
export const ChatMessageComponent = (props: ChatMessageComponentProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);

  const onEditClick = useCallback(() => setIsEditing(true), [setIsEditing]);

  const { onDeleteMessage, message } = props;
  const onRemoveClick = useCallback(() => {
    if (onDeleteMessage && message.messageId) {
      onDeleteMessage(message.messageId);
    }
  }, [message.messageId, onDeleteMessage]);

  if (props.message.messageType !== 'chat') {
    return <></>;
  } else if (isEditing) {
    return (
      <ChatMessageComponentAsEditBox
        initialValue={props.message.content ?? ''}
        inlineEditButtons={props.inlineAcceptRejectEditButtons}
        // onRenderUploadedFiles={props.onRenderUploadedFiles}
        strings={props.strings}
        onSubmit={async (text) => {
          props.onUpdateMessage &&
            props.message.messageId &&
            (await props.onUpdateMessage(props.message.messageId, text));
          setIsEditing(false);
        }}
        onCancel={() => {
          setIsEditing(false);
        }}
      />
    );
  } else {
    return (
      <Stack className={chatMessageWrapperStyle}>
        <ChatMessageComponentAsMessageBubble {...props} onRemoveClick={onRemoveClick} onEditClick={onEditClick} />
        {
          /* @conditional-compile-remove-from(stable): FILE_SHARING */
          props.onRenderAttachedFiles && props.onRenderAttachedFiles(props.userId, props.message)
        }
      </Stack>
    );
  }
};
