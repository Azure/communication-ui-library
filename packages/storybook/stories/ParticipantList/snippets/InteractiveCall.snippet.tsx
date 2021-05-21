import {
  CallParticipant,
  CommunicationParticipant,
  FluentThemeProvider,
  ParticipantList,
  ParticipantItem
} from '@azure/communication-react';
import { Icon, IContextualMenuItem, PersonaPresence, Stack } from '@fluentui/react';
import React, { useState } from 'react';

const mockParticipants = [
  {
    userId: 'user1',
    displayName: 'You',
    state: 'Connected',
    isMuted: true
  },
  {
    userId: 'user2',
    displayName: 'Peter Parker',
    state: 'Connected',
    isMuted: false
  },
  {
    userId: 'user3',
    displayName: 'Matthew Murdock',
    state: 'Idle',
    isMuted: false
  },
  {
    userId: 'user4',
    displayName: 'Frank Castiglione',
    state: 'Connecting',
    isMuted: false
  }
];

export const InteractiveCallParticipantListExample: () => JSX.Element = () => {
  const [participants, setParticpants] = useState<any[]>(mockParticipants);

  const mockMyUserId = 'user1';

  const onRenderParticipant = (participant: CommunicationParticipant): JSX.Element => {
    const participantIndex = participants.map((p) => p.userId).indexOf(participant.userId);

    // Try to consider CommunicationParticipant as CallParticipant
    const callingParticipant = participants[participantIndex] as CallParticipant;

    let presence: PersonaPresence | undefined = undefined;
    if (callingParticipant) {
      if (callingParticipant.state === 'Connected') {
        presence = PersonaPresence.online;
      } else if (callingParticipant.state === 'Idle') {
        presence = PersonaPresence.away;
      } else if (callingParticipant.state === 'Connecting') {
        presence = PersonaPresence.offline;
      }
    }

    const menuItems: IContextualMenuItem[] = [
      {
        key: 'mute',
        text: callingParticipant.isMuted ? 'Unmute' : 'Mute',
        onClick: () => {
          let newParticipants = [...participants];
          newParticipants[participantIndex].isMuted = !participants[participantIndex].isMuted;
          console.log(`change of mute state to = ${newParticipants[participantIndex].isMuted}`);
          setParticpants(newParticipants);
        }
      }
    ];

    const onRenderIcon = callingParticipant?.isMuted ? () => <Icon iconName="MicOff2" /> : () => <></>;

    if (participant.displayName) {
      return (
        <ParticipantItem
          displayName={participant.displayName}
          me={participant.userId === mockMyUserId}
          menuItems={menuItems}
          presence={presence}
          onRenderIcon={onRenderIcon}
        />
      );
    }
    return null;
  };

  if (participants.length > 0) {
    console.log(`render with Participant is muted = ${participants[0].isMuted}`);
  }

  return (
    <FluentThemeProvider>
      <Stack>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Segoe UI' }}>Participants</div>
        <ParticipantList
          participants={participants}
          myUserId={mockMyUserId}
          onRenderParticipant={onRenderParticipant}
        />
      </Stack>
    </FluentThemeProvider>
  );
};
