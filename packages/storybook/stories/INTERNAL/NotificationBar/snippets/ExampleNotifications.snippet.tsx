import { Stack } from '@fluentui/react';
import { ActiveNotification, Notifications } from '@internal/react-components';
import React from 'react';

export const ExampleNotifications = (): JSX.Element => {
  const activeNotifications: ActiveNotification[] = [
    {
      type: 'unableToReachChatService',
      autoDismiss: true
    },
    {
      type: 'accessDenied',
      autoDismiss: true
    },
    {
      type: 'sendMessageGeneric'
    },
    {
      type: 'sendMessageNotInChatThread'
    },
    {
      type: 'userNotInChatThread'
    }
  ];

  return (
    <Stack verticalFill tokens={{ childrenGap: '5rem' }} verticalAlign="space-between">
      <Notifications activeNotifications={activeNotifications} />
    </Stack>
  );
};
