// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StreamMedia } from '@azure/communication-react';
import { _PictureInPictureInPicture as PictureInPictureInPictureComponent } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl, orientationArg } from '../../controlsUtils';
import { useVideoStreams } from '../../utils';

const PictureInPictureInPictureStory = (args): JSX.Element => {
  const videoStreams = useVideoStreams(2);
  const primaryTileVideoStreamElement = args.primaryTileVideoAvailable ? videoStreams[0] : null;
  const secondaryTileVideoStreamElement = args.secondaryTileVideoAvailable ? videoStreams[1] : null;

  return (
    <PictureInPictureInPictureComponent
      onClick={() => alert('PictureInPictureInPicture clicked')}
      primaryTile={{
        orientation: args.primaryTileOrientation,
        displayName: args.primaryTileParticipantName,
        renderElement: args.primaryTileVideoAvailable ? (
          <StreamMedia videoStreamElement={primaryTileVideoStreamElement} />
        ) : undefined
      }}
      secondaryTile={{
        orientation: args.secondaryTileOrientation,
        displayName: args.secondaryTileParticipantName,
        renderElement: args.secondaryTileVideoAvailable ? (
          <StreamMedia videoStreamElement={secondaryTileVideoStreamElement} />
        ) : undefined,
        isMirrored: true
      }}
      strings={{ rootAriaLabel: 'Picture in Picture in Picture surfaces' }}
    />
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PictureInPictureInPicture = PictureInPictureInPictureStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-pictureinpictureinpicture`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Picture In Picture In Picture`,
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
  }
} as Meta;
