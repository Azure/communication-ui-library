// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoGallery, VideoGalleryStyles } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

const MockLocalParticipant = {
  userId: 'user1',
  displayName: 'You',
  state: 'Connected',
  isMuted: true
};

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
    displayName: 'Bruce Wayne'
  }
];

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const CustomStyleVideoGalleryExample: () => JSX.Element = () => {
  const customStyles: VideoGalleryStyles = {
    root: {
      border: 'solid 5px red'
    },
    gridLayout: {
      children: { border: 'solid 5px red' }
    }
  };
  return (
    <Stack style={{ height: '30rem' }}>
      <VideoGallery
        styles={customStyles}
        localParticipant={MockLocalParticipant}
        remoteParticipants={MockRemoteParticipants}
      />
    </Stack>
  );
};
