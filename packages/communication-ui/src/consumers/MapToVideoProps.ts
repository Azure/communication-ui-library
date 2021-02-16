// © Microsoft Corporation. All rights reserved.

import { RemoteVideoStream, ScalingMode } from '@azure/communication-calling';
import { useRemoteVideoStreamRenderer, useLocalVideoStreamRenderer } from '../hooks';
import { useCallContext } from '../providers';

export interface VideoContainerProps {
  isVideoReady: boolean;
  videoStreamElement: HTMLElement | null;
}

export interface RemoteVideoContainerOwnProps {
  stream: RemoteVideoStream | undefined;
  scalingMode?: ScalingMode;
}
export interface LocalVideoContainerOwnProps {
  scalingMode?: ScalingMode;
}

export const MapToRemoteVideoProps = (ownProps: RemoteVideoContainerOwnProps): VideoContainerProps => {
  const { render, isAvailable } = useRemoteVideoStreamRenderer(ownProps.stream, {
    scalingMode: ownProps.scalingMode ?? 'Crop'
  });

  return {
    isVideoReady: isAvailable,
    videoStreamElement: render
  };
};

export const MapToLocalVideoProps = (ownProps: LocalVideoContainerOwnProps): VideoContainerProps => {
  const { localVideoStream } = useCallContext();

  const { isAvailable, render } = useLocalVideoStreamRenderer(localVideoStream, {
    scalingMode: ownProps.scalingMode ?? 'Crop'
  });

  return {
    isVideoReady: isAvailable,
    videoStreamElement: render
  };
};
