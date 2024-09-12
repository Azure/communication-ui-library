// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { VideoGallery as VideoGalleryComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import React from 'react';
import { controlsToAdd } from '../../controlsUtils';

const MockLocalParticipant = {
  userId: 'userLocal',
  displayName: 'You',
  state: 'Connected',
  isMuted: true,
  isScreenSharingOn: false
};

const VideoGalleryRender = (args: any): JSX.Element => {
  const remoteParticipants = args.remoteParticipants
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
    <div style={{ height: '80vh', width: '50vw' }}>
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

export const VideoGallery = {
  render: VideoGalleryRender,
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

const meta: Meta = {
  title: 'Components/Video Gallery',
  name: 'VideoGallery',
  component: VideoGalleryComponent,
  argTypes: {
    styles: { table: { disable: true } },
    layout: { table: { disable: true } },
    localParticipant: { table: { disable: true } },
    dominantSpeakers: { table: { disable: true } },
    localVideoViewOptions: { table: { disable: true } },
    onCreateLocalStreamView: { table: { disable: true } },
    onDisposeLocalStreamView: { table: { disable: true } },
    onRenderLocalVideoTile: { table: { disable: true } },
    onCreateRemoteStreamView: { table: { disable: true } },
    onRenderRemoteVideoTile: { table: { disable: true } },
    onDisposeRemoteStreamView: { table: { disable: true } },
    onDisposeRemoteVideoStreamView: { table: { disable: true } },
    onDisposeRemoteScreenShareStreamView: { table: { disable: true } },
    onRenderAvatar: { table: { disable: true } },
    showMuteIndicator: { table: { disable: true } },
    strings: { table: { disable: true } },
    maxRemoteVideoStreams: { table: { disable: true } },
    pinnedParticipants: { table: { disable: true } },
    onPinParticipant: { table: { disable: true } },
    remoteParticipants: controlsToAdd.remoteParticipantNames,
    videoGalleryLayout: controlsToAdd.videoGallerylayout,
    overflowGalleryPosition: controlsToAdd.overflowGalleryPosition,
    screenShareExperience: controlsToAdd.screenShareExperience,
    localVideoTileSize: controlsToAdd.localVideoTileSize
  },
  args: {
    remoteParticipants:
      'Rick, Daryl, Michonne, Dwight, Pam, Michael, Jim, Kevin, Creed, Angela, Andy, Stanley, Meredith, Phyllis, Oscar, Ryan, Kelly, Andy, Toby, Darryl, Gabe, Erin',
    videoGalleryLayout: 'floatingLocalVideo'
  }
};

export default meta;
