// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ParticipantsButton } from '@azure/communication-react';
import React from 'react';

const onlyUnique = (value: string, index: number, self: string[]): boolean => {
  return self.indexOf(value) === index;
};

const ParticipantsStory = (args: any): JSX.Element => {
  const mockParticipants = args.participants
    .split(',')
    .map((p: any) => p.trim())
    .filter((p: any) => p)
    .filter(onlyUnique)
    .map((p: any, i: any) => {
      return {
        userId: `user${i}`,
        displayName: p,
        state: i % 3 ? 'Connected' : 'Idle',
        isMuted: i % 3 ? false : true,
        isScreenSharing: i === 2 ? true : false
      };
    });

  const userIndex = mockParticipants.map((p: any) => p.displayName).indexOf('You');
  const myUserId = userIndex !== -1 ? mockParticipants[userIndex].userId : '';
  const onMuteAll = (): void => {
    // your implementation to mute all participants
  };
  return (
    <ParticipantsButton
      {...args}
      participants={mockParticipants}
      myUserId={myUserId}
      onMuteAll={args.isMuteAllAvailable ? onMuteAll : undefined}
    />
  );
};

export const Participants = ParticipantsStory.bind({});
