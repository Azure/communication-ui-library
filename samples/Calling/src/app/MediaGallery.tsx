// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { VideoGallery, VideoGalleryRemoteParticipant } from 'react-components';
import { useHandlers } from './hooks/useHandlers';
import { usePropsFor } from './hooks/usePropsFor';
import { ScreenShare } from './ScreenShare';

const VideoGalleryStyles = {
  root: {
    height: 'auto'
  }
};

export const MediaGallery = (): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const videoGalleryHandlers = useHandlers(VideoGallery);

  const remoteParticipants = videoGalleryProps.remoteParticipants;

  const participantWithScreenShare: VideoGalleryRemoteParticipant | undefined = useMemo(() => {
    return remoteParticipants.find((remoteParticipant: VideoGalleryRemoteParticipant) => {
      return remoteParticipant.screenShareStream?.isAvailable;
    });
  }, [remoteParticipants]);

  return participantWithScreenShare !== undefined && participantWithScreenShare.screenShareStream !== undefined ? (
    <ScreenShare
      {...videoGalleryProps}
      {...videoGalleryHandlers}
      participantWithScreenShare={participantWithScreenShare}
    />
  ) : (
    <VideoGallery
      {...videoGalleryProps}
      {...videoGalleryHandlers}
      localVideoViewOption={{
        scalingMode: 'Crop'
      }}
      remoteVideoViewOption={{
        scalingMode: 'Crop'
      }}
      styles={VideoGalleryStyles}
    />
  );
};
