// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles, Stack } from '@fluentui/react';
import { ChatMyMessage } from '@fluentui-contrib/react-chat';
import { mergeClasses } from '@fluentui/react-components';
import { _formatString } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentMetadataInProgress } from '@internal/acs-ui-common';
import { useTheme } from '../../../theming';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
/* @conditional-compile-remove(file-sharing-acs) */
import { useReducer } from 'react';
import { editBoxWidthStyles, richTextEditBoxActionButtonIcon } from '../../styles/EditBox.styles';
import { InputBoxButton } from '../../InputBoxButton';
import { MessageThreadStrings } from '../../MessageThread';
import { useChatMyMessageStyles } from '../../styles/MessageThread.styles';
import { ChatMessage } from '../../../types';
import { _AttachmentUploadCards } from '../../Attachment/AttachmentUploadCards';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadata } from '@internal/acs-ui-common';
import { useChatMessageRichTextEditContainerStyles } from '../../styles/ChatMessageComponent.styles';
import { MAXIMUM_LENGTH_OF_MESSAGE } from '../../utils/SendBoxUtils';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import {
  cancelInlineImageUpload,
  hasIncompleteAttachmentUploads,
  insertAttachmentsAndImages,
  isAttachmentUploadCompleted
} from '../../utils/SendBoxUtils';
import {
  getMessageState,
  onRenderCancelIcon,
  onRenderSubmitIcon
} from '../../utils/ChatMessageComponentAsEditBoxUtils';
/* @conditional-compile-remove(file-sharing-acs) */
import {
  attachmentMetadataReducer,
  getMessageWithAttachmentMetadata,
  doesMessageContainMultipleAttachments
} from '../../utils/ChatMessageComponentAsEditBoxUtils';
import { RichTextEditorComponentRef } from '../../RichTextEditor/RichTextEditor';
import { RichTextInputBoxComponent } from '../../RichTextEditor/RichTextInputBoxComponent';
import { editBoxRichTextEditorStyle, richTextActionButtonsStyle } from '../../styles/RichTextEditor.styles';
import { RichTextSendBoxErrors } from '../../RichTextEditor/RichTextSendBoxErrors';
import { useLocale } from '../../../localization';
/* @conditional-compile-remove(file-sharing-acs) */
import { FluentV9ThemeProvider } from '../../../theming/FluentV9ThemeProvider';
/* @conditional-compile-remove(file-sharing-acs) */
import { attachmentUploadCardsStyles } from '../../styles/SendBox.styles';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { SendBoxErrorBarError } from '../../SendBoxErrorBar';

/** @private */
export type ChatMessageComponentAsRichTextEditBoxProps = {
  onCancel?: (messageId: string) => void;
  onSubmit: (
    text: string,
    /* @conditional-compile-remove(file-sharing-acs) */
    attachmentMetadata?: AttachmentMetadata[]
  ) => void;
  message: ChatMessage;
  strings: MessageThreadStrings;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onPaste?: (event: { content: DocumentFragment }) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onCancelInlineImageUpload?: (imageId: string) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onUploadInlineImage?: (imageUrl: string, imageFileName: string) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  imageUploadsInProgress?: AttachmentMetadataInProgress[];
};

/**
 * @private
 */
export const ChatMessageComponentAsRichTextEditBox = (
  props: ChatMessageComponentAsRichTextEditBoxProps
): JSX.Element => {
  const {
    onCancel,
    onSubmit,
    strings,
    message,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    onPaste,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    onUploadInlineImage,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    imageUploadsInProgress,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    onCancelInlineImageUpload
  } = props;

  const [textValue, setTextValue] = useState<string>(message.content || '');
  /* @conditional-compile-remove(file-sharing-acs) */
  const [attachmentMetadata, handleAttachmentAction] = useReducer(
    attachmentMetadataReducer,
    getMessageWithAttachmentMetadata(message) ?? []
  );

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const [attachmentUploadsPendingError, setAttachmentUploadsPendingError] = useState<SendBoxErrorBarError | undefined>(
    undefined
  );
  const editTextFieldRef = React.useRef<RichTextEditorComponentRef>(null);
  const theme = useTheme();
  const messageState = useMemo(() => {
    return getMessageState(textValue, /* @conditional-compile-remove(file-sharing-acs) */ attachmentMetadata ?? []);
  }, [/* @conditional-compile-remove(file-sharing-acs) */ attachmentMetadata, textValue]);

  const submitEnabled = messageState === 'OK';

  const editContainerStyles = useChatMessageRichTextEditContainerStyles();
  const chatMyMessageStyles = useChatMyMessageStyles();
  const locale = useLocale().strings;

  const setText = useCallback((newValue?: string): void => {
    setTextValue(newValue ?? '');
  }, []);

  useEffect(() => {
    editTextFieldRef.current?.focus();
  }, []);

  const textTooLongMessage = useMemo(() => {
    return messageState === 'too long'
      ? _formatString(strings.editBoxTextLimit, { limitNumber: `${MAXIMUM_LENGTH_OF_MESSAGE}` })
      : undefined;
  }, [messageState, strings.editBoxTextLimit]);

  const iconClassName = useCallback(
    (isHover: boolean) => {
      const color = isHover ? theme.palette.accent : theme.palette.neutralSecondary;
      return mergeStyles(richTextEditBoxActionButtonIcon, { color });
    },
    [theme.palette.accent, theme.palette.neutralSecondary]
  );

  const onRenderThemedCancelIcon = useCallback(
    (isHover: boolean) => {
      return onRenderCancelIcon(iconClassName(isHover));
    },
    [iconClassName]
  );

  const onRenderThemedSubmitIcon = useCallback(
    (isHover: boolean) => {
      return onRenderSubmitIcon(iconClassName(isHover));
    },
    [iconClassName]
  );

  /* @conditional-compile-remove(file-sharing-acs) */
  const hasMultipleAttachments = useMemo(() => {
    return doesMessageContainMultipleAttachments(message);
  }, [message]);

  const onSubmitHandler = useCallback((): void => {
    if (!submitEnabled) {
      return;
    }
    // Don't send message until all attachments have been uploaded successfully
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    setAttachmentUploadsPendingError(undefined);

    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    if (hasIncompleteAttachmentUploads(imageUploadsInProgress)) {
      setAttachmentUploadsPendingError({ message: strings.attachmentUploadsPendingError, timestamp: Date.now() });
      return;
    }

    let content = textValue;
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    if (imageUploadsInProgress && isAttachmentUploadCompleted(imageUploadsInProgress)) {
      content = insertAttachmentsAndImages(textValue, undefined, imageUploadsInProgress).content;
    }
    // it's very important to pass an empty attachment here
    // so when user removes all attachments, UI can reflect it instantly
    // if you set it to undefined, the attachments pre-edited would still be there
    // until edit message event is received
    onSubmit(content, /* @conditional-compile-remove(file-sharing-acs) */ attachmentMetadata || []);
  }, [
    submitEnabled,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    imageUploadsInProgress,
    textValue,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    strings.attachmentUploadsPendingError,
    onSubmit,
    /* @conditional-compile-remove(file-sharing-acs) */
    attachmentMetadata
  ]);

  const actionButtons = useMemo(() => {
    return (
      <Stack horizontal>
        <InputBoxButton
          className={richTextActionButtonsStyle}
          ariaLabel={strings.editBoxCancelButton}
          tooltipContent={strings.editBoxCancelButton}
          onRenderIcon={onRenderThemedCancelIcon}
          onClick={() => {
            onCancel && onCancel(message.messageId);
          }}
          id={'dismissIconWrapper'}
          data-testId={strings.editBoxCancelButton}
        />
        <InputBoxButton
          className={richTextActionButtonsStyle}
          ariaLabel={strings.editBoxSubmitButton}
          tooltipContent={strings.editBoxSubmitButton}
          onRenderIcon={onRenderThemedSubmitIcon}
          onClick={(e) => {
            onSubmitHandler();
            e.stopPropagation();
          }}
          id={'submitIconWrapper'}
          data-testId={strings.editBoxSubmitButton}
        />
      </Stack>
    );
  }, [
    message.messageId,
    onCancel,
    onRenderThemedCancelIcon,
    onRenderThemedSubmitIcon,
    strings.editBoxCancelButton,
    strings.editBoxSubmitButton,
    onSubmitHandler
  ]);
  const richTextLocaleStrings = useMemo(() => {
    /* @conditional-compile-remove(rich-text-editor) */
    return { ...locale.richTextSendBox, ...strings };
    return locale.sendBox;
  }, [
    /* @conditional-compile-remove(rich-text-editor) */ locale.richTextSendBox,
    /* @conditional-compile-remove(rich-text-editor) */ strings,
    locale.sendBox
  ]);

  /* @conditional-compile-remove(file-sharing-acs) */
  const onCancelAttachmentUpload = useCallback((attachmentId: string) => {
    // edit box only capable of removing attachments
    // we need to expand attachment actions
    // if we want to support more actions e.g. add
    handleAttachmentAction({ type: 'remove', id: attachmentId });
  }, []);

  /* @conditional-compile-remove(file-sharing-acs) */
  const onRenderAttachmentUploads = useCallback(() => {
    return (
      <Stack className={attachmentUploadCardsStyles}>
        <FluentV9ThemeProvider v8Theme={theme}>
          <_AttachmentUploadCards
            attachments={attachmentMetadata}
            onCancelAttachmentUpload={onCancelAttachmentUpload}
          />
        </FluentV9ThemeProvider>
      </Stack>
    );
  }, [attachmentMetadata, onCancelAttachmentUpload, theme]);

  const onChangeHandler = useCallback(
    (
      content: string | undefined,
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ imageSrcArray?: Array<string>
    ) => {
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      cancelInlineImageUpload(imageSrcArray, imageUploadsInProgress, onCancelInlineImageUpload);
      setText(content);
    },
    [
      setText,
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ imageUploadsInProgress,
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ onCancelInlineImageUpload
    ]
  );

  const getContent = (): JSX.Element => {
    return (
      <Stack className={mergeStyles(editBoxWidthStyles)}>
        <RichTextSendBoxErrors
          textTooLongMessage={textTooLongMessage}
          systemMessage={message.failureReason}
          /* @conditional-compile-remove(file-sharing-acs) */ attachmentUploadsPendingError={
            attachmentUploadsPendingError
          }
        />
        <RichTextInputBoxComponent
          placeholderText={strings.editBoxPlaceholderText}
          onChange={onChangeHandler}
          editorComponentRef={editTextFieldRef}
          initialContent={message.content}
          strings={richTextLocaleStrings}
          disabled={false}
          actionComponents={actionButtons}
          richTextEditorStyleProps={editBoxRichTextEditorStyle}
          isHorizontalLayoutDisabled={true}
          /* @conditional-compile-remove(file-sharing-acs) */
          onRenderAttachmentUploads={onRenderAttachmentUploads}
          /* @conditional-compile-remove(rich-text-editor-image-upload) */
          onPaste={onPaste}
          /* @conditional-compile-remove(rich-text-editor-image-upload) */
          onUploadInlineImage={onUploadInlineImage}
        />
      </Stack>
    );
  };

  const attached = message.attached === true ? 'center' : message.attached === 'bottom' ? 'bottom' : 'top';
  return (
    <ChatMyMessage
      attached={attached}
      root={{
        className: mergeClasses(
          chatMyMessageStyles.root,
          /* @conditional-compile-remove(file-sharing-acs) */
          hasMultipleAttachments ? chatMyMessageStyles.multipleAttachmentsInEditing : undefined
        )
      }}
      body={{
        className: mergeClasses(
          editContainerStyles.body,
          attached !== 'top' ? editContainerStyles.bodyAttached : undefined
        )
      }}
    >
      {getContent()}
    </ChatMyMessage>
  );
};

export default ChatMessageComponentAsRichTextEditBox;
