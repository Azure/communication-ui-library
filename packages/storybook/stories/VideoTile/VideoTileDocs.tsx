// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { VideoTile } from '../../../communication-ui/src';
import { VideoTileExample } from './snippets/VideoTile.snippet';
const VideoTileExampleText = require('!!raw-loader!./snippets/VideoTile.snippet').default;
import { VideoTileExample as VideoTileStylineExample } from '../Styling/snippets/StylingVideoTile.snippet';
const VideoTileStylineExampleText = require('!!raw-loader!../Styling/snippets/StylingVideoTile.snippet').default;

const importStatement = `import { VideoTile } from '@azure/communication-ui';`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>VideoTile</Title>
      <Description>
        The VideoTile component displays a static component or the available video stream of a participant.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Canvas>
        <VideoTileExample />
      </Canvas>
      <Source code={VideoTileExampleText} />

      <Heading>Styling</Heading>
      <Description>
        A VideoTile component can be styled just like other components using the `styles` property.
      </Description>
      <Canvas>
        <VideoTileStylineExample />
      </Canvas>
      <Source code={VideoTileStylineExampleText} />

      <Heading>Props</Heading>
      <Props of={VideoTile} />
    </>
  );
};
