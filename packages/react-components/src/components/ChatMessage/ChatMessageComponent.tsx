// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ComponentSlotStyle } from '@fluentui/react-northstar';
import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useState } from 'react';
import { ChatMessageComponentAsEditBox } from './ChatMessageComponentAsEditBox';
import { MessageThreadStrings } from '../MessageThread';
import { ChatMessage } from '../../types';
import { ChatMessageComponentAsMessageBubble } from './ChatMessageComponentAsMessageBubble';
import { FileCard, FileCardGroup } from '..';
import { Icon } from '@fluentui/react';

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
};

/**
 * @private
 */
export const ChatMessageComponent = (props: ChatMessageComponentProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);

  const onEditClick = useCallback(() => setIsEditing(true), [setIsEditing]);

  console.log('MESSAGE META', props.message.content, props.message.metaData?.acsfiles);

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
      <div>
        <ChatMessageComponentAsMessageBubble {...props} onRemoveClick={onRemoveClick} onEditClick={onEditClick} />
        <FileCardGroup>
          {props.message.metaData?.acsfiles &&
            JSON.parse(props.message.metaData.acsfiles).map((file, idx) => (
              <div key={idx}>
                <FileCard
                  fileName={file.name}
                  fileExtension={file.extension}
                  actionIcon={<Icon iconName="Download" style={{ fontSize: '12px' }} />}
                  actionHandler={() => {
                    window.open(file.url, '_blank');
                  }}
                />
              </div>
            ))}
        </FileCardGroup>
      </div>
    );
  }
};
