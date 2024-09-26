// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCallNotification as IncomingCallNotificationComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';

import { controlsToAdd, hiddenControl } from '../../../controlsUtils';
import { IncomingCallNotificationExample } from './snippets/IncomingCallNotification.snippet';
import { IncomingCallNotificationStylingExample } from './snippets/IncomingCallNotificationStyling.snippet';

export { IncomingCallNotification } from './IncomingCallNotification.story';
export const IncomingCallNotificationExampleDocsOnly = {
  render: IncomingCallNotificationExample
};
export const IncomingCallNotificationStylingExampleDocsOnly = {
  render: IncomingCallNotificationStylingExample
};

const meta: Meta = {
  title: 'Components/IncomingCallNotification/ Incoming Call Notification',
  component: IncomingCallNotificationComponent,
  argTypes: {
    callerName: controlsToAdd.callerName,
    acceptOptions: hiddenControl,
    onAcceptWithAudio: hiddenControl,
    onAcceptWithVideo: hiddenControl,
    onReject: hiddenControl,
    showAcceptWithVideo: hiddenControl,
    alertText: hiddenControl,
    avatarImage: hiddenControl,
    personaSize: hiddenControl,
    styles: hiddenControl,
    strings: hiddenControl,
    onDismiss: hiddenControl,
    onRenderAvatar: hiddenControl
  },
  args: {
    callerName: 'John Wick',
    acceptOptions: {
      showAcceptWithVideo: true
    }
  }
};

export default meta;
