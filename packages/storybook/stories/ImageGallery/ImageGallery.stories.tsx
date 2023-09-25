// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ImageGallery as ImageGalleryComponent } from '@azure/communication-react';
import { ArgsTable, Title, Description, Heading, Source, Canvas } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { DetailedBetaBanner } from '../BetaBanners/DetailedBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../constants';

import { ImageGalleryExample } from './snippets/ImageGallery.snippet';
const ImageGalleryExampleText = require('!!raw-loader!./snippets/ImageGallery.snippet.tsx').default;
const importStatement = `import { ImageGallery } from '@azure/communication-react';`;
const metaTagExample = `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ImageGallery</Title>
      <DetailedBetaBanner />
      <Description>
        Component to display image in a gallery. The gallery launches as a modal, it takes focus from the page or app
        and require users to interact with them.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>Component will render a fullscreen modal using a set image source.</Description>
      <Canvas mdxSource={ImageGalleryExampleText}>
        <ImageGalleryExample />
      </Canvas>
      <Heading>Cover iOS safe area</Heading>
      <Description>
        To have the image gallery cover the safeArea on iOS devices, we can add `viewport-fit=cover` to the viewport
        meta tag of the app.
      </Description>
      <Source code={metaTagExample} />
      <Heading>Props</Heading>
      <ArgsTable of={ImageGalleryComponent} />
    </>
  );
};

const ImageGalleryStory = (): JSX.Element => {
  return <></>;
};

export const ImageGallery = ImageGalleryStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-imagegallery`,
  title: `${COMPONENT_FOLDER_PREFIX}/Image Gallery`,
  component: ImageGalleryComponent,
  parameters: {
    previewTabs: { canvas: { disable: true, hidden: true } },
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
