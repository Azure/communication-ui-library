// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useMemo, useState } from 'react';
import { VideoGallery, VideoStreamOptions } from 'react-components';
import { usePropsFor } from './hooks/usePropsFor';
import { useSelector } from './hooks/useSelector';
import { ScreenShare } from './ScreenShare';
import { getIsPreviewCameraOn } from './selectors/baseSelectors';

const VideoGalleryStyles = {
  root: {
    height: 'auto'
  }
};

const localVideoViewOption = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

const remoteVideoViewOption = {
  scalingMode: 'Crop'
} as VideoStreamOptions;

export interface MediaGalleryProps {
  isVideoStreamOn: boolean;
  isMicrophoneChecked?: boolean;
  onStartLocalVideo: () => Promise<void>;
}

export const MediaGallery = (props: MediaGalleryProps): JSX.Element => {
  const { isVideoStreamOn, onStartLocalVideo } = props;
  const videoGalleryProps = usePropsFor(VideoGallery);
  const [isButtonStatusSynced, setIsButtonStatusSynced] = useState(false);

  const isPreviewCameraOn = useSelector(getIsPreviewCameraOn);
  const isScreenShareActive = useMemo(() => {
    return videoGalleryProps.screenShareParticipant !== undefined;
  }, [videoGalleryProps]);

  useEffect(() => {
    if (isPreviewCameraOn && !isVideoStreamOn && !isButtonStatusSynced) {
      onStartLocalVideo();
    }
    setIsButtonStatusSynced(true);
  }, [isButtonStatusSynced, isPreviewCameraOn, isVideoStreamOn, onStartLocalVideo]);

  const VideoGalleryMemoized = useMemo(() => {
    return (
      <VideoGallery
        {...videoGalleryProps}
        localVideoViewOption={localVideoViewOption}
        remoteVideoViewOption={remoteVideoViewOption}
        styles={VideoGalleryStyles}
      />
    );
  }, [videoGalleryProps]);

  return isScreenShareActive ? <ScreenShare {...videoGalleryProps} /> : VideoGalleryMemoized;
};
