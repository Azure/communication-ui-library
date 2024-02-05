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
  SendBox,
  SendBoxStylesProps,
  TypingIndicator,
  TypingIndicatorStylesProps,
  useTheme
} from '@internal/react-components';
/* @conditional-compile-remove(image-overlay) */ /* @conditional-compile-remove(file-sharing) */
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
import { fileUploadsSelector } from './selectors/fileUploadsSelector';
/* @conditional-compile-remove(file-sharing) */
import { useSelector } from './hooks/useSelector';
/* @conditional-compile-remove(file-sharing) */
import { FileDownloadErrorBar } from './FileDownloadErrorBar';
/* @conditional-compile-remove(file-sharing) */
import { _FileDownloadCards } from '@internal/react-components';
/* @conditional-compile-remove(image-overlay) */
import { ImageOverlay } from '@internal/react-components';
/* @conditional-compile-remove(image-overlay) */
import { InlineImage } from '@internal/react-components';

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
  /* @conditional-compile-remove(image-overlay) */
  const [fullSizeAttachments, setFullSizeAttachments] = useState<Record<string, string>>({});
  /* @conditional-compile-remove(image-overlay) */
  const [overlayImageItem, setOverlayImageItem] =
    useState<{ imageSrc: string; title: string; titleIcon: JSX.Element; downloadFilename: string }>();
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
  const sendBoxProps = usePropsFor(SendBox);
  const typingIndicatorProps = usePropsFor(TypingIndicator);
  const headerProps = useAdaptedSelector(getHeaderProps);
  const errorBarProps = usePropsFor(ErrorBar);

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
  const sendBoxStyles = useMemo(() => {
    return Object.assign({}, styles?.sendBox);
  }, [styles?.sendBox]);
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
      const messages = messageThreadProps.messages?.filter((message) => {
        return message.messageId === messageId;
      });
      if (!messages || messages.length <= 0) {
        return;
      }
      const chatMessage = messages[0] as ChatMessage;

      const inlinedImages = chatMessage.inlineImages?.filter((attachment) => {
        return attachment.id === attachmentId;
      });

      if (!inlinedImages || inlinedImages.length <= 0) {
        return;
      }

      const attachment = inlinedImages[0];

      const titleIconRenderOptions = {
        text: chatMessage.senderDisplayName,
        size: PersonaSize.size32,
        showOverflowTooltip: false,
        imageAlt: chatMessage.senderDisplayName
      };
      const titleIcon = onRenderAvatarCallback && onRenderAvatarCallback(chatMessage.senderId, titleIconRenderOptions);
      const overlayImage = {
        title: chatMessage.senderDisplayName || '',
        titleIcon: titleIcon,
        downloadFilename: attachment.id,
        imageSrc: ''
      };
      setIsImageOverlayOpen(true);

      if (attachment.id in fullSizeAttachments) {
        setOverlayImageItem({
          ...overlayImage,
          imageSrc: fullSizeAttachments[attachment.id]
        });
        return;
      }

      if (attachment.attachmentType === 'inlineImage' && attachment.url) {
        // TBD: Need to begin investigating how to download HQ images.
        const blob = await adapter.downloadAttachment({ attachmentUrl: attachment.url });
        if (blob) {
          const blobUrl = blob.blobUrl;
          setFullSizeAttachments((prev) => ({ ...prev, [attachment.id]: blobUrl }));
          setOverlayImageItem({
            ...overlayImage,
            imageSrc: blobUrl
          });
        }
      }
    },
    [adapter, fullSizeAttachments, messageThreadProps.messages, onRenderAvatarCallback]
  );

  /* @conditional-compile-remove(image-overlay) */
  const inlineImageOptions = {
    onRenderInlineImage: (
      inlineImage: InlineImage,
      defaultOnRender: (inlineImage: InlineImage) => JSX.Element
    ): JSX.Element => {
      return (
        <span
          onClick={() => onInlineImageClicked(inlineImage.imgAttrs.id || '', inlineImage.messageId)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onInlineImageClicked(inlineImage.imgAttrs.id || '', inlineImage.messageId);
            }
          }}
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
        a.download = overlayImageItem?.downloadFilename || '';
        a.rel = 'noopener noreferrer';
        a.target = '_blank';

        // Programmatically click the anchor element to trigger the download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
    [overlayImageItem?.downloadFilename]
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
        /* @conditional-compile-remove(image-overlay) */
        overlayImageItem && (
          <ImageOverlay
            {...overlayImageItem}
            isOpen={isImageOverlayOpen}
            onDismiss={() => {
              setOverlayImageItem(undefined);
              setIsImageOverlayOpen(false);
            }}
            onDownloadButtonClicked={onDownloadButtonClicked}
          />
        )
      }
    </Stack>
  );
};
