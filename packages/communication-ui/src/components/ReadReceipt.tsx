// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { TooltipHost } from '@fluentui/react';
import { MessageStatus } from '../types/ChatMessage';
import { SizeValue } from '@fluentui/react-northstar/dist/commonjs/utils/commonPropInterfaces';
import { readReceiptIconErrorStyle, readReceiptIconMessageStyle } from './styles/ReadReceipt.styles';
import { CircleRingIcon, CompletedIcon, ErrorIcon } from '@fluentui/react-icons';
import { MessageSeenIcon } from '@fluentui/react-icons-northstar';
import { ErrorHandlingProps } from '../providers/ErrorProvider';
import { WithErrorHandling } from '../utils/WithErrorHandling';

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
}

/**
 * ReadReciptIcon component.
 */
const ReadReceiptComponentBase = ({
  messageStatus,
  deliveredTooltipText = 'Sent',
  seenTooltipText = 'Seen',
  sendingTooltipText = 'Sending',
  failedToSendTooltipText = 'Failed to send',
  size = 'medium'
}: ReadReceiptProps & ErrorHandlingProps): JSX.Element => {
  switch (messageStatus) {
    case MessageStatus.FAILED:
      return (
        <TooltipHost content={failedToSendTooltipText}>
          <ErrorIcon className={readReceiptIconErrorStyle} />
        </TooltipHost>
      );
    case MessageStatus.SENDING:
      return (
        <TooltipHost content={sendingTooltipText}>
          <CircleRingIcon className={readReceiptIconMessageStyle} />
        </TooltipHost>
      );
    case MessageStatus.SEEN:
      // MessageSeenIcon is only one that takes in size because its a react-northstar-icon. There doesn't seem to be a
      // equivalent one in react-icons and react-icons don't seem to have size property.
      return (
        <TooltipHost content={seenTooltipText}>
          <MessageSeenIcon size={size} />
        </TooltipHost>
      );
    case MessageStatus.DELIVERED:
      return (
        <TooltipHost content={deliveredTooltipText}>
          <CompletedIcon className={readReceiptIconMessageStyle} />
        </TooltipHost>
      );
    default:
      return <></>;
  }
};

export const ReadReceiptComponent = (props: ReadReceiptProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(ReadReceiptComponentBase, props);
