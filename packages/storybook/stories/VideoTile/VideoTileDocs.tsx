// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { VideoTile } from '../../../communication-ui/src';
import { VideoTileExample } from './VideoTile.Example';
const VideoTileExampleText = require('!!raw-loader!./VideoTile.Example').default;
import { VideoTileExample as VideoTileStylineExample } from '../Styling/StylingVideoTile.Example';
const VideoTileStylineExampleText = require('!!raw-loader!../Styling/StylingVideoTile.Example').default;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>VideoTile</Title>
      <Description>
        The VideoTile component displays a static component or the available video stream of a participant.
      </Description>

      <Heading>Importing</Heading>
      <Source code="import { VideoTile } from '@azure/communication-ui';" />

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
