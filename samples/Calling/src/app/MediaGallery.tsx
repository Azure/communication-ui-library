// © Microsoft Corporation. All rights reserved.

import React, { useMemo } from 'react';
import { VideoGallery, VideoGalleryRemoteParticipant } from '@azure/communication-ui';
import { usePropsFor } from './hooks/usePropsFor';
import { useHandlers } from './hooks/useHandlers';
import { ScreenShare } from './ScreenShare';

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
      localParticipant={videoGalleryProps.localParticipant}
      remoteParticipants={videoGalleryProps.remoteParticipants}
      onRenderView={videoGalleryHandlers.onRenderView}
    />
  ) : (
    <VideoGallery {...videoGalleryProps} {...videoGalleryHandlers} scalingMode={'Crop'} />
  );
};
