// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Label, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { disabledVideoHint, gridStyle, videoHint, videoTileStyle } from './styles/VideoGallery.styles';
import {
  VideoGalleryRemoteParticipant,
  VideoGalleryLocalParticipant,
  ScalingMode,
  CreateViewOptions,
  RemoteVideoStream,
  LocalVideoStream,
  BaseCustomStylesProps
} from '../types';
import { GridLayout } from './GridLayout';
import { StreamMedia } from './StreamMedia';
import { VideoTile } from './VideoTile';
import { memoizeFnAll } from './utils/memoizeFnAll';

export interface VideoGalleryProps {
  styles?: BaseCustomStylesProps;
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  localParticipant?: VideoGalleryLocalParticipant;
  scalingMode: ScalingMode;
  onRenderView(stream: RemoteVideoStream | LocalVideoStream, options?: CreateViewOptions | undefined): Promise<void>;
}

const memoizeAllRemoteParticipants = memoizeFnAll(
  (remoteParticipantkey: number, isAvailable?: boolean, target?: HTMLElement, displayName?: string): JSX.Element => {
    return (
      <Stack className={gridStyle} key={remoteParticipantkey} grow>
        <VideoTile
          isVideoReady={isAvailable}
          videoProvider={<StreamMedia videoStreamElement={target ?? null} />}
          avatarName={displayName}
          styles={videoTileStyle}
        >
          <Label className={isAvailable ? videoHint : disabledVideoHint}>{displayName}</Label>
        </VideoTile>
      </Stack>
    );
  }
);

export const VideoGallery = (props: VideoGalleryProps): JSX.Element => {
  const { localParticipant, remoteParticipants, scalingMode, onRenderView, styles } = props;
  const localVideoStream = localParticipant?.videoStream;
  const isLocalVideoNotRendered = localVideoStream?.viewAndStatus.status === 'NotRendered';
  const isLocalVideoReady = localVideoStream?.viewAndStatus.status === 'Completed';

  const localParticipantComponent = useMemo(() => {
    if (localVideoStream && isLocalVideoNotRendered) {
      onRenderView(localVideoStream, { scalingMode });
    }

    return (
      <VideoTile
        isVideoReady={isLocalVideoReady}
        videoProvider={<StreamMedia videoStreamElement={localVideoStream?.viewAndStatus.view?.target ?? null} />}
        avatarName={localParticipant?.displayName}
        styles={videoTileStyle}
      >
        <Label className={isLocalVideoReady ? videoHint : disabledVideoHint}>{localParticipant?.displayName}</Label>
      </VideoTile>
    );
  }, [
    isLocalVideoNotRendered,
    isLocalVideoReady,
    localParticipant?.displayName,
    localVideoStream,
    onRenderView,
    scalingMode
  ]);

  const gridLayoutRemoteParticipants = useMemo(() => {
    return memoizeAllRemoteParticipants((memoizedRemoteParticipantFn) => {
      return remoteParticipants
        ? remoteParticipants.map((participant, key) => {
            const remoteVideoStream = participant.videoStream;
            const isRemoteVideoStreamNotRendered = remoteVideoStream?.viewAndStatus.status === 'NotRendered';

            if (remoteVideoStream?.isAvailable && isRemoteVideoStreamNotRendered) {
              onRenderView(remoteVideoStream, { scalingMode });
            }

            const isRemoteVideoStreamReady =
              remoteVideoStream?.viewAndStatus.status === 'Completed' && remoteVideoStream?.isAvailable;
            return memoizedRemoteParticipantFn(
              key,
              isRemoteVideoStreamReady,
              remoteVideoStream?.viewAndStatus.view?.target,
              participant.displayName
            );
          })
        : [];
    });
  }, [remoteParticipants, onRenderView, scalingMode]);

  return (
    <GridLayout styles={styles}>
      <Stack horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {localParticipant && localParticipantComponent}
      </Stack>
      {gridLayoutRemoteParticipants}
    </GridLayout>
  );
};
