// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import {
  Icon,
  IconButton,
  PrimaryButton,
  Stack,
  useTheme,
  Text,
  IIconProps,
  DefaultButton,
  Link,
  IStackStyles,
  IButtonStyles,
  IIconStyles
} from '@fluentui/react';
import { cancelIcon } from './styles/ImageOverlay.style';
import {
  containerStyles,
  hiddenContainerStyles,
  messageTextStyles,
  notificationIconStyles,
  notificationLinkStyles,
  titleTextStyles
} from './styles/Notification.styles';

/**
 * Props for {@link Notification}.
 *
 * @public
 */
export interface NotificationProps {
  /**
   * Notification bar strings;
   */
  notificationStrings?: NotificationStrings;

  /**
   * Notification bar icon;
   */
  notificationIconProps?: IIconProps;

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
   * Callback called when the secondary button inside notification bar is clicked.
   */
  onClickSecondaryButton?: () => void;

  /**
   * Callback called when the notification is dismissed.
   */
  onDismiss?: () => void;

  /**
   * Hyperlink attached to the notification.
   */
  link?: string;

  /**
   * Styles for the incoming call notifications.
   */
  styles?: NotificationStyles;
}

/**
 * All strings that may be shown on the UI in the {@link Notification}.
 *
 * @public
 */
export interface NotificationStrings {
  /**
   * Notification bar title.
   */
  title: string;
  /**
   * Notification bar dismiss button aria label
   */
  dismissButtonAriaLabel?: string;
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
  /**
   * Notification bar link label
   */
  linkLabel?: string;
}

/**
 * Styles for the notification component.
 *
 * @public
 */
export interface NotificationStyles {
  /**
   * Styles for the primary button.
   */
  primaryButton?: IButtonStyles;
  /**
   * Styles for the secondary button.
   */
  secondaryButton?: IButtonStyles;
  /**
   * Styles for the root container.
   */
  root?: IStackStyles;
  /**
   * Styles for the notification title.
   */
  title?: IStackStyles;
  /**
   * Styles for the notification icon.
   */
  icon?: IIconStyles;
  /**
   * Styles for the notification content.
   */
  content?: IStackStyles;
  /**
   * Styles for the notification hyperlink.
   */
  link?: IStackStyles;
}

/**
 * A component to show notification messages on the UI.
 *
 * @public
 */
export const Notification = (props: NotificationProps): JSX.Element => {
  const strings = props.notificationStrings;
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
      <Stack data-ui-id="notification-bar" styles={props.styles?.root ?? containerStyles(theme)}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal>
            <Icon
              styles={props.styles?.icon ?? notificationIconStyles()}
              iconName={props.notificationIconProps?.iconName ?? 'ErrorBadge'}
              {...props.notificationIconProps}
            />
            <Text styles={props.styles?.title ?? titleTextStyles()}>{strings?.title}</Text>
          </Stack>
          {props.onDismiss && (
            <IconButton
              iconProps={cancelIcon}
              ariaLabel={strings?.dismissButtonAriaLabel}
              aria-live={'polite'}
              onClick={props.onDismiss}
            />
          )}
        </Stack>
        <Text styles={props.styles?.content ?? messageTextStyles(theme)}>
          {strings?.message}
          <Link styles={props.styles?.link ?? notificationLinkStyles(theme)} href={props.link} target="_blank">
            {strings?.linkLabel}
          </Link>
        </Text>
        <Stack horizontal horizontalAlign="space-evenly">
          {strings?.secondaryButtonLabel && (
            <DefaultButton
              onClick={props.onClickSecondaryButton}
              styles={props.styles?.secondaryButton ?? { root: { marginTop: '1rem' } }}
            >
              {strings?.secondaryButtonLabel}
            </DefaultButton>
          )}
          {strings?.primaryButtonLabel && (
            <PrimaryButton
              onClick={props.onClickPrimaryButton}
              styles={props.styles?.primaryButton ?? { root: { marginTop: '1rem' } }}
            >
              {strings?.primaryButtonLabel}
            </PrimaryButton>
          )}
        </Stack>
      </Stack>
      {props.showStackedEffect && <Stack className={hiddenContainerStyles(theme)}></Stack>}
    </Stack>
  );
};
