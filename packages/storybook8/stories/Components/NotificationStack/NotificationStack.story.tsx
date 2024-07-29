// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  ActiveNotification,
  FluentThemeProvider,
  NotificationStack as NotificationStackComponent,
  NotificationType
} from '@azure/communication-react';
import React from 'react';

const NotificationStackStory = (args: {
  activeNotifications: NotificationType[];
  maxNotificationsToShow: number;
}): JSX.Element => {
  const activeNotifications: ActiveNotification[] = args.activeNotifications.map((t) => ({
    type: t
  }));
  return (
    <FluentThemeProvider>
      <div style={{ margin: '1rem' }}>
        <NotificationStackComponent
          activeNotifications={activeNotifications}
          maxNotificationsToShow={args.maxNotificationsToShow}
        />
      </div>
    </FluentThemeProvider>
  );
};

export const NotificationStack = NotificationStackStory.bind({});
