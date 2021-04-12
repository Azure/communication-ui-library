// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { mergeStyles, TooltipHost } from '@fluentui/react';
import { MessageStatus } from '../types/ChatMessage';
import { SizeValue } from '@fluentui/react-northstar';
import { readReceiptIconErrorStyle, readReceiptIconMessageStyle } from './styles/ReadReceipt.styles';
import { CircleRingIcon, CompletedIcon, ErrorIcon } from '@fluentui/react-icons';
import { MessageSeenIcon } from '@fluentui/react-icons-northstar';
import { BaseCustomStylesProps } from '../types';

/**
 * Props for ReadReceipt component
 */
export interface ReadReceiptProps {
  /** Message status that determines the read receipt icon to show. */
  messageStatus: MessageStatus;
  /** Text to display in the delivered read receipt icon tooltip. */
  deliveredTooltipText?: string;
  /** Text to display in the seen read receipt icon tooltip. */
  seenTooltipText?: string;
  /** Text to display in the sending read receipt icon tooltip. */
  sendingTooltipText?: string;
  /** Text to display in the failed read receipt icon tooltip. */
  failedToSendTooltipText?: string;
  /** Size of the read receipt icon. */
  size?: SizeValue;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <ReadReceipt styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStylesProps;
}

/**
 * ReadReceipt component.
 */
export const ReadReceipt = (props: ReadReceiptProps): JSX.Element => {
  const {
    messageStatus,
    deliveredTooltipText = 'Sent',
    seenTooltipText = 'Seen',
    sendingTooltipText = 'Sending',
    failedToSendTooltipText = 'Failed to send',
    size = 'medium',
    styles
  } = props;

  switch (messageStatus) {
    case 'failed':
      return (
        <TooltipHost content={failedToSendTooltipText}>
          <ErrorIcon className={mergeStyles(readReceiptIconErrorStyle, styles?.root)} />
        </TooltipHost>
      );
    case 'sending':
      return (
        <TooltipHost content={sendingTooltipText}>
          <CircleRingIcon className={mergeStyles(readReceiptIconMessageStyle, styles?.root)} />
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
          <CompletedIcon className={mergeStyles(readReceiptIconMessageStyle, styles?.root)} />
        </TooltipHost>
      );
    default:
      return <></>;
  }
};
