// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import { mergeStyles, Stack } from '@fluentui/react';
import { StreamMedia, VideoGalleryStream, VideoTile, useTheme, VideoStreamOptions } from '@internal/react-components';
import {
  containerStyles,
  overlayBackgroundStyles,
  overlayContentStyles,
  videoTileStyles
} from '../styles/ExpandedLocalVideoTile.styles';

const onRenderEmptyPlaceholder = (): JSX.Element => <></>;

const localVideoViewOption = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

/**
 * @private
 */
export interface ExpandedLocalVideoTileProps {
  localParticipantVideoStream: VideoGalleryStream;
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>;
  overlayContent?: JSX.Element;
}

/**
 * @private
 */
export const ExpandedLocalVideoTile = (props: ExpandedLocalVideoTileProps): JSX.Element => {
  const videoStream = props.localParticipantVideoStream;
  const isVideoReady = videoStream?.isAvailable ?? false;
  const renderElement = videoStream?.renderElement;
  const palette = useTheme().palette;

  useEffect(() => {
    if (videoStream && isVideoReady) {
      props.onCreateLocalStreamView &&
        props.onCreateLocalStreamView(localVideoViewOption).catch((err) => console.log('Can not render video', err));
    }
  }, [isVideoReady, videoStream, props, renderElement]);

  console.log(overlayBackgroundStyles(palette, isVideoReady));
  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles} grow>
      <VideoTile
        styles={videoTileStyles}
        renderElement={renderElement ? <StreamMedia videoStreamElement={renderElement} /> : undefined}
        onRenderPlaceholder={onRenderEmptyPlaceholder}
      >
        {props.overlayContent && (
          <>
            <Stack className={mergeStyles(overlayBackgroundStyles(palette, isVideoReady))} />
            <Stack horizontalAlign="center" verticalAlign="center" className={mergeStyles(overlayContentStyles)}>
              {props.overlayContent}
            </Stack>
          </>
        )}
      </VideoTile>
    </Stack>
  );
};
