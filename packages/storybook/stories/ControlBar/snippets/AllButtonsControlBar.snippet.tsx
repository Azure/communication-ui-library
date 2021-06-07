import {
  CallParticipant,
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  OptionsButton,
  ParticipantListProps,
  ParticipantsButton,
  ScreenShareButton
} from '@azure/communication-react';
import { IContextualMenuProps } from '@fluentui/react';
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
  myUserId: 'user1'
};

export const AllButtonsControlBarExample: () => JSX.Element = () => {
  const exampleOptionsMenuProps: IContextualMenuProps = {
    items: [
      {
        key: '1',
        name: 'Choose Camera',
        iconProps: { iconName: 'LocationCircle' },
        onClick: () => alert('Choose Camera Menu Item Clicked!')
      }
    ]
  };
  const onMuteAll = () => {
    // your implementation to mute all participants
  };

  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'}>
        <CameraButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <MicrophoneButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <ScreenShareButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <ParticipantsButton
          participantListProps={mockParticipantsProps}
          callInvitationURL={'URL to copy'}
          onMuteAll={onMuteAll}
        />
        <OptionsButton menuProps={exampleOptionsMenuProps} />
        <EndCallButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
      </ControlBar>
    </FluentThemeProvider>
  );
};
