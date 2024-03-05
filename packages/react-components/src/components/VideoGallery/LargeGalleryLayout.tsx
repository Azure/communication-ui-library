// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo, useRef, useState } from 'react';
import { isNarrowWidth } from '../utils/responsive';
import { isShortHeight } from '../utils/responsive';
import { LayoutProps } from './Layout';
import { OverflowGallery } from './OverflowGallery';
import { GridLayout } from '../GridLayout';
import { Stack } from '@fluentui/react';
import { useOrganizedParticipants } from './utils/videoGalleryLayoutUtils';
import { rootLayoutStyle } from './styles/DefaultLayout.styles';
import { videoGalleryLayoutGap } from './styles/Layout.styles';
import { VERTICAL_GALLERY_TILE_SIZE_REM } from './styles/VideoGalleryResponsiveVerticalGallery.styles';

/**
 * Props for {@link LargeGalleryLayout}.
 *
 * @private
 */
export type LargeGalleryProps = LayoutProps;

const DEFAULT_CHILDREN_PER_PAGE = 5;
const REM_TO_PIXEL = 16;
const LARGE_GALLERY_PARTICIPANT_CAP = 48;
/**
 * VideoGallery Layout for when user is in a large meeting and wants to see more participants
 *
 * Caps the number of tiles that a participant can see in the grid to 49, Video and Audio.
 *
 * @private
 */
export const LargeGalleryLayout = (props: LargeGalleryProps): JSX.Element => {
  const {
    remoteParticipants = [],
    localParticipant,
    dominantSpeakers,
    localVideoComponent,
    screenShareComponent,
    onRenderRemoteParticipant,
    styles,
    maxRemoteVideoStreams,
    parentWidth,
    parentHeight,
    pinnedParticipantUserIds = [],
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition = 'horizontalBottom'
  } = props;

  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;
  const isShort = parentHeight ? isShortHeight(parentHeight) : false;

  const maxStreamsTrampoline = (): number => {
    return parentWidth && parentHeight
      ? calculateMaxTilesInLargeGrid(parentWidth, parentHeight)
      : maxRemoteVideoStreams;
    return maxRemoteVideoStreams;
  };

  // This is for tracking the number of children in the first page of overflow gallery.
  // This number will be used for the maxOverflowGalleryDominantSpeakers when organizing the remote participants.
  // We need to add the local participant to the pinned participant count so we are placing the speakers correctly.
  const childrenPerPage = useRef(DEFAULT_CHILDREN_PER_PAGE);
  const { gridParticipants, overflowGalleryParticipants } = useOrganizedParticipants({
    remoteParticipants,
    localParticipant,
    dominantSpeakers,
    maxRemoteVideoStreams: maxStreamsTrampoline(),
    isScreenShareActive: !!screenShareComponent,
    maxOverflowGalleryDominantSpeakers: screenShareComponent
      ? childrenPerPage.current - ((pinnedParticipantUserIds.length + 1) % childrenPerPage.current)
      : childrenPerPage.current,
    pinnedParticipantUserIds,
    /* @conditional-compile-remove(large-gallery) */ layout: 'largeGallery'
  });
  let activeVideoStreams = 0;

  let gridTiles = gridParticipants.map((p) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
        ? p.videoStream?.isAvailable && activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  /**
   * instantiate indexes available to render with indexes available that would be on first page
   *
   * For some components which do not strictly follow the order of the array, we might
   * re-render the initial tiles -> dispose them -> create new tiles, we need to take care of
   * this case when those components are here
   */
  const [indexesToRender, setIndexesToRender] = useState<number[]>([]);

  let overflowGalleryTiles = overflowGalleryParticipants.map((p, i) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
        ? p.videoStream?.isAvailable && indexesToRender.includes(i) && activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  if (localVideoComponent) {
    if (screenShareComponent) {
      overflowGalleryTiles = [localVideoComponent].concat(overflowGalleryTiles);
    } else {
      gridTiles = [localVideoComponent].concat(gridTiles);
    }
  }

  const overflowGallery = useMemo(() => {
    if (overflowGalleryTiles.length === 0) {
      return null;
    }
    return (
      <OverflowGallery
        isNarrow={isNarrow}
        isShort={isShort}
        shouldFloatLocalVideo={false}
        overflowGalleryElements={overflowGalleryTiles}
        horizontalGalleryStyles={styles?.horizontalGallery}
        /* @conditional-compile-remove(vertical-gallery) */
        verticalGalleryStyles={styles?.verticalGallery}
        /* @conditional-compile-remove(vertical-gallery) */
        overflowGalleryPosition={overflowGalleryPosition}
        onFetchTilesToRender={setIndexesToRender}
        onChildrenPerPageChange={(n: number) => {
          childrenPerPage.current = n;
        }}
        parentWidth={parentWidth}
      />
    );
  }, [
    isNarrow,
    isShort,
    overflowGalleryTiles,
    styles?.horizontalGallery,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition,
    setIndexesToRender,
    /* @conditional-compile-remove(vertical-gallery) */ styles?.verticalGallery,
    parentWidth
  ]);

  return (
    <Stack
      /* @conditional-compile-remove(vertical-gallery) */
      horizontal={overflowGalleryPosition === 'verticalRight'}
      styles={rootLayoutStyle}
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
  );
};

const overflowGalleryTrampoline = (
  gallery: JSX.Element | null,
  galleryPosition?: 'horizontalBottom' | 'verticalRight' | 'horizontalTop'
): JSX.Element | null => {
  return galleryPosition !== 'horizontalTop' ? gallery : <></>;
  return gallery;
};

const calculateMaxTilesInLargeGrid = (parentWidth: number, parentHeight: number): number => {
  const xAxisTiles = Math.floor(parentWidth / (VERTICAL_GALLERY_TILE_SIZE_REM.width * REM_TO_PIXEL));
  const yAxisTiles = Math.floor(parentHeight / (VERTICAL_GALLERY_TILE_SIZE_REM.minHeight * REM_TO_PIXEL));
  return xAxisTiles * yAxisTiles < LARGE_GALLERY_PARTICIPANT_CAP
    ? xAxisTiles * yAxisTiles
    : LARGE_GALLERY_PARTICIPANT_CAP;
};
