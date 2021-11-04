// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useState } from 'react';
import { ChatMessageComponentAsEditBox } from './ChatMessageComponentAsEditBox';
import { MessageThreadStrings } from '../MessageThread';
import { ChatMessage } from '../../types';
import { ChatMessageComponentAsMessageBubble } from './ChatMessageComponentAsMessageBubble';

type ChatMessageComponentProps = {
  message: ChatMessage;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  disableEditing?: boolean;
  onUpdateMessage?: (messageId: string, content: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  strings: MessageThreadStrings;
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
    return <ChatMessageComponentAsMessageBubble {...props} onRemoveClick={onRemoveClick} onEditClick={onEditClick} />;
  }
};
