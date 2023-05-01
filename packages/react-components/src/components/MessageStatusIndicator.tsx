// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ICalloutContentStyles, Icon, ITooltipHostStyles, mergeStyles, TooltipHost } from '@fluentui/react';
import { MessageStatus, _formatString } from '@internal/acs-ui-common';
import React, { useState } from 'react';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import { isDarkThemed } from '../theming/themeUtils';
import { BaseCustomStyles } from '../types';
import {
  MessageStatusIndicatorErrorIconStyle,
  MessageStatusIndicatorIconStyle
} from './styles/MessageStatusIndicator.styles';
import LiveMessage from './Announcer/LiveMessage';

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
  const { status, styles, remoteParticipantsCount, onToggleToolTip, readCount } = props;
  const localeStrings = useLocale().strings.messageStatusIndicator;
  const [isTooltipToggled, setIsTooltipToggled] = useState<boolean>(false);
  const strings = { ...localeStrings, ...props.strings };
  const theme = useTheme();

  const calloutStyle: Partial<ICalloutContentStyles> = { root: { padding: 0 }, calloutMain: { padding: '0.5rem' } };

  // Place callout with no gap between it and the button.
  const calloutProps = {
    gapSpace: 0,
    styles: calloutStyle,
    backgroundColor: isDarkThemed(theme) ? theme.palette.neutralLighter : ''
  };

  switch (status) {
    case 'failed':
      return (
        <TooltipHost
          content={strings.failedToSendTooltipText}
          data-ui-id="chat-composite-message-tooltip"
          calloutProps={{ ...calloutProps }}
          styles={hostStyles}
        >
          {strings.failedToSendAriaLabel && (
            // live message is used here and in the following tooltips so that aria labels are announced on mobile
            <LiveMessage message={strings.failedToSendAriaLabel} ariaLive="polite" />
          )}
          <Icon
            role="status"
            data-ui-id="chat-composite-message-status-icon"
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
        <TooltipHost
          content={strings.sendingTooltipText}
          data-ui-id="chat-composite-message-tooltip"
          calloutProps={{ ...calloutProps }}
          styles={hostStyles}
        >
          {strings.sendingAriaLabel && <LiveMessage message={strings.sendingAriaLabel} ariaLive="polite" />}

          <Icon
            role="status"
            data-ui-id="chat-composite-message-status-icon"
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
          calloutProps={{ ...calloutProps }}
          data-ui-id="chat-composite-message-tooltip"
          styles={hostStyles}
          content={
            // when it's just 1 to 1 texting, we don't need to know who has read the message, just show message as 'seen'
            // when readcount is 0, we have a bug, show 'seen' to cover up as a fall back
            // when participant count is 0, we have a bug, show 'seen' to cover up as a fall back
            readCount === 0 ||
            (remoteParticipantsCount && remoteParticipantsCount <= 1) ||
            !readCount ||
            !remoteParticipantsCount ||
            strings.readByTooltipText === undefined
              ? strings.seenTooltipText
              : _formatString(strings.readByTooltipText, {
                  messageThreadReadCount: `${readCount}`,
                  remoteParticipantsCount: `${remoteParticipantsCount}`
                })
          }
          onTooltipToggle={() => {
            if (onToggleToolTip) {
              onToggleToolTip(!isTooltipToggled);
              setIsTooltipToggled(!isTooltipToggled);
            }
          }}
        >
          {strings.seenAriaLabel && <LiveMessage message={strings.seenAriaLabel} ariaLive="polite" />}

          <Icon
            data-ui-id="chat-composite-message-status-icon"
            role="status"
            aria-label={strings.seenAriaLabel}
            iconName="MessageSeen"
            className={mergeStyles({ color: theme.palette.themePrimary }, styles?.root)}
          />
        </TooltipHost>
      );
    case 'delivered':
      return (
        <TooltipHost
          calloutProps={{ ...calloutProps }}
          content={strings.deliveredTooltipText}
          data-ui-id="chat-composite-message-tooltip"
          styles={hostStyles}
        >
          {strings.deliveredAriaLabel && <LiveMessage message={strings.deliveredAriaLabel} ariaLive="polite" />}
          <Icon
            role="status"
            data-ui-id="chat-composite-message-status-icon"
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

// The TooltipHost root uses display: inline by default.
// To prevent sizing issues or tooltip positioning issues, we override to inline-block.
// For more details see "Icon Button with Tooltip" on https://developer.microsoft.com/en-us/fluentui#/controls/web/button
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };
