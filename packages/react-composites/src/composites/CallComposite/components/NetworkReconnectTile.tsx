// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { VideoGalleryStream, useTheme, VideoStreamOptions } from '@internal/react-components';
import { ExpandedLocalVideoTile } from './ExpandedLocalVideoTile';

import { FontWeights, Icon, IStyle, mergeStyles, Stack } from '@fluentui/react';
import { useLocale } from '../../localization';

const containerStyle: IStyle = {
  gap: `1.5rem`
};

const titleContainerStyle: IStyle = {
  gap: `1rem`
};

const titleStyle = (palette, isVideoReady): IStyle => ({
  fontSize: '1.25rem',
  fontWeight: FontWeights.semibold,
  color: isVideoReady ? 'white' : palette.neutralPrimary,
  textAlign: 'center'
});

const moreDetailsStyle = (palette, isVideoReady): IStyle => ({
  fontSize: '1rem',
  color: isVideoReady ? 'white' : palette.neutralPrimary,
  textAlign: 'center'
});

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
            <Stack.Item className={mergeStyles(titleStyle(palette, isVideoReady))}>
              {strings.networkReconnectTitle}
            </Stack.Item>
          </Stack>
          <Stack.Item className={mergeStyles(moreDetailsStyle(palette, isVideoReady))}>
            {strings.networkReconnectMoreDetails}
          </Stack.Item>
        </Stack>
      }
    />
  );
};
