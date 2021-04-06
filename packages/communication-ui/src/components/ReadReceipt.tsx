// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { mergeStyles, TooltipHost } from '@fluentui/react';
import { MessageStatus } from '../types/ChatMessage';
import { SizeValue } from '@fluentui/react-northstar/dist/commonjs/utils/commonPropInterfaces';
import { readReceiptIconErrorStyle, readReceiptIconMessageStyle } from './styles/ReadReceipt.styles';
import { CircleRingIcon, CompletedIcon, ErrorIcon } from '@fluentui/react-icons';
import { MessageSeenIcon } from '@fluentui/react-icons-northstar';
import { ErrorHandlingProps } from '../providers/ErrorProvider';
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
export const ReadReceipt = (props: ReadReceiptProps & ErrorHandlingProps): JSX.Element => {
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
    case MessageStatus.FAILED:
      return (
        <TooltipHost content={failedToSendTooltipText}>
          <ErrorIcon className={mergeStyles(readReceiptIconErrorStyle, styles?.root)} />
        </TooltipHost>
      );
    case MessageStatus.SENDING:
      return (
        <TooltipHost content={sendingTooltipText}>
          <CircleRingIcon className={mergeStyles(readReceiptIconMessageStyle, styles?.root)} />
        </TooltipHost>
      );
    case MessageStatus.SEEN:
      // MessageSeenIcon is only one that takes in size because its a react-northstar-icon. There doesn't seem to be a
      // equivalent one in react-icons and react-icons don't seem to have size property.
      return (
        <TooltipHost content={seenTooltipText}>
          <MessageSeenIcon size={size} className={mergeStyles(styles?.root)} />
        </TooltipHost>
      );
    case MessageStatus.DELIVERED:
      return (
        <TooltipHost content={deliveredTooltipText}>
          <CompletedIcon className={mergeStyles(readReceiptIconMessageStyle, styles?.root)} />
        </TooltipHost>
      );
    default:
      return <></>;
  }
};
