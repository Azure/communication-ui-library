// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GridLayout as GridLayoutComponent, VideoTile, StreamMedia } from '@azure/communication-react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useMemo } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { useVideoStreams } from '../utils';
import { GridLayoutExample } from './snippets/GridLayout.snippet';

const GridLayoutExampleText = require('!!raw-loader!./snippets/GridLayout.snippet').default;

const importStatement = `
import { GridLayout, VideoTile } from '@azure/communication-react';
`;

const getDocs: () => JSX.Element = () => {
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
        docs](./?path=/docs/ui-components-videotile--video-tile).
      </Description>
      <Canvas mdxSource={GridLayoutExampleText}>
        <GridLayoutExample />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={GridLayoutComponent} />
    </>
  );
};

const GridLayoutStory = (args): JSX.Element => {
  const videoStreamElements = useVideoStreams(
    args.participants.filter((participant) => {
      return participant.isVideoReady;
    }).length
  );

  const participantsComponents = useMemo(() => {
    let videoStreamElementIndex = 0;
    return args.participants.map((participant, index) => {
      let videoRenderElement: JSX.Element | undefined = undefined;
      if (participant.isVideoReady) {
        const videoStreamElement = videoStreamElements[videoStreamElementIndex];
        videoStreamElementIndex++;
        videoRenderElement = <StreamMedia videoStreamElement={videoStreamElement} />;
      }
      return <VideoTile renderElement={videoRenderElement} displayName={participant.displayName} key={index} />;
    });
  }, [args.participants, videoStreamElements]);

  return (
    <div
      style={{
        height: `${args.height}px`,
        width: `${args.width}px`
      }}
    >
      <GridLayoutComponent>{participantsComponents}</GridLayoutComponent>
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const GridLayout = GridLayoutStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-gridlayout`,
  title: `${COMPONENT_FOLDER_PREFIX}/Grid Layout`,
  component: GridLayoutComponent,
  argTypes: {
    width: controlsToAdd.layoutWidth,
    height: controlsToAdd.layoutHeight,
    participants: controlsToAdd.gridParticipants,
    // Hiding auto-generated controls
    children: hiddenControl,
    layout: hiddenControl,
    styles: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
