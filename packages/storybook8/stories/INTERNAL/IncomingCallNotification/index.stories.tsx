// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCallNotification } from '@internal/react-components';
import { Meta } from '@storybook/react';
import { IncomingCallNotificationExample } from './snippets/IncomingCallNotification.snippet';
import { IncomingCallNotificationStylingExample } from './snippets/IncomingCallNotificationStyling.snippet';

export { IncomingCallNotificationExample } from './snippets/IncomingCallNotification.snippet';

export const IncomingCallNotificationExampleDocsOnly = {
  render: IncomingCallNotificationExample
};

export const IncomingCallNotificationStylingExampleDocsOnly = {
  render: IncomingCallNotificationStylingExample
};

export default {
  title: 'Components/Internal/Incoming Call Notification',
  component: IncomingCallNotification,
  parameters: {},
  args: {}
} as Meta;
