// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { mergeStyles, Stack, Text } from '@fluentui/react';
import { LocalVideoCameraCycleButton, VideoGalleryStream, useTheme } from '@internal/react-components';
import {
  localCameraSwitcherContainerStyles,
  moreDetailsStyle,
  overlayContainerStyle,
  titleStyle
} from '../styles/LobbyTile.styles';
import { ExpandedLocalVideoTile } from './ExpandedLocalVideoTile';
import { useHandlers } from '../hooks/useHandlers';
import { localVideoCameraCycleButtonSelector } from '../selectors/LocalVideoTileSelector';
import { useSelector } from '../hooks/useSelector';

/**
 * @private
 */
export interface LobbyOverlayProps {
  overlayIcon?: JSX.Element;
  title: string;
  moreDetails?: string;
}

/**
 * @private
 */
export interface LobbyTileProps {
  localParticipantVideoStream: VideoGalleryStream;
  overlayProps: LobbyOverlayProps;
  showLocalVideoCameraCycleButton?: boolean;
}

/**
 * @private
 */
export const LobbyTile = (props: LobbyTileProps): JSX.Element => {
  const videoStream = props.localParticipantVideoStream;
  const isVideoReady = videoStream?.isAvailable ?? false;

  const cameraSwitcherCameras = useSelector(localVideoCameraCycleButtonSelector);
  const cameraSwitcherCallback = useHandlers(LocalVideoCameraCycleButton);

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
            aria-atomic
          >
            {props.showLocalVideoCameraCycleButton && isVideoReady && (
              <Stack.Item styles={localCameraSwitcherContainerStyles}>
                <LocalVideoCameraCycleButton {...cameraSwitcherCallback} {...cameraSwitcherCameras} size={'large'} />
              </Stack.Item>
            )}
            <Stack.Item className={mergeStyles(titleStyle(palette, isVideoReady))}>
              {props.overlayProps.overlayIcon}
            </Stack.Item>
            <Text
              className={mergeStyles(titleStyle(palette, isVideoReady))}
              aria-live="assertive"
              data-ui-id="lobbyScreenTitle"
              role="alert"
            >
              {props.overlayProps.title}
            </Text>
            {props.overlayProps.moreDetails && (
              <Text className={mergeStyles(moreDetailsStyle(palette, isVideoReady))} aria-live="assertive">
                {props.overlayProps.moreDetails}
              </Text>
            )}
          </Stack>
        ) : undefined
      }
      {...handlers}
    />
  );
};
