// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(image-gallery) */
import { isIOS } from '@fluentui/react';
import { mergeStyles, Stack } from '@fluentui/react';
/* @conditional-compile-remove(image-gallery) */
import { PersonaSize } from '@fluentui/react';
import {
  CommunicationParticipant,
  ErrorBar,
  MessageProps,
  MessageRenderer,
  MessageThread,
  MessageThreadStyles,
  ParticipantMenuItemsCallback,
  SendBox,
  SendBoxStylesProps,
  TypingIndicator,
  TypingIndicatorStylesProps,
  useTheme
} from '@internal/react-components';
/* @conditional-compile-remove(image-gallery) */
import { ChatMessage } from '@internal/react-components';

import React, { useCallback, useEffect, useMemo } from 'react';
/* @conditional-compile-remove(image-gallery) */
import { useState } from 'react';

import { AvatarPersona, AvatarPersonaDataCallback } from '../common/AvatarPersona';

import { useAdapter } from './adapter/ChatAdapterProvider';
import { ChatCompositeOptions } from './ChatComposite';
import { ChatHeader, getHeaderProps } from './ChatHeader';
import { FileDownloadHandler } from '@internal/react-components';
import { FileUploadButtonWrapper as FileUploadButton, FileUploadHandler } from './file-sharing';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
import { usePropsFor } from './hooks/usePropsFor';

import {
  chatArea,
  chatContainer,
  chatWrapper,
  messageThreadChatCompositeStyles,
  sendboxContainerStyles,
  typingIndicatorContainerStyles
} from './styles/Chat.styles';
import { participantListContainerPadding } from '../common/styles/ParticipantContainer.styles';
/* @conditional-compile-remove(chat-composite-participant-pane) */
import { ChatScreenPeoplePane } from './ChatScreenPeoplePane';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
/* @conditional-compile-remove(file-sharing) */
import { fileUploadsSelector } from './selectors/fileUploadsSelector';
/* @conditional-compile-remove(file-sharing) */
import { useSelector } from './hooks/useSelector';
/* @conditional-compile-remove(file-sharing) */
import { FileDownloadErrorBar } from './FileDownloadErrorBar';
/* @conditional-compile-remove(file-sharing) */
import { _FileDownloadCards } from '@internal/react-components';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { AttachmentDownloadResult, FileMetadata } from '@internal/react-components';
/* @conditional-compile-remove(image-gallery) */
import { ImageGallery, ImageGalleryImageProps } from '@internal/react-components';
// import { Message } from '@internal/react-components';

/**
 * @private
 */
export type ChatScreenProps = {
  options?: ChatCompositeOptions;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onRenderMessage?: (messageProps: MessageProps, defaultOnRender?: MessageRenderer) => JSX.Element;
  onRenderTypingIndicator?: (typingUsers: CommunicationParticipant[]) => JSX.Element;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  styles?: ChatScreenStyles;
  hasFocusOnMount?: 'sendBoxTextField';
  fileSharing?: FileSharingOptions;
  formFactor?: 'desktop' | 'mobile';
};

/**
 * @private
 */
export type ChatScreenStyles = {
  messageThread?: MessageThreadStyles;
  sendBox?: SendBoxStylesProps;
  typingIndicator?: TypingIndicatorStylesProps;
};

/**
 * Properties for configuring the File Sharing feature.
 * @beta
 */
export interface FileSharingOptions {
  /**
   * A string containing the comma separated list of accepted file types.
   * Similar to the `accept` attribute of the `<input type="file" />` element.
   * Accepts any type of file if not specified.
   * @beta
   */
  accept?: string;
  /**
   * Allows multiple files to be selected if set to `true`.
   * Similar to the `multiple` attribute of the `<input type="file" />` element.
   * @defaultValue false
   * @beta
   */
  multiple?: boolean;
  /**
   * A function of type {@link FileUploadHandler} for handling file uploads.
   * @beta
   */
  uploadHandler: FileUploadHandler;
  /**
   * A function of type {@link FileDownloadHandler} for handling file downloads.
   * If the function is not specified, the file's `url` will be opened in a new tab to
   * initiate the download.
   */
  downloadHandler?: FileDownloadHandler;
}

/**
 * @private
 */
export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const {
    onFetchAvatarPersonaData,
    onRenderMessage,
    onRenderTypingIndicator,
    options,
    styles,
    fileSharing,
    formFactor
  } = props;

  const defaultNumberOfChatMessagesToReload = 5;
  /* @conditional-compile-remove(file-sharing) */
  const [downloadErrorMessage, setDownloadErrorMessage] = React.useState('');
  /* @conditional-compile-remove(image-gallery) */
  const [fullSizeAttachments, setFullSizeAttachments] = useState<Record<string, string>>({});
  /* @conditional-compile-remove(image-gallery) */
  const [galleryImages, setGalleryImages] = useState<Array<ImageGalleryImageProps>>([]);
  /* @conditional-compile-remove(image-gallery) */
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState<boolean>(false);

  const adapter = useAdapter();
  const theme = useTheme();

  // useEffect(() => {
  //   console.log('!!!!!!!useEffect empty render');
  // }, []);

  // useEffect(() => {
  //   console.log('!!!!!!!useEffect adapter', adapter);
  // }, [adapter]);
  useEffect(() => {
    console.log('!!!!!!!useEffect fetchData');
    // Initial data should be always fetched by the composite(or external caller) instead of the adapter
    const fetchData: () => Promise<void> = async () => {
      // Fetch initial data for adapter
      await adapter.fetchInitialData();
      // Fetch initial set of messages. Without fetching messages here, if the Composite's adapter is changed the message thread does not load new messages.
      await adapter.loadPreviousChatMessages(defaultNumberOfChatMessagesToReload);
    };
    fetchData();
  }, [adapter]);

  // console.log('!!!!!!!ChatScreen props ', props);
  const messageThreadProps = usePropsFor(MessageThread);
  // const [messages, setMessages] = useState<Message[]>(messageThreadProps.messages);
  const sendBoxProps = usePropsFor(SendBox);
  const typingIndicatorProps = usePropsFor(TypingIndicator);
  const headerProps = useAdaptedSelector(getHeaderProps);
  const errorBarProps = usePropsFor(ErrorBar);

  // useEffect(() => {
  //   console.log('!!!!!!!useEffect set messages ', messageThreadProps.messages);
  //   // setMessages(messageThreadProps.messages);
  // }, [messageThreadProps.messages]);

  useEffect(() => {
    console.log('!!!!!!!useEffect messageThreadProps ', messageThreadProps.messages);
  }, [messageThreadProps]);

  // useEffect(() => {
  //   console.log('!!!!!!!useEffect ChatScreen messages ', messages);
  // }, [messages]);

  const onRenderAvatarCallback = useCallback(
    (userId, defaultOptions) => {
      return (
        <AvatarPersona
          userId={userId}
          hidePersonaDetails={true}
          {...defaultOptions}
          dataProvider={onFetchAvatarPersonaData}
        />
      );
    },
    [onFetchAvatarPersonaData]
  );

  const messageThreadStyles = useMemo(() => {
    return Object.assign(
      {},
      messageThreadChatCompositeStyles(theme.semanticColors.bodyBackground),
      styles?.messageThread
    );
  }, [styles?.messageThread, theme.semanticColors.bodyBackground]);

  const typingIndicatorStyles = useMemo(() => {
    return Object.assign({}, styles?.typingIndicator);
  }, [styles?.typingIndicator]);
  const sendBoxStyles = useMemo(() => {
    return Object.assign({}, styles?.sendBox);
  }, [styles?.sendBox]);
  // const userId = useMemo(() => {
  //   console.log('!!!!!!!useMemo userId is it changed?', toFlatCommunicationIdentifier(adapter.getState().userId));
  //   return toFlatCommunicationIdentifier(adapter.getState().userId);
  // }, [adapter]);
  const userId = toFlatCommunicationIdentifier(adapter.getState().userId);

  const fileUploadButtonOnChange = useCallback(
    (files: FileList | null): void => {
      if (!files) {
        return;
      }

      /* @conditional-compile-remove(file-sharing) */
      const fileUploads = adapter.registerActiveFileUploads(Array.from(files));
      /* @conditional-compile-remove(file-sharing) */
      fileSharing?.uploadHandler(userId, fileUploads);
    },
    [adapter, fileSharing, userId]
  );

  /* @conditional-compile-remove(file-sharing) */
  const onRenderFileDownloads = useCallback(
    (userId, message) => (
      <_FileDownloadCards
        userId={userId}
        fileMetadata={message.attachedFilesMetadata || []}
        downloadHandler={fileSharing?.downloadHandler}
        onDownloadErrorMessage={(errorMessage: string) => {
          setDownloadErrorMessage(errorMessage);
        }}
      />
    ),
    [fileSharing?.downloadHandler]
  );

  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  const onRenderInlineAttachment = useCallback(
    async (attachment: FileMetadata[]): Promise<AttachmentDownloadResult[]> => {
      const entry: Record<string, string> = {};
      attachment.forEach((target) => {
        if (target.attachmentType === 'inlineImage' && target.previewUrl) {
          entry[target.id] = target.previewUrl;
        }
      });

      const blob = await adapter.downloadAttachments({ attachmentUrls: entry });
      return blob;
    },
    [adapter]
  );

  /* @conditional-compile-remove(image-gallery) */
  const onInlineImageClicked = useCallback(
    async (attachmentId: string, messageId: string): Promise<void> => {
      console.log('!!!!!!!onInlineImageClicked');
      const messages = messageThreadProps.messages?.filter((message) => {
        return message.messageId === messageId;
      });
      if (!messages || messages.length <= 0) {
        return;
      }
      const chatMessage = messages[0] as ChatMessage;

      const attachments = chatMessage.attachedFilesMetadata?.filter((attachment) => {
        return attachment.id === attachmentId;
      });

      if (!attachments || attachments.length <= 0) {
        return;
      }

      const attachment = attachments[0];
      attachment.name = chatMessage.senderDisplayName || '';

      const titleIconRenderOptions = {
        text: chatMessage.senderDisplayName,
        size: PersonaSize.size32,
        showOverflowTooltip: false,
        imageAlt: chatMessage.senderDisplayName
      };
      const titleIcon = onRenderAvatarCallback && onRenderAvatarCallback(chatMessage.senderId, titleIconRenderOptions);
      const galleryImage: ImageGalleryImageProps = {
        title: attachment.name,
        titleIcon: titleIcon,
        downloadFilename: attachment.id,
        imageUrl: ''
      };
      setIsImageGalleryOpen(true);

      if (attachment.id in fullSizeAttachments) {
        setGalleryImages([
          {
            ...galleryImage,
            imageUrl: fullSizeAttachments[attachment.id]
          }
        ]);
        return;
      }

      if (attachment.attachmentType === 'inlineImage' && attachment.url) {
        const blob = await adapter.downloadAttachments({ attachmentUrls: { [attachment.id]: attachment.url } });
        if (blob[0]) {
          const blobUrl = blob[0].blobUrl;
          setFullSizeAttachments((prev) => ({ ...prev, [attachment.id]: blobUrl }));
          setGalleryImages([
            {
              ...galleryImage,
              imageUrl: blobUrl
            }
          ]);
        }
      }
    },
    [adapter, fullSizeAttachments, messageThreadProps.messages, onRenderAvatarCallback]
  );

  /* @conditional-compile-remove(image-gallery) */
  const onImageDownloadButtonClicked = useCallback((imageUrl: string, downloadFilename: string): void => {
    if (imageUrl === '') {
      return;
    }
    if (isIOS()) {
      window.open(imageUrl, '_blank');
    } else {
      // Create a new anchor element
      const a = document.createElement('a');
      // Set the href and download attributes for the anchor element
      a.href = imageUrl;
      a.download = downloadFilename;
      a.rel = 'noopener noreferrer';
      a.target = '_blank';

      // Programmatically click the anchor element to trigger the download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, []);

  const AttachFileButton = useCallback(() => {
    if (!fileSharing?.uploadHandler) {
      return null;
    }
    return (
      <FileUploadButton
        accept={fileSharing?.accept}
        multiple={fileSharing?.multiple}
        onChange={fileUploadButtonOnChange}
      />
    );
  }, [fileSharing?.accept, fileSharing?.multiple, fileSharing?.uploadHandler, fileUploadButtonOnChange]);
  return (
    <Stack className={chatContainer} grow>
      {options?.topic !== false && <ChatHeader {...headerProps} />}
      <Stack className={chatArea} tokens={participantListContainerPadding} horizontal grow>
        <Stack className={chatWrapper} grow>
          {options?.errorBar !== false && <ErrorBar {...errorBarProps} />}
          {
            /* @conditional-compile-remove(file-sharing) */
            <FileDownloadErrorBar
              onDismissDownloadErrorMessage={useCallback(() => {
                setDownloadErrorMessage('');
              }, [])}
              fileDownloadErrorMessage={downloadErrorMessage || ''}
            />
          }
          <MessageThread
            {...messageThreadProps}
            onRenderAvatar={onRenderAvatarCallback}
            onRenderMessage={onRenderMessage}
            /* @conditional-compile-remove(file-sharing) */
            onRenderFileDownloads={onRenderFileDownloads}
            /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
            onFetchAttachments={onRenderInlineAttachment}
            /* @conditional-compile-remove(image-gallery) */
            onInlineImageClicked={onInlineImageClicked}
            numberOfChatMessagesToReload={defaultNumberOfChatMessagesToReload}
            styles={messageThreadStyles}
          />
          <Stack className={mergeStyles(sendboxContainerStyles)}>
            <div className={mergeStyles(typingIndicatorContainerStyles)}>
              {onRenderTypingIndicator ? (
                onRenderTypingIndicator(typingIndicatorProps.typingUsers)
              ) : (
                <TypingIndicator {...typingIndicatorProps} styles={typingIndicatorStyles} />
              )}
            </div>
            <Stack horizontal={formFactor === 'mobile'}>
              {formFactor === 'mobile' && (
                <Stack verticalAlign="center">
                  <AttachFileButton />
                </Stack>
              )}
              <Stack grow>
                <SendBox
                  {...sendBoxProps}
                  autoFocus={options?.autoFocus}
                  styles={sendBoxStyles}
                  /* @conditional-compile-remove(file-sharing) */
                  activeFileUploads={useSelector(fileUploadsSelector).files}
                  /* @conditional-compile-remove(file-sharing) */
                  onCancelFileUpload={adapter.cancelFileUpload}
                />
              </Stack>
              {formFactor !== 'mobile' && <AttachFileButton />}
            </Stack>
          </Stack>
        </Stack>
        {
          /* @conditional-compile-remove(chat-composite-participant-pane) */
          options?.participantPane === true && (
            <ChatScreenPeoplePane
              onFetchAvatarPersonaData={onFetchAvatarPersonaData}
              onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
              isMobile={formFactor === 'mobile'}
            />
          )
        }
      </Stack>
      {
        /* @conditional-compile-remove(image-gallery) */
        <ImageGallery
          isOpen={isImageGalleryOpen}
          images={galleryImages}
          onDismiss={() => {
            setGalleryImages([]);
            setIsImageGalleryOpen(false);
          }}
          onImageDownloadButtonClicked={onImageDownloadButtonClicked}
        />
      }
    </Stack>
  );
};
