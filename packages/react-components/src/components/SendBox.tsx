// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState, useMemo, useCallback } from 'react';
import { IStyle, ITextField, mergeStyles, concatStyleSets, Icon, Stack } from '@fluentui/react';
import { sendButtonStyle, sendIconStyle, sendBoxWrapperStyles, borderAndBoxShadowStyle } from './styles/SendBox.styles';
import { BaseCustomStyles } from '../types';
import { useTheme } from '../theming';
import { useLocale } from '../localization';
import { useIdentifiers } from '../identifiers';
import { InputBoxComponent } from './InputBoxComponent';
import { InputBoxButton } from './InputBoxButton';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { SendBoxErrors } from './SendBoxErrors';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { ActiveFileUpload, _AttachmentUploadCards } from './AttachmentUploadCards';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { attachmentUploadCardsStyles } from './styles/SendBox.styles';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { SendBoxErrorBarError } from './SendBoxErrorBar';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { hasCompletedFileUploads, hasIncompleteFileUploads } from './utils/SendBoxUtils';
import { MAXIMUM_LENGTH_OF_MESSAGE, isMessageTooLong, sanitizeText } from './utils/SendBoxUtils';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions } from './MentionPopover';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { FluentV9ThemeProvider } from '../theming/FluentV9ThemeProvider';

/**
 * Fluent styles for {@link Sendbox}.
 *
 * @public
 */
export interface SendBoxStylesProps extends BaseCustomStyles {
  /** Styles for the text field. */
  textField?: IStyle;
  /** styles for the text field container */
  textFieldContainer?: IStyle;
  /** Styles for the container of the send message icon. */
  sendMessageIconContainer?: IStyle;
  /** Styles for the send message icon; These styles will be ignored when a custom send message icon is provided. */
  sendMessageIcon?: IStyle;
  /** Styles for the system message; These styles will be ignored when a custom system message component is provided. */
  systemMessage?: IStyle;
}

/**
 * Strings of {@link SendBox} that can be overridden.
 *
 * @public
 */
export interface SendBoxStrings {
  /**
   * Placeholder text in SendBox when there is no user input
   */
  placeholderText: string;
  /**
   * The warning message when send box text length is more than max limit
   */
  textTooLong: string;
  /**
   * Aria label for send message button
   */
  sendButtonAriaLabel: string;
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  /**
   * Error message indicating that all attachment uploads are not complete.
   */
  attachmentUploadsPendingError: string;
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  /**
   * Aria label to notify user when focus is on cancel attachment upload button.
   */
  removeAttachment: string;
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  /**
   * Aria label to notify user attachment uploading starts.
   */
  uploading: string;
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  /**
   * Aria label to notify user attachment is uploaded.
   */
  uploadCompleted: string;
}

/**
 * Props for {@link SendBox}.
 *
 * @public
 */
export interface SendBoxProps {
  /**
   * Optional boolean to disable text box
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Optional text for system message below text box
   */
  systemMessage?: string;
  /**
   * Optional override behavior on send button click
   */
  onSendMessage?: (content: string) => Promise<void>;
  /* @conditional-compile-remove(mention) */
  /**
   * Optional props needed to lookup suggestions in the mention scenario.
   * @beta
   */
  mentionLookupOptions?: MentionLookupOptions;

  /**
   * Optional callback called when user is typing
   */
  onTyping?: () => Promise<void>;
  /**
   * Optional callback to render system message below the SendBox.
   * @defaultValue MessageBar
   */
  onRenderSystemMessage?: (systemMessage: string | undefined) => React.ReactElement;
  /**
   * Optional boolean to support new line in SendBox.
   * @defaultValue false
   */
  supportNewline?: boolean;
  /**
   * Optional callback to render send button icon to the right of the SendBox.
   * @defaultValue SendBoxSendHovered icon when mouse over icon and SendBoxSend icon otherwise
   */
  onRenderIcon?: (isHover: boolean) => JSX.Element;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <SendBox styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: SendBoxStylesProps;
  /**
   * Optional strings to override in component
   */
  strings?: Partial<SendBoxStrings>;
  /**
   * enumerable to determine if the input box has focus on render or not.
   * When undefined nothing has focus on render
   */
  autoFocus?: 'sendBoxTextField';
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  /**
   * Optional callback to render uploaded files in the SendBox. The sendBox will expand
   * vertically to accommodate the uploaded files. File uploads will
   * be rendered below the text area in sendBox.
   * @beta
   */
  onRenderFileUploads?: () => JSX.Element;
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  /**
   * Optional array of active attachment uploads where each object has attributes
   * of a attachment upload like name, progress, errorMessage etc.
   * @beta
   */
  activeFileUploads?: ActiveFileUpload[];
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  /**
   * Optional callback to remove the attachment upload before sending by clicking on
   * cancel icon.
   * @beta
   */
  onCancelFileUpload?: (fileId: string) => void;
}

/**
 * Component for typing and sending messages.
 *
 * Supports sending typing notification when user starts entering text.
 * Supports an optional message below the text input field.
 *
 * @public
 */
export const SendBox = (props: SendBoxProps): JSX.Element => {
  const {
    disabled,
    systemMessage,
    supportNewline,
    onSendMessage,
    onTyping,
    onRenderIcon,
    onRenderSystemMessage,
    styles,
    autoFocus,
    /* @conditional-compile-remove(mention) */
    mentionLookupOptions,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    activeFileUploads
  } = props;
  const theme = useTheme();
  const localeStrings = useLocale().strings.sendBox;
  const strings = { ...localeStrings, ...props.strings };
  const ids = useIdentifiers();

  const [textValue, setTextValue] = useState('');
  const [textValueOverflow, setTextValueOverflow] = useState(false);

  const sendTextFieldRef = React.useRef<ITextField>(null);

  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  const [attachmentUploadsPendingError, setAttachmentUploadsPendingError] = useState<SendBoxErrorBarError | undefined>(
    undefined
  );

  const sendMessageOnClick = (): void => {
    // don't send a message when disabled
    if (disabled || textValueOverflow) {
      return;
    }

    // Don't send message until all files have been uploaded successfully
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    setAttachmentUploadsPendingError(undefined);

    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
    if (hasIncompleteFileUploads(activeFileUploads)) {
      setAttachmentUploadsPendingError({ message: strings.attachmentUploadsPendingError, timestamp: Date.now() });
      return;
    }

    const message = textValue;
    // we don't want to send empty messages including spaces, newlines, tabs
    // Message can be empty if there is a valid attachment upload
    if (
      sanitizeText(message).length > 0 ||
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ hasCompletedFileUploads(
        activeFileUploads
      )
    ) {
      onSendMessage && onSendMessage(message);
      setTextValue('');
    }
    sendTextFieldRef.current?.focus();
  };

  const setText = (newValue?: string | undefined): void => {
    if (newValue === undefined) {
      return;
    }

    setTextValueOverflow(isMessageTooLong(newValue.length));
    setTextValue(newValue);
  };

  const textTooLongMessage = textValueOverflow ? strings.textTooLong : undefined;
  const errorMessage = systemMessage ?? textTooLongMessage;

  const mergedSendButtonStyle = useMemo(
    () => mergeStyles(sendButtonStyle, styles?.sendMessageIconContainer),
    [styles?.sendMessageIconContainer]
  );

  const mergedStyles = useMemo(() => concatStyleSets(styles), [styles]);

  const mergedSendIconStyle = useMemo(
    () =>
      sendIconStyle({
        theme,
        hasText: !!textValue,
        /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ hasFile:
          hasCompletedFileUploads(activeFileUploads),
        hasErrorMessage: !!errorMessage,
        customSendIconStyle: styles?.sendMessageIcon
      }),
    [
      theme,
      textValue,
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ activeFileUploads,
      errorMessage,
      styles?.sendMessageIcon
    ]
  );

  const onRenderSendIcon = useCallback(
    (isHover: boolean) =>
      onRenderIcon ? (
        onRenderIcon(isHover)
      ) : (
        <Icon iconName={isHover && textValue ? 'SendBoxSendHovered' : 'SendBoxSend'} className={mergedSendIconStyle} />
      ),
    [mergedSendIconStyle, onRenderIcon, textValue]
  );

  // Ensure that errors are cleared when there are no files in sendBox
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  React.useEffect(() => {
    if (!activeFileUploads?.filter((upload) => !upload.error).length) {
      setAttachmentUploadsPendingError(undefined);
    }
  }, [activeFileUploads]);

  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  const sendBoxErrorsProps = useMemo(() => {
    return {
      attachmentUploadsPendingError: attachmentUploadsPendingError,
      attachmentUploadError: activeFileUploads?.filter((attachmentUpload) => attachmentUpload.error).pop()?.error
    };
  }, [activeFileUploads, attachmentUploadsPendingError]);

  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  const onRenderFileUploads = useCallback(() => {
    if (!activeFileUploads?.filter((upload) => !upload.error).length) {
      return null;
    }
    return props.onRenderFileUploads ? (
      props.onRenderFileUploads()
    ) : (
      <Stack className={attachmentUploadCardsStyles}>
        <FluentV9ThemeProvider v8Theme={theme}>
          <_AttachmentUploadCards
            activeFileUploads={activeFileUploads}
            onCancelFileUpload={props.onCancelFileUpload}
            strings={{
              removeAttachment: props.strings?.removeAttachment ?? localeStrings.removeAttachment,
              uploading: props.strings?.uploading ?? localeStrings.uploading,
              uploadCompleted: props.strings?.uploadCompleted ?? localeStrings.uploadCompleted
            }}
          />
        </FluentV9ThemeProvider>
      </Stack>
    );
  }, [
    activeFileUploads,
    props,
    theme,
    localeStrings.removeAttachment,
    localeStrings.uploading,
    localeStrings.uploadCompleted
  ]);

  return (
    <Stack
      className={mergeStyles(
        sendBoxWrapperStyles,
        { overflow: 'visible' } // This is needed for the mention popup to be visible
      )}
    >
      {
        /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ <SendBoxErrors
          {...sendBoxErrorsProps}
        />
      }
      <Stack
        className={borderAndBoxShadowStyle({
          theme,
          hasErrorMessage: !!errorMessage,
          disabled: !!disabled
        })}
      >
        <InputBoxComponent
          autoFocus={autoFocus}
          data-ui-id={ids.sendboxTextField}
          disabled={disabled}
          errorMessage={onRenderSystemMessage ? onRenderSystemMessage(errorMessage) : errorMessage}
          textFieldRef={sendTextFieldRef}
          id="sendbox"
          placeholderText={strings.placeholderText}
          textValue={textValue}
          onChange={(_, newValue) => setText(newValue)}
          onKeyDown={(ev) => {
            const keyWasSendingMessage = ev.key === 'Enter' && (ev.shiftKey === false || !supportNewline);
            if (!keyWasSendingMessage) {
              onTyping?.();
            }
          }}
          onEnterKeyDown={() => {
            sendMessageOnClick();
          }}
          styles={mergedStyles}
          supportNewline={supportNewline}
          maxLength={MAXIMUM_LENGTH_OF_MESSAGE}
          /* @conditional-compile-remove(mention) */
          mentionLookupOptions={mentionLookupOptions}
        >
          <InputBoxButton
            onRenderIcon={onRenderSendIcon}
            onClick={(e) => {
              if (!textValueOverflow) {
                sendMessageOnClick();
              }
              e.stopPropagation();
            }}
            id={'sendIconWrapper'}
            className={mergedSendButtonStyle}
            ariaLabel={localeStrings.sendButtonAriaLabel}
            tooltipContent={localeStrings.sendButtonAriaLabel}
          />
        </InputBoxComponent>
        {
          /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
          onRenderFileUploads()
        }
      </Stack>
    </Stack>
  );
};
