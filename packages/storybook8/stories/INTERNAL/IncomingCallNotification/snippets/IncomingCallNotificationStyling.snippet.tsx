import { IncomingCallNotification, useTheme } from '@azure/communication-react';
import React from 'react';

export const IncomingCallNotificationStylingExample: () => JSX.Element = () => {
  const theme = useTheme();
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
      personaSize={54}
      callerName="Dog"
      avatarImage="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm8wa2JwYmZlaXg2NzhrbzF4OHlvazVsM3dtMG9iMXhtMXM4eHlzdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Fu3OjBQiCs3s0ZuLY3/giphy-downsized.gif"
      styles={{
        root: {
          root: {
            background: theme.palette.purpleLight,
            borderRadius: '10px',
            width: '19rem',
            padding: '1rem',
            boxShadow: theme.effects.elevation16
          }
        },
        acceptButton: {
          root: {
            borderRadius: '5px',
            background: 'green',
            color: 'white'
          }
        },
        rejectButton: {
          root: {
            borderRadius: '5px',
            background: 'darkred',
            color: 'white'
          }
        },
        avatarContainer: {
          root: {
            background: 'blue',
            borderRadius: '50%'
          }
        }
      }}
      acceptOptions={{
        showAcceptWithVideo: true
      }}
    />
  );
};
