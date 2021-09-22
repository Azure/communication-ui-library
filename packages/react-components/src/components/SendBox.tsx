// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useMemo, useCallback } from 'react';
import { IStyle, ITextField, mergeStyles, concatStyleSets, Icon } from '@fluentui/react';
import { sendBoxStyle, sendBoxStyleSet, sendButtonStyle, sendIconStyle } from './styles/SendBox.styles';
import { BaseCustomStylesProps } from '../types';
import { useTheme } from '../theming';
import { useLocale } from '../localization';
import { useIdentifiers } from '../identifiers';
import { InputBoxButton, InputBoxButtonProps, InputBoxComponent } from './InputBoxComponent';

const EMPTY_MESSAGE_REGEX = /^\s*$/;
const MAXIMUM_LENGTH_OF_MESSAGE = 8000;

export interface SendBoxStylesProps extends BaseCustomStylesProps {
  /** Styles for the text field. */
  textField?: IStyle;
  /** Styles for the container of the send message icon. */
  sendMessageIconContainer?: IStyle;
  /** Styles for the send message icon; These styles will be ignored when a custom send message icon is provided. */
  sendMessageIcon?: IStyle;
  /** Styles for the system message; These styles will be ignored when a custom system message component is provided. */
  systemMessage?: IStyle;
}

/**
 * Strings of SendBox that can be overridden
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
}

/**
 * Props for SendBox component
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
   * @defaultValue SendIcon
   */
  onRenderIcon?: (props: InputBoxButtonProps, isMouseOverSendIcon: boolean) => JSX.Element;
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
}

/**
 * `SendBox` is a component for users to send messages and typing notifications. An optional message
 * can also be shown below the `SendBox`.
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
    styles
  } = props;
  const theme = useTheme();
  const localeStrings = useLocale().strings.sendBox;
  const strings = { ...localeStrings, ...props.strings };
  const ids = useIdentifiers();

  const [textValue, setTextValue] = useState('');
  const [textValueOverflow, setTextValueOverflow] = useState(false);

  const sendTextFieldRef = React.useRef<ITextField>(null);

  const sendMessageOnClick = (): void => {
    // don't send a message when disabled
    if (disabled || textValueOverflow) {
      return;
    }
    // we dont want to send empty messages including spaces, newlines, tabs
    if (!EMPTY_MESSAGE_REGEX.test(textValue)) {
      onSendMessage && onSendMessage(textValue);
      setTextValue('');
    }
    sendTextFieldRef.current?.focus();
  };
  const setText = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void => {
    if (newValue === undefined) return;

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

  const mergedStyles = useMemo(() => concatStyleSets(sendBoxStyleSet, styles), [styles]);

  const hasText = !!textValue;
  const mergedSendIconStyle = useMemo(
    () =>
      mergeStyles(
        sendIconStyle,
        {
          color: !!errorMessage || !hasText ? theme.palette.neutralTertiary : theme.palette.themePrimary
        },
        styles?.sendMessageIcon
      ),
    [errorMessage, hasText, theme, styles?.sendMessageIcon]
  );

  const onRenderSendIcon = useCallback(
    (props: InputBoxButtonProps, isMouseOverSendIcon: boolean) =>
      onRenderIcon ? (
        onRenderIcon(props, isMouseOverSendIcon)
      ) : (
        <Icon iconName={isMouseOverSendIcon ? 'SendBoxSendHovered' : 'SendBoxSend'} className={mergedSendIconStyle} />
      ),
    [mergedSendIconStyle, onRenderIcon]
  );

  return (
    <InputBoxComponent
      data-ui-id={ids.sendboxTextfield}
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
      />
    </InputBoxComponent>
  );
};
