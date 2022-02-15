// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, mergeStyles, TooltipHost } from '@fluentui/react';
import { MessageStatus, _formatString } from '@internal/acs-ui-common';
import React from 'react';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import { BaseCustomStyles } from '../types';
import {
  MessageStatusIndicatorErrorIconStyle,
  MessageStatusIndicatorIconStyle
} from './styles/MessageStatusIndicator.styles';

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
  /** how many people have read the message */
  messageThreadReadCount?: number;
  /** number of participants not including myself */
  participantCountNotIncludingSelf?: number;
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
  const { status, styles, messageThreadReadCount, participantCountNotIncludingSelf } = props;
  const localeStrings = useLocale().strings.messageStatusIndicator;
  const strings = { ...localeStrings, ...props.strings };
  const theme = useTheme();

  switch (status) {
    case 'failed':
      return (
        <TooltipHost content={strings.failedToSendTooltipText}>
          <Icon
            role="status"
            aria-label={strings.failedToSendAriaLabel}
            iconName="MessageFailed"
            className={mergeStyles(
              MessageStatusIndicatorErrorIconStyle,
              { color: theme.palette.redDark },
              styles?.root
            )}
          />
        </TooltipHost>
      );
    case 'sending':
      return (
        <TooltipHost content={strings.sendingTooltipText}>
          <Icon
            role="status"
            aria-label={strings.sendingAriaLabel}
            iconName="MessageSending"
            className={mergeStyles(
              MessageStatusIndicatorIconStyle,
              { color: theme.palette.themePrimary },
              styles?.root
            )}
          />
        </TooltipHost>
      );
    case 'seen':
      return (
        <TooltipHost
          content={
            // when it's just 1 to 1 texting, we don't need to know who has read the message, just show message as 'seen'
            // when readcount is 0, we have a bug, show 'seen' to cover up as a fall back
            // when participant count is 0, we have a bug, show 'seen' to cover up as a fall back
            (messageThreadReadCount === 1 && participantCountNotIncludingSelf === 1) ||
            messageThreadReadCount === 0 ||
            (participantCountNotIncludingSelf && participantCountNotIncludingSelf <= 0) ||
            !messageThreadReadCount ||
            !participantCountNotIncludingSelf ||
            strings.readByTooltipText === undefined
              ? strings.seenTooltipText
              : _formatString(strings.readByTooltipText, {
                  messageThreadReadCount: `${messageThreadReadCount}`,
                  participantCountNotIncludingSelf: `${participantCountNotIncludingSelf}`
                })
          }
        >
          <Icon
            role="status"
            aria-label={strings.seenAriaLabel}
            iconName="MessageSeen"
            className={mergeStyles({ color: theme.palette.themePrimary }, styles?.root)}
          />
        </TooltipHost>
      );
    case 'delivered':
      return (
        <TooltipHost content={strings.deliveredTooltipText}>
          <Icon
            role="status"
            aria-label={strings.deliveredAriaLabel}
            iconName="MessageDelivered"
            className={mergeStyles(
              MessageStatusIndicatorIconStyle,
              { color: theme.palette.themePrimary },
              styles?.root
            )}
          />
        </TooltipHost>
      );
    default:
      return <></>;
  }
};
