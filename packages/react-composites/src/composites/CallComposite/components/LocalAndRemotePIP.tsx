// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import {
  CreateVideoStreamViewResult,
  VideoGalleryStream,
  VideoStreamOptions,
  _LocalVideoTile,
  _RemoteVideoTile,
  _PictureInPictureInPicture,
  _PictureInPictureInPictureTileProps
} from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { _usePermissions } from '@internal/react-components';

import { useLocale } from '../../localization';

/**
 * @private
 */
export interface LocalAndRemotePIPProps {
  localParticipant: { displayName?: string; videoStream?: VideoGalleryStream };
  dominantRemoteParticipant?: {
    userId: string;
    displayName?: string;
    videoStream?: VideoGalleryStream;
  };

  /** Callback to create the local video stream view */
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult>;
  /** Callback to dispose of the local video stream view */
  onDisposeLocalStreamView?: () => void;
  /** Callback to create a remote video stream view */
  onCreateRemoteStreamView?: (
    userId: string,
    options?: VideoStreamOptions
  ) => Promise<void | CreateVideoStreamViewResult>;
  /** Callback to dispose a remote video stream view */
  onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
  onClick?: () => void;
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

  const localVideoTileProps = useMemo(
    () => ({
      onCreateLocalStreamView,
      onDisposeLocalStreamView,
      localVideoViewOptions,
      displayName: localParticipant.displayName,
      showLabel: false,
      showMuteIndicator: false,
      showCameraSwitcherInLocalPreview: false,
      isAvailable: localParticipant.videoStream?.isAvailable,
      renderElement: localParticipant.videoStream?.renderElement
    }),
    [
      localParticipant.displayName,
      localParticipant.videoStream?.isAvailable,
      localParticipant.videoStream?.renderElement,
      onCreateLocalStreamView,
      onDisposeLocalStreamView
    ]
  );

  const remoteVideoTileProps = useMemo(
    () =>
      !dominantRemoteParticipant
        ? undefined
        : {
            onCreateRemoteStreamView,
            onDisposeRemoteStreamView,
            remoteVideoViewOptions,
            displayName: dominantRemoteParticipant?.displayName,
            showLabel: false,
            showMuteIndicator: false,
            isAvailable: dominantRemoteParticipant.videoStream?.isAvailable,
            isReceiving: dominantRemoteParticipant.videoStream?.isReceiving,
            renderElement: dominantRemoteParticipant.videoStream?.renderElement,
            userId: dominantRemoteParticipant.userId,
            key: dominantRemoteParticipant.userId
          },
    [dominantRemoteParticipant, onCreateRemoteStreamView, onDisposeRemoteStreamView]
  );

  const locale = useLocale();
  const ariaLabel = locale.strings.callWithChat.pictureInPictureTileAriaLabel;
  const strings = useMemo(
    () => ({
      rootAriaLabel: ariaLabel
    }),
    [ariaLabel]
  );

  /* @conditional-compile-remove(rooms) */
  const permissions = _usePermissions();
  let canTurnCameraOn = true;
  /* @conditional-compile-remove(rooms) */
  canTurnCameraOn = permissions.cameraButton;

  // If there are no remote participants, show the local participant as the primary tile
  const primaryTileProps: _PictureInPictureInPictureTileProps = useMemo(
    () => ({
      children: remoteVideoTileProps ? (
        <_RemoteVideoTile {...remoteVideoTileProps} />
      ) : (
        canTurnCameraOn && <_LocalVideoTile {...localVideoTileProps} />
      ),
      // TODO: when the calling SDK provides height/width stream information - update this to reflect the stream orientation.
      orientation: 'portrait'
    }),
    [localVideoTileProps, remoteVideoTileProps, canTurnCameraOn]
  );

  // If we are showing the local participant as the primary tile, show nothing for the secondary tile
  const secondaryTileProps: _PictureInPictureInPictureTileProps | undefined = useMemo(
    () =>
      remoteVideoTileProps && canTurnCameraOn
        ? {
            children: <_LocalVideoTile {...localVideoTileProps} personaMinSize={20} />,
            // TODO: when the calling SDK provides height/width stream information - update this to reflect the stream orientation.
            orientation: 'portrait'
          }
        : undefined,
    [localVideoTileProps, remoteVideoTileProps, canTurnCameraOn]
  );

  return (
    <_PictureInPictureInPicture
      onClick={props.onClick}
      strings={strings}
      primaryTile={primaryTileProps}
      secondaryTile={secondaryTileProps}
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
