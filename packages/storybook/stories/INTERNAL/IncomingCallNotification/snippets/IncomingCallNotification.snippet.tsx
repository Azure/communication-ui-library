import { IncomingCallNotification } from '@azure/communication-react';
import React from 'react';

export const IncomingCallNotificationExample: () => JSX.Element = () => {
  return (
    <IncomingCallNotification
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
