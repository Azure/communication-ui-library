// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { mergeStyles, Image, Stack, Text } from '@fluentui/react';
import { VideoGalleryStream, useTheme } from '@internal/react-components';
import { moreDetailsStyle, overlayContainerStyle, titleStyle } from '../styles/LobbyTile.styles';
import { ExpandedLocalVideoTile } from './ExpandedLocalVideoTile';
import { useHandlers } from '../hooks/useHandlers';

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
  logoUrl?: string;
  bgUrl?: string;
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
      bgUrl={props.bgUrl}
      overlayContent={
        props.overlayProps ? (
          <Stack
            verticalFill
            horizontalAlign="center"
            verticalAlign="center"
            className={mergeStyles(overlayContainerStyle)}
            aria-atomic
          >
            <Stack.Item className={mergeStyles(titleStyle(palette, isVideoReady))}>
              {props.logoUrl ? (
                <>
                  <Image
                    src={props.logoUrl}
                    alt="Logo"
                    styles={{
                      root: { overflow: 'initial' },
                      image: { borderRadius: '100%', height: '5rem', width: '5rem' }
                    }}
                  />
                  <br />
                </>
              ) : (
                props.overlayProps.overlayIcon
              )}
            </Stack.Item>
            <Text
              className={mergeStyles(titleStyle(palette, isVideoReady))}
              aria-live="assertive"
              data-ui-id="lobbyScreenTitle"
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
