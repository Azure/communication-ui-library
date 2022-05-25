// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useMemo } from 'react';
import {
  VideoGalleryStream,
  VideoStreamOptions,
  _LocalVideoTile,
  _RemoteVideoTile,
  _PictureInPictureInPicture,
  _PictureInPictureInPictureTileProps
} from '@internal/react-components';

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
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>;
  /** Callback to dispose of the local video stream view */
  onDisposeLocalStreamView?: () => void;
  /** Callback to create a remote video stream view */
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
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

  React.useEffect(() => {
    console.log('LocalAndRemote PIP Component mounted.');
    return () => {
      console.log('LocalAndRemote PIP Component unmounted.');
    };
  }, []);

  const LocalVideoTile = useCallback(
    () => (
      <_LocalVideoTile
        onCreateLocalStreamView={onCreateLocalStreamView}
        onDisposeLocalStreamView={onDisposeLocalStreamView}
        localVideoViewOptions={localVideoViewOptions}
        displayName={localParticipant.displayName}
        showLabel={false}
        showMuteIndicator={false}
        showCameraSwitcherInLocalPreview={false}
        isAvailable={localParticipant.videoStream?.isAvailable}
        renderElement={localParticipant.videoStream?.renderElement}
      />
    ),
    [
      localParticipant.displayName,
      localParticipant.videoStream?.isAvailable,
      localParticipant.videoStream?.renderElement,
      onCreateLocalStreamView,
      onDisposeLocalStreamView
    ]
  );

  const localVideoPiP: _PictureInPictureInPictureTileProps = useMemo(
    () => ({
      content: <LocalVideoTile />,
      orientation: 'portrait' // TODO: when the calling SDK provides height/width stream information - update this to reflect the stream orientation.
    }),
    [LocalVideoTile]
  );

  console.log(
    'remoteVideoPiP creation, dominantRemoteParticipant:',
    JSON.stringify(dominantRemoteParticipant),
    ' render element:',
    dominantRemoteParticipant?.videoStream?.renderElement
  );

  const dominantRemoteParticipantExists = !!dominantRemoteParticipant;
  const remoteDisplayName = dominantRemoteParticipant?.displayName;
  const remoteVideoStream = dominantRemoteParticipant?.videoStream;
  const remoteVideoStreamIsAvailable = remoteVideoStream?.isAvailable;
  const remoteVideoStreamRenderElement = remoteVideoStream?.renderElement;
  const remoteUserId = dominantRemoteParticipant?.userId;
  const RemoteVideoTile = useCallback(
    () =>
      !dominantRemoteParticipantExists ? (
        <></>
      ) : (
        <_RemoteVideoTile
          onCreateRemoteStreamView={onCreateRemoteStreamView}
          onDisposeRemoteStreamView={onDisposeRemoteStreamView}
          remoteVideoViewOptions={remoteVideoViewOptions}
          displayName={remoteDisplayName}
          // showLabel={false}
          showMuteIndicator={false}
          isAvailable={remoteVideoStreamIsAvailable}
          renderElement={remoteVideoStreamRenderElement}
          userId={remoteUserId}
          key={remoteUserId}
          personaMinSize={20}
        />
      ),
    [
      dominantRemoteParticipantExists,
      remoteDisplayName,
      remoteUserId,
      remoteVideoStreamIsAvailable,
      remoteVideoStreamRenderElement,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView
    ]
  );

  const remoteVideoPiP: _PictureInPictureInPictureTileProps | undefined = useMemo(
    () =>
      dominantRemoteParticipantExists
        ? {
            content: <RemoteVideoTile />,
            orientation: 'portrait' // TODO: when the calling SDK provides height/width stream information - update this to reflect the stream orientation.
          }
        : undefined,
    [RemoteVideoTile, dominantRemoteParticipantExists]
  );

  const locale = useLocale();
  const ariaLabel = locale.strings.callWithChat.pictureInPictureTileAriaLabel;
  const strings = useMemo(
    () => ({
      rootAriaLabel: ariaLabel
    }),
    [ariaLabel]
  );

  return (
    <_PictureInPictureInPicture
      onClick={props.onClick}
      strings={strings}
      // If there are no remote participants, show the local participant as the primary tile
      primaryTile={remoteVideoPiP ?? localVideoPiP}
      // If we are showing the local participant as the primary tile, show nothing for the secondary tile
      secondaryTile={remoteVideoPiP ? localVideoPiP : undefined}
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
