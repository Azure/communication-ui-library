// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { Icon, IconButton, PrimaryButton, Stack, useTheme, Text, IIconProps, DefaultButton } from '@fluentui/react';
import { cancelIcon } from './styles/ImageOverlay.style';
import {
  containerStyles,
  hiddenContainerStyles,
  messageTextStyle,
  notificationIconClassName,
  titleTextClassName
} from './styles/NotificationBar.styles';

/**
 * Props for {@link NotificationBar}.
 *
 * @beta
 */
export interface NotificationBarProps {
  /**
   * Notification bar strings;
   */
  notificationBarStrings?: NotificationBarStrings;

  /**
   * Notification bar icon;
   */
  notificationBarIconProps?: IIconProps;

  /**
   * If set, notifications will automatically dismiss after 5 seconds
   * @defaultValue false
   */
  autoDismiss?: boolean;

  /**
   * If set, notifications will be shown in a stacked effect
   * @defaultValue false
   */
  showStackedEffect?: boolean;

  /**
   * Callback called when the primary button inside notification bar is clicked.
   */
  onClickPrimaryButton?: () => void;

  /**
   * Callback called when the primary button inside notification bar is clicked.
   */
  onClickSecondaryButton?: () => void;

  /**
   * Callback called when the notification is dismissed.
   */
  onDismiss?: () => void;
}

/**
 * All strings that may be shown on the UI in the {@link NotificationBar}.
 *
 * @beta
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
   * Notification bar primary button label
   */
  primaryButtonLabel?: string;
  /**
   * Notification bar secondary button label
   */
  secondaryButtonLabel?: string;
}

/**
 * A component to show notification messages on the UI.
 *
 * @beta
 */
export const NotificationBar = (props: NotificationBarProps): JSX.Element => {
  const strings = props.notificationBarStrings;
  const theme = useTheme();
  const [show, setShow] = useState(true);

  if (props.autoDismiss) {
    setTimeout(() => {
      // After 5 seconds set the show value to false
      setShow(false);
    }, 5000);

    if (!show) {
      props.onDismiss && props.onDismiss();
      return <></>;
    }
  }

  return (
    <Stack horizontalAlign="center">
      <Stack data-ui-id="notification-bar" className={containerStyles(theme)}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal>
            <Icon
              className={notificationIconClassName}
              iconName={props.notificationBarIconProps?.iconName ?? 'ErrorBadge'}
              {...props.notificationBarIconProps}
            />
            <Text className={titleTextClassName}>{strings?.title}</Text>
          </Stack>

          <IconButton
            iconProps={cancelIcon}
            ariaLabel={strings?.closeButtonAriaLabel}
            aria-live={'polite'}
            onClick={props.onDismiss}
          />
        </Stack>
        <Text className={messageTextStyle(theme)}>{strings?.message}</Text>
        <Stack horizontal horizontalAlign="space-evenly">
          {strings?.secondaryButtonLabel && (
            <DefaultButton onClick={props.onClickSecondaryButton} style={{ marginTop: '1rem' }}>
              {strings?.secondaryButtonLabel}
            </DefaultButton>
          )}
          {strings?.primaryButtonLabel && (
            <PrimaryButton onClick={props.onClickPrimaryButton} style={{ marginTop: '1rem' }}>
              {strings?.primaryButtonLabel}
            </PrimaryButton>
          )}
        </Stack>
      </Stack>
      {props.showStackedEffect && <Stack className={hiddenContainerStyles(theme)}></Stack>}
    </Stack>
  );
};
