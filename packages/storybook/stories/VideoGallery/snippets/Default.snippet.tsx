// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  VideoGallery as VideoGalleryComponent,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  RemoteScreenShare,
  LocalScreenShare,
  LocalVideoTile,
  RemoteVideoTile
} from '@azure/communication-react';
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

const onRenderTile = (
  participant: VideoGalleryLocalParticipant | VideoGalleryRemoteParticipant,
  type: 'participant' | 'screenshare' | 'localParticipant' | 'localScreenshare'
): JSX.Element => {
  if (type === 'screenshare') {
    return <RemoteScreenShare screenShareParticipant={participant} />;
  } else if (type === 'localScreenshare') {
    return <LocalScreenShare localParticipant={participant} />;
  } else if (type === 'localParticipant') {
    return <LocalVideoTile participant={participant} />;
  }

  return <RemoteVideoTile participant={participant} showMuteIndicator={true} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const DefaultVideoGalleryExample: () => JSX.Element = () => {
  return (
    <Stack style={{ height: '30rem' }}>
      <VideoGalleryComponent
        localParticipant={MockLocalParticipant}
        remoteParticipants={MockRemoteParticipants}
        onRenderTile={onRenderTile}
      />
    </Stack>
  );
};
