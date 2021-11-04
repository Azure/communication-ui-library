// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { _formatString } from '@internal/acs-ui-common';
import React, { useState } from 'react';
import { ChatMessageComponentAsEditBox } from './ChatMessageComponentAsEditBox';
import { MessageThreadStrings } from './MessageThread';
import { ChatMessage } from '../types';
import { ChatMessageComponentAsMessage } from './ChatMessageComponentAsMessage';

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
export const EditableChatMessage = (props: ChatMessageComponentProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);

  if (props.message.messageType !== 'chat') {
    return <></>;
  } else if (isEditing) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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
    const onRemoveClick = async (): Promise<void | undefined> =>
      props.onDeleteMessage && props.message.messageId
        ? await props.onDeleteMessage(props.message.messageId)
        : undefined;
    return (
      <ChatMessageComponentAsMessage {...props} onRemoveClick={onRemoveClick} onEditClick={() => setIsEditing(true)} />
    );
  }
};
