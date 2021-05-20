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
import { memoizeFnAll } from 'acs-ui-common';
import { VideoTile, PlaceholderProps } from './VideoTile';

export interface VideoGalleryProps {
  styles?: BaseCustomStylesProps;
  localParticipant: VideoGalleryLocalParticipant;
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  localVideoViewOption?: VideoStreamOptions;
  remoteVideoViewOption?: VideoStreamOptions;
  onCreateLocalStreamView?: (options?: VideoStreamOptions | undefined) => Promise<void>;
  onDisposeLocalStreamView?: () => void;
  onRenderLocalVideoTile?: (localParticipant: VideoGalleryLocalParticipant) => JSX.Element;
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
  onRenderRemoteVideoTile?: (remoteParticipant: VideoGalleryRemoteParticipant) => JSX.Element;
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
}

// @todo: replace with React.memo method
const memoizeAllRemoteParticipants = memoizeFnAll(
  (
    userId: string,
    onCreateRemoteStreamView: any,
    isAvailable?: boolean,
    renderElement?: HTMLElement,
    displayName?: string,
    remoteVideoViewOption?: VideoStreamOptions,
    onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element
  ): JSX.Element => {
    if (isAvailable && !renderElement) {
      onCreateRemoteStreamView && onCreateRemoteStreamView(userId, remoteVideoViewOption);
    }
    return (
      <Stack className={gridStyle} key={userId} grow>
        <VideoTile
          userId={userId}
          isVideoReady={isAvailable}
          renderElement={<StreamMedia videoStreamElement={renderElement ?? null} />}
          displayName={displayName}
          styles={videoTileStyle}
          onRenderPlaceholder={onRenderAvatar}
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
    styles,
    onRenderAvatar
  } = props;

  /**
   * Utility function for meoized rendering of LocalParticipant.
   */
  const defaultOnRenderLocalVideoTile = useMemo((): JSX.Element => {
    const localVideoStream = localParticipant?.videoStream;
    const isLocalVideoReady = localVideoStream?.isAvailable;

    if (onRenderLocalVideoTile) return onRenderLocalVideoTile(localParticipant);

    if (localVideoStream && isLocalVideoReady) {
      onCreateLocalStreamView && onCreateLocalStreamView(localVideoViewOption);
    }
    return (
      <VideoTile
        userId={localParticipant.userId}
        isVideoReady={isLocalVideoReady}
        renderElement={<StreamMedia videoStreamElement={localVideoStream?.renderElement ?? null} />}
        displayName={localParticipant?.displayName}
        styles={videoTileStyle}
        onRenderPlaceholder={onRenderAvatar}
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
          remoteVideoStream?.renderElement,
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
