import {
  CallParticipantListParticipant,
  FluentThemeProvider,
  ParticipantList,
  ParticipantItem,
  ParticipantListParticipant
} from '@azure/communication-react';
import { Icon, IContextualMenuItem, PersonaPresence, Stack } from '@fluentui/react';
import React, { useState } from 'react';

const mockParticipants: CallParticipantListParticipant[] = [
  {
    userId: 'user1',
    displayName: 'You',
    state: 'Connected',
    isMuted: true,
    isRemovable: true
  },
  {
    userId: 'user2',
    displayName: 'Peter Parker',
    state: 'Connected',
    isMuted: false,
    isRemovable: true
  },
  {
    userId: 'user3',
    displayName: 'Matthew Murdock',
    state: 'Idle',
    isMuted: false,
    isRemovable: true
  },
  {
    userId: 'user4',
    displayName: 'Frank Castiglione',
    state: 'Connecting',
    isMuted: false,
    isRemovable: false
  }
];

export const InteractiveCallParticipantListExample: () => JSX.Element = () => {
  const [participants, setParticpants] = useState<any[]>(mockParticipants);

  const mockMyUserId = 'user1';

  const onRenderParticipant = (participant: ParticipantListParticipant): JSX.Element => {
    const participantIndex = participants.map((p) => p.userId).indexOf(participant.userId);

    const callingParticipant = participants[participantIndex] as CallParticipantListParticipant;

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
          const newParticipants = [...participants];
          newParticipants[participantIndex].isMuted = !participants[participantIndex].isMuted;
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
    return <></>;
  };

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
