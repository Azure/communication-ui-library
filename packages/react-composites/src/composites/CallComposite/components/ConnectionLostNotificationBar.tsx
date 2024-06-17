// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(teams-meeting-conference) */
import { IMessageBarProps } from '@fluentui/react';
/* @conditional-compile-remove(teams-meeting-conference) */
import { NotificationBar } from '@internal/react-components';
/* @conditional-compile-remove(teams-meeting-conference) */
import React, { useEffect, useMemo, useState } from 'react';
/* @conditional-compile-remove(teams-meeting-conference) */
import { useLocale } from '../../localization';

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * @private
 */
export interface ConnectionLostBannerProps extends IMessageBarProps {
  connectionLost: boolean;
  userClosedConnectionLostBanner: boolean;
  onDismissNotification?: () => void;
  onPrimaryButtonClick?: () => void;
}

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * Create a record for when the notification was most recently dismissed for tracking dismissed notifications.
 *
 * @private
 */
export const useConnectionLostNotifications = (
  connectionLostFlag: boolean,
  userClosedConnectionLostBanner: boolean,
  setUserClosedConnectionLostBanner: (userClosedConnectionLostBanner: boolean) => void
): ConnectionLostBannerProps => {
  const [currentConnectionLost, setCurrentConnectionLost] = useState<boolean>(false);

  useEffect(() => {
    console.log('useConnectionLostNotifications: connectionLostFlag: ', connectionLostFlag);
    setCurrentConnectionLost(connectionLostFlag);
  }, [connectionLostFlag]);

  const connectionLost = useMemo(() => currentConnectionLost, [currentConnectionLost]);

  return {
    connectionLost: connectionLost,
    userClosedConnectionLostBanner: userClosedConnectionLostBanner,
    onDismissNotification: () => setUserClosedConnectionLostBanner(true)
  };
};

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * Connection lost notification bar during teams meeting, which provides a message to use PSTN option.
 * @beta
 */
export const ConnectionLostNotificationBar = (props: ConnectionLostBannerProps): JSX.Element => {
  const localeStrings = useLocale().component.strings.MeetingConferencePhoneInfo;

  const barStrings = {
    title: localeStrings.lostConnectionBarTitle ? localeStrings.lostConnectionBarTitle : '',
    closeButtonAriaLabel: localeStrings.lostConnectionBarClose ? localeStrings.lostConnectionBarClose : '',
    message: localeStrings.lostConnectionBarMessage ? localeStrings.lostConnectionBarMessage : '',
    primaryButtonLabel: localeStrings.lostConnectionBarJoin ? localeStrings.lostConnectionBarJoin : ''
  };

  return (
    <NotificationBar
      notificationBarStrings={barStrings}
      notificationBarIconProps={{ iconName: 'ErrorBarCallNetworkQualityLow' }}
      onClickPrimaryButton={() => props.onPrimaryButtonClick && props.onPrimaryButtonClick()}
      onDismiss={() => props.onDismissNotification && props.onDismissNotification()}
    />
  );
};
