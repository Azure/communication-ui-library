// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ICalloutContentStyles, Icon, ITooltipHostStyles, mergeStyles, Theme, TooltipHost } from '@fluentui/react';
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
import { MessageStatusIndicatorStrings } from './MessageStatusIndicator';

/**
 * Props for {@link MessageStatusIndicatorInternal}.
 *
 * @internal
 */
export interface MessageStatusIndicatorInternalProps {
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
  /**
   * Optional call back to provide LiveMessage component for accessibility
   */
  shouldAnnounce: boolean;
}

/**
 * Component to display the status of a sent message.
 *
 * Adds an icon and tooltip corresponding to the message status.
 *
 * @internal
 */
export const MessageStatusIndicatorInternal = (props: MessageStatusIndicatorInternalProps): JSX.Element => {
  const { status, styles, remoteParticipantsCount, onToggleToolTip, readCount, shouldAnnounce } = props;
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
          {renderIconWithAnnouncer(status, strings, shouldAnnounce, theme, styles)}
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
          {renderIconWithAnnouncer(status, strings, shouldAnnounce, theme, styles)}
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
          {renderIconWithAnnouncer(status, strings, shouldAnnounce, theme, styles)}
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
          {renderIconWithAnnouncer(status, strings, shouldAnnounce, theme, styles)}
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

const renderIconWithAnnouncer = (
  status: string,
  strings: MessageStatusIndicatorStrings,
  shouldAnnounce: boolean,
  theme: Theme,
  styles: BaseCustomStyles | undefined
): JSX.Element => {
  switch (status) {
    case 'failed':
      return (
        <>
          {shouldAnnounce
            ? strings.failedToSendAriaLabel && <LiveMessage message={strings.failedToSendAriaLabel} ariaLive="polite" />
            : undefined}
          <Icon
            role="status"
            data-ui-id="chat-composite-message-status-icon"
            aria-label={shouldAnnounce ? strings.failedToSendAriaLabel : ''}
            iconName="MessageFailed"
            className={mergeStyles(
              MessageStatusIndicatorErrorIconStyle,
              { color: theme.palette.redDark },
              styles?.root
            )}
          />
        </>
      );
    case 'sending':
      return (
        <>
          {shouldAnnounce
            ? strings.sendingAriaLabel && <LiveMessage message={strings.sendingAriaLabel} ariaLive="polite" />
            : undefined}
          <Icon
            role="status"
            data-ui-id="chat-composite-message-status-icon"
            aria-label={shouldAnnounce ? strings.sendingAriaLabel : ''}
            iconName="MessageSending"
            className={mergeStyles(
              MessageStatusIndicatorIconStyle,
              { color: theme.palette.themePrimary },
              styles?.root
            )}
          />
        </>
      );
    case 'seen':
      return (
        <>
          {shouldAnnounce
            ? strings.seenAriaLabel && <LiveMessage message={strings.seenAriaLabel} ariaLive="polite" />
            : undefined}
          <Icon
            data-ui-id="chat-composite-message-status-icon"
            role="status"
            aria-label={shouldAnnounce ? strings.seenAriaLabel : ''}
            iconName="MessageSeen"
            className={mergeStyles({ color: theme.palette.themePrimary }, styles?.root)}
          />
        </>
      );
    case 'delivered':
      return (
        <>
          {shouldAnnounce
            ? strings.deliveredAriaLabel && <LiveMessage message={strings.deliveredAriaLabel} ariaLive="polite" />
            : undefined}
          <Icon
            role="status"
            aria-label={shouldAnnounce ? strings.deliveredAriaLabel : ''}
            data-ui-id="chat-composite-message-status-icon"
            iconName="MessageDelivered"
          />
        </>
      );
    default:
      return <></>;
  }
};
