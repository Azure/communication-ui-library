// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, useTheme } from '@fluentui/react';
import React from 'react';
import { StreamMedia, VideoTile } from 'react-components';
import { WithErrorHandling } from './utils/WithErrorHandling';
import { connectFuncsToContext } from './consumers/ConnectContext';
import { ErrorHandlingProps } from './providers/ErrorProvider';
import { disabledVideoHint, videoHint } from './styles/MediaGallery1To1.styles';
import { MapToRemoteVideoProps } from './consumers/MapToVideoProps';

export interface RemoteVideoTileProps {
  isVideoReady: boolean;
  videoStreamElement: HTMLElement | null;
  displayName?: string;
}

const RemoteVideoTileComponentBase = (props: RemoteVideoTileProps): JSX.Element => {
  const { displayName, isVideoReady, videoStreamElement } = props;
  const theme = useTheme();

  return (
    <VideoTile
      isVideoReady={isVideoReady}
      renderElement={<StreamMedia videoStreamElement={videoStreamElement} />}
      displayName={displayName}
      styles={{
        displayNameContainer: mergeStyles(isVideoReady ? videoHint : disabledVideoHint, {
          color: theme.palette.neutralPrimary
        })
      }}
    />
  );
};

export const RemoteVideoTileComponent = (props: RemoteVideoTileProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(RemoteVideoTileComponentBase, props);

export const RemoteVideoTile = connectFuncsToContext(RemoteVideoTileComponent, MapToRemoteVideoProps);
