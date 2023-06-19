// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FluentThemeProvider, VideoGallery } from '@azure/communication-react';
import { registerIcons, Stack } from '@fluentui/react';
import { CameraSwitch24Regular } from '@fluentui/react-icons';
import React, { useState } from 'react';

const mockVideoElement = document.createElement('div');
mockVideoElement.innerHTML = '<span />';
mockVideoElement.style.width = decodeURIComponent('100%25');
mockVideoElement.style.height = decodeURIComponent('100%25');
mockVideoElement.style.background = 'url(https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif)';
mockVideoElement.style.backgroundRepeat = 'no-repeat';

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const LocalCameraSwitcherExample: () => JSX.Element = () => {
  registerIcons({
    icons: {
      LocalCameraSwitch: <CameraSwitch24Regular />
    }
  });

  const [cameraState, setCameraState] = useState<number>(0);

  const cameraButtonProps = {
    cameras: [
      {
        id: '1',
        name: 'camera 1'
      },
      {
        id: '2',
        name: 'camera 2'
      }
    ],
    selectedCamera: {
      id: '1',
      name: 'camera 1'
    },
    onSelectCamera: (): Promise<void> => {
      return new Promise(() => {
        console.log('switch Camera');
        if (cameraState === 0) {
          setCameraState(1);
          mockVideoElement.style.background = 'url(https://media.giphy.com/media/mokQK7oyiR8Sk/giphy.gif)';
          mockVideoElement.style.backgroundPosition = 'center';
        } else if (cameraState === 1) {
          setCameraState(0);
          mockVideoElement.style.background = 'url(https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif)';
        }
      });
    }
  };

  const MockLocalParticipant = {
    userId: 'user1',
    displayName: 'You',
    state: 'Connected',
    isMuted: true,
    videoStream: {
      available: true,
      renderElement: mockVideoElement
    }
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

  const containerStyle = { height: '50vh' };

  return (
    <FluentThemeProvider>
      <Stack style={containerStyle}>
        <VideoGallery
          layout="floatingLocalVideo"
          localParticipant={MockLocalParticipant}
          remoteParticipants={MockRemoteParticipants}
          showCameraSwitcherInLocalPreview={true}
          localVideoCameraCycleButtonProps={cameraButtonProps}
        />
      </Stack>
    </FluentThemeProvider>
  );
};
