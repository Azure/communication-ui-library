// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Label, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { disabledVideoHint, gridStyle, videoHint, videoTileStyle } from './styles/VideoGallery.styles';
import {
  VideoGalleryRemoteParticipant,
  VideoGalleryLocalParticipant,
  BaseCustomStylesProps,
  VideoStreamOptions
} from '../types';
import { GridLayout } from './GridLayout';
import { StreamMedia } from './StreamMedia';
import { VideoTile } from './VideoTile';
import { memoizeFnAll } from './utils/memoizeFnAll';

export interface VideoGalleryProps {
  styles?: BaseCustomStylesProps;
  localParticipant: VideoGalleryLocalParticipant;
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  localVideoViewOption?: VideoStreamOptions;
  remoteVideoViewOption?: VideoStreamOptions;
  onCreateLocalStreamView?: (options?: VideoStreamOptions | undefined) => Promise<void>;
  onDisposeLocalStreamView?: () => Promise<void>;
  onRenderLocalVideoTile?: (localParticipant: VideoGalleryLocalParticipant) => JSX.Element;
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
  onRenderRemoteVideoTile?: (remoteParticipant: VideoGalleryRemoteParticipant) => JSX.Element;
}

const memoizeAllRemoteParticipants = memoizeFnAll(
  (
    userId: string,
    onCreateRemoteStreamView: any,
    isAvailable?: boolean,
    videoProvider?: HTMLElement,
    displayName?: string,
    remoteVideoViewOption?: VideoStreamOptions
  ): JSX.Element => {
    if (isAvailable && !videoProvider) {
      onCreateRemoteStreamView && onCreateRemoteStreamView(userId, remoteVideoViewOption);
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
    localVideoViewOption,
    remoteVideoViewOption,
    onRenderLocalVideoTile,
    onRenderRemoteVideoTile,
    onCreateLocalStreamView,
    onCreateRemoteStreamView,
    styles
  } = props;

  /**
   * Utility function for meoized rendering of LocalParticipant.
   */
  const _onRenderLocalVideoTile = useMemo((): JSX.Element => {
    const localVideoStream = localParticipant?.videoStream;
    const isLocalVideoReady = localVideoStream?.isAvailable;

    if (onRenderLocalVideoTile) return onRenderLocalVideoTile(localParticipant);

    if (localVideoStream && isLocalVideoReady) {
      onCreateLocalStreamView && onCreateLocalStreamView(localVideoViewOption);
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
  }, [localParticipant, localParticipant.videoStream, onCreateLocalStreamView]);

  /**
   * Utility function for memoized rendering of RemoteParticipants.
   */
  const _onRenderRemoteParticipants = useMemo(() => {
    if (!remoteParticipants) return null;

    // If user provided a custom onRender function return that function.
    if (onRenderRemoteVideoTile) {
      return remoteParticipants.map((participant) => onRenderRemoteVideoTile(participant));
    }

    return memoizeAllRemoteParticipants((memoizedRemoteParticipantFn) => {
      // Else return Remote Stream Video Tiles
      return remoteParticipants.map((participant) => {
        const remoteVideoStream = participant.videoStream;
        return memoizedRemoteParticipantFn(
          participant.userId,
          onCreateRemoteStreamView,
          remoteVideoStream?.isAvailable,
          remoteVideoStream?.videoProvider,
          participant.displayName,
          remoteVideoViewOption
        );
      });
    });
  }, [remoteParticipants, onRenderRemoteVideoTile, onCreateRemoteStreamView, remoteVideoViewOption]);

  return (
    <GridLayout styles={styles}>
      <Stack horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {localParticipant && _onRenderLocalVideoTile}
      </Stack>
      {_onRenderRemoteParticipants}
    </GridLayout>
  );
};
