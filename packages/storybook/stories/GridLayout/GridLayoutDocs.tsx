// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { GridLayoutComponent, VideoTileComponent } from '@azure/communication-ui';

const importStatement = `
import { GridLayoutComponent, VideoTileComponent } from '@azure/communication-ui';
`;

const GridLayoutExample: () => JSX.Element = () => {
  return (
    <div
      style={{
        height: '530px',
        width: '830px'
      }}
    >
      <GridLayoutComponent>
        <VideoTileComponent isVideoReady={false} videoProvider={null} avatarName={'Michael'}>
          <label>Michael</label>
        </VideoTileComponent>
        <VideoTileComponent isVideoReady={false} videoProvider={null} avatarName={'Jim'}>
          <label>Jim</label>
        </VideoTileComponent>
        <VideoTileComponent isVideoReady={false} videoProvider={null} avatarName={'Pam'}>
          <label>Pam</label>
        </VideoTileComponent>
        <VideoTileComponent isVideoReady={false} videoProvider={null} avatarName={'Dwight'}>
          <label>Dwight</label>
        </VideoTileComponent>
      </GridLayoutComponent>
    </div>
  );
};

const exampleCode = `
const GridLayoutExample: () => JSX.Element = () => {
  return (
    <div
      style={{
        height: '530px',
        width: '830px'
      }}
    >
      <GridLayoutComponent>
        <VideoTileComponent
          isVideoReady={false}
          videoProvider={null}
          avatarName={'Michael'}
        >
          <label>Michael</label>
        </VideoTileComponent>
        <VideoTileComponent
          isVideoReady={false}
          videoProvider={null}
          avatarName={'Jim'}
        >
          <label>Jim</label>
        </VideoTileComponent>
        <VideoTileComponent
          isVideoReady={false}
          videoProvider={null}
          avatarName={'Pam'}
        >
          <label>Pam</label>
        </VideoTileComponent>
        <VideoTileComponent
          isVideoReady={false}
          videoProvider={null}
          avatarName={'Dwight'}
        >
          <label>Dwight</label>
        </VideoTileComponent>
      </GridLayoutComponent>
    </div>
  );
};
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>GridLayout</Title>
      <Description>
        The GridLayout component displays all participants in a call including the user in a gallery. Each tile will
        display participant available stream or a static image.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <GridLayoutExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={GridLayoutComponent} />
    </>
  );
};
