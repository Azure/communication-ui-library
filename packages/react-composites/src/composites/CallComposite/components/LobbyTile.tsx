// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mergeStyles, Stack } from '@fluentui/react';
import { VideoGalleryStream, useTheme } from '@internal/react-components';
import { moreDetailsStyle, overlayContainerStyle, titleStyle } from '../styles/LobbyTile.styles';
import { ExpandedLocalVideoTile } from './ExpandedLocalVideoTile';
import { useHandlers } from '../hooks/useHandlers';

/**
 * @private
 */
export interface LobbyOverlayProps {
  overlayIcon: JSX.Element;
  title: string;
  moreDetails?: string;
}

/**
 * @private
 */
export interface LobbyTileProps {
  localParticipantVideoStream: VideoGalleryStream;
  overlayProps: LobbyOverlayProps;
}

/**
 * @private
 */
export const LobbyTile = (props: LobbyTileProps): JSX.Element => {
  const videoStream = props.localParticipantVideoStream;
  const isVideoReady = videoStream?.isAvailable ?? false;

  const palette = useTheme().palette;
  const handlers = useHandlers(ExpandedLocalVideoTile);

  return (
    <ExpandedLocalVideoTile
      localParticipantVideoStream={props.localParticipantVideoStream}
      overlayContent={
        props.overlayProps ? (
          <Stack
            verticalFill
            horizontalAlign="center"
            verticalAlign="center"
            className={mergeStyles(overlayContainerStyle)}
          >
            <Stack.Item className={mergeStyles(titleStyle(palette, isVideoReady))}>
              {props.overlayProps.overlayIcon}
            </Stack.Item>
            <Stack.Item className={mergeStyles(titleStyle(palette, isVideoReady))}>
              {props.overlayProps.title}
            </Stack.Item>
            {props.overlayProps.moreDetails && (
              <Stack.Item className={mergeStyles(moreDetailsStyle(palette, isVideoReady))}>
                {props.overlayProps.moreDetails}
              </Stack.Item>
            )}
          </Stack>
        ) : undefined
      }
      {...handlers}
    />
  );
};
