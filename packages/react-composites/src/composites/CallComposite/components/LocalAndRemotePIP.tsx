// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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

import { useLocale } from '../../localization';

import { RaisedHand } from '@internal/react-components';

/**
 * @private
 */
export interface LocalAndRemotePIPProps {
  localParticipant: {
    displayName?: string;
    videoStream?: VideoGalleryStream;
    raisedHand?: RaisedHand;
  };
  remoteParticipant?: {
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
    remoteParticipant,
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
      renderElement: localParticipant.videoStream?.renderElement,
      raisedHand: localParticipant.raisedHand
    }),
    [
      localParticipant.displayName,
      localParticipant.videoStream?.isAvailable,
      localParticipant.videoStream?.renderElement,
      onCreateLocalStreamView,
      onDisposeLocalStreamView,
      localParticipant.raisedHand
    ]
  );

  const remoteVideoTileProps = useMemo(
    () =>
      !remoteParticipant
        ? undefined
        : {
            remoteParticipant: remoteParticipant,
            onCreateRemoteStreamView,
            onDisposeRemoteStreamView,
            remoteVideoViewOptions,
            displayName: remoteParticipant?.displayName,
            showLabel: false,
            showMuteIndicator: false,
            isAvailable: remoteParticipant.videoStream?.isAvailable,
            isReceiving: remoteParticipant.videoStream?.isReceiving,
            renderElement: remoteParticipant.videoStream?.renderElement,
            userId: remoteParticipant.userId,
            key: remoteParticipant.userId
          },
    [remoteParticipant, onCreateRemoteStreamView, onDisposeRemoteStreamView]
  );

  const locale = useLocale();
  const ariaLabel = locale.strings.callWithChat.pictureInPictureTileAriaLabel;
  const strings = useMemo(
    () => ({
      rootAriaLabel: ariaLabel
    }),
    [ariaLabel]
  );

  // If there are no remote participants, show the local participant as the primary tile
  const primaryTileProps: _PictureInPictureInPictureTileProps = useMemo(
    () => ({
      children: remoteVideoTileProps ? (
        <_RemoteVideoTile
          {...remoteVideoTileProps}
          strings={locale.component.strings.videoGallery}
          onLongTouch={() => {}}
        />
      ) : (
        <_LocalVideoTile {...localVideoTileProps} />
      ),
      // TODO: when the calling SDK provides height/width stream information - update this to reflect the stream orientation.
      orientation: 'portrait'
    }),
    [localVideoTileProps, remoteVideoTileProps, locale.component.strings.videoGallery]
  );

  // If we are showing the local participant as the primary tile, show nothing for the secondary tile
  const secondaryTileProps: _PictureInPictureInPictureTileProps | undefined = useMemo(
    () =>
      remoteVideoTileProps
        ? {
            children: <_LocalVideoTile {...localVideoTileProps} personaMinSize={20} />,
            // TODO: when the calling SDK provides height/width stream information - update this to reflect the stream orientation.
            orientation: 'portrait'
          }
        : undefined,
    [localVideoTileProps, remoteVideoTileProps]
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
