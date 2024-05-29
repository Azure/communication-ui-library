import { NotificationBar } from '@internal/react-components';
import React from 'react';

export const ExampleNotificationBar = (): JSX.Element => {
  const strings = {
    title: 'Poor Network Quality',
    closeButtonAriaLabel: 'Close',
    message: 'Join this call from your phone for better sound. You can continue viewing the meeting on this device.',
    buttonLabel: 'Join by Phone'
  };

  return (
    <NotificationBar
      notificationBarStrings={strings}
      notificationBarIconProps={{ iconName: 'ErrorBarCallNetworkQualityLow' }}
      onClick={() => alert('joining with phone')}
    />
  );
};
