import { CallParticipantListParticipant, FluentThemeProvider, ParticipantList } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const DefaultCallParticipantListExample: () => JSX.Element = () => {
  const mockParticipants: CallParticipantListParticipant[] = [
    {
      userId: 'user1',
      displayName: 'You',
      state: 'Connected',
      isMuted: true,
      isScreenSharing: false,
      isRemovable: true
    },
    {
      userId: 'user2',
      displayName: 'Hal Jordan',
      state: 'Connected',
      isMuted: true,
      isScreenSharing: true,
      isRemovable: true
    },
    {
      userId: 'user3',
      displayName: 'Barry Allen',
      state: 'Idle',
      isMuted: false,
      isScreenSharing: false,
      isRemovable: true,
      raisedHand: { raisedHandOrderPosition: 1 }
    },
    {
      userId: 'user4',
      displayName: 'Bruce Wayne',
      state: 'Connecting',
      isMuted: false,
      isScreenSharing: false,
      isRemovable: false
    }
  ];

  return (
    <FluentThemeProvider>
      <Stack>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Segoe UI' }}>Participants</div>
        <ParticipantList participants={mockParticipants} myUserId={'user1'} />
      </Stack>
    </FluentThemeProvider>
  );
};
