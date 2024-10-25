import {
  AttachmentMetadataInProgress,
  ChatMessage,
  FluentThemeProvider,
  MessageThread,
  RichTextEditBoxOptions
} from '@azure/communication-react';
import React, { useCallback, useMemo, useState } from 'react';
import { _DEFAULT_INLINE_IMAGE_FILE_NAME } from '../../../../../react-composites/src/composites/common/constants';
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
      const message = updatedMessages[index] as ChatMessage;
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
      onInsertInlineImage: (imageAttributes: Record<string, string>, messageId: string) => {
        const inlineImagesWithProgress = messagesInlineImagesWithProgress?.[messageId] ?? [];
        const id = imageAttributes.id;
        if (!id) {
          throw new Error('Image id is missing');
        }
        const newImage: AttachmentMetadataInProgress = {
          id,
          name: imageAttributes['data-image-file-name'] ?? _DEFAULT_INLINE_IMAGE_FILE_NAME,
          progress: 1,
          url: imageAttributes.src,
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
