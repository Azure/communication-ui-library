// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useMemo } from 'react';
import { VideoTileStylesProps } from '..';
import { OnRenderAvatarCallback, VideoGalleryRemoteParticipant, VideoStreamOptions } from '../../types';
import { StreamMedia } from '../StreamMedia';
import { VideoTile } from '../VideoTile';

const remoteVideoViewOption = {
  scalingMode: 'Crop'
} as VideoStreamOptions;

/**
 * A memoized version of VideoTile for rendering remote participants. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering a VideoTile when its position in the
 * array changes causing a rerender in the parent component. https://reactjs.org/docs/react-api.html#reactmemo
 *
 * @public
 */
export const RemoteVideoTile = React.memo(
  (props: {
    participant: VideoGalleryRemoteParticipant;
    onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
    onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
    onRenderAvatar?: OnRenderAvatarCallback;
    showMuteIndicator?: boolean;
    styles?: VideoTileStylesProps;
  }) => {
    const {
      participant,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      onRenderAvatar,
      showMuteIndicator,
      styles
    } = props;
    const remoteVideoStream = participant.videoStream;

    useEffect(() => {
      if (remoteVideoStream?.isAvailable && !remoteVideoStream?.renderElement) {
        onCreateRemoteStreamView && onCreateRemoteStreamView(participant.userId, remoteVideoViewOption);
      }
      if (!remoteVideoStream?.isAvailable) {
        onDisposeRemoteStreamView && onDisposeRemoteStreamView(participant.userId);
      }
    }, [
      remoteVideoStream?.isAvailable,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      remoteVideoStream?.renderElement,
      participant.userId
    ]);

    useEffect(() => {
      return () => {
        onDisposeRemoteStreamView && onDisposeRemoteStreamView(participant.userId);
      };
    }, [onDisposeRemoteStreamView, participant.userId]);

    const renderVideoStreamElement = useMemo(() => {
      // Checking if renderElement is well defined or not as calling SDK has a number of video streams limitation which
      // implies that, after their threshold, all streams have no child (blank video)
      if (!remoteVideoStream?.renderElement || !remoteVideoStream?.renderElement.childElementCount) {
        // Returning `undefined` results in the placeholder with avatar being shown
        return undefined;
      }

      return <StreamMedia videoStreamElement={remoteVideoStream?.renderElement} />;
    }, [remoteVideoStream?.renderElement]);

    return (
      <VideoTile
        {...participant}
        renderElement={renderVideoStreamElement}
        onRenderPlaceholder={onRenderAvatar}
        showMuteIndicator={showMuteIndicator}
        styles={styles}
      />
    );
  }
);
