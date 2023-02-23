// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { GridLayout } from '../GridLayout';
import { isNarrowWidth } from '../utils/responsive';
import { LayoutProps } from './Layout';
/* @conditional-compile-remove(pinned-participants) */
import { ScrollableHorizontalGallery } from './ScrollableHorizontalGallery';
import { rootLayoutStyle } from './styles/DefaultLayout.styles';
import { videoGalleryLayoutGap } from './styles/Layout.styles';
import { useOrganizedParticipants } from './utils/videoGalleryLayoutUtils';
import { VideoGalleryResponsiveHorizontalGallery } from './VideoGalleryResponsiveHorizontalGallery';

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
    /* @conditional-compile-remove(pinned-participants) */ pinnedParticipantUserIds
  } = props;

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

  const horizontalGalleryTiles = horizontalGalleryParticipants.map((p) => {
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

  const horizontalGallery = useMemo(() => {
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
      />
    );
  }, [isNarrow, horizontalGalleryTiles, styles?.horizontalGallery]);

  return (
    <Stack horizontal={false} styles={rootLayoutStyle} tokens={videoGalleryLayoutGap}>
      {screenShareComponent ? (
        screenShareComponent
      ) : (
        <GridLayout key="grid-layout" styles={styles?.gridLayout}>
          {gridTiles}
        </GridLayout>
      )}
      {horizontalGallery}
    </Stack>
  );
};
