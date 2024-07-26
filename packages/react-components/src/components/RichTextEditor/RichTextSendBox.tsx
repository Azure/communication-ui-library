// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RichTextInputBoxComponent } from './RichTextInputBoxComponent';
import { Icon, Stack } from '@fluentui/react';
import { useLocale } from '../../localization';
import { SendBoxStrings } from '../SendBox';
import { sendIconStyle } from '../styles/SendBox.styles';
/* @conditional-compile-remove(file-sharing-acs) */
import { useV9CustomStyles } from '../styles/SendBox.styles';
import { InputBoxButton } from '../InputBoxButton';
import { RichTextSendBoxErrors, RichTextSendBoxErrorsProps } from './RichTextSendBoxErrors';
import { isMessageTooLong, isSendBoxButtonAriaDisabled, sanitizeText } from '../utils/SendBoxUtils';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { insertImagesToContentString, cancelInlineImageUpload } from '../utils/SendBoxUtils';
import { RichTextEditorComponentRef } from './RichTextEditor';
import { useTheme } from '../../theming';
import { richTextActionButtonsStyle, sendBoxRichTextEditorStyle } from '../styles/RichTextEditor.styles';
/* @conditional-compile-remove(file-sharing-acs) */
import { _AttachmentUploadCards } from '../Attachment/AttachmentUploadCards';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadataInProgress, MessageOptions } from '@internal/acs-ui-common';
/* @conditional-compile-remove(file-sharing-acs) */
import {
  isAttachmentUploadCompleted,
  hasIncompleteAttachmentUploads,
  toAttachmentMetadata
} from '../utils/SendBoxUtils';
/* @conditional-compile-remove(file-sharing-acs) */
import { SendBoxErrorBarError } from '../SendBoxErrorBar';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { SendBoxErrorBarType } from '../SendBoxErrorBar';
/* @conditional-compile-remove(file-sharing-acs) */
import { attachmentUploadCardsStyles } from '../styles/SendBox.styles';
/* @conditional-compile-remove(file-sharing-acs) */
import { FluentV9ThemeProvider } from '../../theming/FluentV9ThemeProvider';

/**
 * Strings of {@link RichTextSendBox} that can be overridden.
 *
 * @beta
 */
export interface RichTextSendBoxStrings extends RichTextStrings, SendBoxStrings {}

/* @conditional-compile-remove(rich-text-editor) */
/**
 * Options for the rich text editor configuration.
 *
 * @beta
 */
export interface RichTextEditorOptions {
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional callback to handle paste event.
   */
  onPaste?: (event: { content: DocumentFragment }) => void;
}

/* @conditional-compile-remove(rich-text-editor) */
/**
 * Options for the rich text editor send box configuration.
 *
 * @beta
 */
export interface RichTextSendBoxOptions extends RichTextEditorOptions {
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional callback to handle an inline image that's inserted in the rich text editor.
   * When not provided, pasting images into rich text editor will be disabled.
   */
  onInsertInlineImage?: (imageUrl: string, imageFileName: string) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional callback to remove the image upload or delete the image from server before sending.
   */
  onCancelInlineImageUpload?: (imageId: string) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional Array of type {@link AttachmentMetadataInProgress}
   * to render inline images being inserted in the RichTextSendBox.
   */
  inlineImages?: AttachmentMetadataInProgress[];
}

/**
 * Strings of RichText that can be overridden.
 *
 * @beta
 */
export interface RichTextStrings {
  /**
   * Tooltip text for the bold button.
   */
  richTextBoldTooltip: string;
  /**
   * Tooltip text for the italic button.
   */
  richTextItalicTooltip: string;
  /**
   * Tooltip text for the underline button.
   */
  richTextUnderlineTooltip: string;
  /**
   * Tooltip text for the bullet list button.
   */
  richTextBulletListTooltip: string;
  /**
   * Tooltip text for the number list button.
   */
  richTextNumberListTooltip: string;
  /**
   * Tooltip text for the increase indent button.
   */
  richTextIncreaseIndentTooltip: string;
  /**
   * Tooltip text for the decrease indent button.
   */
  richTextDecreaseIndentTooltip: string;
  /**
   * Tooltip text insert table button.
   */
  richTextInsertTableTooltip: string;
  /**
   * Tooltip text for the rich text format button button.
   */
  richTextFormatButtonTooltip: string;
  /**
   * Text for the insert menu item.
   */
  richTextInsertRowOrColumnMenu: string;
  /**
   * Title for the insert table menu.
   */
  richTextInsertTableMenuTitle: string;
  /**
   * Text for the insert menu item to insert row above the current selection.
   */
  richTextInsertRowAboveMenu: string;
  /**
   * Text for the insert menu item to insert row below the current selection.
   */
  richTextInsertRowBelowMenu: string;
  /**
   * Text for the insert menu item to insert column to the left from the current selection.
   */
  richTextInsertColumnLeftMenu: string;
  /**
   * Text for the insert menu item to insert column to the right from the current selection.
   */
  richTextInsertColumnRightMenu: string;
  /**
   * Text for the delete row or column menu.
   */
  richTextDeleteRowOrColumnMenu: string;
  /**
   * Text for the delete column menu.
   */
  richTextDeleteColumnMenu: string;
  /**
   * Text for the delete row menu.
   */
  richTextDeleteRowMenu: string;
  /**
   * Text for the delete table menu.
   */
  richTextDeleteTableMenu: string;
  /**
   * Text for the rich text toolbar more button.
   */
  richTextToolbarMoreButtonAriaLabel: string;
  /**
   * Text for announcement when a new bulleted list item is added.
   */
  richTextNewBulletedListItemAnnouncement: string;
  /**
   * Text for announcement when a new numbered list item is added.
   */
  richTextNewNumberedListItemAnnouncement: string;
  /**
   * Text for announcement when the bulleted list style is applied.
   */
  richTextBulletedListAppliedAnnouncement: string;
  /**
   * Text for announcement when the numbered list style is applied.
   */
  richTextNumberedListAppliedAnnouncement: string;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Error message indicating image upload is not complete.
   */
  imageUploadsPendingError: string;
}

/**
 * Props for {@link RichTextSendBox}.
 *
 * @beta
 */
export interface RichTextSendBoxProps {
  /**
   * Optional boolean to disable text box
   * @defaultValue false
   */
  disabled?: boolean;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional callback to handle paste event.
   */
  onPaste?: (event: { content: DocumentFragment }) => void;
  /**
   * Optional strings to override in component
   */
  strings?: Partial<RichTextSendBoxStrings>;
  /**
   * Optional text for system message above the text box
   */
  systemMessage?: string;
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional array of type {@link AttachmentMetadataInProgress}
   * to render attachments being uploaded in the SendBox.
   * @beta
   */
  attachments?: AttachmentMetadataInProgress[];
  /**
   * enumerable to determine if the input box has focus on render or not.
   * When undefined nothing has focus on render
   */
  autoFocus?: 'sendBoxTextField';
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional callback to remove the attachment upload before sending by clicking on
   * cancel icon.
   */
  onCancelAttachmentUpload?: (attachmentId: string) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional callback to remove the image upload or delete the image from server before sending.
   */
  onCancelInlineImageUpload?: (imageId: string) => void;
  /**
   * Callback function used when the send button is clicked.
   */
  onSendMessage: (
    content: string,
    /* @conditional-compile-remove(file-sharing-acs) */
    options?: MessageOptions
  ) => Promise<void>;
  /**
   * Optional callback called when user is typing
   */
  onTyping?: () => Promise<void>;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional callback to handle an inline image that's inserted in the rich text editor.
   * When not provided, pasting images into rich text editor will be disabled.
   */
  onInsertInlineImage?: (imageUrl: string, imageFileName: string) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional Array of type {@link AttachmentMetadataInProgress}
   * to render inline images being inserted in the RichTextSendBox.
   */
  inlineImages?: AttachmentMetadataInProgress[];
}

/**
 * A component to render SendBox with Rich Text Editor support.
 *
 * @beta
 */
export const RichTextSendBox = (props: RichTextSendBoxProps): JSX.Element => {
  const {
    disabled = false,
    systemMessage,
    autoFocus,
    onSendMessage,
    onTyping,
    /* @conditional-compile-remove(file-sharing-acs) */
    attachments,
    /* @conditional-compile-remove(file-sharing-acs) */
    onCancelAttachmentUpload,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    onPaste,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    onInsertInlineImage,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    inlineImages,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    onCancelInlineImageUpload
  } = props;

  const theme = useTheme();
  const locale = useLocale();

  const localeStrings = useMemo(() => {
    /* @conditional-compile-remove(rich-text-editor) */
    return locale.strings.richTextSendBox;
    return locale.strings.sendBox;
  }, [/* @conditional-compile-remove(rich-text-editor) */ locale.strings.richTextSendBox, locale.strings.sendBox]);

  const strings = useMemo(() => {
    return { ...localeStrings, ...props.strings };
  }, [localeStrings, props.strings]);

  const [contentValue, setContentValue] = useState('');
  const [contentValueOverflow, setContentValueOverflow] = useState(false);
  /* @conditional-compile-remove(file-sharing-acs) */
  const [attachmentUploadsPendingError, setAttachmentUploadsPendingError] = useState<SendBoxErrorBarError | undefined>(
    undefined
  );
  const editorComponentRef = useRef<RichTextEditorComponentRef>(null);

  /* @conditional-compile-remove(file-sharing-acs) */
  const customV9Styles = useV9CustomStyles();

  const contentTooLongMessage = useMemo(
    () => (contentValueOverflow ? strings.textTooLong : undefined),
    [contentValueOverflow, strings.textTooLong]
  );

  const setContent = useCallback((newValue?: string): void => {
    if (newValue === undefined) {
      return;
    }

    setContentValueOverflow(isMessageTooLong(newValue.length));
    setContentValue(newValue);
  }, []);

  const onChangeHandler = useCallback(
    (
      newValue?: string,
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ imageSrcArray?: Array<string>
    ) => {
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      cancelInlineImageUpload({
        imageSrcArray,
        inlineImages,
        messageId: undefined,
        editBoxOnCancelInlineImageUpload: undefined,
        sendBoxOnCancelInlineImageUpload: onCancelInlineImageUpload
      });
      setContent(newValue);
    },
    [
      setContent,
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ onCancelInlineImageUpload,
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ inlineImages
    ]
  );

  const hasContent = useMemo(() => {
    // get plain text content from the editor to check if the message is empty
    // as the content may contain tags even when the content is empty
    const plainTextContent = editorComponentRef.current?.getPlainContent();
    return sanitizeText(contentValue ?? '').length > 0 && sanitizeText(plainTextContent ?? '').length > 0;
  }, [contentValue]);

  const sendMessageOnClick = useCallback((): void => {
    if (disabled || hasErrorMessage) {
      return;
    }
    // Don't send message until all attachments have been uploaded successfully
    /* @conditional-compile-remove(file-sharing-acs) */
    setAttachmentUploadsPendingError(undefined);

    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    const hasIncompleteImageUploads = hasIncompleteAttachmentUploads(inlineImages);
    /* @conditional-compile-remove(file-sharing-acs) */
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    if (
      /* @conditional-compile-remove(file-sharing-acs) */ hasIncompleteAttachmentUploads(attachments) ||
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ hasIncompleteImageUploads
    ) {
      /* @conditional-compile-remove(file-sharing-acs) */
      let errorMessage = strings.attachmentUploadsPendingError;
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      if (hasIncompleteImageUploads) {
        errorMessage = strings.imageUploadsPendingError || '';
      }
      setAttachmentUploadsPendingError({
        message: errorMessage,
        timestamp: Date.now(),
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        errorBarType: SendBoxErrorBarType.info
      });
      return;
    }

    // we don't want to send empty messages including spaces, newlines, tabs
    // Message can be empty if there is a valid attachment upload
    if (
      hasContent ||
      /* @conditional-compile-remove(file-sharing-acs) */ isAttachmentUploadCompleted(attachments) ||
      /* @conditional-compile-remove(rich-text-editor-image-upload) */ isAttachmentUploadCompleted(inlineImages)
    ) {
      const sendMessage = (content: string): void => {
        onSendMessage(
          content,
          /* @conditional-compile-remove(file-sharing-acs) */ /* @conditional-compile-remove(rich-text-editor-composite-support) */
          {
            /* @conditional-compile-remove(file-sharing-acs) */
            attachments: toAttachmentMetadata(attachments),
            /* @conditional-compile-remove(rich-text-editor-composite-support) */
            type: 'html'
          }
        );
        setContentValue('');
        editorComponentRef.current?.setEmptyContent();
        editorComponentRef.current?.focus();
      };

      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      if (isAttachmentUploadCompleted(inlineImages)) {
        insertImagesToContentString(contentValue, inlineImages, (content: string) => {
          sendMessage(content);
        });
        return;
      }

      sendMessage(contentValue);
    }
  }, [
    disabled,
    contentValueOverflow,
    /* @conditional-compile-remove(file-sharing-acs) */
    attachments,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    inlineImages,
    contentValue,
    hasContent,
    /* @conditional-compile-remove(file-sharing-acs) */
    strings.attachmentUploadsPendingError,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    strings.imageUploadsPendingError,
    onSendMessage
  ]);

  const hasErrorMessage = useMemo(() => {
    return (
      !!contentTooLongMessage ||
      /* @conditional-compile-remove(file-sharing-acs) */
      !!attachmentUploadsPendingError ||
      /* @conditional-compile-remove(file-sharing-acs) */
      !!attachments?.filter((attachmentUpload) => attachmentUpload.error).pop()?.error ||
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      !!inlineImages?.filter((image) => image.error).pop()?.error
    );
  }, [
    /* @conditional-compile-remove(file-sharing-acs) */
    attachments,
    contentTooLongMessage,
    /* @conditional-compile-remove(file-sharing-acs) */
    attachmentUploadsPendingError,
    systemMessage,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    inlineImages
  ]);

  const onRenderSendIcon = useCallback(
    (isHover: boolean) => {
      return (
        <Icon
          iconName={isHover && hasContent ? 'SendBoxSendHovered' : 'SendBoxSend'}
          className={sendIconStyle({
            theme,
            hasText: hasContent,
            /* @conditional-compile-remove(file-sharing-acs) */
            hasAttachment: false,
            hasErrorMessage: hasErrorMessage,
            defaultTextColor: theme.palette.neutralSecondary,
            disabled: disabled
          })}
        />
      );
    },
    [disabled, hasContent, hasErrorMessage, theme]
  );

  const sendBoxErrorsProps: RichTextSendBoxErrorsProps = useMemo(() => {
    /* @conditional-compile-remove(file-sharing-acs) */
    const uploadErrorMessage = attachments?.filter((attachmentUpload) => attachmentUpload.error).pop()?.error?.message;
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    const imageUploadErrorMessage = inlineImages?.filter((image) => image.error).pop()?.error?.message;
    /* @conditional-compile-remove(file-sharing-acs) */
    const errorMessage =
      uploadErrorMessage || /* @conditional-compile-remove(rich-text-editor-image-upload) */ imageUploadErrorMessage;
    return {
      /* @conditional-compile-remove(file-sharing-acs) */
      attachmentUploadsPendingError: attachmentUploadsPendingError,

      /* @conditional-compile-remove(file-sharing-acs) */
      attachmentProgressError: errorMessage
        ? {
            message: errorMessage,
            timestamp: Date.now(),
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            errorBarType: SendBoxErrorBarType.error
          }
        : undefined,
      systemMessage: systemMessage,
      textTooLongMessage: contentTooLongMessage
    };
  }, [
    /* @conditional-compile-remove(file-sharing-acs) */
    attachments,
    contentTooLongMessage,
    /* @conditional-compile-remove(file-sharing-acs) */
    attachmentUploadsPendingError,
    /* @conditional-compile-remove(rich-text-editor-image-upload) */
    inlineImages,
    systemMessage
  ]);

  /* @conditional-compile-remove(file-sharing-acs) */
  const onRenderAttachmentUploads = useCallback(() => {
    return (
      <Stack className={attachmentUploadCardsStyles}>
        <FluentV9ThemeProvider v8Theme={theme} className={customV9Styles.clearBackground}>
          <_AttachmentUploadCards
            attachments={attachments}
            onCancelAttachmentUpload={onCancelAttachmentUpload}
            strings={{
              removeAttachment: strings.removeAttachment,
              uploading: strings.uploading,
              uploadCompleted: strings.uploadCompleted,
              attachmentMoreMenu: strings.attachmentMoreMenu
            }}
            disabled={disabled}
          />
        </FluentV9ThemeProvider>
      </Stack>
    );
  }, [
    theme,
    customV9Styles.clearBackground,
    attachments,
    onCancelAttachmentUpload,
    strings.removeAttachment,
    strings.uploading,
    strings.uploadCompleted,
    strings.attachmentMoreMenu,
    disabled
  ]);

  const isSendBoxButtonAriaDisabledValue = useMemo(() => {
    return isSendBoxButtonAriaDisabled({
      hasContent,
      /* @conditional-compile-remove(file-sharing-acs) */ hasCompletedAttachmentUploads:
        isAttachmentUploadCompleted(attachments),
      hasError: hasErrorMessage,
      disabled
    });
  }, [/* @conditional-compile-remove(file-sharing-acs) */ attachments, disabled, hasContent, hasErrorMessage]);

  const sendButton = useMemo(() => {
    return (
      <InputBoxButton
        onRenderIcon={onRenderSendIcon}
        onClick={(e) => {
          sendMessageOnClick();
          e.stopPropagation(); // Prevents the click from bubbling up and triggering a focus event on the chat.
        }}
        className={richTextActionButtonsStyle}
        ariaLabel={localeStrings.sendButtonAriaLabel}
        tooltipContent={localeStrings.sendButtonAriaLabel}
        ariaDisabled={isSendBoxButtonAriaDisabledValue}
      />
    );
  }, [isSendBoxButtonAriaDisabledValue, localeStrings.sendButtonAriaLabel, onRenderSendIcon, sendMessageOnClick]);

  /* @conditional-compile-remove(file-sharing-acs) */
  const hasAttachmentUploads = useMemo(() => {
    return isAttachmentUploadCompleted(attachments) || hasIncompleteAttachmentUploads(attachments);
  }, [attachments]);

  return (
    <Stack>
      <RichTextSendBoxErrors {...sendBoxErrorsProps} />
      <RichTextInputBoxComponent
        placeholderText={strings.placeholderText}
        autoFocus={autoFocus}
        onChange={onChangeHandler}
        onEnterKeyDown={sendMessageOnClick}
        onTyping={onTyping}
        editorComponentRef={editorComponentRef}
        strings={strings}
        disabled={disabled}
        actionComponents={sendButton}
        richTextEditorStyleProps={sendBoxRichTextEditorStyle}
        /* @conditional-compile-remove(file-sharing-acs) */
        onRenderAttachmentUploads={onRenderAttachmentUploads}
        /* @conditional-compile-remove(file-sharing-acs) */
        hasAttachments={hasAttachmentUploads}
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        onPaste={onPaste}
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        onInsertInlineImage={onInsertInlineImage}
      />
    </Stack>
  );
};
