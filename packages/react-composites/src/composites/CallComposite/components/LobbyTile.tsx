// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IStyle, mergeStyles, Stack } from '@fluentui/react';
import { VideoGalleryStream, useTheme, VideoStreamOptions } from '@internal/react-components';
import { lobbyTileInformationStyles } from '../styles/LobbyTile.styles';
import { ExpandedLocalVideoTile } from './ExpandedLocalVideoTile';

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

  const palette = useTheme().palette;

  return (
    <ExpandedLocalVideoTile
      localParticipantVideoStream={props.localParticipantVideoStream}
      onCreateLocalStreamView={props.onCreateLocalStreamView}
      overlayContent={
        props.overlay ? (
          <Stack
            verticalFill
            horizontalAlign="center"
            verticalAlign="center"
            className={mergeStyles(overlayContainerStyle)}
          >
            <Stack.Item className={mergeStyles(lobbyTileInformationStyles(palette, isVideoReady))}>
              {props.overlay.overlayIcon()}
            </Stack.Item>
            <Stack.Item className={mergeStyles(lobbyTileInformationStyles(palette, isVideoReady))}>
              {props.overlay.text}
            </Stack.Item>
          </Stack>
        ) : undefined
      }
    />
  );
};

const overlayContainerStyle: IStyle = {
  // Ensure some space around the text on a narrow viewport.
  margin: '1rem'
};
