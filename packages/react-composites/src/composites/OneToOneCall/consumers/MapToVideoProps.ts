// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LocalVideoStream, RemoteVideoStream, ScalingMode } from '@azure/communication-calling';
import useLocalVideoStreamRenderer from '../hooks/useLocalVideoStreamRenderer';
import useRemoteVideoStreamRenderer from '../hooks/useRemoteVideoStreamRenderer';

export interface VideoContainerProps {
  isVideoReady: boolean;
  videoStreamElement: HTMLElement | null;
}

export interface RemoteVideoContainerOwnProps {
  stream: RemoteVideoStream | undefined;
  scalingMode?: ScalingMode;
}
export interface LocalVideoContainerOwnProps {
  stream: LocalVideoStream | undefined;
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
  const { isAvailable, render } = useLocalVideoStreamRenderer(ownProps.stream, {
    scalingMode: ownProps.scalingMode ?? 'Crop'
  });

  return {
    isVideoReady: isAvailable,
    videoStreamElement: render
  };
};
