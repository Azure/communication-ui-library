// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Notification as NotificationComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { NotificationExample } from './snippets/Notification.snippet';

export { Notification } from './Notification.story';

export const NotificationExampleDocsOnly = {
  render: NotificationExample
};

const meta: Meta = {
  title: 'Components/Notification',
  component: NotificationComponent,
  argTypes: {
    notificationStrings: hiddenControl,
    notificationIconProps: hiddenControl,
    autoDismiss: controlsToAdd.isNotificationAutoDismiss,
    showStackedEffect: controlsToAdd.showNotificationStacked,
    onClick: hiddenControl,
    onDismiss: hiddenControl
  }
};

export default meta;
