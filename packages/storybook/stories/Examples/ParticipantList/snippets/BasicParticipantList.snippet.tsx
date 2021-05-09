import { ParticipantItem } from '@azure/communication-react';
import { PersonaPresence, Stack } from '@fluentui/react';
import React from 'react';

export const BasicParticipantListExample: () => JSX.Element = () => {
  const participants = [
    {
      name: 'Hal Jordan',
      presence: PersonaPresence.online
    },
    {
      name: 'Barry Allen',
      presence: PersonaPresence.busy
    },
    {
      name: 'Bruce Wayne',
      presence: PersonaPresence.away
    }
  ];

  return (
    <Stack>
      <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Segoe UI' }}>Participants</div>
      <Stack>
        {participants.map((participant: any) => {
          return <ParticipantItem name={participant.name} presence={participant.presence} />;
        })}
      </Stack>
    </Stack>
  );
};
