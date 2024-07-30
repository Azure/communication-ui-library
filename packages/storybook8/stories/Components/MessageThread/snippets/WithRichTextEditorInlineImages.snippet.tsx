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
  const [messagesInlineImagesWithProgress, setMessagesInlineImages] = useState<
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
      onInsertInlineImage: (image: string, messageId: string, imageFileName?: string) => {
        const inlineImages = messagesInlineImagesWithProgress?.[messageId] ?? [];
        const id = Math.floor(Math.random() * 1000000).toString();
        const newImage: AttachmentMetadataInProgress = {
          id,
          name: imageFileName || 'image.png',
          progress: 1,
          url: image,
          error: undefined
        };
        setMessagesInlineImages({ ...messagesInlineImagesWithProgress, [messageId]: [...inlineImages, newImage] });
      },
      messagesInlineImagesWithProgress: messagesInlineImagesWithProgress,
      onRemoveInlineImage: (imageAttributes: Record<string, string>, messageId: string) => {
        const inlineImages = messagesInlineImagesWithProgress?.[messageId];
        if (!inlineImages) {
          return;
        }
        const filteredImages = inlineImages.filter((img) => img.id !== imageAttributes.id);
        setMessagesInlineImages({ ...messagesInlineImagesWithProgress, [messageId]: filteredImages });
      }
    };
  }, [messagesInlineImagesWithProgress]);

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
