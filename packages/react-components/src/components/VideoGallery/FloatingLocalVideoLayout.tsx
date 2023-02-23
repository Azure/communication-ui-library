// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LayerHost, mergeStyles, Stack } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useMemo } from 'react';
import { useTheme } from '../../theming';
import { GridLayout } from '../GridLayout';
import { isNarrowWidth } from '../utils/responsive';
import { FloatingLocalVideo } from './FloatingLocalVideo';
import { LayoutProps } from './Layout';
/* @conditional-compile-remove(pinned-participants) */
import { ScrollableHorizontalGallery } from './ScrollableHorizontalGallery';
import {
  LARGE_FLOATING_MODAL_SIZE_PX,
  localVideoTileContainerStyle,
  localVideoTileWithControlsContainerStyle,
  LOCAL_VIDEO_TILE_ZINDEX,
  SMALL_FLOATING_MODAL_SIZE_PX,
  VERTICAL_GALLERY_FLOATING_MODAL_SIZE_PX
} from './styles/FloatingLocalVideo.styles';
import { innerLayoutStyle, layerHostStyle, rootLayoutStyle } from './styles/FloatingLocalVideoLayout.styles';
import { videoGalleryLayoutGap } from './styles/Layout.styles';
import { useOrganizedParticipants } from './utils/videoGalleryLayoutUtils';
import { VideoGalleryResponsiveHorizontalGallery } from './VideoGalleryResponsiveHorizontalGallery';

/**
 * Props for {@link FloatingLocalVideoLayout}.
 *
 * @private
 */
export interface FloatingLocalVideoLayoutProps extends LayoutProps {
  /**
   * Whether to display the local video camera switcher button
   */
  showCameraSwitcherInLocalPreview?: boolean;
  /**
   * Height of parent element
   */
  parentHeight?: number;
}

/**
 * FloatingLocalVideoLayout displays remote participants and a screen sharing component in
 * a grid and horizontal gallery while floating the local video
 *
 * @private
 */
export const FloatingLocalVideoLayout = (props: FloatingLocalVideoLayoutProps): JSX.Element => {
  const {
    remoteParticipants = [],
    dominantSpeakers,
    localVideoComponent,
    screenShareComponent,
    onRenderRemoteParticipant,
    styles,
    maxRemoteVideoStreams,
    showCameraSwitcherInLocalPreview,
    parentWidth,
    parentHeight,
    /* @conditional-compile-remove(pinned-participants) */ pinnedParticipantUserIds,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryLayout = 'HorizontalBottom'
  } = props;

  const theme = useTheme();

  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;

  const { gridParticipants, horizontalGalleryParticipants } = useOrganizedParticipants({
    remoteParticipants,
    dominantSpeakers,
    maxRemoteVideoStreams,
    isScreenShareActive: !!screenShareComponent,
    /* @conditional-compile-remove(pinned-participants) */ pinnedParticipantUserIds
  });

  let activeVideoStreams = 0;

  const gridTiles = gridParticipants.map((p) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
        ? p.videoStream?.isAvailable && activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  const shouldFloatLocalVideo = remoteParticipants.length > 0;

  if (!shouldFloatLocalVideo && localVideoComponent) {
    gridTiles.push(localVideoComponent);
  }

  const horizontalGalleryTiles = horizontalGalleryParticipants.map((p) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
        ? p.videoStream?.isAvailable && activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  const layerHostId = useId('layerhost');

  let localVideoSize = LARGE_FLOATING_MODAL_SIZE_PX;
  if (isNarrow) {
    localVideoSize = SMALL_FLOATING_MODAL_SIZE_PX;
  }
  /* @conditional-compile-remove(vertical-gallery) */
  if (overflowGalleryLayout === 'VerticalRight') {
    localVideoSize = VERTICAL_GALLERY_FLOATING_MODAL_SIZE_PX;
  }

  const wrappedLocalVideoComponent =
    localVideoComponent && shouldFloatLocalVideo ? (
      // When we use showCameraSwitcherInLocalPreview it disables dragging to allow keyboard navigation.
      showCameraSwitcherInLocalPreview ? (
        <Stack
          className={mergeStyles(localVideoTileWithControlsContainerStyle(theme, localVideoSize), {
            boxShadow: theme.effects.elevation8,
            zIndex: LOCAL_VIDEO_TILE_ZINDEX
          })}
        >
          {localVideoComponent}
        </Stack>
      ) : horizontalGalleryTiles.length > 0 ? (
        <Stack className={mergeStyles(localVideoTileContainerStyle(theme, localVideoSize))}>
          {localVideoComponent}
        </Stack>
      ) : (
        <FloatingLocalVideo
          localVideoComponent={localVideoComponent}
          layerHostId={layerHostId}
          localVideoSize={localVideoSize}
          parentWidth={parentWidth}
          parentHeight={parentHeight}
        />
      )
    ) : undefined;

  const overflowGallery = useMemo(() => {
    if (horizontalGalleryTiles.length === 0) {
      return null;
    }
    /* @conditional-compile-remove(pinned-participants) */
    if (isNarrow) {
      return <ScrollableHorizontalGallery horizontalGalleryElements={horizontalGalleryTiles} />;
    }
    return (
      <VideoGalleryResponsiveHorizontalGallery
        isNarrow={isNarrow}
        shouldFloatLocalVideo={true}
        horizontalGalleryElements={horizontalGalleryTiles}
        styles={styles?.horizontalGallery}
        /* @conditional-compile-remove(vertical-gallery) */
        overflowGalleryLayout={overflowGalleryLayout}
      />
    );
  }, [
    isNarrow,
    horizontalGalleryTiles,
    styles?.horizontalGallery,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryLayout
  ]);

  return (
    <Stack styles={rootLayoutStyle}>
      {wrappedLocalVideoComponent}
      <LayerHost id={layerHostId} className={mergeStyles(layerHostStyle)} />
      <Stack
        /* @conditional-compile-remove(vertical-gallery) */
        horizontal={overflowGalleryLayout === 'VerticalRight'}
        styles={innerLayoutStyle}
        tokens={videoGalleryLayoutGap}
      >
        {screenShareComponent ? (
          screenShareComponent
        ) : (
          <GridLayout key="grid-layout" styles={styles?.gridLayout}>
            {gridTiles}
          </GridLayout>
        )}
        {overflowGallery}
      </Stack>
    </Stack>
  );
};
