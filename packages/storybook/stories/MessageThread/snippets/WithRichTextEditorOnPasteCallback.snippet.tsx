import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React, { useCallback, useState } from 'react';
import { GetHistoryHTMLChatMessages } from './placeholdermessages';

const removeImageTags = (event: { content: DocumentFragment }): void => {
  event.content.querySelectorAll('img').forEach((image) => {
    // If the image is the only child of its parent, remove all the parents of this img element.
    let parentNode: HTMLElement | null = image.parentElement;
    let currentNode: HTMLElement = image;
    while (parentNode?.childNodes.length === 1) {
      currentNode = parentNode;
      parentNode = parentNode.parentElement;
    }
    currentNode?.remove();
  });
};

export const MessageThreadWithWithRichTextEditorOnPasteCallbackExample: () => JSX.Element = () => {
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
      <MessageThread
        userId={'1'}
        richTextEditorOptions={{ onPaste: removeImageTags }}
        messages={messages}
        onUpdateMessage={onUpdateMessage}
      />
    </FluentThemeProvider>
  );
};
