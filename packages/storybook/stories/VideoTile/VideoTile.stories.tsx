// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StreamMedia, VideoTile as VideoTileComponent } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title, Subheading } from '@storybook/addon-docs/blocks';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { VideoTileExample as VideoTileStylineExample } from '../Styling/snippets/StylingVideoTile.snippet';
import { useVideoStreams } from '../utils';
import { VideoTileExample } from './snippets/VideoTile.snippet';
import { VideoTilePlaceholderExample } from './snippets/VideoTilePlaceholder.snippet';

const VideoTileStylineExampleText = require('!!raw-loader!../Styling/snippets/StylingVideoTile.snippet').default;
const VideoTileExampleText = require('!!raw-loader!./snippets/VideoTile.snippet').default;
const VideoTilePlaceholderText = require('!!raw-loader!./snippets/VideoTilePlaceholder.snippet').default;

const importStatement = `import { VideoTile } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>VideoTile</Title>
      <Description>
        The VideoTile component displays a static component or the available video stream of a participant.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Subheading>Default Usage</Subheading>
      <Description>
        The default VideoTile component shows a displayName and a Persona with the initials of `displayName` when no
        video is available.
      </Description>
      <Canvas mdxSource={VideoTileExampleText}>
        <VideoTileExample />
      </Canvas>

      <Subheading>Custom Placeholder</Subheading>
      <Description>
        A custom placeholder can be provided to override the default Persona avatar by providing a JSX element to the
        `placeholder` prop.
      </Description>
      <Canvas mdxSource={VideoTilePlaceholderText}>
        <VideoTilePlaceholderExample />
      </Canvas>

      <Heading>Styling</Heading>
      <Description>
        A VideoTile component can be styled just like other components using the `styles` property.
      </Description>
      <Canvas mdxSource={VideoTileStylineExampleText}>
        <VideoTileStylineExample />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={VideoTileComponent} />
    </>
  );
};

const VideoTileStory = (args): JSX.Element => {
  const videoTileStyles = {
    root: {
      height: `${args.height}px`,
      width: `${args.width}px`
    }
  };

  const videoStreams = useVideoStreams(1);
  const videoStreamElement = args.isVideoReady ? videoStreams[0] : null;

  return (
    <VideoTileComponent
      renderElement={<StreamMedia videoStreamElement={videoStreamElement} />}
      displayName={args.displayName}
      showMuteIndicator={args.showMuteIndicator}
      isMirrored={args.isMirrored}
      isMuted={args.isMuted}
      styles={videoTileStyles}
    />
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const VideoTile = VideoTileStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-videotile`,
  title: `${COMPONENT_FOLDER_PREFIX}/Video Tile`,
  component: VideoTileComponent,
  argTypes: {
    displayName: { control: 'text', defaultValue: 'John Krasinski', name: 'Display Name' },
    showMuteIndicator: { control: 'boolean', defaultValue: true, name: 'Show Mute/UnMute Indicator' },
    isVideoReady: { control: 'boolean', defaultValue: false, name: 'Is Video Ready' },
    isMirrored: { control: 'boolean', defaultValue: false, name: 'Is Mirrored' },
    isMuted: { control: 'boolean', defaultValue: false, name: 'Is Muted' },
    width: { control: { type: 'range', min: 400, max: 1200, step: 10 }, defaultValue: 400, name: 'Width (px)' },
    height: { control: { type: 'range', min: 300, max: 800, step: 10 }, defaultValue: 300, name: 'Height (px)' },
    // Hiding auto-generated controls
    userId: { control: false, table: { disable: true } },
    noVideoAvailableAriaLabel: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
    styles: { control: false, table: { disable: true } },
    renderElement: { control: false, table: { disable: true } },
    onRenderPlaceholder: { control: false, table: { disable: true } }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
