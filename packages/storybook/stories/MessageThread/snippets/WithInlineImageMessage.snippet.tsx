import {
  FluentThemeProvider,
  MessageThread,
  Message,
  FileMetadata,
  AttachmentDownloadResult,
  ImageGalleryImageProps,
  ImageGallery,
  ChatMessage
} from '@azure/communication-react';
import { Persona, PersonaSize } from '@fluentui/react';
import React, { useState } from 'react';

export const MessageThreadWithInlineImageExample: () => JSX.Element = () => {
  const [galleryImages, setGalleryImages] = useState<Array<ImageGalleryImageProps>>([]);

  const onFetchAttachment = async (attachment: FileMetadata): Promise<AttachmentDownloadResult[]> => {
    // * Your custom function to fetch image behind authenticated blob storage/server
    // const response = await fetchImage(attachment.previewUrl ?? '', token);
    // const blob = await response.blob();

    // * Create a blob url as <img> src
    return [
      {
        attachmentId: attachment.id,
        // blobUrl: URL.createObjectURL(blob);
        blobUrl: attachment.attachmentType === 'inlineImage' ? attachment.previewUrl ?? '' : ''
      }
    ];
  };

  const onInlineImageClicked = (attachmentId: string, messageId: string): Promise<void> => {
    const filteredMessages = messages?.filter((message) => {
      return message.messageId === messageId;
    });
    if (!filteredMessages || filteredMessages.length <= 0) {
      return Promise.reject(`Message not found with messageId ${messageId}`);
    }
    const chatMessage = filteredMessages[0] as ChatMessage;

    const attachments = chatMessage.attachedFilesMetadata?.filter((attachment) => {
      return attachment.id === attachmentId;
    });

    if (!attachments || attachments.length <= 0) {
      return Promise.reject(`Attachment not found with id ${attachmentId}`);
    }

    const attachment = attachments[0];
    attachment.name = chatMessage.senderDisplayName || '';
    const title = 'Image';
    const titleIcon = (
      <Persona text={chatMessage.senderDisplayName} size={PersonaSize.size32} hidePersonaDetails={true} />
    );
    const galleryImage: ImageGalleryImageProps = {
      title,
      titleIcon,
      downloadFilename: attachment.id,
      imageUrl: attachment.url
    };
    setGalleryImages([galleryImage]);
    return Promise.resolve();
  };

  const messages: Message[] = [
    {
      messageType: 'chat',
      senderId: 'user3',
      content:
        '<p>How should I design my new house?</p><p><img alt="image" src="" itemscope="png" width="166.5625" height="250" id="SomeImageId1" style="vertical-align:bottom"></p><p><img alt="image" src="" itemscope="png" width="374.53183520599254" height="250" id="SomeImageId2" style="vertical-align:bottom"></p><p>&nbsp;</p>',
      senderDisplayName: 'Miguel Garcia',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'html',
      attachedFilesMetadata: [
        {
          id: 'SomeImageId1',
          name: 'SomeImageId1',
          attachmentType: 'inlineImage',
          extension: 'png',
          url: 'images/inlineImageExample1.png',
          previewUrl: 'images/inlineImageExample1.png'
        },
        {
          id: 'SomeImageId2',
          name: 'SomeImageId2',
          attachmentType: 'inlineImage',
          extension: 'png',
          url: 'images/inlineImageExample2.png',
          previewUrl: 'images/inlineImageExample2.png'
        }
      ]
    },
    {
      messageType: 'chat',
      senderId: 'user2',
      senderDisplayName: 'Robert Tolbert',
      messageId: Math.random().toString(),
      content: 'Cool, I love the second one!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: true,
      attached: false,
      contentType: 'text'
    }
  ];
  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        messages={messages}
        onFetchAttachments={onFetchAttachment}
        onInlineImageClicked={onInlineImageClicked}
      />
      {
        <ImageGallery
          isOpen={galleryImages.length > 0}
          images={galleryImages}
          onDismiss={() => setGalleryImages([])}
          onImageDownloadButtonClicked={() => {
            alert('Download button clicked');
          }}
        />
      }
    </FluentThemeProvider>
  );
};
