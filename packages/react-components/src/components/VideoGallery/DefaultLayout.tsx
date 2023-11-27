// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import React, { useMemo, useState, useRef } from 'react';
import { GridLayout } from '../GridLayout';
import { isNarrowWidth } from '../utils/responsive';
/* @conditional-compile-remove(vertical-gallery) */
import { isShortHeight } from '../utils/responsive';
import { LayoutProps } from './Layout';
import { rootLayoutStyle } from './styles/DefaultLayout.styles';
import { videoGalleryLayoutGap } from './styles/Layout.styles';
import { useOrganizedParticipants } from './utils/videoGalleryLayoutUtils';
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
    /* @conditional-compile-remove(vertical-gallery) */
    parentHeight,
    pinnedParticipantUserIds = [],
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition = 'horizontalBottom'
  } = props;

  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;

  /* @conditional-compile-remove(vertical-gallery) */
  const isShort = parentHeight ? isShortHeight(parentHeight) : false;

  // This is for tracking the number of children in the first page of overflow gallery.
  // This number will be used for the maxOverflowGalleryDominantSpeakers when organizing the remote participants.
  // We need to add the local participant to the pinned participant count so we are placing the speakers correctly.
  const childrenPerPage = useRef(4);
  const { gridParticipants, overflowGalleryParticipants } = useOrganizedParticipants({
    remoteParticipants,
    localParticipant,
    dominantSpeakers,
    maxRemoteVideoStreams,
    isScreenShareActive: !!screenShareComponent,
    maxOverflowGalleryDominantSpeakers: screenShareComponent
      ? childrenPerPage.current - ((pinnedParticipantUserIds.length + 1) % childrenPerPage.current)
      : childrenPerPage.current,
    /* @conditional-compile-remove(pinned-participants) */ pinnedParticipantUserIds,
    /* @conditional-compile-remove(gallery-layouts) */ layout: 'default'
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

  /**
   * instantiate indexes available to render with indexes available that would be on first page
   *
   * For some components which do not strictly follow the order of the array, we might
   * re-render the initial tiles -> dispose them -> create new tiles, we need to take care of
   * this case when those components are here
   */
  const [indexesToRender, setIndexesToRender] = useState<number[]>([]);

  const overflowGalleryTiles = overflowGalleryParticipants.map((p, i) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
        ? p.videoStream?.isAvailable && indexesToRender.includes(i) && activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  if (localVideoComponent) {
    gridTiles.push(localVideoComponent);
  }

  const overflowGallery = useMemo(() => {
    if (overflowGalleryTiles.length === 0) {
      return null;
    }
    return (
      <OverflowGallery
        isNarrow={isNarrow}
        /* @conditional-compile-remove(vertical-gallery) */
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
    /* @conditional-compile-remove(vertical-gallery) */ isShort,
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
      {
        /* @conditional-compile-remove(gallery-layouts) */ props.overflowGalleryPosition === 'horizontalTop' ? (
          overflowGallery
        ) : (
          <></>
        )
      }
      {screenShareComponent ? (
        screenShareComponent
      ) : (
        <GridLayout key="grid-layout" styles={styles?.gridLayout}>
          {gridTiles}
        </GridLayout>
      )}
      {overflowGalleryTrampoline(
        overflowGallery,
        /* @conditional-compile-remove(gallery-layouts) */ props.overflowGalleryPosition
      )}
    </Stack>
  );
};

const overflowGalleryTrampoline = (
  gallery: JSX.Element | null,
  galleryPosition?: 'horizontalBottom' | 'verticalRight' | 'horizontalTop'
): JSX.Element | null => {
  /* @conditional-compile-remove(gallery-layouts) */
  return galleryPosition !== 'horizontalTop' ? gallery : <></>;
  return gallery;
};
