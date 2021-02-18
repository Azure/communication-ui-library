// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { GridLayoutComponent } from '../../components/GridLayout';
import { MediaGalleryTileComponent } from '../../components';

const importStatement = `
import { GridLayoutComponent, MediaGalleryTileComponent } from '@azure/acs-ui-sdk';
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
        <MediaGalleryTileComponent
          label={'Michael'}
          isVideoReady={false}
          videoStreamElement={null}
        />
        <MediaGalleryTileComponent
          label={'Jim'}
          isVideoReady={false}
          videoStreamElement={null}
        />
        <MediaGalleryTileComponent
          label={'Pam'}
          isVideoReady={false}
          videoStreamElement={null}
        />
        <MediaGalleryTileComponent
          label={'Dweight'}
          isVideoReady={false}
          videoStreamElement={null}
        />
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
        <MediaGalleryTileComponent
          label={'Michael'}
          isVideoReady={false}
          videoStreamElement={null}
        />
        <MediaGalleryTileComponent
          label={'Jim'}
          isVideoReady={false}
          videoStreamElement={null}
        />
        <MediaGalleryTileComponent
          label={'Pam'}
          isVideoReady={false}
          videoStreamElement={null}
        />
        <MediaGalleryTileComponent
          label={'Dweight'}
          isVideoReady={false}
          videoStreamElement={null}
        />
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
        display participant's available stream or a static image.
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
