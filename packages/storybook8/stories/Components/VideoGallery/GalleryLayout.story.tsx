// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { VideoGallery as VideoGalleryComponent } from '@azure/communication-react';
import React from 'react';

const MockLocalParticipant = {
  userId: 'userLocal',
  displayName: 'You',
  state: 'Connected',
  isMuted: true,
  isScreenSharingOn: false
};

const GalleryLayoutRender = (args: any): JSX.Element => {
  const remoteParticipants = (
    args.remoteParticipants ??
    'Rick, Daryl, Michonne, Dwight, Pam, Michael, Jim, Kevin, Creed, Angela, Andy, Stanley, Meredith, Phyllis, Oscar, Ryan, Kelly, Andy, Toby, Darryl, Gabe, Erin'
  )
    .split(',')
    .map((p: string) => p.trim())
    .filter((p: string) => p)
    .map((p: string, i: number) => {
      return {
        userId: `user${i}`,
        displayName: p,
        videoStream: { isAvailable: true }
      };
    });

  const localParticipant = MockLocalParticipant;
  localParticipant.isScreenSharingOn = args.screenShareExperience === 'presenter';

  if (remoteParticipants.length > 0) {
    remoteParticipants[0].isScreenSharingOn = args.screenShareExperience === 'viewer';

    if (args.screenShareExperience === 'viewer') {
      const mockVideoElement = document.createElement('div');
      mockVideoElement.style.width = '100%';
      mockVideoElement.style.height = '100%';
      mockVideoElement.style.textAlign = 'center';
      const imageElement = document.createElement('img');
      imageElement.src = 'images/screenshare-example.png';
      imageElement.style.maxWidth = decodeURIComponent('100%25');
      imageElement.style.maxHeight = decodeURIComponent('100%25');
      mockVideoElement.appendChild(imageElement);
      const mockScreenShareStream = {
        isAvailable: true,
        renderElement: mockVideoElement as HTMLElement
      };
      remoteParticipants[0].screenShareStream = mockScreenShareStream;
    }
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <VideoGalleryComponent
        layout={args.videoGalleryLayout}
        overflowGalleryPosition={args.overflowGalleryPosition}
        localParticipant={MockLocalParticipant}
        remoteParticipants={remoteParticipants}
        localVideoTileSize={args.localVideoTileSize}
      />
    </div>
  );
};

export const GalleryLayout = {
  description: 'test description',
  render: GalleryLayoutRender,
  source: {
    language: 'bash'
  },
  argTypes: {
    videoGalleryLayout: {
      control: {
        type: 'select',
        options: ['single', 'grid', 'gallery']
      }
    },
    overflowGalleryPosition: {
      control: {
        type: 'select',
        options: ['top', 'bottom', 'left', 'right']
      }
    },
    screenShareExperience: {
      control: {
        type: 'select',
        options: ['none', 'presenter', 'viewer']
      }
    },
    localVideoTileSize: {
      control: {
        type: 'select',
        options: ['small', 'medium', 'large']
      }
    }
  }
};
