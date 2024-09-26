// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCallNotification as IncomingCallNotificationComponent } from '@azure/communication-react';
import React from 'react';

const IncomingCallNotificationStory = (args: { callerName: string; showAcceptWithVideo: boolean }): JSX.Element => {
  return (
    <IncomingCallNotificationComponent
      onAcceptWithAudio={function (): void {
        alert('Accept with audio');
      }}
      onAcceptWithVideo={function (): void {
        alert('Accept with video');
      }}
      onReject={function (): void {
        alert('Rejected');
      }}
      callerName={args.callerName}
      acceptOptions={{
        showAcceptWithVideo: args.showAcceptWithVideo
      }}
    />
  );
};

export const IncomingCallNotification = IncomingCallNotificationStory.bind({});
