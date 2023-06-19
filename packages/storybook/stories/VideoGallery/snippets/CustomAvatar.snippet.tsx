// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  FluentThemeProvider,
  OnRenderAvatarCallback,
  VideoGallery,
  VideoGalleryParticipant,
  VideoGalleryRemoteParticipant
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

const MockLocalParticipant: VideoGalleryParticipant = {
  userId: 'user1',
  displayName: 'You',
  isMuted: true
};

const MockRemoteParticipants: VideoGalleryRemoteParticipant[] = [
  {
    userId: 'user2',
    displayName: 'Peter Parker',
    state: 'Connected',
    isMuted: false
  },
  {
    userId: 'user3',
    displayName: 'Thor',
    state: 'Connecting',
    isMuted: false
  },
  {
    userId: 'user4',
    displayName: 'Matthew Murdock',
    isMuted: false
  },
  {
    userId: 'user5',
    displayName: 'Bruce Wayne',
    state: 'Connecting',
    isMuted: false,
    isScreenSharingOn: false
  }
];

export const CustomAvatarVideoGalleryExample: () => JSX.Element = () => {
  const onRenderAvatar: OnRenderAvatarCallback = (userId, options, defaultOnRender): JSX.Element => {
    switch (options?.text) {
      case 'You':
        return (
          <Stack>
            <img
              src="https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif"
              style={{
                borderRadius: '100px',
                width: '100px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );
      case 'Thor':
        return (
          <Stack>
            <img
              src="https://media.giphy.com/media/7FgZWm6sGY0CNphZDJ/giphy.gif"
              style={{
                width: '100px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );
      default:
        return (options && defaultOnRender?.(options)) ?? <></>;
    }
  };

  const containerStyle = { height: '50vh' };

  return (
    <FluentThemeProvider>
      <Stack style={containerStyle}>
        <VideoGallery
          localParticipant={MockLocalParticipant}
          remoteParticipants={MockRemoteParticipants}
          onRenderAvatar={onRenderAvatar}
        />
      </Stack>
    </FluentThemeProvider>
  );
};
