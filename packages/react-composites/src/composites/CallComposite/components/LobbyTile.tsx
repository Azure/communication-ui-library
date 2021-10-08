// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import { StreamMedia, VideoGalleryStream, VideoTile, useTheme, VideoStreamOptions } from '@internal/react-components';

const onRenderEmptyPlaceholder = (): JSX.Element => <></>;

const videoTileStyles = {
  root: { height: '100%', width: '100%' },
  overlayContainer: {}
};

const localVideoViewOption = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

/**
 * @private
 */
export interface LobbyOverlayProps {
  overlayIcon: () => JSX.Element;
  text: string;
}

/**
 * @private
 */
export interface LobbyTileProps {
  localParticipantVideoStream: VideoGalleryStream;
  overlay: false | LobbyOverlayProps;
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>;
}

/**
 * @private
 */
export const LobbyTile = (props: LobbyTileProps): JSX.Element => {
  const videoStream = props.localParticipantVideoStream;
  const isVideoReady = videoStream?.isAvailable ?? false;
  const renderElement = videoStream?.renderElement;

  useEffect(() => {
    if (videoStream && isVideoReady) {
      props.onCreateLocalStreamView &&
        props.onCreateLocalStreamView(localVideoViewOption).catch((err) => console.log('Can not render video', err));
    }
  }, [isVideoReady, videoStream, props, renderElement]);

  const palette = useTheme().palette;
  return (
    <VideoTile
      styles={videoTileStyles}
      renderElement={renderElement ? <StreamMedia videoStreamElement={renderElement} /> : undefined}
      onRenderPlaceholder={onRenderEmptyPlaceholder}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          background: isVideoReady ? '#201f1e' : palette.neutralLight,
          opacity: 0.75
        }}
      />

      {props.overlay && (
        <div
          style={{
            textAlign: 'center',
            zIndex: 0,
            width: '50%',
            height: '25%',
            overflow: 'none',
            margin: 'auto',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }}
        >
          <p style={{ fontSize: '1.75rem', color: isVideoReady ? 'white' : palette.neutralPrimary }}>
            ☕ <br /> {props.overlay.text}
          </p>
        </div>
      )}
    </VideoTile>
  );
};
