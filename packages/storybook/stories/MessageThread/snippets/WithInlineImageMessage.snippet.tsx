import {
  FluentThemeProvider,
  MessageThread,
  Message,
  FileMetadata,
  AttachmentDownloadResult,
  ImageGalleryImageProps,
  ImageGallery
} from '@azure/communication-react';
import React, { useState } from 'react';

export const MessageThreadWithInlineImageExample: () => JSX.Element = () => {
  const [galleryImages, setGalleryImages] = useState<Array<ImageGalleryImageProps> | undefined>(undefined);

  const onFetchAttachment = async (attachment: FileMetadata): Promise<AttachmentDownloadResult[]> => {
    // * Your custom function to fetch image behind authenticated blob storage/server
    // const response = await fetchImage(attachment.previewUrl ?? '', token);
    // const blob = await response.blob();

    // * Create a blob url as <img> src
    return [
      {
        // blobUrl: URL.createObjectURL(blob);
        blobUrl: attachment.attachmentType === 'inlineImage' ? attachment.previewUrl ?? '' : ''
      }
    ];
  };

  const onInlineImageClicked = (attachment: FileMetadata): Promise<void> => {
    const title = 'Image';
    const galleryImage: ImageGalleryImageProps = {
      title: title,
      saveAsName: attachment.id,
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
      {galleryImages && galleryImages.length > 0 && (
        <ImageGallery
          images={galleryImages}
          onDismiss={() => setGalleryImages(undefined)}
          onImageDownloadButtonClicked={() => {
            alert('Download button clicked');
          }}
        />
      )}
    </FluentThemeProvider>
  );
};
