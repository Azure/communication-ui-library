import React, { useState } from 'react';
import { ParticipantItem } from '@azure/communication-ui';
import { Icon, PersonaPresence, Stack } from '@fluentui/react';

export const InteractiveParticipantListExample: () => JSX.Element = () => {
  const [isMuted1, setIsMuted1] = useState<any>(false);
  const [isMuted2, setIsMuted2] = useState<any>(false);
  const [isMuted3, setIsMuted3] = useState<any>(false);

  const participant1 = {
    name: 'Peter Parker',
    presence: PersonaPresence.online,
    isMuted: isMuted1,
    setIsMuted: setIsMuted1
  };
  const participant2 = {
    name: 'Matthew Murdock',
    presence: PersonaPresence.busy,
    isMuted: isMuted2,
    setIsMuted: setIsMuted2
  };
  const participant3 = {
    name: 'Frank Castiglione',
    presence: PersonaPresence.away,
    isMuted: isMuted3,
    setIsMuted: setIsMuted3
  };

  const participants = [participant1, participant2, participant3];

  return (
    <>
      <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Participants</div>
      <Stack style={{ width: '12.5rem' }}>
        {participants.map((participant) => (
          <ParticipantItem
            name={participant.name}
            menuItems={[
              {
                key: 'mute',
                text: participant.isMuted ? 'Unmute' : 'Mute',
                onClick: () => participant.setIsMuted(!participant.isMuted)
              }
            ]}
            onRenderIcon={() => {
              if (participant.isMuted) {
                return <Icon iconName="MicOff2" />;
              }
              return null;
            }}
            presence={participant.presence}
          />
        ))}
      </Stack>
    </>
  );
};
