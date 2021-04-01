// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { FluentThemeProvider, StreamMedia, VideoTile } from '../../../communication-ui/src';
import { renderVideoStream } from '../utils';

const importStatement = `
import { VideoTile } from '@azure/communication-ui';
`;

const VideoTileExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <VideoTile
        avatarName={'Maximus Aurelius'}
        videoProvider={<StreamMedia videoStreamElement={renderVideoStream()} />}
        isVideoReady={false}
        invertVideo={false}
        styles={{ root: { minHeight: '300px', minWidth: '400px' } }}
      />
    </FluentThemeProvider>
  );
};

const exampleCode = `
const VideoTileExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <VideoTile 
        avatarName={'Maximus Aurelius'}
        videoProvider={<StreamMedia videoStreamElement={renderVideoStream()} />}
        isVideoReady={false}
        invertVideo={false}
       styles={{ root: {minHeight: '300px', minWidth: '400px'} }} />
    </FluentThemeProvider>
  );
};
`;

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
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={VideoTile} />
    </>
  );
};
