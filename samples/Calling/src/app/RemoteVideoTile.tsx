// © Microsoft Corporation. All rights reserved.

import { Label } from '@fluentui/react';
import React from 'react';
import {
  StreamMedia,
  VideoTile,
  WithErrorHandling,
  connectFuncsToContext,
  MapToRemoteVideoProps,
  ErrorHandlingProps
} from '@azure/react-components';
import { disabledVideoHint, videoHint } from './styles/MediaGallery.styles';

export interface RemoteVideoTileProps {
  isVideoReady: boolean;
  videoStreamElement: HTMLElement | null;
  label: string;
  avatarName?: string;
}

const RemoteVideoTileComponentBase = (props: RemoteVideoTileProps): JSX.Element => {
  const { isVideoReady, videoStreamElement, label } = props;

  return (
    <VideoTile
      isVideoReady={isVideoReady}
      videoProvider={<StreamMedia videoStreamElement={videoStreamElement} />}
      avatarName={label}
    >
      <Label className={isVideoReady ? videoHint : disabledVideoHint}>{label}</Label>
    </VideoTile>
  );
};

export const RemoteVideoTileComponent = (props: RemoteVideoTileProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(RemoteVideoTileComponentBase, props);

export const RemoteVideoTile = connectFuncsToContext(RemoteVideoTileComponent, MapToRemoteVideoProps);
