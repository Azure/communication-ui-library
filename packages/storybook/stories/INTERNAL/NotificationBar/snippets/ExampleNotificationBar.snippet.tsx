import { NotificationBar } from '@internal/react-components';
import React from 'react';

export const ExampleNotificationBar = (): JSX.Element => {
  const strings = {
    title: 'Poor Network Quality',
    closeButtonAriaLabel: 'Close',
    message: 'Join this call from your phone for better sound. You can continue viewing the meeting on this device.',
    primaryButtonLabel: 'Join by Phone',
    secondaryButtonLabel: 'I will wait :)'
  };

  return (
    <NotificationBar
      notificationBarStrings={strings}
      notificationBarIconProps={{ iconName: 'ErrorBarCallNetworkQualityLow' }}
      onClickPrimaryButton={() => alert('Joining with phone')}
      onClickSecondaryButton={() => alert('I will wait')}
    />
  );
};
