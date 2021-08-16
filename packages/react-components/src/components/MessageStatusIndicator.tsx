// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mergeStyles, TooltipHost } from '@fluentui/react';
import { MessageStatus } from '@internal/acs-ui-common';
import {
  MessageStatusIndicatorErrorIconStyle,
  MessageStatusIndicatorIconStyle
} from './styles/MessageStatusIndicator.styles';
import {
  Circle20Regular,
  CheckmarkCircle20Regular,
  ErrorCircle20Regular,
  EyeShow20Filled
} from '@fluentui/react-icons';
import { BaseCustomStylesProps } from '../types';
import { useLocale } from '../localization';
import { useTheme } from '../theming';

/**
 * Strings of MessageStatusIndicator that can be overridden
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
 * Props for MessageStatusIndicator component
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
 * MessageStatusIndicator component.
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
          <ErrorCircle20Regular
            primaryFill="currentColor"
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
          <Circle20Regular
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
          <EyeShow20Filled style={{ color: theme.palette.black }} className={mergeStyles(styles?.root)} />
        </TooltipHost>
      );
    case 'delivered':
      return (
        <TooltipHost content={strings.deliveredTooltipText}>
          <CheckmarkCircle20Regular
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
