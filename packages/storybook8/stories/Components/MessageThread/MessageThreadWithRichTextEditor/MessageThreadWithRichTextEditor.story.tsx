// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatMessage, FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React, { useCallback, useState } from 'react';
import { ArgsFrom } from '../../../controlsUtils';
import { GetHistoryHTMLChatMessages } from '../snippets/placeholdermessages';

const storyControls = {
  isEnableRTE: { control: 'boolean', name: 'Enable Rich Text Editor' }
};

const MessageThreadWithRichTextEditorStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  const [messages, setMessages] = useState(GetHistoryHTMLChatMessages());
  const onUpdateMessage = useCallback(
    (messageId: string, content: string): Promise<void> => {
      const updatedMessages = messages;
      const index = updatedMessages.findIndex((m) => m.messageId === messageId);
      if (index === -1) {
        return Promise.reject('Message not found');
      }
      const message = updatedMessages[index] as ChatMessage;
      message.content = content;
      message.editedOn = new Date(Date.now());
      updatedMessages[index] = message;
      setMessages(updatedMessages);

      return Promise.resolve();
    },
    [messages]
  );

  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        richTextEditorOptions={args.isEnableRTE ? {} : undefined}
        messages={messages}
        onUpdateMessage={onUpdateMessage}
      />
    </FluentThemeProvider>
  );
};

export const MessageThreadWithRichTextEditor = MessageThreadWithRichTextEditorStory.bind({});
