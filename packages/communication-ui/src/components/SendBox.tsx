// © Microsoft Corporation. All rights reserved.

import { EMPTY_MESSAGE_REGEX, MAXIMUM_LENGTH_OF_MESSAGE, TEXT_EXCEEDS_LIMIT } from '../constants';
import React, { useState } from 'react';
import {
  IStyle,
  ITextField,
  mergeStyles,
  Stack,
  TextField,
  MessageBar,
  MessageBarType,
  concatStyleSets
} from '@fluentui/react';
import { SendIcon } from '@fluentui/react-northstar';
import {
  TextFieldStyleProps,
  sendBoxStyle,
  sendBoxWrapperStyle,
  sendButtonStyle,
  sendIconDiv,
  suppressIconStyle
} from './styles/SendBox.styles';
import { BaseCustomStylesProps } from '../types';

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
  onSendMessage?: (messageContent: string) => Promise<void>;
  /**
   * Optional callback called when user is typing
   */
  onSendTypingNotification?: () => Promise<void>;
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
  onRenderIcon?: (props: SendBoxProps, isMouseOverSendIcon: boolean) => JSX.Element | null;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <SendBox styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: SendBoxStylesProps;
}

const defaultOnRenderSystemMessage = (
  systemMessage: string | undefined,
  style: IStyle | undefined
): JSX.Element | undefined =>
  systemMessage ? (
    <MessageBar messageBarType={MessageBarType.info} styles={concatStyleSets(suppressIconStyle, { root: style })}>
      {systemMessage}
    </MessageBar>
  ) : undefined;

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
    onSendTypingNotification,
    onRenderIcon,
    styles
  } = props;

  const [textValue, setTextValue] = useState('');
  const [textValueOverflow, setTextValueOverflow] = useState(false);
  const [isMouseOverSendIcon, setIsMouseOverSendIcon] = useState(false);

  const sendTextFieldRef = React.useRef<ITextField>(null);

  const onRenderSystemMessage = props.onRenderSystemMessage ?? defaultOnRenderSystemMessage;

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
  const setText = (e: any): void => {
    if (e.target.value.length > MAXIMUM_LENGTH_OF_MESSAGE) {
      setTextValueOverflow(true);
    } else {
      setTextValueOverflow(false);
    }
    setTextValue(e.target.value);
  };

  const textTooLongMessage = textValueOverflow ? TEXT_EXCEEDS_LIMIT : undefined;

  return (
    <Stack className={mergeStyles(sendBoxWrapperStyle, styles?.root)}>
      <Stack horizontal={true}>
        <TextField
          multiline
          autoAdjustHeight
          multiple={false}
          resizable={false}
          componentRef={sendTextFieldRef}
          id="sendbox"
          ariaLabel={'Type'}
          inputClassName={sendBoxStyle}
          placeholder="Type a new message"
          value={textValue}
          onChange={setText}
          autoComplete="off"
          onKeyDown={(ev) => {
            if (ev.key === 'Enter' && (ev.shiftKey === false || !supportNewline) && !textValueOverflow) {
              ev.preventDefault();
              sendMessageOnClick();
            }
            onSendTypingNotification && onSendTypingNotification();
          }}
          styles={concatStyleSets(TextFieldStyleProps, { fieldGroup: styles?.textField })}
        />

        <div
          className={mergeStyles(sendButtonStyle, styles?.sendMessageIconContainer)}
          onClick={(e) => {
            if (!textValueOverflow) {
              sendMessageOnClick();
            }
            e.stopPropagation();
          }}
          id={'sendIconWrapper'}
          onMouseEnter={() => {
            setIsMouseOverSendIcon(true);
          }}
          onMouseLeave={() => {
            setIsMouseOverSendIcon(false);
          }}
        >
          {onRenderIcon ? (
            onRenderIcon(props, isMouseOverSendIcon)
          ) : (
            <SendIcon className={mergeStyles(sendIconDiv, styles?.sendMessageIcon)} outline={!isMouseOverSendIcon} />
          )}
        </div>
      </Stack>
      {onRenderSystemMessage(systemMessage ? systemMessage : textTooLongMessage, styles?.systemMessage)}
    </Stack>
  );
};
