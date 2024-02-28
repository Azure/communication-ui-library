// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RTEInputBoxComponent } from './RTEInputBoxComponent';
import { Icon, Stack, useTheme } from '@fluentui/react';
import { useLocale } from '../../localization';
import { SendBoxStrings } from '../SendBox';
import { borderAndBoxShadowStyle, sendButtonStyle, sendIconStyle } from '../styles/SendBox.styles';
import { InputBoxButton } from '../InputBoxButton';
import { RTESendBoxErrors, RTESendBoxErrorsProps } from './RTESendBoxErrors';
/* @conditional-compile-remove(file-sharing) */
import { ActiveFileUpload } from '../FileUploadCards';
/* @conditional-compile-remove(file-sharing) */
import { SendBoxErrorBarError } from '../SendBoxErrorBar';
import { exceedsMaxAllowedLength, sanitizeText } from '../utils/SendBoxUtils';
/* @conditional-compile-remove(file-sharing) */
import { hasCompletedFileUploads } from '../utils/SendBoxUtils';
import { RichTextEditorComponentRef } from './RichTextEditor';

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
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Optional callback to render uploaded files in the SendBox. The sendBox will expand
   * vertically to accommodate the uploaded files. File uploads will
   * be rendered below the text area in sendBox.
   * @beta
   */
  onRenderFileUploads?: () => JSX.Element;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Optional array of active file uploads where each object has attributes
   * of a file upload like name, progress, errorMessage etc.
   * @beta
   */
  activeFileUploads?: ActiveFileUpload[];
  /* @conditional-compile-remove(file-sharing) */
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
    /* @conditional-compile-remove(file-sharing) */
    activeFileUploads
  } = props;

  const theme = useTheme();
  const locale = useLocale();

  const localeStrings = useMemo(() => {
    /* @conditional-compile-remove(rich-text-editor) */
    return locale.strings.richTextSendBox;
    return locale.strings.sendBox;
  }, [/* @conditional-compile-remove(rich-text-editor) */ locale.strings.richTextSendBox, locale.strings.sendBox]);

  const strings = { ...localeStrings, ...props.strings };

  const [contentValue, setContentValue] = useState('');
  const [contentValueOverflow, setContentValueOverflow] = useState(false);
  /* @conditional-compile-remove(file-sharing) */
  const [fileUploadsPendingError, setFileUploadsPendingError] = useState<SendBoxErrorBarError | undefined>(undefined);
  const editorComponentRef = useRef<RichTextEditorComponentRef>(null);

  const contentTooLongMessage = useMemo(
    () => (contentValueOverflow ? strings.textTooLong : undefined),
    [contentValueOverflow, strings.textTooLong]
  );

  const setContent = useCallback((newValue?: string): void => {
    if (newValue === undefined) {
      return;
    }

    setContentValueOverflow(exceedsMaxAllowedLength(newValue.length));
    setContentValue(newValue);
  }, []);

  const sendMessageOnClick = (): void => {
    if (disabled || contentValueOverflow) {
      return;
    }
    // Don't send message until all files have been uploaded successfully
    /* @conditional-compile-remove(file-sharing) */
    setFileUploadsPendingError(undefined);

    // if (hasIncompleteFileUploads(activeFileUploads)) {
    //   setFileUploadsPendingError({ message: strings.fileUploadsPendingError, timestamp: Date.now() });
    //   return;
    // }

    const message = contentValue;
    // we don't want to send empty messages including spaces, newlines, tabs
    // Message can be empty if there is a valid file upload
    if (
      sanitizeText(message).length > 0 ||
      /* @conditional-compile-remove(file-sharing) */ hasCompletedFileUploads(activeFileUploads)
    ) {
      onSendMessage(message);
      setContentValue('');
    }
    editorComponentRef.current?.focus();
  };

  const hasErrorMessage = useMemo(() => {
    return (
      !!systemMessage ||
      !!contentTooLongMessage ||
      /* @conditional-compile-remove(file-sharing) */
      !!fileUploadsPendingError ||
      /* @conditional-compile-remove(file-sharing) */
      !!activeFileUploads?.filter((fileUpload) => fileUpload.error).pop()?.error
    );
  }, [
    /* @conditional-compile-remove(file-sharing) */
    activeFileUploads,
    contentTooLongMessage,
    /* @conditional-compile-remove(file-sharing) */
    fileUploadsPendingError,
    systemMessage
  ]);

  const onRenderSendIcon = useCallback(
    (isHover: boolean) => (
      <Icon
        iconName={isHover && contentValue ? 'SendBoxSendHovered' : 'SendBoxSend'}
        className={sendIconStyle({
          theme,
          hasText: !!contentValue,
          /* @conditional-compile-remove(file-sharing) */
          hasFile: false,
          hasErrorMessage: hasErrorMessage
        })}
      />
    ),
    [contentValue, hasErrorMessage, theme]
  );

  const sendBoxErrorsProps: RTESendBoxErrorsProps = useMemo(() => {
    return {
      /* @conditional-compile-remove(file-sharing) */
      fileUploadsPendingError: fileUploadsPendingError,
      /* @conditional-compile-remove(file-sharing) */
      fileUploadError: activeFileUploads?.filter((fileUpload) => fileUpload.error).pop()?.error,
      systemMessage: systemMessage,
      textTooLongMessage: contentTooLongMessage
    };
  }, [
    /* @conditional-compile-remove(file-sharing) */
    activeFileUploads,
    contentTooLongMessage,
    /* @conditional-compile-remove(file-sharing) */
    fileUploadsPendingError,
    systemMessage
  ]);

  return (
    <Stack>
      <RTESendBoxErrors {...sendBoxErrorsProps} />
      <div
        className={borderAndBoxShadowStyle({
          theme: theme,
          // should always be false as we don't want to show the border when there is an error
          hasErrorMessage: false,
          disabled: !!disabled
        })}
      >
        <RTEInputBoxComponent
          placeholderText={strings.placeholderText}
          onChange={setContent}
          editorComponentRef={editorComponentRef}
          strings={strings}
        />
        {/* File Upload */}
      </div>
      <Stack.Item align="end">
        <InputBoxButton
          onRenderIcon={onRenderSendIcon}
          onClick={(e) => {
            sendMessageOnClick();
            e.stopPropagation(); // Prevents the click from bubbling up and triggering a focus event on the chat.
          }}
          className={sendButtonStyle}
          ariaLabel={localeStrings.sendButtonAriaLabel}
          tooltipContent={localeStrings.sendButtonAriaLabel}
        />
      </Stack.Item>
    </Stack>
  );
};
