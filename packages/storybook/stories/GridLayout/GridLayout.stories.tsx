// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GridLayout as GridLayoutComponent, VideoTile, StreamMedia } from '@azure/communication-react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { Meta } from '@storybook/react/types-6-0';
import React, { useMemo } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import {
  mediaGalleryWidthDefault,
  mediaGalleryWidthOptions,
  mediaGalleryHeightDefault,
  mediaGalleryHeightOptions,
  COMPONENT_FOLDER_PREFIX
} from '../constants';
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

const defaultParticipants = [
  {
    displayName: 'Michael',
    isVideoReady: false
  },
  {
    displayName: 'Jim',
    isVideoReady: false
  },
  {
    displayName: 'Pam',
    isVideoReady: false
  },
  {
    displayName: 'Dwight',
    isVideoReady: false
  }
];

const GridLayoutStory: (args) => JSX.Element = (args) => {
  const videoStreamElements = useVideoStreams(
    args.participants.filter((participant) => {
      return participant.isVideoReady;
    }).length
  );

  const participantsComponents = useMemo(() => {
    let videoStreamElementIndex = 0;
    return args.participants.map((participant, index) => {
      let videoStreamElement: HTMLElement | null = null;
      if (participant.isVideoReady) {
        videoStreamElement = videoStreamElements[videoStreamElementIndex];
        videoStreamElementIndex++;
      }
      return (
        <VideoTile
          isVideoReady={participant.isVideoReady}
          renderElement={<StreamMedia videoStreamElement={videoStreamElement} />}
          displayName={participant.displayName}
          key={index}
        />
      );
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
    width: {
      control: {
        type: 'range',
        min: mediaGalleryWidthOptions.min,
        max: mediaGalleryWidthOptions.max,
        step: mediaGalleryWidthOptions.step
      },
      defaultValue: mediaGalleryWidthDefault,
      name: 'Width (px)'
    },
    height: {
      control: {
        type: 'range',
        min: mediaGalleryHeightOptions.min,
        max: mediaGalleryHeightOptions.max,
        step: mediaGalleryHeightOptions.step
      },
      defaultValue: mediaGalleryHeightDefault,
      name: 'Height (px)'
    },
    participants: { control: 'object', defaultValue: defaultParticipants, name: 'Participants' },
    // Hiding auto-generated controls
    children: { control: false, table: { disable: true } },
    layout: { control: false, table: { disable: true } },
    styles: { control: false, table: { disable: true } }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
