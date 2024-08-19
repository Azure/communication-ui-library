// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCallNotification as IncomingCallNotificationComponent } from '@azure/communication-react';
import React from 'react';

const IncomingCallNotificationStory = (): JSX.Element => {
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
      callerName="John Wick"
      acceptOptions={{
        showAcceptWithVideo: true
      }}
    />
  );
};

export const IncomingCallNotification = IncomingCallNotificationStory.bind({});
