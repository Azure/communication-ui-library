// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  CallParticipantListParticipant,
  CameraButton,
  ControlBar as ControlBarComponent,
  EndCallButton,
  MicrophoneButton,
  ParticipantsButton,
  ScreenShareButton
} from '@azure/communication-react';
import React from 'react';
import { DevicesButtonWithKnobs } from '../Buttons/Devices/snippets/DevicesButtonWithKnobs.snippet';

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

const ControlBarStory = (args: any, { globals: { theme } }: { globals: { theme: string } }): JSX.Element => {
  // This is code to set the color of the background div to show contrast to the control bar based on the theme like shown in the Figma design.
  let background = '#f8f8f8';
  if (theme === 'Dark') {
    if (args.layout.startsWith('floating')) {
      background = '#252423';
    } else {
      background = '#161514';
    }
  }

  const onMuteAll = (): void => {
    // your implementation to mute all participants
  };

  return (
    <div
      style={{
        width: '400px',
        height: '300px',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'inherit',
        background: background
      }}
    >
      <ControlBarComponent layout={args.layout}>
        <CameraButton showLabel={args.showLabel} checked={args.checked} />
        <MicrophoneButton showLabel={args.showLabel} checked={args.checked} />
        <ScreenShareButton showLabel={args.showLabel} checked={args.checked} />
        <ParticipantsButton
          showLabel={args.showLabel}
          participants={mockParticipants}
          myUserId={'user1'}
          callInvitationURL={'URL to copy'}
          onMuteAll={onMuteAll}
        />
        <DevicesButtonWithKnobs {...args} />
        <EndCallButton showLabel={args.showLabel} />
      </ControlBarComponent>
    </div>
  );
};

export const ControlBar = ControlBarStory.bind({});
