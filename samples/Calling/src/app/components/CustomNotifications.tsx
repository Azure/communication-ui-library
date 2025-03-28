// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ActiveNotification, NotificationStack, usePropsFor } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useEffect } from 'react';

export interface CustomNotificationsProps {
  customNotifications?: ActiveNotification[];
}

export const CustomNotifications = (props: CustomNotificationsProps): JSX.Element => {
  const { customNotifications } = props;
  const notificationProps = usePropsFor(NotificationStack);
  const [activeNotiifications, setActiveNotifications] = React.useState<ActiveNotification[]>([]);
  useEffect(() => {
    if (customNotifications) {
      setActiveNotifications(notificationProps.activeErrorMessages.concat(customNotifications));
    }
  }, [customNotifications, notificationProps.activeErrorMessages]);

  return (
    <Stack style={{ position: 'absolute', paddingTop: '2rem', zIndex: 10 }}>
      <NotificationStack {...notificationProps} activeNotifications={activeNotiifications} />
    </Stack>
  );
};
