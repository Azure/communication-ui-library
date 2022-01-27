// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useMemo } from 'react';
import {
  StreamMedia,
  VideoGalleryStream,
  VideoStreamOptions,
  _PictureInPictureInPicture,
  _PictureInPictureInPictureTileProps
} from '@internal/react-components';

/**
 * @private
 */
export interface LocalAndRemotePIPProps {
  onClick: () => void;
  localParticipant: { displayName?: string; videoStream?: VideoGalleryStream };
  dominantRemoteParticipant?: {
    userId: string;
    displayName?: string;
    videoStream?: VideoGalleryStream;
  };

  /** Callback to create the local video stream view */
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>;
  /** Callback to dispose of the local video stream view */
  onDisposeLocalStreamView?: () => void;
  /** Callback to create a remote video stream view */
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
  /** Callback to dispose a remote video stream view */
  onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
}

/**
 * @private
 */
export const LocalAndRemotePIP = (props: LocalAndRemotePIPProps): JSX.Element => {
  const {
    localParticipant,
    dominantRemoteParticipant,
    onCreateLocalStreamView,
    onDisposeLocalStreamView,
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView
  } = props;

  useEffect(() => {
    if (localParticipant.videoStream?.isAvailable && !localParticipant.videoStream.renderElement) {
      onCreateLocalStreamView && onCreateLocalStreamView(localVideoViewOptions);
    }

    return () => {
      onDisposeLocalStreamView && onDisposeLocalStreamView();
    };
  }, [localParticipant, onCreateLocalStreamView, onDisposeLocalStreamView]);

  const localVideoTile = useMemo(
    () => createVideoTile(localParticipant.displayName, localParticipant?.videoStream),
    [localParticipant.displayName, localParticipant?.videoStream]
  );

  useEffect(() => {
    if (dominantRemoteParticipant?.videoStream?.isAvailable && !dominantRemoteParticipant.videoStream.renderElement) {
      onCreateRemoteStreamView && onCreateRemoteStreamView(dominantRemoteParticipant.userId, remoteVideoViewOptions);
    }
    return () => {
      onDisposeRemoteStreamView &&
        dominantRemoteParticipant?.videoStream?.renderElement &&
        onDisposeRemoteStreamView(dominantRemoteParticipant.userId);
    };
  }, [dominantRemoteParticipant, onCreateRemoteStreamView, onDisposeRemoteStreamView]);

  const remoteVideoTile = useMemo(
    () =>
      props.dominantRemoteParticipant &&
      createVideoTile(props.dominantRemoteParticipant.displayName, props.dominantRemoteParticipant.videoStream),
    [props.dominantRemoteParticipant]
  );

  return (
    <_PictureInPictureInPicture
      onClick={props.onClick}
      // If there are no remote participants, show the local participant as the primary tile
      primaryTile={remoteVideoTile ?? localVideoTile}
      // If we are showing the local participant as the primary tile, show nothing for the secondary tile
      secondaryTile={remoteVideoTile ? localVideoTile : undefined}
    />
  );
};

const localVideoViewOptions: VideoStreamOptions = {
  scalingMode: 'Crop',
  isMirrored: true
};

const remoteVideoViewOptions: VideoStreamOptions = {
  scalingMode: 'Crop',
  isMirrored: false
};

const createVideoTile = (
  displayName?: string,
  videoStream?: VideoGalleryStream
): _PictureInPictureInPictureTileProps => {
  return {
    orientation: 'portrait', // TODO: when the calling SDK provides height/width stream information - update this to reflect the stream orientation.
    renderElement: videoStream?.renderElement ? (
      <StreamMedia videoStreamElement={videoStream.renderElement} />
    ) : undefined,
    displayName: displayName
  };
};
