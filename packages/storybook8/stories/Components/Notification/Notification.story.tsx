// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider, Notification as NotificationComponent } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

const NotificationStory = (args: { autoDismiss: boolean; showStackedEffect: boolean }): JSX.Element => {
  const containerStyles = {
    width: '100%',
    height: '100%',
    padding: '2rem'
  };

  const strings = {
    title: 'Poor Network Quality',
    dismissButtonAriaLabel: 'Close',
    message: 'Join this call from your phone for better sound. You can continue viewing the meeting on this device.',
    primaryButtonLabel: 'Join by Phone',
    secondaryButtonLabel: 'I will wait :)'
  };

  return (
    <FluentThemeProvider>
      <Stack verticalFill tokens={{ childrenGap: '5rem' }} style={containerStyles} verticalAlign="space-between">
        <NotificationComponent
          notificationStrings={strings}
          notificationIconProps="ErrorBarCallNetworkQualityLow"
          onClickPrimaryButton={() => alert('Joining with phone')}
          onClickSecondaryButton={() => alert('I will wait')}
          {...args}
        />
      </Stack>
    </FluentThemeProvider>
  );
};

export const Notification = NotificationStory.bind({});
