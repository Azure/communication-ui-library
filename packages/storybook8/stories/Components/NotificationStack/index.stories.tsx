// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { NotificationStack as NotificationStackComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { NotificationStackExample } from './snippets/NotificationStack.snippet';

export { NotificationStack } from './NotificationStack.story';

export const NotificationStackExampleDocsOnly = {
  render: NotificationStackExample
};

const meta: Meta = {
  title: 'Components/NotificationStack',
  component: NotificationStackComponent,
  argTypes: {
    activeNotifications: controlsToAdd.activeNotifications,
    maxNotificationsToShow: controlsToAdd.maxNotificationsToShow,
    strings: hiddenControl,
    ignorePremountNotifications: hiddenControl
  }
};

export default meta;
