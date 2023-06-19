// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FluentThemeProvider, VideoGallery } from '@azure/communication-react';
import React from 'react';

const MockLocalParticipant = {
  userId: 'user1',
  displayName: 'You',
  state: 'Connected',
  isMuted: true
};

const user5MockVideoElement = document.createElement('div');
user5MockVideoElement.innerHTML = '<span />';
user5MockVideoElement.style.width = decodeURIComponent('100%25');
user5MockVideoElement.style.height = decodeURIComponent('100%25');
user5MockVideoElement.style.background = 'url(https://media.giphy.com/media/QvMUP3619500qb6mtw/giphy.gif)';
user5MockVideoElement.style.backgroundPosition = 'center';
user5MockVideoElement.style.backgroundRepeat = 'no-repeat';

const user6MockVideoElement = document.createElement('div');
user6MockVideoElement.innerHTML = '<span />';
user6MockVideoElement.style.width = decodeURIComponent('100%25');
user6MockVideoElement.style.height = decodeURIComponent('100%25');
user6MockVideoElement.style.background = 'url(https://media.giphy.com/media/RNveokQhEObpqyvYb5/giphy.gif)';
user6MockVideoElement.style.backgroundPosition = 'center';
user6MockVideoElement.style.backgroundRepeat = 'no-repeat';

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
      renderElement: user5MockVideoElement
    }
  },
  {
    userId: 'user7',
    displayName: 'Ororo Munroe',
    videoStream: {
      isAvailable: true,
      renderElement: user6MockVideoElement
    }
  }
];

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PinnedParticipantsMobileExample: () => JSX.Element = () => {
  const containerStyle = { height: '60vh', width: '30vh' };
  return (
    <FluentThemeProvider>
      <div style={containerStyle}>
        <VideoGallery
          layout="floatingLocalVideo"
          localParticipant={MockLocalParticipant}
          remoteParticipants={MockRemoteParticipants}
          remoteVideoTileMenuOptions={{ kind: 'drawer' }}
        />
      </div>
    </FluentThemeProvider>
  );
};
