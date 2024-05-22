// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Icon, IconButton, PrimaryButton, Stack, Theme, mergeStyles, useTheme, Text } from '@fluentui/react';
import { cancelIcon } from './styles/ImageOverlay.style';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * Props for {@link NotificationBar}.
 *
 * @public
 */
export interface NotificationBarProps {
  /**
   * Notification bar strings;
   */
  notificationBarStrings?: NotificationBarStrings;

  /**
   * Notification bar icon;
   */
  notificationBarIconName?: string;

  /**
   * If set, notifications will automatically dismiss after 5 seconds
   * @defaultValue false
   */
  autoDismiss?: boolean;

  /**
   * Callback called when the button inside notification bar is clicked.
   */
  onClick?: () => void;
}

/**
 * All strings that may be shown on the UI in the {@link NotificationBar}.
 *
 * @public
 */
export interface NotificationBarStrings {
  /**
   * Notification bar title.
   */
  title: string;
  /**
   * Notification bar close button aria label
   */
  closeButtonAriaLabel: string;
  /**
   * Notification bar message.
   */
  message?: string;
  /**
   * Notification bar button label
   */
  buttonLabel?: string;
}

/**
 * A component to show notification messages on the UI.
 *
 * @public
 */
export const NotificationBar = (props: NotificationBarProps): JSX.Element => {
  const strings = props.notificationBarStrings;
  const theme = useTheme();
  const messageTextStyle = (theme: Theme): string =>
    mergeStyles({
      fontWeight: 400,
      fontSize: _pxToRem(14),
      lineHeight: _pxToRem(16),
      color: theme.palette.neutralSecondary
    });

  const titleTextStyle = (theme: Theme): string =>
    mergeStyles({
      fontWeight: 400,
      fontSize: _pxToRem(14),
      lineHeight: _pxToRem(16),
      alignSelf: 'center'
    });

  const containerStyles = (theme: Theme): string =>
    mergeStyles({
      boxShadow: theme.effects.elevation8,
      width: '20rem',
      padding: '0.75rem',
      borderRadius: '0.25rem'
    });
  return (
    <Stack data-ui-id="notification-bar-stack" className={containerStyles(theme)}>
      <Stack horizontal horizontalAlign="space-between">
        <Stack horizontal>
          <Icon
            style={{ fontSize: '1.25rem', alignSelf: 'center', marginRight: '0.5rem' }}
            iconName={props.notificationBarIconName}
          />
          <Text className={titleTextStyle(theme)}>{strings.title}</Text>
        </Stack>

        <IconButton iconProps={cancelIcon} ariaLabel={strings.closeButtonAriaLabel} aria-live={'polite'} />
      </Stack>
      <Text className={messageTextStyle(theme)}>{strings.message}</Text>
      <PrimaryButton onClick={props.onClick} style={{ marginTop: '1rem' }}>
        {strings.buttonLabel}
      </PrimaryButton>
    </Stack>
  );
};
