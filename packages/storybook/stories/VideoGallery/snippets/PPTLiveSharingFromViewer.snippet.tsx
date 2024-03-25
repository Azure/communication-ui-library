// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { VideoGallery } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

const MockLocalParticipant = {
  userId: 'user1',
  displayName: 'You',
  state: 'Connected',
  isMuted: true
};

// Creating a mock PowerPoint live stream element for demonstration purposes.
const mockPptLiveElement = document.createElement('div');
mockPptLiveElement.style.width = decodeURIComponent('100%25');
mockPptLiveElement.style.height = decodeURIComponent('100%25');
mockPptLiveElement.style.textAlign = 'center';
const imageElement = document.createElement('img');
imageElement.src = 'images/pptlive-example.png';
imageElement.style.maxWidth = decodeURIComponent('100%25');
imageElement.style.maxHeight = decodeURIComponent('100%25');
mockPptLiveElement.appendChild(imageElement);

// Definition of a mock object simulating a PowerPoint live stream.
// Including its availability and the element for rendering it.
const mockPptLiveStream = {
  isAvailable: true, // Indicates the live stream is currently available.
  renderElement: mockPptLiveElement as HTMLElement // The HTML element representing the ppt stream.
};

// An array of mock remote participants in a video call.
// Set mockPptLiveStream under screenShareStream.
const MockRemoteParticipants = [
  {
    userId: 'user2',
    displayName: 'Peter Parker',
    isScreenSharingOn: true, // Indicates this user is sharing.
    screenShareStream: mockPptLiveStream // Associating the mock PowerPoint live stream with this user.
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

// Functional component demonstrating the integration of PowerPoint live sharing in a video call interface.
export const PPTLiveSharingFromViewerExample: () => JSX.Element = () => {
  const containerStyle = { height: '50vh' };
  // Rendering the component structure.
  return (
    <Stack style={containerStyle}>
      <VideoGallery
        layout="floatingLocalVideo"
        localParticipant={MockLocalParticipant}
        remoteParticipants={MockRemoteParticipants}
      />
    </Stack>
  );
};
