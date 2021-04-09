// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { VideoTile } from '../../../communication-ui/src';
import { VideoTileExample } from './VideoTile.example';
const VideoTileExampleText = require('!!raw-loader!./VideoTile.example').default;
import { VideoTileExample as VideoTileStylineExample } from '../Styling/StylingVideoTile.example';
const VideoTileStylineExampleText = require('!!raw-loader!../Styling/StylingVideoTile.example').default;

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
