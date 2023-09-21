// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { VideoGallery } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useState } from 'react';

const MockLocalParticipant = {
  userId: 'user1',
  displayName: 'You',
  state: 'Connected',
  isMuted: true
};

const user6MockVideoElement = document.createElement('div');
user6MockVideoElement.style.width = decodeURIComponent('100%25');
user6MockVideoElement.style.height = decodeURIComponent('100%25');
user6MockVideoElement.innerHTML = `<img src="https://media.giphy.com/media/QvMUP3619500qb6mtw/giphy.gif" style="width: ${decodeURIComponent(
  '100%25'
)}; height: ${decodeURIComponent('100%25')}; object-fit: contain"/>`;

const user7MockVideoElement = document.createElement('div');
user7MockVideoElement.style.width = decodeURIComponent('100%25');
user7MockVideoElement.style.height = decodeURIComponent('100%25');
user7MockVideoElement.innerHTML = `<img src="https://media.giphy.com/media/RNveokQhEObpqyvYb5/giphy.gif" style="width: ${decodeURIComponent(
  '100%25'
)}; height: ${decodeURIComponent('100%25')}; object-fit: contain"/>`;

const MockRemoteParticipants = [
  {
    userId: 'user2',
    displayName: 'Peter Parker'
  },
  {
    userId: 'user3',
    displayName: 'Diana Prince'
  },
  {
    userId: 'user4',
    displayName: 'Thor'
  },
  {
    userId: 'user5',
    displayName: 'Matthew Murdock'
  },
  {
    userId: 'user6',
    displayName: 'Bruce Wayne',
    videoStream: {
      isAvailable: true,
      renderElement: user6MockVideoElement
    }
  },
  {
    userId: 'user7',
    displayName: 'Ororo Munroe',
    videoStream: {
      isAvailable: true,
      renderElement: user7MockVideoElement
    }
  }
];

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const ManagedPinnedParticipantsExample: () => JSX.Element = () => {
  const [pinnedParticipants, setPinnedParticipants] = useState<string[]>(['user3']);
  const containerStyle = { height: '50vh' };
  return (
    <Stack style={containerStyle}>
      <Stack>
        Pinned participants:{' '}
        {pinnedParticipants
          .map((userId) => MockRemoteParticipants.find((p) => p.userId === userId)?.displayName)
          .join(', ')}
      </Stack>
      <VideoGallery
        layout="floatingLocalVideo"
        pinnedParticipants={pinnedParticipants}
        localParticipant={MockLocalParticipant}
        remoteParticipants={MockRemoteParticipants}
        onPinParticipant={(userId: string) => setPinnedParticipants(pinnedParticipants.concat(userId))}
        onUnpinParticipant={(userId: string) => setPinnedParticipants(pinnedParticipants.filter((u) => u !== userId))}
      />
    </Stack>
  );
};
