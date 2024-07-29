import { ActiveNotification, NotificationStack } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const NotificationStackExample = (): JSX.Element => {
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
      <NotificationStack activeNotifications={activeNotifications} />
    </Stack>
  );
};
