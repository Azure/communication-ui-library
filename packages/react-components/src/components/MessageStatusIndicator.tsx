// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mergeStyles, TooltipHost } from '@fluentui/react';
import { MessageStatus } from 'acs-ui-common';
import { SizeValue } from '@fluentui/react-northstar';
import {
  MessageStatusIndicatorErrorIconStyle,
  MessageStatusIndicatorIconStyle
} from './styles/MessageStatusIndicator.styles';
import { CircleRingIcon, CompletedIcon, ErrorIcon } from '@fluentui/react-icons';
import { MessageSeenIcon } from '@fluentui/react-icons-northstar';
import { BaseCustomStylesProps } from '../types';

/**
 * Props for MessageStatusIndicator component
 */
export interface MessageStatusIndicatorProps {
  /** Message status that determines the icon to display. */
  status?: MessageStatus;
  /** Text to display in the delivered message icon tooltip. */
  deliveredTooltipText?: string;
  /** Text to display in the seen message icon tooltip. */
  seenTooltipText?: string;
  /** Text to display in the sending message icon tooltip. */
  sendingTooltipText?: string;
  /** Text to display in the failed message icon tooltip. */
  failedToSendTooltipText?: string;
  /** Size of the message status icon. */
  size?: SizeValue;
  /**
   * Allows users to pass an object containing custom CSS styles.
   * @Example
   * ```
   * <MessageStatus styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStylesProps;
}

/**
 * MessageStatusIndicator component.
 */
export const MessageStatusIndicator = (props: MessageStatusIndicatorProps): JSX.Element => {
  const {
    status,
    deliveredTooltipText = 'Sent',
    seenTooltipText = 'Seen',
    sendingTooltipText = 'Sending',
    failedToSendTooltipText = 'Failed to send',
    size = 'medium',
    styles
  } = props;

  switch (status) {
    case 'failed':
      return (
        <TooltipHost content={failedToSendTooltipText}>
          <ErrorIcon className={mergeStyles(MessageStatusIndicatorErrorIconStyle, styles?.root)} />
        </TooltipHost>
      );
    case 'sending':
      return (
        <TooltipHost content={sendingTooltipText}>
          <CircleRingIcon className={mergeStyles(MessageStatusIndicatorIconStyle, styles?.root)} />
        </TooltipHost>
      );
    case 'seen':
      // MessageSeenIcon is only one that takes in size because its a react-northstar-icon. There doesn't seem to be a
      // equivalent one in react-icons and react-icons don't seem to have size property.
      return (
        <TooltipHost content={seenTooltipText}>
          <MessageSeenIcon size={size} className={mergeStyles(styles?.root)} />
        </TooltipHost>
      );
    case 'delivered':
      return (
        <TooltipHost content={deliveredTooltipText}>
          <CompletedIcon className={mergeStyles(MessageStatusIndicatorIconStyle, styles?.root)} />
        </TooltipHost>
      );
    default:
      return <></>;
  }
};
