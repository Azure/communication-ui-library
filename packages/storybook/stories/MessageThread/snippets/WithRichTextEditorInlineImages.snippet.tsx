import {
  AttachmentMetadataInProgress,
  FluentThemeProvider,
  MessageThread,
  RichTextEditBoxOptions
} from '@azure/communication-react';
import React, { useCallback, useMemo, useState } from 'react';
import { GetHistoryHTMLChatMessages } from './placeholdermessages';

export const MessageThreadWithRichTextEditorInlineImagesExample: () => JSX.Element = () => {
  const [messages, setMessages] = useState(GetHistoryHTMLChatMessages());
  const [messagesInlineImages, setMessagesInlineImages] = useState<
    Record<string, AttachmentMetadataInProgress[]> | undefined
  >();

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
      setMessagesInlineImages(undefined);

      return Promise.resolve();
    },
    [messages]
  );

  const richTextEditorOptions: RichTextEditBoxOptions = useMemo(() => {
    return {
      onInsertInlineImage: (image: string, messageId: string) => {
        const inlineImages = messagesInlineImages?.[messageId] ?? [];
        const id = Math.floor(Math.random() * 1000000).toString();
        const newImage: AttachmentMetadataInProgress = {
          id,
          name: 'image',
          progress: 1,
          url: image,
          error: undefined
        };
        setMessagesInlineImages({ ...messagesInlineImages, [messageId]: [...inlineImages, newImage] });
      },
      messageInlineImages: messagesInlineImages,
      onCancelInlineImageUpload: (image: string, messageId: string) => {
        const inlineImages = messagesInlineImages?.[messageId];
        if (!inlineImages) {
          return;
        }
        const filteredImages = inlineImages.filter((img) => img.url !== image);
        setMessagesInlineImages({ ...messagesInlineImages, [messageId]: filteredImages });
      }
    };
  }, [messagesInlineImages]);

  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        richTextEditorOptions={richTextEditorOptions}
        messages={messages}
        onUpdateMessage={onUpdateMessage}
        onCancelEditMessage={() => setMessagesInlineImages(undefined)}
      />
    </FluentThemeProvider>
  );
};
