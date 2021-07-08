// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo, useState, useEffect } from 'react';
import { VideoGallery, PlaceholderProps, VideoStreamOptions } from '@internal/react-components';
import { useSelector } from './hooks/useSelector';
import { usePropsFor } from './hooks/usePropsFor';
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
  isVideoStreamOn?: boolean;
  isMicrophoneChecked?: boolean;
  onStartLocalVideo: () => Promise<void>;
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
}

export const MediaGallery = (props: MediaGalleryProps): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const [isButtonStatusSynced, setIsButtonStatusSynced] = useState(false);

  const isPreviewCameraOn = useSelector(getIsPreviewCameraOn);
  const isScreenShareActive = useMemo(() => {
    return videoGalleryProps.screenShareParticipant !== undefined;
  }, [videoGalleryProps]);

  useEffect(() => {
    if (isPreviewCameraOn && !props.isVideoStreamOn && !isButtonStatusSynced) {
      props.onStartLocalVideo();
    }
    setIsButtonStatusSynced(true);
  }, [isButtonStatusSynced, isPreviewCameraOn, props]);

  const VideoGalleryMemoized = useMemo(() => {
    return (
      <VideoGallery
        {...videoGalleryProps}
        localVideoViewOption={localVideoViewOption}
        remoteVideoViewOption={remoteVideoViewOption}
        styles={VideoGalleryStyles}
        layout="floatingLocalVideo"
        onRenderAvatar={props.onRenderAvatar}
      />
    );
  }, [props.onRenderAvatar, videoGalleryProps]);

  return isScreenShareActive ? <ScreenShare {...videoGalleryProps} /> : VideoGalleryMemoized;
};
