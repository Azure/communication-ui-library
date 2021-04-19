import React from 'react';
import { ParticipantItem } from '@azure/communication-ui';
import { PersonaPresence, Stack } from '@fluentui/react';

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
    <>
      <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Participants</div>
      <Stack style={{ width: '12.5rem' }}>
        {participants.map((participant: any) => {
          return <ParticipantItem name={participant.name} presence={participant.presence} />;
        })}
      </Stack>
    </>
  );
};
