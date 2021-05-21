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

/**
 * Props for component `VideoGallery`
 */
export interface VideoGalleryProps {
  /**
   * Allows users to pass an object containing custom CSS styles for the gallery container.
   *
   * @Example
   * ```
   * <VideoGallery styles={{ root: { border: 'solid 1px red' } }} />
   * ```
   */
  styles?: BaseCustomStylesProps;
  /** Local video particpant */
  localParticipant: VideoGalleryLocalParticipant;
  /** List of remote video particpants */
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  /** Local video view options */
  localVideoViewOption?: VideoStreamOptions;
  /** Remote videos view options */
  remoteVideoViewOption?: VideoStreamOptions;
  /** Callback to create the local video stream view */
  onCreateLocalStreamView?: (options?: VideoStreamOptions | undefined) => Promise<void>;
  /** Callback to dispose of the local video stream view */
  onDisposeLocalStreamView?: () => void;
  /** Callback to render the local video tile*/
  onRenderLocalVideoTile?: (localParticipant: VideoGalleryLocalParticipant) => JSX.Element;
  /** Callback to create a remote video stream view */
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
  /** Callback to render a remote video tile */
  onRenderRemoteVideoTile?: (remoteParticipant: VideoGalleryRemoteParticipant) => JSX.Element;
  /** Callback to render a particpant avatar */
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

/**
 * VideoGallery represents a `GridLayout` of video tiles for a specific call.
 * It displays a `VideoTile` for the local user as well as for each remote participants who joined the call.
 *
 * @param props - of type `VideoGalleryProps`
 *
 * @returns a JSX Element
 */
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

    if (localVideoStream && !localVideoStream.renderElement) {
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
          remoteVideoViewOption,
          onRenderAvatar
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
