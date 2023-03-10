// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
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
 * a grid and horizontal gallery.
 *
 * @private
 */
export const DefaultLayout = (props: DefaultLayoutProps): JSX.Element => {
  const {
    remoteParticipants = [],
    dominantSpeakers,
    localVideoComponent,
    screenShareComponent,
    onRenderRemoteParticipant,
    styles,
    maxRemoteVideoStreams,
    parentWidth,
    /* @conditional-compile-remove(vertical-gallery) */
    parentHeight,
    /* @conditional-compile-remove(pinned-participants) */ pinnedParticipantUserIds,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryLayout = 'HorizontalBottom'
  } = props;

  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;

  /* @conditional-compile-remove(vertical-gallery) */
  const isShort = parentHeight ? isShortHeight(parentHeight) : false;

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

  if (localVideoComponent) {
    gridTiles.push(localVideoComponent);
  }

  const overflowGallery = useMemo(() => {
    if (horizontalGalleryParticipants.length === 0) {
      return null;
    }
    return (
      <OverflowGallery
        isNarrow={isNarrow}
        /* @conditional-compile-remove(vertical-gallery) */
        isShort={isShort}
        shouldFloatLocalVideo={false}
        remoteParticipants={horizontalGalleryParticipants}
        onRenderRemoteParticipant={onRenderRemoteParticipant}
        maxRemoteVideoStreams={maxRemoteVideoStreams - activeVideoStreams}
        horizontalGalleryStyles={styles?.horizontalGallery}
        /* @conditional-compile-remove(vertical-gallery) */
        veritcalGalleryStyles={styles?.verticalGallery}
        /* @conditional-compile-remove(pinned-participants) */
        overflowGalleryLayout={overflowGalleryLayout}
      />
    );
  }, [
    isNarrow,
    /* @conditional-compile-remove(vertical-gallery) */ isShort,
    styles?.horizontalGallery,
    horizontalGalleryParticipants,
    onRenderRemoteParticipant,
    activeVideoStreams,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryLayout,
    /* @conditional-compile-remove(vertical-gallery) */ styles?.verticalGallery,
    maxRemoteVideoStreams
  ]);

  return (
    <Stack
      /* @conditional-compile-remove(vertical-gallery) */
      horizontal={overflowGalleryLayout === 'VerticalRight'}
      styles={rootLayoutStyle}
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
  );
};
