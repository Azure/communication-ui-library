// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { _PictureInPictureInPicture as PictureInPictureInPictureComponent } from '@internal/react-components';
import { Meta } from '@storybook/react';
import { hiddenControl, orientationArg } from '../../controlsUtils';
import { PictureInPictureInPicture } from './PictureInPictureInPicture.story';
export { PictureInPictureInPicture } from './PictureInPictureInPicture.story';

export const PictureInPictureInPictureDocsOnly = {
  render: PictureInPictureInPicture
};

export default {
  title: 'Components/Internal/Picture In Picture In Picture',
  component: PictureInPictureInPictureComponent,
  argTypes: {
    // Primary tile args
    primaryTileOrientation: {
      ...orientationArg,
      name: 'Primary tile orientation'
    },
    primaryTileVideoAvailable: { control: 'boolean', defaultValue: true, name: 'Primary Tile Video Available' },
    primaryTileParticipantName: { control: 'text', defaultValue: 'Scooby Doo', name: 'Primary Tile Participant Name' },

    // Secondary tile args
    secondaryTileOrientation: {
      ...orientationArg,
      name: 'Secondary tile orientation'
    },
    secondaryTileVideoAvailable: { control: 'boolean', defaultValue: true, name: 'Secondary Tile Video Available' },
    secondaryTileParticipantName: {
      control: 'text',
      defaultValue: 'Shaggy Rogers',
      name: 'Secondary Tile Participant Name'
    },
    // Hiding auto-generated controls
    onClick: hiddenControl,
    primaryTile: hiddenControl,
    secondaryTile: hiddenControl,
    strings: hiddenControl
  },
  args: {
    primaryTileVideoAvailable: true,
    primaryTileParticipantName: 'Scooby Doo',
    secondaryTileVideoAvailable: true,
    secondaryTileParticipantName: 'Shaggy Rogers'
  }
} as Meta;
