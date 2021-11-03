// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IStyle, mergeStyles, Stack } from '@fluentui/react';
import { VideoGalleryStream, useTheme, VideoStreamOptions } from '@internal/react-components';
import { moreDetailsStyle, titleStyle } from '../styles/LobbyTile.styles';
import { ExpandedLocalVideoTile } from './ExpandedLocalVideoTile';

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
    />
  );
};

const overlayContainerStyle: IStyle = {
  // Ensure some space around the text on a narrow viewport.
  margin: '1rem'
};
