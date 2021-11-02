// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import { IStackStyles, mergeStyles, Stack } from '@fluentui/react';
import { StreamMedia, VideoGalleryStream, VideoTile, useTheme, VideoStreamOptions } from '@internal/react-components';
import { IPalette, IStyle } from '@fluentui/react';

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

  console.log(darkenedOverlayStyles(palette, isVideoReady));
  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles} grow>
      <VideoTile
        styles={videoTileStyles}
        renderElement={renderElement ? <StreamMedia videoStreamElement={renderElement} /> : undefined}
        onRenderPlaceholder={onRenderEmptyPlaceholder}
      >
        {props.overlayContent && (
          <>
            <Stack verticalFill className={mergeStyles(darkenedOverlayStyles(palette, isVideoReady))}>
              {props.overlayContent}
            </Stack>
          </>
        )}
      </VideoTile>
    </Stack>
  );
};

const containerStyles: IStackStyles = {
  root: {
    height: '100%',
    width: '100%',
    position: 'relative'
  }
};

const darkenedOverlayStyles: (palette: IPalette, isVideoReady: boolean) => IStyle = (palette, isVideoReady) => {
  const colorWithAlpha = (isVideoReady ? '#000000' : palette.neutralLight) + '60';
  return {
    position: 'absolute',
    height: '100%',
    width: '100%',
    background: colorWithAlpha
  };
};

const videoTileStyles = {
  root: { height: '100%', width: '100%' }
};
