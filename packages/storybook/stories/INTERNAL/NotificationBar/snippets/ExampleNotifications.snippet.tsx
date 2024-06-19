import { Stack } from '@fluentui/react';
import { ActiveNotification, Notifications } from '@internal/react-components';
import React from 'react';

export const ExampleNotifications = (): JSX.Element => {
  const activeNotifications: ActiveNotification[] = [
    {
      type: 'failedToJoinCallGeneric',
      autoDismiss: true
    },
    {
      type: 'startVideoGeneric',
      autoDismiss: true
    },
    {
      type: 'stopVideoGeneric'
    },
    {
      type: 'muteGeneric'
    },
    {
      type: 'unmuteGeneric'
    }
  ];

  return (
    <Stack verticalFill tokens={{ childrenGap: '5rem' }} verticalAlign="space-between">
      <Notifications activeNotifications={activeNotifications} />
    </Stack>
  );
};
