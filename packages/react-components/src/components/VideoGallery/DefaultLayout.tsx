// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import React, { useMemo, useState, useRef } from 'react';
import { GridLayout } from '../GridLayout';
import { isNarrowWidth } from '../utils/responsive';
import { isShortHeight } from '../utils/responsive';
import { LayoutProps } from './Layout';
import { rootLayoutStyle } from './styles/DefaultLayout.styles';
import { videoGalleryLayoutGap } from './styles/Layout.styles';
import {
  MAX_GRID_PARTICIPANTS_NOT_LARGE_GALLERY,
  renderTiles,
  useOrganizedParticipants
} from './utils/videoGalleryLayoutUtils';
import { OverflowGallery } from './OverflowGallery';

/**
 * Props for {@link DefaultLayout}.
 *
 * @private
 */
export type DefaultLayoutProps = LayoutProps;

/**
 * DefaultLayout displays remote participants, local video component, and screen sharing component in
 * a grid an overflow gallery.
 *
 * @private
 */
export const DefaultLayout = (props: DefaultLayoutProps): JSX.Element => {
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
    overflowGalleryPosition = 'horizontalBottom',
    spotlightedParticipantUserIds = []
  } = props;

  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;

  const isShort = parentHeight ? isShortHeight(parentHeight) : false;

  // This is for tracking the number of children in the first page of overflow gallery.
  // This number will be used for the maxOverflowGalleryDominantSpeakers when organizing the remote participants.
  // We need to add the local participant to the pinned participant count so we are placing the speakers correctly.
  const childrenPerPage = useRef(4);
  const remoteVideosOn = remoteParticipants.filter((p) => p.videoStream?.isAvailable).length > 0;
  const { gridParticipants, overflowGalleryParticipants } = useOrganizedParticipants({
    remoteParticipants,
    localParticipant,
    dominantSpeakers,
    maxGridParticipants: remoteVideosOn ? maxRemoteVideoStreams : MAX_GRID_PARTICIPANTS_NOT_LARGE_GALLERY,
    isScreenShareActive: !!screenShareComponent,
    maxOverflowGalleryDominantSpeakers: screenShareComponent
      ? childrenPerPage.current - ((pinnedParticipantUserIds.length + 1) % childrenPerPage.current)
      : childrenPerPage.current,
    pinnedParticipantUserIds,
    layout: 'default',
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

  let { gridTiles, overflowGalleryTiles } = renderTiles(
    gridParticipants,
    onRenderRemoteParticipant,
    maxRemoteVideoStreams,
    indexesToRender,
    overflowGalleryParticipants,
    dominantSpeakers
  );

  if (localVideoComponent) {
    if (screenShareComponent || spotlightedParticipantUserIds.length > 0) {
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
        verticalGalleryStyles={styles?.verticalGallery}
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
    overflowGalleryPosition,
    setIndexesToRender,
    styles?.verticalGallery,
    parentWidth
  ]);

  return (
    <Stack
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
};
