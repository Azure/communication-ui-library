// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import { mergeStyles, Stack } from '@fluentui/react';
import { StreamMedia, VideoGalleryStream, VideoTile, useTheme, VideoStreamOptions } from '@internal/react-components';
import {
  lobbyTileDarkenedOverlayStyles,
  lobbyTileInformationStyles,
  videoTileStyles
} from '../styles/LobbyTile.styles';

const onRenderEmptyPlaceholder = (): JSX.Element => <></>;

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
      {props.overlay && (
        <>
          <Stack verticalFill className={mergeStyles(lobbyTileDarkenedOverlayStyles(palette, isVideoReady))}></Stack>
          <Stack verticalFill horizontalAlign="center" verticalAlign="center">
            <Stack.Item className={mergeStyles(lobbyTileInformationStyles(palette, isVideoReady))}>
              {props.overlay.overlayIcon()}
            </Stack.Item>
            <Stack.Item className={mergeStyles(lobbyTileInformationStyles(palette, isVideoReady))}>
              {props.overlay.text}
            </Stack.Item>
          </Stack>
        </>
      )}
    </VideoTile>
  );
};
