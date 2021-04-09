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

  const headingStyle = { fontSize: '1.5rem', marginBottom: '1rem' };
  const stackStyle = { width: '12.5rem' };

  return (
    <>
      <h1 style={headingStyle}>Participants</h1>
      <Stack style={stackStyle}>
        {participants.map((participant: any) => (
          <ParticipantItem name={participant.name} presence={participant.presence} />
        ))}
      </Stack>
    </>
  );
};
