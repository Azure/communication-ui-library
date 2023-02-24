// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { VideoGalleryStream, useTheme } from '@internal/react-components';
import { ExpandedLocalVideoTile } from './ExpandedLocalVideoTile';
import { mergeStyles, Stack, Text } from '@fluentui/react';
import { useLocale } from '../../localization';
import {
  containerStyle,
  moreDetailsStyle,
  titleContainerStyle,
  titleStyle
} from '../styles/NetworkReconnectTile.styles';
import { useHandlers } from '../hooks/useHandlers';
import { useLocalVideoStartTrigger } from './MediaGallery';
import { CallCompositeIcon } from '../../common/icons';

/**
 * @private
 */
export interface NetworkReconnectTileProps {
  localParticipantVideoStream: VideoGalleryStream;
}

/**
 * @private
 */
export const NetworkReconnectTile = (props: NetworkReconnectTileProps): JSX.Element => {
  const videoStream = props.localParticipantVideoStream;
  const isVideoReady = videoStream?.isAvailable ?? false;
  const palette = useTheme().palette;
  const strings = useLocale().strings.call;

  const handlers = useHandlers(ExpandedLocalVideoTile);
  // This tile may be shown at the beginning of a call.
  // So we need to transition local video to the call.
  useLocalVideoStartTrigger(!!props.localParticipantVideoStream.isAvailable);

  return (
    <ExpandedLocalVideoTile
      localParticipantVideoStream={props.localParticipantVideoStream}
      overlayContent={
        <Stack
          verticalFill
          horizontalAlign="center"
          verticalAlign="center"
          className={mergeStyles(containerStyle)}
          aria-atomic
        >
          <Stack horizontal className={mergeStyles(titleContainerStyle)}>
            <CallCompositeIcon
              iconName="NetworkReconnectIcon"
              className={mergeStyles(titleStyle(palette, isVideoReady))}
            />
            <Text className={mergeStyles(titleStyle(palette, isVideoReady))} aria-live={'assertive'}>
              {strings.networkReconnectTitle}
            </Text>
          </Stack>
          <Text className={mergeStyles(moreDetailsStyle(palette, isVideoReady))} aria-live={'assertive'}>
            {strings.networkReconnectMoreDetails}
          </Text>
        </Stack>
      }
      {...handlers}
    />
  );
};
