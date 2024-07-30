// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ParticipantList as ParticipantListComponent, ParticipantListParticipant } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

const ParticipantListStory: (args) => JSX.Element = (args) => {
  const participantsControls = [...args.remoteParticipants, ...args.localParticipant];

  const mockParticipants: ParticipantListParticipant[] = participantsControls.map((p, i) => {
    return {
      userId: `userId ${i}`,
      displayName: p.name,
      state: p.status,
      isMuted: p.isMuted,
      isScreenSharing: p.isScreenSharing,
      isRemovable: true
    };
  });

  const myUserId = mockParticipants[mockParticipants.length - 1].userId;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onParticipantRemove = (_userId: string): void => {
    // Do something when remove a participant from list
  };

  return (
    <Stack>
      <ParticipantListComponent
        participants={mockParticipants}
        myUserId={myUserId}
        excludeMe={args.excludeMe}
        onRemoveParticipant={onParticipantRemove}
      />
    </Stack>
  );
};

export const ParticipantList = ParticipantListStory.bind({});
