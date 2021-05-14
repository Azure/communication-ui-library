// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo, useCallback } from 'react';
import { VideoGallery, VideoGalleryRemoteParticipant } from 'react-components';
import { usePropsFor } from './hooks/usePropsFor';
import { ScreenShare } from './ScreenShare';

const VideoGalleryStyles = {
  root: {
    height: 'auto'
  }
};

export const MediaGallery = (): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);

  const remoteParticipants = videoGalleryProps.remoteParticipants;

  const participantWithScreenShare: VideoGalleryRemoteParticipant | undefined = useMemo(() => {
    return remoteParticipants.find((remoteParticipant: VideoGalleryRemoteParticipant) => {
      return remoteParticipant.screenShareStream?.isAvailable;
    });
  }, [remoteParticipants]);

  const isScreenShareActive = useCallback((): boolean => {
    return participantWithScreenShare !== undefined && participantWithScreenShare.screenShareStream !== undefined;
  }, [participantWithScreenShare]);

  const ScreenShareMemoized = useMemo(() => {
    if (participantWithScreenShare && isScreenShareActive()) {
      return <ScreenShare {...videoGalleryProps} participantWithScreenShare={participantWithScreenShare} />;
    } else return <></>;
  }, [isScreenShareActive, participantWithScreenShare, videoGalleryProps]);

  const VideoGalleryMemoized = useMemo(() => {
    return (
      <VideoGallery
        {...videoGalleryProps}
        localVideoViewOption={{
          scalingMode: 'Crop',
          isMirrored: true
        }}
        remoteVideoViewOption={{
          scalingMode: 'Crop'
        }}
        styles={VideoGalleryStyles}
      />
    );
  }, [videoGalleryProps]);

  return isScreenShareActive() ? ScreenShareMemoized : VideoGalleryMemoized;
};
