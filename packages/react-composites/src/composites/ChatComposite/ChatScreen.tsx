// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { isIOS } from '@fluentui/react';
import { mergeStyles, Stack } from '@fluentui/react';
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
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { ChatMessage } from '@internal/react-components';
import React, { useCallback, useEffect, useMemo } from 'react';
/* @conditional-compile-remove(attachment-upload) */
import { useReducer } from 'react';
import { useState } from 'react';
import { AvatarPersona, AvatarPersonaDataCallback, AvatarPersonaProps } from '../common/AvatarPersona';
import { useAdapter } from './adapter/ChatAdapterProvider';
import { ChatCompositeOptions } from './ChatComposite';
import { ChatHeader, getHeaderProps } from './ChatHeader';
/* @conditional-compile-remove(attachment-upload) */
import { AttachmentUploadButtonWrapper as AttachmentUploadButton } from './file-sharing';
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
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { AttachmentDownloadErrorBar } from './AttachmentDownloadErrorBar';
import { _AttachmentDownloadCards } from '@internal/react-components';
import { ImageOverlay } from '@internal/react-components';
import { InlineImage } from '@internal/react-components';
import { ResourceFetchResult } from '@internal/chat-stateful-client';
import { AttachmentOptions } from '@internal/react-components';
import { SendBox } from '@internal/react-components';
/* @conditional-compile-remove(attachment-upload) */
import { nanoid } from 'nanoid';
/* @conditional-compile-remove(attachment-upload) */
import { AttachmentUploadActionType, AttachmentUpload, AttachmentUploadReducer } from './file-sharing/AttachmentUpload';
/* @conditional-compile-remove(attachment-upload) */
import { MessageOptions } from '@internal/acs-ui-common';

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
  attachmentOptions?: AttachmentOptions;
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
 * @private
 */
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
    attachmentOptions,
    formFactor
  } = props;

  const defaultNumberOfChatMessagesToReload = 5;
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  const [downloadErrorMessage, setDownloadErrorMessage] = React.useState('');
  const [overlayImageItem, setOverlayImageItem] = useState<OverlayImageItem>();
  const [isImageOverlayOpen, setIsImageOverlayOpen] = useState<boolean>(false);
  /* @conditional-compile-remove(attachment-upload) */
  const [uploads, handleUploadAction] = useReducer(AttachmentUploadReducer, []);

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

  useEffect(() => {
    if (overlayImageItem === undefined) {
      return;
    }
    const message = adapter.getState().thread.chatMessages[overlayImageItem.messageId];
    if (message === undefined) {
      return;
    }
    const resourceCache = message.resourceCache;
    if (overlayImageItem.imageSrc === '' && resourceCache && resourceCache[overlayImageItem.imageUrl]) {
      const fullSizeImageSrc = getResourceSourceUrl(resourceCache[overlayImageItem.imageUrl]);
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

  const getResourceSourceUrl = (result: ResourceFetchResult): string => {
    let src = '';
    if (result.error || !result.sourceUrl) {
      src = 'blob://';
    } else {
      src = result.sourceUrl;
    }

    return src;
  };

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

  /* @conditional-compile-remove(attachment-upload) */
  const attachmentUploadButtonOnChange = useCallback(
    (files: FileList | null): void => {
      if (!files) {
        return;
      }

      // Get files, change to tasks, store locally and pass back to Contoso
      const newUploads = Array.from(files).map((file): AttachmentUpload => {
        const taskId = nanoid();
        return {
          file,
          taskId,
          metadata: {
            id: taskId,
            name: file.name,
            progress: 0
          },
          notifyUploadProgressChanged: (value: number) => {
            handleUploadAction({ type: AttachmentUploadActionType.Progress, taskId, progress: value });
          },
          notifyUploadCompleted: (id: string, url: string) => {
            handleUploadAction({ type: AttachmentUploadActionType.Completed, taskId, id, url });
          },
          notifyUploadFailed: (message: string) => {
            handleUploadAction({ type: AttachmentUploadActionType.Failed, taskId, message });
            // remove the failed upload task when error banner is auto dismissed after 10 seconds
            // so the banner won't be shown again on UI re-rendering.
            setTimeout(() => {
              handleUploadAction({ type: AttachmentUploadActionType.Remove, id: taskId });
            }, 10 * 1000);
          }
        };
      });

      handleUploadAction({ type: AttachmentUploadActionType.Set, newUploads });
      attachmentOptions?.uploadOptions?.handleAttachmentSelection(newUploads);
    },
    [attachmentOptions?.uploadOptions]
  );

  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  const onRenderAttachmentDownloads = useCallback(
    (message: ChatMessage) =>
      message?.attachments?.length ?? 0 > 0 ? (
        <_AttachmentDownloadCards
          attachments={message.attachments}
          message={message}
          actionsForAttachment={attachmentOptions?.downloadOptions?.actionsForAttachment}
          onActionHandlerFailed={(errorMessage: string) => {
            setDownloadErrorMessage(errorMessage);
          }}
        />
      ) : (
        <></>
      ),
    [attachmentOptions?.downloadOptions?.actionsForAttachment]
  );

  const onInlineImageClicked = useCallback(
    (attachmentId: string, messageId: string) => {
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
          imageSrc = getResourceSourceUrl(resourceCache[attachment.url]);
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

  const onRenderInlineImage = useCallback(
    (inlineImage: InlineImage, defaultOnRender: (inlineImage: InlineImage) => JSX.Element): JSX.Element => {
      const message = adapter.getState().thread.chatMessages[inlineImage.messageId];
      const attachment = message?.content?.attachments?.find(
        (attachment) => attachment.id === inlineImage.imageAttributes.id
      );

      if (attachment === undefined) {
        return defaultOnRender(inlineImage);
      }

      let pointerEvents: 'none' | 'auto' = inlineImage.imageAttributes.src === '' ? 'none' : 'auto';
      const resourceCache = message.resourceCache;
      if (
        resourceCache &&
        attachment.previewUrl &&
        resourceCache[attachment.previewUrl] &&
        resourceCache[attachment.previewUrl].error
      ) {
        pointerEvents = 'none';
      }

      return (
        <span
          key={inlineImage.imageAttributes.id}
          onClick={() => onInlineImageClicked(inlineImage.imageAttributes.id || '', inlineImage.messageId)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onInlineImageClicked(inlineImage.imageAttributes.id || '', inlineImage.messageId);
            }
          }}
          style={{ cursor: 'pointer', pointerEvents }}
        >
          {defaultOnRender(inlineImage)}
        </span>
      );
    },
    [adapter, onInlineImageClicked]
  );

  const inlineImageOptions = useMemo(() => {
    return { onRenderInlineImage: onRenderInlineImage };
  }, [onRenderInlineImage]);

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

  const AttachmentButton = useCallback(() => {
    /* @conditional-compile-remove(attachment-upload) */
    if (!attachmentOptions?.uploadOptions?.handleAttachmentSelection) {
      return null;
    }
    /* @conditional-compile-remove(attachment-upload) */
    return (
      <AttachmentUploadButton
        supportedMediaTypes={attachmentOptions?.uploadOptions?.supportedMediaTypes}
        disableMultipleUploads={attachmentOptions?.uploadOptions?.disableMultipleUploads}
        onChange={attachmentUploadButtonOnChange}
      />
    );
    return <></>;
  }, [
    attachmentOptions?.uploadOptions?.handleAttachmentSelection,
    attachmentOptions?.uploadOptions?.supportedMediaTypes,
    attachmentOptions?.uploadOptions?.disableMultipleUploads,
    /* @conditional-compile-remove(attachment-upload) */
    attachmentUploadButtonOnChange
  ]);

  /* @conditional-compile-remove(attachment-upload) */
  const attachments = useMemo(() => {
    return uploads?.map((v) => v.metadata);
  }, [uploads]);

  const onSendMessageHandler = useCallback(
    async function (content: string, /* @conditional-compile-remove(attachment-upload) */ options?: MessageOptions) {
      /* @conditional-compile-remove(attachment-upload) */
      const attachments = options?.attachments ?? [];
      /* @conditional-compile-remove(attachment-upload) */
      handleUploadAction({ type: AttachmentUploadActionType.Clear });
      /* @conditional-compile-remove(attachment-upload) */
      await adapter.sendMessage(content, {
        attachments: attachments
      });
      /* @conditional-compile-remove(attachment-upload) */
      return;
      await adapter.sendMessage(content);
    },
    [adapter]
  );

  /* @conditional-compile-remove(attachment-upload) */
  const onCancelUploadHandler = useCallback(
    (id: string) => {
      handleUploadAction({ type: AttachmentUploadActionType.Remove, id });
      attachmentOptions?.uploadOptions?.handleAttachmentRemoval?.(id);
    },
    [attachmentOptions?.uploadOptions]
  );
  return (
    <Stack className={chatContainer} grow>
      {options?.topic !== false && <ChatHeader {...headerProps} />}
      <Stack className={chatArea} tokens={participantListContainerPadding} horizontal grow>
        <Stack className={chatWrapper} grow>
          {options?.errorBar !== false && <ErrorBar {...errorBarProps} />}
          {
            /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
            <AttachmentDownloadErrorBar
              onDismissDownloadErrorMessage={useCallback(() => {
                setDownloadErrorMessage('');
              }, [])}
              attachmentDownloadErrorMessage={downloadErrorMessage || ''}
            />
          }
          <MessageThread
            {...messageThreadProps}
            onRenderAvatar={onRenderAvatarCallback}
            onRenderMessage={onRenderMessage}
            /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
            onRenderAttachmentDownloads={onRenderAttachmentDownloads}
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
                  <AttachmentButton />
                </Stack>
              )}
              <Stack grow>
                <SendBox
                  {...sendBoxProps}
                  autoFocus={options?.autoFocus}
                  styles={sendBoxStyles}
                  /* @conditional-compile-remove(attachment-upload) */
                  attachments={attachments}
                  /* @conditional-compile-remove(attachment-upload) */
                  onCancelAttachmentUpload={onCancelUploadHandler}
                  // we need to overwrite onSendMessage for SendBox because we need to clear attachment state
                  // when submit button is clicked
                  onSendMessage={onSendMessageHandler}
                />
              </Stack>
              {formFactor !== 'mobile' && <AttachmentButton />}
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
      {overlayImageItem && (
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
      )}
    </Stack>
  );
};
