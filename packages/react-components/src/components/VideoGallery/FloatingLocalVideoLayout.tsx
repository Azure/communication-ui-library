// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { LayerHost, mergeStyles, Stack } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useMemo, useRef, useState } from 'react';
import { useTheme } from '../../theming';
import { GridLayout } from '../GridLayout';
import { isNarrowWidth } from '../utils/responsive';
import { isShortHeight } from '../utils/responsive';
import { FloatingLocalVideo } from './FloatingLocalVideo';
import { LayoutProps } from './Layout';
import {
  LARGE_FLOATING_MODAL_SIZE_REM,
  localVideoTileContainerStyle,
  localVideoTileWithControlsContainerStyle,
  LOCAL_VIDEO_TILE_ZINDEX,
  SMALL_FLOATING_MODAL_SIZE_REM
} from './styles/FloatingLocalVideo.styles';
import {
  SHORT_VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM,
  VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM
} from './styles/FloatingLocalVideo.styles';
import { innerLayoutStyle, layerHostStyle, rootLayoutStyle } from './styles/FloatingLocalVideoLayout.styles';
import { videoGalleryLayoutGap } from './styles/Layout.styles';
import {
  MAX_GRID_PARTICIPANTS_NOT_LARGE_GALLERY,
  renderTiles,
  useOrganizedParticipants
} from './utils/videoGalleryLayoutUtils';
import { OverflowGallery } from './OverflowGallery';
import { LocalVideoTileSize } from '../VideoGallery';

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
  /**
   * Local video tile mode
   */
  localVideoTileSize?: LocalVideoTileSize;
}

/**
 * FloatingLocalVideoLayout displays remote participants and a screen sharing component in
 * a grid and overflow gallery while floating the local video
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
    overflowGalleryPosition = 'horizontalBottom',
    pinnedParticipantUserIds = [],
    localVideoTileSize,
    spotlightedParticipantUserIds
  } = props;

  const theme = useTheme();

  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;

  const isShort = parentHeight ? isShortHeight(parentHeight) : false;

  // This is for tracking the number of children in the first page of overflow gallery.
  // This number will be used for the maxOverflowGalleryDominantSpeakers when organizing the remote participants.
  const childrenPerPage = useRef(4);
  const remoteVideosOn = remoteParticipants.filter((p) => p.videoStream?.isAvailable).length > 0;
  const { gridParticipants, overflowGalleryParticipants } = useOrganizedParticipants({
    remoteParticipants,
    dominantSpeakers,
    maxGridParticipants: remoteVideosOn ? maxRemoteVideoStreams : MAX_GRID_PARTICIPANTS_NOT_LARGE_GALLERY,
    isScreenShareActive: !!screenShareComponent,
    maxOverflowGalleryDominantSpeakers: screenShareComponent
      ? childrenPerPage.current - (pinnedParticipantUserIds.length % childrenPerPage.current)
      : childrenPerPage.current,
    pinnedParticipantUserIds,
    layout: 'floatingLocalVideo',
    spotlightedParticipantUserIds
  });

  /**
   * instantiate indexes available to render with indexes available that would be on first page
   *
   * For some components which do not strictly follow the order of the array, we might
   * re-render the initial tiles -> dispose them -> create new tiles, we need to take care of
   * this case when those components are here
   */
  const [indexesToRender, setIndexesToRender] = useState<number[]>([]);

  const { gridTiles, overflowGalleryTiles } = renderTiles(
    gridParticipants,
    onRenderRemoteParticipant,
    maxRemoteVideoStreams,
    indexesToRender,
    overflowGalleryParticipants,
    dominantSpeakers
  );

  const shouldFloatLocalVideo = remoteParticipants.length > 0;

  if (!shouldFloatLocalVideo && localVideoComponent) {
    gridTiles.push(localVideoComponent);
  }

  const layerHostId = useId('layerhost');

  const localVideoSizeRem = useMemo(() => {
    if ((isNarrow && localVideoTileSize !== '16:9') || localVideoTileSize === '9:16') {
      return SMALL_FLOATING_MODAL_SIZE_REM;
    }
    if ((overflowGalleryTiles.length > 0 || screenShareComponent) && overflowGalleryPosition === 'verticalRight') {
      return isNarrow
        ? SMALL_FLOATING_MODAL_SIZE_REM
        : isShort
          ? SHORT_VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM
          : VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM;
    }
    if ((overflowGalleryTiles.length > 0 || screenShareComponent) && overflowGalleryPosition === 'horizontalBottom') {
      return localVideoTileSize === '16:9' || !isNarrow ? LARGE_FLOATING_MODAL_SIZE_REM : SMALL_FLOATING_MODAL_SIZE_REM;
    }
    return LARGE_FLOATING_MODAL_SIZE_REM;
  }, [
    overflowGalleryTiles.length,
    isNarrow,
    screenShareComponent,
    isShort,
    overflowGalleryPosition,
    localVideoTileSize
  ]);

  const wrappedLocalVideoComponent =
    (localVideoComponent && shouldFloatLocalVideo) || (screenShareComponent && localVideoComponent) ? (
      // When we use showCameraSwitcherInLocalPreview it disables dragging to allow keyboard navigation.
      showCameraSwitcherInLocalPreview ? (
        <Stack
          className={mergeStyles(localVideoTileWithControlsContainerStyle(theme, localVideoSizeRem), {
            boxShadow: theme.effects.elevation8,
            zIndex: LOCAL_VIDEO_TILE_ZINDEX
          })}
        >
          {localVideoComponent}
        </Stack>
      ) : overflowGalleryTiles.length > 0 || screenShareComponent ? (
        <Stack
          className={mergeStyles(
            localVideoTileContainerStyle(theme, localVideoSizeRem, !!screenShareComponent, overflowGalleryPosition)
          )}
        >
          {localVideoComponent}
        </Stack>
      ) : (
        <FloatingLocalVideo
          localVideoComponent={localVideoComponent}
          layerHostId={layerHostId}
          localVideoSizeRem={localVideoSizeRem}
          parentWidth={parentWidth}
          parentHeight={parentHeight}
        />
      )
    ) : undefined;

  const overflowGallery = useMemo(() => {
    if (overflowGalleryTiles.length === 0 && !screenShareComponent) {
      return null;
    }
    return (
      <OverflowGallery
        isShort={isShort}
        onFetchTilesToRender={setIndexesToRender}
        isNarrow={isNarrow}
        shouldFloatLocalVideo={!!localVideoComponent}
        overflowGalleryElements={overflowGalleryTiles}
        horizontalGalleryStyles={styles?.horizontalGallery}
        verticalGalleryStyles={styles?.verticalGallery}
        overflowGalleryPosition={overflowGalleryPosition}
        onChildrenPerPageChange={(n: number) => {
          childrenPerPage.current = n;
        }}
        parentWidth={parentWidth}
      />
    );
  }, [
    isNarrow,
    isShort,
    screenShareComponent,
    overflowGalleryTiles,
    styles?.horizontalGallery,
    overflowGalleryPosition,
    setIndexesToRender,
    styles?.verticalGallery,
    parentWidth,
    localVideoComponent
  ]);

  return (
    <Stack styles={rootLayoutStyle}>
      <Stack
        horizontal={overflowGalleryPosition === 'verticalRight'}
        styles={innerLayoutStyle}
        tokens={videoGalleryLayoutGap}
      >
        {props.overflowGalleryPosition === 'horizontalTop' ? overflowGallery : <></>}
        {screenShareComponent ? (
          screenShareComponent
        ) : (
          <GridLayout key="grid-layout" styles={styles?.gridLayout}>
            {gridTiles}
          </GridLayout>
        )}
        {overflowGalleryTrampoline(overflowGallery, props.overflowGalleryPosition)}
      </Stack>
      <LayerHost id={layerHostId} className={mergeStyles(layerHostStyle)} />
      {wrappedLocalVideoComponent}
    </Stack>
  );
};

const overflowGalleryTrampoline = (
  gallery: JSX.Element | null,
  galleryPosition?: 'horizontalBottom' | 'verticalRight' | 'horizontalTop'
): JSX.Element | null => {
  return galleryPosition !== 'horizontalTop' ? gallery : <></>;
};
