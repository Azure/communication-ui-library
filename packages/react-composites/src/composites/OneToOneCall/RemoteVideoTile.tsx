// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { StreamMedia, VideoTile } from 'react-components';
import { WithErrorHandling } from '../../utils';
import { connectFuncsToContext } from '../../consumers';
import { ErrorHandlingProps } from '../../providers';
import { disabledVideoHint, videoHint } from './styles/MediaGallery1To1.styles';
import { MapToRemoteVideoProps } from './consumers/MapToVideoProps';

export interface RemoteVideoTileProps {
  isVideoReady: boolean;
  videoStreamElement: HTMLElement | null;
  displayName?: string;
}

const RemoteVideoTileComponentBase = (props: RemoteVideoTileProps): JSX.Element => {
  const { displayName, isVideoReady, videoStreamElement } = props;

  return (
    <VideoTile
      isVideoReady={isVideoReady}
      renderElement={<StreamMedia videoStreamElement={videoStreamElement} />}
      displayName={displayName}
      styles={{ displayNameStyles: isVideoReady ? videoHint : disabledVideoHint }}
    />
  );
};

export const RemoteVideoTileComponent = (props: RemoteVideoTileProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(RemoteVideoTileComponentBase, props);

export const RemoteVideoTile = connectFuncsToContext(RemoteVideoTileComponent, MapToRemoteVideoProps);
