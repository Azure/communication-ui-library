// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState, useMemo, useCallback } from 'react';
import { IStyle, ITextField, mergeStyles, concatStyleSets, Icon, Stack } from '@fluentui/react';
import { sendButtonStyle, sendIconStyle, sendBoxWrapperStyles, borderAndBoxShadowStyle } from './styles/SendBox.styles';
/* @conditional-compile-remove(file-sharing-acs) */
import { useV9CustomStyles } from './styles/SendBox.styles';
import { BaseCustomStyles } from '../types';
import { useTheme } from '../theming';
import { useLocale } from '../localization';
import { useIdentifiers } from '../identifiers';
import { InputBoxComponent } from './InputBoxComponent';
import { InputBoxButton } from './InputBoxButton';
/* @conditional-compile-remove(file-sharing-acs) */
import { SendBoxErrors } from './SendBoxErrors';
/* @conditional-compile-remove(file-sharing-acs) */
import { _AttachmentUploadCards } from './Attachment/AttachmentUploadCards';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadataInProgress, MessageOptions } from '@internal/acs-ui-common';
/* @conditional-compile-remove(file-sharing-acs) */
import { attachmentUploadCardsStyles } from './styles/SendBox.styles';
/* @conditional-compile-remove(file-sharing-acs) */
import { SendBoxErrorBarError } from './SendBoxErrorBar';
/* @conditional-compile-remove(file-sharing-acs) */
import {
  isAttachmentUploadCompleted,
  hasIncompleteAttachmentUploads,
  toAttachmentMetadata
} from './utils/SendBoxUtils';
import {
  MAXIMUM_LENGTH_OF_MESSAGE,
  isMessageTooLong,
  sanitizeText,
  isSendBoxButtonAriaDisabled
} from './utils/SendBoxUtils';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions } from './MentionPopover';
/* @conditional-compile-remove(file-sharing-acs) */
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
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Error message indicating that all attachment uploads are not complete.
   */
  attachmentUploadsPendingError: string;
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Aria label to notify user when focus is on cancel attachment upload button.
   */
  removeAttachment: string;
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Aria label to notify user attachment uploading starts.
   */
  uploading: string;
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Aria label to notify user attachment is uploaded.
   */
  uploadCompleted: string;
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Aria label to notify user more attachment action menu.
   */
  attachmentMoreMenu: string;
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
  onSendMessage?: (
    content: string,
    /* @conditional-compile-remove(file-sharing-acs) */
    options?: MessageOptions
  ) => Promise<void>;
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
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional callback to render uploaded attachments in the SendBox. The sendBox will expand
   * vertically to accommodate the uploaded attachments. Attachment uploads will
   * be rendered below the text area in sendBox.
   * @beta
   */
  onRenderAttachmentUploads?: () => JSX.Element;
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional array of type {@link AttachmentMetadataInProgress}
   * to render attachments being uploaded in the SendBox.
   * @beta
   */
  attachments?: AttachmentMetadataInProgress[];
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optional callback to remove the attachment upload before sending by clicking on
   * cancel icon.
   * @beta
   */
  onCancelAttachmentUpload?: (attachmentId: string) => void;
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
    /* @conditional-compile-remove(file-sharing-acs) */
    attachments
  } = props;
  const theme = useTheme();
  const localeStrings = useLocale().strings.sendBox;
  const strings = { ...localeStrings, ...props.strings };
  const ids = useIdentifiers();

  const [textValue, setTextValue] = useState('');
  const [textValueOverflow, setTextValueOverflow] = useState(false);

  const sendTextFieldRef = React.useRef<ITextField>(null);

  /* @conditional-compile-remove(file-sharing-acs) */
  const customV9Styles = useV9CustomStyles();

  /* @conditional-compile-remove(file-sharing-acs) */
  const [attachmentUploadsPendingError, setAttachmentUploadsPendingError] = useState<SendBoxErrorBarError | undefined>(
    undefined
  );

  const sendMessageOnClick = (): void => {
    // don't send a message when disabled
    if (disabled || textValueOverflow) {
      return;
    }

    // Don't send message until all attachments have been uploaded successfully
    /* @conditional-compile-remove(file-sharing-acs) */
    setAttachmentUploadsPendingError(undefined);

    /* @conditional-compile-remove(file-sharing-acs) */
    if (hasIncompleteAttachmentUploads(attachments)) {
      setAttachmentUploadsPendingError({ message: strings.attachmentUploadsPendingError, timestamp: Date.now() });
      return;
    }

    const message = textValue;
    // we don't want to send empty messages including spaces, newlines, tabs
    // Message can be empty if there is a valid attachment upload
    if (
      sanitizeText(message).length > 0 ||
      /* @conditional-compile-remove(file-sharing-acs) */ isAttachmentUploadCompleted(attachments)
    ) {
      onSendMessage &&
        onSendMessage(
          message,
          /* @conditional-compile-remove(file-sharing-acs) */ /* @conditional-compile-remove(rich-text-editor-composite-support) */
          {
            /* @conditional-compile-remove(file-sharing-acs) */
            attachments: toAttachmentMetadata(attachments),
            /* @conditional-compile-remove(rich-text-editor-composite-support) */
            type: 'text'
          }
        );
      setTextValue('');
      sendTextFieldRef.current?.focus();
    }
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
        hasText: sanitizeText(textValue).length > 0,
        /* @conditional-compile-remove(file-sharing-acs) */ hasAttachment: isAttachmentUploadCompleted(attachments),
        hasErrorMessage: !!errorMessage,
        customSendIconStyle: styles?.sendMessageIcon,
        disabled: !!disabled
      }),
    [
      theme,
      textValue,
      /* @conditional-compile-remove(file-sharing-acs) */ attachments,
      errorMessage,
      styles?.sendMessageIcon,
      disabled
    ]
  );

  const isSendBoxButtonAriaDisabledValue = useMemo(() => {
    return isSendBoxButtonAriaDisabled({
      hasContent: sanitizeText(textValue).length > 0,
      /* @conditional-compile-remove(file-sharing-acs) */ hasCompletedAttachmentUploads:
        isAttachmentUploadCompleted(attachments),
      hasError: !!errorMessage,
      disabled: !!disabled
    });
  }, [
    /* @conditional-compile-remove(file-sharing-acs) */
    attachments,
    disabled,
    errorMessage,
    textValue
  ]);

  const onRenderSendIcon = useCallback(
    (isHover: boolean) =>
      onRenderIcon ? (
        onRenderIcon(isHover)
      ) : (
        <Icon iconName={isHover && textValue ? 'SendBoxSendHovered' : 'SendBoxSend'} className={mergedSendIconStyle} />
      ),
    [mergedSendIconStyle, onRenderIcon, textValue]
  );

  // Ensure that errors are cleared when there are no attachments in sendBox
  /* @conditional-compile-remove(file-sharing-acs) */
  React.useEffect(() => {
    if (!attachments?.filter((upload) => !upload.error).length) {
      setAttachmentUploadsPendingError(undefined);
    }
  }, [attachments]);

  /* @conditional-compile-remove(file-sharing-acs) */
  const sendBoxErrorsProps = useMemo(() => {
    return {
      attachmentUploadsPendingError: attachmentUploadsPendingError,
      attachmentProgressError: attachments?.filter((attachmentUpload) => attachmentUpload.error).pop()?.error
    };
  }, [attachments, attachmentUploadsPendingError]);

  /* @conditional-compile-remove(file-sharing-acs) */
  const onRenderAttachmentUploads = useCallback(() => {
    if (!attachments?.filter((upload) => !upload.error).length) {
      return null;
    }
    return props.onRenderAttachmentUploads ? (
      props.onRenderAttachmentUploads()
    ) : (
      <Stack className={attachmentUploadCardsStyles}>
        <FluentV9ThemeProvider v8Theme={theme} className={customV9Styles.clearBackground}>
          <_AttachmentUploadCards
            attachments={attachments}
            onCancelAttachmentUpload={props.onCancelAttachmentUpload}
            strings={{
              removeAttachment: props.strings?.removeAttachment ?? localeStrings.removeAttachment,
              uploading: props.strings?.uploading ?? localeStrings.uploading,
              uploadCompleted: props.strings?.uploadCompleted ?? localeStrings.uploadCompleted,
              attachmentMoreMenu: props.strings?.attachmentMoreMenu ?? localeStrings.attachmentMoreMenu
            }}
            disabled={disabled}
          />
        </FluentV9ThemeProvider>
      </Stack>
    );
  }, [
    attachments,
    props,
    theme,
    customV9Styles.clearBackground,
    localeStrings.removeAttachment,
    localeStrings.uploading,
    localeStrings.uploadCompleted,
    localeStrings.attachmentMoreMenu,
    disabled
  ]);

  return (
    <Stack
      className={mergeStyles(
        sendBoxWrapperStyles,
        { overflow: 'visible' } // This is needed for the mention popup to be visible
      )}
    >
      {
        /* @conditional-compile-remove(file-sharing-acs) */
        <SendBoxErrors
          attachmentProgressError={
            sendBoxErrorsProps.attachmentProgressError
              ? {
                  message: sendBoxErrorsProps.attachmentProgressError.message,
                  timestamp: Date.now()
                }
              : undefined
          }
          attachmentUploadsPendingError={sendBoxErrorsProps.attachmentUploadsPendingError}
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
            ariaDisabled={isSendBoxButtonAriaDisabledValue}
          />
        </InputBoxComponent>
        {
          /* @conditional-compile-remove(file-sharing-acs) */
          onRenderAttachmentUploads()
        }
      </Stack>
    </Stack>
  );
};
