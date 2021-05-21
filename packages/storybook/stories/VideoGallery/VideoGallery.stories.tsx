// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoGallery as VideoGalleryComponent } from '@azure/communication-react';
import { Description, Heading, Props, Source, Title, Subheading } from '@storybook/addon-docs/blocks';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const importStatement = `import { VideoGallery } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Video Gallery</Title>
      <Description of={VideoGalleryComponent} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Subheading>Default Usage</Subheading>
      <Description>TBD</Description>

      <Heading>Props</Heading>
      <Props of={VideoGalleryComponent} />
    </>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const VideoGallery: () => JSX.Element = () => {
  return <>TBD</>;
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/Video Gallery`,
  component: VideoGalleryComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
