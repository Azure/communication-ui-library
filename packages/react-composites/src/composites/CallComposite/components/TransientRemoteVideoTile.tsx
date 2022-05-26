// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoGalleryRemoteParticipant, VideoTile } from '@internal/react-components';
import React from 'react';

/**
 * props for the TransientRemoteVideoTile
 * @beta
 */
export type TransientVideoTileProps = {
  participant: VideoGalleryRemoteParticipant;
};
/**
 * video tile to display the transient states of a remote participant.
 * @beta
 */
export const TransientRemoteVideoTile = (props: TransientVideoTileProps): JSX.Element => {
  const { participant } = props;
  return (
    <VideoTile displayName={participant.displayName}>
      <Text>participant.state</Text>
    </VideoTile>
  );
};
