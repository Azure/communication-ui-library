import {
  AttachmentMetadataInProgress,
  FluentThemeProvider,
  MessageThread,
  RichTextEditBoxOptions
} from '@azure/communication-react';
import React, { useCallback, useMemo, useState } from 'react';
import { v1 as generateGUID } from 'uuid';
import { GetHistoryHTMLChatMessages } from './placeholdermessages';

export const MessageThreadWithRichTextEditorInlineImagesExample: () => JSX.Element = () => {
  const [messages, setMessages] = useState(GetHistoryHTMLChatMessages());
  const [messagesInlineImagesWithProgress, setMessagesInlineImagesWithProgress] = useState<
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
      setMessagesInlineImagesWithProgress(undefined);

      return Promise.resolve();
    },
    [messages]
  );

  const richTextEditorOptions: RichTextEditBoxOptions = useMemo(() => {
    return {
      onInsertInlineImage: (image: string, messageId: string, imageFileName?: string) => {
        const inlineImagesWithProgress = messagesInlineImagesWithProgress?.[messageId] ?? [];
        const id = generateGUID();
        const newImage: AttachmentMetadataInProgress = {
          id,
          name: imageFileName || 'image.png',
          progress: 1,
          url: image,
          error: undefined
        };
        setMessagesInlineImagesWithProgress({
          ...messagesInlineImagesWithProgress,
          [messageId]: [...inlineImagesWithProgress, newImage]
        });
      },
      messagesInlineImagesWithProgress: messagesInlineImagesWithProgress,
      onRemoveInlineImage: (imageAttributes: Record<string, string>, messageId: string) => {
        const inlineImagesWithProgress = messagesInlineImagesWithProgress?.[messageId];
        if (!inlineImagesWithProgress) {
          return;
        }
        const filteredImages = inlineImagesWithProgress.filter((img) => img.id !== imageAttributes.id);
        setMessagesInlineImagesWithProgress({ ...messagesInlineImagesWithProgress, [messageId]: filteredImages });
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
        onCancelEditMessage={() => setMessagesInlineImagesWithProgress(undefined)}
      />
    </FluentThemeProvider>
  );
};
