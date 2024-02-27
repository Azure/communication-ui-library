// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageStatus, _formatString } from '@internal/acs-ui-common';
import React from 'react';
import { BaseCustomStyles } from '../types';
import { MessageStatusIndicatorInternal, MessageStatusIndicatorInternalProps } from './MessageStatusIndicatorInternal';

/**
 * Strings of {@link MessageStatusIndicator} that can be overridden.
 *
 * @public
 */
export interface MessageStatusIndicatorStrings {
  /** Aria label to notify user when their message has been delivered. */
  deliveredAriaLabel?: string;
  /** Text to display in the delivered message icon tooltip. */
  deliveredTooltipText: string;
  /** Aria label to notify user when their message has been seen by others. */
  seenAriaLabel?: string;
  /** Text to display in the seen message icon tooltip if read number/ participant number is 1 */
  seenTooltipText: string;
  /** Text to display in the seen message icon tooltip if read number logic is working correctly (more than 1 read number and more than 1 particiants)*/
  readByTooltipText?: string;
  /** Aria label to notify user when their message is being sent. */
  sendingAriaLabel?: string;
  /** Text to display in the sending message icon tooltip. */
  sendingTooltipText: string;
  /** Aria label to notify user when their message has failed to be sent. */
  failedToSendAriaLabel?: string;
  /** Text to display in the failed message icon tooltip. */
  failedToSendTooltipText: string;
}

/**
 * Props for {@link MessageStatusIndicator}.
 *
 * @public
 */
export interface MessageStatusIndicatorProps {
  /** Message status that determines the icon to display. */
  status?: MessageStatus;
  readCount?: number;
  onToggleToolTip?: (isToggled: boolean) => void;
  /** number of participants not including myself */
  remoteParticipantsCount?: number;
  /**
   * Allows users to pass an object containing custom CSS styles.
   * @Example
   * ```
   * <MessageStatus styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStyles;
  /**
   * Optional strings to override in component
   */
  strings?: MessageStatusIndicatorStrings;
}

/**
 * Component to display the status of a sent message.
 *
 * Adds an icon and tooltip corresponding to the message status.
 *
 * @public
 */
export const MessageStatusIndicator = (props: MessageStatusIndicatorProps): JSX.Element => {
  const internalProps: MessageStatusIndicatorInternalProps = {
    ...props,
    shouldAnnounce: true
  };

  return <MessageStatusIndicatorInternal {...internalProps}></MessageStatusIndicatorInternal>;
};
