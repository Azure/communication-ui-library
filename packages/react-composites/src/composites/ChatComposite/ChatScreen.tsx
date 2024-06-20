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
/* @conditional-compile-remove(file-sharing-acs) */
import { ChatMessage } from '@internal/react-components';
import React, { useCallback, useEffect, useMemo } from 'react';
/* @conditional-compile-remove(file-sharing-acs) */
import { useReducer } from 'react';
import { useState } from 'react';
import { AvatarPersona, AvatarPersonaDataCallback, AvatarPersonaProps } from '../common/AvatarPersona';
import { useAdapter } from './adapter/ChatAdapterProvider';
import { ChatCompositeOptions } from './ChatComposite';
import { ChatHeader, getHeaderProps } from './ChatHeader';
/* @conditional-compile-remove(file-sharing-acs) */
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
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentDownloadErrorBar } from './AttachmentDownloadErrorBar';
import { _AttachmentDownloadCards } from '@internal/react-components';
import { ImageOverlay } from '@internal/react-components';
import { InlineImage } from '@internal/react-components';
import { ResourceFetchResult } from '@internal/chat-stateful-client';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentOptions } from '@internal/react-components';
/* @conditional-compile-remove(file-sharing-acs) */
import { nanoid } from 'nanoid';
/* @conditional-compile-remove(file-sharing-acs) */
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import {
  AttachmentUploadActionType,
  AttachmentUpload,
  AttachmentUploadReducer,
  AttachmentUploadTask
} from './file-sharing/AttachmentUpload';
/* @conditional-compile-remove(file-sharing-acs) */
import { MessageOptions } from '@internal/acs-ui-common';
import { SendBoxPicker } from '../common/SendBoxPicker';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { loadRichTextSendBox } from '../common/SendBoxPicker';

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
  /* @conditional-compile-remove(file-sharing-acs) */
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
    /* @conditional-compile-remove(file-sharing-acs) */
    attachmentOptions,
    formFactor
  } = props;

  const defaultNumberOfChatMessagesToReload = 5;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const MAX_INLINE_IMAGE_UPLOAD_SIZE_MB = 20;
  /* @conditional-compile-remove(file-sharing-acs) */
  const [downloadErrorMessage, setDownloadErrorMessage] = React.useState('');
  const [overlayImageItem, setOverlayImageItem] = useState<OverlayImageItem>();
  const [isImageOverlayOpen, setIsImageOverlayOpen] = useState<boolean>(false);
  /* @conditional-compile-remove(file-sharing-acs) */
  const [uploads, handleUploadAction] = useReducer(AttachmentUploadReducer, []);
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const [inlineImageUploads, handleInlineImageUploadAction] = useReducer(AttachmentUploadReducer, []);

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

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  useEffect(() => {
    // if rich text editor is enabled, the rich text editor component should be loaded early for good UX
    if (options?.richTextEditor) {
      // this line is needed to load the Rooster JS dependencies early in the lifecycle
      // when the rich text editor is enabled
      loadRichTextSendBox();
    }
  }, [options?.richTextEditor]);

  const messageThreadProps = usePropsFor(MessageThread);
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

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const fetchBlobData = useCallback(
    async (
      resource: string | URL | Request,
      options: { timeout?: number; headers?: Headers; abortController: AbortController }
    ): Promise<Response> => {
      // default timeout is 30 seconds
      const { timeout = 30000, abortController } = options;

      const id = setTimeout(() => {
        abortController.abort();
      }, timeout);

      const response = await fetch(resource, {
        ...options,
        signal: abortController.signal
      });
      clearTimeout(id);
      return response;
    },
    []
  );

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const getInlineImageData = useCallback(
    async (image: string): Promise<Blob | undefined> => {
      const blobImage: Blob | undefined = undefined;
      if (image.startsWith('blob') || image.startsWith('http')) {
        const res = await fetchBlobData(image, { abortController: new AbortController() });
        const blobImage = await res.blob();
        return blobImage;
      }
      return blobImage;
    },
    [fetchBlobData]
  );

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const inlineImageUploadHandler = useCallback(
    async (uploadTasks: AttachmentUpload[]): Promise<void> => {
      for (const task of uploadTasks) {
        const uploadTask = task as AttachmentUploadTask;
        const image: Blob | undefined = uploadTask.image;
        if (!image) {
          uploadTask.notifyUploadFailed(`Image data for "${task.metadata?.name}" is not provided.`);
          continue;
        }
        if (image && image.size > MAX_INLINE_IMAGE_UPLOAD_SIZE_MB * 1024 * 1024) {
          uploadTask.notifyUploadFailed(
            `"${task.metadata?.name}" is too big. Select a file under ${MAX_INLINE_IMAGE_UPLOAD_SIZE_MB}MB.`
          );
          continue;
        }

        const SUPPORTED_FILES: Array<string> = ['jpg', 'jpeg', 'png', 'gif', 'heic', 'webp'];
        const imageExtension = task.metadata?.name.split('.').pop() ?? '';
        if (!SUPPORTED_FILES.includes(imageExtension)) {
          uploadTask.notifyUploadFailed(`Uploading ".${imageExtension}" image is not allowed.`);
          continue;
        }

        try {
          const response = await adapter.uploadImage(image, task.metadata?.name);
          uploadTask.notifyUploadCompleted(response.id, task.metadata.url || '');
        } catch (error) {
          console.error(error);
          uploadTask.notifyUploadFailed('Unable to upload inline image. Please try again later.');
        }
      }
    },
    [adapter]
  );

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const onUploadInlineImage = useCallback(
    async (image: string, fileName: string): Promise<void> => {
      if (!image) {
        return;
      }
      const imageData = await getInlineImageData(image);
      if (!imageData) {
        return;
      }
      const taskId = nanoid();
      const uploadTask: AttachmentUpload = {
        image: imageData,
        taskId,
        metadata: {
          id: taskId,
          name: fileName,
          url: image,
          progress: 0
        },
        notifyUploadProgressChanged: (value: number) => {
          handleInlineImageUploadAction({ type: AttachmentUploadActionType.Progress, taskId, progress: value });
        },
        notifyUploadCompleted: (id: string, url: string) => {
          handleInlineImageUploadAction({ type: AttachmentUploadActionType.Completed, taskId, id, url });
        },
        notifyUploadFailed: (message: string) => {
          handleInlineImageUploadAction({ type: AttachmentUploadActionType.Failed, taskId, message });
          // remove the failed upload task when error banner is auto dismissed after 10 seconds
          // so the banner won't be shown again on UI re-rendering.
          setTimeout(() => {
            handleInlineImageUploadAction({ type: AttachmentUploadActionType.Remove, id: taskId });
          }, 10 * 1000);
        }
      };

      const newUploads = [uploadTask];
      handleInlineImageUploadAction({ type: AttachmentUploadActionType.Set, newUploads });
      inlineImageUploadHandler(newUploads);
    },
    [getInlineImageData, inlineImageUploadHandler]
  );

  /* @conditional-compile-remove(file-sharing-acs) */
  const setKeyboardFocusAfterFileSelection = useCallback(() => {
    // look up sendbox by ID for now, we will use `useRef`
    // once attachment button is moved inside of send box component
    // see ADO workitem #3764245
    /* @conditional-compile-remove(rich-text-editor-composite-support) */
    if (props.options?.richTextEditor) {
      const richTextSendBox = document?.querySelector(`[id="richTextSendBox"]`) as HTMLDivElement;
      richTextSendBox?.focus();
      return;
    }
    const sendBox = document?.querySelector(`[id="sendbox"]`) as HTMLTextAreaElement;
    // set send box on focus after file selection per A11y requirement
    sendBox?.focus();
  }, [
    /* @conditional-compile-remove(rich-text-editor-composite-support) */
    props.options?.richTextEditor
  ]);

  /* @conditional-compile-remove(file-sharing-acs) */
  const attachmentUploadButtonOnChange = useCallback(
    (files: FileList | null): void => {
      setKeyboardFocusAfterFileSelection();

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
    [attachmentOptions?.uploadOptions, setKeyboardFocusAfterFileSelection]
  );

  /* @conditional-compile-remove(file-sharing-acs) */
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

  /* @conditional-compile-remove(file-sharing-acs) */
  const AttachmentButton = useCallback(() => {
    if (!attachmentOptions?.uploadOptions?.handleAttachmentSelection) {
      return null;
    }
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
    attachmentUploadButtonOnChange
  ]);

  /* @conditional-compile-remove(file-sharing-acs) */
  const attachments = useMemo(() => {
    return uploads?.map((v) => v.metadata);
  }, [uploads]);

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const uploadInlineImages = useMemo(() => {
    return inlineImageUploads?.map((v) => v.metadata);
  }, [inlineImageUploads]);

  const onSendMessageHandler = useCallback(
    async function (
      content: string,
      /* @conditional-compile-remove(file-sharing-acs) */ /* @conditional-compile-remove(rich-text-editor-composite-support) */ options?: MessageOptions
    ) {
      /* @conditional-compile-remove(file-sharing-acs) */
      const attachments = options?.attachments ?? [];
      /* @conditional-compile-remove(file-sharing-acs) */
      handleUploadAction({ type: AttachmentUploadActionType.Clear });
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      handleInlineImageUploadAction({ type: AttachmentUploadActionType.Clear });

      /* @conditional-compile-remove(file-sharing-acs) */
      await adapter.sendMessage(content, {
        attachments: attachments,
        /* @conditional-compile-remove(rich-text-editor-composite-support) */
        type: options?.type
      });
      /* @conditional-compile-remove(file-sharing-acs) */
      return;
      await adapter.sendMessage(content, {
        /* @conditional-compile-remove(rich-text-editor-composite-support) */
        type: options?.type
      });
    },
    [adapter]
  );

  /* @conditional-compile-remove(file-sharing-acs) */
  const onCancelUploadHandler = useCallback(
    (id: string) => {
      handleUploadAction({ type: AttachmentUploadActionType.Remove, id });
      attachmentOptions?.uploadOptions?.handleAttachmentRemoval?.(id);
    },
    [attachmentOptions?.uploadOptions]
  );

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const removeImageTags = useCallback((event: { content: DocumentFragment }) => {
    event.content.querySelectorAll('img').forEach((image) => {
      // If the image is the only child of its parent, remove all the parents of this img element.
      let parentNode: HTMLElement | null = image.parentElement;
      let currentNode: HTMLElement = image;
      while (parentNode?.childNodes.length === 1) {
        currentNode = parentNode;
        parentNode = parentNode.parentElement;
      }
      currentNode?.remove();
    });
  }, []);

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  const richTextEditorOptions = useMemo(() => {
    return options?.richTextEditor
      ? {
          /* @conditional-compile-remove(rich-text-editor-image-upload) */ onPaste: removeImageTags
        }
      : undefined;
  }, [options?.richTextEditor, removeImageTags]);

  return (
    <Stack className={chatContainer} grow>
      {options?.topic !== false && <ChatHeader {...headerProps} />}
      <Stack className={chatArea} tokens={participantListContainerPadding} horizontal grow>
        <Stack className={chatWrapper} grow>
          {options?.errorBar !== false && <ErrorBar {...errorBarProps} />}
          {
            /* @conditional-compile-remove(file-sharing-acs) */
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
            /* @conditional-compile-remove(file-sharing-acs) */
            onRenderAttachmentDownloads={onRenderAttachmentDownloads}
            inlineImageOptions={inlineImageOptions}
            numberOfChatMessagesToReload={defaultNumberOfChatMessagesToReload}
            styles={messageThreadStyles}
            /* @conditional-compile-remove(rich-text-editor-composite-support) */
            richTextEditorOptions={richTextEditorOptions}
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
                /* @conditional-compile-remove(file-sharing-acs) */
                <Stack verticalAlign="center">
                  <AttachmentButton />
                </Stack>
              )}
              <Stack grow>
                <SendBoxPicker
                  styles={sendBoxStyles}
                  autoFocus={options?.autoFocus}
                  /* @conditional-compile-remove(rich-text-editor-composite-support) */
                  richTextEditorOptions={richTextEditorOptions}
                  /* @conditional-compile-remove(file-sharing-acs) */
                  attachments={attachments}
                  /* @conditional-compile-remove(file-sharing-acs) */
                  onCancelAttachmentUpload={onCancelUploadHandler}
                  // we need to overwrite onSendMessage for SendBox because we need to clear attachment state
                  // when submit button is clicked
                  onSendMessage={onSendMessageHandler}
                  /* @conditional-compile-remove(rich-text-editor-image-upload) */
                  onUploadImage={onUploadInlineImage}
                  /* @conditional-compile-remove(rich-text-editor-image-upload) */
                  uploadInlineImages={uploadInlineImages}
                />
              </Stack>
              {formFactor !== 'mobile' && (
                /* @conditional-compile-remove(file-sharing-acs) */
                <AttachmentButton />
              )}
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
