// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { LayerHost, Stack, mergeStyles, useTheme } from '@fluentui/react';
import { LocalVideoTileSize } from '../VideoGallery';
import { LayoutProps } from './Layout';
import { isNarrowWidth } from '../utils/responsive';
import { isShortHeight } from '../utils/responsive';
import React, { useMemo, useRef, useState } from 'react';
import { OverflowGallery } from './OverflowGallery';
import {
  SMALL_FLOATING_MODAL_SIZE_REM,
  LARGE_FLOATING_MODAL_SIZE_REM,
  localVideoTileContainerStyle
} from './styles/FloatingLocalVideo.styles';
import {
  VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM,
  SHORT_VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM
} from './styles/FloatingLocalVideo.styles';
import { renderTiles, useOrganizedParticipants } from './utils/videoGalleryLayoutUtils';
import { GridLayout } from '../GridLayout';
import { rootLayoutStyle } from './styles/FloatingLocalVideoLayout.styles';
import { layerHostStyle, innerLayoutStyle } from './styles/FloatingLocalVideoLayout.styles';
import { videoGalleryLayoutGap } from './styles/Layout.styles';
import { useId } from '@fluentui/react-hooks';

/**
 * Props for {@link SpeakerVideoLayout}.
 *
 * @private
 */
export interface SpeakerVideoLayoutProps extends LayoutProps {
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
 * Layout for the gallery mode to highlight the current dominant speaker
 *
 * @private
 */
export const SpeakerVideoLayout = (props: SpeakerVideoLayoutProps): JSX.Element => {
  const {
    remoteParticipants = [],
    dominantSpeakers,
    localVideoComponent,
    screenShareComponent,
    onRenderRemoteParticipant,
    styles,
    maxRemoteVideoStreams,
    parentWidth,
    parentHeight,
    overflowGalleryPosition = 'horizontalBottom',
    pinnedParticipantUserIds = [],
    localVideoTileSize
  } = props;

  const theme = useTheme();

  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;

  const isShort = parentHeight ? isShortHeight(parentHeight) : false;

  // This is for tracking the number of children in the first page of overflow gallery.
  // This number will be used for the maxOverflowGalleryDominantSpeakers when organizing the remote participants.
  const childrenPerPage = useRef(4);
  const { gridParticipants, overflowGalleryParticipants } = useOrganizedParticipants({
    remoteParticipants,
    dominantSpeakers,
    maxGridParticipants: maxRemoteVideoStreams,
    isScreenShareActive: !!screenShareComponent,
    maxOverflowGalleryDominantSpeakers: screenShareComponent
      ? childrenPerPage.current - (pinnedParticipantUserIds.length % childrenPerPage.current)
      : childrenPerPage.current,
    pinnedParticipantUserIds,
    layout: 'speaker'
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
    if (isNarrow || localVideoTileSize === '9:16') {
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
    localVideoComponent || (screenShareComponent && localVideoComponent) ? (
      <Stack
        className={mergeStyles(
          localVideoTileContainerStyle(theme, localVideoSizeRem, !!screenShareComponent, overflowGalleryPosition)
        )}
      >
        {localVideoComponent}
      </Stack>
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
      {wrappedLocalVideoComponent}
      <LayerHost id={layerHostId} className={mergeStyles(layerHostStyle)} />
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
    </Stack>
  );
};

const overflowGalleryTrampoline = (
  gallery: JSX.Element | null,
  galleryPosition?: 'horizontalBottom' | 'verticalRight' | 'horizontalTop'
): JSX.Element | null => {
  return galleryPosition !== 'horizontalTop' ? gallery : <></>;
  return gallery;
};
