// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { VideoGallery } from 'react-components';
import { usePropsFor } from './hooks/usePropsFor';
import { ScreenShare } from './ScreenShare';

const VideoGalleryStyles = {
  root: {
    height: 'auto'
  }
};

export const MediaGallery = (): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);

  return videoGalleryProps.screenShareParticipant ? (
    <ScreenShare {...videoGalleryProps} />
  ) : (
    <VideoGallery {...videoGalleryProps} scalingMode={'Crop'} styles={VideoGalleryStyles} />
  );
};
