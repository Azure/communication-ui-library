// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RichTextInputBoxComponent } from './RichTextInputBoxComponent';
import { Icon, Stack } from '@fluentui/react';
import { useLocale } from '../../localization';
import { SendBoxStrings } from '../SendBox';
import { sendIconStyle } from '../styles/SendBox.styles';
import { InputBoxButton } from '../InputBoxButton';
import { RichTextSendBoxErrors, RichTextSendBoxErrorsProps } from './RichTextSendBoxErrors';
import { isMessageTooLong, isSendBoxButtonAriaDisabled, sanitizeText } from '../utils/SendBoxUtils';
import { RichTextEditorComponentRef } from './RichTextEditor';
import { useTheme } from '../../theming';
import { richTextActionButtonsStyle, sendBoxRichTextEditorStyle } from '../styles/RichTextEditor.styles';
/* @conditional-compile-remove(attachment-upload) */
import { _AttachmentUploadCards } from '../AttachmentUploadCards';
/* @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadataWithProgress } from '../../types/Attachment';
/* @conditional-compile-remove(attachment-upload) */
import { hasCompletedAttachmentUploads, hasIncompleteAttachmentUploads } from '../utils/SendBoxUtils';
/* @conditional-compile-remove(attachment-upload) */
import { SendBoxErrorBarError } from '../SendBoxErrorBar';
/* @conditional-compile-remove(attachment-upload) */
import { attachmentUploadCardsStyles } from '../styles/SendBox.styles';
/* @conditional-compile-remove(attachment-upload) */
import { FluentV9ThemeProvider } from '../../theming/FluentV9ThemeProvider';

/**
 * Strings of {@link RichTextSendBox} that can be overridden.
 *
 * @beta
 */
export interface RichTextSendBoxStrings extends RichTextStrings, SendBoxStrings {}

/**
 *
 * @beta
 */
export interface RichTextStrings {
  /**
   * Tooltip text for the bold button.
   */
  boldTooltip: string;
  /**
   * Tooltip text for the italic button.
   */
  italicTooltip: string;
  /**
   * Tooltip text for the underline button.
   */
  underlineTooltip: string;
  /**
   * Tooltip text for the bullet list button.
   */
  bulletListTooltip: string;
  /**
   * Tooltip text for the number list button.
   */
  numberListTooltip: string;
  /**
   * Tooltip text for the increase indent button.
   */
  increaseIndentTooltip: string;
  /**
   * Tooltip text for the decrease indent button.
   */
  decreaseIndentTooltip: string;
  /**
   * Tooltip text insert table button.
   */
  insertTableTooltip: string;
  /**
   * Tooltip text for the rich text format button button.
   */
  richTextFormatButtonTooltip: string;
  /**
   * Text for the insert menu item.
   */
  insertRowOrColumnMenu: string;
  /**
   * Title for the insert table menu.
   */
  insertTableMenuTitle: string;
  /**
   * Text for the insert menu item to insert row above the current selection.
   */
  insertRowAboveMenu: string;
  /**
   * Text for the insert menu item to insert row below the current selection.
   */
  insertRowBelowMenu: string;
  /**
   * Text for the insert menu item to insert column to the left from the current selection.
   */
  insertColumnLeftMenu: string;
  /**
   * Text for the insert menu item to insert column to the right from the current selection.
   */
  insertColumnRightMenu: string;
  /**
   * Text for the delete row or column menu.
   */
  deleteRowOrColumnMenu: string;
  /**
   * Text for the delete column menu.
   */
  deleteColumnMenu: string;
  /**
   * Text for the delete row menu.
   */
  deleteRowMenu: string;
  /**
   * Text for the delete table menu.
   */
  deleteTableMenu: string;
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
  /**
   * Optional strings to override in component
   */
  strings?: Partial<RichTextSendBoxStrings>;
  /**
   * Optional text for system message above the text box
   */
  systemMessage?: string;
  /* @conditional-compile-remove(attachment-upload) */
  /**
   * Optional array of type {@link AttachmentMetadataWithProgress}
   * to render attachments being uploaded in the SendBox.
   * @beta
   */
  attachmentsWithProgress?: AttachmentMetadataWithProgress[];
  /**
   * enumerable to determine if the input box has focus on render or not.
   * When undefined nothing has focus on render
   */
  autoFocus?: 'sendBoxTextField';
  /* @conditional-compile-remove(attachment-upload) */
  /**
   * Optional callback to remove the attachment upload before sending by clicking on
   * cancel icon.
   * @beta
   */
  onCancelAttachmentUpload?: (attachmentId: string) => void;
  /**
   * Callback function used when the send button is clicked.
   */
  onSendMessage: (content: string) => Promise<void>;
  /**
   * Optional callback called when user is typing
   */
  onTyping?: () => Promise<void>;
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
    /* @conditional-compile-remove(attachment-upload) */
    attachmentsWithProgress,
    /* @conditional-compile-remove(attachment-upload) */
    onCancelAttachmentUpload
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
  /* @conditional-compile-remove(attachment-upload) */
  const [attachmentUploadsPendingError, setAttachmentUploadsPendingError] = useState<SendBoxErrorBarError | undefined>(
    undefined
  );
  const editorComponentRef = useRef<RichTextEditorComponentRef>(null);

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

  const sendMessageOnClick = useCallback((): void => {
    if (disabled || contentValueOverflow) {
      return;
    }
    // Don't send message until all attachments have been uploaded successfully
    /* @conditional-compile-remove(attachment-upload) */
    setAttachmentUploadsPendingError(undefined);

    /* @conditional-compile-remove(attachment-upload) */
    if (hasIncompleteAttachmentUploads(attachmentsWithProgress)) {
      setAttachmentUploadsPendingError({ message: strings.attachmentUploadsPendingError, timestamp: Date.now() });
      return;
    }

    const message = contentValue;
    // get plain text content from the editor to check if the message is empty
    // as the content may contain tags even when the content is empty
    const plainTextContent = editorComponentRef.current?.getPlainContent();
    const hasContent = !isContentEmpty({
      plainTextContent,
      content: message,
      placeholder: strings.placeholderText
    });
    // we don't want to send empty messages including spaces, newlines, tabs
    // Message can be empty if there is a valid attachment upload
    if (
      hasContent ||
      /* @conditional-compile-remove(attachment-upload) */ hasCompletedAttachmentUploads(attachmentsWithProgress)
    ) {
      onSendMessage(message);
      setContentValue('');
      editorComponentRef.current?.setEmptyContent();
      editorComponentRef.current?.focus();
    }
  }, [
    contentValue,
    contentValueOverflow,
    disabled,
    onSendMessage,
    strings.placeholderText,
    /* @conditional-compile-remove(attachment-upload) */ attachmentsWithProgress,
    /* @conditional-compile-remove(attachment-upload) */ strings.attachmentUploadsPendingError
  ]);

  const hasErrorMessage = useMemo(() => {
    return (
      !!systemMessage ||
      !!contentTooLongMessage ||
      /* @conditional-compile-remove(attachment-upload) */
      !!attachmentUploadsPendingError ||
      /* @conditional-compile-remove(attachment-upload) */
      !!attachmentsWithProgress?.filter((attachmentUpload) => attachmentUpload.error).pop()?.error
    );
  }, [
    /* @conditional-compile-remove(attachment-upload) */
    attachmentsWithProgress,
    contentTooLongMessage,
    /* @conditional-compile-remove(attachment-upload) */
    attachmentUploadsPendingError,
    systemMessage
  ]);

  const hasContent = useMemo(() => {
    // get plain text content from the editor to check if the message is empty
    // as the content may contain tags even when the content is empty
    const plainTextContent = editorComponentRef.current?.getPlainContent();
    return !isContentEmpty({
      plainTextContent: plainTextContent,
      content: contentValue,
      placeholder: strings.placeholderText
    });
  }, [contentValue, strings.placeholderText]);

  const onRenderSendIcon = useCallback(
    (isHover: boolean) => {
      return (
        <Icon
          iconName={isHover && hasContent ? 'SendBoxSendHovered' : 'SendBoxSend'}
          className={sendIconStyle({
            theme,
            hasText: hasContent,
            /* @conditional-compile-remove(attachment-upload) */
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
    /* @conditional-compile-remove(attachment-upload) */
    const uploadErrorMessage = attachmentsWithProgress?.filter((attachmentUpload) => attachmentUpload.error).pop()
      ?.error?.message;
    return {
      /* @conditional-compile-remove(attachment-upload) */
      attachmentUploadsPendingError: attachmentUploadsPendingError,
      /* @conditional-compile-remove(attachment-upload) */
      attachmentProgressError: uploadErrorMessage
        ? {
            message: uploadErrorMessage,
            timestamp: Date.now()
          }
        : undefined,
      systemMessage: systemMessage,
      textTooLongMessage: contentTooLongMessage
    };
  }, [
    /* @conditional-compile-remove(attachment-upload) */
    attachmentsWithProgress,
    contentTooLongMessage,
    /* @conditional-compile-remove(attachment-upload) */
    attachmentUploadsPendingError,
    systemMessage
  ]);

  /* @conditional-compile-remove(attachment-upload) */
  const onRenderAttachmentUploads = useCallback(() => {
    return (
      <Stack className={attachmentUploadCardsStyles}>
        <FluentV9ThemeProvider v8Theme={theme}>
          <_AttachmentUploadCards
            attachmentsWithProgress={attachmentsWithProgress}
            onCancelAttachmentUpload={onCancelAttachmentUpload}
            strings={{
              removeAttachment: strings.removeAttachment,
              uploading: strings.uploading,
              uploadCompleted: strings.uploadCompleted,
              attachmentMoreMenu: strings.attachmentMoreMenu
            }}
          />
        </FluentV9ThemeProvider>
      </Stack>
    );
  }, [
    attachmentsWithProgress,
    onCancelAttachmentUpload,
    strings.removeAttachment,
    strings.uploadCompleted,
    strings.uploading,
    strings.attachmentMoreMenu,
    theme
  ]);

  const isSendBoxButtonAriaDisabledValue = useMemo(() => {
    return isSendBoxButtonAriaDisabled({
      hasContent,
      /* @conditional-compile-remove(attachment-upload) */ hasCompletedAttachmentUploads:
        hasCompletedAttachmentUploads(attachmentsWithProgress),
      hasError: hasErrorMessage,
      disabled
    });
  }, [
    /* @conditional-compile-remove(attachment-upload) */ attachmentsWithProgress,
    disabled,
    hasContent,
    hasErrorMessage
  ]);

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

  /* @conditional-compile-remove(attachment-upload) */
  const hasAttachmentUploads = useMemo(() => {
    return (
      hasCompletedAttachmentUploads(attachmentsWithProgress) || hasIncompleteAttachmentUploads(attachmentsWithProgress)
    );
  }, [attachmentsWithProgress]);

  return (
    <Stack>
      <RichTextSendBoxErrors {...sendBoxErrorsProps} />
      <RichTextInputBoxComponent
        // in case when format bar is shown, the editor is re-rendered that causes the content to be lost
        // setting the content will ensure that the latest content is used when editor is re-rendered
        content={contentValue}
        placeholderText={strings.placeholderText}
        autoFocus={autoFocus}
        onChange={setContent}
        onEnterKeyDown={sendMessageOnClick}
        onTyping={onTyping}
        editorComponentRef={editorComponentRef}
        strings={strings}
        disabled={disabled}
        actionComponents={sendButton}
        richTextEditorStyleProps={sendBoxRichTextEditorStyle}
        /* @conditional-compile-remove(attachment-upload) */
        onRenderAttachmentUploads={onRenderAttachmentUploads}
        /* @conditional-compile-remove(attachment-upload) */
        hasAttachments={hasAttachmentUploads}
      />
    </Stack>
  );
};

/**
 * Checks if the content of the rich text editor is empty.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string | undefined} params.plainTextContent - The plain text content of the editor.
 * @param {string} params.content - The HTML content of the editor.
 * @param {string} params.placeholder - The placeholder text of the editor.
 * @returns {boolean} - True if the content is empty, false otherwise.
 */
const isContentEmpty = ({
  plainTextContent,
  content,
  placeholder
}: {
  plainTextContent: string | undefined;
  content: string;
  placeholder: string;
}): boolean => {
  // RoosterJS returns placeholder text as plain text when the editor is empty and in this case,
  // plainTextContent contains only placeholder text but content doesn't include the placeholder text
  // this needs to be reviewed after migration to the content model packages.
  const plainTextContainsPlaceholderOnly = plainTextContent === placeholder && !content.includes(placeholder);
  return plainTextContainsPlaceholderOnly || sanitizeText(plainTextContent ?? '').length === 0;
};
