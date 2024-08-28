// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { VideoTile as VideoTileComponent } from '@azure/communication-react';
export { VideoTile } from './VideoTile.story';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { VideoTileExample as VideoTileStylineExample } from './snippets/StylingVideoTile.snippet';
import { VideoTileExample } from './snippets/VideoTile.snippet';
import { VideoTileMenuItemsExample } from './snippets/VideoTileMenuItems.snippet';
import { VideoTilePlaceholderExample } from './snippets/VideoTilePlaceholder.snippet';

export const VideoTileExamplesDocsOnly = {
  render: VideoTileExample
};

export const VideoTileMenuItemsExampleDocsOnly = {
  render: VideoTileMenuItemsExample
};
export const VideoTilePlaceholderExampleDocsOnly = {
  render: VideoTilePlaceholderExample
};
export const VideoTileStylineExampleDocsOnly = {
  render: VideoTileStylineExample
};
const meta: Meta = {
  title: 'Components/Video Tile',
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
    initialsName: hiddenControl,
    overlay: hiddenControl,
    isPinned: hiddenControl,
    onLongTouch: hiddenControl,
    alwaysShowLabelBackground: hiddenControl,
    personaMinSize: hiddenControl,
    personaMaxSize: hiddenControl,
    reactionResources: hiddenControl,
    isSpotlighted: hiddenControl,
    contextualMenu: hiddenControl,
    strings: hiddenControl,
    raisedHand: hiddenControl
  },
  args: {
    displayName: 'John Smith',
    showMuteIndicator: true,
    showLabel: true,
    isVideoReady: false,
    isMirrored: false,
    isMuted: false,
    isSpeaking: false,
    width: 400,
    height: 300
  }
};
export default meta;
