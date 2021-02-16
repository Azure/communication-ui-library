// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { MediaGalleryTileComponent } from '../../components';

const importStatement = `import { MediaGalleryTileComponent } from '@azure/acs-ui-sdk';`;

const MediaGalleryTile: () => JSX.Element = () => {
  return (
    <div style={{ height: '250px', width: '400px' }}>
      <MediaGalleryTileComponent
        label={'hello'}
        // Pass isVideoReady as false and videoStreamElement as null for demo purpose
        // Normally, both properties should come from the ACS data layer MapToRemoteVideoProps (default in MediaGallery)
        // or your own connectRemoteMediaGalleryTileWithData function in MediaGallery.
        isVideoReady={false}
        videoStreamElement={null}
      />
    </div>
  );
};

const exampleCode = `
return (
  <div style={{ height: '250px', width: '400px' }}>
    <MediaGalleryTileComponent
      label={'hello'}
      // Pass isVideoReady as false and videoStreamElement as null for demo purpose
      // Normally, both properties should come from the ACS data layer MapToRemoteVideoProps (default in MediaGallery)
      // or your own connectRemoteMediaGalleryTileWithData function in MediaGallery.
      isVideoReady={false}
      videoStreamElement={null}
    />
  </div>
);
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MediaGalleryTile</Title>
      <Description>
        The MediaGalleryTile component displays a static image or the available video stream of a participant.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <MediaGalleryTile />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={MediaGalleryTileComponent} />
    </>
  );
};
