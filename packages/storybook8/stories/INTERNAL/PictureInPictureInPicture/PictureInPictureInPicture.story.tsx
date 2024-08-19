// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StreamMedia, VideoTile } from '@azure/communication-react';
import React from 'react';
import { useVideoStreams } from '../../utils';
import { PictureInPictureInPictureWrapper } from './PictureInPictureInPictureWrapper';

const PictureInPictureInPictureStory = (args: any): JSX.Element => {
  const videoStreams = useVideoStreams(2);
  const primaryTileVideoStreamElement = args.primaryTileVideoAvailable ? videoStreams[0] : null;
  const secondaryTileVideoStreamElement = args.secondaryTileVideoAvailable ? videoStreams[1] : null;

  return (
    <PictureInPictureInPictureWrapper
      onClick={() => alert('PictureInPictureInPicture clicked')}
      primaryTile={{
        orientation: args.primaryTileOrientation,
        getTile: () => (
          <VideoTile
            displayName={args.primaryTileParticipantName}
            renderElement={
              args.primaryTileVideoAvailable ? (
                <StreamMedia videoStreamElement={primaryTileVideoStreamElement} />
              ) : undefined
            }
            showLabel={false}
          />
        )
      }}
      secondaryTile={{
        orientation: args.secondaryTileOrientation,
        getTile: () => (
          <VideoTile
            displayName={args.secondaryTileParticipantName}
            renderElement={
              args.secondaryTileVideoAvailable ? (
                <StreamMedia videoStreamElement={secondaryTileVideoStreamElement} />
              ) : undefined
            }
            isMirrored={true}
            showLabel={false}
            personaMinSize={20}
          />
        )
      }}
      strings={{ rootAriaLabel: 'Picture in Picture in Picture surfaces' }}
    />
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PictureInPictureInPicture = PictureInPictureInPictureStory.bind({});
