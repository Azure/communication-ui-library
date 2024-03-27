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
import { isMessageTooLong, sanitizeText } from '../utils/SendBoxUtils';
import { RichTextEditorComponentRef } from './RichTextEditor';
import { useTheme } from '../../theming';
import { richTextActionButtonsStyle, sendBoxRichTextEditorStyle } from '../styles/RichTextEditor.styles';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { ActiveFileUpload, _AttachmentUploadCards } from '../AttachmentUploadCards';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { hasCompletedFileUploads, hasIncompleteFileUploads } from '../utils/SendBoxUtils';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { SendBoxErrorBarError } from '../SendBoxErrorBar';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { attachmentUploadCardsStyles } from '../styles/SendBox.styles';
import { FluentV9ThemeProvider } from '../../theming/FluentV9ThemeProvider';

/**
 * Strings of {@link RichTextSendBox} that can be overridden.
 *
 * @beta
 */
export interface RichTextSendBoxStrings extends SendBoxStrings {
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
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  /**
   * Optional array of active file uploads where each object has attributes
   * of a file upload like name, progress, errorMessage etc.
   * @beta
   */
  activeFileUploads?: ActiveFileUpload[];
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  /**
   * Optional callback to remove the file upload before sending by clicking on
   * cancel icon.
   * @beta
   */
  onCancelFileUpload?: (fileId: string) => void;
  /**
   * Callback function used when the send button is clicked.
   */
  onSendMessage: (content: string) => Promise<void>;
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
    onSendMessage,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    activeFileUploads,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    onCancelFileUpload
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
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  const [attachmentUploadsPendingError, setFileUploadsPendingError] = useState<SendBoxErrorBarError | undefined>(
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
    // Don't send message until all files have been uploaded successfully
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    setFileUploadsPendingError(undefined);

    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    if (hasIncompleteFileUploads(activeFileUploads)) {
      setFileUploadsPendingError({ message: strings.attachmentUploadsPendingError, timestamp: Date.now() });
      return;
    }

    const message = contentValue;
    // we don't want to send empty messages including spaces, newlines, tabs
    // Message can be empty if there is a valid file upload
    if (
      sanitizeText(message).length > 0 ||
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ hasCompletedFileUploads(
        activeFileUploads
      )
    ) {
      onSendMessage(message);
      setContentValue('');
      editorComponentRef.current?.setEmptyContent();
    }
    editorComponentRef.current?.focus();
  }, [
    contentValue,
    contentValueOverflow,
    disabled,
    onSendMessage,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ activeFileUploads,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ strings.attachmentUploadsPendingError
  ]);

  const hasErrorMessage = useMemo(() => {
    return (
      !!systemMessage ||
      !!contentTooLongMessage ||
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      !!attachmentUploadsPendingError ||
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      !!activeFileUploads?.filter((attachmentUpload) => attachmentUpload.error).pop()?.error
    );
  }, [
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    activeFileUploads,
    contentTooLongMessage,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    attachmentUploadsPendingError,
    systemMessage
  ]);

  const onRenderSendIcon = useCallback(
    (isHover: boolean) => (
      <Icon
        iconName={isHover && contentValue ? 'SendBoxSendHovered' : 'SendBoxSend'}
        className={sendIconStyle({
          theme,
          hasText: !!contentValue,
          /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
          hasFile: false,
          hasErrorMessage: hasErrorMessage,
          defaultTextColor: theme.palette.neutralSecondary,
          disabled: disabled
        })}
      />
    ),
    [contentValue, disabled, hasErrorMessage, theme]
  );

  const sendBoxErrorsProps: RichTextSendBoxErrorsProps = useMemo(() => {
    return {
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      attachmentUploadsPendingError: attachmentUploadsPendingError,
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      attachmentUploadError: activeFileUploads?.filter((attachmentUpload) => attachmentUpload.error).pop()?.error,
      systemMessage: systemMessage,
      textTooLongMessage: contentTooLongMessage
    };
  }, [
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    activeFileUploads,
    contentTooLongMessage,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    attachmentUploadsPendingError,
    systemMessage
  ]);

  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  const onRenderFileUploads = useCallback(() => {
    return (
      <Stack className={attachmentUploadCardsStyles}>
        <FluentV9ThemeProvider v8Theme={theme}>
          <_AttachmentUploadCards
            activeFileUploads={activeFileUploads}
            onCancelFileUpload={onCancelFileUpload}
            strings={{
              removeAttachment: strings.removeAttachment,
              uploading: strings.uploading,
              uploadCompleted: strings.uploadCompleted
            }}
          />
        </FluentV9ThemeProvider>
      </Stack>
    );
  }, [
    activeFileUploads,
    onCancelFileUpload,
    strings.removeAttachment,
    strings.uploadCompleted,
    strings.uploading,
    theme
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
      />
    );
  }, [localeStrings.sendButtonAriaLabel, onRenderSendIcon, sendMessageOnClick]);

  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  const hasFileUploads = useMemo(() => {
    return hasCompletedFileUploads(activeFileUploads) || hasIncompleteFileUploads(activeFileUploads);
  }, [activeFileUploads]);

  return (
    <Stack>
      <RichTextSendBoxErrors {...sendBoxErrorsProps} />
      <RichTextInputBoxComponent
        placeholderText={strings.placeholderText}
        onChange={setContent}
        onEnterKeyDown={sendMessageOnClick}
        editorComponentRef={editorComponentRef}
        strings={strings}
        disabled={disabled}
        actionComponents={sendButton}
        richTextEditorStyleProps={sendBoxRichTextEditorStyle}
        /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
        onRenderFileUploads={onRenderFileUploads}
        /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
        hasFiles={hasFileUploads}
      />
    </Stack>
  );
};
