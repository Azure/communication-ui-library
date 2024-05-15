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
import { _AttachmentUploadCards } from '../Attachment/AttachmentUploadCards';
/* @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadataInProgress, MessageOptions } from '@internal/acs-ui-common';
/* @conditional-compile-remove(attachment-upload) */
import { isAttachmentUploadCompleted, hasIncompleteAttachmentUploads } from '../utils/SendBoxUtils';
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
  onSendMessage: (
    content: string,
    /* @conditional-compile-remove(attachment-upload) */
    options?: MessageOptions
  ) => Promise<void>;
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
    attachments,
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

  /* @conditional-compile-remove(attachment-upload) */
  const toAttachmentMetadata = useCallback((attachmentsWithProgress: AttachmentMetadataInProgress[] | undefined) => {
    return attachmentsWithProgress
      ?.filter((attachment) => {
        return !('error' in attachment) && !attachment.error?.message;
      })
      .map((attachment) => {
        return {
          id: attachment.id,
          name: attachment.name,
          url: attachment.url ?? ''
        };
      });
  }, []);

  const sendMessageOnClick = useCallback((): void => {
    if (disabled || contentValueOverflow) {
      return;
    }
    // Don't send message until all attachments have been uploaded successfully
    /* @conditional-compile-remove(attachment-upload) */
    setAttachmentUploadsPendingError(undefined);

    /* @conditional-compile-remove(attachment-upload) */
    if (hasIncompleteAttachmentUploads(attachments)) {
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
    if (hasContent || /* @conditional-compile-remove(attachment-upload) */ isAttachmentUploadCompleted(attachments)) {
      onSendMessage(
        message,
        /* @conditional-compile-remove(attachment-upload) */
        {
          attachments: toAttachmentMetadata(attachments)
        }
      );
      setContentValue('');
      editorComponentRef.current?.setEmptyContent();
      editorComponentRef.current?.focus();
    }
  }, [
    disabled,
    contentValueOverflow,
    /* @conditional-compile-remove(attachment-upload) */
    attachments,
    contentValue,
    strings.placeholderText,
    /* @conditional-compile-remove(attachment-upload) */
    strings.attachmentUploadsPendingError,
    onSendMessage,
    /* @conditional-compile-remove(attachment-upload) */
    toAttachmentMetadata
  ]);

  const hasErrorMessage = useMemo(() => {
    return (
      !!systemMessage ||
      !!contentTooLongMessage ||
      /* @conditional-compile-remove(attachment-upload) */
      !!attachmentUploadsPendingError ||
      /* @conditional-compile-remove(attachment-upload) */
      !!attachments?.filter((attachmentUpload) => attachmentUpload.error).pop()?.error
    );
  }, [
    /* @conditional-compile-remove(attachment-upload) */
    attachments,
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
    const uploadErrorMessage = attachments?.filter((attachmentUpload) => attachmentUpload.error).pop()?.error?.message;
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
    attachments,
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
            attachments={attachments}
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
    attachments,
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
        isAttachmentUploadCompleted(attachments),
      hasError: hasErrorMessage,
      disabled
    });
  }, [/* @conditional-compile-remove(attachment-upload) */ attachments, disabled, hasContent, hasErrorMessage]);

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
    return isAttachmentUploadCompleted(attachments) || hasIncompleteAttachmentUploads(attachments);
  }, [attachments]);

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
