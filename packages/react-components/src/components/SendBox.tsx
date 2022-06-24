// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useMemo, useCallback } from 'react';
import { IStyle, ITextField, mergeStyles, concatStyleSets, Icon, Stack } from '@fluentui/react';
import {
  sendBoxStyle,
  sendButtonStyle,
  sendIconStyle,
  sendBoxWrapperStyles,
  borderAndBoxShadowStyle
} from './styles/SendBox.styles';
import { BaseCustomStyles } from '../types';
import { useTheme } from '../theming';
import { useLocale } from '../localization';
import { useIdentifiers } from '../identifiers';
import { InputBoxComponent } from './InputBoxComponent';
import { VoiceOverButton } from './VoiceOverButton';

/* @conditional-compile-remove(file-sharing) */
import { SendBoxErrors } from './SendBoxErrors';
/* @conditional-compile-remove(file-sharing) */
import { _FileUploadCards } from './FileUploadCards';
/* @conditional-compile-remove(file-sharing) */
import { fileUploadCardsStyles } from './styles/SendBox.styles';
import { SendBoxErrorBarError } from './SendBoxErrorBar';

const EMPTY_MESSAGE_REGEX = /^\s*$/;
const MAXIMUM_LENGTH_OF_MESSAGE = 8000;

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
 * Attributes required for SendBox to show file uploads like name, progress etc.
 * @beta
 */
export interface ActiveFileUpload {
  /**
   * Unique identifier for the file upload.
   */
  id: string;

  /**
   * File name to be rendered for uploaded file.
   */
  filename: string;

  /**
   * A number between 0 and 1 indicating the progress of the upload.
   * This is unrelated to the `uploadComplete` property.
   * It is only used to show the progress of the upload.
   * Progress of 1 doesn't mark the upload as complete, set the `uploadComplete`
   * property to true to mark the upload as complete.
   */
  progress: number;

  /**
   * Error to be displayed to the user if the upload fails.
   */
  error?: SendBoxErrorBarError;

  /**
   * `true` means that the upload is completed.
   * This is independent of the upload `progress`.
   */
  uploadComplete?: boolean;
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
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Error message indicating that all file uploads are not complete.
   */
  fileUploadsPendingError: string;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Aria label to notify user when focus is on cancel file upload button.
   */
  removeFile: string;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Aria label to notify user file uploading starts.
   */
  uploading: string;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Aria label to notify user file is uploaded.
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
   * Optional callback called when message is sent
   */
  onSendMessage?: (content: string) => Promise<void>;
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
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Optional callback to render uploaded files in the SendBox. The sendbox will expand
   * veritcally to accomodate the uploaded files. File uploads will
   * be rendered below the text area in sendbox.
   * @beta
   */
  onRenderFileUploads?: () => JSX.Element;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Optional array of active file uploads where each object has attibutes
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
    autoFocus
  } = props;
  const theme = useTheme();
  const localeStrings = useLocale().strings.sendBox;
  const strings = { ...localeStrings, ...props.strings };
  const ids = useIdentifiers();

  const [textValue, setTextValue] = useState('');
  const [textValueOverflow, setTextValueOverflow] = useState(false);

  const sendTextFieldRef = React.useRef<ITextField>(null);

  /* @conditional-compile-remove(file-sharing) */
  const [fileUploadsPendingError, setFileUploadsPendingError] = useState<SendBoxErrorBarError | undefined>(undefined);

  const sendMessageOnClick = (): void => {
    // don't send a message when disabled
    if (disabled || textValueOverflow) {
      return;
    }

    // Don't send message until all files have been uploaded successfully
    /* @conditional-compile-remove(file-sharing) */
    setFileUploadsPendingError(undefined);
    /* @conditional-compile-remove(file-sharing) */
    if (hasIncompleteFileUploads(props)) {
      setFileUploadsPendingError({ message: strings.fileUploadsPendingError, timestamp: Date.now() });
      return;
    }

    // we dont want to send empty messages including spaces, newlines, tabs
    // Message can be empty if there is a valid file upload
    if (!EMPTY_MESSAGE_REGEX.test(textValue) || hasFile(props)) {
      onSendMessage && onSendMessage(sanitizeText(textValue));
      setTextValue('');
    }
    sendTextFieldRef.current?.focus();
  };

  const setText = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void => {
    if (newValue === undefined) {
      return;
    }

    if (newValue.length > MAXIMUM_LENGTH_OF_MESSAGE) {
      setTextValueOverflow(true);
    } else {
      setTextValueOverflow(false);
    }
    setTextValue(newValue);
  };

  const textTooLongMessage = textValueOverflow ? strings.textTooLong : undefined;
  const errorMessage = systemMessage ?? textTooLongMessage;

  const mergedSendButtonStyle = useMemo(
    () => mergeStyles(sendButtonStyle, styles?.sendMessageIconContainer),
    [styles?.sendMessageIconContainer]
  );

  const mergedStyles = useMemo(() => concatStyleSets(styles), [styles]);

  const hasText = !!textValue;
  const hasTextOrFile = hasText || hasFile(props);

  const mergedSendIconStyle = useMemo(
    () =>
      mergeStyles(
        sendIconStyle,
        {
          color: !!errorMessage || !hasTextOrFile ? theme.palette.neutralTertiary : theme.palette.themePrimary
        },
        styles?.sendMessageIcon
      ),
    [errorMessage, hasTextOrFile, theme, styles?.sendMessageIcon]
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

  /* @conditional-compile-remove(file-sharing) */
  // Ensure that errors are cleared when there are no files in sendbox
  React.useEffect(() => {
    if (!props.activeFileUploads?.filter((upload) => !upload.error).length) {
      setFileUploadsPendingError(undefined);
    }
  }, [props.activeFileUploads]);

  /* @conditional-compile-remove(file-sharing) */
  const sendBoxErrorsProps = useMemo(() => {
    return {
      fileUploadsPendingError: fileUploadsPendingError,
      fileUploadError: props.activeFileUploads?.filter((fileUpload) => fileUpload.error).pop()?.error
    };
  }, [props.activeFileUploads, fileUploadsPendingError]);

  /* @conditional-compile-remove(file-sharing) */
  const onRenderFileUploads = useCallback(() => {
    if (!props.activeFileUploads?.filter((upload) => !upload.error).length) {
      return null;
    }
    return props.onRenderFileUploads ? (
      props.onRenderFileUploads()
    ) : (
      <Stack className={fileUploadCardsStyles}>
        <_FileUploadCards
          activeFileUploads={props.activeFileUploads}
          onCancelFileUpload={props.onCancelFileUpload}
          strings={{
            removeFile: props.strings?.removeFile ?? localeStrings.removeFile,
            uploading: props.strings?.uploading ?? localeStrings.uploading,
            uploadCompleted: props.strings?.uploadCompleted ?? localeStrings.uploadCompleted
          }}
        />
      </Stack>
    );
  }, [props, localeStrings]);

  return (
    <Stack className={mergeStyles(sendBoxWrapperStyles)}>
      {
        /* @conditional-compile-remove(file-sharing) */
        <SendBoxErrors {...sendBoxErrorsProps} />
      }
      <Stack
        className={mergeStyles(
          borderAndBoxShadowStyle({
            theme,
            hasErrorMessage: !!errorMessage,
            disabled: !!disabled
          })
        )}
      >
        <InputBoxComponent
          autoFocus={autoFocus}
          data-ui-id={ids.sendboxTextField}
          inlineChildren={true}
          disabled={disabled}
          errorMessage={onRenderSystemMessage ? onRenderSystemMessage(errorMessage) : errorMessage}
          textFieldRef={sendTextFieldRef}
          id="sendbox"
          inputClassName={sendBoxStyle}
          placeholderText={strings.placeholderText}
          textValue={textValue}
          onChange={setText}
          onKeyDown={() => {
            onTyping && onTyping();
          }}
          onEnterKeyDown={() => {
            sendMessageOnClick();
          }}
          styles={mergedStyles}
          supportNewline={supportNewline}
          maxLength={MAXIMUM_LENGTH_OF_MESSAGE}
        >
          <VoiceOverButton
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
          /* @conditional-compile-remove(file-sharing) */
          onRenderFileUploads()
        }
      </Stack>
    </Stack>
  );
};

/* @conditional-compile-remove(file-sharing) */
/**
 * @private
 */
const hasIncompleteFileUploads = (props: SendBoxProps): boolean => {
  return !!(
    props.activeFileUploads?.length &&
    !props.activeFileUploads.filter((fileUpload) => !fileUpload.error).every((fileUpload) => fileUpload.uploadComplete)
  );
};

const hasFile = (props: SendBoxProps): boolean => {
  /* @conditional-compile-remove(file-sharing) */
  return !!props.activeFileUploads?.find((file) => !file.error);
  return false;
};

const sanitizeText = (message: string): string => {
  if (EMPTY_MESSAGE_REGEX.test(message)) {
    return '';
  } else {
    return message;
  }
};
