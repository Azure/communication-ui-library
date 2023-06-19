// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FluentThemeProvider, VideoGallery } from '@azure/communication-react';
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
export const DefaultVideoGalleryExample: () => JSX.Element = () => {
  const containerStyle = { height: '50vh' };
  return (
    <FluentThemeProvider>
      <Stack style={containerStyle}>
        <VideoGallery localParticipant={MockLocalParticipant} remoteParticipants={MockRemoteParticipants} />
      </Stack>
    </FluentThemeProvider>
  );
};
