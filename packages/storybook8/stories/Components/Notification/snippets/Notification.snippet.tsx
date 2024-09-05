import { Notification } from '@azure/communication-react';
import React from 'react';

export const NotificationExample = (): JSX.Element => {
  const strings = {
    title: 'Poor Network Quality',
    dismissButtonAriaLabel: 'Close',
    message: 'Join this call from your phone for better sound. You can continue viewing the meeting on this device.',
    primaryButtonLabel: 'Join by Phone',
    secondaryButtonLabel: 'I will wait :)'
  };

  return (
    <Notification
      notificationStrings={strings}
      notificationIconProps={{ iconName: 'ErrorBarCallNetworkQualityLow' }}
      onClickPrimaryButton={() => alert('Joining with phone')}
      onClickSecondaryButton={() => alert('I will wait')}
    />
  );
};
