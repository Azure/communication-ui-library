import { ParticipantItem } from '@azure/communication-react';
import { Icon, PersonaPresence, Stack } from '@fluentui/react';
import React, { useState } from 'react';

export const InteractiveParticipantListExample: () => JSX.Element = () => {
  const [isMuted1, setIsMuted1] = useState<any>(false);
  const [isMuted2, setIsMuted2] = useState<any>(false);
  const [isMuted3, setIsMuted3] = useState<any>(false);

  const participant1 = {
    displayName: 'Peter Parker',
    presence: PersonaPresence.online,
    isMuted: isMuted1,
    setIsMuted: setIsMuted1
  };
  const participant2 = {
    displayName: 'Matthew Murdock',
    presence: PersonaPresence.busy,
    isMuted: isMuted2,
    setIsMuted: setIsMuted2
  };
  const participant3 = {
    displayName: 'Frank Castiglione',
    presence: PersonaPresence.away,
    isMuted: isMuted3,
    setIsMuted: setIsMuted3
  };

  const participants = [participant1, participant2, participant3];

  return (
    <Stack>
      <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Segoe UI' }}>Participants</div>
      <Stack>
        {participants.map((participant) => (
          <ParticipantItem
            key={`${participant.displayName}Key`}
            displayName={participant.displayName}
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
    </Stack>
  );
};
