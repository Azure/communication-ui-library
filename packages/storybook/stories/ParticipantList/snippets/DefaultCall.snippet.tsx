import { CallParticipant, FluentThemeProvider, ParticipantList } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const DefaultCallParticipantListExample: () => JSX.Element = () => {
  const mockParticipants: CallParticipant[] = [
    {
      userId: 'user1',
      displayName: 'You',
      state: 'Connected',
      isMuted: true,
      isScreenSharing: false
    },
    {
      userId: 'user2',
      displayName: 'Hal Jordan',
      state: 'Connected',
      isMuted: true,
      isScreenSharing: true
    },
    {
      userId: 'user3',
      displayName: 'Barry Allen',
      state: 'Idle',
      isMuted: false,
      isScreenSharing: false
    },
    {
      userId: 'user4',
      displayName: 'Bruce Wayne',
      state: 'Connecting',
      isMuted: false,
      isScreenSharing: false
    }
  ];

  return (
    <FluentThemeProvider>
      <Stack>
        <div style={{ fontSize: '1.5em', marginBottom: '1em', fontFamily: 'Segoe UI' }}>Participants</div>
        <ParticipantList participants={mockParticipants} myUserId={'user1'} />
      </Stack>
    </FluentThemeProvider>
  );
};
