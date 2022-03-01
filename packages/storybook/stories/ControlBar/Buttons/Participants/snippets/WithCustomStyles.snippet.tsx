import {
  CallParticipantListParticipant,
  FluentThemeProvider,
  ParticipantsButton,
  ParticipantsButtonStyles
} from '@azure/communication-react';
import React from 'react';

const mockParticipants: CallParticipantListParticipant[] = [
  {
    userId: 'user1',
    displayName: 'You',
    state: 'Connected',
    isMuted: true,
    isScreenSharing: false,
    isRemovable: true
  },
  {
    userId: 'user2',
    displayName: 'Hal Jordan',
    state: 'Connected',
    isMuted: true,
    isScreenSharing: true,
    isRemovable: true
  },
  {
    userId: 'user3',
    displayName: 'Barry Allen',
    state: 'Idle',
    isMuted: false,
    isScreenSharing: false,
    isRemovable: true
  },
  {
    userId: 'user4',
    displayName: 'Bruce Wayne',
    state: 'Connecting',
    isMuted: false,
    isScreenSharing: false,
    isRemovable: false
  }
];

const mockCallLink = 'URL to invite new participants to the current call (https://...)';

const onMuteAll = (): void => {
  // your implementation to mute all participants
};

/**
 * styles to make sure that the border on the participant menu isnt overridden by the custom styles example
 */
const mockStyles: ParticipantsButtonStyles = {
  root: { background: 'gold', color: 'white' },
  rootHovered: { background: 'crimson', color: 'white' },
  rootCheckedPressed: { color: 'blue' },
  rootExpanded: { background: 'darkgrey', color: 'white' },
  label: { color: 'DarkSlateGrey', fontStyle: 'italic' },
  menuStyles: {
    participantListStyles: { root: { border: 'solid 1px red' } }
  }
};

export const ParticipantsButtonWithCustomStylesExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ParticipantsButton
        showLabel={true}
        participants={mockParticipants}
        myUserId={'user1'}
        callInvitationURL={mockCallLink}
        onMuteAll={onMuteAll}
        styles={mockStyles}
      />
    </FluentThemeProvider>
  );
};
