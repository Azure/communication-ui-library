// © Microsoft Corporation. All rights reserved.

import { useMemo } from 'react';
import {
  convertSdkRemoteParticipantToGalleryParticipant,
  useRemoteVideoStreamRenderer,
  ParticipantStream
} from '@azure/communication-ui';
import { ScalingMode } from '@azure/communication-calling';

export type ScreenShareContainerProps = {
  displayName: string;
  videoRender: HTMLElement | null;
  isVideoRenderAvailable: boolean;
  screenShareRender: HTMLElement | null;
  isScreenShareRenderAvailable: boolean;
};

export type ScreenShareContainerOwnProps = {
  screenShareStream: ParticipantStream;
  screenShareScalingMode?: ScalingMode;
  videoScalingMode?: ScalingMode;
};

export const MapToScreenShareProps = (ownProps: ScreenShareContainerOwnProps): ScreenShareContainerProps => {
  const { screenShareStream, screenShareScalingMode, videoScalingMode } = ownProps;
  const remoteParticipant = useMemo(() => {
    return convertSdkRemoteParticipantToGalleryParticipant(screenShareStream.user);
  }, [screenShareStream]);

  const { render: videoRender, isAvailable: isVideoRenderAvailable } = useRemoteVideoStreamRenderer(
    remoteParticipant.videoStream,
    {
      scalingMode: videoScalingMode ?? 'Crop'
    }
  );

  const { render: screenShareRender, isAvailable: isScreenShareRenderAvailable } = useRemoteVideoStreamRenderer(
    screenShareStream.stream,
    {
      scalingMode: screenShareScalingMode ?? 'Crop'
    }
  );

  return {
    displayName: remoteParticipant.displayName,
    videoRender,
    isVideoRenderAvailable,
    screenShareRender,
    isScreenShareRenderAvailable
  };
};
