// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(teams-meeting-conference) */
import { IMessageBarProps } from '@fluentui/react';
/* @conditional-compile-remove(teams-meeting-conference) */
import { Notification } from '@internal/react-components';
/* @conditional-compile-remove(teams-meeting-conference) */
import React, { useEffect, useMemo, useState } from 'react';
/* @conditional-compile-remove(teams-meeting-conference) */
import { useLocale } from '../../localization';

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * @private
 */
export interface BadNetworkQualityBannerProps extends IMessageBarProps {
  isPoorNetworkQuality: boolean;
  userClosedConnectionLostBanner: boolean;
  onDismissNotification?: () => void;
  onPrimaryButtonClick?: () => void;
}

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * Create a record for bad network when the notification recieved.
 *
 * @private
 */
export const useBadNetworkQualityNotifications = (
  connectionLostFlag: boolean,
  userClosedConnectionLostBanner: boolean,
  setUserClosedConnectionLostBanner: (userClosedConnectionLostBanner: boolean) => void
): BadNetworkQualityBannerProps => {
  const [currentConnectionLost, setCurrentConnectionLost] = useState<boolean>(false);

  useEffect(() => {
    setCurrentConnectionLost(connectionLostFlag);
  }, [connectionLostFlag]);

  const connectionLost = useMemo(() => currentConnectionLost, [currentConnectionLost]);

  return {
    isPoorNetworkQuality: connectionLost,
    userClosedConnectionLostBanner: userClosedConnectionLostBanner,
    onDismissNotification: () => setUserClosedConnectionLostBanner(true)
  };
};

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * Connection lost notification bar during teams meeting, which provides a message to use PSTN option.
 * @beta
 */
export const BadNetworkQualityNotificationBar = (props: BadNetworkQualityBannerProps): JSX.Element => {
  const localeStrings = useLocale().component.strings.MeetingConferencePhoneInfo;

  const barStrings = {
    title: localeStrings.badQualityBarTitle ? localeStrings.badQualityBarTitle : '',
    closeButtonAriaLabel: localeStrings.badQualityBarClose ? localeStrings.badQualityBarClose : '',
    message: localeStrings.badQualityBarMessage ? localeStrings.badQualityBarMessage : '',
    primaryButtonLabel: localeStrings.badQualityBarJoin ? localeStrings.badQualityBarJoin : ''
  };

  return (
    <Notification
      notificationStrings={barStrings}
      notificationIconProps={{ iconName: 'ErrorBarCallNetworkQualityLow' }}
      onClickPrimaryButton={() => props.onPrimaryButtonClick && props.onPrimaryButtonClick()}
      onDismiss={() => props.onDismissNotification && props.onDismissNotification()}
    />
  );
};
