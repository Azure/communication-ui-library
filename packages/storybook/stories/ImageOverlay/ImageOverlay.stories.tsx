// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ImageOverlay as ImageOverlayComponent } from '@azure/communication-react';
import { ArgsTable, Title, Description, Heading, Source, Canvas } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../constants';

import { ImageOverlayExample } from './snippets/ImageOverlay.snippet';
const ImageOverlayExampleText = require('!!raw-loader!./snippets/ImageOverlay.snippet.tsx').default;
const importStatement = `import { ImageOverlay } from '@azure/communication-react';`;
const metaTagExample = `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ImageOverlay</Title>
      <Description>
        Component to display image in a overlay. The overlay launches as a modal, it takes focus from the page or app
        and require users to interact with them.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>Component will render a fullscreen modal using a set image source.</Description>
      <Canvas mdxSource={ImageOverlayExampleText}>
        <ImageOverlayExample />
      </Canvas>
      <Heading>Cover iOS safe area</Heading>
      <Description>
        To have the image overlay cover the safeArea on iOS devices, we can add `viewport-fit=cover` to the viewport
        meta tag of the app.
      </Description>
      <Source code={metaTagExample} />
      <Heading>Props</Heading>
      <ArgsTable of={ImageOverlayComponent} />
    </>
  );
};

const ImageOverlayStory = (): JSX.Element => {
  return <></>;
};

export const ImageOverlay = ImageOverlayStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-ImageOverlay`,
  title: `${COMPONENT_FOLDER_PREFIX}/Image Overlay`,
  component: ImageOverlayComponent,
  parameters: {
    previewTabs: { canvas: { disable: true, hidden: true } },
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
