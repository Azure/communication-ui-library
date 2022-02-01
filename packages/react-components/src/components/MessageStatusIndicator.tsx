// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, mergeStyles, TooltipHost } from '@fluentui/react';
import { MessageStatus } from '@internal/acs-ui-common';
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
  /** Text to display in the seen message icon tooltip. */
  seenTooltipText: string;
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
  numRead?: number;
  numParticipants?: number;
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
  const { status, styles, numRead, numParticipants } = props;

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
        <TooltipHost content={`Read by ${numRead} of ${numParticipants}`}>
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
