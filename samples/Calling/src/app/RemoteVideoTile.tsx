// © Microsoft Corporation. All rights reserved.

import { Label } from '@fluentui/react';
import React from 'react';
import {
  StreamMediaComponent,
  VideoTileComponent,
  WithErrorHandling,
  connectFuncsToContext,
  MapToRemoteVideoProps,
  ErrorHandlingProps
} from '@azure/communication-ui';
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
    <VideoTileComponent
      isVideoReady={isVideoReady}
      videoProvider={<StreamMediaComponent videoStreamElement={videoStreamElement} />}
      avatarName={label}
    >
      <Label className={isVideoReady ? videoHint : disabledVideoHint}>{label}</Label>
    </VideoTileComponent>
  );
};

export const RemoteVideoTileComponent = (props: RemoteVideoTileProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(RemoteVideoTileComponentBase, props);

export const RemoteVideoTile = connectFuncsToContext(RemoteVideoTileComponent, MapToRemoteVideoProps);
