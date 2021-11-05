import { ParticipantListParticipant, ParticipantList } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const DefaultChatParticipantListExample: () => JSX.Element = () => {
  const mockParticipants: ParticipantListParticipant[] = [
    {
      userId: 'user 1',
      displayName: 'You',
      isRemovable: true
    },
    {
      userId: 'user 2',
      displayName: 'Hal Jordan',
      isRemovable: true
    },
    {
      userId: 'user 3',
      displayName: 'Barry Allen',
      isRemovable: true
    },
    {
      userId: 'user 4',
      displayName: 'Bruce Wayne',
      isRemovable: true
    }
  ];

  return (
    <Stack>
      <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Segoe UI' }}>Participants</div>
      <ParticipantList participants={mockParticipants} />
    </Stack>
  );
};
