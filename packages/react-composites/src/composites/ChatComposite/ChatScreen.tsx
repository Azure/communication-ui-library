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
/* @conditional-compile-remove(rich-text-editor) */
import { RichTextEditBoxOptions } from '@internal/react-components';
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
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { removeImageTags, _IMAGE_ATTRIBUTE_INLINE_IMAGE_FILE_NAME_KEY } from '@internal/acs-ui-common';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentDownloadErrorBar } from './AttachmentDownloadErrorBar';
import { _AttachmentDownloadCards } from '@internal/react-components';
import { ImageOverlay } from '@internal/react-components';
import { InlineImage } from '@internal/react-components';
import { ChatMessageWithStatus, ResourceFetchResult } from '@internal/chat-stateful-client';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentOptions } from '@internal/react-components';
/* @conditional-compile-remove(file-sharing-acs) */
import { nanoid } from 'nanoid';
/* @conditional-compile-remove(file-sharing-acs) */
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentUploadActionType, AttachmentUpload, AttachmentUploadReducer } from './file-sharing/AttachmentUpload';
/* @conditional-compile-remove(file-sharing-acs) */
import { MessageOptions } from '@internal/acs-ui-common';
import { SendBoxPicker } from '../common/SendBoxPicker';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { loadRichTextSendBox, RichTextSendBoxOptions } from '../common/SendBoxPicker';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import {
  cancelInlineImageUpload,
  getEditBoxMessagesInlineImages,
  getImageFileNameFromAttributes,
  getSendBoxInlineImages,
  onInsertInlineImageForEditBox,
  onInsertInlineImageForSendBox,
  updateContentStringWithUploadedInlineImages
} from './ImageUpload/ImageUploadUtils';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { isMicrosoftTeamsUserIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { SEND_BOX_UPLOADS_KEY_VALUE, _DEFAULT_INLINE_IMAGE_FILE_NAME } from '../common/constants';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { ImageUploadReducer } from './ImageUpload/ImageUploadReducer';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { useLocale } from '../localization';
import { useSelector } from './hooks/useSelector';
import { getChatMessages, getThreadId, getUserId } from './selectors/baseSelectors';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { getCreatedBy, getTextOnlyChat } from './selectors/baseSelectors';

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
  /* @conditional-compile-remove(file-sharing-acs) */
  const [downloadErrorMessage, setDownloadErrorMessage] = React.useState('');
  const [overlayImageItem, setOverlayImageItem] = useState<OverlayImageItem>();
  const [isImageOverlayOpen, setIsImageOverlayOpen] = useState<boolean>(false);
  /* @conditional-compile-remove(file-sharing-acs) */
  const [uploads, handleUploadAction] = useReducer(AttachmentUploadReducer, []);
  const adapter = useAdapter();
  const theme = useTheme();
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const localeStrings = useLocale().strings;

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const textOnlyChat = !!useSelector(getTextOnlyChat);
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const createdBy = useSelector(getCreatedBy);
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const isACSChat = !createdBy || !isMicrosoftTeamsUserIdentifier(createdBy);
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const [editBoxInlineImageUploads, handleEditBoxInlineImageUploadAction] = useReducer(ImageUploadReducer, undefined);
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const [sendBoxInlineImageUploads, handleSendBoxInlineImageUploadAction] = useReducer(ImageUploadReducer, undefined);

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

  const overlayImageItemRef = React.useRef<OverlayImageItem | undefined>(overlayImageItem);
  overlayImageItemRef.current = overlayImageItem;
  const adapterChatMessages = useSelector(getChatMessages);
  useEffect(() => {
    if (overlayImageItemRef.current === undefined) {
      return;
    }
    const message: ChatMessageWithStatus | undefined = adapterChatMessages[overlayImageItemRef.current.messageId];
    if (message === undefined) {
      return;
    }
    const resourceCache = message.resourceCache;
    if (
      overlayImageItemRef.current.imageSrc === '' &&
      resourceCache &&
      resourceCache[overlayImageItemRef.current.imageUrl]
    ) {
      const fullSizeImageSrc = getResourceSourceUrl(resourceCache[overlayImageItemRef.current.imageUrl]);
      if (
        fullSizeImageSrc === undefined ||
        fullSizeImageSrc === '' ||
        overlayImageItemRef.current.imageSrc === fullSizeImageSrc
      ) {
        return;
      }
      setOverlayImageItem({
        ...overlayImageItemRef.current,
        imageSrc: fullSizeImageSrc
      });
    }
  }, [adapterChatMessages]);

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

  const userIdObject = useSelector(getUserId);
  const userId = toFlatCommunicationIdentifier(userIdObject);

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

  const threadId = useSelector(getThreadId);
  const onInlineImageClicked = useCallback(
    (attachmentId: string, messageId: string) => {
      const message: ChatMessageWithStatus | undefined = adapterChatMessages[messageId];
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
            threadId,
            messageId,
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
    [adapter, adapterChatMessages, onRenderAvatarCallback, userId, threadId]
  );

  const onRenderInlineImage = useCallback(
    (inlineImage: InlineImage, defaultOnRender: (inlineImage: InlineImage) => JSX.Element): JSX.Element => {
      const message = adapterChatMessages[inlineImage.messageId];
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
    [adapterChatMessages, onInlineImageClicked]
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
  const attachmentButton = useMemo(() => {
    if (
      !attachmentOptions?.uploadOptions?.handleAttachmentSelection ||
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      textOnlyChat
    ) {
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
    attachmentUploadButtonOnChange,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    textOnlyChat
  ]);

  /* @conditional-compile-remove(file-sharing-acs) */
  const attachments = useMemo(() => {
    return uploads?.map((v) => v.metadata);
  }, [uploads]);

  const onSendMessageHandler = useCallback(
    async function (
      content: string,
      /* @conditional-compile-remove(file-sharing-acs) */ /* @conditional-compile-remove(rich-text-editor-composite-support) */ options?: MessageOptions
    ) {
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      content = updateContentStringWithUploadedInlineImages(content, sendBoxInlineImageUploads);
      /* @conditional-compile-remove(file-sharing-acs) */
      const attachments = options?.attachments ?? [];
      /* @conditional-compile-remove(file-sharing-acs) */
      handleUploadAction({ type: AttachmentUploadActionType.Clear });
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      handleSendBoxInlineImageUploadAction({
        type: AttachmentUploadActionType.Clear,
        messageId: SEND_BOX_UPLOADS_KEY_VALUE
      });

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
    [
      adapter,
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ handleSendBoxInlineImageUploadAction,
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ sendBoxInlineImageUploads
    ]
  );

  const onUpdateMessageHandler = useCallback(
    async function (
      messageId: string,
      content: string,
      /* @conditional-compile-remove(file-sharing-acs) */ options?: MessageOptions
    ) {
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      content = updateContentStringWithUploadedInlineImages(content, editBoxInlineImageUploads, messageId);
      await messageThreadProps.onUpdateMessage(
        messageId,
        content,
        /* @conditional-compile-remove(file-sharing-acs) */ options
      );
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      handleEditBoxInlineImageUploadAction({ type: AttachmentUploadActionType.Clear, messageId });
    },
    [
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ handleEditBoxInlineImageUploadAction,
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ editBoxInlineImageUploads,
      messageThreadProps
    ]
  );

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const onCancelEditMessageHandler = useCallback(
    (messageId: string) => {
      handleEditBoxInlineImageUploadAction({ type: AttachmentUploadActionType.Clear, messageId });
    },
    [handleEditBoxInlineImageUploadAction]
  );

  /* @conditional-compile-remove(file-sharing-acs) */
  const onCancelUploadHandler = useCallback(
    (id: string) => {
      handleUploadAction({ type: AttachmentUploadActionType.Remove, id });
      attachmentOptions?.uploadOptions?.handleAttachmentRemoval?.(id);
    },
    [attachmentOptions?.uploadOptions]
  );

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  const richTextEditorOptions = useMemo(() => {
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    const onPasteCallback = isACSChat || textOnlyChat ? removeImageTags : undefined;
    return options?.richTextEditor
      ? {
          /* @conditional-compile-remove(rich-text-editor-image-upload) */ onPaste: onPasteCallback
        }
      : undefined;
  }, [
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    isACSChat,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    textOnlyChat,
    options?.richTextEditor
  ]);

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  const richTextEditBoxOptions: RichTextEditBoxOptions | undefined = useMemo(() => {
    return options?.richTextEditor
      ? {
          /* @conditional-compile-remove(rich-text-editor-image-upload) */
          ...richTextEditorOptions,
          /* @conditional-compile-remove(rich-text-editor-image-upload) */
          onInsertInlineImage: (imageAttributes: Record<string, string>, messageId: string) => {
            onInsertInlineImageForEditBox(
              imageAttributes,
              getImageFileNameFromAttributes(imageAttributes),
              messageId,
              adapter,
              handleEditBoxInlineImageUploadAction,
              localeStrings.chat
            );
          },
          /* @conditional-compile-remove(rich-text-editor-image-upload) */
          messagesInlineImagesWithProgress: getEditBoxMessagesInlineImages(editBoxInlineImageUploads),
          /* @conditional-compile-remove(rich-text-editor-image-upload) */
          onRemoveInlineImage: (imageAttributes: Record<string, string>, messageId: string) => {
            cancelInlineImageUpload(
              imageAttributes,
              editBoxInlineImageUploads,
              messageId,
              handleEditBoxInlineImageUploadAction,
              adapter
            );
          }
        }
      : undefined;
  }, [
    options?.richTextEditor,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */ richTextEditorOptions,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */ editBoxInlineImageUploads,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */ adapter,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */ localeStrings.chat
  ]);

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  const richTextSendBoxOptions: RichTextSendBoxOptions | undefined = useMemo(() => {
    return options?.richTextEditor
      ? {
          /* @conditional-compile-remove(rich-text-editor-image-upload) */
          ...richTextEditorOptions,
          /* @conditional-compile-remove(rich-text-editor-image-upload) */
          onInsertInlineImage: (imageAttributes: Record<string, string>) => {
            onInsertInlineImageForSendBox(
              imageAttributes,
              getImageFileNameFromAttributes(imageAttributes),
              adapter,
              handleSendBoxInlineImageUploadAction,
              localeStrings.chat
            );
          },
          /* @conditional-compile-remove(rich-text-editor-image-upload) */
          inlineImagesWithProgress: getSendBoxInlineImages(sendBoxInlineImageUploads),
          /* @conditional-compile-remove(rich-text-editor-image-upload) */
          onRemoveInlineImage: (imageAttributes: Record<string, string>) => {
            cancelInlineImageUpload(
              imageAttributes,
              sendBoxInlineImageUploads,
              SEND_BOX_UPLOADS_KEY_VALUE,
              handleSendBoxInlineImageUploadAction,
              adapter
            );
          }
        }
      : undefined;
  }, [
    options?.richTextEditor,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */ richTextEditorOptions,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */ sendBoxInlineImageUploads,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */ localeStrings.chat,
    adapter
  ]);

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
            onUpdateMessage={onUpdateMessageHandler}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            onCancelEditMessage={onCancelEditMessageHandler}
            onRenderAvatar={onRenderAvatarCallback}
            onRenderMessage={onRenderMessage}
            /* @conditional-compile-remove(file-sharing-acs) */
            onRenderAttachmentDownloads={onRenderAttachmentDownloads}
            inlineImageOptions={inlineImageOptions}
            numberOfChatMessagesToReload={defaultNumberOfChatMessagesToReload}
            styles={messageThreadStyles}
            /* @conditional-compile-remove(rich-text-editor-composite-support) */
            richTextEditorOptions={richTextEditBoxOptions}
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
                <Stack verticalAlign="center">{attachmentButton}</Stack>
              )}
              <Stack grow>
                <SendBoxPicker
                  styles={sendBoxStyles}
                  autoFocus={options?.autoFocus}
                  /* @conditional-compile-remove(rich-text-editor-composite-support) */
                  richTextEditorOptions={richTextSendBoxOptions}
                  /* @conditional-compile-remove(file-sharing-acs) */
                  attachments={attachments}
                  /* @conditional-compile-remove(file-sharing-acs) */
                  onCancelAttachmentUpload={onCancelUploadHandler}
                  // we need to overwrite onSendMessage for SendBox because we need to clear attachment state
                  // when submit button is clicked
                  onSendMessage={onSendMessageHandler}
                />
              </Stack>
              {formFactor !== 'mobile' &&
                /* @conditional-compile-remove(file-sharing-acs) */
                attachmentButton}
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
              threadId,
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
