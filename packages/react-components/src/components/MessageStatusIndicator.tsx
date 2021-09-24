// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, mergeStyles, TooltipHost } from '@fluentui/react';
import { MessageStatus } from '@internal/acs-ui-common';
import React from 'react';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import { BaseCustomStylesProps } from '../types';
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
  /** Text to display in the delivered message icon tooltip. */
  deliveredTooltipText: string;
  /** Text to display in the seen message icon tooltip. */
  seenTooltipText: string;
  /** Text to display in the sending message icon tooltip. */
  sendingTooltipText: string;
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
  /**
   * Allows users to pass an object containing custom CSS styles.
   * @Example
   * ```
   * <MessageStatus styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStylesProps;
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
  const { status, styles } = props;

  const localeStrings = useLocale().strings.messageStatusIndicator;
  const strings = { ...localeStrings, ...props.strings };
  const theme = useTheme();

  switch (status) {
    case 'failed':
      return (
        <TooltipHost content={strings.failedToSendTooltipText}>
          <Icon
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
        <TooltipHost content={strings.seenTooltipText}>
          <Icon iconName="MessageSeen" className={mergeStyles({ color: theme.palette.black }, styles?.root)} />
        </TooltipHost>
      );
    case 'delivered':
      return (
        <TooltipHost content={strings.deliveredTooltipText}>
          <Icon
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
