// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoGallery as VideoGalleryComponent } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { CustomAvatarVideoGalleryExample } from './snippets/CustomAvatar.snippet';
import { CustomStyleVideoGalleryExample } from './snippets/CustomStyle.snippet';
import { DefaultVideoGalleryExample } from './snippets/Default.snippet';
import { FloatingLocalVideoExample } from './snippets/FloatingLocalVideo.snippet';
import { WithHorizontalGalleryExample } from './snippets/WithHorizontalGallery.snippet';

const CustomAvatarVideoGalleryExampleText = require('!!raw-loader!./snippets/CustomAvatar.snippet.tsx').default;
const CustomStyleVideoGalleryExampleText = require('!!raw-loader!./snippets/CustomStyle.snippet.tsx').default;
const DefaultVideoGalleryExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;
const FloatingLocalVideoExampleText = require('!!raw-loader!./snippets/FloatingLocalVideo.snippet.tsx').default;
const WithHorizontalGalleryExampleText = require('!!raw-loader!./snippets/WithHorizontalGallery.snippet.tsx').default;

const importStatement = `import { VideoGallery } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>VideoGallery</Title>
      <Description>
        VideoGallery lays out the local user and each remote participant in a call in a
        [VideoTile](./?path=/docs/ui-components-videotile--video-tile) component. The VideoGallery component is made up
        of a [Grid Layout](./?path=/docs/ui-components-videogallery--video-gallery#grid-layout), [Horizontal
        Gallery](./?path=/docs/ui-components-videogallery--video-gallery#grid-layout), and a [Local Video
        Tile](./?path=/docs/ui-components-videogallery--video-gallery#local-video-tile). The logic used to place each
        [VideoTile](./?path=/docs/ui-components-videotile--video-tile) component into which section is explained below.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Grid Layout</Heading>
      <Description>
        If there are no remote video streams on, all participants are placed in the [Grid
        Layout](./?path=/docs/ui-components-gridlayout--grid-layout) including the local user. Otherwise, only remote
        participants with their video streams on are placed in the Grid Layout upto a max of `maxRemoteVideoStreams`.
        The remaining participants are placed in the Horizontal Gallery.
      </Description>
      <Canvas mdxSource={DefaultVideoGalleryExampleText}>
        <DefaultVideoGalleryExample />
      </Canvas>
      <Description>
        Note: The `maxRemoteVideoStreams` prop limits the number of remote video streams in the
        [GridLayout](./?path=/docs/ui-components-gridlayout--grid-layout). If the number of remote participants with
        their video stream on exceeds `maxRemoteVideoStreams` then remote participants in the `dominantSpeakers` prop
        will be prioritized. Furthermore, the VideoGallery is designed to limit the re-ordering when the
        `dominantSpeakers` prop is changed.
      </Description>

      <Heading>Horizontal Gallery</Heading>
      <Description>
        The remote participants not in the Grid Layout are placed in a Horizontal Gallery in the lower section. A gif
        element is used to simulate a remote video stream to move the other remote participants to the Horizontal
        Gallery in the example below.
      </Description>
      <Canvas mdxSource={WithHorizontalGalleryExampleText}>
        <WithHorizontalGalleryExample />
      </Canvas>

      <Heading>Local Video Tile</Heading>
      <Description>
        By default, the local video tile is placed in the Grid Layout. But the local video tile can be placed in a
        floating and draggable video tile in the bottom right corner by setting the `layout` prop to
        &apos;floatingLocalVideo&apos;.
      </Description>
      <Canvas mdxSource={FloatingLocalVideoExampleText}>
        <FloatingLocalVideoExample />
      </Canvas>

      <Heading>Custom Avatar</Heading>
      <Description>
        Rendering of avatars can be customized through the VideoGallery callback `onRenderAvatar`.
      </Description>
      <Canvas mdxSource={CustomAvatarVideoGalleryExampleText}>
        <CustomAvatarVideoGalleryExample />
      </Canvas>

      <Heading>Custom Style</Heading>
      <Description>
        Style of the VideoGallery container can be customized through its `styles` prop. The `styles` prop is a
        `VideoGalleryStyles` type with subproperties for each part of the VideoGallery as shown in the example below.
      </Description>
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

  return (
    <VideoGalleryComponent
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
