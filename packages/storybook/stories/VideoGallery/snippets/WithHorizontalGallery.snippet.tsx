// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoGallery } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

const MockLocalParticipant = {
  userId: 'user1',
  displayName: 'You',
  state: 'Connected',
  isMuted: true
};

const mockVideoElement = document.createElement('div');
mockVideoElement.style.maxWidth = decodeURIComponent('100%25');
mockVideoElement.style.maxHeight = decodeURIComponent('100%25');
const gif = document.createElement('img');
gif.style.maxWidth = decodeURIComponent('100%25');
gif.style.maxHeight = decodeURIComponent('100%25');
gif.src = 'https://media.giphy.com/media/QvMUP3619500qb6mtw/giphy.gif';
mockVideoElement.appendChild(gif);

const MockRemoteParticipants = [
  {
    userId: 'user2',
    displayName: 'Peter Parker'
  },
  {
    userId: 'user3',
    displayName: 'Thor'
  },
  {
    userId: 'user4',
    displayName: 'Matthew Murdock'
  },
  {
    userId: 'user5',
    displayName: 'Bruce Wayne',
    videoStream: {
      isAvailable: true,
      renderElement: mockVideoElement
    }
  }
];

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const WithHorizontalGalleryExample: () => JSX.Element = () => {
  const containerStyle = { height: '50vh' };
  return (
    <Stack style={containerStyle}>
      <VideoGallery localParticipant={MockLocalParticipant} remoteParticipants={MockRemoteParticipants} />
    </Stack>
  );
};
