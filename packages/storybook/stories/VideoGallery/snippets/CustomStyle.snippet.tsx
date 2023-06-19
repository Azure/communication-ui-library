// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FluentThemeProvider, VideoGallery, VideoGalleryStyles } from '@azure/communication-react';
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
mockVideoElement.style.background = 'url(https://media.giphy.com/media/QvMUP3619500qb6mtw/giphy.gif)';
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
    displayName: 'Hal Jordan'
  },
  {
    userId: 'user6',
    displayName: 'Maria Hill'
  },
  {
    userId: 'user7',
    displayName: 'Kurt Wagner'
  },
  {
    userId: 'user8',
    displayName: 'Anna Marie LeBeau'
  },
  {
    userId: 'user9',
    displayName: 'Bruce Wayne',
    videoStream: {
      isAvailable: true,
      renderElement: mockVideoElement
    }
  }
];

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const CustomStyleVideoGalleryExample: () => JSX.Element = () => {
  const containerStyles = { height: '50vh' };
  const customStyles: VideoGalleryStyles = {
    root: {
      border: 'solid 5px red'
    },
    gridLayout: {
      children: { border: 'solid 5px red' }
    },
    horizontalGallery: {
      children: { border: 'solid 5px red' }
    }
  };
  return (
    <FluentThemeProvider>
      <Stack style={containerStyles}>
        <VideoGallery
          styles={customStyles}
          localParticipant={MockLocalParticipant}
          remoteParticipants={MockRemoteParticipants}
        />
      </Stack>
    </FluentThemeProvider>
  );
};
