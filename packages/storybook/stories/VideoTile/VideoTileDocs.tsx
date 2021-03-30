// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { FluentThemeProvider, StreamMediaComponent, VideoTileComponent } from '@azure/communication-ui';
import { renderVideoStream } from '../utils';

const importStatement = `
import { VideoTileComponent } from '@azure/communication-ui';
`;

const VideoTileExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <VideoTileComponent
        avatarName={'Maximus Aurelius'}
        videoProvider={<StreamMediaComponent videoStreamElement={renderVideoStream()} />}
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
      <VideoTileComponent 
        avatarName={'Maximus Aurelius'}
        videoProvider={<StreamMediaComponent videoStreamElement={renderVideoStream()} />}
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
      <Title>VideoTileComponent</Title>
      <Description>
        The VideoTileComponent component displays a static component or the available video stream of a participant.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <VideoTileExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={VideoTileComponent} />
    </>
  );
};
