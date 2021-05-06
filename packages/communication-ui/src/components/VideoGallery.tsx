// © Microsoft Corporation. All rights reserved.

import { memoizeFnAll } from '@azure/acs-calling-selector';
import { Label, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { disabledVideoHint, gridStyle, videoHint, videoTileStyle } from './styles/VideoGallery.styles';
import { VideoGalleryRemoteParticipant, VideoGalleryLocalParticipant, ScalingMode, CreateViewOptions } from '../types';
import { GridLayout } from './GridLayout';
import { StreamMedia } from './StreamMedia';
import { VideoTile } from './VideoTile';
import { RemoteVideoStream, LocalVideoStream } from '@azure/acs-calling-declarative';

export interface VideoGalleryProps {
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
  const { localParticipant, remoteParticipants, scalingMode, onRenderView } = props;
  const localVideoStream = localParticipant?.videoStream;
  const isLocalVideoReady = localVideoStream?.videoStreamRendererView !== undefined;

  const localParticipantComponent = useMemo(() => {
    if (localVideoStream && !localVideoStream?.videoStreamRendererView) {
      onRenderView(localVideoStream, {
        scalingMode
      });
    }

    return (
      <VideoTile
        isVideoReady={isLocalVideoReady}
        videoProvider={<StreamMedia videoStreamElement={localVideoStream?.videoStreamRendererView?.target ?? null} />}
        avatarName={localParticipant?.displayName}
        styles={videoTileStyle}
      >
        <Label className={isLocalVideoReady ? videoHint : disabledVideoHint}>{localParticipant?.displayName}</Label>
      </VideoTile>
    );
  }, [isLocalVideoReady, localParticipant?.displayName, localVideoStream, onRenderView, scalingMode]);

  const gridLayoutRemoteParticipants = useMemo(() => {
    return memoizeAllRemoteParticipants((memoizedRemoteParticipantFn) => {
      return remoteParticipants
        ? remoteParticipants.map((participant, key) => {
            const remoteVideoStream = participant.videoStream;

            if (remoteVideoStream?.isAvailable && !remoteVideoStream?.videoStreamRendererView) {
              onRenderView(remoteVideoStream, {
                scalingMode
              });
            }

            return memoizedRemoteParticipantFn(
              key,
              remoteVideoStream?.isAvailable,
              remoteVideoStream?.videoStreamRendererView?.target,
              participant.displayName
            );
          })
        : [];
    });
  }, [remoteParticipants, onRenderView, scalingMode]);

  return (
    <GridLayout>
      <Stack horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {localParticipant && localParticipantComponent}
      </Stack>
      {gridLayoutRemoteParticipants}
    </GridLayout>
  );
};
