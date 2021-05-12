// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Label, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { disabledVideoHint, gridStyle, videoHint, videoTileStyle } from './styles/VideoGallery.styles';
import { VideoGalleryRemoteParticipant, VideoGalleryLocalParticipant, BaseCustomStylesProps } from '../types';
import { GridLayout } from './GridLayout';
import { StreamMedia } from './StreamMedia';
import { VideoTile } from './VideoTile';
import { memoizeFnAll } from './utils/memoizeFnAll';

export interface VideoGalleryProps {
  styles?: BaseCustomStylesProps;
  localParticipant: VideoGalleryLocalParticipant;
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  onBeforeRenderLocalVideoTile?: (localParticipant: VideoGalleryLocalParticipant) => Promise<void>;
  onRenderLocalVideoTile?: (localParticipant: VideoGalleryLocalParticipant) => JSX.Element;
  onBeforeRenderRemoteVideoTile?: (userId: string) => Promise<void>;
  onRenderRemoteVideoTile?: (remoteParticipant: VideoGalleryRemoteParticipant) => JSX.Element;
}

const memoizeAllRemoteParticipants = memoizeFnAll(
  (
    onBeforeRenderRemoteVideoTile: any,
    userId: string,
    isAvailable?: boolean,
    videoProvider?: HTMLElement,
    displayName?: string
  ): JSX.Element => {
    console.log('Memoized Func');
    if (isAvailable && !videoProvider) {
      console.log('calling onBeforeRenderRemoteVideoTile', userId, isAvailable);
      onBeforeRenderRemoteVideoTile && onBeforeRenderRemoteVideoTile(userId);
    }
    return (
      <Stack className={gridStyle} key={userId} grow>
        <VideoTile
          isVideoReady={isAvailable}
          videoProvider={<StreamMedia videoStreamElement={videoProvider ?? null} />}
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
  const {
    localParticipant,
    remoteParticipants,
    onRenderLocalVideoTile,
    onRenderRemoteVideoTile,
    onBeforeRenderLocalVideoTile,
    onBeforeRenderRemoteVideoTile,
    styles
  } = props;

  /**
   * Utility function for meoized rendering of LocalParticipant.
   */
  const _onRenderLocalVideoTile = useMemo((): JSX.Element => {
    const localVideoStream = localParticipant?.videoStream;
    const isLocalVideoReady = localVideoStream?.isAvailable;

    if (onRenderLocalVideoTile) return onRenderLocalVideoTile(localParticipant);

    if (localVideoStream && !isLocalVideoReady) {
      onBeforeRenderLocalVideoTile && onBeforeRenderLocalVideoTile(localParticipant);
    }
    return (
      <VideoTile
        isVideoReady={isLocalVideoReady}
        videoProvider={<StreamMedia videoStreamElement={localVideoStream?.videoProvider ?? null} />}
        avatarName={localParticipant?.displayName}
        styles={videoTileStyle}
      >
        <Label className={isLocalVideoReady ? videoHint : disabledVideoHint}>{localParticipant?.displayName}</Label>
      </VideoTile>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localParticipant, localParticipant.videoStream, onBeforeRenderLocalVideoTile]);

  /**
   * Utility function for memoized rendering of RemoteParticipants.
   */
  const _onRenderRemoteParticipants = useMemo(() => {
    console.log('REMOTE PARTS', remoteParticipants);
    if (!remoteParticipants) return null;
    return memoizeAllRemoteParticipants((memoizedRemoteParticipantFn) => {
      // If user provided a custom onRender function return that function.
      if (onRenderRemoteVideoTile) return remoteParticipants.map((participant) => onRenderRemoteVideoTile(participant));
      // Else return Remote Stream Video Tiles
      return remoteParticipants.map((participant) => {
        const remoteVideoStream = participant.videoStream;
        console.log('I am going crazy');
        return memoizedRemoteParticipantFn(
          onBeforeRenderRemoteVideoTile,
          participant.userId,
          remoteVideoStream?.isAvailable,
          remoteVideoStream?.videoProvider,
          participant.displayName
        );
      });
    });
  }, [remoteParticipants, onRenderRemoteVideoTile, onBeforeRenderRemoteVideoTile]);

  return (
    <GridLayout styles={styles}>
      <Stack horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {localParticipant && _onRenderLocalVideoTile}
      </Stack>
      {_onRenderRemoteParticipants}
    </GridLayout>
  );
};
