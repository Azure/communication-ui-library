import {
  CallParticipant,
  FluentThemeProvider,
  ParticipantsButton,
  ParticipantListProps
} from '@azure/communication-react';
import React from 'react';

const mockParticipants: CallParticipant[] = [
  {
    userId: 'user1',
    displayName: 'You',
    state: 'Connected',
    isMuted: true,
    isScreenSharing: false
  },
  {
    userId: 'user2',
    displayName: 'Hal Jordan',
    state: 'Connected',
    isMuted: true,
    isScreenSharing: true
  },
  {
    userId: 'user3',
    displayName: 'Barry Allen',
    state: 'Idle',
    isMuted: false,
    isScreenSharing: false
  },
  {
    userId: 'user4',
    displayName: 'Bruce Wayne',
    state: 'Connecting',
    isMuted: false,
    isScreenSharing: false
  }
];

const mockParticipantsProps: ParticipantListProps = {
  participants: mockParticipants,
  myUserId: 'user1',
  excludeMe: true
};

const mockCallLink = 'URL to invite new participants to the current call (https://...)';

const onMuteAll = () => {
  // your implementation to mute all participants
};

export const ParticipantsButtonWithMuteAllOptionExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ParticipantsButton
        participantListProps={mockParticipantsProps}
        callInvitationURL={mockCallLink}
        onMuteAll={onMuteAll}
      />
    </FluentThemeProvider>
  );
};
