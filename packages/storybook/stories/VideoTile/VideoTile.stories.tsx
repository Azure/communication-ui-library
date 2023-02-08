// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StreamMedia, VideoTile as VideoTileComponent } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title, Subheading } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { VideoTileExample as VideoTileStylineExample } from '../Styling/snippets/StylingVideoTile.snippet';
import { useVideoStreams } from '../utils';
import { VideoTileExample } from './snippets/VideoTile.snippet';
import { VideoTileMenuItemsExample } from './snippets/VideoTileMenuItems.snippet';
import { VideoTilePlaceholderExample } from './snippets/VideoTilePlaceholder.snippet';

const VideoTileStylineExampleText = require('!!raw-loader!../Styling/snippets/StylingVideoTile.snippet').default;
const VideoTileExampleText = require('!!raw-loader!./snippets/VideoTile.snippet').default;
const VideoTileMenuItemsExampleText = require('!!raw-loader!./snippets/VideoTileMenuItems.snippet').default;
const VideoTilePlaceholderText = require('!!raw-loader!./snippets/VideoTilePlaceholder.snippet').default;

const importStatement = `import { VideoTile } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>VideoTile</Title>
      <Description>
        The VideoTile component displays a static component or the available video stream of a participant.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Subheading>Default Usage</Subheading>
      <Description>
        The default VideoTile component shows a displayName and a Persona with the initials of `displayName` when no
        video is available.
      </Description>
      <Canvas mdxSource={VideoTileExampleText}>
        <VideoTileExample />
      </Canvas>

      <Subheading>Custom Placeholder</Subheading>
      <Description>
        A custom placeholder can be provided to override the default Persona avatar by providing a JSX element to the
        `placeholder` prop.
      </Description>
      <Canvas mdxSource={VideoTilePlaceholderText}>
        <VideoTilePlaceholderExample />
      </Canvas>

      <Heading>Styling</Heading>
      <Description>
        A VideoTile component can be styled just like other components using the `styles` property.
      </Description>
      <Canvas mdxSource={VideoTileStylineExampleText}>
        <VideoTileStylineExample />
      </Canvas>

      <Heading>Contextual menu items</Heading>
      <Description>
        A VideoTile component can have a contextual menu by assigning
        [IContextualMenuProps](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps)
        to the `contextualMenu` property. The contextual menu items can be opened by hovering on the VideoTile and then
        clicking on the menu button next to the display name. The menu button is also accessible by keyboard using the
        tab button.
      </Description>
      <Canvas mdxSource={VideoTileMenuItemsExampleText}>
        <VideoTileMenuItemsExample />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={VideoTileComponent} />
    </>
  );
};

const VideoTileStory = (args): JSX.Element => {
  const videoTileStyles = {
    root: {
      height: `${args.height}px`,
      width: `${args.width}px`
    }
  };

  const videoStreams = useVideoStreams(1);
  const videoStreamElement = args.isVideoReady ? videoStreams[0] : null;
  const videoStyles = args.isSpeaking ? { root: { '& video': { borderRadius: '0rem' } } } : {};

  return (
    <VideoTileComponent
      renderElement={
        args.isVideoReady ? <StreamMedia styles={videoStyles} videoStreamElement={videoStreamElement} /> : undefined
      }
      displayName={args.displayName}
      showMuteIndicator={args.showMuteIndicator}
      showLabel={args.showLabel}
      isMirrored={args.isMirrored}
      isMuted={args.isMuted}
      isSpeaking={args.isSpeaking}
      styles={videoTileStyles}
    />
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const VideoTile = VideoTileStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-videotile`,
  title: `${COMPONENT_FOLDER_PREFIX}/Video Tile`,
  component: VideoTileComponent,
  argTypes: {
    displayName: controlsToAdd.displayName,
    showMuteIndicator: controlsToAdd.showMuteIndicator,
    showLabel: controlsToAdd.showVideoTileLabel,
    isVideoReady: controlsToAdd.isVideoReady,
    isMirrored: controlsToAdd.isVideoMirrored,
    isMuted: controlsToAdd.isMuted,
    isSpeaking: controlsToAdd.isSpeaking,
    width: controlsToAdd.videoTileWidth,
    height: controlsToAdd.videoTileHeight,
    // Hiding auto-generated controls
    participantState: hiddenControl,
    userId: hiddenControl,
    noVideoAvailableAriaLabel: hiddenControl,
    children: hiddenControl,
    styles: hiddenControl,
    renderElement: hiddenControl,
    onRenderPlaceholder: hiddenControl,
    initialsName: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
