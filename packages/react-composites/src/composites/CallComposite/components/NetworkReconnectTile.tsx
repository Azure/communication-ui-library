// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { VideoGalleryStream, useTheme, VideoStreamOptions } from '@internal/react-components';
import { ExpandedLocalVideoTile } from './ExpandedLocalVideoTile';
import { Icon, mergeStyles, Stack, Text } from '@fluentui/react';
import { useLocale } from '../../localization';
import {
  containerStyle,
  moreDetailsStyle,
  titleContainerStyle,
  titleStyle
} from '../styles/NetworkReconnectTile.styles';

/**
 * @private
 */
export interface NetworkReconnectTileProps {
  localParticipantVideoStream: VideoGalleryStream;
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>;
}

/**
 * @private
 */
export const NetworkReconnectTile = (props: NetworkReconnectTileProps): JSX.Element => {
  const videoStream = props.localParticipantVideoStream;
  const isVideoReady = videoStream?.isAvailable ?? false;

  const palette = useTheme().palette;
  const strings = useLocale().strings.call;

  return (
    <ExpandedLocalVideoTile
      localParticipantVideoStream={props.localParticipantVideoStream}
      onCreateLocalStreamView={props.onCreateLocalStreamView}
      overlayContent={
        <Stack verticalFill horizontalAlign="center" verticalAlign="center" className={mergeStyles(containerStyle)}>
          <Stack horizontal className={mergeStyles(titleContainerStyle)}>
            <Icon iconName="NetworkReconnectIcon" className={mergeStyles(titleStyle)} />
            <Text className={mergeStyles(titleStyle(palette, isVideoReady))} aria-live={'polite'}>
              {strings.networkReconnectTitle}
            </Text>
            <Stack.Item className={mergeStyles()}></Stack.Item>
          </Stack>
          <Text className={mergeStyles(moreDetailsStyle(palette, isVideoReady))} aria-live={'polite'}>
            {strings.networkReconnectMoreDetails}
          </Text>
        </Stack>
      }
    />
  );
};
