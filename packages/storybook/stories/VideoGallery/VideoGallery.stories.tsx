// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  VideoGallery as VideoGalleryComponent,
  RemoteScreenShare,
  RemoteVideoTile,
  LocalScreenShare,
  LocalVideoTile,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant
} from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { CustomAvatarVideoGalleryExample } from './snippets/CustomAvatar.snippet';
import { CustomStyleVideoGalleryExample } from './snippets/CustomStyle.snippet';
import { DefaultVideoGalleryExample } from './snippets/Default.snippet';

const CustomAvatarVideoGalleryExampleText = require('!!raw-loader!./snippets/CustomAvatar.snippet.tsx').default;
const CustomStyleVideoGalleryExampleText = require('!!raw-loader!./snippets/CustomStyle.snippet.tsx').default;
const DefaultVideoGalleryExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;

const importStatement = `import { VideoGallery } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Video Gallery</Title>
      <Description of={VideoGalleryComponent} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Default Example</Heading>
      <Description>
        VideoGallery is by default a grid of [VideoTile](./?path=/docs/ui-components-videotile--video-tile) components
        representing each participant to the call.
      </Description>
      <Canvas mdxSource={DefaultVideoGalleryExampleText}>
        <DefaultVideoGalleryExample />
      </Canvas>

      <Heading>Custom Avatar</Heading>
      <Description>
        Rendering of avatars can be customized through the VideoGallery callback `onRenderAvatar`.
      </Description>
      <Canvas mdxSource={CustomAvatarVideoGalleryExampleText}>
        <CustomAvatarVideoGalleryExample />
      </Canvas>

      <Heading>Custom Style</Heading>
      <Description>Style of the VideoGallery container can be customized through its `styles` props.</Description>
      <Canvas mdxSource={CustomStyleVideoGalleryExampleText}>
        <CustomStyleVideoGalleryExample />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={VideoGalleryComponent} />
    </>
  );
};

const MockLocalParticipant = {
  userId: 'user1',
  displayName: 'You',
  state: 'Connected',
  isMuted: true
};

const VideoGalleryStory = (args): JSX.Element => {
  const remoteParticipants = args.remoteParticipants
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p)
    .map((p, i) => {
      return {
        userId: `user${i}`,
        displayName: p,
        videoStream: { isAvailable: true }
      };
    });

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

  return (
    <VideoGalleryComponent
      onRenderTile={onRenderTile}
      layout={args.layout}
      localParticipant={MockLocalParticipant}
      remoteParticipants={remoteParticipants}
    />
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const VideoGallery = VideoGalleryStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-videogallery`,
  title: `${COMPONENT_FOLDER_PREFIX}/Video Gallery`,
  component: VideoGalleryComponent,
  argTypes: {
    remoteParticipants: controlsToAdd.remoteParticipantNames,
    layout: controlsToAdd.videoGallerylayout,
    // Hiding auto-generated controls
    styles: hiddenControl,
    localParticipant: hiddenControl,
    localVideoViewOption: hiddenControl,
    remoteVideoViewOption: hiddenControl,
    onCreateLocalStreamView: hiddenControl,
    onDisposeLocalStreamView: hiddenControl,
    onRenderLocalVideoTile: hiddenControl,
    onCreateRemoteStreamView: hiddenControl,
    onRenderRemoteVideoTile: hiddenControl,
    onDisposeRemoteStreamView: hiddenControl,
    onRenderAvatar: hiddenControl,
    showMuteIndicator: hiddenControl,
    dominantSpeakers: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
