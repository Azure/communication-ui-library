// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { GridLayout } from 'react-components';
import { GridLayoutExample } from './snippets/GridLayout.snippet';
const GridLayoutExampleText = require('!!raw-loader!./snippets/GridLayout.snippet').default;

const importStatement = `
import { GridLayout, VideoTile } from 'react-components';
`;
export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>GridLayout</Title>
      <Description>
        The `GridLayout` organizes components passed to it as children in a grid layout. It can display a grid of call
        participants through the use of `VideoTile` component.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Description>
        The following example shows how you can render `VideoTile` components inside a grid layout. For styling the
        children video tiles, please read the [VideoTile component
        docs](./?path=/docs/ui-components-videotile--video-tile-component).
      </Description>
      <Canvas>
        <GridLayoutExample />
      </Canvas>
      <Source code={GridLayoutExampleText} />
      <Heading>Props</Heading>
      <Props of={GridLayout} />
    </>
  );
};
