//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Label, Stack } from '@fluentui/react';
import {
  disabledVideoHint,
  localMediaGalleryTileStyle,
  mediaGallery1To1Style,
  remoteMediaGalleryTileStyle,
  videoHint
} from './styles/MediaGallery1To1.styles';
import { ScalingMode } from '@azure/communication-calling';
import { connectFuncsToContext, MapToLocalVideoProps } from '../../consumers';
import { GalleryParticipant } from '../../types/GalleryParticipant';
import { MapToMediaGallery1To1Props, MediaGallery1To1ContainerProps } from './consumers/MapToMediaGallery1To1Props';
import { RemoteVideoTile } from './RemoteVideoTile';
import { StreamMedia, VideoTile } from 'react-components';

export interface MediaGallery1To1Props extends MediaGallery1To1ContainerProps {
  /** Determines the remote participant in the media gallery. */
  remoteParticipant: GalleryParticipant | undefined;
  /** Determines the local participant label/avatar. */
  localParticipantName?: string;
  /** Show local participant label */
  showLocalParticipantName?: boolean;
  /** Optional property to set the local media gallery tile scaling mode. */
  localVideoScalingMode?: ScalingMode;
  /** Optional property for inverting(mirroring) local video */
  localVideoInverted?: boolean;
  /** Optional property to set the remote media gallery tile scaling mode. */
  remoteVideoScalingMode?: ScalingMode;
}

export const MediaGallery1To1Component = (props: MediaGallery1To1Props): JSX.Element => {
  const {
    localParticipantName,
    showLocalParticipantName,
    remoteVideoScalingMode,
    localVideoScalingMode,
    remoteParticipant,
    localVideoInverted,
    localVideoStream
  } = props;

  const remoteParticipantName = remoteParticipant?.displayName;
  const stream = remoteParticipant?.videoStream;

  const { isVideoReady: isLocalVideoReady, videoStreamElement: localVideoStreamElement } = MapToLocalVideoProps({
    stream: localVideoStream,
    scalingMode: localVideoScalingMode ?? 'Crop'
  });

  const mediaGalleryRemoteParticipant: JSX.Element = (
    <Stack className={remoteMediaGalleryTileStyle}>
      <RemoteVideoTile
        stream={stream}
        scalingMode={remoteVideoScalingMode ?? 'Crop'}
        label={remoteParticipantName}
        avatarName={remoteParticipantName}
      />
    </Stack>
  );

  const mediaGalleryLocalParticipant: JSX.Element = (
    <Stack.Item align="end">
      <Stack className={localMediaGalleryTileStyle}>
        <VideoTile
          isVideoReady={isLocalVideoReady}
          videoProvider={<StreamMedia videoStreamElement={localVideoStreamElement} />}
          avatarName={localParticipantName}
          invertVideo={localVideoInverted}
        >
          {showLocalParticipantName && (
            <Label className={isLocalVideoReady ? videoHint : disabledVideoHint}>{localParticipantName}</Label>
          )}
        </VideoTile>
      </Stack>
    </Stack.Item>
  );

  return (
    <Stack className={mediaGallery1To1Style}>
      {mediaGalleryRemoteParticipant}
      {mediaGalleryLocalParticipant}
    </Stack>
  );
};

export const MediaGallery1To1 = connectFuncsToContext(MediaGallery1To1Component, MapToMediaGallery1To1Props);
