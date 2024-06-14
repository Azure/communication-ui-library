// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(teams-meeting-conference) */
import { IMessageBarProps } from '@fluentui/react';
/* @conditional-compile-remove(teams-meeting-conference) */
import { NotificationBar } from '@internal/react-components';
/* @conditional-compile-remove(teams-meeting-conference) */
import React, { useEffect, useMemo, useState } from 'react';

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * @private
 */
export interface ConnectionLostBannerProps extends IMessageBarProps {
  connectionLost: boolean;
  onDismissNotification?: () => void;
  onPrimaryButtonClick?: () => void;
}

/**
 * Create a record for when the notification was most recently dismissed for tracking dismissed notifications.
 *
 * @private
 */
export const useConnectionLostNotifications = (connectionLostFlag: boolean): ConnectionLostBannerProps => {
  const [currentConnectionLost, setCurrentConnectionLost] = useState<boolean>(false);

  useEffect(() => {
    console.log('useConnectionLostNotifications: connectionLostFlag: ', connectionLostFlag);
    setCurrentConnectionLost(connectionLostFlag);
  }, [connectionLostFlag]);

  const connectionLost = useMemo(() => currentConnectionLost, [currentConnectionLost]);

  return {
    connectionLost: connectionLost
  };
};

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * Default dehavior to close Banner
 * @private
 */
export const onDismissNotification = (props: ConnectionLostBannerProps): void => {
  props.connectionLost = false;
};

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * Connection lost notification bar during teams meeting, which provides a message to use PSTN option.
 * @beta
 */
export const ConnectionLostNotificationBar = (props: ConnectionLostBannerProps): JSX.Element => {
  const strings = {
    title: 'Poor Network Quality',
    closeButtonAriaLabel: 'Close',
    message: 'Join this call from your phone for better sound. You can continue viewing the meeting on this device.',
    primaryButtonLabel: 'Join by Phone'
  };

  return (
    <NotificationBar
      notificationBarStrings={strings}
      notificationBarIconProps={{ iconName: 'ErrorBarCallNetworkQualityLow' }}
      onClickPrimaryButton={() => props.onPrimaryButtonClick && props.onPrimaryButtonClick()}
      onDismiss={() => (props.onDismissNotification && props.onDismissNotification()) || onDismissNotification(props)}
    />
  );
};
