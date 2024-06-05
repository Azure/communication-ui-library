import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React, { useCallback, useState } from 'react';
import { GetHistoryHTMLChatMessages } from './placeholdermessages';

export const MessageThreadWithRichTextEditorExample: () => JSX.Element = () => {
  const [messages, setMessages] = useState(GetHistoryHTMLChatMessages());
  const onUpdateMessage = useCallback(
    (messageId: string, content: string): Promise<void> => {
      const updatedMessages = messages;
      const index = updatedMessages.findIndex((m) => m.messageId === messageId);
      if (index === -1) {
        return Promise.reject('Message not found');
      }
      const message = updatedMessages[index];
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
      <MessageThread userId={'1'} richTextEditorOptions={{}} messages={messages} onUpdateMessage={onUpdateMessage} />
    </FluentThemeProvider>
  );
};
