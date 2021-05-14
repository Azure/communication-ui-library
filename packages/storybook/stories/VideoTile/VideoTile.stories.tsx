// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StreamMedia, VideoTile as VideoTileComponent } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title, Subheading } from '@storybook/addon-docs/blocks';
import { text, boolean, number } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { VideoTileExample as VideoTileStylineExample } from '../Styling/snippets/StylingVideoTile.snippet';
import { renderVideoStream } from '../utils';
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
        The default VideoTile component shows a Persona with the initials of `displayName` when no video is available.
      </Description>
      <Canvas mdxSource={VideoTileExampleText}>
        <VideoTileExample />
      </Canvas>

      <Subheading>Custom Placeholder</Subheading>
      <Description>
        A custom placeholder can be provided to override the default Persona avatar by providing a JSX element to the
        `placeholderProvider` prop.
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

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const VideoTile: () => JSX.Element = () => {
  const displayName = text('Display Name', 'John Krasinski');
  const isVideoReady = boolean('Is Video Ready', false);
  const isMirrored = boolean('Is Mirrored', false);
  const width = number('Width', 400, {
    range: true,
    min: 400,
    max: 1200,
    step: 10
  });
  const height = number('Height', 300, {
    range: true,
    min: 300,
    max: 800,
    step: 10
  });

  return (
    <VideoTileComponent
      isVideoReady={isVideoReady}
      renderElement={<StreamMedia videoStreamElement={renderVideoStream()} />}
      displayName={displayName}
      isMirrored={isMirrored}
      styles={{
        root: { height: height, width: width }
      }}
    />
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/Video Tile`,
  component: VideoTileComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
