// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(image-overlay) */
import { isIOS } from '@fluentui/react';
import { mergeStyles, Stack } from '@fluentui/react';
/* @conditional-compile-remove(image-overlay) */
import { PersonaSize } from '@fluentui/react';
import {
  CommunicationParticipant,
  ErrorBar,
  MessageProps,
  MessageRenderer,
  MessageThread,
  MessageThreadStyles,
  ParticipantMenuItemsCallback,
  SendBoxStylesProps,
  TypingIndicator,
  TypingIndicatorStylesProps,
  useTheme
} from '@internal/react-components';
/* @conditional-compile-remove(file-sharing) */
import { ChatMessage } from '@internal/react-components';
import React, { useCallback, useEffect, useMemo } from 'react';
/* @conditional-compile-remove(image-overlay) */
import { useState } from 'react';
import { AvatarPersona, AvatarPersonaDataCallback, AvatarPersonaProps } from '../common/AvatarPersona';
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
import { FileDownloadErrorBar } from './FileDownloadErrorBar';
/* @conditional-compile-remove(file-sharing) */
import { _FileDownloadCards } from '@internal/react-components';
/* @conditional-compile-remove(image-overlay) */
import { ImageOverlay } from '@internal/react-components';
/* @conditional-compile-remove(image-overlay) */
import { InlineImage } from '@internal/react-components';
import { SendBox } from '../common/SendBox';

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
/* @conditional-compile-remove(image-overlay) */
interface OverlayImageItem {
  imageSrc: string;
  title: string;
  titleIcon: JSX.Element;
  attachmentId: string;
  messageId: string;
  imageUrl: string;
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
  /* @conditional-compile-remove(image-overlay) */
  const [overlayImageItem, setOverlayImageItem] = useState<OverlayImageItem>();
  /* @conditional-compile-remove(image-overlay) */
  const [isImageOverlayOpen, setIsImageOverlayOpen] = useState<boolean>(false);

  const adapter = useAdapter();
  const theme = useTheme();

  useEffect(() => {
    // Initial data should be always fetched by the composite(or external caller) instead of the adapter
    const fetchData: () => Promise<void> = async () => {
      // Fetch initial data for adapter
      await adapter.fetchInitialData();
      // Fetch initial set of messages. Without fetching messages here, if the Composite's adapter is changed the message thread does not load new messages.
      await adapter.loadPreviousChatMessages(defaultNumberOfChatMessagesToReload);
    };
    fetchData();
  }, [adapter]);

  const messageThreadProps = usePropsFor(MessageThread);
  const typingIndicatorProps = usePropsFor(TypingIndicator);
  const headerProps = useAdaptedSelector(getHeaderProps);
  const errorBarProps = usePropsFor(ErrorBar);

  /* @conditional-compile-remove(image-overlay) */
  useEffect(() => {
    if (overlayImageItem === undefined) {
      return;
    }
    const message = adapter.getState().thread.chatMessages[overlayImageItem?.messageId];
    const resourceCache = message.resourceCache;
    if (overlayImageItem.imageSrc === '' && resourceCache) {
      const fullSizeImageSrc = resourceCache[overlayImageItem.imageUrl];
      if (fullSizeImageSrc === undefined || fullSizeImageSrc === '' || overlayImageItem.imageSrc === fullSizeImageSrc) {
        return;
      }
      setOverlayImageItem({
        ...overlayImageItem,
        imageSrc: fullSizeImageSrc
      });
    }
    // Disable eslint because we are using the overlayImageItem in this effect but don't want to have it as a dependency, as it will cause an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageThreadProps.messages]);

  const onRenderAvatarCallback = useCallback(
    (userId?: string, defaultOptions?: AvatarPersonaProps) => {
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
    (userId: string, message: ChatMessage) => (
      <_FileDownloadCards
        userId={userId}
        fileMetadata={message.files || []}
        downloadHandler={fileSharing?.downloadHandler}
        onDownloadErrorMessage={(errorMessage: string) => {
          setDownloadErrorMessage(errorMessage);
        }}
      />
    ),
    [fileSharing?.downloadHandler]
  );

  /* @conditional-compile-remove(image-overlay) */
  const onInlineImageClicked = useCallback(
    async (attachmentId: string, messageId: string): Promise<void> => {
      const message = adapter.getState().thread.chatMessages[messageId];
      const inlinedImages = message.content?.attachments?.filter((attachment) => {
        return attachment.attachmentType === 'image' && attachment.id === attachmentId;
      });

      if (!inlinedImages || inlinedImages.length <= 0) {
        return;
      }

      const attachment = inlinedImages[0];

      const resourceCache = message.resourceCache;
      let imageSrc = '';

      if (attachment.url) {
        if (resourceCache && resourceCache[attachment.url]) {
          imageSrc = resourceCache[attachment.url];
        } else {
          adapter.downloadResourceToCache({
            threadId: adapter.getState().thread.threadId,
            messageId: messageId,
            resourceUrl: attachment.url
          });
        }
      }

      const titleIconRenderOptions = {
        text: message.senderDisplayName,
        size: PersonaSize.size32,
        showOverflowTooltip: false,
        imageAlt: message.senderDisplayName
      };

      const messageSenderId = message.sender !== undefined ? toFlatCommunicationIdentifier(message.sender) : userId;
      const titleIcon = onRenderAvatarCallback && onRenderAvatarCallback(messageSenderId, titleIconRenderOptions);
      const overlayImage: OverlayImageItem = {
        title: message.senderDisplayName || '',
        titleIcon: titleIcon,
        attachmentId: attachment.id,
        imageSrc: imageSrc,
        messageId: messageId,
        imageUrl: attachment.url || ''
      };

      setIsImageOverlayOpen(true);
      setOverlayImageItem(overlayImage);
    },
    [adapter, onRenderAvatarCallback, userId]
  );

  /* @conditional-compile-remove(image-overlay) */
  const inlineImageOptions = {
    onRenderInlineImage: (
      inlineImage: InlineImage,
      defaultOnRender: (inlineImage: InlineImage) => JSX.Element
    ): JSX.Element => {
      const message = adapter.getState().thread.chatMessages[inlineImage.messageId];
      const attachments = message?.content?.attachments?.find(
        (attachment) => attachment.id === inlineImage.imgAttrs.id
      );

      if (attachments === undefined) {
        return defaultOnRender(inlineImage);
      }

      return (
        <span
          key={inlineImage.imgAttrs.id}
          onClick={() => onInlineImageClicked(inlineImage.imgAttrs.id || '', inlineImage.messageId)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onInlineImageClicked(inlineImage.imgAttrs.id || '', inlineImage.messageId);
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          {defaultOnRender(inlineImage)}
        </span>
      );
    }
  };

  /* @conditional-compile-remove(image-overlay) */
  const onDownloadButtonClicked = useCallback(
    (imageSrc: string): void => {
      if (imageSrc === '') {
        return;
      }
      if (isIOS()) {
        window.open(imageSrc, '_blank');
      } else {
        // Create a new anchor element
        const a = document.createElement('a');
        // Set the href and download attributes for the anchor element
        a.href = imageSrc;
        a.download = overlayImageItem?.attachmentId || '';
        a.rel = 'noopener noreferrer';
        a.target = '_blank';

        // Programmatically click the anchor element to trigger the download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
    [overlayImageItem?.attachmentId]
  );

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
            /* @conditional-compile-remove(image-overlay) */
            inlineImageOptions={inlineImageOptions}
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
                  options={options}
                  styles={styles?.sendBox}
                  /* @conditional-compile-remove(file-sharing) */
                  adapter={adapter}
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
        /* @conditional-compile-remove(image-overlay) */
        overlayImageItem && (
          <ImageOverlay
            {...overlayImageItem}
            isOpen={isImageOverlayOpen}
            onDismiss={() => {
              setOverlayImageItem(undefined);
              setIsImageOverlayOpen(false);
              adapter.removeResourceFromCache({
                threadId: adapter.getState().thread.threadId,
                messageId: overlayImageItem.messageId,
                resourceUrl: overlayImageItem.imageUrl
              });
            }}
            onDownloadButtonClicked={onDownloadButtonClicked}
          />
        )
      }
    </Stack>
  );
};
