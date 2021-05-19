// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import {
  BaseCustomStylesProps,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions
} from '../types';
import { GridLayout } from './GridLayout';
import { StreamMedia } from './StreamMedia';
import { gridStyle, videoTileStyle } from './styles/VideoGallery.styles';
import { memoizeFnAll } from './utils/memoizeFnAll';
import { VideoTile } from './VideoTile';

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

// @todo: replace with React.memo method
const memoizeAllRemoteParticipants = memoizeFnAll(
  (
    userId: string,
    onCreateRemoteStreamView: any,
    isAvailable?: boolean,
    renderStatus: VideoStreamRendererViewStatus,
    renderElement?: HTMLElement,
    displayName?: string,
    remoteVideoViewOption?: VideoStreamOptions
  ): JSX.Element => {
    if (isAvailable && !renderElement && renderStatus === 'NotRendered') {
      onCreateRemoteStreamView && onCreateRemoteStreamView(userId, remoteVideoViewOption);
    }
    return (
      <Stack className={gridStyle} key={userId} grow>
        <VideoTile
          isVideoReady={isAvailable && renderStatus === 'Completed'}
          renderElement={<StreamMedia videoStreamElement={renderElement ?? null} />}
          displayName={displayName}
          styles={videoTileStyle}
        />
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
  const defaultOnRenderLocalVideoTile = useMemo((): JSX.Element => {
    const localVideoStream = localParticipant?.videoStream;
    const isLocalVideoNotRendered = localVideoStream?.viewAndStatus.status === 'NotRendered';
    const isLocalVideoReady = localVideoStream?.viewAndStatus.status === 'Completed';

    if (onRenderLocalVideoTile) return onRenderLocalVideoTile(localParticipant);

    if (localVideoStream && isLocalVideoNotRendered) {
      onCreateLocalStreamView && onCreateLocalStreamView(localVideoViewOption);
    }
    return (
      <VideoTile
        isVideoReady={isLocalVideoReady}
        renderElement={<StreamMedia videoStreamElement={localVideoStream?.viewAndStatus.view?.target ?? null} />}
        displayName={localParticipant?.displayName}
        styles={videoTileStyle}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localParticipant, localParticipant.videoStream, onCreateLocalStreamView]);

  /**
   * Utility function for memoized rendering of RemoteParticipants.
   */
  const defaultOnRenderRemoteParticipants = useMemo(() => {
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
          remoteVideoStream?.viewAndStatus.status,
          remoteVideoStream?.viewAndStatus.view?.target,
          participant.displayName,
          remoteVideoViewOption
        );
      });
    });
  }, [remoteParticipants, onRenderRemoteVideoTile, onCreateRemoteStreamView, remoteVideoViewOption]);

  return (
    <GridLayout styles={styles}>
      <Stack horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {localParticipant && defaultOnRenderLocalVideoTile}
      </Stack>
      {defaultOnRenderRemoteParticipants}
    </GridLayout>
  );
};
