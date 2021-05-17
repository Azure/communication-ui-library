// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useMemo, useCallback } from 'react';
import { VideoGallery, VideoGalleryRemoteParticipant } from 'react-components';
import { usePropsFor } from './hooks/usePropsFor';
import { ScreenShare } from './ScreenShare';

const VideoGalleryStyles = {
  root: {
    height: 'auto'
  }
};

export interface MediaGalleryProps {
  isVideoStreamOn?: boolean;
  isCameraChecked?: boolean;
  isMicrophoneChecked?: boolean;
  onStartLocalVideo: () => Promise<void>;
}

export const MediaGallery = (props: MediaGalleryProps): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const remoteParticipants = videoGalleryProps.remoteParticipants;

  useEffect(() => {
    if (props.isCameraChecked && !props.isVideoStreamOn) {
      props.onStartLocalVideo();
    }
  }, [props]);

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
