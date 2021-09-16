import { CommunicationParticipant, ParticipantList } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const DefaultChatParticipantListExample: () => JSX.Element = () => {
  const mockParticipants: CommunicationParticipant[] = [
    {
      userId: 'user 1',
      displayName: 'You'
    },
    {
      userId: 'user 2',
      displayName: 'Hal Jordan'
    },
    {
      userId: 'user 3',
      displayName: 'Barry Allen'
    },
    {
      userId: 'user 4',
      displayName: 'Bruce Wayne'
    }
  ];

  return (
    <Stack>
      <div style={{ fontSize: '1.5em', marginBottom: '1em', fontFamily: 'Segoe UI' }}>Participants</div>
      <ParticipantList participants={mockParticipants} />
    </Stack>
  );
};
