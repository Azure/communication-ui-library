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
mockVideoElement.innerHTML = '<span />';
mockVideoElement.style.width = decodeURIComponent('100%25');
mockVideoElement.style.height = decodeURIComponent('100%25');
mockVideoElement.style.background = 'url(https://media.giphy.com/media/SwImQhtiNA7io/giphy.gif)';
mockVideoElement.style.backgroundPosition = 'center';
mockVideoElement.style.backgroundRepeat = 'no-repeat';

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
  },
  {
    userId: 'user6',
    displayName: 'Tess'
  },
  {
    userId: 'user7',
    displayName: 'Joel'
  },
  {
    userId: 'user8',
    displayName: 'Tommy'
  },
  {
    userId: 'user9',
    displayName: 'Ellie'
  },
  {
    userId: 'user10',
    displayName: 'Dina'
  },
  {
    userId: 'user11',
    displayName: 'Maria'
  },
  {
    userId: 'user12',
    displayName: 'Abbey'
  }
];

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const WithVerticalGalleryExample: () => JSX.Element = () => {
  const containerStyle = { height: '50vh' };
  return (
    <Stack style={containerStyle}>
      <VideoGallery
        localParticipant={MockLocalParticipant}
        remoteParticipants={MockRemoteParticipants}
        overflowGalleryLayout={'VerticalRight'}
      />
    </Stack>
  );
};
